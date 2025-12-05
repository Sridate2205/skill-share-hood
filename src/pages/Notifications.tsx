import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, markNotificationRead } = useData();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userNotifications = notifications.filter(n => n.userId === user.id);

  const getIcon = (type: string) => {
    switch (type) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'denied':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Notification Centre</h1>

        <div className="space-y-4 max-w-2xl">
          {userNotifications.length > 0 ? (
            userNotifications.map(notification => (
              <Card 
                key={notification.id} 
                className={`border-border bg-card cursor-pointer transition-all ${!notification.read ? 'ring-2 ring-primary/20' : ''}`}
                onClick={() => markNotificationRead(notification.id)}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{notification.title}</h3>
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
