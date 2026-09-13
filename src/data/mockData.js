import { getStockStatus } from "../utils/inventory";

export const categoriesBase = [
  { id: "cat-001", name: "Electronics", description: "Gadgets and devices." },
  { id: "cat-002", name: "Furniture", description: "Office and home furniture." },
  { id: "cat-003", name: "Grocery", description: "Consumables and pantry items." },
  { id: "cat-004", name: "Clothing", description: "Apparel and uniforms." },
  { id: "cat-005", name: "Accessories", description: "Peripheral accessories." }
];

export const suppliersBase = [
  { id: "sup-001", name: "NovaTech Supplies", contact: "Alice Walker", email: "alice@novatech.com", lastDelivery: "2026-09-10" },
  { id: "sup-002", name: "Urban Office Co.", contact: "Bob Smith", email: "bob@urbanoffice.com", lastDelivery: "2026-09-08" },
  { id: "sup-003", name: "FreshMart Wholesale", contact: "Carol Davis", email: "carol@freshmart.com", lastDelivery: "2026-09-11" },
  { id: "sup-004", name: "StyleHub Distributors", contact: "Dave Evans", email: "dave@stylehub.com", lastDelivery: "2026-09-05" },
  { id: "sup-005", name: "ErgoFurniture Ltd.", contact: "Eve Martin", email: "eve@ergo.com", lastDelivery: "2026-09-02" }
];

