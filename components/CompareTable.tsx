'use client';

import React from 'react';
import { MarketEvent } from '@/lib/compare_service/dto';


export interface MatchedEvent {
  event: MarketEvent;
  score: number;
  displayTitle: string;
}

interface CompareTableProps {
  results: MatchedEvent[];
}

const formatSpread = (spread: number): string => {
  if (spread > 0) {
    return `+${(spread ).toFixed(0)}%`;
  }
  return `${(spread ).toFixed(0)}%`;
};

export default function CompareTable({ results }: CompareTableProps) {
  if (!results || results.length === 0) {
    return null;
  }

  const probabilities = results.map(r => r.event.markets[0].YES);
  const minProb = Math.min(...probabilities);
  const maxProb = Math.max(...probabilities);

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Platform</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Market</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Probability</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Spread</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Score</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Link</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {results.map(({ event, score, displayTitle }) => {
                const currentProb = event.markets[0].YES;
                const spreadVsMax = currentProb - maxProb;
                const spreadVsMin = currentProb - minProb;
                const displaySpread = currentProb === maxProb ? spreadVsMin : spreadVsMax;

                return (
                  <tr key={event.link}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <span className="font-bold" style={{ color: `var(--${event.platform}-color)` }}>
                        {event.platform.charAt(0).toUpperCase() + event.platform.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-700">
                      <div>
                        <div className="font-medium text-gray-900">{displayTitle}</div>
                        {event.title !== displayTitle && (
                          <div className="text-gray-500">{event.title}</div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-bold">{currentProb.toFixed(2)}%</td>
                    <td className={`whitespace-nowrap px-3 py-4 text-sm font-medium ${displaySpread >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatSpread(displaySpread)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{score.toFixed(4)}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                        Open<span className="sr-only">, {displayTitle}</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
