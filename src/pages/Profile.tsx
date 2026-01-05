import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, MapPin, Mail, Save, ArrowLeft, FileText, Handshake } from 'lucide-react';

interface SkillRequest {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
}

interface SkillOffer {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

const Profile = () => {
  const { user, profile, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState(profile?.name || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [myRequests, setMyRequests] = useState<SkillRequest[]>([]);
  const [myOffers, setMyOffers] = useState<SkillOffer[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setLocation(profile.location);
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  const fetchMyPosts = async () => {
    if (!user) return;
    setLoadingPosts(true);
    
    const [requestsRes, offersRes] = await Promise.all([
      supabase
        .from('skill_requests')
        .select('id, title, category, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('skill_offers')
        .select('id, title, category, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]);

    if (requestsRes.data) setMyRequests(requestsRes.data);
    if (offersRes.data) setMyOffers(offersRes.data);
    setLoadingPosts(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      name,
      location,
      avatar_url: avatarUrl || null,
    });
    setSaving(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Profile
              </CardTitle>
              <CardDescription>
                View and edit your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={name} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {name?.charAt(0).toUpperCase() || <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full max-w-md">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a URL to an image for your avatar
                  </p>
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Your neighbourhood or city"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          {/* My Posts Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Posts
              </CardTitle>
              <CardDescription>
                Your requests and offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="requests">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="requests" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Requests ({myRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="offers" className="gap-2">
                    <Handshake className="h-4 w-4" />
                    Offers ({myOffers.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="requests" className="mt-4">
                  {loadingPosts ? (
                    <p className="text-muted-foreground text-center py-4">Loading...</p>
                  ) : myRequests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      You haven't posted any requests yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {myRequests.map((request) => (
                        <button
                          key={request.id}
                          onClick={() => navigate(`/request/${request.id}`)}
                          className="w-full text-left p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-foreground">{request.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{request.category}</Badge>
                              <Badge variant={request.status === 'open' ? 'default' : 'secondary'}>
                                {request.status}
                              </Badge>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="offers" className="mt-4">
                  {loadingPosts ? (
                    <p className="text-muted-foreground text-center py-4">Loading...</p>
                  ) : myOffers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      You haven't posted any offers yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {myOffers.map((offer) => (
                        <button
                          key={offer.id}
                          onClick={() => navigate(`/offer/${offer.id}`)}
                          className="w-full text-left p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-foreground">{offer.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(offer.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline">{offer.category}</Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
