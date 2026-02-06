import { useState } from 'react';
import { Order } from '../types';
import {
  Search, Filter, ShoppingCart, Clock, CreditCard, Truck, CheckCircle2, XCircle,
  FileText, ChevronDown, Mail, DollarSign, Radio
} from 'lucide-react';

interface Props {
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  invoiced: { label: 'Invoiced', color: 'text-blue-700', bg: 'bg-blue-100', icon: FileText },
  paid: { label: 'Paid', color: 'text-green-700', bg: 'bg-green-100', icon: CreditCard },
  shipped: { label: 'Shipped', color: 'text-purple-700', bg: 'bg-purple-100', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
};

export function Orders({ orders, onUpdateOrders }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || o.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const updateStatus = (orderId: string, newStatus: Order['status']) => {
    onUpdateOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus, ...(newStatus === 'paid' ? { paidAt: new Date().toISOString() } : {}) } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'invoiced').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">{orders.length} total orders · {pendingCount} pending</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Fulfilled</p>
          <p className="text-xl font-bold text-emerald-600">{orders.filter(o => ['shipped', 'delivered'].includes(o.status)).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Live Orders</p>
          <p className="text-xl font-bold text-indigo-600">{orders.filter(o => o.source === 'live').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search orders, customers..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Sources</option>
              <option value="live">Live Stream</option>
              <option value="website">Website</option>
              <option value="manual">Manual</option>
            </select>
            <Radio className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Items</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Source</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(order => {
                const cfg = statusConfig[order.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="px-5 py-3">
                      <p className="font-mono font-bold text-sm text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <p className="text-sm text-gray-600 truncate max-w-[200px]">
                        {order.items.map(i => i.productName).join(', ')}
                      </p>
                      <p className="text-xs text-gray-400">{order.items.length} item(s)</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${order.source === 'live' ? 'text-red-600' : 'text-gray-500'}`}>
                        {order.source === 'live' && <Radio className="w-3 h-3" />}
                        {order.source}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        {order.status === 'pending' && (
                          <button onClick={() => updateStatus(order.id, 'invoiced')} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="Send Invoice">
                            <Mail className="w-4 h-4 text-blue-500" />
                          </button>
                        )}
                        {order.status === 'invoiced' && (
                          <button onClick={() => updateStatus(order.id, 'paid')} className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Mark Paid">
                            <DollarSign className="w-4 h-4 text-green-500" />
                          </button>
                        )}
                        {order.status === 'paid' && (
                          <button onClick={() => updateStatus(order.id, 'shipped')} className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors" title="Mark Shipped">
                            <Truck className="w-4 h-4 text-purple-500" />
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button onClick={() => updateStatus(order.id, 'delivered')} className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark Delivered">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </button>
                        )}
                        {!['delivered', 'cancelled'].includes(order.status) && (
                          <button onClick={() => updateStatus(order.id, 'cancelled')} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                            <XCircle className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order {selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500 mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedOrder.status].bg} ${statusConfig[selectedOrder.status].color}`}>
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Customer</h3>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.variantName} × {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                <span className="font-semibold text-indigo-900">Total</span>
                <span className="text-xl font-bold text-indigo-700">${selectedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className={`inline-flex items-center gap-1 ${selectedOrder.source === 'live' ? 'text-red-600' : ''}`}>
                  {selectedOrder.source === 'live' && <Radio className="w-3 h-3" />}
                  Source: {selectedOrder.source}
                </span>
                {selectedOrder.paidAt && (
                  <span>· Paid: {new Date(selectedOrder.paidAt).toLocaleString()}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setSelectedOrder(null)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">
                Close
              </button>
              {selectedOrder.status === 'pending' && (
                <button onClick={() => { updateStatus(selectedOrder.id, 'invoiced'); setSelectedOrder(null); }}
                  className="px-5 py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Send Invoice
                </button>
              )}
              {selectedOrder.status === 'invoiced' && (
                <button onClick={() => { updateStatus(selectedOrder.id, 'paid'); setSelectedOrder(null); }}
                  className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
