import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, User, Clock, Calendar, Tag, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OfferWithProfile {
  id: string;
  user_id: string;
  title: string;
  description: string;
  rate: string;
  location: string;
  category: string;
  availability: string;
  created_at: string;
  profiles: { name: string } | null;
}

const OfferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { addNotification } = useData();
  const [offer, setOffer] = useState<OfferWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      const { data, error } = await supabase
        .from('skill_offers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (!error && data) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', data.user_id)
          .maybeSingle();
        
        setOffer({
          ...data,
          profiles: profileData || null
        });
      }
      setLoading(false);
    };

    if (id) fetchOffer();
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

  if (!offer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Offer not found</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleBook = async () => {
    const { error } = await addNotification({
      user_id: offer.user_id,
      type: 'new_request',
      title: 'New Booking Request',
      message: `${profile?.name || user.email} wants to book your skill: "${offer.title}"`,
      read: false,
      requester_id: user.id,
      related_post_id: offer.id,
      related_post_type: 'offer',
      status: 'pending',
    });
    
    if (error) {
      toast.error('Failed to send booking request');
    } else {
      toast.success('Your booking request has been sent!');
      navigate('/dashboard');
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('skill_offers')
      .delete()
      .eq('id', offer.id);
    
    if (error) {
      toast.error('Failed to delete offer');
    } else {
      toast.success('Offer deleted successfully');
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
            <CardTitle className="text-2xl text-foreground">{offer.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{offer.description}</p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Rate</p>
                  <p className="font-medium text-foreground">{offer.rate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Offered by</p>
                  <p className="font-medium text-foreground">{offer.profiles?.name || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{offer.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{offer.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <p className="font-medium text-foreground">{offer.availability}</p>
                </div>
              </div>
            </div>

            {offer.user_id !== user.id ? (
              <Button className="w-full" onClick={handleBook}>
                Book This Skill
              </Button>
            ) : (
              <Button variant="destructive" className="w-full" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Offer
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfferDetail;
