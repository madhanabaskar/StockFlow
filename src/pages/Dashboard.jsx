import React, { useMemo } from "react";
import { Package, ArrowRightLeft, AlertTriangle, XCircle, Plus } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { ProductStatusBadge } from "../components/products/ProductStatusBadge";
import { cn } from "../lib/utils";
import { useProducts } from "../context/ProductContext";
import { useInventory } from "../context/InventoryContext";
import { formatCurrency } from "../utils/inventory";
import { categoriesBase } from "../data/mockData";
import { useDocumentTitle } from "../utils/useDocumentTitle";
import { useToast } from "../context/ToastContext";

const COLORS = ['#166534', '#22c55e', '#86efac', '#3b82f6', '#f59e0b'];

export function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { products } = useProducts();
  const { movements } = useInventory();

  // Dynamic derivations based on contexts
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.minStock);
  const outOfStock = products.filter(p => p.stock === 0).length;

  // Chart data calculations
  const chartData = [
    { name: "Jan", stock: 4000, value: 2400 },
    { name: "Feb", stock: 3000, value: 1398 },
    { name: "Mar", stock: 2000, value: 9800 },
    { name: "Apr", stock: 2780, value: 3908 },
    { name: "May", stock: 1890, value: 4800 },
    { name: "Jun", stock: 2390, value: 3800 },
    { name: "Current", stock: totalStock, value: 4300 },
  ];

  const categoryData = categoriesBase.map(cat => ({
    name: cat.name,
    value: products.filter(p => p.categoryId === cat.id).reduce((sum, p) => sum + p.stock, 0)
  })).filter(c => c.value > 0);

  // Formatted Recent Activity from real movements
  const recentActivity = useMemo(() => {
    return [...movements]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
      .map(m => {
        const product = products.find(p => p.id === m.productId);
        const pName = product ? product.name : "Deleted Product";
        let title = m.type;
        let description = "";
        
        if (m.type === "Stock In") {
          description = `${pName} +${m.quantity} units`;
        } else if (m.type === "Stock Out") {
          description = `${pName} -${m.quantity} units`;
        } else if (m.type === "Adjustment") {
          description = `${pName} adjusted to ${m.newStock} units`;
        }

        const now = new Date();
        const mDate = new Date(m.createdAt);
        const diffHours = Math.floor((now - mDate) / (1000 * 60 * 60));
        let time = diffHours < 1 ? "Just now" : diffHours < 24 ? `${diffHours} hours ago` : `${Math.floor(diffHours/24)} days ago`;

        return {
          id: m.id,
          type: m.type === "Stock In" ? 'add' : m.type === "Stock Out" ? 'warning' : 'update',
          title,
          description,
          time
        };
      });
  }, [movements, products]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Here's what's happening with your inventory today."
        actionLabel={<><Plus size={16} className="mr-2" /> Add Product</>}
        onAction={() => addToast("Add Product feature coming soon!")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Products" 
          value={totalProducts.toLocaleString('en-IN')} 
          trend="+8.2%" 
          icon={Package} 
        />
        <StatCard 
          title="Total Stock" 
          value={totalStock.toLocaleString('en-IN')} 
          trend="+5.1%" 
          icon={ArrowRightLeft} 
        />
        <StatCard 
          title="Low Stock" 
          value={lowStockProducts.length.toLocaleString('en-IN')} 
          trend="-2.4%" 
          icon={AlertTriangle} 
          trendDown={true}
        />
        <StatCard 
          title="Out of Stock" 
          value={outOfStock.toLocaleString('en-IN')} 
          trend="-1.1%" 
          icon={XCircle} 
          trendDown={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Stock Overview</CardTitle>
            <CardDescription>Monthly stock quantity trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <RechartsTooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                  />
                  <Bar dataKey="stock" fill="#166534" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-text-muted text-sm">No category data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto flex-1">
            {lowStockProducts.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-muted uppercase bg-gray-50 border-y border-border">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium">SKU</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium text-right">Stock</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lowStockProducts.slice(0, 4).map((product) => (
                    <tr 
                      key={product.id} 
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <td className="px-6 py-4 font-medium text-text-main flex items-center gap-3">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-6 h-6 rounded object-cover border border-border bg-white" 
                          />
                        )}
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-text-muted">{product.sku}</td>
                      <td className="px-6 py-4 text-text-muted">{product.category}</td>
                      <td className="px-6 py-4 font-medium text-right text-text-main">{product.stock}</td>
                      <td className="px-6 py-4">
                        <ProductStatusBadge stock={product.stock} minStock={product.minStock} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-text-muted flex flex-col items-center justify-center h-full">
                <p>All products are sufficiently stocked.</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4 relative">
                    {index !== recentActivity.length - 1 && (
                      <div className="absolute top-8 bottom-[-24px] left-[11px] w-[2px] bg-border"></div>
                    )}
                    <div className="relative z-10 flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border-2 border-card mt-0.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        activity.type === 'add' ? 'bg-primary' : 
                        activity.type === 'warning' ? 'bg-amber-500' : 
                        activity.type === 'update' ? 'bg-blue-500' : 'bg-gray-500'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-main">{activity.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-text-muted text-sm py-4">No recent activity</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, trendDown }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-muted">{title}</p>
            <h4 className="text-2xl font-bold text-text-main mt-2">{value}</h4>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary-light/50 flex items-center justify-center text-primary">
            <Icon size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className={cn("font-medium", trendDown ? "text-red-600" : "text-emerald-600")}>
            {trend}
          </span>
          <span className="text-text-muted ml-2">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
