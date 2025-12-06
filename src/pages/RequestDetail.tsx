import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, User, DollarSign, Calendar, Tag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RequestWithProfile {
  id: string;
  user_id: string;
  title: string;
  description: string;
  compensation: string;
  location: string;
  category: string;
  status: string;
  created_at: string;
  profiles: { name: string } | null;
}

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { addNotification } = useData();
  const [request, setRequest] = useState<RequestWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      const { data, error } = await supabase
        .from('skill_requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (!error && data) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', data.user_id)
          .maybeSingle();
        
        setRequest({
          ...data,
          profiles: profileData || null
        });
      }
      setLoading(false);
    };

    if (id) fetchRequest();
  }, [id]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Request not found</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleHelp = async () => {
    const { error } = await addNotification({
      user_id: request.user_id,
      type: 'new_request',
      title: 'New Help Offer',
      message: `${profile?.name || user.email} wants to help with your request: "${request.title}"`,
      read: false,
    });
    
    if (error) {
      toast.error('Failed to send notification');
    } else {
      toast.success('Your offer to help has been sent!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="max-w-2xl mx-auto border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">{request.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{request.description}</p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Compensation</p>
                  <p className="font-medium text-foreground">{request.compensation}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Posted by</p>
                  <p className="font-medium text-foreground">{request.profiles?.name || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{request.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{request.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Posted on</p>
                  <p className="font-medium text-foreground">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {request.user_id !== user.id && (
              <Button className="w-full" onClick={handleHelp}>
                Offer to Help
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestDetail;
