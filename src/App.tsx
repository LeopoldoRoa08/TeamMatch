import { useState, useMemo, useEffect } from 'react';
import { Screen, SportEvent } from './types';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { MapScreen } from './screens/MapScreen';
import { CreateEventScreen } from './screens/CreateEventScreen';
import { EventDetailScreen } from './screens/EventDetailScreen';
import { MyEventsScreen } from './screens/MyEventsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { Logo } from './components/Logo';
import { Laptop, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { events as initialEvents } from './data';
import { supabase } from './lib/supabase';

export default function App() {
  const [started, setStarted] = useState(false);
  const [screen, setScreen] = useState<Screen>("map");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [allEvents, setAllEvents] = useState<SportEvent[]>(initialEvents);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setAllEvents(data as SportEvent[]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    }

    fetchEvents();

    const channel = supabase
      .channel('events-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
        if (payload.eventType === 'UPDATE') {
          setAllEvents(prev => prev.map(e => e.id === payload.new.id ? { ...e, ...payload.new } : e));
        } else if (payload.eventType === 'INSERT') {
          setAllEvents(prev => [payload.new as SportEvent, ...prev]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const selected = useMemo(() => 
    allEvents.find(e => e.id === selectedId) || null
  , [allEvents, selectedId]);

  const openDetail = (e: SportEvent) => {
    setSelectedId(e.id);
    setScreen("detail");
  };

  const handleJoinEvent = (eventId: string) => {
    // La actualización real ocurre en EventDetailScreen.tsx
  };

  const renderScreen = () => {
    if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;
    if (creating) return <CreateEventScreen onClose={() => setCreating(false)} />;
    
    if (screen === "detail" && selected)
      return <EventDetailScreen event={selected} onBack={() => setScreen("map")} onJoin={handleJoinEvent} />;
    if (screen === "events") return <MyEventsScreen onSelect={openDetail} events={allEvents} />;
    if (screen === "profile") return <ProfileScreen />;
    
    return <MapScreen onSelect={openDetail} events={allEvents} />;
  };

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <div className="hidden lg:grid grid-cols-[1fr,500px] h-screen overflow-hidden">
        <aside className="relative flex flex-col justify-center p-20 bg-secondary overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="relative z-10 space-y-12 max-w-xl">
            <Logo size={42} />
            <div className="space-y-6">
              <h1 className="font-display text-8xl font-black tracking-tighter leading-[0.85] text-white">
                ARMA TU<br /><span className="text-primary italic">CUADRA.</span><br />JUEGA YA.
              </h1>
              <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-lg">
                Teammatch conecta jugadores y organizadores de eventos deportivos en Caracas.
              </p>
            </div>
          </div>
        </aside>

        <div className="relative flex items-center justify-center bg-black">
          <div className="relative h-[850px] w-[400px] overflow-hidden rounded-[3rem] border-[10px] border-zinc-900 shadow-pop">
            <div className="absolute top-0 left-1/2 z-[60] h-7 w-36 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />
            <div className="h-full w-full bg-secondary overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={started ? (creating ? 'creating' : screen) : 'welcome'}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  {renderScreen()}
                </motion.div>
              </AnimatePresence>
              
              {started && !creating && screen !== "detail" && (
                <BottomNav
                  current={screen}
                  onChange={setScreen}
                  onCreate={() => setCreating(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden h-screen w-full bg-secondary overflow-hidden">
        {renderScreen()}
        {started && !creating && screen !== "detail" && (
          <BottomNav current={screen} onChange={setScreen} onCreate={() => setCreating(true)} />
        )}
      </div>
    </main>
  );
}
