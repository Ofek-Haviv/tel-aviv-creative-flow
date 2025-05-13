
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Shopify } from "lucide-react";

// Placeholder data (would be replaced with actual Shopify API data)
const sampleSalesData = [
  { name: "May 7", sales: 3200, orders: 21 },
  { name: "May 8", sales: 4100, orders: 24 },
  { name: "May 9", sales: 2800, orders: 18 },
  { name: "May 10", sales: 5400, orders: 32 },
  { name: "May 11", sales: 4700, orders: 28 },
  { name: "May 12", sales: 6800, orders: 41 },
  { name: "May 13", sales: 5200, orders: 30 },
];

const productPerformance = [
  { name: "Summer Collection", value: 32 },
  { name: "Accessories", value: 24 },
  { name: "Limited Edition", value: 18 },
  { name: "Basics", value: 26 },
];

const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#1A1F2C", "#D6BCFA"];

export interface ShopifyDashboardProps {
  isConnected?: boolean;
  onConnect?: () => void;
}

const ShopifyDashboard: React.FC<ShopifyDashboardProps> = ({
  isConnected = false,
  onConnect = () => console.log("Connect to Shopify clicked"),
}) => {
  const [dateRange, setDateRange] = useState("week");

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shopify className="h-5 w-5" />
            Shopify Integration
          </CardTitle>
          <CardDescription>Connect your Shopify store to view sales data</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Shopify className="h-16 w-16 mb-4 text-muted-foreground" />
          <p className="text-center text-muted-foreground mb-4">
            Connect your Shopify store to see real-time sales data, inventory levels, and customer insights.
          </p>
          <Button onClick={onConnect}>
            Connect Shopify Store
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Shopify className="h-5 w-5" />
            Shopify Sales
          </CardTitle>
          <CardDescription>Overview of your store performance</CardDescription>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="quarter">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">₪32,200</span>
                <span className="text-xs font-medium text-green-600">+18%</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">194</span>
                <span className="text-xs font-medium text-green-600">+12%</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">3.8%</span>
                <span className="text-xs font-medium text-green-600">+0.5%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="mt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value) => `₪${value}`} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#9b87f5" name="Sales (₪)" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#6E59A5" name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="mt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {productPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="customers" className="mt-4">
            <p className="text-center text-muted-foreground py-10">
              Customer data will appear here once connected to Shopify API
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ShopifyDashboard;
