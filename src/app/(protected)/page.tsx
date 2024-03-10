import { CreditCard, DollarSign, LineChart, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OverviewBar from "@/components/dashboard/overviewBar";
import PieChartAnalytics from "@/components/dashboard/pieChart";

export default function Page() {
  return (
    <div className="space-y-8 mt-20">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">Dashboard</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Withdraw
              </CardTitle>
              <DollarSign size={16} className="text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">$123,123.92</div>
              <div className="text-sm text-muted-foreground">
                10.2 last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transaction
              </CardTitle>
              <CreditCard size={16} className="text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">$123,123.92</div>
              <div className="text-sm text-muted-foreground">
                10.2 last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active User</CardTitle>
              <LineChart size={16} className="text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">+179</div>
              <div className="text-sm text-muted-foreground">
                +91 since last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Verification
              </CardTitle>
              <Users size={16} className="text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">2466</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          <div className="col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <OverviewBar />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Top Installed Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChartAnalytics />
              </CardContent>
            </Card>
          </div>
        </div>
        {/* 
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <CardsChat />
          </div>
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <RecentSale />
              </CardContent>
            </Card>
          </div>
        </div> */}
      </div>
    </div>
  );
}
