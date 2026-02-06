import { useState } from 'react';
import { Customer, Order } from '../types';
import { Search, Users, Mail, Phone, ShoppingBag, DollarSign, Calendar, X, TrendingUp } from 'lucide-react';

interface Props {
  customers: Customer[];
  orders: Order[];
}

export function Customers({ customers, orders }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'spent' | 'orders'>('spent');

  const filtered = customers
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      return b.totalOrders - a.totalOrders;
    });

  const totalCustomerValue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderValue = totalCustomerValue / Math.max(customers.reduce((s, c) => s + c.totalOrders, 0), 1);

  const customerOrders = selectedCustomer
    ? orders.filter(o => o.customerName === selectedCustomer.name)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">{customers.length} customers · ${totalCustomerValue.toFixed(2)} lifetime value</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-indigo-500" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-gray-500">Lifetime Value</span>
          </div>
          <p className="text-xl font-bold text-gray-900">${totalCustomerValue.toFixed(0)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500">Avg Order</span>
          </div>
          <p className="text-xl font-bold text-gray-900">${avgOrderValue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-500">Repeat Rate</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {((customers.filter(c => c.totalOrders > 1).length / Math.max(customers.length, 1)) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2">
          {(['spent', 'orders', 'name'] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${sortBy === s ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              By {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(customer => (
          <div key={customer.id}
            onClick={() => setSelectedCustomer(customer)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3 mb-4">
              <img src={customer.avatar} alt={customer.name} className="w-12 h-12 rounded-full bg-gray-100" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{customer.name}</p>
                <p className="text-xs text-gray-500 truncate">{customer.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-500">Orders</p>
                <p className="font-bold text-gray-900">{customer.totalOrders}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-500">Spent</p>
                <p className="font-bold text-gray-900">${customer.totalSpent.toFixed(0)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Last order: {new Date(customer.lastOrderAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No customers found</p>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedCustomer.avatar} alt="" className="w-14 h-14 rounded-full bg-gray-100" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                    <p className="text-sm text-gray-500">Customer since {new Date(selectedCustomer.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-sm text-indigo-600 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-indigo-900">${selectedCustomer.totalSpent.toFixed(2)}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-sm text-emerald-600 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-emerald-900">{selectedCustomer.totalOrders}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selectedCustomer.phone}</span>
                </div>
              </div>

              {customerOrders.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Recent Orders</h3>
                  <div className="space-y-2">
                    {customerOrders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-mono font-bold text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
                          <p className="text-xs text-gray-500 capitalize">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
