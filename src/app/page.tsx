'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Check, X, Edit2, TrendingDown, TrendingUp, Search, History, ArrowLeft, CheckSquare, Square, Clock } from 'lucide-react';

// Types
interface Transaction {
  id: string;
  customerName: string;
  amount: number;
  isPaid: boolean;
  date: string;
  notes?: string;
  createdAt: string;
}

interface CustomerSummary {
  name: string;
  transactions: Transaction[];
  lastTransaction: string;
}

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0
  }).format(amount);
};

const getCurrentDateTime = () => {
  const now = new Date();
  return now.toISOString();
};

export default function Home() {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('baki-transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load data');
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('baki-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Add new transaction
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.amount) {
      showNotification('error', 'দয়া করে নাম এবং টাকার পরিমাণ লিখুন');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('error', 'সঠিক টাকার পরিমাণ লিখুন');
      return;
    }

    const newTransaction: Transaction = {
      id: generateId(),
      customerName: formData.name.trim(),
      amount,
      isPaid: false,
      date: getCurrentDateTime(),
      notes: formData.notes.trim(),
      createdAt: getCurrentDateTime()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setFormData({ name: '', amount: '', notes: '' });
    setShowAddForm(false);
    showNotification('success', 'বিল যোগ হয়েছে');
  };

  // Toggle single transaction paid status - instant update
  const togglePaid = (id: string) => {
    setTransactions(prev => prev.map(transaction => {
      if (transaction.id === id) {
        return { ...transaction, isPaid: !transaction.isPaid };
      }
      return transaction;
    }));
  };

  // Select/Deselect all unpaid transactions for a customer - instant update
  const toggleAllPaid = () => {
    if (!selectedCustomerName) return;
    
    const customerData = getCustomerData(selectedCustomerName);
    const allUnpaid = customerData.transactions.filter(t => !t.isPaid);
    const shouldSelectAll = allUnpaid.length > 0;
    
    setTransactions(prev => prev.map(t => {
      if (t.customerName.toLowerCase() === selectedCustomerName.toLowerCase()) {
        return { ...t, isPaid: shouldSelectAll };
      }
      return t;
    }));
  };

  // Delete single transaction - instant update
  const deleteTransaction = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই বিল মুছে ফেলতে চান?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      showNotification('success', 'বিল মুছে ফেলা হয়েছে');
    }
  };

  // Delete all transactions for a customer (All Clear) - instant update
  const deleteAllTransactions = () => {
    if (!selectedCustomerName) return;
    
    const customerName = selectedCustomerName;
    if (!confirm(`আপনি কি নিশ্চিত যে ${customerName}-এর সব বিল মুছে ফেলতে চান?`)) {
      return;
    }
    
    setTransactions(prev => prev.filter(t => 
      t.customerName.toLowerCase() !== customerName.toLowerCase()
    ));
    setSelectedCustomerName(null);
    showNotification('success', 'সব বিল মুছে ফেলা হয়েছে');
  };

  // Get customer summaries grouped by name - computed from transactions
  const customerSummaries = useMemo(() => {
    const customerMap = new Map<string, Transaction[]>();
    
    transactions.forEach(transaction => {
      const name = transaction.customerName.toLowerCase().trim();
      if (!customerMap.has(name)) {
        customerMap.set(name, []);
      }
      customerMap.get(name)!.push(transaction);
    });

    const summaries: CustomerSummary[] = [];
    
    customerMap.forEach((txns, name) => {
      const sortedTxns = txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      summaries.push({
        name: txns[0].customerName,
        transactions: sortedTxns,
        lastTransaction: sortedTxns[0]?.date || ''
      });
    });

    return summaries.sort((a, b) => new Date(b.lastTransaction).getTime() - new Date(a.lastTransaction).getTime());
  }, [transactions]);

  // Get selected customer data - computed from transactions for instant updates
  const selectedCustomerData = useMemo(() => {
    if (!selectedCustomerName) return null;
    
    const txns = transactions.filter(t => 
      t.customerName.toLowerCase() === selectedCustomerName.toLowerCase()
    );
    
    if (txns.length === 0) return null;
    
    const sortedTxns = txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return {
      name: txns[0].customerName,
      transactions: sortedTxns,
      lastTransaction: sortedTxns[0]?.date || ''
    };
  }, [selectedCustomerName, transactions]);

  // Calculate customer totals - instant computation
  const customerTotals = useMemo(() => {
    if (!selectedCustomerData) return null;
    
    const totalBaki = selectedCustomerData.transactions
      .filter(t => !t.isPaid)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalPaid = selectedCustomerData.transactions
      .filter(t => t.isPaid)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const unpaidCount = selectedCustomerData.transactions.filter(t => !t.isPaid).length;
    const paidCount = selectedCustomerData.transactions.filter(t => t.isPaid).length;

    return { totalBaki, totalPaid, unpaidCount, paidCount };
  }, [selectedCustomerData]);

  // Helper function to get customer data
  const getCustomerData = (name: string) => {
    const txns = transactions.filter(t => t.customerName.toLowerCase() === name.toLowerCase());
    const sortedTxns = txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
      name: txns[0]?.customerName || name,
      transactions: sortedTxns,
      lastTransaction: sortedTxns[0]?.date || ''
    };
  };

  // Get recent transactions - instant computation
  const recentTransactions = useMemo(() => {
    return transactions
      .filter(t => t.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions, searchTerm]);

  // Global totals - instant computation
  const totalBaki = useMemo(() => 
    transactions.filter(t => !t.isPaid).reduce((sum, t) => sum + t.amount, 0)
  , [transactions]);

  const totalPaid = useMemo(() => 
    transactions.filter(t => t.isPaid).reduce((sum, t) => sum + t.amount, 0)
  , [transactions]);

  // Customer Detail View
  if (selectedCustomerData && customerTotals) {
    const currentBalance = customerTotals.totalBaki;
    const allUnpaid = selectedCustomerData.transactions.filter(t => !t.isPaid);
    const allPaid = selectedCustomerData.transactions.filter(t => t.isPaid);
    const canSelectAll = allUnpaid.length > 0;

    return (
      <div className="min-h-screen pb-20">
        {notification && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <header className="bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedCustomerName(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{selectedCustomerData.name}</h1>
                <p className="text-green-100 text-sm">সম্পূর্ণ লেনদেনের তালিকা</p>
              </div>
            </div>
            <button
              onClick={deleteAllTransactions}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
              title="সব মুছুন"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-center mb-4">
              <p className="text-green-100">বর্তমান বাকি</p>
              <p className="text-5xl font-bold">{formatCurrency(currentBalance)}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-green-200 text-sm">মোট বিল</p>
                <p className="text-xl font-bold">{selectedCustomerData.transactions.length}টি</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-green-200 text-sm">বাকি আছে</p>
                <p className="text-xl font-bold">{customerTotals.unpaidCount}টি</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-green-200 text-sm">পরিশোধিত</p>
                <p className="text-xl font-bold">{customerTotals.paidCount}টি</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Bill Form */}
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-white rounded-xl p-6 shadow-card">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              নতুন বিল যোগ করুন
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!formData.amount) return;
              const amount = parseFloat(formData.amount);
              if (isNaN(amount) || amount <= 0) {
                showNotification('error', 'সঠিক টাকার পরিমাণ লিখুন');
                return;
              }
              const newTransaction: Transaction = {
                id: generateId(),
                customerName: selectedCustomerData.name,
                amount,
                isPaid: false,
                date: getCurrentDateTime(),
                notes: formData.notes.trim(),
                createdAt: getCurrentDateTime()
              };
              
              // Instant update - state will update immediately
              setTransactions(prev => [newTransaction, ...prev]);
              setFormData({ name: selectedCustomerData.name, amount: '', notes: '' });
              
              showNotification('success', 'বিল যোগ হয়েছে');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  টাকার পরিমাণ (টাকা) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  নোট (ঐচ্ছিক)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="অতিরিক্ত তথ্য..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                যোগ করুন
              </button>
            </form>
          </div>
        </div>

        {/* Unpaid Bills Section */}
        {allUnpaid.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                বাকি বিল ({allUnpaid.length}টি)
              </h3>
              <button
                onClick={toggleAllPaid}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
              >
                {canSelectAll ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                সব পরিশোধ করুন
              </button>
            </div>
            
            <div className="space-y-3">
              {allUnpaid.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl p-4 shadow-card border-l-4 border-red-500"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={transaction.isPaid}
                      onChange={() => togglePaid(transaction.id)}
                      className="w-6 h-6 rounded border-2 border-red-500 text-red-500 focus:ring-red-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-red-600">{formatCurrency(transaction.amount)}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateTime(transaction.date)}</span>
                          </div>
                          {transaction.notes && (
                            <p className="text-sm text-gray-600 mt-1">📝 {transaction.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                            title="মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paid Bills Section */}
        {allPaid.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                পরিশোধিত বিল ({allPaid.length}টি)
              </h3>
              <button
                onClick={() => {
                  if (confirm(`আপনি কি নিশ্চিত যে ${selectedCustomerData.name}-এর সব পরিশোধিত বিল মুছে ফেলতে চান?`)) {
                    setTransactions(prev => prev.filter(t => 
                      !(t.customerName.toLowerCase() === selectedCustomerData.name.toLowerCase() && t.isPaid)
                    ));
                    showNotification('success', 'সব পরিশোধিত বিল মুছে ফেলা হয়েছে');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                সব মুছুন
              </button>
            </div>
            
            <div className="space-y-3">
              {allPaid.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl p-4 shadow-card border-l-4 border-green-500 opacity-75"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={transaction.isPaid}
                      onChange={() => togglePaid(transaction.id)}
                      className="w-6 h-6 rounded border-2 border-green-500 text-green-500 focus:ring-green-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-green-600 line-through">{formatCurrency(transaction.amount)}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateTime(transaction.date)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all"
                          title="মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Clear Button */}
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <button
            onClick={deleteAllTransactions}
            className="w-full py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium flex items-center justify-center gap-2 shadow-lg"
          >
            <Trash2 className="w-5 h-5" />
            All Clear - এই গ্রাহকের সব বিল মুছুন
          </button>
        </div>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto px-4 mt-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} বাকি হিসাব</p>
        </footer>
      </div>
    );
  }

  // Main View
  return (
    <div className="min-h-screen pb-20">
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">📋 বাকি হিসাব</h1>
          <p className="text-green-100">আপনার গ্রাহকদের বাকির হিসাব সহজে রাখুন</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-card card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">মোট বাকি</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(totalBaki)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-card card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">পরিশোধিত</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-card card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <History className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">মোট লেনদেন</p>
                <p className="text-xl font-bold text-orange-600">{transactions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-card card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">গ্রাহক</p>
                <p className="text-xl font-bold text-blue-600">{customerSummaries.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="গ্রাহকের নাম খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
          />
        </div>
      </div>

      {/* Add Button */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          নতুন বিল যোগ করুন
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="bg-white rounded-xl p-6 shadow-card">
            <h2 className="text-xl font-bold mb-4 text-gray-800">নতুন বিল যোগ করুন</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  গ্রাহকের নাম *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="উদাহরণ: রাকিব"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  টাকার পরিমাণ (টাকা) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  নোট (ঐচ্ছিক)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="অতিরিক্ত তথ্য..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  যোগ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer List */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 গ্রাহকের বাকির হিসাব</h3>
        
        {customerSummaries.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-card">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">কোনো গ্রাহক নেই</h3>
            <p className="text-gray-500">উপরের বাটনে ক্লিক করে নতুন বিল যোগ করুন</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customerSummaries
              .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((customer) => {
                const totalBaki = customer.transactions
                  .filter(t => !t.isPaid)
                  .reduce((sum, t) => sum + t.amount, 0);
                
                const totalPaid = customer.transactions
                  .filter(t => t.isPaid)
                  .reduce((sum, t) => sum + t.amount, 0);
                
                const unpaidCount = customer.transactions.filter(t => !t.isPaid).length;
                const paidCount = customer.transactions.filter(t => t.isPaid).length;
                
                const balance = totalBaki;
                
                return (
                  <div
                    key={customer.name}
                    onClick={() => setSelectedCustomerName(customer.name)}
                    className="bg-white rounded-xl p-4 shadow-card card-hover cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                          balance > 0 ? 'bg-orange-500' : 'bg-green-500'
                        }`}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
                          <p className="text-sm text-gray-500">
                            শেষ লেনদেন: {formatDate(customer.lastTransaction)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            মোট বিল: {customer.transactions.length}টি | 
                            বাকি: {unpaidCount}টি | 
                            পরিশোধিত: {paidCount}টি
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(balance)}
                        </p>
                        <p className={`text-sm ${balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {balance > 0 ? 'বাকি' : 'সব পরিশোধিত'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🕐 সাম্প্রতিক লেনদেন</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`bg-white rounded-xl p-4 shadow-card ${
                  transaction.isPaid ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.isPaid ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.isPaid ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{transaction.customerName}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`font-bold ${
                      transaction.isPaid ? 'text-green-600 line-through' : 'text-red-600'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('আপনি কি নিশ্চিত যে এই বিল মুছে ফেলতে চান?')) {
                          deleteTransaction(transaction.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} বাকি হিসাব</p>
      </footer>
    </div>
  );
}
