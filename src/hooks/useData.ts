import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SkillRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  compensation: string;
  location: string;
  category: string;
  status: string;
  created_at: string;
  profiles?: { name: string } | null;
}

interface SkillOffer {
  id: string;
  user_id: string;
  title: string;
  description: string;
  rate: string;
  location: string;
  category: string;
  availability: string;
  created_at: string;
  profiles?: { name: string } | null;
}

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  requester_id?: string | null;
  related_post_id?: string | null;
  related_post_type?: string | null;
  status?: string | null;
}

export const useData = () => {
  const [requests, setRequests] = useState<SkillRequest[]>([]);
  const [offers, setOffers] = useState<SkillOffer[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data: requestsData, error: requestsError } = await supabase
      .from('skill_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!requestsError && requestsData) {
      const userIds = [...new Set(requestsData.map(r => r.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);
      
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, { name: p.name }]) || []);
      const requestsWithProfiles = requestsData.map(r => ({
        ...r,
        profiles: profilesMap.get(r.user_id) || null
      }));
      setRequests(requestsWithProfiles);
    }
  };

  const fetchOffers = async () => {
    const { data: offersData, error: offersError } = await supabase
      .from('skill_offers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!offersError && offersData) {
      const userIds = [...new Set(offersData.map(o => o.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);
      
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, { name: p.name }]) || []);
      const offersWithProfiles = offersData.map(o => ({
        ...o,
        profiles: profilesMap.get(o.user_id) || null
      }));
      setOffers(offersWithProfiles);
    }
  };

  const fetchNotifications = async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setNotifications(data);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchRequests(), fetchOffers()]);
      setLoading(false);
    };
    loadData();

    // Subscribe to realtime notifications
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addRequest = async (request: Omit<SkillRequest, 'id' | 'created_at' | 'profiles'>) => {
    const { error } = await supabase.from('skill_requests').insert(request);
    if (!error) await fetchRequests();
    return { error };
  };

  const addOffer = async (offer: Omit<SkillOffer, 'id' | 'created_at' | 'profiles'>) => {
    const { error } = await supabase.from('skill_offers').insert(offer);
    if (!error) await fetchOffers();
    return { error };
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('notifications').insert(notification);
    return { error };
  };

  const markNotificationRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  const respondToRequest = async (notification: Notification, accepted: boolean) => {
    // Update the original notification status
    const { error: updateError } = await supabase
      .from('notifications')
      .update({ status: accepted ? 'accepted' : 'denied', read: true })
      .eq('id', notification.id);

    if (updateError) return { error: updateError };

    // Fetch the post title for the response notification
    let postTitle = 'your request';
    if (notification.related_post_id && notification.related_post_type) {
      const table = notification.related_post_type === 'request' ? 'skill_requests' : 'skill_offers';
      const { data: postData } = await supabase
        .from(table)
        .select('title')
        .eq('id', notification.related_post_id)
        .maybeSingle();
      if (postData) postTitle = postData.title;
    }

    // Send notification to the requester
    if (notification.requester_id) {
      const { error: notifyError } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.requester_id,
          type: accepted ? 'accepted' : 'denied',
          title: accepted ? 'Request Accepted!' : 'Request Declined',
          message: accepted 
            ? `Your request for "${postTitle}" has been accepted!`
            : `Your request for "${postTitle}" has been declined.`,
          read: false,
          status: accepted ? 'accepted' : 'denied',
        });
      
      if (notifyError) return { error: notifyError };
    }

    // Update local state
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, status: accepted ? 'accepted' : 'denied', read: true } : n)
    );

    return { error: null };
  };

  const getUnreadCount = (userId: string) => {
    return notifications.filter(n => n.user_id === userId && !n.read).length;
  };

  return {
    requests,
    offers,
    notifications,
    loading,
    addRequest,
    addOffer,
    addNotification,
    markNotificationRead,
    respondToRequest,
    getUnreadCount,
    fetchNotifications,
    fetchRequests,
    fetchOffers
  };
};