// Helper to generate a simple SVG placeholder data URI
const createPlaceholder = (text) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="600" fill="#94a3b8">${text}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const products = [
  {
    id: "prod-001",
    name: "Wireless Headphones",
    sku: "WH-2045",
    categoryId: "cat-001",
    category: "Electronics",
    price: 7999,
    stock: 8,
    minStock: 10,
    supplierId: "sup-001",
    supplier: "NovaTech Supplies",
    description: "Premium wireless headphones with active noise cancellation.",
    image: "/images/products/wireless_headphones.jpg",
    lastUpdated: "2026-09-12",
  },
  {
    id: "prod-002",
    name: "Mechanical Keyboard",
    sku: "MK-8721",
    categoryId: "cat-001",
    category: "Electronics",
    price: 12499,
    stock: 6,
    minStock: 10,
    supplierId: "sup-001",
    supplier: "NovaTech Supplies",
    description: "RGB mechanical keyboard with tactile switches.",
    image: "/images/products/mechanical_keyboard.jpg",
    lastUpdated: "2026-09-10",
  },
  {
    id: "prod-003",
    name: "4K Monitor",
    sku: "MN-4K27",
    categoryId: "cat-001",
    category: "Electronics",
    price: 24999,
    stock: 25,
    minStock: 15,
    supplierId: "sup-001",
    supplier: "NovaTech Supplies",
    description: "27-inch 4K UHD monitor with ultra-thin bezels.",
    image: "/images/products/4k_monitor.jpg",
    lastUpdated: "2026-09-11",
  },
  {
    id: "prod-004",
    name: "Ergonomic Office Chair",
    sku: "OC-1032",
    categoryId: "cat-002",
    category: "Furniture",
    price: 14999,
    stock: 45,
    minStock: 20,
    supplierId: "sup-002",
    supplier: "Office Furnishings Co.",
    description: "Adjustable ergonomic chair with lumbar support.",
    image: "/images/products/ergonomic_office_chair.jpg",
    lastUpdated: "2026-09-08",
  },
  {
    id: "prod-005",
    name: "Standing Desk",
    sku: "SD-5521",
    categoryId: "cat-002",
    category: "Furniture",
    price: 29999,
    stock: 0,
    minStock: 10,
    supplierId: "sup-002",
    supplier: "Office Furnishings Co.",
    description: "Motorized height-adjustable standing desk.",
    image: "/images/products/standing_desk.jpg",
    lastUpdated: "2026-09-05",
  },
  {
    id: "prod-006",
    name: "Filing Cabinet",
    sku: "FC-300",
    categoryId: "cat-002",
    category: "Furniture",
    price: 5999,
    stock: 12,
    minStock: 5,
    supplierId: "sup-002",
    supplier: "Office Furnishings Co.",
    description: "Three-drawer metal filing cabinet.",
    image: "/images/products/filing_cabinet.jpg",
    lastUpdated: "2026-08-20",
  },
  {
    id: "prod-007",
    name: "Organic Coffee Beans",
    sku: "CB-ORG-1KG",
    categoryId: "cat-003",
    category: "Grocery",
    price: 1299,
    stock: 120,
    minStock: 50,
    supplierId: "sup-004",
    supplier: "Fresh Foods Ltd.",
    description: "1kg bag of organic arabica coffee beans.",
    image: "/images/products/organic_coffee_beans.jpg",
    lastUpdated: "2026-09-12",
  },
  {
    id: "prod-008",
    name: "Green Tea Bags",
    sku: "GT-100",
    categoryId: "cat-003",
    category: "Grocery",
    price: 499,
    stock: 85,
    minStock: 40,
    supplierId: "sup-004",
    supplier: "Fresh Foods Ltd.",
    description: "Pack of 100 premium green tea bags.",
    image: "/images/products/green_tea_bags.jpg",
    lastUpdated: "2026-09-10",
  },
  {
    id: "prod-009",
    name: "Almonds 500g",
    sku: "ALM-500",
    categoryId: "cat-003",
    category: "Grocery",
    price: 899,
    stock: 10,
    minStock: 30,
    supplierId: "sup-004",
    supplier: "Fresh Foods Ltd.",
    description: "Premium California almonds.",
    image: "/images/products/almonds_500g.jpg",
    lastUpdated: "2026-09-05",
  },
  {
    id: "prod-010",
    name: "Cotton T-Shirt",
    sku: "CT-1029",
    categoryId: "cat-004",
    category: "Clothing",
    price: 999,
    stock: 150,
    minStock: 50,
    supplierId: "sup-003",
    supplier: "Global Garments",
    description: "100% cotton plain crew neck t-shirt.",
    image: "/images/products/cotton_tshirt.jpg",
    lastUpdated: "2026-08-25",
  },
  {
    id: "prod-011",
    name: "Denim Jeans",
    sku: "DJ-501",
    categoryId: "cat-004",
    category: "Clothing",
    price: 2499,
    stock: 5,
    minStock: 20,
    supplierId: "sup-003",
    supplier: "Global Garments",
    description: "Classic straight fit denim jeans.",
    image: "/images/products/denim_jeans.jpg",
    lastUpdated: "2026-08-20",
  },
  {
    id: "prod-012",
    name: "Winter Jacket",
    sku: "WJ-900",
    categoryId: "cat-004",
    category: "Clothing",
    price: 4599,
    stock: 0,
    minStock: 15,
    supplierId: "sup-003",
    supplier: "Global Garments",
    description: "Insulated waterproof winter jacket.",
    image: "/images/products/winter_jacket.jpg",
    lastUpdated: "2026-08-10",
  },
  {
    id: "prod-013",
    name: "Leather Wallet",
    sku: "LW-200",
    categoryId: "cat-005",
    category: "Accessories",
    price: 1499,
    stock: 45,
    minStock: 20,
    supplierId: "sup-003",
    supplier: "Global Garments",
    description: "Genuine leather bi-fold wallet.",
    image: "/images/products/leather_wallet.jpg",
    lastUpdated: "2026-08-22",
  },
  {
    id: "prod-014",
    name: "Laptop Backpack",
    sku: "BP-L15",
    categoryId: "cat-005",
    category: "Accessories",
    price: 2999,
    stock: 22,
    minStock: 15,
    supplierId: "sup-003",
    supplier: "Global Garments",
    description: "Water-resistant backpack fits up to 15-inch laptops.",
    image: "/images/products/laptop_backpack.jpg",
    lastUpdated: "2026-08-25",
  },
  {
    id: "prod-015",
    name: "Smart Watch",
    sku: "SW-800",
    categoryId: "cat-001",
    category: "Electronics",
    price: 19999,
    stock: 35,
    minStock: 20,
    supplierId: "sup-001",
    supplier: "NovaTech Supplies",
    description: "Fitness and health tracking smart watch.",
    image: "/images/products/smart_watch.jpg",
    lastUpdated: "2026-09-02",
  },
  {
    id: "prod-016",
    name: "Yoga Mat",
    sku: "YM-100",
    categoryId: "cat-005",
    category: "Accessories",
    price: 899,
    stock: 60,
    minStock: 20,
    supplierId: "sup-003",
    supplier: "Global Garments",
    description: "Non-slip exercise yoga mat with carrying strap.",
    image: "/images/products/yoga_mat.jpg",
    lastUpdated: "2026-08-28",
  },
];

