import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Twitter, Github, Linkedin, Youtube } from 'lucide-react'
import { APP_NAME } from '@/constants'

const FOOTER_LINKS = {
  Product:   ['Features', 'Pricing', 'Changelog', 'Roadmap', 'Status'],
  Company:   ['About', 'Blog', 'Careers', 'Press', 'Partners'],
  Resources: ['Docs', 'API Reference', 'Community', 'Support', 'Tutorials'],
  Legal:     ['Privacy', 'Terms', 'Security', 'Cookies', 'GDPR'],
}

const SOCIAL = [
  { icon: Twitter,  href: '#', label: 'Twitter' },
  { icon: Github,   href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube,  href: '#', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-background">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-nexus-500 to-purple-600">
                <Zap className="h-4 w-4 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold font-[Syne]">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              The AI-powered SaaS platform for modern teams. Build, scale, and grow with confidence.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{cat}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
