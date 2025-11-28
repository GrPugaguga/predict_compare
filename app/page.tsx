'use client';

import { useState, useEffect, useCallback } from 'react';
import EventCard from '@/components/EventCard';
import SearchInput from '@/components/SearchInput';
import CompareTable, { MatchedEvent } from '@/components/CompareTable';
import PlatformFilter, { PlatformSelection } from '@/components/PlatformFilter';
import { MarketEvent } from '@/lib/compare_service/dto';
import { findBestMatch, Searchable } from '@/lib/bm25';

const SEARCH_THRESHOLD = 0.01;

async function fetcher(url: string): Promise<MarketEvent[] | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch ${url}:`, await res.text());
      return null;
    }
    const data = await res.json();
    if (data.message) {
      console.error(`API at ${url} returned an error:`, data.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`An error occurred while fetching ${url}:`, error);
    return null;
  }
}

export default function Home() {
  const [trends, setTrends] = useState<MarketEvent[]>([]);
  const [searchResults, setSearchResults] = useState<MatchedEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformSelection>({
    polymarket: true,
    kalshi: true,
    manifold: true,
  });

  useEffect(() => {
    const loadTrends = async () => {
      setIsLoading(true);
      const data = await fetcher('/api/trends');
      if (data) {
        data.sort((a, b) => b.volume - a.volume);
        setTrends(data);
      }
      setIsLoading(false);
    };
    loadTrends();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    const rawEvents = await fetcher(`/api/search?q=${encodeURIComponent(query)}`);
    const finalResults: MatchedEvent[] = [];
    if (rawEvents) {
      for (const event of rawEvents) {
        if (event.markets.length === 1) {
          const bestMatch = findBestMatch(query, [{ id: 'main', text: event.title }]);
          if (bestMatch && bestMatch.score > SEARCH_THRESHOLD) {
            finalResults.push({ event, score: bestMatch.score, displayTitle: event.title });
          }
        } else {
          const searchableMarkets: Searchable[] = event.markets.map((market, index) => ({
            id: index.toString(),
            text: `${event.title} ${market.title}`,
          }));
          const bestMarketMatch = findBestMatch(query, searchableMarkets);
          if (bestMarketMatch && bestMarketMatch.score > SEARCH_THRESHOLD) {
            const bestMarketIndex = parseInt(bestMarketMatch.id, 10);
            const bestMarket = event.markets[bestMarketIndex];
            const collapsedEvent: MarketEvent = { ...event, markets: [bestMarket] };
            finalResults.push({ event: collapsedEvent, score: bestMarketMatch.score, displayTitle: bestMarket.title });
          }
        }
      }
    }
    finalResults.sort((a, b) => b.score - a.score);
    setSearchResults(finalResults);
    setIsSearching(false);
  }, []);
  
  const handlePlatformChange = (platform: keyof PlatformSelection, isChecked: boolean) => {
    setSelectedPlatforms(prev => ({ ...prev, [platform]: isChecked }));
  };

  const filteredTrends = trends.filter(trend => selectedPlatforms[trend.platform]);
  const dataToDisplay = searchResults !== null ? searchResults : filteredTrends;

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
          Search Markets
        </h1>
        <SearchInput onSearchChange={handleSearch} />
      </div>
      
      {isSearching ? <p className="text-center">Searching...</p> : (
        <>
          {searchResults !== null ? (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
                Search Results
              </h2>
              <CompareTable results={searchResults} />
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Trending Markets
                </h2>
                <PlatformFilter selectedPlatforms={selectedPlatforms} onPlatformChange={handlePlatformChange} />
              </div>
              {isLoading ? <p>Loading trends...</p> : (
                filteredTrends.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTrends.map((event) => (
                      <EventCard key={`${event.platform}-${event.link}`} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900">No trends match the filter</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Please select at least one platform to view trending markets.
                    </p>
                  </div>
                )
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
