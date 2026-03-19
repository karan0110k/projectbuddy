import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Portfolio', href: 'https://portfolio-karan-aiml.vercel.app/', external: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-2xl transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
            <Rocket className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight gradient-text">ProjectBuddy</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="text-sm font-medium text-muted-foreground/80 transition-all hover:text-primary hover:tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <Button asChild className="glow-blue rounded-full px-6">
              <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-sm font-bold">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="glow-blue rounded-full px-6 shadow-lg shadow-primary/20">
                <Link to="/signup">Apply Now</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 rounded-xl bg-muted/50 border border-white/10 active:scale-90 transition-all" 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 right-0 top-16 z-50 border-b border-white/5 bg-background/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  {navLinks.map((link, i) => (
                    <motion.a
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={link.label}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                      className="flex items-center justify-between py-2 text-lg font-bold text-foreground/80 hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4 opacity-50" />
                    </motion.a>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                  {isAuthenticated ? (
                    <Button asChild className="w-full h-12 rounded-xl glow-blue text-base font-bold">
                      <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)}>
                        Go to Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full h-12 rounded-xl border-white/10 text-base font-bold shadow-sm">
                        <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                      </Button>
                      <Button asChild className="w-full h-12 rounded-xl glow-blue text-base font-bold shadow-lg shadow-primary/20">
                        <Link to="/signup" onClick={() => setMobileOpen(false)}>Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
