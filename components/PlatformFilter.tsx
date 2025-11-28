'use client';

import React from 'react';

export type PlatformSelection = {
  [key: string]: boolean;
  polymarket: boolean;
  kalshi: boolean;
  manifold: boolean;
};

interface PlatformFilterProps {
  selectedPlatforms: PlatformSelection;
  onPlatformChange: (platform: keyof PlatformSelection, isChecked: boolean) => void;
}

const platformDisplayInfo: Record<keyof PlatformSelection, { label: string; color: string; }> = {
  polymarket: { label: 'Polymarket', color: 'var(--polymarket-color)' },
  kalshi: { label: 'Kalshi', color: 'var(--kalshi-color)' },
  manifold: { label: 'Manifold', color: 'var(--manifold-color)' },
};

export default function PlatformFilter({ selectedPlatforms, onPlatformChange }: PlatformFilterProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <span className="text-sm font-medium text-gray-700">Filter by platform:</span>
      <div className="flex items-center space-x-4">
        {(Object.keys(selectedPlatforms) as Array<keyof PlatformSelection>).map((platform) => (
          <label key={platform} className="flex items-center space-x-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={selectedPlatforms[platform]}
              onChange={(e) => onPlatformChange(platform, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 focus:ring-0"
              style={{ accentColor: platformDisplayInfo[platform].color }}
            />
            <span style={{ color: platformDisplayInfo[platform].color }} className="font-semibold">
              {platformDisplayInfo[platform].label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
