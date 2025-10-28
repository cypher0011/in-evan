"use client"

import * as React from "react"
import {
  IconAlertCircle,
  IconBed,
  IconBuilding,
  IconCar,
  IconChevronDown,
  IconClock,
  IconDog,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconGift,
  IconLink,
  IconMessage,
  IconPhone,
  IconPhoto,
  IconPlus,
  IconSettings,
  IconShoppingBag,
  IconSparkles,
  IconTrash,
  IconWifi,
  IconWorld,
} from "@tabler/icons-react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type {
  GuestAppConfig,
  GuestAppSection,
  GuestAppItem,
  ExternalResource,
  OperatingHours,
} from "@/lib/guest-app-types"

const INITIAL_CONFIG: GuestAppConfig = {
  hotelInfo: {
    name: "Grand Hotel & Resort",
    logo: "",
    description: "Experience luxury and comfort in the heart of the city",
    address: "123 Luxury Avenue, City Center",
    phone: "+1 555 0100",
    email: "info@grandhotel.com",
    checkInTime: "3:00 PM",
    checkOutTime: "12:00 PM",
  },
  wifiCredentials: {
    networkName: "GrandHotel_Guest",
    password: "Welcome2024!",
    instructions: "Connect to the network and enter the password. No registration required.",
  },
  welcomeMessage: {
    title: "Welcome to Grand Hotel",
    message: "We're delighted to have you as our guest. Our team is here to ensure your stay is memorable. Please don't hesitate to contact us for any assistance.",
    imageUrl: "",
    isActive: true,
  },
  contactInfo: {
    frontDesk: "+1 555 0100",
    concierge: "+1 555 0101",
    emergency: "911",
    housekeeping: "+1 555 0102",
    roomService: "+1 555 0103",
    maintenance: "+1 555 0104",
  },
  operatingHours: [
    { name: "Front Desk", hours: "24/7", days: "Every day", isOpen: true },
    { name: "Restaurant", hours: "7:00 AM - 11:00 PM", days: "Every day", isOpen: true },
    { name: "Gym", hours: "6:00 AM - 10:00 PM", days: "Every day", isOpen: true },
    { name: "Swimming Pool", hours: "7:00 AM - 9:00 PM", days: "Every day", isOpen: true },
    { name: "Spa & Wellness", hours: "9:00 AM - 8:00 PM", days: "Every day", isOpen: true },
    { name: "Business Center", hours: "8:00 AM - 6:00 PM", days: "Mon-Fri", isOpen: true },
  ],
  sections: [
    {
      id: "sect_shop",
      name: "Shopping",
      icon: "shopping",
      description: "Exclusive gifts and essentials, delivered to your room.",
      type: "grid",
      isVisible: true,
      order: 1,
      items: [
        {
          id: "item_shop_1",
          title: "Artisan Chocolate Box",
          description: "A curated selection of handcrafted local chocolates.",
          price: 45,
          isVisible: true,
          order: 1,
        },
        {
          id: "item_shop_2",
          title: "Luxury Flower Bouquet",
          description: "Fresh, seasonal flowers arranged by our in-house florist.",
          price: 85,
          isVisible: true,
          order: 2,
        },
        {
          id: "item_shop_3",
          title: "Designer Silk Scarf",
          description: "A beautiful, locally designed 100% silk scarf.",
          price: 150,
          isVisible: true,
          order: 3,
        },
        {
          id: "item_shop_4",
          title: "Celebration Package",
          description: "Includes a bottle of premium champagne and chocolate-covered strawberries.",
          price: 120,
          isVisible: true,
          order: 4,
        },
      ],
    },
    {
      id: "sect_pet",
      name: "Pet Care",
      icon: "pet",
      description: "Five-star services for your four-legged companion.",
      type: "list",
      isVisible: true,
      order: 2,
      items: [
        {
          id: "item_pet_1",
          title: "Canine City Walk",
          description: "A 30-minute brisk walk around the city's most scenic routes.",
          price: 30,
          phone: "+1-202-555-0101",
          isVisible: true,
          order: 1,
        },
        {
          id: "item_pet_2",
          title: "In-Room Pet Sitting",
          description: "Professional, bonded sitters to care for your pet in the comfort of your room (per hour).",
          price: 50,
          phone: "+1-202-555-0101",
          isVisible: true,
          order: 2,
        },
        {
          id: "item_pet_3",
          title: "Gourmet Pet Meal",
          description: "A specially prepared meal of salmon and sweet potato for your furry friend.",
          price: 25,
          isVisible: true,
          order: 3,
        },
        {
          id: "item_pet_4",
          title: "Full-Service Grooming",
          description: "Includes a bath, haircut, and nail trim at our partner pet spa.",
          phone: "+1-202-555-0101",
          isVisible: true,
          order: 4,
        },
      ],
    },
    {
      id: "sect_spa",
      name: "Spa & Wellness",
      icon: "spa",
      description: "Rejuvenate your body and soul at our serene wellness center.",
      type: "grid",
      isVisible: true,
      order: 3,
      items: [
        {
          id: "item_spa_1",
          title: "Deep Tissue Massage",
          description: "A 60-minute massage focusing on releasing deep muscle tension.",
          price: 180,
          isVisible: true,
          order: 1,
        },
        {
          id: "item_spa_2",
          title: "Hydrating Facial",
          description: "A 75-minute treatment to restore moisture and radiance to your skin.",
          price: 220,
          isVisible: true,
          order: 2,
        },
        {
          id: "item_spa_3",
          title: "Couples' Retreat Package",
          description: "Includes a side-by-side massage, aromatherapy, and private relaxation time.",
          price: 450,
          isVisible: true,
          order: 3,
        },
        {
          id: "item_spa_4",
          title: "Private Yoga Session",
          description: "A one-on-one yoga class tailored to your skill level and goals.",
          price: 100,
          isVisible: true,
          order: 4,
        },
        {
          id: "item_spa_5",
          title: "Manicure & Pedicure",
          description: "Classic nail care with premium polish in our nail salon.",
          price: 120,
          isVisible: true,
          order: 5,
        },
      ],
    },
    {
      id: "sect_transport",
      name: "Transportation",
      icon: "car",
      description: "Arrive in style with our private transportation options.",
      type: "list",
      isVisible: true,
      order: 4,
      items: [
        {
          id: "item_trans_1",
          title: "Luxury Sedan Airport Transfer",
          description: "Private transfer to or from the airport in a luxury sedan.",
          price: 150,
          phone: "+1-202-555-0102",
          isVisible: true,
          order: 1,
        },
        {
          id: "item_trans_2",
          title: "SUV Airport Transfer",
          description: "Spacious and comfortable SUV for families or groups.",
          price: 200,
          phone: "+1-202-555-0102",
          isVisible: true,
          order: 2,
        },
        {
          id: "item_trans_3",
          title: "Hourly Car Service",
          description: "A private car and driver at your disposal (3-hour minimum).",
          phone: "+1-202-555-0102",
          isVisible: true,
          order: 3,
        },
        {
          id: "item_trans_4",
          title: "Exotic Car Rental",
          description: "Experience the city in a high-performance luxury vehicle. Contact for availability.",
          phone: "+1-202-555-0102",
          isVisible: true,
          order: 4,
        },
      ],
    },
    {
      id: "sect_roomservice",
      name: "Room Service",
      icon: "gift",
      description: "Gourmet dining, delivered to your door 24/7.",
      type: "grid",
      isVisible: true,
      order: 5,
      items: [
        {
          id: "item_rs_1",
          title: "The American Breakfast",
          description: "Two eggs any style, bacon or sausage, hash browns, and toast.",
          price: 32,
          isVisible: true,
          order: 1,
        },
        {
          id: "item_rs_2",
          title: "Classic Club Sandwich",
          description: "Triple-decker with turkey, bacon, lettuce, tomato, and fries.",
          price: 28,
          isVisible: true,
          order: 2,
        },
        {
          id: "item_rs_3",
          title: "Filet Mignon",
          description: "8oz center-cut filet with asparagus and potato gratin.",
          price: 65,
          isVisible: true,
          order: 3,
        },
        {
          id: "item_rs_4",
          title: "Cheese & Charcuterie Board",
          description: "A selection of local and imported cheeses and cured meats.",
          price: 48,
          isVisible: true,
          order: 4,
        },
        {
          id: "item_rs_5",
          title: "Bottle of House Red Wine",
          description: "A smooth, full-bodied Cabernet Sauvignon.",
          price: 55,
          isVisible: true,
          order: 5,
        },
      ],
    },
    {
      id: "sect_laundry",
      name: "Laundry & Dry Cleaning",
      icon: "building",
      description: "Pristine cleaning and pressing services for your garments.",
      type: "list",
      isVisible: true,
      order: 6,
      items: [
        {
          id: "item_laundry_1",
          title: "Shirt/Blouse",
          description: "Laundered and pressed.",
          price: 12,
          isVisible: true,
          order: 1,
        },
        {
          id: "item_laundry_2",
          title: "Suit (2-Piece)",
          description: "Expertly dry cleaned and pressed.",
          price: 35,
          isVisible: true,
          order: 2,
        },
        {
          id: "item_laundry_3",
          title: "Dress",
          description: "Delicate dry cleaning for evening or day wear.",
          price: 30,
          isVisible: true,
          order: 3,
        },
        {
          id: "item_laundry_4",
          title: "Express Pressing (1 Item)",
          description: "Need it fast? Your item pressed and returned within the hour.",
          price: 20,
          isVisible: true,
          order: 4,
        },
        {
          id: "item_laundry_5",
          title: "Bag of Laundry",
          description: "Wash and fold service for your personal items (up to 5kg).",
          price: 50,
          isVisible: true,
          order: 5,
        },
      ],
    },
    {
      id: "sect_activities",
      name: "Activities & Entertainment",
      icon: "gift",
      description: "Curated local experiences and tours.",
      type: "grid",
      isVisible: true,
      order: 7,
      items: [
        {
          id: "item_act_1",
          title: "Private City Tour",
          description: "A 3-hour guided tour of the city's highlights with a private historian.",
          price: 350,
          phone: "+1-202-555-0103",
          isVisible: true,
          order: 1,
        },
        {
          id: "item_act_2",
          title: "Museum VIP Access",
          description: "Skip-the-line tickets and a private docent for the National Art Museum.",
          price: 125,
          phone: "+1-202-555-0103",
          isVisible: true,
          order: 2,
        },
        {
          id: "item_act_3",
          title: "Helicopter Tour",
          description: "A breathtaking 20-minute aerial tour of the city skyline.",
          price: 500,
          phone: "+1-202-555-0103",
          isVisible: true,
          order: 3,
        },
        {
          id: "item_act_4",
          title: "In-Room Mixology Class",
          description: "Our master bartender teaches you to make three signature cocktails.",
          price: 175,
          isVisible: true,
          order: 4,
        },
      ],
    },
    {
      id: "sect_business",
      name: "Business Services",
      icon: "building",
      description: "Everything you need to stay productive during your stay.",
      type: "list",
      isVisible: true,
      order: 8,
      items: [
        {
          id: "item_biz_1",
          title: "Printing & Copying",
          description: "High-speed black & white or color printing. Contact for pricing.",
          phone: "+1-202-555-0104",
          isVisible: true,
          order: 1,
        },
        {
          id: "item_biz_2",
          title: "Meeting Room Rental",
          description: "Book one of our fully-equipped meeting rooms (per hour).",
          price: 250,
          phone: "+1-202-555-0104",
          isVisible: true,
          order: 2,
        },
        {
          id: "item_biz_3",
          title: "Laptop Rental",
          description: "Daily rental of a high-performance laptop.",
          phone: "+1-202-555-0104",
          isVisible: true,
          order: 3,
        },
        {
          id: "item_biz_4",
          title: "Courier Service",
          description: "Reliable and fast local or international document shipping.",
          phone: "+1-202-555-0104",
          isVisible: true,
          order: 4,
        },
      ],
    },
  ],
  externalResources: [
    {
      id: "r1",
      title: "Visit Saudi",
      description: "Discover the Kingdom - Your complete guide to exploring Saudi Arabia",
      url: "https://www.visitsaudi.com",
      imageUrl: "",
      category: "Tourism",
      order: 1,
    },
    {
      id: "r2",
      title: "Local Attractions",
      description: "Explore nearby museums, restaurants, and entertainment venues",
      url: "#",
      imageUrl: "",
      category: "Tourism",
      order: 2,
    },
  ],
  updatedAt: new Date().toISOString(),
}

