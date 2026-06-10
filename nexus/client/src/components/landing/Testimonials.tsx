import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { staggerContainer, staggerItem } from '@/animations/variants'
import { getInitials } from '@/lib/utils'

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'CTO, Veritas Labs',
    text: "Nexus transformed how our engineering team operates. The AI insights alone saved us 20+ hours per week. Absolutely game-changing.",
    rating: 5,
    gradient: 'from-nexus-500 to-purple-600',
  },
  {
    name: 'Marcus Williams',
    role: 'Founder, Luminary',
    text: "We evaluated 12 platforms. Nexus won on every dimension — UI, performance, and enterprise features. Our investors were blown away by our dashboards.",
    rating: 5,
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Priya Patel',
    role: 'VP Product, Orion Health',
    text: "From onboarding to full deployment in 2 days. The Stripe integration is flawless and the analytics have given us clarity we never had before.",
    rating: 5,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'James Rodriguez',
    role: 'Engineering Lead, Apex',
    text: "The performance benchmarks are real. Sub-100ms everywhere, beautiful dark UI, and the best developer experience in the market.",
    rating: 5,
    gradient: 'from-orange-500 to-rose-600',
  },
  {
    name: 'Emma Larsson',
    role: 'COO, DataPulse',
    text: "After switching to Nexus, our team velocity increased by 40%. The project management and collaboration tools are genuinely best-in-class.",
    rating: 5,
    gradient: 'from-green-500 to-teal-600',
  },
  {
    name: 'Alex Thompson',
    role: 'CEO, Cloudshift',
    text: "Nexus is what modern SaaS should look like. Stunning UI, fast APIs, and enterprise security out of the box. Our enterprise clients love it.",
    rating: 5,
    gradient: 'from-yellow-500 to-amber-600',
  },
]

export function Testimonials() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 rounded-full border border-nexus-500/30 bg-nexus-500/10 px-4 py-1.5 text-sm text-nexus-400">
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Loved by <span className="text-gradient">50,000+ teams</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Don't just take our word for it — here's what teams building with Nexus have to say.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
            >
              <Quote className="h-6 w-6 text-nexus-400/40 mb-4" />
              <div className="flex mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback
                    style={{ background: `linear-gradient(135deg, ${t.gradient.includes('nexus') ? '#6366f1' : t.gradient.split(' ')[1].replace('to-', '')}, ${t.gradient.split(' ')[3] || '#a855f7'})` }}
                    className="text-xs text-white"
                  >
                    {getInitials(t.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
