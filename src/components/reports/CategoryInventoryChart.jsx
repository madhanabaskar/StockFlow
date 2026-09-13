import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "../../utils/inventory";

const COLORS = ['#166534', '#22c55e', '#86efac', '#3b82f6', '#f59e0b', '#0ea5e9', '#6366f1'];

export function CategoryInventoryChart({ data }) {
  // data is array of { name, stock, value }
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="stock"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value, name, props) => {
                    const item = props.payload;
                    return [`${value} units (${formatCurrency(item.value)})`, name];
                  }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] w-full flex flex-col items-center justify-center text-text-muted bg-gray-50/50 rounded-md border border-dashed border-border">
            <p>No inventory data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
