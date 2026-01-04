import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Heart, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">About SkillShare Connect</h1>
            <p className="text-xl text-muted-foreground">
              Building stronger communities through skill sharing
            </p>
          </div>

          {/* Mission */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <p>
                SkillShare Connect was created with a simple yet powerful vision: to strengthen neighborhood bonds by making it easy for people to share their skills and help each other.
              </p>
              <p>
                We believe that every community has an abundance of talent and expertise waiting to be shared. Whether you need help fixing a leaky faucet, learning a new language, or setting up a computer, there's likely someone nearby who can help.
              </p>
            </CardContent>
          </Card>

          {/* What We Do */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                What We Do
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-medium text-foreground mb-2">Connect Neighbors</h3>
                  <p className="text-sm text-muted-foreground">
                    We provide a platform where neighbors can find and connect with each other based on skills and needs.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-medium text-foreground mb-2">Facilitate Skill Exchange</h3>
                  <p className="text-sm text-muted-foreground">
                    Post requests for help or offer your skills to others. It's a two-way street of community support.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-medium text-foreground mb-2">Build Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Beyond transactions, we help foster real connections between people who live near each other.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-medium text-foreground mb-2">Empower Individuals</h3>
                  <p className="text-sm text-muted-foreground">
                    Everyone has something to offer. We help people recognize and share their valuable skills.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Values */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-foreground">Community First:</strong> Everything we do is to strengthen local communities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-foreground">Trust & Safety:</strong> We encourage safe practices and meeting in public places.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-foreground">Inclusivity:</strong> Everyone has skills to share and everyone deserves help when needed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong className="text-foreground">Simplicity:</strong> We keep things simple so anyone can use our platform easily.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Safety Notice */}
          <Card className="border-border bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Safety First
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                While we facilitate connections, we encourage all users to practice safety. Always meet in public places for initial meetings, verify identities, and trust your instincts. SkillShare Connect is a platform for connection – the responsibility for safe interactions lies with the individuals involved.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
