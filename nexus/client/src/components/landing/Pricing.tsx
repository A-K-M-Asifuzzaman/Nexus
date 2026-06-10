import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'
import { PLANS } from '@/constants'
import { cn } from '@/lib/utils'
import { GlowButton } from '@/components/shared/GlowButton'
import { Badge } from '@/components/ui/badge'

export function Pricing() {
  const [yearly, setYearly] = useState(false)
  const navigate = useNavigate()
  const entries = Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]

  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 rounded-full border border-nexus-500/30 bg-nexus-500/10 px-4 py-1.5 text-sm text-nexus-400">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Choose the plan that fits your team. Upgrade or downgrade anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5">
            <button
              onClick={() => setYearly(false)}
              className={cn('rounded-full px-5 py-1.5 text-sm font-medium transition-all', !yearly ? 'bg-nexus-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground')}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn('rounded-full px-5 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5', yearly ? 'bg-nexus-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground')}
            >
              Yearly
              <span className="text-xs bg-green-500/20 text-green-400 rounded-full px-1.5 py-0.5">-20%</span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {entries.map(([key, plan], i) => {
            const isPro = key === 'pro'
            const price = yearly ? plan.price.yearly : plan.price.monthly

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className={cn(
                  'relative rounded-2xl border p-8 flex flex-col',
                  isPro
                    ? 'border-nexus-500/40 bg-gradient-to-b from-nexus-500/10 to-transparent shadow-2xl shadow-nexus-500/10'
                    : 'border-white/10 bg-white/[0.02]'
                )}
              >
                {isPro && (
                  <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-500 to-transparent" />
                )}
                {plan.badge && (
                  <span className={cn(
                    'absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-0.5 text-xs font-semibold',
                    isPro ? 'bg-nexus-500 text-white' : 'bg-white/10 text-white border border-white/20'
                  )}>
                    {plan.badge}
                  </span>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      isPro ? 'bg-nexus-500/20 text-nexus-400' : 'bg-white/5 text-muted-foreground'
                    )}>
                      <Zap className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-muted-foreground">/{yearly ? 'yr' : 'mo'}</span>
                  </div>
                  {yearly && price > 0 && (
                    <p className="text-xs text-green-400 mt-1">
                      Save ${(plan.price.monthly * 12 - plan.price.yearly)} per year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className={cn(
                        'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                        isPro ? 'bg-nexus-500/20 text-nexus-400' : 'bg-white/5 text-muted-foreground'
                      )}>
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <GlowButton
                  variant={isPro ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => navigate(key === 'free' ? '/signup' : `/signup?plan=${key}&interval=${yearly ? 'yearly' : 'monthly'}`)}
                >
                  {key === 'free' ? 'Get started free' : `Start ${plan.name}`}
                </GlowButton>
              </motion.div>
            )
          })}
        </div>

        {/* Enterprise add-on */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h4 className="font-semibold mb-1">Need something custom?</h4>
            <p className="text-sm text-muted-foreground">
              Custom contracts, volume discounts, on-premise options, and dedicated engineering support.
            </p>
          </div>
          <GlowButton variant="secondary" className="shrink-0">
            Contact sales
          </GlowButton>
        </motion.div>
      </div>
    </section>
  )
}
