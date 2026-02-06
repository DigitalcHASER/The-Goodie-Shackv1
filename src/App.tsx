import { useState } from 'react';
import { Page, Product, Order, LiveSession } from './types';
import { initialProducts, initialCustomers, initialOrders, initialLiveSession } from './store';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { LiveSelling } from './components/LiveSelling';
import { Orders } from './components/Orders';
import { Customers } from './components/Customers';
import { Settings } from './components/Settings';
import {
  LayoutDashboard, Package, Radio, ShoppingCart, Users, Settings as SettingsIcon,
  Menu, X, Zap, ChevronRight
} from 'lucide-react';

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live', label: 'Live Selling', icon: Radio },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers] = useState(initialCustomers);
  const [liveSession, setLiveSession] = useState<LiveSession>(initialLiveSession);

  const isLive = liveSession.status === 'live';

  const handleNewOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard products={products} orders={orders} customers={customers} onNavigate={navigate} />;
      case 'products':
        return <Products products={products} onUpdateProducts={setProducts} />;
      case 'live':
        return <LiveSelling products={products} session={liveSession} onUpdateSession={setLiveSession} onNewOrder={handleNewOrder} onUpdateProducts={setProducts} />;
      case 'orders':
        return <Orders orders={orders} onUpdateOrders={setOrders} />;
      case 'customers':
        return <Customers customers={customers} orders={orders} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard products={products} orders={orders} customers={customers} onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">LiveSell</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Pro Platform</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Live Status */}
        {isLive && (
          <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Currently Live</span>
            </div>
            <p className="text-sm font-medium truncate">{liveSession.title}</p>
            <button onClick={() => navigate('live')} className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
              View Stream <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.label}
                {item.id === 'live' && isLive && (
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                {item.id === 'orders' && orders.filter(o => o.status === 'pending' || o.status === 'invoiced').length > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                    {orders.filter(o => o.status === 'pending' || o.status === 'invoiced').length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">MB</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">My Boutique</p>
              <p className="text-xs text-gray-400 truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center gap-4 px-4 sm:px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
              {navItems.find(n => n.id === currentPage)?.label}
            </h2>
          </div>
          {isLive && currentPage !== 'live' && (
            <button onClick={() => navigate('live')} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live Now
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">MB</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
