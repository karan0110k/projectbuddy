import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Brain, Bot, Code2, Coffee, Layers, Globe, Database as DbIcon, Rocket, Award, Zap, Compass, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { services, features, testimonials, steps } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Bot, Code2, Coffee, Layers, Globe, Database: DbIcon, Rocket, Award, Zap, Compass, Shield,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="dot-pattern absolute inset-0" />
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px]" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              🚀 Your Project Partner
            </span>
          </motion.div>

          <motion.h1
            className="mx-auto max-w-4xl font-display text-4xl font-bold leading-tight md:text-6xl lg:text-7xl"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Stuck with your{' '}
            <span className="gradient-text">Tech Project?</span>
            <br />We Can Help!
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            From AI & Machine Learning to MERN Stack — we build high-quality college projects with expert guidance, fast delivery, and reliable support.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            {isAuthenticated ? (
              <Button size="lg" asChild className="glow-blue gap-2 px-8 text-base">
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>Go to Dashboard <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="glow-blue gap-2 px-8 text-base">
                <Link to="/signup">Apply for Project <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            )}
            <Button size="lg" variant="outline" asChild className="gap-2 px-8 text-base">
              <a href="#services">View Services</a>
            </Button>
          </motion.div>

        <motion.div
          className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          initial="hidden" animate="visible" variants={fadeUp} custom={4}
        >
          <span className="flex items-center gap-1">
  <Star className="h-4 w-4 text-warning" /> Trusted by Students
</span>
<span className="hidden sm:inline text-border">|</span>
<span>End-to-End Project Support</span>
<span className="hidden sm:inline text-border">|</span>
<span>Fast & Reliable Delivery</span>
        </motion.div>
      </div>
    </section>

    {/* Services */}
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <span className="text-sm font-medium text-primary">What We Offer</span>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Our <span className="gradient-text">Services</span></h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">We cover every major tech domain for your college projects.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] || Rocket;
            return (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="group h-full border-border/50 bg-card transition-all duration-300 card-glow hover:-translate-y-1">
                  <CardContent className="flex flex-col items-start gap-3 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="border-y border-border bg-card/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <span className="text-sm font-medium text-primary">Why Choose Us</span>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Key <span className="gradient-text">Benefits</span></h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon] || Zap;
            return (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="flex flex-col items-center rounded-xl border border-border/50 bg-background p-8 text-center transition-all hover:border-primary/30"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-display font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <span className="text-sm font-medium text-primary">Simple Process</span>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">How It <span className="gradient-text">Works</span></h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="relative flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-display text-2xl font-bold text-primary">
                {s.step}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+40px)] top-8 hidden h-0.5 w-[calc(100%-80px)] bg-gradient-to-r from-primary to-accent md:block" />
              )}
              <h3 className="mb-2 font-display text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section id="testimonials" className="border-y border-border bg-card/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <span className="text-sm font-medium text-primary"></span>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">What Students <span className="gradient-text">Say</span></h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Card className="h-full border-border/50 bg-background">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                  <div className="mt-auto">
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.college}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-10 text-center md:p-16">
          <div className="absolute left-0 top-0 h-full w-full dot-pattern opacity-30" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to Get Your Project Done?</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Submit your project requirements today and let our experts handle the rest. Fast, reliable, and affordable.
            </p>
            {isAuthenticated ? (
              <Button size="lg" asChild className="mt-8 glow-blue gap-2 px-10 text-base">
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>Go to Dashboard <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="mt-8 glow-blue gap-2 px-10 text-base">
                <Link to="/signup">Get Started Now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
  );
};

export default Index;
