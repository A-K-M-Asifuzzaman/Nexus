import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function LandingLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Outlet />
    </div>
  )
}
