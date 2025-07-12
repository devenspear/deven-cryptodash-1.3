'use client';

import { useState, useEffect } from 'react';
import { usePrices } from '@/hooks/usePrices';

export function TimeHeader() {
  const [currentTime, setCurrentTime] = useState('');
  const [lastPriceUpdate, setLastPriceUpdate] = useState('');
  const { isLoading } = usePrices();

  // Set current time in Eastern timezone
  useEffect(() => {
    const now = new Date();
    const easternTime = now.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    setCurrentTime(easternTime);
  }, []);

  // Update last price update time
  useEffect(() => {
    const updateTime = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    setLastPriceUpdate(updateTime);
  }, [isLoading]); // Update when price loading state changes

  return (
    <div className="bg-gray-900/50 border-b border-gray-700/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="text-xs text-gray-400 text-center">
          🚀 Build: {currentTime} EST | 💰 Last Price Update: {lastPriceUpdate} EST | 🔒 Privacy Protected
        </div>
      </div>
    </div>
  );
}
