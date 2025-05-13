
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample data
const monthlyRevenue = [
  { name: "Jan", amount: 4200 },
  { name: "Feb", amount: 3800 },
  { name: "Mar", amount: 5100 },
  { name: "Apr", amount: 6200 },
  { name: "May", amount: 7500 },
  { name: "Jun", amount: 8900 },
];

const expenseCategories = [
  { name: "Materials", value: 2300 },
  { name: "Rent", value: 1500 },
  { name: "Marketing", value: 1100 },
  { name: "Utilities", value: 500 },
  { name: "Other", value: 800 },
];

const productPerformance = [
  { name: "Dresses", revenue: 3200, profit: 1800 },
  { name: "Tops", revenue: 2800, profit: 1500 },
  { name: "Pants", revenue: 2000, profit: 900 },
  { name: "Accessories", revenue: 1200, profit: 700 },
];

const cashFlow = [
  { month: "Jan", income: 4200, expenses: 3100, profit: 1100 },
  { month: "Feb", income: 3800, expenses: 3000, profit: 800 },
  { month: "Mar", income: 5100, expenses: 3300, profit: 1800 },
  { month: "Apr", income: 6200, expenses: 3900, profit: 2300 },
  { month: "May", income: 7500, expenses: 4200, profit: 3300 },
  { month: "Jun", income: 8900, expenses: 4800, profit: 4100 },
];

const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#1A1F2C", "#D6BCFA"];

const Finances = () => {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Finances</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">₪35,700</span>
              <span className="text-xs font-medium text-green-600">+22%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">₪13,400</span>
              <span className="text-xs font-medium text-green-600">+15%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">37.5%</span>
              <span className="text-xs font-medium text-red-600">-2.3%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₪${value}`} />
                    <Bar dataKey="amount" fill="#9b87f5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>How your money is being spent</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₪${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <div className="grid grid-cols-1 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Revenue and profit by product category</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₪${value}`} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#9b87f5" />
                    <Bar dataKey="profit" name="Profit" fill="#7E69AB" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cashflow">
          <div className="grid grid-cols-1 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
                <CardDescription>Income, expenses and profit over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cashFlow}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₪${value}`} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#9b87f5" />
                    <Bar dataKey="expenses" name="Expenses" fill="#6E59A5" />
                    <Bar dataKey="profit" name="Profit" fill="#4FD1C5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
