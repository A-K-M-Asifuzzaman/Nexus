import { Hero }        from '@/components/landing/Hero'
import { Features }    from '@/components/landing/Features'
import { Pricing }     from '@/components/landing/Pricing'
import { About }       from '@/components/landing/About'
import { Blog }        from '@/components/landing/Blog'
import { Changelog }   from '@/components/landing/Changelog'
import { Testimonials }from '@/components/landing/Testimonials'
import { FAQ }         from '@/components/landing/FAQ'
import { Footer }      from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <About />
      <Blog />
      <Changelog />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  )
}
