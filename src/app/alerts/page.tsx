'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { usePortfolioStore } from '@/lib/store';
import { Plus, Trash2, Bell, BellOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AlertsPage() {
  const { alerts, addAlert, removeAlert, toggleAlert, holdings } = usePortfolioStore();
  const [newSymbol, setNewSymbol] = useState('');
  const [newType, setNewType] = useState<'price_above' | 'price_below' | 'volume_spike' | 'tvl_change'>('price_above');
  const [newThreshold, setNewThreshold] = useState('');

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol || !newThreshold) return;

    addAlert({
      symbol: newSymbol.toUpperCase(),
      type: newType,
      threshold: parseFloat(newThreshold),
      active: true,
    });

    setNewSymbol('');
    setNewThreshold('');
    toast.success(`Added ${newType.replace('_', ' ')} alert for ${newSymbol.toUpperCase()}`);
  };

  const handleToggleAlert = (id: string) => {
    toggleAlert(id);
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      toast.success(`Alert ${alert.active ? 'disabled' : 'enabled'}`);
    }
  };

  const handleRemoveAlert = (id: string) => {
    removeAlert(id);
    toast.success('Alert removed');
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'price_above': return 'Price Above';
      case 'price_below': return 'Price Below';
      case 'volume_spike': return 'Volume Spike';
      case 'tvl_change': return 'TVL Change';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Price Alerts</h1>
          <p className="text-gray-400">Set up notifications for price movements and market events</p>
        </div>

        {/* Add New Alert */}
        <div className="card-gradient rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Alert</h2>
          <form onSubmit={handleAddAlert} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="alert-symbol" className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                <select
                  id="alert-symbol"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-crypto-accent focus:outline-none"
                >
                  <option value="">Select Symbol</option>
                  {holdings.map(holding => (
                    <option key={holding.symbol} value={holding.symbol}>
                      {holding.symbol}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="alert-type" className="block text-sm font-medium text-gray-300 mb-2">Alert Type</label>
                <select
                  id="alert-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-crypto-accent focus:outline-none"
                >
                  <option value="price_above">Price Above</option>
                  <option value="price_below">Price Below</option>
                  <option value="volume_spike">Volume Spike</option>
                  <option value="tvl_change">TVL Change</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Threshold</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Enter threshold value"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-crypto-accent focus:outline-none"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-crypto-accent hover:bg-crypto-accent/80 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Alert</span>
            </button>
          </form>
        </div>

        {/* Alerts List */}
        <div className="card-gradient rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Active Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${alert.active ? 'bg-crypto-accent/20' : 'bg-gray-600/20'}`}>
                    {alert.active ? (
                      <Bell className={`w-5 h-5 ${alert.active ? 'text-crypto-accent' : 'text-gray-400'}`} />
                    ) : (
                      <BellOff className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {alert.symbol} - {getAlertTypeLabel(alert.type)}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Threshold: ${alert.threshold.toLocaleString()}
                      {alert.triggered && alert.lastTriggered && (
                        <span className="ml-2 text-crypto-warning">
                          • Last triggered: {new Date(alert.lastTriggered).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleAlert(alert.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      alert.active 
                        ? 'bg-crypto-success/20 text-crypto-success hover:bg-crypto-success/30' 
                        : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                    }`}
                  >
                    {alert.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleRemoveAlert(alert.id)}
                    className="p-2 text-gray-400 hover:text-crypto-danger transition-colors"
                    aria-label={`Remove alert for ${alert.symbol}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No alerts set up yet. Create your first alert above!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 