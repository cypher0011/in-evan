"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Copy, Check, Send } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Available room upgrades that can be offered to guests
const ROOM_UPGRADES = [
  { value: "standard", label: "Standard Room", price: 0, image: "/normal_room.jpeg" },
  { value: "deluxe", label: "Deluxe Room", price: 150, image: "/normal_room.jpeg" },
  { value: "suite", label: "Junior Suite", price: 300, image: "/normal_room.jpeg" },
  { value: "executive", label: "Executive Suite", price: 500, image: "/normal_room.jpeg" },
  { value: "presidential", label: "Presidential Suite", price: 1000, image: "/normal_room.jpeg" },
];

type EnhanceStayOption = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
};

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  roomNumber: string;
  numberOfGuests: number;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  availableRoomUpgrades: string[]; // Available room upgrades to offer
  selectedEnhancementIds: string[];
};

export default function NewGuestPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    roomNumber: "",
    numberOfGuests: 1,
    checkInDate: undefined,
    checkOutDate: undefined,
    availableRoomUpgrades: [],
    selectedEnhancementIds: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ token: string; guestName: string; hotelName: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [enhanceOptions, setEnhanceOptions] = useState<EnhanceStayOption[]>([]);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch enhance-stay options
  useEffect(() => {
    const fetchEnhanceOptions = async () => {
      try {
        const hotelId = "4b4fc34a-257f-48ac-8d3b-4326495d1425"; // TODO: Get from context
        const response = await fetch(`/api/admin/enhance-stay-options?hotelId=${hotelId}`);
        const data = await response.json();
        setEnhanceOptions(data.options || []);
      } catch (err) {
        console.error('Failed to fetch enhance-stay options:', err);
      }
    };
    fetchEnhanceOptions();
    firstInputRef.current?.focus();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleEnhancement = (id: string) => {
    setForm((f) => ({
      ...f,
      selectedEnhancementIds: f.selectedEnhancementIds.includes(id)
        ? f.selectedEnhancementIds.filter((eid) => eid !== id)
        : [...f.selectedEnhancementIds, id],
    }));
  };

  const toggleRoomUpgrade = (value: string) => {
    setForm((f) => ({
      ...f,
      availableRoomUpgrades: f.availableRoomUpgrades.includes(value)
        ? f.availableRoomUpgrades.filter((v) => v !== value)
        : [...f.availableRoomUpgrades, value],
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() ||
        !form.roomNumber.trim() || !form.checkInDate || !form.checkOutDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.checkOutDate <= form.checkInDate) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    try {
      setLoading(true);

      const hotelId = "4b4fc34a-257f-48ac-8d3b-4326495d1425"; // TODO: Get from context

      const response = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          roomNumber: form.roomNumber.trim(),
          numberOfGuests: form.numberOfGuests,
          checkInDate: format(form.checkInDate, 'yyyy-MM-dd'),
          checkOutDate: format(form.checkOutDate, 'yyyy-MM-dd'),
          availableRoomUpgrades: form.availableRoomUpgrades,
          selectedEnhancementIds: form.selectedEnhancementIds,
          hotelId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create guest');
      }

      setSuccess({
        token: data.token,
        guestName: `${data.guest.firstName} ${data.guest.lastName}`,
        hotelName: data.hotelName || "Mövenpick Hotel",
      });
    } catch (err: any) {
      setError(err.message ?? "Failed to add guest.");
    } finally {
      setLoading(false);
    }
  };

  // Success screen with WhatsApp
  if (success) {
    const checkoutUrl = `https://movenpick.in-evan.site/c/${success.token}/welcome`;
    const whatsappMessage = `Dear ${success.guestName},

Welcome to ${success.hotelName}! 🏨

We're excited to host you. Please complete your online check-in using the link below:

${checkoutUrl}

This will help us prepare for your arrival and ensure a smooth check-in experience.

Looking forward to welcoming you!

Best regards,
${success.hotelName} Team`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <main className="flex-1 p-4 md:p-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-center text-2xl">Guest Created Successfully!</CardTitle>
                <CardDescription className="text-center">
                  {success.guestName} has been added to the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Guest Token</Label>
                  <div className="flex items-center gap-2">
                    <Input value={success.token} readOnly className="font-mono text-lg" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(success.token)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Check-in URL</Label>
                  <div className="flex items-center gap-2">
                    <Input value={checkoutUrl} readOnly className="text-sm" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(checkoutUrl)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>WhatsApp Message</Label>
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-sans">{whatsappMessage}</pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={() => copyToClipboard(whatsappMessage)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Message
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(whatsappUrl, '_blank')}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send via WhatsApp
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/admin/guests')}
                  >
                    View All Guests
                  </Button>
                  <Button
                    onClick={() => {
                      setSuccess(null);
                      setForm({
                        firstName: "",
                        lastName: "",
                        phone: "",
                        roomNumber: "",
                        numberOfGuests: 1,
                        checkInDate: undefined,
                        checkOutDate: undefined,
                        availableRoomUpgrades: [],
                        selectedEnhancementIds: [],
                      });
                    }}
                  >
                    Add Another Guest
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Form screen
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold">Add New Guest</h1>
            <p className="text-muted-foreground">
              Create a new guest reservation and generate a check-in token.
            </p>
          </div>

          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
              <CardDescription>
                Fill in the guest details to create their reservation and check-in link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        ref={firstInputRef}
                        id="firstName"
                        name="firstName"
                        value={form.firstName}
                        onChange={onChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={form.lastName}
                        onChange={onChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={onChange}
                        placeholder="+966 50 123 4567"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Reservation Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomNumber">Room Number *</Label>
                      <Input
                        id="roomNumber"
                        name="roomNumber"
                        value={form.roomNumber}
                        onChange={onChange}
                        placeholder="e.g., 412"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfGuests">Number of Guests *</Label>
                      <Select
                        value={form.numberOfGuests.toString()}
                        onValueChange={(v) => setForm((f) => ({ ...f, numberOfGuests: parseInt(v) }))}
                      >
                        <SelectTrigger id="numberOfGuests">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Check-in Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.checkInDate ? format(form.checkInDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={form.checkInDate}
                            onSelect={(date) => setForm((f) => ({ ...f, checkInDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Check-out Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.checkOutDate ? format(form.checkOutDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={form.checkOutDate}
                            onSelect={(date) => setForm((f) => ({ ...f, checkOutDate: date }))}
                            initialFocus
                            disabled={(date) => form.checkInDate ? date <= form.checkInDate : false}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Room Upgrade Options */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Room Upgrade Options</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select which room upgrades to offer this guest. If none selected, they won't see upgrade options.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ROOM_UPGRADES.map((upgrade) => (
                      <div key={upgrade.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={`upgrade-${upgrade.value}`}
                          checked={form.availableRoomUpgrades.includes(upgrade.value)}
                          onCheckedChange={() => toggleRoomUpgrade(upgrade.value)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`upgrade-${upgrade.value}`} className="cursor-pointer font-medium">
                            {upgrade.label}
                          </Label>
                          <p className="text-sm font-semibold mt-1">
                            {upgrade.price === 0 ? 'Current Room' : `+$${upgrade.price}/night`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhance Stay Options */}
                {enhanceOptions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Enhance Stay Options</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select services to offer this guest. If none selected, enhance-stay page will be skipped.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {enhanceOptions.map((option) => (
                        <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                          <Checkbox
                            id={option.id}
                            checked={form.selectedEnhancementIds.includes(option.id)}
                            onCheckedChange={() => toggleEnhancement(option.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={option.id} className="cursor-pointer font-medium">
                              {option.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                            <p className="text-sm font-semibold mt-1">${option.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-end gap-3 pt-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Guest & Generate Token"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
