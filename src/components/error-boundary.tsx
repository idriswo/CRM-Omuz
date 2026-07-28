import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

/**
 * Keeps one broken screen from blanking the whole app: a render error inside the
 * routed page is caught here, the sidebar and topbar stay usable, and the user
 * gets a retry instead of a white page. `resetKey` (the current pathname) clears
 * the error automatically once they navigate somewhere else.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode; resetKey?: string },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidUpdate(prevProps: { resetKey?: string }) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Page crashed:", error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <Card className="mx-auto mt-10 max-w-lg items-start gap-4">
        <span className="flex items-center gap-3 text-lg font-semibold">
          <AlertTriangle className="size-5 text-destructive" />
          This page could not be displayed
        </span>
        <p className="text-sm text-muted-foreground">
          Something in the data for this screen was not what the page expected. The rest of the app
          still works — try again, or open another page.
        </p>
        <p className="w-full overflow-x-auto rounded-lg bg-muted p-3 font-mono text-xs">
          {this.state.error.message}
        </p>
        <Button onClick={() => this.setState({ error: null })}>Try again</Button>
      </Card>
    )
  }
}
