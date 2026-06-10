import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/animations/variants'

const POSTS = [
  {
    tag:    'Product',
    title:  'Introducing Kanban Boards: Visual Project Management',
    excerpt:'Drag, drop, and ship. Our new Kanban view brings a visual layer to every project — see status at a glance across your entire team.',
    author: 'Nexus Team',
    date:   'Jun 5, 2026',
    mins:   4,
    color:  '#6366f1',
  },
  {
    tag:    'Engineering',
    title:  'How We Achieved Sub-50ms API Responses at Scale',
    excerpt:'A deep dive into the caching strategies, database optimisations, and edge-deployment decisions that power Nexus\'s real-time collaboration.',
    author: 'Engineering',
    date:   'May 28, 2026',
    mins:   8,
    color:  '#a855f7',
  },
  {
    tag:    'Tips & Tricks',
    title:  '10 Keyboard Shortcuts That Will 10× Your Productivity',
    excerpt:'Power-users swear by these. From opening the command palette to bulk-completing tasks — master these shortcuts and never leave your keyboard.',
    author: 'Nexus Team',
    date:   'May 20, 2026',
    mins:   3,
    color:  '#06b6d4',
  },
]

export function Blog() {
  return (
    <section id="blog" className="relative py-32 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-nexus-500/30 bg-nexus-500/10 px-4 py-1.5 text-xs font-medium text-nexus-400 mb-4">
              Blog
            </span>
            <h2 className="text-4xl font-bold">
              Latest from <span className="text-gradient">Nexus</span>
            </h2>
          </div>
          <a href="#blog" className="flex items-center gap-1.5 text-sm text-nexus-400 hover:text-nexus-300 transition-colors font-medium">
            All posts <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Posts */}
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {POSTS.map(post => (
            <motion.article
              key={post.title}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden cursor-pointer hover:border-white/20 transition-all"
            >
              {/* Color accent bar */}
              <div className="h-1.5" style={{ background: post.color }} />

              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-semibold mb-3 px-2 py-0.5 rounded-full w-fit" style={{ color: post.color, background: `${post.color}15` }}>
                  {post.tag}
                </span>
                <h3 className="font-semibold text-base leading-snug mb-3 group-hover:text-nexus-300 transition-colors flex-1">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/5">
                  <span>{post.author}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.mins} min read · {post.date}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
