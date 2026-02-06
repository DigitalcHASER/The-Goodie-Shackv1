import { useState, useEffect, useRef, useCallback } from 'react';
import { Product, LiveComment, LiveSession, Order } from '../types';
import { generateComment } from '../store';
import {
  Radio, Play, Square, Eye, ShoppingCart, DollarSign, MessageCircle,
  ChevronUp, ChevronDown, Tag, Zap, Send, Clock, Check, Users, TrendingUp, Volume2, AlertTriangle
} from 'lucide-react';

interface Props {
  products: Product[];
  session: LiveSession;
  onUpdateSession: (session: LiveSession) => void;
  onNewOrder: (order: Order) => void;
  onUpdateProducts: (products: Product[]) => void;
}

export function LiveSelling({ products, session, onUpdateSession, onNewOrder, onUpdateProducts }: Props) {
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [orderCount, setOrderCount] = useState(0);
  const [salesTotal, setSalesTotal] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [commentSpeed, setCommentSpeed] = useState(3000);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const viewerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLive = session.status === 'live';

  const queuedProducts = session.productQueue
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const scrollToBottom = useCallback(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Simulate incoming comments
  useEffect(() => {
    if (!isLive) return;

    intervalRef.current = setInterval(() => {
      const keyword = activeProduct?.keyword;
      const newComment = generateComment(keyword);

      if (newComment.isOrder && activeProduct) {
        // Process order
        const availableVariants = activeProduct.variants.filter(v => v.stock > 0);
        if (availableVariants.length > 0) {
          const variant = availableVariants[Math.floor(Math.random() * availableVariants.length)];
          
          // Create order
          const order: Order = {
            id: `ORD-${String(orderCount + 100).padStart(3, '0')}`,
            customerId: `c-${Date.now()}`,
            customerName: newComment.userName,
            customerEmail: `${newComment.userName.toLowerCase().replace(/[^a-z]/g, '')}@email.com`,
            items: [{
              productId: activeProduct.id,
              productName: activeProduct.name,
              variantName: variant.name,
              price: activeProduct.price,
              quantity: 1,
            }],
            total: activeProduct.price,
            status: 'invoiced',
            source: 'live',
            createdAt: new Date().toISOString(),
          };

          onNewOrder(order);
          setOrderCount(prev => prev + 1);
          setSalesTotal(prev => prev + activeProduct.price);

          // Reduce stock
          const updatedProducts = products.map(p => {
            if (p.id === activeProduct.id) {
              return {
                ...p,
                variants: p.variants.map(v =>
                  v.id === variant.id ? { ...v, stock: Math.max(0, v.stock - 1) } : v
                ),
              };
            }
            return p;
          });
          onUpdateProducts(updatedProducts);

          newComment.text = `${keyword} - ${variant.name}`;
          newComment.productId = activeProduct.id;
        }
      }

      setComments(prev => [...prev.slice(-100), newComment]);
    }, commentSpeed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, activeProduct, commentSpeed, orderCount, products, onNewOrder, onUpdateProducts]);

  // Simulate viewer count
  useEffect(() => {
    if (!isLive) return;

    setViewerCount(Math.floor(Math.random() * 200) + 300);
    viewerRef.current = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 30) - 10;
        return Math.max(100, prev + change);
      });
    }, 5000);

    return () => {
      if (viewerRef.current) clearInterval(viewerRef.current);
    };
  }, [isLive]);

  useEffect(() => {
    scrollToBottom();
  }, [comments, scrollToBottom]);

  const startStream = () => {
    onUpdateSession({
      ...session,
      status: 'live',
      startedAt: new Date().toISOString(),
    });
    setComments([]);
    setOrderCount(0);
    setSalesTotal(0);
  };

  const endStream = () => {
    onUpdateSession({
      ...session,
      status: 'ended',
      endedAt: new Date().toISOString(),
      viewerCount,
      totalSales: salesTotal,
      totalOrders: orderCount,
    });
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (viewerRef.current) clearInterval(viewerRef.current);
  };

  const featureProduct = (product: Product) => {
    setActiveProduct(product);
    setSelectedVariant('');
    const sysComment: LiveComment = {
      id: `sys-${Date.now()}`,
      userName: '🎯 SYSTEM',
      userAvatar: '',
      text: `Now featuring: ${product.name} — Comment "${product.keyword}" to purchase! $${product.price.toFixed(2)}`,
      timestamp: new Date().toISOString(),
      isOrder: false,
    };
    setComments(prev => [...prev, sysComment]);
  };

  const moveInQueue = (productId: string, direction: 'up' | 'down') => {
    const queue = [...session.productQueue];
    const idx = queue.indexOf(productId);
    if (direction === 'up' && idx > 0) {
      [queue[idx], queue[idx - 1]] = [queue[idx - 1], queue[idx]];
    } else if (direction === 'down' && idx < queue.length - 1) {
      [queue[idx], queue[idx + 1]] = [queue[idx + 1], queue[idx]];
    }
    onUpdateSession({ ...session, productQueue: queue });
  };

  const sendAnnouncement = () => {
    if (!announcement.trim()) return;
    const sysComment: LiveComment = {
      id: `ann-${Date.now()}`,
      userName: '📢 ANNOUNCEMENT',
      userAvatar: '',
      text: announcement,
      timestamp: new Date().toISOString(),
      isOrder: false,
    };
    setComments(prev => [...prev, sysComment]);
    setAnnouncement('');
  };

  const totalStock = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0);

  const currentActiveProduct = activeProduct ? products.find(p => p.id === activeProduct.id) || activeProduct : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Radio className={`w-6 h-6 ${isLive ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
            Live Selling
          </h1>
          <p className="text-gray-500 mt-1">{session.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={commentSpeed}
            onChange={(e) => setCommentSpeed(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={5000}>Slow Comments</option>
            <option value={3000}>Normal Comments</option>
            <option value={1500}>Fast Comments</option>
            <option value={800}>Very Fast</option>
          </select>
          {!isLive ? (
            <button onClick={startStream} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl transition-all hover:scale-105">
              <Play className="w-4 h-4" /> Go Live
            </button>
          ) : (
            <button onClick={endStream} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-900 transition-all">
              <Square className="w-4 h-4" /> End Stream
            </button>
          )}
        </div>
      </div>

      {/* Live Stats Bar */}
      {isLive && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 flex flex-wrap items-center gap-6 text-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="font-bold text-red-400">LIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="font-semibold">{viewerCount.toLocaleString()}</span>
            <span className="text-gray-400 text-sm">viewers</span>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-gray-400" />
            <span className="font-semibold">{orderCount}</span>
            <span className="text-gray-400 text-sm">orders</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-emerald-400">${salesTotal.toFixed(2)}</span>
            <span className="text-gray-400 text-sm">sales</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <span className="font-semibold">{comments.length}</span>
            <span className="text-gray-400 text-sm">comments</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Facebook Live</span>
          </div>
        </div>
      )}

      {!isLive && session.status !== 'live' && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center">
          <Radio className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Go Live?</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-2">
            Set up your product queue below, then click "Go Live" to start your live selling session.
            Viewers will comment keywords to purchase items in real-time!
          </p>
          <p className="text-sm text-indigo-600 font-medium">
            💡 Tip: Arrange your products in the order you want to present them
          </p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Product Queue */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col max-h-[700px]">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Product Queue
            </h2>
            <p className="text-xs text-gray-400 mt-1">{queuedProducts.length} products queued</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 p-2">
            {queuedProducts.map((product, idx) => (
              <div
                key={product.id}
                className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${
                  currentActiveProduct?.id === product.id ? 'bg-indigo-50 ring-2 ring-indigo-200' : 'hover:bg-gray-50'
                }`}
              >
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600">${product.price}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className={`text-xs ${totalStock(product) < 3 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                      {totalStock(product)} left
                    </span>
                  </div>
                  <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono font-bold text-gray-500">
                    {product.keyword}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => moveInQueue(product.id, 'up')} disabled={idx === 0} className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-20">
                    <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  {isLive && (
                    <button onClick={() => featureProduct(product)} className="p-1 bg-indigo-100 hover:bg-indigo-200 rounded text-indigo-600" title="Feature this product">
                      <Play className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={() => moveInQueue(product.id, 'down')} disabled={idx === queuedProducts.length - 1} className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-20">
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Product + Comment Feed */}
        <div className="lg:col-span-5 space-y-4">
          {/* Featured Product Card */}
          {currentActiveProduct && isLive ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="font-bold text-sm">NOW FEATURING</span>
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Comment "{currentActiveProduct.keyword}" to buy</span>
              </div>
              <div className="flex gap-4 p-4">
                <img src={currentActiveProduct.image} alt={currentActiveProduct.name} className="w-28 h-28 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg">{currentActiveProduct.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{currentActiveProduct.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-2xl font-bold text-indigo-600">${currentActiveProduct.price.toFixed(2)}</span>
                    {currentActiveProduct.compareAtPrice && (
                      <span className="text-lg text-gray-400 line-through">${currentActiveProduct.compareAtPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {currentActiveProduct.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          v.stock === 0
                            ? 'bg-gray-100 text-gray-400 line-through'
                            : selectedVariant === v.id
                            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={v.stock === 0}
                      >
                        {v.name} ({v.stock})
                      </button>
                    ))}
                  </div>
                  {totalStock(currentActiveProduct) === 0 && (
                    <div className="flex items-center gap-2 mt-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-bold">SOLD OUT!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : isLive ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <Tag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Select a product from the queue to feature it</p>
            </div>
          ) : null}

          {/* Comment Feed */}
          {isLive && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col" style={{ height: currentActiveProduct ? '380px' : '560px' }}>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-indigo-500" /> Live Comments
                </h2>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Volume2 className="w-3 h-3" /> Auto-scrolling
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {comments.map(comment => (
                  <div
                    key={comment.id}
                    className={`flex items-start gap-2 p-2 rounded-xl text-sm transition-all ${
                      comment.isOrder
                        ? 'bg-emerald-50 border border-emerald-200'
                        : comment.userName.includes('SYSTEM') || comment.userName.includes('ANNOUNCEMENT')
                        ? 'bg-indigo-50 border border-indigo-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {comment.userAvatar ? (
                      <img src={comment.userAvatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-200 flex items-center justify-center flex-shrink-0">
                        <Radio className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold text-xs ${comment.isOrder ? 'text-emerald-700' : 'text-gray-700'}`}>
                        {comment.userName}
                      </span>
                      {comment.isOrder && (
                        <span className="ml-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-200 text-emerald-800 rounded text-[10px] font-bold">
                          <Check className="w-2.5 h-2.5" /> ORDER
                        </span>
                      )}
                      <p className={`text-sm mt-0.5 ${comment.isOrder ? 'text-emerald-800 font-medium' : 'text-gray-600'}`}>
                        {comment.text}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>
              <div className="p-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendAnnouncement()}
                    placeholder="Send announcement to viewers..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button onClick={sendAnnouncement} className="p-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Activity Feed */}
        <div className="lg:col-span-4 space-y-4">
          {isLive && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-gray-500">Revenue</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">${salesTotal.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Orders</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{orderCount}</p>
                </div>
              </div>

              {/* Recent Live Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col" style={{ height: '520px' }}>
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-emerald-500" /> Live Orders
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Orders from this session</p>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {comments
                    .filter(c => c.isOrder)
                    .reverse()
                    .map(comment => (
                      <div key={comment.id} className="flex items-center gap-3 p-3 hover:bg-emerald-50/50 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{comment.userName}</p>
                          <p className="text-xs text-gray-500">Ordered: {comment.text}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-emerald-600">
                            ${activeProduct?.price.toFixed(2) || '0.00'}
                          </p>
                          <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                            invoiced
                          </span>
                        </div>
                      </div>
                    ))}
                  {comments.filter(c => c.isOrder).length === 0 && (
                    <div className="p-8 text-center">
                      <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Waiting for orders...</p>
                      <p className="text-xs text-gray-400 mt-1">Viewers will comment keywords to purchase</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {!isLive && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">How It Works</h2>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Set Up Products', desc: 'Add products with keywords and arrange your queue.' },
                  { step: '2', title: 'Go Live', desc: 'Start your Facebook Live stream and click "Go Live" here.' },
                  { step: '3', title: 'Feature Products', desc: 'Click play on products to feature them to viewers.' },
                  { step: '4', title: 'Collect Orders', desc: 'Viewers comment the keyword to auto-create orders.' },
                  { step: '5', title: 'Send Invoices', desc: 'Invoices are auto-sent for customers to complete payment.' },
                ].map(item => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
