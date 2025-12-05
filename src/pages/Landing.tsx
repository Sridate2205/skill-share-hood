import { AuthForms } from '@/components/auth/AuthForms';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Users, HandHeart, Shield, MapPin } from 'lucide-react';

const Landing = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left Side - Description */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                SkillShare Connect
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with your neighbors to share skills, request help, and build a stronger community.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">What you can do:</h2>
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <HandHeart className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Request Help</h3>
                    <p className="text-sm text-muted-foreground">Post requests for skills you need - from home repairs to tutoring.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <Users className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Offer Your Skills</h3>
                    <p className="text-sm text-muted-foreground">Share your expertise with neighbors and earn compensation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-foreground">Local Connections</h3>
                    <p className="text-sm text-muted-foreground">Find help and helpers right in your neighborhood.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground text-sm">Important Note</h3>
                  <p className="text-xs text-muted-foreground">
                    This platform facilitates connections between neighbors. Always meet in safe, public places and verify identities before any transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="flex justify-center lg:justify-end">
            <AuthForms />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
