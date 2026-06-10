import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  BarChart3, Brain, Shield, Zap, Globe, Users,
  Lock, Rocket, Cpu, Layers
} from 'lucide-react'
import { staggerContainer, staggerItem } from '@/animations/variants'

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Analytics',
    description: 'Leverage machine learning to uncover insights, predict trends, and make data-driven decisions automatically.',
    color: 'from-nexus-500/20 to-purple-500/20',
    iconColor: 'text-nexus-400',
  },
  {
    icon: Zap,
    title: 'Lightning Performance',
    description: 'Blazing-fast platform with sub-100ms response times, CDN optimization, and edge computing built in.',
    color: 'from-yellow-500/20 to-orange-500/20',
    iconColor: 'text-yellow-400',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC2 compliant, end-to-end encryption, SSO/SAML, role-based access, and full audit trails.',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400',
  },
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Work together with live cursors, instant updates, threaded comments, and smart notifications.',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Globe,
    title: 'Global Infrastructure',
    description: '99.99% uptime SLA with 18 data centers worldwide, automatic failover, and DDoS protection.',
    color: 'from-cyan-500/20 to-teal-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Layers,
    title: '200+ Integrations',
    description: 'Connect your favorite tools — Slack, Jira, GitHub, Salesforce, and hundreds more with one click.',
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
  },
  {
    icon: BarChart3,
    title: 'Advanced Reporting',
    description: 'Custom dashboards, scheduled reports, exportable data, and white-label analytics for clients.',
    color: 'from-purple-500/20 to-nexus-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Rocket,
    title: 'Instant Deployment',
    description: 'One-click deployments, auto-scaling, canary releases, and rollback in seconds — zero downtime.',
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-400',
  },
  {
    icon: Cpu,
    title: 'API-First Design',
    description: 'Comprehensive REST & GraphQL APIs, webhooks, SDKs for 15+ languages, and a full developer hub.',
    color: 'from-teal-500/20 to-green-500/20',
    iconColor: 'text-teal-400',
  },
]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-500/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block mb-4 rounded-full border border-nexus-500/30 bg-nexus-500/10 px-4 py-1.5 text-sm text-nexus-400">
            Everything you need
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Built for{' '}
            <span className="text-gradient">modern teams</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From startup to enterprise — Nexus grows with you. Every feature designed to
            amplify your team's productivity and performance.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} border border-white/10`}>
                    <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
