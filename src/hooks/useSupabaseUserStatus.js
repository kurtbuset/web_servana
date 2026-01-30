import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Optional: Listen to Supabase Realtime changes on sys_user.last_seen
 * This is in addition to Socket.IO real-time updates
 */
export const useSupabaseUserStatus = (onStatusChange) => {
  useEffect(() => {
    // Subscribe to changes on sys_user table
    const channel = supabase
      .channel('user-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sys_user',
          filter: 'last_seen=not.is.null'
        },
        (payload) => {
          console.log('Supabase Realtime: User status changed', payload);
          
          if (onStatusChange) {
            onStatusChange({
              userId: payload.new.sys_user_id,
              lastSeen: payload.new.last_seen
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onStatusChange]);
};
