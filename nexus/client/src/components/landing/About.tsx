import { motion } from 'framer-motion'
import { Target, Users2, Zap, Globe } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '@/animations/variants'

const STATS = [
  { value: '50K+', label: 'Teams worldwide' },
  { value: '2M+',  label: 'Tasks completed' },
  { value: '99.9%',label: 'Uptime SLA' },
  { value: '4.9★', label: 'Average rating' },
]

const VALUES = [
  { icon: Target,  title: 'Built for focus',     desc: 'Every feature is designed to reduce noise and help teams do their best work — nothing more, nothing less.' },
  { icon: Users2,  title: 'Team-first design',   desc: 'We believe great software disappears into the background and lets people collaborate naturally.' },
  { icon: Zap,     title: 'Speed is a feature',  desc: 'Sub-100ms interactions, instant search, and real-time sync. Slowness is never acceptable.' },
  { icon: Globe,   title: 'Built in the open',   desc: 'Transparent roadmap, public changelog, and a community that shapes the product direction.' },
]

export function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-40" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-nexus-500/30 bg-nexus-500/10 px-4 py-1.5 text-xs font-medium text-nexus-400 mb-4">
            About Nexus
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            We're on a mission to<br />
            <span className="text-gradient">eliminate project chaos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nexus was built by a team tired of switching between five tools to manage one project.
            We combined everything into one fast, beautiful, and powerful workspace.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-24"
        >
          {STATS.map(stat => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="text-center rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-3xl font-bold text-gradient mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {VALUES.map(v => {
            const Icon = v.icon
            return (
              <motion.div
                key={v.title}
                variants={staggerItem}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-nexus-500/10">
                  <Icon className="h-5 w-5 text-nexus-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
