
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ShoppingCart, BarChart2, RefreshCcw, DownloadCloud } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Placeholder data (would be replaced with actual Shopify API data)
const sampleSalesData = [
  { name: "Jan", sales: 4200 },
  { name: "Feb", sales: 3800 },
  { name: "Mar", sales: 5100 },
  { name: "Apr", sales: 6200 },
  { name: "May", sales: 7500 },
  { name: "Jun", sales: 8900 },
];

const sampleProductData = [
  { name: "Dresses", value: 8400 },
  { name: "Tops", value: 6700 },
  { name: "Pants", value: 5400 },
  { name: "Accessories", value: 4100 },
];

const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#1A1F2C", "#D6BCFA"];

interface ShopifyDashboardProps {
  isConnected?: boolean;
  onConnect?: () => void;
}

const ShopifyDashboard = ({ isConnected = false, onConnect }: ShopifyDashboardProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [lastImported, setLastImported] = useState<Date | null>(null);

  const handleImportData = () => {
    setIsImporting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsImporting(false);
      setLastImported(new Date());
      toast({
        title: "Data imported successfully",
        description: "Your Shopify data has been updated.",
      });
    }, 2000);
  };

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopify Integration
          </CardTitle>
          <CardDescription>Connect your Shopify store to view sales data</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <ShoppingCart className="h-16 w-16 mb-4 text-muted-foreground" />
          <p className="text-center text-muted-foreground mb-4">
            Connect your Shopify store to see real-time sales data, inventory levels, and customer insights.
          </p>
          <Button onClick={onConnect}>Connect Shopify</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopify Sales
            </CardTitle>
            <CardDescription>Overview of your store performance</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {lastImported && (
              <span className="text-xs text-muted-foreground">
                Last updated: {lastImported.toLocaleString()}
              </span>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleImportData}
              disabled={isImporting}
              className="flex items-center gap-1"
            >
              {isImporting ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="h-4 w-4" />
                  <span>Import Data</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>Revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₪${value}`, "Sales"]} />
                <Area type="monotone" dataKey="sales" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Sales by product category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sampleProductData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sampleProductData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₪${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopifyDashboard;
