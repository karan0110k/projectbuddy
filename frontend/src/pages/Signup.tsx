import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Rocket, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', course: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password required';
    else if (form.password.length < 6) e.password = 'Min 6 chars';
    if (!form.college.trim()) e.college = 'College required';
    if (!form.course.trim()) e.course = 'Course required';
    if (!form.phone) e.phone = 'Phone required';
    else if (!/^\d{10}$/.test(form.phone)) e.phone = '10 digits needed';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form);
      toast({ title: 'Welcome aboard!', description: 'Your account has been created successfully.' });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Registration Failed', description: err.message || 'Please try again later.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fields: { key: string; label: string; type?: string; placeholder: string }[] = [
    { key: 'name', label: 'Full Name', placeholder: 'enter your name' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'enter your email },
    { key: 'college', label: 'College / University', placeholder: 'enter your college' },
    { key: 'course', label: 'Branch / Course', placeholder: 'enter your course' },
    { key: 'phone', label: 'WhatsApp Number', placeholder: 'enter your number' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-border/40 bg-card/40 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pt-8 pb-6 bg-primary/5 border-b border-border/40">
            <Link to="/" className="mx-auto mb-4 flex items-center gap-2 group w-fit">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight gradient-text">ProjectBuddy</span>
            </Link>
            <CardTitle className="font-display text-2xl font-bold tracking-tight mt-2">Join the Future</CardTitle>
            <CardDescription className="text-sm font-medium opacity-70">Empower your academic journey today.</CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {fields.map((f, i) => (
                  <motion.div 
                    key={f.key} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor={f.key} className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground ml-1">{f.label}</Label>
                    <Input 
                      id={f.key} 
                      type={f.type || 'text'} 
                      placeholder={f.placeholder} 
                      value={(form as Record<string, string>)[f.key]} 
                      onChange={set(f.key)} 
                      className={cn(
                        "h-12 bg-muted/20 border-border/40 focus:bg-background rounded-xl text-sm transition-all px-4",
                        errors[f.key] && "border-destructive/50 focus-visible:ring-destructive"
                      )}
                    />
                    {errors[f.key] && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-destructive font-bold ml-1">
                        {errors[f.key]}
                      </motion.p>
                    )}
                  </motion.div>
                ))}

                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.3 }}
                  className="space-y-1.5"
                >
                  <Label htmlFor="password" title="Password" className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Secure Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="enter password(6 digits)" 
                      value={form.password} 
                      onChange={set('password')} 
                      className={cn(
                        "h-12 bg-muted/20 border-border/40 focus:bg-background rounded-xl text-sm transition-all px-4 pr-12",
                        errors.password && "border-destructive/50 focus-visible:ring-destructive"
                      )}
                    />
                    <button 
                      type="button" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-destructive font-bold ml-1">{errors.password}</p>
                  )}
                </motion.div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl glow-blue font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-all mt-4" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    Launch My Journey <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="flex flex-col items-center gap-2 pt-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Already part of the community?
              </p>
              <Button variant="link" asChild className="h-auto p-0 text-primary font-bold hover:tracking-wide transition-all">
                <Link to="/login">Sign in here</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
