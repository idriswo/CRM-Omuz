import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, Crown, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar } from "@/components/shared/avatar"
import { SearchInput } from "@/components/shared/search-input"
import { useGetLeaderWinnersQuery, useGetLeadersQuery, type Leader } from "@/store/services"

/** Podium order: silver on the left, gold raised in the middle, bronze on the right. */
const podium = [
  { index: 1, ring: "#22c55e", tint: "bg-success/10", raised: false, crown: false },
  { index: 0, ring: "#4c3ce8", tint: "bg-primary/10", raised: true, crown: true },
  { index: 2, ring: "#fa541c", tint: "bg-orange-500/10", raised: false, crown: false },
]

function PodiumCard({
  leader,
  ring,
  tint,
  raised,
  crown,
}: {
  leader: Leader
  ring: string
  tint: string
  raised: boolean
  crown: boolean
}) {
  return (
    <Card
      className={cn(
        "items-center justify-center gap-2 border-0 py-6 text-center",
        tint,
        raised && "-mt-8"
      )}
    >
      <span className="relative">
        {/* Ring colour is per-rank data rather than a theme token, so it stays inline. */}
        <Avatar
          src={leader.photo}
          alt={leader.full_name}
          className="size-16"
          style={{ boxShadow: `0 0 0 3px var(--color-card), 0 0 0 5px ${ring}` }}
        />
        <span
          className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-white"
          style={{ background: ring }}
        >
          {crown ? <Crown className="size-3" /> : <Star className="size-3" />}
          {leader.points}
        </span>
      </span>
      <p className="mt-3 text-xs text-muted-foreground">{leader.phone}</p>
      <p className="font-bold">{leader.full_name}</p>
      <span className="rounded-full bg-card px-3 py-1 text-xs font-medium">{leader.group}</span>
    </Card>
  )
}

export function LeadersPage() {
  const [search, setSearch] = useState("")
  const { data, isLoading } = useGetLeadersQuery({ search, limit: 20 })
  const { data: winners } = useGetLeaderWinnersQuery()

  const leaders = data?.data ?? []
  const top3 = leaders.slice(0, 3)
  const rest = leaders.slice(3)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Leaders</h1>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <div className="flex min-w-0 flex-col gap-6">
          {top3.length === 3 && (
            <div className="grid grid-cols-3 items-stretch gap-4 pt-8">
              {podium.map((slot) => (
                <PodiumCard
                  key={slot.index}
                  leader={top3[slot.index]}
                  ring={slot.ring}
                  tint={slot.tint}
                  raised={slot.raised}
                  crown={slot.crown}
                />
              ))}
            </div>
          )}

          <SearchInput value={search} onChange={setSearch} placeholder="Search by name" />

          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full name</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Group</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {rest.map((leader) => (
                  <TableRow key={leader.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar src={leader.photo} alt={leader.full_name} className="size-9" />
                        <span className="font-medium">{leader.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">
                        {leader.points}
                      </span>
                    </TableCell>
                    <TableCell>{leader.phone}</TableCell>
                    <TableCell>
                      <Button variant="link" className="h-auto p-0" asChild>
                        <Link to="/groups">
                          {leader.group} <ChevronRight className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <Card className="h-fit min-w-0 gap-4 p-0">
          <h2 className="flex items-center gap-2 px-6 pt-6 text-xl font-bold">
            <Crown className="size-5" /> Winners of the last month
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full name</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {winners?.data?.map((winner) => (
                <TableRow key={winner.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={winner.photo} alt={winner.full_name} className="size-9" />
                      <div>
                        <p className="font-medium">{winner.full_name}</p>
                        <p className="text-sm text-primary">{winner.age} year</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{winner.points}</TableCell>
                  <TableCell className="text-muted-foreground">{winner.group}</TableCell>
                  <TableCell className="text-muted-foreground">{winner.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label="Open winner">
                      <ChevronRight className="size-4 text-primary" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
