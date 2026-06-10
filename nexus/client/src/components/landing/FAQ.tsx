import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQS = [
  {
    q: 'Can I start with the free plan and upgrade later?',
    a: 'Absolutely. Start free with up to 3 projects and 1 team member. Upgrade to Pro or Enterprise anytime — all your data migrates instantly.',
  },
  {
    q: 'How does the 14-day free trial work?',
    a: 'Every paid plan includes a 14-day free trial with full access. No credit card required. If you decide not to continue, your account reverts to free automatically.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Nexus is SOC2 Type II certified, uses AES-256 encryption at rest and TLS 1.3 in transit. We have zero access to your data, and offer EU data residency on Enterprise.',
  },
  {
    q: 'Do you offer custom contracts or annual billing?',
    a: 'Yes — annual billing saves 20% and we can offer custom contracts, invoicing, and volume discounts for teams of 50+. Contact our sales team.',
  },
  {
    q: 'What integrations are available?',
    a: 'We support 200+ native integrations including Slack, GitHub, Jira, Salesforce, HubSpot, Zapier, and more. Our REST & GraphQL APIs allow you to build custom integrations too.',
  },
  {
    q: 'Can I export or own my data?',
    a: 'Yes. You can export all your data at any time in JSON, CSV, or SQL formats. Your data belongs to you — always.',
  },
  {
    q: 'What is your SLA / uptime guarantee?',
    a: 'We guarantee 99.99% uptime on Enterprise plans with a financial SLA. Our public status page shows real-time and historical uptime at status.nexus.ai.',
  },
]

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 rounded-full border border-nexus-500/30 bg-nexus-500/10 px-4 py-1.5 text-sm text-nexus-400">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Common <span className="text-gradient">questions</span>
          </h2>
          <p className="text-muted-foreground">Everything you need to know before getting started.</p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-medium pr-4">{faq.q}</span>
                <div className="shrink-0 text-muted-foreground">
                  {openIdx === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
