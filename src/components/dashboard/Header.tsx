import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

export const Header = () => {
  const { user, profile, logout } = useAuth();
  const { getUnreadCount, fetchNotifications, notifications } = useData();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user]);

  const unreadCount = user ? getUnreadCount(user.id) : 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 
            className="text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            SkillShare Connect
          </h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="relative w-fit"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">{profile?.name || user?.email}</span>
          <Button onClick={() => navigate('/create-post')} className="mt-2">
            Post Request or Offer
          </Button>
        </div>
      </div>
    </header>
  );
};
