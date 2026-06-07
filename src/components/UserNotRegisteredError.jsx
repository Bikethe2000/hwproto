import { Link } from 'react-router-dom'

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full rounded-3xl border border-border bg-card p-10 shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">Account not registered</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Your account exists, but it is not registered for access yet. If you believe this is an error, please contact support or sign in with a different account.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/login" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            Go to login
          </Link>
          <Link to="/" className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
