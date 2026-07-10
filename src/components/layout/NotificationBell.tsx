'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export function NotificationBell({ lang = 'es' }: { lang?: 'es' | 'pt' }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data);
      }
      setIsLoading(false);
    };

    fetchNotifications();

    // Suscripción a nuevas notificaciones en tiempo real (opcional)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Cerrar el dropdown al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // Actualizar optimista
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    // Actualizar en BD
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user?.id)
      .eq('is_read', false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors"
      >
        <span className="material-icons-round">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-background-dark"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden flex flex-col max-h-[80vh]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
            <h3 className="font-bold text-text-light dark:text-white">
              {lang === 'es' ? 'Notificaciones' : 'Notificações'}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:text-primary-dark font-medium"
              >
                {lang === 'es' ? 'Marcar todo leído' : 'Marcar tudo lido'}
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 p-2">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">Cargando...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                  <span className="material-icons-round text-2xl">notifications_none</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {lang === 'es' ? 'No tienes notificaciones' : 'Sem notificações'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative rounded-xl overflow-hidden transition-colors ${
                      notification.is_read
                        ? 'opacity-70 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        : 'bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20'
                    }`}
                  >
                    {notification.link ? (
                      <Link
                        href={notification.link}
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="block p-4"
                      >
                        <NotificationContent notification={notification} />
                      </Link>
                    ) : (
                      <div
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-4 cursor-pointer"
                      >
                        <NotificationContent notification={notification} />
                      </div>
                    )}
                    {!notification.is_read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationContent({ notification }: { notification: Notification }) {
  return (
    <div className="flex flex-col gap-1 pl-2">
      <h4 className="text-sm font-bold text-text-light dark:text-gray-100 leading-tight">
        {notification.title}
      </h4>
      <p className="text-xs text-text-dark dark:text-gray-400 leading-relaxed">
        {notification.message}
      </p>
      <span className="text-[10px] text-gray-400 mt-1">
        {new Date(notification.created_at).toLocaleString()}
      </span>
    </div>
  );
}
