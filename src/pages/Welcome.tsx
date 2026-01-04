import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HandHeart, Users, MapPin, MessageSquare, HelpCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Welcome to SkillShare Connect! 🎉
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              You're now part of a community that helps neighbors connect, share skills, and support each other.
            </p>
          </div>

          {/* What You Can Do */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground text-center">Here's what you can do:</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <HandHeart className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Request Help</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Need help with something? Post a request and let your neighbors know what skills you're looking for - from home repairs to tutoring, gardening to tech support.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Offer Your Skills</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Share your expertise with the community! Create an offer listing your skills, availability, and rates to help your neighbors.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Connect Locally</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Find helpers and help opportunities right in your neighborhood. Build meaningful connections with people nearby.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Express Interest</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    See a request or offer that interests you? Express your interest to start a conversation and arrange the details.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Tips */}
          <Card className="border-border bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Quick Tips to Get Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Browse the dashboard to see what your neighbors need help with</li>
                <li>• Check out the skills being offered in your area</li>
                <li>• Create your first post - whether it's a request or an offer</li>
                <li>• Visit the Help page if you need assistance using the app</li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center pt-4">
            <Button size="lg" onClick={handleGetStarted} className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
