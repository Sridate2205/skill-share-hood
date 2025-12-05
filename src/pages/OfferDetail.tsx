import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, User, Clock, Calendar, Tag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

const OfferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { offers, addNotification } = useData();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const offer = offers.find(o => o.id === id);

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

  const handleBook = () => {
    addNotification({
      userId: offer.userId,
      type: 'new_request',
      title: 'New Booking Request',
      message: `${user.name} wants to book your skill: "${offer.title}"`,
      read: false,
    });
    toast.success('Your booking request has been sent!');
    navigate('/dashboard');
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
                  <p className="font-medium text-foreground">{offer.userName}</p>
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

            {offer.userId !== user.id && (
              <Button className="w-full" onClick={handleBook}>
                Book This Skill
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfferDetail;
