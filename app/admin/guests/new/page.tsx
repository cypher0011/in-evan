"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Copy, Check, ExternalLink } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const COUNTRIES = [
  "Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar", "Bahrain", "Oman",
  "Egypt", "Jordan", "Lebanon", "Iraq", "Syria", "Yemen", "Palestine",
  "United States", "United Kingdom", "Germany", "France", "Italy", "Spain",
  "India", "Pakistan", "Bangladesh", "Philippines", "Indonesia",
  "China", "Japan", "South Korea", "Malaysia", "Singapore", "Thailand",
  "Australia", "Canada", "Brazil", "Mexico", "Other"
];

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roomNumber: string;
  dateOfBirth: Date | undefined;
  nationality: string;
  idType: "iqama" | "passport" | "national_id" | "";
  idNumber: string;
  status: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
};

export default function NewGuestPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    roomNumber: "",
    dateOfBirth: undefined,
    nationality: "",
    idType: "",
    idNumber: "",
    status: "Confirmed",
    checkInDate: undefined,
    checkOutDate: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ token: string; guestName: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() ||
        !form.roomNumber.trim() || !form.dateOfBirth || !form.nationality ||
        !form.idType || !form.idNumber.trim() || !form.checkInDate || !form.checkOutDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.checkOutDate <= form.checkInDate) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    try {
      setLoading(true);

      // TODO: Replace with actual hotel ID from context/session
      const hotelId = "4b4fc34a-257f-48ac-8d3b-4326495d1425"; // Mövenpick Hotel Riyadh

      const response = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          roomNumber: form.roomNumber.trim(),
          dateOfBirth: format(form.dateOfBirth, 'yyyy-MM-dd'),
          nationality: form.nationality,
          idType: form.idType,
          idNumber: form.idNumber.trim(),
          status: form.status,
          checkInDate: format(form.checkInDate, 'yyyy-MM-dd'),
          checkOutDate: format(form.checkOutDate, 'yyyy-MM-dd'),
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
      });
    } catch (err: any) {
      setError(err.message ?? "Failed to add guest.");
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    const checkoutUrl = `https://movenpick.in-evan.site/c/${success.token}/welcome`;

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
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(checkoutUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    Send this URL to the guest so they can complete their online check-in before arrival.
                  </AlertDescription>
                </Alert>

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
                        email: "",
                        roomNumber: "",
                        dateOfBirth: undefined,
                        nationality: "",
                        idType: "",
                        idNumber: "",
                        status: "Confirmed",
                        checkInDate: undefined,
                        checkOutDate: undefined,
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
                      <Label htmlFor="phone">Phone *</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="optional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.dateOfBirth ? format(form.dateOfBirth, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={form.dateOfBirth}
                            onSelect={(date) => setForm((f) => ({ ...f, dateOfBirth: date }))}
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={1940}
                            toYear={2010}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality *</Label>
                      <Select
                        value={form.nationality}
                        onValueChange={(v) => setForm((f) => ({ ...f, nationality: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Identification */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Identification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Type *</Label>
                      <Select
                        value={form.idType}
                        onValueChange={(v) => setForm((f) => ({ ...f, idType: v as any }))}
                      >
                        <SelectTrigger id="idType">
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="iqama">Iqama</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="national_id">National ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number *</Label>
                      <Input
                        id="idNumber"
                        name="idNumber"
                        value={form.idNumber}
                        onChange={onChange}
                        placeholder="Enter ID number"
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
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={form.status}
                        onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Checked In">Checked In</SelectItem>
                          <SelectItem value="Checked Out">Checked Out</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
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
