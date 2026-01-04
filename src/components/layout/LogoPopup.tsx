import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, MapPin, Shield } from 'lucide-react';

interface LogoPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LogoPopup = ({ open, onOpenChange }: LogoPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            SkillShare Connect
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Community Platform
            </Badge>
            <p className="text-muted-foreground">
              A neighborhood-based platform connecting people who need help with those who can provide it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Users className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium text-foreground">Share Skills</span>
              <span className="text-xs text-muted-foreground">Help neighbors</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Heart className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium text-foreground">Get Help</span>
              <span className="text-xs text-muted-foreground">Request assistance</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <MapPin className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium text-foreground">Local Focus</span>
              <span className="text-xs text-muted-foreground">Your neighborhood</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Shield className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium text-foreground">Safe & Trusted</span>
              <span className="text-xs text-muted-foreground">Community verified</span>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
            <p>Building stronger communities through skill sharing</p>
            <p className="mt-1">© 2024 SkillShare Connect</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
