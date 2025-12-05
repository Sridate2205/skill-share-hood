import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SkillRequest, SkillOffer, Notification } from '@/types';

interface DataContextType {
  requests: SkillRequest[];
  offers: SkillOffer[];
  notifications: Notification[];
  addRequest: (request: Omit<SkillRequest, 'id' | 'createdAt'>) => void;
  addOffer: (offer: Omit<SkillOffer, 'id' | 'createdAt'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  getUnreadCount: (userId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<SkillRequest[]>([]);
  const [offers, setOffers] = useState<SkillOffer[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const storedRequests = localStorage.getItem('skillRequests');
    const storedOffers = localStorage.getItem('skillOffers');
    const storedNotifications = localStorage.getItem('notifications');
    
    if (storedRequests) setRequests(JSON.parse(storedRequests));
    if (storedOffers) setOffers(JSON.parse(storedOffers));
    if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
  }, []);

  const addRequest = (request: Omit<SkillRequest, 'id' | 'createdAt'>) => {
    const newRequest: SkillRequest = {
      ...request,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...requests, newRequest];
    setRequests(updated);
    localStorage.setItem('skillRequests', JSON.stringify(updated));
  };

  const addOffer = (offer: Omit<SkillOffer, 'id' | 'createdAt'>) => {
    const newOffer: SkillOffer = {
      ...offer,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...offers, newOffer];
    setOffers(updated);
    localStorage.setItem('skillOffers', JSON.stringify(updated));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...notifications, newNotification];
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const getUnreadCount = (userId: string) => {
    return notifications.filter(n => n.userId === userId && !n.read).length;
  };

  return (
    <DataContext.Provider value={{ 
      requests, 
      offers, 
      notifications, 
      addRequest, 
      addOffer, 
      addNotification,
      markNotificationRead,
      getUnreadCount
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
