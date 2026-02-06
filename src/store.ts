import { Product, Customer, Order, LiveComment, LiveSession } from './types';

const productImages = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
];

const avatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
];

export const initialProducts: Product[] = [
  {
    id: 'p1', name: 'Vintage Floral Maxi Dress', description: 'Beautiful vintage-inspired floral maxi dress, perfect for summer.', price: 49.99, compareAtPrice: 79.99,
    image: productImages[0], keyword: 'DRESS', category: 'Dresses', status: 'active', createdAt: '2024-01-15',
    variants: [
      { id: 'v1', name: 'Small', stock: 5, sku: 'DRESS-S' },
      { id: 'v2', name: 'Medium', stock: 8, sku: 'DRESS-M' },
      { id: 'v3', name: 'Large', stock: 3, sku: 'DRESS-L' },
      { id: 'v4', name: 'XL', stock: 2, sku: 'DRESS-XL' },
    ],
  },
  {
    id: 'p2', name: 'Classic Leather Handbag', description: 'Genuine leather handbag with gold hardware.', price: 89.99, compareAtPrice: 129.99,
    image: productImages[1], keyword: 'BAG', category: 'Accessories', status: 'active', createdAt: '2024-01-20',
    variants: [
      { id: 'v5', name: 'Black', stock: 10, sku: 'BAG-BLK' },
      { id: 'v6', name: 'Brown', stock: 7, sku: 'BAG-BRN' },
      { id: 'v7', name: 'Tan', stock: 4, sku: 'BAG-TAN' },
    ],
  },
  {
    id: 'p3', name: 'Athletic Running Shoes', description: 'Lightweight and comfortable running shoes for everyday wear.', price: 64.99,
    image: productImages[2], keyword: 'SHOES', category: 'Footwear', status: 'active', createdAt: '2024-02-01',
    variants: [
      { id: 'v8', name: 'Size 6', stock: 3, sku: 'SHOE-6' },
      { id: 'v9', name: 'Size 7', stock: 5, sku: 'SHOE-7' },
      { id: 'v10', name: 'Size 8', stock: 6, sku: 'SHOE-8' },
      { id: 'v11', name: 'Size 9', stock: 4, sku: 'SHOE-9' },
      { id: 'v12', name: 'Size 10', stock: 2, sku: 'SHOE-10' },
    ],
  },
  {
    id: 'p4', name: 'Designer Sunglasses', description: 'UV-protected polarized sunglasses with premium frame.', price: 34.99, compareAtPrice: 59.99,
    image: productImages[3], keyword: 'SHADES', category: 'Accessories', status: 'active', createdAt: '2024-02-10',
    variants: [
      { id: 'v13', name: 'Black Frame', stock: 15, sku: 'SUN-BLK' },
      { id: 'v14', name: 'Gold Frame', stock: 8, sku: 'SUN-GLD' },
    ],
  },
  {
    id: 'p5', name: 'Skincare Bundle Set', description: 'Complete skincare routine with cleanser, toner, and moisturizer.', price: 39.99,
    image: productImages[4], keyword: 'SKIN', category: 'Beauty', status: 'active', createdAt: '2024-02-15',
    variants: [
      { id: 'v15', name: 'Normal Skin', stock: 12, sku: 'SKIN-NRM' },
      { id: 'v16', name: 'Oily Skin', stock: 9, sku: 'SKIN-OIL' },
      { id: 'v17', name: 'Dry Skin', stock: 6, sku: 'SKIN-DRY' },
    ],
  },
  {
    id: 'p6', name: 'Men\'s Cologne Collection', description: 'Premium cologne set with 3 fragrances.', price: 54.99, compareAtPrice: 89.99,
    image: productImages[5], keyword: 'COLOGNE', category: 'Beauty', status: 'active', createdAt: '2024-02-20',
    variants: [
      { id: 'v18', name: 'Classic Set', stock: 7, sku: 'COL-CLS' },
      { id: 'v19', name: 'Sport Set', stock: 5, sku: 'COL-SPT' },
    ],
  },
  {
    id: 'p7', name: 'Retro Sneakers', description: 'Retro-style sneakers with modern comfort technology.', price: 74.99,
    image: productImages[6], keyword: 'RETRO', category: 'Footwear', status: 'active', createdAt: '2024-03-01',
    variants: [
      { id: 'v20', name: 'Size 7', stock: 4, sku: 'RET-7' },
      { id: 'v21', name: 'Size 8', stock: 6, sku: 'RET-8' },
      { id: 'v22', name: 'Size 9', stock: 3, sku: 'RET-9' },
      { id: 'v23', name: 'Size 10', stock: 5, sku: 'RET-10' },
    ],
  },
  {
    id: 'p8', name: 'Luxury Watch', description: 'Elegant timepiece with stainless steel band.', price: 149.99, compareAtPrice: 249.99,
    image: productImages[7], keyword: 'WATCH', category: 'Accessories', status: 'active', createdAt: '2024-03-10',
    variants: [
      { id: 'v24', name: 'Silver', stock: 3, sku: 'WATCH-SLV' },
      { id: 'v25', name: 'Gold', stock: 2, sku: 'WATCH-GLD' },
      { id: 'v26', name: 'Rose Gold', stock: 4, sku: 'WATCH-RSG' },
    ],
  },
];

