import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play, Star, Zap } from 'lucide-react'
import { GlowButton } from '@/components/shared/GlowButton'
import { Badge } from '@/components/ui/badge'

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 10 + 10,
  delay: Math.random() * 5,
}))

export function Hero() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Animated blobs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-nexus-500/8 blur-[120px] animate-blob" />
      <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-purple-500/8 blur-[100px] animate-blob [animation-delay:2s]" />
      <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-cyan-500/5 blur-[100px] animate-blob [animation-delay:4s]" />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-nexus-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
        />
      ))}

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <div className="flex items-center gap-2 rounded-full border border-nexus-500/30 bg-nexus-500/10 px-4 py-1.5 text-sm text-nexus-400 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            <span>Introducing Nexus 2.0 — AI-powered workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          Build faster.{' '}
          <span className="text-gradient">Scale smarter.</span>
          <br />
          Grow together.
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          The all-in-one AI-powered platform for modern teams. Manage projects, track analytics,
          and collaborate at scale — beautifully.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <GlowButton size="lg" onClick={() => navigate('/signup')} className="w-full sm:w-auto">
            Start for free
            <ArrowRight className="h-4 w-4 ml-1" />
          </GlowButton>
          <GlowButton size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
              <Play className="h-3 w-3" fill="currentColor" />
            </div>
            Watch demo
          </GlowButton>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {['#6366f1', '#a855f7', '#06b6d4', '#ec4899'].map((color, i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full border-2 border-background ring-1 ring-white/10"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
                />
              ))}
            </div>
            <span>Join <strong className="text-foreground">50,000+</strong> teams</span>
          </div>
          <div className="h-px w-px sm:h-4 sm:w-px bg-white/10" />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-1"><strong className="text-foreground">4.9/5</strong> from 2,000+ reviews</span>
          </div>
          <div className="h-px w-px sm:h-4 sm:w-px bg-white/10" />
          <span>No credit card required</span>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 relative mx-auto max-w-4xl"
        >
          {/* Glow below the card */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-40 w-3/4 bg-nexus-500/20 blur-3xl rounded-full" />

          <div className="relative rounded-2xl border border-white/10 bg-[#0d0d1a] overflow-hidden shadow-2xl shadow-black/50">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => (
                  <div key={i} className="h-3 w-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="flex-1 mx-4 h-5 rounded-md bg-white/5 flex items-center px-2">
                <span className="text-xs text-muted-foreground">app.nexus.ai/dashboard</span>
              </div>
            </div>

            {/* Dashboard preview content */}
            <div className="p-4 space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Revenue', value: '$48.2K', change: '+12%', color: 'text-nexus-400' },
                  { label: 'Users',   value: '12,431', change: '+8%',  color: 'text-purple-400' },
                  { label: 'Projects',value: '94',     change: '+3%',  color: 'text-cyan-400' },
                  { label: 'Growth',  value: '24%',    change: '+5%',  color: 'text-green-400' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-green-400">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 h-32 flex items-end gap-1.5">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
                    className="flex-1 rounded-sm"
                    style={{ background: `linear-gradient(to top, #6366f1, #a855f7)`, opacity: 0.6 + (i / 12) * 0.4 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
