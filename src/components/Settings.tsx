import { useState } from 'react';
import {
  Store, Bell, CreditCard, Truck, MessageSquare, Globe, Save, Check,
  Facebook, Youtube, Monitor
} from 'lucide-react';

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'My Boutique',
    storeEmail: 'hello@myboutique.com',
    currency: 'USD',
    timezone: 'America/New_York',
    autoInvoice: true,
    invoiceExpiry: 24,
    autoComment: true,
    commentReply: 'Thanks for your order, {name}! Check your inbox for your invoice. 🎉',
    shippingFlat: 5.99,
    freeShippingMin: 50,
    taxRate: 8.25,
    notifyNewOrder: true,
    notifySoldOut: true,
    notifyPayment: true,
    facebookConnected: true,
    instagramConnected: false,
    youtubeConnected: false,
    tiktokConnected: false,
  });

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure your live selling platform</p>
        </div>
        <button onClick={save}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all ${
            saved ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-200 hover:shadow-xl hover:scale-105'
          }`}>
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </div>

      {/* Store Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <Store className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-gray-900">Store Information</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input type="text" value={settings.storeName} onChange={e => setSettings(s => ({ ...s, storeName: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={settings.storeEmail} onChange={e => setSettings(s => ({ ...s, storeEmail: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input type="number" step="0.01" value={settings.taxRate} onChange={e => setSettings(s => ({ ...s, taxRate: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Selling Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-gray-900">Live Selling</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Auto-Invoice</p>
              <p className="text-sm text-gray-500">Automatically send invoices when comments are detected</p>
            </div>
            <button onClick={() => toggle('autoInvoice')}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoInvoice ? 'bg-indigo-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.autoInvoice ? 'left-6.5 translate-x-0' : 'left-0.5'}`}
                style={{ left: settings.autoInvoice ? '26px' : '2px' }} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Auto-Reply Comments</p>
              <p className="text-sm text-gray-500">Reply to purchase comments confirming the order</p>
            </div>
            <button onClick={() => toggle('autoComment')}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoComment ? 'bg-indigo-500' : 'bg-gray-300'}`}>
              <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ left: settings.autoComment ? '26px' : '2px' }} />
            </button>
          </div>
          {settings.autoComment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Reply Template</label>
              <textarea value={settings.commentReply} onChange={e => setSettings(s => ({ ...s, commentReply: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={2} />
              <p className="text-xs text-gray-400 mt-1">Use {'{name}'} for customer name</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Expiry (hours)</label>
            <input type="number" value={settings.invoiceExpiry} onChange={e => setSettings(s => ({ ...s, invoiceExpiry: parseInt(e.target.value) || 24 }))}
              className="w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>

      {/* Platform Connections */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-gray-900">Connected Platforms</h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            { key: 'facebookConnected' as const, name: 'Facebook Live', icon: Facebook, color: 'text-blue-600 bg-blue-50' },
            { key: 'instagramConnected' as const, name: 'Instagram Live', icon: Monitor, color: 'text-pink-600 bg-pink-50' },
            { key: 'youtubeConnected' as const, name: 'YouTube Live', icon: Youtube, color: 'text-red-600 bg-red-50' },
            { key: 'tiktokConnected' as const, name: 'TikTok Live', icon: Monitor, color: 'text-gray-900 bg-gray-100' },
          ].map(platform => (
            <div key={platform.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${platform.color}`}>
                  <platform.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{platform.name}</p>
                  <p className="text-xs text-gray-500">{settings[platform.key] ? 'Connected' : 'Not connected'}</p>
                </div>
              </div>
              <button onClick={() => toggle(platform.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings[platform.key]
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}>
                {settings[platform.key] ? '✓ Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <Truck className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-gray-900">Shipping</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flat Rate Shipping</label>
              <input type="number" step="0.01" value={settings.shippingFlat} onChange={e => setSettings(s => ({ ...s, shippingFlat: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Minimum ($)</label>
              <input type="number" step="0.01" value={settings.freeShippingMin} onChange={e => setSettings(s => ({ ...s, freeShippingMin: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-gray-900">Notifications</h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            { key: 'notifyNewOrder' as const, label: 'New Orders', desc: 'Get notified for every new order' },
            { key: 'notifySoldOut' as const, label: 'Sold Out Alerts', desc: 'Alert when products run out of stock' },
            { key: 'notifyPayment' as const, label: 'Payment Received', desc: 'Notification when payment is confirmed' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <button onClick={() => toggle(item.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${settings[item.key] ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{ left: settings[item.key] ? '26px' : '2px' }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-gray-900">Payment Processing</h2>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-emerald-900">Stripe</p>
                <p className="text-xs text-emerald-600">Connected · Payments enabled</p>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
