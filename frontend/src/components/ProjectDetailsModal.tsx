import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { Download, UploadCloud, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

export function ProjectDetailsModal({ project, open, onClose, onUpdate }: any) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && project) {
      setActiveTab('details');
      fetchMessages();
    }
  }, [open, project]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/projects/${project._id}/messages`);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/projects/${project._id}/messages`, { text: newMessage });
      setMessages([...messages, ...data]);
      setNewMessage('');
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to send message', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const handleDeliver = async () => {
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('delivery', file);
      
      const { data } = await api.put(`/projects/${project._id}/deliver`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast({ title: 'Success', description: 'Project delivered successfully.' });
      onUpdate(data);
    } catch (err: any) {
      toast({ title: 'Upload Failed', description: err.response?.data?.message || 'Could not upload delivery', variant: 'destructive' });
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex justify-between items-center">
            <span>{project.title}</span>
            <div className="flex gap-2 text-sm font-normal">
              <Button 
                variant={activeTab === 'details' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('details')}
              >
                Details
              </Button>
              <Button 
                variant={activeTab === 'chat' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('chat')}
                className="flex gap-2"
              >
                <MessageSquare className="h-4 w-4" /> Chat
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'details' ? (
            <div className="p-6 space-y-6 overflow-y-auto h-full">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase">Student</h4>
                  <p>{project.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{project.user?.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase">Domain</h4>
                  <p>{project.domain}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase">Description</h4>
                  <p className="text-sm">{project.description}</p>
                </div>
                
                {project.attachmentPath && (
                  <div className="col-span-2 mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Initial Submitted Requirements</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground truncate max-w-[250px]">{project.attachmentPath.split('/').pop()}</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`https://projectbuddyy.onrender.com/${project.attachmentPath}`} target="_blank" download rel="noreferrer">
                          <Download className="h-4 w-4 mr-2"/> Download Attachment
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Section */}
              <div className="border border-border/50 rounded-lg p-5 bg-primary/5">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  Final Project Delivery
                </h4>
                
                {project.deliveryPath ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-success font-medium">✨ Final Project Completed & Delivered!</p>
                    <Button size="sm" asChild className="glow-blue">
                      <a href={`https://projectbuddyy.onrender.com/${project.deliveryPath}`} target="_blank" download rel="noreferrer">
                        <Download className="h-4 w-4 mr-2"/> Download Final ZIP
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div>
                    {user?.role === 'admin' ? (
                      <div className="flex items-center gap-3">
                        <Input 
                          type="file" 
                          accept=".zip,.rar,.tar" 
                          onChange={(e) => setFile(e.target.files?.[0] || null)} 
                        />
                        <Button onClick={handleDeliver} disabled={!file} className="shrink-0">
                          <UploadCloud className="h-4 w-4 mr-2" /> Upload
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Pending delivery from Admin...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full bg-muted/10">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground mt-4 italic text-sm">No messages yet. Send a message to get help from our AI or Admin!</p>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.senderType === (user?.role === 'admin' ? 'admin' : 'user');
                      const align = isMe ? 'self-end text-right' : 'self-start text-left';
                      const bg = isMe ? 'bg-primary text-primary-foreground' : (msg.senderType === 'bot' ? 'bg-primary/20 text-foreground border border-primary/30' : 'bg-muted text-foreground');
                      
                      return (
                        <div key={i} className={`flex flex-col max-w-[80%] ${align}`}>
                          <span className="text-[10px] text-muted-foreground mb-1 px-1 uppercase">{msg.senderType === 'bot' ? '🤖 Assistant' : msg.senderType}</span>
                          <div className={`p-3 rounded-xl text-sm ${bg}`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input 
                    value={newMessage} 
                    onChange={e => setNewMessage(e.target.value)} 
                    placeholder="Type a message..." 
                    className="flex-1"
                  />
                  <Button type="submit" disabled={sending || !newMessage.trim()} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
