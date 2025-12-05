import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addRequest, addOffer } = useData();
  
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    compensation: '',
    category: '',
  });
  
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    rate: '',
    category: '',
    availability: '',
  });

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      ...requestForm,
      userId: user.id,
      userName: user.name,
      location: user.location,
      status: 'open',
    });
    toast.success('Request posted successfully!');
    navigate('/dashboard');
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOffer({
      ...offerForm,
      userId: user.id,
      userName: user.name,
      location: user.location,
    });
    toast.success('Offer posted successfully!');
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
            <CardTitle className="text-foreground">Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">Request Help</TabsTrigger>
                <TabsTrigger value="offer">Offer Skill</TabsTrigger>
              </TabsList>
              
              <TabsContent value="request">
                <form onSubmit={handleRequestSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="req-title">Title</Label>
                    <Input
                      id="req-title"
                      value={requestForm.title}
                      onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                      placeholder="What do you need help with?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="req-desc">Description</Label>
                    <Textarea
                      id="req-desc"
                      value={requestForm.description}
                      onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                      placeholder="Describe your request in detail..."
                      required
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="req-compensation">Compensation</Label>
                    <Input
                      id="req-compensation"
                      value={requestForm.compensation}
                      onChange={(e) => setRequestForm({ ...requestForm, compensation: e.target.value })}
                      placeholder="e.g., $50, Trade, Volunteer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="req-category">Category</Label>
                    <Input
                      id="req-category"
                      value={requestForm.category}
                      onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })}
                      placeholder="e.g., Home Repair, Tutoring, Moving"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Post Request</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="offer">
                <form onSubmit={handleOfferSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="offer-title">Skill Title</Label>
                    <Input
                      id="offer-title"
                      value={offerForm.title}
                      onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                      placeholder="What skill are you offering?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offer-desc">Description</Label>
                    <Textarea
                      id="offer-desc"
                      value={offerForm.description}
                      onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                      placeholder="Describe your skill and experience..."
                      required
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offer-rate">Rate</Label>
                    <Input
                      id="offer-rate"
                      value={offerForm.rate}
                      onChange={(e) => setOfferForm({ ...offerForm, rate: e.target.value })}
                      placeholder="e.g., $25/hour, Negotiable"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offer-category">Category</Label>
                    <Input
                      id="offer-category"
                      value={offerForm.category}
                      onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value })}
                      placeholder="e.g., Plumbing, Teaching, Cooking"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offer-availability">Availability</Label>
                    <Input
                      id="offer-availability"
                      value={offerForm.availability}
                      onChange={(e) => setOfferForm({ ...offerForm, availability: e.target.value })}
                      placeholder="e.g., Weekends, Evenings"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Post Offer</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
