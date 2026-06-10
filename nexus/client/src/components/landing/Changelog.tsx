import { motion } from 'framer-motion'
import { CheckCircle2, Zap, Bug, Star } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/animations/variants'

const ENTRIES = [
  {
    version: 'v2.4.0',
    date:    'Jun 5, 2026',
    badge:   'New',
    color:   '#22c55e',
    icon:    Star,
    changes: [
      { type: 'new',  text: 'Kanban board view for all projects' },
      { type: 'new',  text: 'Task priority levels: Low, Medium, High' },
      { type: 'new',  text: 'Project detail page with progress tracking' },
      { type: 'new',  text: 'Team invitations via email' },
    ],
  },
  {
    version: 'v2.3.0',
    date:    'May 20, 2026',
    badge:   'Feature',
    color:   '#6366f1',
    icon:    Zap,
    changes: [
      { type: 'new',  text: 'Dark / Light theme toggle with persistence' },
      { type: 'new',  text: 'Real-time analytics dashboard' },
      { type: 'fix',  text: 'Fixed Firebase Google popup COOP header issue' },
      { type: 'impr', text: 'Improved onboarding checklist — now interactive' },
    ],
  },
  {
    version: 'v2.2.0',
    date:    'May 5, 2026',
    badge:   'Fix',
    color:   '#f97316',
    icon:    Bug,
    changes: [
      { type: 'fix',  text: 'Fixed 500 error on Google Sign-In with empty Stripe key' },
      { type: 'fix',  text: 'MongoDB connection now targets named database' },
      { type: 'impr', text: 'Auth retry logic — up to 3 retries on server restart' },
      { type: 'impr', text: 'Better error messages for all Firebase auth codes' },
    ],
  },
]

const TYPE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  new:  { label: 'New',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  fix:  { label: 'Fix',      color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  impr: { label: 'Improved', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
}

export function Changelog() {
  return (
    <section id="changelog" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-nexus-500/30 bg-nexus-500/10 px-4 py-1.5 text-xs font-medium text-nexus-400 mb-4">
            Changelog
          </span>
          <h2 className="text-4xl font-bold">
            What's <span className="text-gradient">new</span>
          </h2>
          <p className="text-muted-foreground mt-3">Every update, improvement, and fix — in one place.</p>
        </div>

        {/* Timeline */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="relative"
        >
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />

          <div className="space-y-10">
            {ENTRIES.map(entry => {
              const Icon = entry.icon
              return (
                <motion.div key={entry.version} variants={staggerItem} className="relative pl-16">
                  {/* Icon dot */}
                  <div
                    className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10"
                    style={{ background: `${entry.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: entry.color }} />
                  </div>

                  {/* Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-base font-bold">{entry.version}</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: entry.color, background: `${entry.color}15` }}
                      >
                        {entry.badge}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">{entry.date}</span>
                    </div>
                    <ul className="space-y-2">
                      {entry.changes.map((c, i) => {
                        const tb = TYPE_BADGE[c.type]
                        return (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <span
                              className="mt-0.5 shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded"
                              style={{ color: tb.color, background: tb.bg }}
                            >
                              {tb.label}
                            </span>
                            <span className="text-muted-foreground">{c.text}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
