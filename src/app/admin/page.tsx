'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { usePortfolioStore } from '@/lib/store';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminPage() {
  const { holdings, addHolding, updateHolding, removeHolding } = usePortfolioStore();
  const [newSymbol, setNewSymbol] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol || !newAmount) return;

    addHolding({
      symbol: newSymbol.toUpperCase(),
      amount: parseFloat(newAmount),
    });

    setNewSymbol('');
    setNewAmount('');
    toast.success(`Added ${newSymbol.toUpperCase()} to portfolio`);
  };

  const handleUpdateHolding = (symbol: string) => {
    if (!editAmount) return;

    updateHolding(symbol, parseFloat(editAmount));
    setEditingSymbol(null);
    setEditAmount('');
    toast.success(`Updated ${symbol} amount`);
  };

  const handleRemoveHolding = (symbol: string) => {
    removeHolding(symbol);
    toast.success(`Removed ${symbol} from portfolio`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Portfolio Management</h1>
          <p className="text-gray-400">Add, edit, or remove holdings from your portfolio</p>
        </div>

        {/* Add New Holding */}
        <div className="card-gradient rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Holding</h2>
          <form onSubmit={handleAddHolding} className="flex gap-4">
            <input
              type="text"
              placeholder="Symbol (e.g., BTC)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-crypto-accent focus:outline-none"
            />
            <input
              type="number"
              step="any"
              placeholder="Amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-crypto-accent focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-crypto-accent hover:bg-crypto-accent/80 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Holdings List */}
        <div className="card-gradient rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Current Holdings</h2>
          <div className="space-y-4">
            {holdings.map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-crypto-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-crypto-accent font-bold text-sm">{holding.symbol}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{holding.symbol}</h3>
                    <p className="text-gray-400 text-sm">
                      {editingSymbol === holding.symbol ? (
                        <input
                          type="number"
                          step="any"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white w-32"
                          onBlur={() => handleUpdateHolding(holding.symbol)}
                          onKeyPress={(e) => e.key === 'Enter' && handleUpdateHolding(holding.symbol)}
                          aria-label={`Edit amount for ${holding.symbol}`}
                          autoFocus
                        />
                      ) : (
                        `${holding.amount.toLocaleString()} tokens`
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingSymbol(holding.symbol);
                      setEditAmount(holding.amount.toString());
                    }}
                    className="p-2 text-gray-400 hover:text-crypto-accent transition-colors"
                    aria-label={`Edit ${holding.symbol} amount`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveHolding(holding.symbol)}
                    className="p-2 text-gray-400 hover:text-crypto-danger transition-colors"
                    aria-label={`Remove ${holding.symbol} from portfolio`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {holdings.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No holdings yet. Add your first holding above!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 