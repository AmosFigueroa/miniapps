import React from 'react';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { OrgEvent, ThemeConfig } from '../types';

interface EventCardProps {
  event: OrgEvent;
  theme: ThemeConfig;
}

const EventCard: React.FC<EventCardProps> = ({ event, theme }) => {
  return (
    <div 
      className="relative group h-full flex flex-col rounded-xl border-2 border-white transition-all duration-200 hover:-translate-y-1"
      style={{ 
        backgroundColor: theme.colors.secondary,
        boxShadow: `8px 8px 0px 0px ${theme.colors.accent}`
      }}
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg border-b-2 border-white/20">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <div 
          className="absolute top-3 right-3 px-3 py-1 rounded border-2 border-black text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          style={{ 
            backgroundColor: event.status === 'upcoming' ? theme.colors.accent : '#cbd5e1',
            color: '#000'
          }}
        >
          {event.status}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col text-white">
        <h3 className="text-xl font-extrabold mb-3 leading-tight">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-5 text-sm font-medium opacity-90">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-yellow-300" />
            <span>{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-300" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-yellow-300" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="text-sm opacity-80 mb-6 line-clamp-2 flex-1 leading-relaxed">
          {event.description}
        </p>

        <button 
          className="w-full py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all hover:brightness-110 active:translate-y-0.5"
          style={{ 
            backgroundColor: theme.colors.accent, 
            color: '#000',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.3)'
          }}
        >
          Daftar Sekarang <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EventCard;