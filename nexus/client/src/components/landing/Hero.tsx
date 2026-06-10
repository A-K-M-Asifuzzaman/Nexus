import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play, Star, Zap } from 'lucide-react'
import { GlowButton } from '@/components/shared/GlowButton'

export function Hero() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Static blobs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-nexus-500/8 blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-purple-500/8 blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-cyan-500/5 blur-[100px]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2 rounded-full border border-nexus-500/30 bg-nexus-500/10 px-4 py-1.5 text-sm text-nexus-400 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            <span>Introducing Nexus 2.0 — AI-powered workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          Build faster.{' '}
          <span className="text-gradient">Scale smarter.</span>
          <br />
          Grow together.
        </h1>

        {/* Sub */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          The all-in-one AI-powered platform for modern teams. Manage projects, track analytics,
          and collaborate at scale — beautifully.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
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
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
            {[
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
].map((src, i) => (
  <img
    key={i}
    src={src}
    alt="team member"
    className="h-7 w-7 rounded-full border-2 border-background ring-1 ring-white/10 object-cover"
  />
))}
            </div>
            <span>
              Join <strong className="text-foreground">50,000+</strong> teams
            </span>
          </div>

          <div className="h-px w-px sm:h-4 sm:w-px bg-white/10" />

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-1">
              <strong className="text-foreground">4.9/5</strong> from 2,000+ reviews
            </span>
          </div>

          <div className="h-px w-px sm:h-4 sm:w-px bg-white/10" />

          <span>No credit card required</span>
        </div>

        {/* Dashboard preview (static) */}
        <div className="mt-16 relative mx-auto max-w-4xl">
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
                <span className="text-xs text-muted-foreground">
                  app.nexus.ai/dashboard
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Revenue', value: '$48.2K', change: '+12%', color: 'text-nexus-400' },
                  { label: 'Users', value: '12,431', change: '+8%', color: 'text-purple-400' },
                  { label: 'Projects', value: '94', change: '+3%', color: 'text-cyan-400' },
                  { label: 'Growth', value: '24%', change: '+5%', color: 'text-green-400' },
                ].map(stat => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white/[0.03] border border-white/5 p-3"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-green-400">{stat.change}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 h-32 flex items-end gap-1.5">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: 'linear-gradient(to top, #6366f1, #a855f7)',
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}