// hooks/useRealtimePlacedObjects.ts
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useWorldStore } from '@/components/action/perform/worldStore';
import { tempUserId } from '@/lib/user';
import { tempClientId } from '@/lib/user'

type PlacedObject = {
  id: string
  type: PlaceableType
  position: [number, number, number]
  client_id?: string // mark optional if not always present
}



type PlaceableType = 'Box' | 'Chair' 

export function useRealtimePlacedObjects() {
    const addObject = useWorldStore(state => state.addPlacedObject);
    const removeObject = useWorldStore(state => state.removePlacedObject);

    useEffect(() => {
        const channel = supabase
            .channel('room_updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'placed_objects',
                    filter: `user_id=eq.${tempUserId}`
                },
                payload => {
                    const { eventType, new: newData, old: oldData } = payload;
                    if ((newData as PlacedObject).client_id === tempClientId) return;


                    if (eventType === 'INSERT') addObject(newData as PlacedObject);
                    if (eventType === 'DELETE') removeObject((oldData as PlacedObject).id);
                    if (eventType === 'UPDATE') {
                        removeObject((oldData as PlacedObject).id);
                        addObject(newData as PlacedObject);
                    }

                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);
}
