import { MapPin, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillRequest } from '@/types';
import { useNavigate } from 'react-router-dom';

interface RequestCardProps {
  request: SkillRequest;
}

export const RequestCard = ({ request }: RequestCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-border bg-card hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">{request.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span>{request.compensation}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Posted by {request.userName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{request.location}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/request/${request.id}`)}
        >
          View & Help
        </Button>
      </CardFooter>
    </Card>
  );
};