const getConfig = (): GuestAppConfig => {
  if (typeof window === "undefined") return INITIAL_CONFIG
  try {
    const stored = localStorage.getItem("guest-app-config")
    return stored ? JSON.parse(stored) : INITIAL_CONFIG
  } catch {
    return INITIAL_CONFIG
  }
}

const saveConfig = (config: GuestAppConfig) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("guest-app-config", JSON.stringify(config))
  }
}

export default function GuestAppControlPage() {
  const [config, setConfig] = React.useState<GuestAppConfig>(() => getConfig())
  const [activeTab, setActiveTab] = React.useState("hotel-info")

  const [sectionDialogOpen, setSectionDialogOpen] = React.useState(false)
  const [itemDialogOpen, setItemDialogOpen] = React.useState(false)
  const [resourceDialogOpen, setResourceDialogOpen] = React.useState(false)
  const [hoursDialogOpen, setHoursDialogOpen] = React.useState(false)

  const [editingSection, setEditingSection] = React.useState<GuestAppSection | null>(null)
  const [editingItem, setEditingItem] = React.useState<GuestAppItem | null>(null)
  const [currentSectionId, setCurrentSectionId] = React.useState<string>("")
  const [editingResource, setEditingResource] = React.useState<ExternalResource | null>(null)
  const [editingHours, setEditingHours] = React.useState<OperatingHours | null>(null)

  const [sectionForm, setSectionForm] = React.useState({
    name: "",
    icon: "gift",
    description: "",
    type: "grid" as "grid" | "list" | "contact" | "info",
  })

  const [itemForm, setItemForm] = React.useState({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    phone: "",
    price: 0,
  })

  const [resourceForm, setResourceForm] = React.useState({
    title: "",
    description: "",
    url: "",
    imageUrl: "",
    category: "Tourism" as "Tourism" | "Transportation" | "Emergency" | "Entertainment" | "Other",
  })

  const [hoursForm, setHoursForm] = React.useState({
    name: "",
    hours: "",
    days: "",
  })

  React.useEffect(() => {
    saveConfig(config)
  }, [config])

  const handleAddSection = () => {
    if (!sectionForm.name.trim()) return

    const newSection: GuestAppSection = {
      id: crypto.randomUUID(),
      name: sectionForm.name.trim(),
      icon: sectionForm.icon,
      description: sectionForm.description.trim(),
      type: sectionForm.type,
      items: [],
      isVisible: true,
      order: config.sections.length + 1,
    }

    setConfig({
      ...config,
      sections: [...config.sections, newSection],
      updatedAt: new Date().toISOString(),
    })

    setSectionDialogOpen(false)
    setSectionForm({ name: "", icon: "gift", description: "", type: "grid" })
  }

  const handleEditSection = (section: GuestAppSection) => {
    setEditingSection(section)
    setSectionForm({
      name: section.name,
      icon: section.icon,
      description: section.description || "",
      type: section.type,
    })
    setSectionDialogOpen(true)
  }

  const handleUpdateSection = () => {
    if (!editingSection) return

    setConfig({
      ...config,
      sections: config.sections.map(s =>
        s.id === editingSection.id
          ? { ...s, name: sectionForm.name, icon: sectionForm.icon, description: sectionForm.description, type: sectionForm.type }
          : s
      ),
      updatedAt: new Date().toISOString(),
    })

    setSectionDialogOpen(false)
    setEditingSection(null)
    setSectionForm({ name: "", icon: "gift", description: "", type: "grid" })
  }

  const handleDeleteSection = (id: string) => {
    setConfig({
      ...config,
      sections: config.sections.filter(s => s.id !== id),
      updatedAt: new Date().toISOString(),
    })
  }

  const toggleSectionVisibility = (id: string) => {
    setConfig({
      ...config,
      sections: config.sections.map(s =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      ),
      updatedAt: new Date().toISOString(),
    })
  }

  const handleAddItem = () => {
    if (!itemForm.title.trim() || !currentSectionId) return

    const newItem: GuestAppItem = {
      id: crypto.randomUUID(),
      title: itemForm.title.trim(),
      description: itemForm.description.trim(),
      imageUrl: itemForm.imageUrl.trim(),
      link: itemForm.link.trim() || undefined,
      phone: itemForm.phone.trim() || undefined,
      price: itemForm.price > 0 ? itemForm.price : undefined,
      isVisible: true,
      order: 1,
    }

    setConfig({
      ...config,
      sections: config.sections.map(s =>
        s.id === currentSectionId
          ? { ...s, items: [...s.items, newItem] }
          : s
      ),
      updatedAt: new Date().toISOString(),
    })

    setItemDialogOpen(false)
    setItemForm({ title: "", description: "", imageUrl: "", link: "", phone: "", price: 0 })
  }

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setConfig({
      ...config,
      sections: config.sections.map(s =>
        s.id === sectionId
          ? { ...s, items: s.items.filter(i => i.id !== itemId) }
          : s
      ),
      updatedAt: new Date().toISOString(),
    })
  }

  const handleAddResource = () => {
    if (!resourceForm.title.trim()) return

    const newResource: ExternalResource = {
      id: crypto.randomUUID(),
      title: resourceForm.title.trim(),
      description: resourceForm.description.trim(),
      url: resourceForm.url.trim(),
      imageUrl: resourceForm.imageUrl.trim(),
      category: resourceForm.category,
      order: config.externalResources.length + 1,
    }

    setConfig({
      ...config,
      externalResources: [...config.externalResources, newResource],
      updatedAt: new Date().toISOString(),
    })

    setResourceDialogOpen(false)
    setResourceForm({ title: "", description: "", url: "", imageUrl: "", category: "Tourism" })
  }

  const handleDeleteResource = (id: string) => {
    setConfig({
      ...config,
      externalResources: config.externalResources.filter(r => r.id !== id),
      updatedAt: new Date().toISOString(),
    })
  }

  const handleAddHours = () => {
    if (!hoursForm.name.trim()) return

    const newHours: OperatingHours = {
      name: hoursForm.name.trim(),
      hours: hoursForm.hours.trim(),
      days: hoursForm.days.trim(),
      isOpen: true,
    }

    setConfig({
      ...config,
      operatingHours: [...config.operatingHours, newHours],
      updatedAt: new Date().toISOString(),
    })

    setHoursDialogOpen(false)
    setHoursForm({ name: "", hours: "", days: "" })
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      shopping: IconShoppingBag,
      pet: IconDog,
      spa: IconSparkles,
      car: IconCar,
      gift: IconGift,
      building: IconBuilding,
      bed: IconBed,
    }
    const Icon = icons[iconName] || IconGift
    return <Icon className="size-5" />
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Guest App Control</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Configure everything your guests see in their app
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="hotel-info">Hotel Info</TabsTrigger>
              <TabsTrigger value="welcome">Welcome</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="resources">Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="hotel-info" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Information</CardTitle>
                  <CardDescription>Basic hotel details shown to all guests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hotel Name</Label>
                      <Input
                        value={config.hotelInfo.name}
                        onChange={(e) => setConfig({
                          ...config,
                          hotelInfo: { ...config.hotelInfo, name: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={config.hotelInfo.phone}
                        onChange={(e) => setConfig({
                          ...config,
                          hotelInfo: { ...config.hotelInfo, phone: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={config.hotelInfo.email}
                        onChange={(e) => setConfig({
                          ...config,
                          hotelInfo: { ...config.hotelInfo, email: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={config.hotelInfo.address}
                        onChange={(e) => setConfig({
                          ...config,
                          hotelInfo: { ...config.hotelInfo, address: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Check-in Time</Label>
                      <Input
                        value={config.hotelInfo.checkInTime}
                        onChange={(e) => setConfig({
                          ...config,
                          hotelInfo: { ...config.hotelInfo, checkInTime: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Check-out Time</Label>
                      <Input
                        value={config.hotelInfo.checkOutTime}
                        onChange={(e) => setConfig({
                          ...config,
                          hotelInfo: { ...config.hotelInfo, checkOutTime: e.target.value },
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={config.hotelInfo.description}
                      onChange={(e) => setConfig({
                        ...config,
                        hotelInfo: { ...config.hotelInfo, description: e.target.value },
                      })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconWifi className="size-5" />
                    WiFi Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Network Name</Label>
                      <Input
                        value={config.wifiCredentials.networkName}
                        onChange={(e) => setConfig({
                          ...config,
                          wifiCredentials: { ...config.wifiCredentials, networkName: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        value={config.wifiCredentials.password}
                        onChange={(e) => setConfig({
                          ...config,
                          wifiCredentials: { ...config.wifiCredentials, password: e.target.value },
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Instructions (optional)</Label>
                    <Textarea
                      value={config.wifiCredentials.instructions || ""}
                      onChange={(e) => setConfig({
                        ...config,
                        wifiCredentials: { ...config.wifiCredentials, instructions: e.target.value },
                      })}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <IconClock className="size-5" />
                      Operating Hours
                    </CardTitle>
                    <Button size="sm" onClick={() => setHoursDialogOpen(true)}>
                      <IconPlus className="size-4 mr-2" />
                      Add Hours
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {config.operatingHours.map((hours, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{hours.name}</p>
                          <p className="text-sm text-muted-foreground">{hours.hours} • {hours.days}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfig({
                            ...config,
                            operatingHours: config.operatingHours.filter((_, i) => i !== index),
                          })}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="welcome" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Message</CardTitle>
                  <CardDescription>Personalized greeting for all guests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={config.welcomeMessage.isActive}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        welcomeMessage: { ...config.welcomeMessage, isActive: checked },
                      })}
                    />
                    <Label>Show welcome message</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={config.welcomeMessage.title}
                      onChange={(e) => setConfig({
                        ...config,
                        welcomeMessage: { ...config.welcomeMessage, title: e.target.value },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      value={config.welcomeMessage.message}
                      onChange={(e) => setConfig({
                        ...config,
                        welcomeMessage: { ...config.welcomeMessage, message: e.target.value },
                      })}
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconPhone className="size-5" />
                    Contact Numbers
                  </CardTitle>
                  <CardDescription>Important phone numbers for guests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Front Desk</Label>
                      <Input
                        value={config.contactInfo.frontDesk}
                        onChange={(e) => setConfig({
                          ...config,
                          contactInfo: { ...config.contactInfo, frontDesk: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Concierge</Label>
                      <Input
                        value={config.contactInfo.concierge}
                        onChange={(e) => setConfig({
                          ...config,
                          contactInfo: { ...config.contactInfo, concierge: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency</Label>
                      <Input
                        value={config.contactInfo.emergency}
                        onChange={(e) => setConfig({
                          ...config,
                          contactInfo: { ...config.contactInfo, emergency: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Housekeeping</Label>
                      <Input
                        value={config.contactInfo.housekeeping}
                        onChange={(e) => setConfig({
                          ...config,
                          contactInfo: { ...config.contactInfo, housekeeping: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Room Service</Label>
                      <Input
                        value={config.contactInfo.roomService}
                        onChange={(e) => setConfig({
                          ...config,
                          contactInfo: { ...config.contactInfo, roomService: e.target.value },
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Maintenance</Label>
                      <Input
                        value={config.contactInfo.maintenance}
                        onChange={(e) => setConfig({
                          ...config,
                          contactInfo: { ...config.contactInfo, maintenance: e.target.value },
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sections" className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => {
                  setEditingSection(null)
                  setSectionForm({ name: "", icon: "gift", description: "", type: "grid" })
                  setSectionDialogOpen(true)
                }}>
                  <IconPlus className="size-4 mr-2" />
                  Add Section
                </Button>
              </div>

              <div className="grid gap-4">
                {config.sections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getIconComponent(section.icon)}
                          <div>
                            <CardTitle className="text-lg">{section.name}</CardTitle>
                            {section.description && (
                              <CardDescription>{section.description}</CardDescription>
                            )}
                          </div>
                          {!section.isVisible && (
                            <Badge variant="secondary">Hidden</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSectionVisibility(section.id)}
                          >
                            {section.isVisible ? <IconEye className="size-4" /> : <IconEyeOff className="size-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSection(section)}
                          >
                            <IconEdit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            <IconTrash className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            {section.items.length} item(s)
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCurrentSectionId(section.id)
                              setItemForm({ title: "", description: "", imageUrl: "", link: "", phone: "", price: 0 })
                              setItemDialogOpen(true)
                            }}
                          >
                            <IconPlus className="size-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                        {section.items.length > 0 && (
                          <div className="space-y-2">
                            {section.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium">{item.title}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                                  {item.price && (
                                    <p className="text-sm font-medium text-primary"><span className="icon-saudi_riyal"></span>{item.price}</p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(section.id, item.id)}
                                >
                                  <IconTrash className="size-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => {
                  setEditingResource(null)
                  setResourceForm({ title: "", description: "", url: "", imageUrl: "", category: "Tourism" })
                  setResourceDialogOpen(true)
                }}>
                  <IconPlus className="size-4 mr-2" />
                  Add Integration
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {config.externalResources.map((resource) => (
                  <Card key={resource.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <IconWorld className="size-5" />
                            {resource.title}
                          </CardTitle>
                          <CardDescription>{resource.description}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant="outline">{resource.category}</Badge>
                        <p className="text-sm text-muted-foreground break-all">{resource.url}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSection ? "Edit Section" : "Add New Section"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Name</Label>
                  <Input
                    value={sectionForm.name}
                    onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                    placeholder="e.g., Shopping, Pet Care"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select
                    value={sectionForm.icon}
                    onValueChange={(v) => setSectionForm({ ...sectionForm, icon: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shopping">Shopping Bag</SelectItem>
                      <SelectItem value="pet">Pet/Dog</SelectItem>
                      <SelectItem value="spa">Spa</SelectItem>
                      <SelectItem value="car">Car/Transportation</SelectItem>
                      <SelectItem value="gift">Gift</SelectItem>
                      <SelectItem value="building">Building</SelectItem>
                      <SelectItem value="bed">Bed/Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Type</Label>
                  <Select
                    value={sectionForm.type}
                    onValueChange={(v: any) => setSectionForm({ ...sectionForm, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={sectionForm.description}
                    onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSectionDialogOpen(false)}>Cancel</Button>
                <Button onClick={editingSection ? handleUpdateSection : handleAddSection}>
                  {editingSection ? "Update" : "Add"} Section
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={itemForm.title}
                    onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (optional)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone (optional)</Label>
                    <Input
                      value={itemForm.phone}
                      onChange={(e) => setItemForm({ ...itemForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Link (optional)</Label>
                  <Input
                    value={itemForm.link}
                    onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setItemDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add External Resource</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={resourceForm.category}
                    onValueChange={(v: any) => setResourceForm({ ...resourceForm, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tourism">Tourism</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setResourceDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddResource}>Add Resource</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={hoursDialogOpen} onOpenChange={setHoursDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Operating Hours</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Facility Name</Label>
                  <Input
                    value={hoursForm.name}
                    onChange={(e) => setHoursForm({ ...hoursForm, name: e.target.value })}
                    placeholder="e.g., Restaurant, Gym"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hours</Label>
                  <Input
                    value={hoursForm.hours}
                    onChange={(e) => setHoursForm({ ...hoursForm, hours: e.target.value })}
                    placeholder="e.g., 7:00 AM - 10:00 PM"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Days</Label>
                  <Input
                    value={hoursForm.days}
                    onChange={(e) => setHoursForm({ ...hoursForm, days: e.target.value })}
                    placeholder="e.g., Every day, Mon-Fri"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setHoursDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddHours}>Add Hours</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
