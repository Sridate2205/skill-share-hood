import { MapPin, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillOffer } from '@/types';
import { useNavigate } from 'react-router-dom';

interface OfferCardProps {
  offer: SkillOffer;
}

export const OfferCard = ({ offer }: OfferCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-border bg-card hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">{offer.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{offer.rate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Posted by {offer.userName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{offer.location}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/offer/${offer.id}`)}
        >
          View & Book
        </Button>
      </CardFooter>
    </Card>
  );
};
