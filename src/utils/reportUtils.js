import { getStockStatus } from "./inventory";

export const getInventoryValue = (products) => {
  return products.reduce((sum, p) => sum + (p.price * p.stock), 0);
};

export const getLowStockProducts = (products) => {
  return products.filter(p => p.stock > 0 && p.stock <= p.minStock);
};

export const getOutOfStockProducts = (products) => {
  return products.filter(p => p.stock === 0);
};

export const getInventoryByCategory = (products) => {
  const map = {};
  products.forEach(p => {
    if (!map[p.category]) map[p.category] = { name: p.category, stock: 0, value: 0 };
    map[p.category].stock += p.stock;
    map[p.category].value += p.price * p.stock;
  });
  return Object.values(map).sort((a, b) => b.stock - a.stock);
};

export const getTopProductsByValue = (products) => {
  return [...products]
    .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
    .slice(0, 5);
};

export const getMovementSummary = (movements, dateRangeStr) => {
  const filtered = filterMovementsByDate(movements, dateRangeStr);
  
  let totalIn = 0;
  let totalOut = 0;
  let adjustments = 0;

  filtered.forEach(m => {
    if (m.type === "Stock In") totalIn += m.quantity;
    else if (m.type === "Stock Out") totalOut += m.quantity;
    else if (m.type === "Adjustment") adjustments += 1;
  });

  return {
    totalIn,
    totalOut,
    adjustments,
    netMovement: totalIn - totalOut
  };
};

export const getMostActiveProducts = (movements, products, dateRangeStr) => {
  const filtered = filterMovementsByDate(movements, dateRangeStr);
  const countMap = {};
  
  filtered.forEach(m => {
    countMap[m.productId] = (countMap[m.productId] || 0) + 1;
  });

  const sorted = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const product = products.find(p => p.id === id);
      return {
        id,
        name: product ? product.name : "Deleted Product",
        count
      };
    });

  return sorted;
};

export const getSupplierOverview = (products) => {
  const map = {};
  products.forEach(p => {
    if (!map[p.supplier]) map[p.supplier] = { name: p.supplier, productCount: 0, totalStock: 0, totalValue: 0 };
    map[p.supplier].productCount += 1;
    map[p.supplier].totalStock += p.stock;
    map[p.supplier].totalValue += p.price * p.stock;
  });
  return Object.values(map).sort((a, b) => b.totalValue - a.totalValue);
};

export const getCategoryPerformance = (products) => {
  const map = {};
  products.forEach(p => {
    if (!map[p.category]) map[p.category] = { name: p.category, productCount: 0, totalStock: 0, totalValue: 0, lowStock: 0, outOfStock: 0 };
    map[p.category].productCount += 1;
    map[p.category].totalStock += p.stock;
    map[p.category].totalValue += p.price * p.stock;
    if (p.stock === 0) map[p.category].outOfStock += 1;
    else if (p.stock <= p.minStock) map[p.category].lowStock += 1;
  });
  return Object.values(map).sort((a, b) => b.totalValue - a.totalValue);
};

export const filterMovementsByDate = (movements, dateRangeStr) => {
  if (dateRangeStr === "All Time") return movements;
  
  const now = new Date();
  return movements.filter(m => {
    const mDate = new Date(m.createdAt);
    if (isNaN(mDate.getTime())) return false;
    
    const diffTime = Math.abs(now - mDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (dateRangeStr === "Today") return diffDays <= 1;
    if (dateRangeStr === "Last 7 Days") return diffDays <= 7;
    if (dateRangeStr === "Last 30 Days") return diffDays <= 30;
    if (dateRangeStr === "Last 90 Days") return diffDays <= 90;
    
    return true;
  });
};

export const getMovementChartData = (movements, dateRangeStr) => {
  const filtered = filterMovementsByDate(movements, dateRangeStr);
  
  const dateMap = {};
  filtered.forEach(m => {
    const d = new Date(m.createdAt);
    if (isNaN(d.getTime())) return;
    
    const dateKey = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(d);
    
    if (!dateMap[dateKey]) dateMap[dateKey] = { date: dateKey, stockIn: 0, stockOut: 0 };
    
    if (m.type === "Stock In") dateMap[dateKey].stockIn += m.quantity;
    else if (m.type === "Stock Out") dateMap[dateKey].stockOut += m.quantity;
  });
  
  // Return sorted by actual date loosely if possible, but map iteration handles insertion order 
  // which might be reversed if movements are newest first. Let's sort by actual date string.
  return Object.values(dateMap).reverse(); 
};
