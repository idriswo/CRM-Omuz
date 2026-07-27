import dns from 'node:dns/promises'
import net from 'node:net'
import tls from 'node:tls'
import type { LookupFunction } from 'node:net'

/**
 * The backend is behind Cloudflare and resolves to several IPs. From some
 * networks only a subset of them is actually reachable — the rest either time
 * out or get their TLS handshake cut, which surfaces as ERR_CONNECTION_CLOSED
 * in the browser and "socket disconnected before secure TLS" in Node. Node's
 * built-in happy-eyeballs only alternates between IPv6 and IPv4, so when every
 * address is IPv4 it just takes the first one and gives up if it fails.
 *
 * This lookup probes all resolved addresses in parallel and hands back the
 * first one that accepts a TCP connection, so a dead IP is skipped instead of
 * killing the request.
 */

const PROBE_TIMEOUT = 4000

/** hostname -> address known to accept connections, so we probe only once. */
const reachableAddresses = new Map<string, string>()

/**
 * Probes with a full TLS handshake rather than a bare TCP connect: the dead
 * addresses still answer the SYN and only drop the connection once the
 * ClientHello goes out, so a TCP-level probe happily picks one of them.
 */
function probe(address: string, port: number, servername: string) {
  return new Promise<string>((resolve, reject) => {
    const socket = tls.connect({ host: address, port, servername, timeout: PROBE_TIMEOUT }, () => {
      socket.destroy()
      resolve(address)
    })
    socket.once('timeout', () => {
      socket.destroy()
      reject(new Error(`${address}:${port} timed out`))
    })
    socket.once('error', (error) => {
      socket.destroy()
      reject(error)
    })
  })
}

export function reachableLookup(port: number): LookupFunction {
  return (hostname, options, callback) => {
    // `options` is a number when the caller passes a bare family argument.
    const wantsAll = typeof options === 'object' && options !== null && options.all === true

    const done = (address: string) => {
      const family = net.isIPv6(address) ? 6 : 4
      if (wantsAll) callback(null, [{ address, family }])
      else callback(null, address, family)
    }

    const cached = reachableAddresses.get(hostname)
    if (cached) {
      done(cached)
      return
    }

    dns
      .lookup(hostname, { all: true })
      .then((addresses) => Promise.any(addresses.map(({ address }) => probe(address, port, hostname))))
      .then((address) => {
        reachableAddresses.set(hostname, address)
        done(address)
      })
      .catch((error: Error) => {
        callback(error as NodeJS.ErrnoException, '', 0)
      })
  }
}
