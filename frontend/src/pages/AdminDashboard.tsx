import { useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Clock, CheckCircle, MessageSquare, Send, UploadCloud, Download, Search, Info, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const statusColor: Record<string, string> = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  'in-progress': 'bg-primary/20 text-primary border-primary/30',
  completed: 'bg-success/20 text-success border-success/30',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
};

const AdminDashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  const selectProject = async (proj: any) => {
    try {
      const { data: freshData } = await api.get('/projects');
      setProjects(freshData);
      const freshP = freshData.find((p: any) => p._id === proj._id) || proj;
      setSelectedProject(freshP);
      loadMessages(freshP._id);
    } catch {
      setSelectedProject(proj);
      loadMessages(proj._id);
    }
  };

  const loadMessages = async (projectId: string) => {
    try {
      const { data } = await api.get(`/projects/${projectId}/messages`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/projects/${id}/status`, { status });
      setProjects((p) => p.map((proj) => proj._id === id ? { ...proj, status: status } : proj));
      if (selectedProject?._id === id) {
        setSelectedProject((p: any) => ({ ...p, status }));
      }
      toast({ title: 'Status Updated', description: `Changed to ${status}.` });
    } catch (err: any) {
      toast({ title: 'Update Failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleDeliver = async () => {
    if (!file || !selectedProject) return;
    try {
      const formData = new FormData();
      formData.append('delivery', file);
      const { data } = await api.put(`/projects/${selectedProject._id}/deliver`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast({ title: 'Success', description: 'Project delivered! Status is now completed.' });
      setFile(null);
      setProjects((p) => p.map(proj => proj._id === data._id ? data : proj));
      setSelectedProject(data);
    } catch (err: any) {
      toast({ title: 'Upload Failed', description: err.response?.data?.message, variant: 'destructive' });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProject) return;
    setSending(true);
    try {
      const { data } = await api.post(`/projects/${selectedProject._id}/messages`, { text: newMessage });
      setMessages(prev => [...prev, ...data]);
      setNewMessage('');
      toast({ title: 'Message Sent to ' + selectedProject.user.name, description: 'Chat successfully sent.', className: 'bg-primary text-primary-foreground border-none' });
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to send msg', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.user?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-10rem)] md:h-[calc(100vh-7rem)] overflow-hidden">
        
        {/* Left Panel: All Projects List */}
        <div className={cn(
          "w-full md:w-96 flex-shrink-0 flex flex-col gap-3 transition-all duration-300",
          selectedProject ? "hidden md:flex" : "flex"
        )}>
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display font-bold text-xl md:text-lg">Admin Control</h2>
            <Badge variant="secondary" className="font-bold">{projects.length}</Badge>
          </div>

          <div className="relative px-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search student or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-11 bg-muted/20 border-border/40 rounded-xl"
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-2 pb-4">
              {filteredProjects.map((p) => (
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
                    <Badge className={cn("text-[9px] py-0 h-4 px-1.5 capitalize font-bold border-none", statusColor[p.status])}>
                      {p.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] font-bold text-primary/80 flex items-center gap-1">
                      👤 {p.user?.name || 'User'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {p.deadline ? format(new Date(p.deadline), 'MMM d') : 'No Date'}
                    </span>
                  </div>
                </button>
              ))}
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
                        <div className="flex items-center gap-3 overflow-hidden text-ellipsis">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm group-hover:scale-105 transition-transform uppercase">
                            {(selectedProject.user?.name || 'U')[0]}
                          </div>
                          <div className="truncate">
                            <h3 className="font-bold text-sm md:text-base leading-tight flex items-center gap-2 truncate">
                              {selectedProject.user?.name || 'Student'}
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
                      {messages.map((msg, i) => {
                         const isMe = msg.senderType === 'admin' || msg.senderType === 'bot';
                         return (
                           <motion.div 
                              key={i} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn("flex gap-2 md:gap-3", isMe ? 'flex-row-reverse' : 'flex-row')}
                           >
                             <div className={cn(
                                "flex-shrink-0 h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shadow-sm",
                                isMe ? 'bg-primary text-primary-foreground' : 'bg-background border border-border shadow-sm text-foreground'
                              )}>
                                {isMe ? '⭐' : (selectedProject.user?.name || 'U')[0].toUpperCase()}
                              </div>
                              
                              <div className={cn("max-w-[85%] md:max-w-[75%] flex flex-col", isMe ? 'items-end' : 'items-start')}>
                                <div className="flex items-center gap-2 mb-1 px-1">
                                  <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                    {isMe ? 'ProjectBuddy Official' : (selectedProject.user?.name || 'Student')}
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
                         )
                      })}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Interface */}
                  <div className="p-4 border-t border-border/50 bg-background shadow-inner">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
                      <Input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message to the student..."
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
                          <span className="text-primary font-bold">{selectedProject.user?.name}</span>
                          <span className="text-muted-foreground text-xs hidden sm:inline">•</span>
                          <span className="text-muted-foreground text-[10px] bg-muted px-2 py-0.5 rounded">{selectedProject.user?.email}</span>
                        </SheetDescription>
                      </div>

                      <div className="flex-1 p-5 md:p-6 space-y-8">
                        {/* Status Management */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Manage Status</h4>
                          <div className="p-4 rounded-xl bg-card border border-border/50 shadow-sm">
                            <Select value={selectedProject.status} onValueChange={(v) => updateStatus(selectedProject._id, v)}>
                              <SelectTrigger className={cn("w-full h-11 border-none bg-muted/30 font-bold rounded-lg px-4", statusColor[selectedProject.status])}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-border/50">
                                <SelectItem value="pending">⏳ Pending Review</SelectItem>
                                <SelectItem value="in-progress">⚡ In Progress</SelectItem>
                                <SelectItem value="completed">✅ Completed & Delivered</SelectItem>
                                <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Tech Domain</h4>
                             <div className="p-4 rounded-xl bg-card border border-border/50 text-xs font-bold text-center truncate shadow-sm">
                               {selectedProject.domain}
                             </div>
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Budget</h4>
                             <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs font-bold text-center text-primary shadow-sm">
                               💰 Rs. {selectedProject.budget || 'TBD'}
                             </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Full Description</h4>
                          <div className="p-5 rounded-2xl bg-card border border-border/50 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap shadow-sm">
                            {selectedProject.description}
                          </div>
                          <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Deadline: {selectedProject.deadline ? format(new Date(selectedProject.deadline), 'PP') : 'No deadline'}</span>
                          </div>
                        </div>

                        {/* Action Center - Delivery & Submissions */}
                        <div className="space-y-6 pt-4 border-t border-border/50">
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">User Submission</h4>
                            {selectedProject.attachmentPath ? (
                              <Button variant="outline" size="sm" asChild className="w-full justify-between h-12 rounded-xl text-primary font-bold hover:bg-primary/5 border-primary/20 bg-background">
                                <a href={`https://projectbuddyy.onrender.com/${selectedProject.attachmentPath}`} target="_blank" rel="noreferrer">
                                  <span className="flex items-center"><Download className="h-4 w-4 mr-3" /> Source Code / Docs</span>
                                  <Badge className="bg-primary/10 text-primary border-none text-[9px]">Download</Badge>
                                </a>
                              </Button>
                            ) : (
                              <div className="p-4 rounded-xl border border-dashed border-border/60 bg-muted/5 text-center text-xs text-muted-foreground font-medium italic">No attachments provided</div>
                            )}
                          </div>

                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">Project Delivery</h4>
                            {selectedProject.deliveryPath ? (
                              <div className="p-6 rounded-2xl bg-success/5 border border-success/20 flex flex-col items-center gap-3">
                                <CheckCircle className="h-8 w-8 text-success" />
                                <p className="text-sm font-bold text-success text-center">Successfully Delivered</p>
                                <Button asChild variant="link" size="sm" className="text-primary font-bold">
                                  <a href={`http://localhost:5001/${selectedProject.deliveryPath}`} target="_blank" rel="noreferrer">
                                    Download Final ZIP
                                  </a>
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-3 p-2">
                                <Input type="file" className="w-full h-11 text-xs file:h-full file:bg-primary/10 file:border-0 file:text-primary file:font-bold rounded-xl border-dashed bg-muted/5 cursor-pointer" accept=".zip,.rar,.tar" onChange={e => setFile(e.target.files?.[0] || null)} />
                                <Button size="lg" className="w-full h-12 rounded-xl shadow-lg glow-blue font-bold" disabled={!file || sending} onClick={handleDeliver}>
                                  <UploadCloud className="h-4 w-4 mr-2" /> {sending ? 'Uploading...' : 'Upload Final ZIP'}
                                </Button>
                              </div>
                            )}
                          </div>
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
              <p className="text-sm mt-2 max-w-xs text-muted-foreground/70">Pick a project from the left to manage status and message the student.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
