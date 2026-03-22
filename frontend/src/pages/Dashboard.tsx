import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FolderOpen, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const statusColor: Record<string, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  'in-progress': 'bg-primary/20 text-primary border-primary/30',
  completed: 'bg-success/20 text-success border-success/30',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data } = await api.get('/projects/myprojects');
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects', err);
      }
    };
    loadProjects();
  }, []);

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'In Progress', value: projects.filter(p => p.status === 'in-progress' || p.status === 'pending').length, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Success', value: projects.filter(p => p.status === 'completed').length, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, <span className="text-primary">{user?.name?.split(' ')[0]}</span>! 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Ready to build something amazing today?</p>
          </div>
          <Button 
            onClick={() => navigate('/submit-project')} 
            className="w-full md:w-auto glow-blue rounded-xl h-11 px-6 font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Sparkles className="h-4 w-4" />
            New Project
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="flex items-center gap-4 p-5 md:p-6">
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110", s.bg)}>
                    <s.icon className={cn("h-6 w-6", s.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums leading-none mb-1">{s.value}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-70">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Projects Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/40 bg-card/40 backdrop-blur-md overflow-hidden rounded-2xl shadow-sm">
            <div className="p-6 border-b border-border/40 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Recent Projects
              </h3>
              <Button variant="link" onClick={() => navigate('/projects')} className="text-xs font-bold h-auto p-0 hover:text-primary">
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <CardContent className="p-2 md:p-4">
              <div className="space-y-2">
                {projects.length > 0 ? (
                  projects.slice(0, 5).map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.05) }}
                    >
                      <button
                        onClick={() => navigate('/projects', { state: { projectId: p._id } })}
                        className="w-full flex items-center justify-between rounded-xl border border-transparent bg-background/40 p-4 hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all active:scale-[0.99] group text-left"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="font-bold text-sm md:text-base truncate group-hover:text-primary transition-colors">{p.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] md:text-xs text-muted-foreground font-medium truncate opacity-60">Domain: {p.domain}</span>
                             <span className="text-[10px] text-muted-foreground/30">•</span>
                             <span className="text-[10px] md:text-xs text-primary/80 font-bold">💰 {p.budget || 'Custom'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <Badge className={cn("text-[10px] py-0 h-5 px-2 capitalize font-bold border-none", statusColor[p.status])}>
                             {p.status}
                           </Badge>
                           <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <FolderOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-bold text-sm">No projects found</p>
                    <p className="text-xs mt-1">Submit your first project to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
