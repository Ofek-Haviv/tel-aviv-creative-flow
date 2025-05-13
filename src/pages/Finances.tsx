import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShopify } from "@/hooks/useShopify";
import { format } from 'date-fns';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { Loader2 } from 'lucide-react';

// Add these interfaces to fix the type error
interface ShopifyConnectProps {
  isConnected: boolean;
  onConnect: (shopUrl: string) => void;
}

const ShopifyConnect: React.FC<ShopifyConnectProps> = ({ isConnected, onConnect }) => {
  const [shopUrl, setShopUrl] = React.useState('');
  
  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(shopUrl);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Shopify Store</CardTitle>
        <CardDescription>
          Integrate your Shopify store to see sales data and metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="shop-url" className="text-sm font-medium">Shopify Store URL</label>
              <Input 
                id="shop-url"
                placeholder="yourstorename.myshopify.com"
                value={shopUrl}
                onChange={(e) => setShopUrl(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your Shopify store URL to connect to your store
              </p>
            </div>
            <Button type="submit" className="w-full">Connect Shopify Store</Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-green-600 font-medium mb-2">✓ Shopify Connected</p>
            <p className="text-sm text-muted-foreground">
              Your Shopify store is connected and data is being synced.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Finances = () => {
  const {
    isConnected,
    shopifyStore,
    isLoading,
    isImporting,
    lastImported,
    salesData,
    productData,
    connectShopify,
    importData
  } = useShopify();

  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Finances</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !isConnected ? (
            <ShopifyConnect isConnected={isConnected} onConnect={connectShopify} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${salesData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +10.1% from last month
                  </p>
                  <div className="h-[80px] mt-4">
                    <LineChart 
                      data={salesData}
                      xAxisKey="name"
                      series={[
                        { key: "sales", label: "Revenue", color: "blue" }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    4.3%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% from last month
                  </p>
                  <div className="h-[80px] mt-4">
                    <LineChart 
                      data={[
                        { name: "Jan", value: 2.1 },
                        { name: "Feb", value: 2.4 },
                        { name: "Mar", value: 2.8 },
                        { name: "Apr", value: 3.2 },
                        { name: "May", value: 3.8 },
                        { name: "Jun", value: 4.3 }
                      ]}
                      xAxisKey="name"
                      series={[
                        { key: "value", label: "Conversion", color: "green" }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    $86.34
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +$12.40 from last month
                  </p>
                  <div className="h-[80px] mt-4">
                    <LineChart 
                      data={[
                        { name: "Jan", value: 70.2 },
                        { name: "Feb", value: 72.8 },
                        { name: "Mar", value: 74.5 },
                        { name: "Apr", value: 78.9 },
                        { name: "May", value: 82.4 },
                        { name: "Jun", value: 86.3 }
                      ]}
                      xAxisKey="name"
                      series={[
                        { key: "value", label: "AOV", color: "violet" }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {isConnected && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                {lastImported && (
                  <span>Last updated: {format(new Date(lastImported), 'MMM d, yyyy h:mm a')}</span>
                )}
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={importData}
                disabled={isImporting}
              >
                {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Refresh Data
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !isConnected ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Connect your Shopify store to view sales data.</p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <BarChart
                    data={salesData}
                    xAxisKey="name"
                    series={[{ key: "sales", label: "Sales", color: "blue" }]}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !isConnected ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Connect your Shopify store to view product data.</p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Revenue by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <PieChart
                    data={productData}
                    dataKey="value"
                    nameKey="name"
                    colors={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shopify Connection Settings</CardTitle>
              <CardDescription>
                Manage your Shopify store connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shopifyStore && (
                <div className="space-y-2">
                  <p>
                    Connected to: <a href={`https://${shopifyStore.shopUrl}`} target="_blank" rel="noopener noreferrer" className="underline">{shopifyStore.shopUrl}</a>
                  </p>
                  <p>
                    Connected on: {format(new Date(shopifyStore.connectedAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              )}
              <Button variant="destructive" disabled>
                Disconnect Shopify (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
