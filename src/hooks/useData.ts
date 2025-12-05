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
}

export const useData = () => {
  const [requests, setRequests] = useState<SkillRequest[]>([]);
  const [offers, setOffers] = useState<SkillOffer[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('skill_requests')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setRequests(data);
    }
  };

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from('skill_offers')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOffers(data);
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
    getUnreadCount,
    fetchNotifications,
    fetchRequests,
    fetchOffers
  };
};
