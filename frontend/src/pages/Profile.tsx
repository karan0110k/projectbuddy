import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    college: user?.college || '',
    course: user?.course || '',
    phone: user?.phone || '',
  });
  const { toast } = useToast();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = () => {
    setEditing(false);
    toast({ title: 'Profile updated!', description: 'Your changes have been saved.' });
  };

  const fields = [
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'college', label: 'College' },
    { key: 'course', label: 'Course' },
    { key: 'phone', label: 'Phone' },
  ];

  return (
    <DashboardLayout>
      <Card className="mx-auto max-w-lg border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">My Profile</CardTitle>
          {!editing && <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>}
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label>{f.label}</Label>
              <Input
                value={(form as Record<string, string>)[f.key]}
                onChange={set(f.key)}
                disabled={!editing}
              />
            </div>
          ))}

          {editing && (
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="glow-blue">Save</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Profile;
