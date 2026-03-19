import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';

const projectTypes = ['AI & Machine Learning', 'Agentic AI', 'Python', 'Java', 'MERN Stack', 'Web Development', 'Database Projects', 'Next.js & Django'];

const SubmitProject = () => {
  const [form, setForm] = useState({ title: '', type: '', techStack: '', description: '', deadline: '', budget: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((p) => [...p, ...dropped]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('domain', form.type);
      formData.append('techStack', form.techStack);
      formData.append('description', form.description);
      formData.append('deadline', form.deadline);
      if (form.budget) formData.append('budget', form.budget);
      
      files.forEach((file) => formData.append('attachment', file));

      await api.post('/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({ title: 'Project Submitted!', description: 'We will review your request and get back to you soon.' });
      setForm({ title: '', type: '', techStack: '', description: '', deadline: '', budget: '' });
      setFiles([]);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to submit project', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <Card className="mx-auto max-w-2xl border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="font-display">Submit Your Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Project Title</Label>
              <Input placeholder="e.g. AI Chatbot for College" value={form.title} onChange={set('title')} required />
            </div>

            <div className="space-y-2">
              <Label>Project Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {projectTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <Input placeholder="e.g. Python, TensorFlow, Flask" value={form.techStack} onChange={set('techStack')} required />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe your project requirements..." value={form.description} onChange={set('description')} rows={4} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline} onChange={set('deadline')} required />
              </div>
              <div className="space-y-2">
                <Label>Budget (optional)</Label>
                <Input placeholder="e.g. ₹5,000" value={form.budget} onChange={set('budget')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Attachments</Label>
              <div
                className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-border'}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag & drop files here or click to browse</p>
                <input id="file-input" type="file" multiple className="hidden" onChange={(e) => setFiles((p) => [...p, ...Array.from(e.target.files || [])])} />
              </div>
              {files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between rounded border border-border bg-background px-3 py-1.5 text-sm">
                      <span className="truncate">{f.name}</span>
                      <button type="button" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}><X className="h-4 w-4 text-muted-foreground" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full glow-blue">Submit Project</Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SubmitProject;