export const initialCustomers: Customer[] = [
  { id: 'c1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '(555) 123-4567', avatar: avatars[0], totalOrders: 12, totalSpent: 487.50, joinedAt: '2023-06-15', lastOrderAt: '2024-03-10' },
  { id: 'c2', name: 'Mike Chen', email: 'mike@email.com', phone: '(555) 234-5678', avatar: avatars[1], totalOrders: 8, totalSpent: 325.00, joinedAt: '2023-08-20', lastOrderAt: '2024-03-08' },
  { id: 'c3', name: 'Jessica Williams', email: 'jessica@email.com', phone: '(555) 345-6789', avatar: avatars[2], totalOrders: 15, totalSpent: 892.75, joinedAt: '2023-05-10', lastOrderAt: '2024-03-12' },
  { id: 'c4', name: 'David Brown', email: 'david@email.com', phone: '(555) 456-7890', avatar: avatars[3], totalOrders: 5, totalSpent: 215.00, joinedAt: '2023-11-01', lastOrderAt: '2024-02-28' },
  { id: 'c5', name: 'Emily Davis', email: 'emily@email.com', phone: '(555) 567-8901', avatar: avatars[4], totalOrders: 22, totalSpent: 1245.50, joinedAt: '2023-03-22', lastOrderAt: '2024-03-11' },
  { id: 'c6', name: 'Chris Martinez', email: 'chris@email.com', phone: '(555) 678-9012', avatar: avatars[5], totalOrders: 3, totalSpent: 149.97, joinedAt: '2024-01-05', lastOrderAt: '2024-03-05' },
  { id: 'c7', name: 'Amanda Wilson', email: 'amanda@email.com', phone: '(555) 789-0123', avatar: avatars[6], totalOrders: 9, totalSpent: 567.25, joinedAt: '2023-07-18', lastOrderAt: '2024-03-09' },
  { id: 'c8', name: 'James Taylor', email: 'james@email.com', phone: '(555) 890-1234', avatar: avatars[7], totalOrders: 6, totalSpent: 298.50, joinedAt: '2023-09-30', lastOrderAt: '2024-03-07' },
];

export const initialOrders: Order[] = [
  { id: 'ORD-001', customerId: 'c1', customerName: 'Sarah Johnson', customerEmail: 'sarah@email.com', items: [{ productId: 'p1', productName: 'Vintage Floral Maxi Dress', variantName: 'Medium', price: 49.99, quantity: 1 }], total: 49.99, status: 'paid', source: 'live', createdAt: '2024-03-10T14:30:00', paidAt: '2024-03-10T14:35:00' },
  { id: 'ORD-002', customerId: 'c3', customerName: 'Jessica Williams', customerEmail: 'jessica@email.com', items: [{ productId: 'p2', productName: 'Classic Leather Handbag', variantName: 'Black', price: 89.99, quantity: 1 }, { productId: 'p4', productName: 'Designer Sunglasses', variantName: 'Gold Frame', price: 34.99, quantity: 1 }], total: 124.98, status: 'shipped', source: 'live', createdAt: '2024-03-09T19:15:00', paidAt: '2024-03-09T19:20:00' },
  { id: 'ORD-003', customerId: 'c5', customerName: 'Emily Davis', customerEmail: 'emily@email.com', items: [{ productId: 'p8', productName: 'Luxury Watch', variantName: 'Rose Gold', price: 149.99, quantity: 1 }], total: 149.99, status: 'invoiced', source: 'live', createdAt: '2024-03-11T20:00:00' },
  { id: 'ORD-004', customerId: 'c2', customerName: 'Mike Chen', customerEmail: 'mike@email.com', items: [{ productId: 'p3', productName: 'Athletic Running Shoes', variantName: 'Size 9', price: 64.99, quantity: 1 }], total: 64.99, status: 'paid', source: 'website', createdAt: '2024-03-08T10:00:00', paidAt: '2024-03-08T10:05:00' },
  { id: 'ORD-005', customerId: 'c7', customerName: 'Amanda Wilson', customerEmail: 'amanda@email.com', items: [{ productId: 'p5', productName: 'Skincare Bundle Set', variantName: 'Normal Skin', price: 39.99, quantity: 2 }], total: 79.98, status: 'delivered', source: 'live', createdAt: '2024-03-05T16:45:00', paidAt: '2024-03-05T16:50:00' },
  { id: 'ORD-006', customerId: 'c4', customerName: 'David Brown', customerEmail: 'david@email.com', items: [{ productId: 'p6', productName: "Men's Cologne Collection", variantName: 'Classic Set', price: 54.99, quantity: 1 }], total: 54.99, status: 'pending', source: 'live', createdAt: '2024-03-12T21:30:00' },
  { id: 'ORD-007', customerId: 'c6', customerName: 'Chris Martinez', customerEmail: 'chris@email.com', items: [{ productId: 'p7', productName: 'Retro Sneakers', variantName: 'Size 8', price: 74.99, quantity: 1 }], total: 74.99, status: 'cancelled', source: 'website', createdAt: '2024-03-06T11:20:00' },
  { id: 'ORD-008', customerId: 'c8', customerName: 'James Taylor', customerEmail: 'james@email.com', items: [{ productId: 'p1', productName: 'Vintage Floral Maxi Dress', variantName: 'Large', price: 49.99, quantity: 1 }, { productId: 'p5', productName: 'Skincare Bundle Set', variantName: 'Oily Skin', price: 39.99, quantity: 1 }], total: 89.98, status: 'paid', source: 'live', createdAt: '2024-03-07T18:00:00', paidAt: '2024-03-07T18:10:00' },
];

const commentNames = ['Sarah J.', 'Mike C.', 'Jessica W.', 'Emily D.', 'Amanda W.', 'Lisa M.', 'Tom R.', 'Chris M.', 'David B.', 'Rachel K.', 'Katie S.', 'Jen P.', 'Maria L.', 'Olivia H.', 'Sophia T.'];
const commentTexts = [
  'Love this! 😍', 'How much is this?', 'What sizes are available?', 'This is gorgeous!',
  'Can I get this in black?', '🔥🔥🔥', 'Need this in my life!', 'Is this true to size?',
  'Shipping to Canada?', 'Beautiful! 💕', 'How long does shipping take?', 'Do you have more colors?',
  'This is amazing quality!', 'Will this restock?', 'I love your lives! ❤️', 'Best prices ever!',
];

export function generateComment(keyword?: string): LiveComment {
  const isOrder = keyword ? Math.random() > 0.6 : false;
  const name = commentNames[Math.floor(Math.random() * commentNames.length)];
  const text = isOrder ? keyword! : commentTexts[Math.floor(Math.random() * commentTexts.length)];
  const avatarIdx = Math.floor(Math.random() * avatars.length);
  
  return {
    id: `cmt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userName: name,
    userAvatar: avatars[avatarIdx],
    text,
    timestamp: new Date().toISOString(),
    isOrder,
  };
}

export const initialLiveSession: LiveSession = {
  id: 'ls1',
  title: 'Spring Collection Launch 🌸',
  platform: 'facebook',
  status: 'scheduled',
  viewerCount: 0,
  totalSales: 0,
  totalOrders: 0,
  productQueue: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'],
};
