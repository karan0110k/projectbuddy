import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { MessageSquare, Send, Download, FolderOpen, Clock, CheckCircle, Info, ChevronLeft } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const statusColor: Record<string, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  'in-progress': 'bg-primary/20 text-primary border-primary/30',
  completed: 'bg-success/20 text-success border-success/30',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
};

const statusIcon: Record<string, string> = {
  pending: '🕐',
  'in-progress': '⚡',
  completed: '✅',
  cancelled: '❌',
};

const MyProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const location = useLocation();

  // Load all user's projects on mount
  useEffect(() => {
    const fetchAndSelect = async () => {
      try {
        const { data } = await api.get('/projects/myprojects');
        setProjects(data);

        // Check if we came from dashboard with a specific project to select
        const stateProjectId = (location.state as any)?.projectId;
        if (stateProjectId) {
          const target = data.find((p: any) => p._id === stateProjectId);
          if (target) {
            selectProject(target);
            return;
          }
        }

        // On mobile, we don't auto-select to show the list first
        // On desktop, we auto-select first project
        if (window.innerWidth > 768 && data.length > 0 && !selectedProject) {
          selectProject(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    };
    fetchAndSelect();
  }, [location.state]);

  const selectProject = async (project: any) => {
    // Re-fetch the latest project data so deliveryPath is fresh
    try {
      const { data: freshProjects } = await api.get('/projects/myprojects');
      const freshProject = freshProjects.find((p: any) => p._id === project._id) || project;
      setProjects(freshProjects);
      setSelectedProject(freshProject);
      setUnreadCounts(prev => ({ ...prev, [freshProject._id]: 0 }));
      loadMessages(freshProject._id);
    } catch {
      setSelectedProject(project);
      loadMessages(project._id);
    }
  };

  const loadMessages = async (projectId: string) => {
    setLoadingMessages(true);
    try {
      const { data } = await api.get(`/projects/${projectId}/messages`);
      setMessages(data);
      if (data.length === 0) {
        triggerWelcomeMessage(projectId);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const triggerWelcomeMessage = async (projectId: string) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/messages`, {
        text: 'Hello! Can you give me a quick update on my project?'
      });
      setMessages(data);
    } catch (err) {
      console.error('Could not trigger welcome', err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProject) return;
    setSending(true);
    try {
      const { data } = await api.post(`/projects/${selectedProject._id}/messages`, { text: newMessage });
      setMessages(prev => [...prev, ...data]);
      setNewMessage('');
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-10rem)] md:h-[calc(100vh-7rem)] overflow-hidden">
        
        {/* Left Panel: Project list */}
        <div className={cn(
          "w-full md:w-80 flex-shrink-0 flex flex-col gap-3 transition-all duration-300",
          selectedProject ? "hidden md:flex" : "flex"
        )}>
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display font-bold text-xl md:text-lg">My Projects</h2>
            <Badge variant="secondary" className="font-bold">{projects.length}</Badge>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-2 pb-4">
              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed rounded-2xl bg-muted/5">
                  <FolderOpen className="h-12 w-12 mb-3 opacity-20" />
                  <p className="font-medium text-sm">No projects yet</p>
                  <p className="text-xs mt-1">Ready to start? Submit your project request.</p>
                </div>
              ) : (
                projects.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => selectProject(p)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all duration-200 group active:scale-[0.98]",
                      selectedProject?._id === p._id
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5'
                        : 'border-border/50 bg-card hover:border-primary/40 hover:bg-primary/5'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">{p.title}</span>
                      {unreadCounts[p._id] > 0 && (
                        <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold animate-pulse">
                          {unreadCounts[p._id]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={cn("text-[10px] py-0 h-5 border-none", statusColor[p.status])}>
                        {statusIcon[p.status]} {p.status}
                      </Badge>
                      {p.deliveryPath && (
                        <span className="text-[10px] text-success font-bold flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Delivered
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel: Chat Interface */}
        <div className={cn(
          "flex-1 flex flex-col min-w-0 h-full transition-all duration-300",
          !selectedProject ? "hidden md:flex" : "flex"
        )}>
          {selectedProject ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedProject._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col border border-border/50 rounded-2xl bg-card overflow-hidden shadow-sm"
              >
                <Sheet>
                  {/* Premium Chat Header */}
                  <div className="flex items-center gap-2 px-3 py-3 border-b border-border/50 bg-muted/20 backdrop-blur-sm">
                    {/* Back Button for Mobile */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden shrink-0 h-9 w-9 rounded-full"
                      onClick={() => setSelectedProject(null)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <SheetTrigger asChild>
                      <button className="flex-1 flex items-center justify-between text-left group">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm group-hover:scale-105 transition-transform uppercase">
                            ⭐
                          </div>
                          <div className="truncate">
                            <h3 className="font-bold text-sm md:text-base leading-tight flex items-center gap-2 truncate">
                              ProjectBuddy Official
                              <Badge className={cn("text-[9px] h-4 px-1.5 capitalize font-bold border-none", statusColor[selectedProject.status])}>
                                {selectedProject.status}
                              </Badge>
                            </h3>
                            <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 font-medium truncate opacity-70">
                              {selectedProject.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors px-2">
                          <Info className="h-5 w-5" />
                        </div>
                      </button>
                    </SheetTrigger>
                  </div>

                  {/* Main Chat Area */}
                  <ScrollArea className="flex-1 p-4 md:p-6 bg-muted/5 h-0">
                    <div className="space-y-6 max-w-4xl mx-auto pb-4">
                      {loadingMessages ? (
                        <div className="flex items-center justify-center h-full py-12">
                          <div className="flex gap-1">
                            {[0, 150, 300].map(delay => (
                              <span key={delay} className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                            ))}
                          </div>
                        </div>
                      ) : (
                        messages.map((msg, i) => {
                          const isMe = msg.senderType === 'user';
                          return (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn("flex gap-2 md:gap-3", isMe ? 'flex-row-reverse' : 'flex-row')}
                            >
                              <div className={cn(
                                "flex-shrink-0 h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shadow-sm",
                                isMe ? 'bg-muted text-foreground border border-border/50' : 'bg-primary text-primary-foreground'
                              )}>
                                {isMe ? 'U' : '⭐'}
                              </div>
                              <div className={cn("max-w-[85%] md:max-w-[75%] flex flex-col", isMe ? 'items-end' : 'items-start')}>
                                <div className="flex items-center gap-2 mb-1 px-1">
                                  <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                    {isMe ? 'You' : 'ProjectBuddy'}
                                  </span>
                                  {msg.createdAt && (
                                    <span className="text-[8px] md:text-[9px] text-muted-foreground/50">
                                      {format(new Date(msg.createdAt), 'h:mm a')}
                                    </span>
                                  )}
                                </div>
                                <div className={cn(
                                  "px-4 py-2 md:py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                  isMe 
                                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                    : 'bg-card border border-border text-foreground rounded-tl-none font-medium'
                                )}>
                                  {msg.text}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Interface */}
                  <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-md">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
                      <Input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Message ProjectBuddy..."
                        className="flex-1 py-6 h-12 bg-muted/20 border-border/40 focus:bg-background transition-all rounded-xl text-sm"
                      />
                      <Button 
                        type="submit" 
                        disabled={sending || !newMessage.trim()} 
                        className="h-12 w-12 rounded-xl shadow-lg hover:shadow-primary/20 active:scale-95 transition-all p-0"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>

                  {/* Enhanced Mobile-Friendly Details Sheet */}
                  <SheetContent side="right" className="w-[90%] sm:max-w-md p-0 overflow-y-auto border-l border-border/50 bg-background/95 backdrop-blur-md">
                    <div className="h-full flex flex-col">
                      <div className="p-6 border-b border-border/50 bg-primary/5 pt-12 md:pt-6">
                        <SheetTitle className="text-xl md:text-2xl font-bold font-display tracking-tight leading-tight">
                          {selectedProject.title}
                        </SheetTitle>
                        <SheetDescription className="mt-2 flex flex-wrap items-center gap-2 font-medium">
                          <Badge className={cn("border-none capitalize", statusColor[selectedProject.status])}>
                            {statusIcon[selectedProject.status]} {selectedProject.status}
                          </Badge>
                          <span className="text-muted-foreground text-xs hidden sm:inline">•</span>
                          <span className="text-muted-foreground text-xs bg-muted px-2 py-0.5 rounded">{selectedProject.domain}</span>
                        </SheetDescription>
                      </div>

                      <div className="flex-1 p-5 md:p-6 space-y-8">
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Project Overview</h4>
                          <div className="p-5 rounded-2xl bg-card border border-border/50 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap shadow-sm">
                            {selectedProject.description}
                          </div>
                          <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Deadline: {selectedProject.deadline ? format(new Date(selectedProject.deadline), 'PP') : 'No deadline'}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Budget</h4>
                             <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm font-bold text-center text-primary">
                               💰 Rs. {selectedProject.budget || 'TBD'}
                             </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                           <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Final Deliverables</h4>
                           {selectedProject.deliveryPath ? (
                            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-success/5 border border-success/20">
                              <CheckCircle className="h-10 w-10 text-success" />
                              <div className="text-center">
                                <p className="text-sm font-bold text-success mb-1">Project Completed!</p>
                                <p className="text-[10px] text-muted-foreground">Your source code and documentation are ready.</p>
                              </div>
                              <Button asChild className="w-full h-11 rounded-xl shadow-lg glow-blue">
                                <a href={`http://localhost:5001/${selectedProject.deliveryPath}`} target="_blank" download rel="noreferrer">
                                  <Download className="h-4 w-4 mr-2" /> Download Final ZIP
                                </a>
                              </Button>
                            </div>
                          ) : (
                            <div className="p-6 rounded-2xl border border-dashed border-border/60 bg-muted/10 flex flex-col items-center gap-3 text-center">
                              <Clock className="h-8 w-8 text-muted-foreground opacity-20" />
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-muted-foreground">Work In Progress</p>
                                <p className="text-[10px] text-muted-foreground/60 leading-relaxed px-4">Our team is working on your project. You'll receive a notification once the final files are uploaded.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center text-muted-foreground border border-dashed border-border/40 rounded-3xl bg-card/50 scale-95 opacity-80 transition-all">
              <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mb-6 border border-primary/10">
                <MessageSquare className="h-10 w-10 text-primary opacity-30" />
              </div>
              <p className="font-bold text-lg text-foreground/80">Select a project</p>
              <p className="text-sm mt-2 max-w-xs text-muted-foreground/70">Pick a project from the left to start chatting with our team.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyProjects;
