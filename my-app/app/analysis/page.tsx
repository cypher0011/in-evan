"use client"

import * as React from "react"
import {
  IconAlertTriangle,
  IconArrowDown,
  IconArrowUp,
  IconBed,
  IconCash,
  IconShoppingBag,
  IconStar,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const REVENUE_DATA = [
  { date: "Jan 18", roomRevenue: 6200, minibarRevenue: 1150, servicesRevenue: 1800, total: 9150 },
  { date: "Jan 19", roomRevenue: 7100, minibarRevenue: 1320, servicesRevenue: 2100, total: 10520 },
  { date: "Jan 20", roomRevenue: 6800, minibarRevenue: 1240, servicesRevenue: 1950, total: 9990 },
  { date: "Jan 21", roomRevenue: 7500, minibarRevenue: 1480, servicesRevenue: 2300, total: 11280 },
  { date: "Jan 22", roomRevenue: 6900, minibarRevenue: 1380, servicesRevenue: 2150, total: 10430 },
  { date: "Jan 23", roomRevenue: 7800, minibarRevenue: 1520, servicesRevenue: 2480, total: 11800 },
  { date: "Jan 24", roomRevenue: 8200, minibarRevenue: 1650, servicesRevenue: 2600, total: 12450 },
]

const RECENT_ORDERS = [
  { id: "1", guestName: "Sarah Johnson", room: "302", item: "Spa Massage", category: "Spa", price: 180, status: "Completed", time: "15 min ago" },
  { id: "2", guestName: "Michael Chen", room: "105", item: "Minibar - Wine", category: "Minibar", price: 55, status: "Completed", time: "32 min ago" },
  { id: "3", guestName: "Emma Davis", room: "418", item: "Airport Transfer", category: "Transportation", price: 150, status: "Pending", time: "1 hour ago" },
  { id: "4", guestName: "James Wilson", room: "207", item: "Room Service Breakfast", category: "Room Service", price: 32, status: "Completed", time: "2 hours ago" },
  { id: "5", guestName: "Olivia Martinez", room: "512", item: "Laundry Service", category: "Services", price: 35, status: "Completed", time: "3 hours ago" },
  { id: "6", guestName: "Robert Taylor", room: "203", item: "Minibar - Snacks", category: "Minibar", price: 28, status: "Completed", time: "4 hours ago" },
  { id: "7", guestName: "Sophia Anderson", room: "401", item: "City Tour", category: "Activities", price: 350, status: "Pending", time: "5 hours ago" },
  { id: "8", guestName: "William Brown", room: "308", item: "Facial Treatment", category: "Spa", price: 220, status: "Completed", time: "6 hours ago" },
  { id: "9", guestName: "Ava Garcia", room: "115", item: "Pet Walking", category: "Pet Care", price: 30, status: "Completed", time: "7 hours ago" },
  { id: "10", guestName: "Liam Moore", room: "506", item: "Minibar - Beverages", category: "Minibar", price: 45, status: "Completed", time: "8 hours ago" },
]

const RATING_DISTRIBUTION = [
  { rating: "5★", count: 45, fill: "hsl(var(--chart-1))" },
  { rating: "4★", count: 32, fill: "hsl(var(--chart-2))" },
  { rating: "3★", count: 12, fill: "hsl(var(--chart-3))" },
  { rating: "2★", count: 8, fill: "hsl(var(--chart-4))" },
  { rating: "1★", count: 3, fill: "hsl(var(--chart-5))" },
]

const SENTIMENT_DATA = [
  { name: "Positive", value: 65, fill: "hsl(142, 76%, 36%)" },
  { name: "Neutral", value: 25, fill: "hsl(48, 96%, 53%)" },
  { name: "Negative", value: 10, fill: "hsl(0, 84%, 60%)" },
]

const GUEST_STATUS = [
  { name: "Checked In", value: 145, fill: "hsl(var(--chart-1))" },
  { name: "Checked Out", value: 33, fill: "hsl(var(--chart-2))" },
]

const LOW_STOCK_ALERTS = [
  { item: "Coca Cola", stock: 3, category: "Beverage", urgency: "High" },
  { item: "Mineral Water", stock: 4, category: "Water", urgency: "High" },
  { item: "Pringles", stock: 2, category: "Snack", urgency: "High" },
  { item: "Red Wine", stock: 4, category: "Alcohol", urgency: "Medium" },
]

const URGENT_FEEDBACK = [
  { guest: "Sarah Johnson", issue: "Room not properly cleaned", priority: "Urgent", time: "2 hours ago" },
  { guest: "David Kim", issue: "Air conditioning not working", priority: "Urgent", time: "4 hours ago" },
  { guest: "Maria Rodriguez", issue: "Noisy neighbors complaint", priority: "High", time: "6 hours ago" },
]

const TOP_MINIBAR_ITEMS = [
  { name: "Bottled Water", orders: 156, revenue: 780 },
  { name: "Red Wine", orders: 89, revenue: 4895 },
  { name: "Coca Cola", orders: 145, revenue: 725 },
  { name: "Pringles", orders: 78, revenue: 390 },
  { name: "Snickers", orders: 92, revenue: 460 },
]

const TOP_SERVICES = [
  { name: "Spa Massage", orders: 45, revenue: 8100 },
  { name: "Airport Transfer", orders: 67, revenue: 10050 },
  { name: "City Tour", orders: 23, revenue: 8050 },
  { name: "Room Service", orders: 234, revenue: 7488 },
  { name: "Laundry Service", orders: 156, revenue: 5460 },
]

export default function DashboardPage() {
  const totalRevenue = 12450
  const revenueChange = 5.2
  const totalGuests = 178
  const guestsChange = 3.8
  const averageRating = 4.3
  const ratingChange = 0.2
  const occupancyRate = 82
  const occupancyChange = -1.5

  const weekRevenue = REVENUE_DATA.reduce((sum, day) => sum + day.total, 0)

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Analysis</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Analytics overview for the last 7 days
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IconCash className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"><span className="icon-saudi_riyal"></span>{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {revenueChange > 0 ? (
                    <>
                      <IconArrowUp className="size-3 text-green-500" />
                      <span className="text-green-500">+{revenueChange}%</span>
                    </>
                  ) : (
                    <>
                      <IconArrowDown className="size-3 text-red-500" />
                      <span className="text-red-500">{revenueChange}%</span>
                    </>
                  )}
                  <span>from yesterday</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
                <IconUsers className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalGuests}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {guestsChange > 0 ? (
                    <>
                      <IconArrowUp className="size-3 text-green-500" />
                      <span className="text-green-500">+{guestsChange}%</span>
                    </>
                  ) : (
                    <>
                      <IconArrowDown className="size-3 text-red-500" />
                      <span className="text-red-500">{guestsChange}%</span>
                    </>
                  )}
                  <span>from yesterday</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                <IconStar className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating}/5</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {ratingChange > 0 ? (
                    <>
                      <IconArrowUp className="size-3 text-green-500" />
                      <span className="text-green-500">+{ratingChange}</span>
                    </>
                  ) : (
                    <>
                      <IconArrowDown className="size-3 text-red-500" />
                      <span className="text-red-500">{ratingChange}</span>
                    </>
                  )}
                  <span>from last week</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <IconBed className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{occupancyRate}%</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {occupancyChange > 0 ? (
                    <>
                      <IconArrowUp className="size-3 text-green-500" />
                      <span className="text-green-500">+{occupancyChange}%</span>
                    </>
                  ) : (
                    <>
                      <IconArrowDown className="size-3 text-red-500" />
                      <span className="text-red-500">{occupancyChange}%</span>
                    </>
                  )}
                  <span>from last week</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue breakdown for the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex justify-between mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">7-Day Total</p>
                    <p className="text-xl font-bold"><span className="icon-saudi_riyal"></span>{weekRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Daily Average</p>
                    <p className="text-xl font-bold"><span className="icon-saudi_riyal"></span>{Math.round(weekRevenue / 7).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Guest Status</CardTitle>
                <CardDescription>Current guest distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={GUEST_STATUS}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {GUEST_STATUS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {GUEST_STATUS.map((status, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: status.fill }} />
                        <span className="text-sm">{status.name}</span>
                      </div>
                      <span className="text-sm font-medium">{status.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest guest orders and services</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RECENT_ORDERS.slice(0, 6).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{order.guestName}</p>
                            <p className="text-xs text-muted-foreground">Room {order.room}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{order.item}</p>
                            <p className="text-xs text-muted-foreground">{order.time}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium"><span className="icon-saudi_riyal"></span>{order.price}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === "Completed" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Overview</CardTitle>
                <CardDescription>Guest satisfaction metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={RATING_DISTRIBUTION} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="rating" width={40} fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="count" radius={4}>
                          {RATING_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={SENTIMENT_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {SENTIMENT_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {SENTIMENT_DATA.map((sentiment, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: sentiment.fill }} />
                        <span className="text-sm">{sentiment.name}</span>
                      </div>
                      <span className="text-sm font-medium">{sentiment.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconAlertTriangle className="size-5 text-orange-500" />
                  Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-2">Low Stock Items</h3>
                  <div className="space-y-2">
                    {LOW_STOCK_ALERTS.map((alert, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{alert.item}</p>
                          <p className="text-xs text-muted-foreground">{alert.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.urgency === "High" ? "destructive" : "secondary"}>
                            {alert.stock} left
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm mb-2">Urgent Feedback</h3>
                  <div className="space-y-2">
                    {URGENT_FEEDBACK.map((feedback, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{feedback.guest}</p>
                          <p className="text-xs text-muted-foreground">{feedback.issue}</p>
                          <p className="text-xs text-muted-foreground mt-1">{feedback.time}</p>
                        </div>
                        <Badge variant="destructive">{feedback.priority}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconTrendingUp className="size-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-2">Top Minibar Items</h3>
                  <div className="space-y-2">
                    {TOP_MINIBAR_ITEMS.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconShoppingBag className="size-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium"><span className="icon-saudi_riyal"></span>{item.revenue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm mb-2">Top Services</h3>
                  <div className="space-y-2">
                    {TOP_SERVICES.map((service, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.orders} bookings</p>
                        </div>
                        <span className="text-sm font-medium"><span className="icon-saudi_riyal"></span>{service.revenue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
