import { Product, Order, Customer } from '../types';
import {
  DollarSign, ShoppingCart, Users, TrendingUp, Package, Radio,
  ArrowUpRight, ArrowDownRight, Eye
} from 'lucide-react';

interface Props {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onNavigate: (page: 'products' | 'orders' | 'customers' | 'live') => void;
}

export function Dashboard({ products, orders, customers, onNavigate }: Props) {
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const paidOrders = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status));
  const pendingOrders = orders.filter(o => ['pending', 'invoiced'].includes(o.status));
  const liveOrders = orders.filter(o => o.source === 'live');
  const totalInventory = products.reduce((sum, p) => sum + p.variants.reduce((vs, v) => vs + v.stock, 0), 0);

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, change: '+12.5%', up: true, color: 'from-emerald-500 to-teal-600' },
    { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingCart, change: '+8.2%', up: true, color: 'from-blue-500 to-indigo-600' },
    { label: 'Customers', value: customers.length.toString(), icon: Users, change: '+5.1%', up: true, color: 'from-violet-500 to-purple-600' },
    { label: 'Live Sales', value: `$${liveOrders.reduce((s, o) => s + o.total, 0).toFixed(2)}`, icon: Radio, change: '+22.3%', up: true, color: 'from-rose-500 to-pink-600' },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    invoiced: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const topProducts = products.slice(0, 5).map(p => ({
    ...p,
    totalStock: p.variants.reduce((s, v) => s + v.stock, 0),
    sold: Math.floor(Math.random() * 50) + 10,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <button
          onClick={() => onNavigate('live')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transition-all duration-200 hover:scale-105"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          Go Live Now
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => onNavigate('live')} className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-white text-left hover:scale-[1.02] transition-transform shadow-lg">
          <Radio className="w-8 h-8 mb-3 opacity-90" />
          <h3 className="font-bold text-lg">Start Live Selling</h3>
          <p className="text-red-100 text-sm mt-1">Go live on Facebook and start selling to your audience</p>
        </button>
        <button onClick={() => onNavigate('products')} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white text-left hover:scale-[1.02] transition-transform shadow-lg">
          <Package className="w-8 h-8 mb-3 opacity-90" />
          <h3 className="font-bold text-lg">Manage Products</h3>
          <p className="text-indigo-100 text-sm mt-1">{products.length} products · {totalInventory} total units in stock</p>
        </button>
        <button onClick={() => onNavigate('orders')} className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white text-left hover:scale-[1.02] transition-transform shadow-lg">
          <ShoppingCart className="w-8 h-8 mb-3 opacity-90" />
          <h3 className="font-bold text-lg">Pending Orders</h3>
          <p className="text-amber-100 text-sm mt-1">{pendingOrders.length} orders waiting · {paidOrders.length} fulfilled</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg">Recent Orders</h2>
            <button onClick={() => onNavigate('orders')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                  <p className="text-xs text-gray-500 truncate">{order.items.map(i => i.productName).join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">${order.total.toFixed(2)}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg">Top Products</h2>
            <button onClick={() => onNavigate('products')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-4 hover:bg-gray-50/50 transition-colors">
                <img src={product.image} alt={product.name} className="w-11 h-11 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-500">{product.sold} sold</p>
                    <span className="text-gray-300">·</span>
                    <p className="text-xs text-gray-500">{product.totalStock} in stock</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 text-sm">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Stream Performance */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-4">Live Stream Performance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Avg. Viewers</span>
            </div>
            <p className="text-xl font-bold text-gray-900">847</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Conversion</span>
            </div>
            <p className="text-xl font-bold text-gray-900">14.2%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Avg. Order</span>
            </div>
            <p className="text-xl font-bold text-gray-900">$67.40</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Total Streams</span>
            </div>
            <p className="text-xl font-bold text-gray-900">24</p>
          </div>
        </div>
      </div>
    </div>
  );
}