// Add calculated status to products for convenience in charts if needed, 
// though we use getStockStatus directly in components
products.forEach(p => p.status = getStockStatus(p.stock, p.minStock));

export const categories = categoriesBase;
export const suppliers = suppliersBase;

// Dynamic dashboard statistics
export const summaryStats = {
  get totalProducts() { return products.length; },
  get totalStock() { return products.reduce((sum, p) => sum + p.stock, 0); },
  get lowStock() { return products.filter(p => p.stock > 0 && p.stock <= p.minStock).length; },
  get outOfStock() { return products.filter(p => p.stock === 0).length; },
  get inventoryValue() { return products.reduce((sum, p) => sum + (p.price * p.stock), 0); },
  // Static trends for UI
  totalProductsTrend: "+8.2%",
  totalStockTrend: "+5.1%",
  lowStockTrend: "-2.4%",
  outOfStockTrend: "-1.1%",
};

// Raw Stock Movements with product IDs
export const stockMovementsRaw = [
  {
    id: "mov-001",
    productId: "prod-002",
    type: "Stock In",
    quantity: 20,
    previousStock: 15,
    newStock: 35,
    reference: "PO-2026-1045",
    reason: "",
    notes: "Restock for Q3",
    createdAt: "2026-09-10T10:30:00"
  },
  {
    id: "mov-002",
    productId: "prod-001",
    type: "Stock Out",
    quantity: 2,
    previousStock: 10,
    newStock: 8,
    reference: "SO-2026-0098",
    reason: "",
    notes: "Customer order",
    createdAt: "2026-09-11T14:15:00"
  }
];

// Resolved Stock Movements
export const stockMovements = stockMovementsRaw.map(move => {
  const product = products.find(p => p.id === move.productId);
  return {
    ...move,
    product: product ? product.name : "Unknown Product"
  };
});

// Chart data
export const chartData = [
  { name: "Jan", stock: 4000, value: 2400 },
  { name: "Feb", stock: 3000, value: 1398 },
  { name: "Mar", stock: 2000, value: 9800 },
  { name: "Apr", stock: 2780, value: 3908 },
  { name: "May", stock: 1890, value: 4800 },
  { name: "Jun", stock: 2390, value: 3800 },
  { name: "Jul", stock: summaryStats.totalStock, value: 4300 },
];

export const categoryData = categories.filter(c => c.stock > 0).map(c => ({
  name: c.name,
  value: c.stock
}));

export const recentActivity = [
  {
    id: 1,
    type: "add",
    title: "Product added",
    description: "Organic Coffee Beans added to inventory",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "update",
    title: "Stock updated",
    description: "Ergonomic Office Chair stock increased by 25",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "warning",
    title: "Low stock",
    description: "Almonds 500g reached minimum stock level",
    time: "5 hours ago",
  },
  {
    id: 4,
    type: "edit",
    title: "Product updated",
    description: "Standing Desk information updated",
    time: "1 day ago",
  },
];
