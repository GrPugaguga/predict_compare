import React from 'react';
import { MarketEvent } from '@/lib/compare_service/dto';
import Image from 'next/image';

interface EventCardProps {
  event: MarketEvent;
}

const formatVolume = (volume: number) => {
  if (volume > 1_000_000) {
    return `$${(volume / 1_000_000).toFixed(1)}M`;
  }
  if (volume > 1_000) {
    return `$${(volume / 1_000).toFixed(1)}K`;
  }
  return `$${volume}`;
};

export default function EventCard({ event }: EventCardProps) {
  const platformStyles = {
    polymarket: {
      shadow: 'var(--shadow-polymarket)',
      color: 'var(--polymarket-color)',
    },
    kalshi: {
      shadow: 'var(--shadow-kalshi)',
      color: 'var(--kalshi-color)',
    },
    manifold: {
      shadow: 'var(--shadow-manifold)',
      color: 'var(--manifold-color)',
    },
  };

  const style = {
    '--shadow-color': platformStyles[event.platform].shadow,
    '--platform-color': platformStyles[event.platform].color,
  } as React.CSSProperties;

  return (
    <a
      href={event.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-full rounded-xl border-2 border-[color:var(--platform-color)]/30 bg-white p-4 transition-all duration-300 ease-in-out shadow-[0_4px_14px_0_var(--shadow-color)] hover:shadow-xl hover:-translate-y-1"
      style={style}
    >
      <div className="relative h-40 w-full rounded-lg overflow-hidden">
        {event.image ? (
          <Image src={event.image} alt={event.title} layout="fill" objectFit="cover" className="bg-gray-100" />
        ) : (
          <div className="h-full w-full" style={{ backgroundColor: 'var(--platform-color)' }}></div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--platform-color)' }}>
          {event.platform}
        </p>
        <h3 className="mt-1 font-bold text-base text-gray-900 leading-tight truncate">{event.title}</h3>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <div>
          <span className="font-semibold">Volume:</span> {formatVolume(event.volume)}
        </div>
        <div>
          <span className="font-semibold">Ends:</span> {event.endDate}
        </div>
      </div>
      <div className="mt-4 border-t border-gray-100 pt-3">
        {event.markets.slice(0, 2).map((market, index) => (
          <div key={index} className="mt-2 first:mt-0">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 truncate pr-2">{market.title}</span>
              <span className="font-bold text-base" style={{ color: 'var(--platform-color)' }}>
                {(market.YES*1).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </a>
  );
}
