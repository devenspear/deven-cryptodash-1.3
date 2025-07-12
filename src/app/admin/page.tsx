'use client';

import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/lib/store';
import { Plus, Trash2, Save, RotateCcw, Download, Upload, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface EditableHolding {
  id: string;
  symbol: string;
  amount: string;
  isNew: boolean;
  isModified: boolean;
  isDeleted: boolean;
}

type SortField = 'symbol' | 'amount';
type SortDirection = 'asc' | 'desc' | null;

export default function AdminPage() {
  const { holdings, addHolding, updateHolding, removeHolding, replaceAllHoldings, clearAllHoldings } = usePortfolioStore();
  const [editableData, setEditableData] = useState<EditableHolding[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Initialize editable data from store
  useEffect(() => {
    const initialData = holdings.map((holding, index) => ({
      id: `existing-${index}`,
      symbol: holding.symbol,
      amount: holding.amount.toString(),
      isNew: false,
      isModified: false,
      isDeleted: false,
    }));
    
    // Add one empty row for new entries
    initialData.push({
      id: `new-${Date.now()}`,
      symbol: '',
      amount: '',
      isNew: true,
      isModified: false,
      isDeleted: false,
    });
    
    setEditableData(initialData);
  }, [holdings]);

  // Check if there are any changes
  useEffect(() => {
    const changes = editableData.some(item => 
      item.isModified || item.isDeleted || (item.isNew && (item.symbol || item.amount))
    );
    setHasChanges(changes);
  }, [editableData]);

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection = 'asc';
    
    if (sortField === field) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
      } else {
        newDirection = 'asc';
      }
    }
    
    setSortField(newDirection ? field : null);
    setSortDirection(newDirection);
  };

  const getSortedData = (data: EditableHolding[]) => {
    if (!sortField || !sortDirection) return data;

    return [...data].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === 'symbol') {
        aValue = a.symbol.toLowerCase();
        bValue = b.symbol.toLowerCase();
      } else {
        aValue = parseFloat(a.amount) || 0;
        bValue = parseFloat(b.amount) || 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="w-4 h-4 text-crypto-accent" />;
    }
    if (sortDirection === 'desc') {
      return <ChevronDown className="w-4 h-4 text-crypto-accent" />;
    }
    return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
  };

  const updateCell = (id: string, field: 'symbol' | 'amount', value: string) => {
    setEditableData(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Mark as modified if it's an existing item and value changed
        if (!item.isNew) {
          const originalHolding = holdings.find(h => h.symbol === item.symbol);
          const isSymbolChanged = field === 'symbol' && value !== item.symbol;
          const isAmountChanged = field === 'amount' && value !== (originalHolding?.amount.toString() || '');
          
          if (isSymbolChanged || isAmountChanged) {
            updated.isModified = true;
          }
        }
        
        return updated;
      }
      return item;
    }));
  };

  const addNewRow = () => {
    const newRow: EditableHolding = {
      id: `new-${Date.now()}`,
      symbol: '',
      amount: '',
      isNew: true,
      isModified: false,
      isDeleted: false,
    };
    setEditableData(prev => [...prev, newRow]);
  };

  const deleteRow = (id: string) => {
    setEditableData(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isDeleted: true }
        : item
    ).filter(item => !(item.isNew && item.isDeleted)));
  };

  const handleSave = async () => {
    try {
      // Process deletions
      const deletedItems = editableData.filter(item => item.isDeleted && !item.isNew);
      for (const item of deletedItems) {
        removeHolding(item.symbol);
      }

      // Process additions and modifications
      const validItems = editableData.filter(item => 
        !item.isDeleted && 
        item.symbol.trim() && 
        item.amount.trim() && 
        !isNaN(parseFloat(item.amount))
      );

      for (const item of validItems) {
        const amount = parseFloat(item.amount);
        const symbol = item.symbol.toUpperCase().trim();

        if (item.isNew) {
          // Add new holding
          addHolding({ symbol, amount });
        } else if (item.isModified) {
          // Update existing holding
          updateHolding(symbol, amount);
        }
      }

      toast.success('Portfolio updated successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Error saving changes');
      console.error('Save error:', error);
    }
  };

  const handleReset = () => {
    // Reset to original data
    const resetData = holdings.map((holding, index) => ({
      id: `existing-${index}`,
      symbol: holding.symbol,
      amount: holding.amount.toString(),
      isNew: false,
      isModified: false,
      isDeleted: false,
    }));
    
    resetData.push({
      id: `new-${Date.now()}`,
      symbol: '',
      amount: '',
      isNew: true,
      isModified: false,
      isDeleted: false,
    });
    
    setEditableData(resetData);
    setHasChanges(false);
    setSortField(null);
    setSortDirection(null);
    toast.success('Changes reset');
  };

  const handleExport = () => {
    const exportData = holdings.map(h => ({
      symbol: h.symbol,
      amount: h.amount
    }));
    
    const csvContent = [
      'Symbol,Amount',
      ...exportData.map(h => `${h.symbol},${h.amount}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto-portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Portfolio exported successfully!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.trim().split('\n');
        
        // Skip header row
        const dataLines = lines.slice(1);
        
        const newHoldings: { symbol: string; amount: number }[] = [];
        
        dataLines.forEach((line) => {
          const [symbol, amount] = line.split(',');
          if (symbol && amount && !isNaN(parseFloat(amount))) {
            newHoldings.push({
              symbol: symbol.trim().toUpperCase(),
              amount: parseFloat(amount.trim())
            });
          }
        });
        
        if (newHoldings.length === 0) {
          toast.error('No valid holdings found in CSV file');
          return;
        }
        
        // Ask user if they want to replace all holdings or add to existing
        const replace = confirm(
          `Found ${newHoldings.length} holdings in CSV file.\n\n` +
          `Click "OK" to REPLACE ALL current holdings\n` +
          `Click "Cancel" to ADD to existing holdings`
        );
        
        if (replace) {
          // Replace all holdings
          replaceAllHoldings(newHoldings);
          // Update editable data to reflect the change
          const newEditableData = newHoldings.map((holding, index) => ({
            id: `imported-${index}`,
            symbol: holding.symbol,
            amount: holding.amount.toString(),
            isNew: false,
            isModified: false,
            isDeleted: false,
          }));
          
          // Add empty row for new entries
          newEditableData.push({
            id: `new-${Date.now()}`,
            symbol: '',
            amount: '',
            isNew: true,
            isModified: false,
            isDeleted: false,
          });
          
          setEditableData(newEditableData);
          setHasChanges(false);
          toast.success(`✅ REPLACED all holdings with ${newHoldings.length} new holdings from CSV`);
        } else {
          // Add to existing holdings
          const importedData: EditableHolding[] = [];
          
          newHoldings.forEach((holding, index) => {
            importedData.push({
              id: `imported-${index}`,
              symbol: holding.symbol,
              amount: holding.amount.toString(),
              isNew: true,
              isModified: false,
              isDeleted: false,
            });
          });
          
          // Add empty row for new entries
          importedData.push({
            id: `new-${Date.now()}`,
            symbol: '',
            amount: '',
            isNew: true,
            isModified: false,
            isDeleted: false,
          });
          
          setEditableData(prev => [...prev.filter(item => !item.isNew || item.symbol || item.amount), ...importedData]);
          setHasChanges(true);
          toast.success(`📥 Added ${newHoldings.length} holdings from CSV (click Save to confirm)`);
        }
        
      } catch (error) {
        toast.error('Error importing CSV file');
        console.error('Import error:', error);
      }
    };
    
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const handleClearAll = () => {
    if (confirm('⚠️  Are you sure you want to clear ALL holdings?\n\nThis will immediately remove all current holdings from your portfolio.')) {
      clearAllHoldings();
      // Reset editable data to empty state
      setEditableData([{
        id: `new-${Date.now()}`,
        symbol: '',
        amount: '',
        isNew: true,
        isModified: false,
        isDeleted: false,
      }]);
      setHasChanges(false);
      toast.success('🗑️  All holdings cleared successfully!');
    }
  };

  // Add state for mapping results and modal
  const [mappingResults, setMappingResults] = useState<any>(null);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [lastMappingUpdate, setLastMappingUpdate] = useState<string | null>(null);

  const handleUpdateMapping = async () => {
    try {
      const res = await axios.post('/api/update-mapping');
      if (res.data.success) {
        setMappingResults(res.data);
        setLastMappingUpdate(res.data.updatedAt);
        setShowMappingModal(true);
        const failed = res.data.failed.length;
        const total = res.data.details.length;
        toast.success(`Token mapping updated! ${total - failed}/${total} mapped, ${failed} failed.`);
      } else {
        toast.error('Failed to update mapping: ' + res.data.error);
      }
    } catch (err: any) {
      toast.error('Error updating mapping: ' + (err.message || err));
    }
  };

  const visibleData = editableData.filter(item => !item.isDeleted);
  const sortedData = getSortedData(visibleData);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">Portfolio Spreadsheet</h1>
        <p className="text-gray-400 mb-4">Edit your portfolio like a spreadsheet - click cells to edit, add/delete rows, then save all changes</p>
        
        {/* Bulk Operations Help */}
        <div className="card-gradient rounded-lg p-4 border-l-4 border-crypto-accent">
          <h3 className="text-lg font-semibold text-crypto-accent mb-2">💡 Bulk Operations</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li><strong>Export CSV:</strong> Download your current portfolio as a CSV file</li>
            <li><strong>Import CSV:</strong> Upload a CSV file to replace ALL holdings (Format: Symbol,Amount)</li>
            <li><strong>Clear All:</strong> Remove all current holdings to start fresh</li>
          </ul>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6 p-4 card-gradient rounded-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={addNewRow}
            className="flex items-center space-x-2 px-4 py-2 bg-crypto-accent hover:bg-crypto-accent/80 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Row</span>
          </button>
          
          {/* Bulk Operations */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
              id="csv-import"
            />
            <button
              onClick={() => document.getElementById('csv-import')?.click()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import CSV</span>
            </button>
            
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
          
          {hasChanges && (
            <span className="text-crypto-warning text-sm font-medium">
              Unsaved changes
            </span>
          )}

          {sortField && (
            <span className="text-crypto-accent text-sm font-medium">
              Sorted by {sortField} ({sortDirection})
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center space-x-2 px-6 py-2 bg-crypto-success hover:bg-crypto-success/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>

          <button
            onClick={handleUpdateMapping}
            className="px-4 py-2 bg-crypto-primary hover:bg-crypto-primary/80 text-white rounded-lg font-medium transition-colors"
          >
            Update Token Mapping
          </button>
          {lastMappingUpdate && (
            <span className="text-xs text-gray-400 ml-2">Last mapping update: {new Date(lastMappingUpdate).toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="card-gradient rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-300 font-medium w-16">#</th>
                <th 
                  className="text-left p-4 text-gray-300 font-medium cursor-pointer hover:bg-gray-800/50 transition-colors select-none"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Symbol</span>
                    <SortIcon field="symbol" />
                  </div>
                </th>
                <th 
                  className="text-left p-4 text-gray-300 font-medium cursor-pointer hover:bg-gray-800/50 transition-colors select-none"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Amount</span>
                    <SortIcon field="amount" />
                  </div>
                </th>
                <th className="text-left p-4 text-gray-300 font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={`border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors ${
                    item.isModified ? 'bg-crypto-warning/10' : ''
                  } ${item.isNew ? 'bg-crypto-accent/10' : ''}`}
                >
                  <td className="p-4 text-gray-400 text-sm">
                    {index + 1}
                  </td>
                  
                  {/* Symbol Cell */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.symbol}
                      onChange={(e) => updateCell(item.id, 'symbol', e.target.value)}
                      placeholder="e.g., BTC"
                      className="w-full px-3 py-2 bg-transparent border border-transparent hover:border-gray-600 focus:border-crypto-accent focus:outline-none rounded text-white placeholder-gray-500 transition-colors"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </td>
                  
                  {/* Amount Cell */}
                  <td className="p-2">
                    <input
                      type="number"
                      step="any"
                      value={item.amount}
                      onChange={(e) => updateCell(item.id, 'amount', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-transparent border border-transparent hover:border-gray-600 focus:border-crypto-accent focus:outline-none rounded text-white placeholder-gray-500 transition-colors"
                    />
                  </td>
                  
                  {/* Actions */}
                  <td className="p-2">
                    <button
                      onClick={() => deleteRow(item.id)}
                      className="p-2 text-gray-400 hover:text-crypto-danger transition-colors rounded hover:bg-crypto-danger/10"
                      aria-label="Delete row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Empty state */}
              {sortedData.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    No holdings yet. Click "Add Row" to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-gradient rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Total Holdings</h3>
          <p className="text-2xl font-bold text-crypto-accent">
            {visibleData.filter(item => item.symbol && item.amount).length}
          </p>
        </div>
        
        <div className="card-gradient rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Pending Changes</h3>
          <p className="text-2xl font-bold text-crypto-warning">
            {editableData.filter(item => item.isModified || item.isDeleted || (item.isNew && (item.symbol || item.amount))).length}
          </p>
        </div>
        
        <div className="card-gradient rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
          <p className={`text-lg font-semibold ${hasChanges ? 'text-crypto-warning' : 'text-crypto-success'}`}>
            {hasChanges ? 'Unsaved Changes' : 'All Saved'}
          </p>
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="mt-6 card-gradient rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-2">💡 Tips:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
          <div>• Click any cell to edit inline</div>
          <div>• Click column headers to sort</div>
          <div>• Use Tab to move between cells</div>
          <div>• Add rows with the "Add Row" button</div>
          <div>• Delete rows with the trash icon</div>
          <div>• Save all changes at once with "Save"</div>
        </div>
      </div>

      {/* Mapping Results Modal */}
      {showMappingModal && mappingResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full shadow-lg">
            <h2 className="text-lg font-bold mb-2 text-crypto-accent">Token Mapping Results</h2>
            <div className="max-h-64 overflow-y-auto text-sm">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="pr-2">Symbol</th>
                    <th className="pr-2">CoinGecko ID</th>
                    <th className="pr-2">Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mappingResults.details.map((d: any) => (
                    <tr key={d.symbol} className={d.status === 'not_found' ? 'text-crypto-warning' : ''}>
                      <td>{d.symbol}</td>
                      <td>{d.id || '-'}</td>
                      <td>{d.name || '-'}</td>
                      <td>{d.status === 'success' ? '✅' : '❌ Not Found'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-crypto-primary hover:bg-crypto-primary/80 text-white rounded-lg font-medium"
              onClick={() => setShowMappingModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 