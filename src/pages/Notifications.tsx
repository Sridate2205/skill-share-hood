import { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Bell, Check, X, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { supabase } from '@/integrations/supabase/client';

const Notifications = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { notifications, markNotificationRead, respondToRequest, fetchNotifications } = useData();

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userNotifications = notifications.filter(n => n.user_id === user.id);

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

  const handleNotificationClick = async (id: string) => {
    await markNotificationRead(id);
  };

  const handleAccept = async (notification: typeof notifications[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await respondToRequest(notification, true);
    if (error) {
      toast.error('Failed to accept request');
    } else {
      toast.success('Request accepted! The user has been notified.');
    }
  };

  const handleReject = async (notification: typeof notifications[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await respondToRequest(notification, false);
    if (error) {
      toast.error('Failed to decline request');
    } else {
      toast.success('Request declined. The user has been notified.');
    }
  };

  const getStatusBadge = (status: string | null | undefined) => {
    if (status === 'accepted') {
      return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Accepted</Badge>;
    }
    if (status === 'denied') {
      return <Badge variant="destructive">Declined</Badge>;
    }
    return null;
  };

  const readNotifications = userNotifications.filter(n => n.read);

  const handleClearOldNotifications = async () => {
    if (readNotifications.length === 0) {
      toast.info('No old notifications to clear');
      return;
    }

    const readIds = readNotifications.map(n => n.id);
    const { error } = await supabase
      .from('notifications')
      .delete()
      .in('id', readIds);

    if (error) {
      toast.error('Failed to clear notifications');
    } else {
      toast.success(`Cleared ${readIds.length} old notification(s)`);
      fetchNotifications(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Notification Centre</h1>
          {readNotifications.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearOldNotifications}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Old ({readNotifications.length})
            </Button>
          )}
        </div>

        <div className="space-y-4 max-w-2xl">
          {userNotifications.length > 0 ? (
            userNotifications.map(notification => (
              <Card 
                key={notification.id} 
                className={`border-border bg-card cursor-pointer transition-all ${!notification.read ? 'ring-2 ring-primary/20' : ''}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-medium text-foreground">{notification.title}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(notification.status)}
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                    
                    {/* Show accept/reject buttons for pending incoming requests */}
                    {notification.type === 'new_request' && 
                     notification.status === 'pending' && 
                     notification.requester_id && (
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          onClick={(e) => handleAccept(notification, e)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={(e) => handleReject(notification, e)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
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