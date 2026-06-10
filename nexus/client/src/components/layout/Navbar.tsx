import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { NAV_LINKS, APP_NAME } from '@/constants'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-white/5 bg-background/80 backdrop-blur-2xl'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/no-logo.png"
            alt="logo"
            className="h-8 w-8 rounded-lg object-cover border border-white/10 shadow-md"
          />

          <span className="text-lg font-bold font-[Syne]">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button onClick={() => navigate('/dashboard')} variant="glow" size="sm">
              Dashboard
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} variant="ghost" size="sm">
                Sign in
              </Button>
              <Button onClick={() => navigate('/signup')} variant="glow" size="sm">
                Get started free
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-white/5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-background/95 backdrop-blur-2xl"
          >
            <div className="p-4 space-y-2">

              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center px-4 py-3 text-sm text-muted-foreground hover:text-foreground rounded-xl hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              <div className="pt-3 flex flex-col gap-2 border-t border-white/5">

                {isAuthenticated ? (
                  <Button onClick={() => navigate('/dashboard')} variant="glow" className="w-full">
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                      Sign in
                    </Button>
                    <Button onClick={() => navigate('/signup')} variant="glow" className="w-full">
                      Get started free
                    </Button>
                  </>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}