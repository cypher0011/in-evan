#### `hotels`
Multi-hotel support with complete property management.

```sql
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  pass VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,

  -- Location & Contact
  address_line1 VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),

  -- Configuration
  total_rooms INTEGER NOT NULL,

  -- Status & Metadata
  subscrtion INT NOT NULL, -- 30,60,90,180,365
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, maintenance
  settings JSONB DEFAULT '{}', -- Custom settings per hotel

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hotels_slug ON hotels(slug);
CREATE INDEX idx_hotels_status ON hotels(status);
```

#### `users`
Unified user table for all roles (SuperAdmin, Admin, Staff, Guest).

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Authentication (Supabase Auth)
  auth_id UUID UNIQUE, -- References auth.users(id)
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),

  -- Personal Info
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,

  -- Role & Permissions
  role VARCHAR(20) NOT NULL, -- superadmin, hotel_admin, staff, guest

  -- Status
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,

  -- Preferences
  preferred_language VARCHAR(10) DEFAULT 'en',
  preferences JSONB DEFAULT '{}',

  -- Metadata
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT chk_role CHECK (role IN ('superadmin', 'hotel_admin', 'staff', 'guest'))
);

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```
---

### 2. Guest Management

#### `guests`
Enhanced guest table with complete profile management.

```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Link to user account if registered
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,

  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  date_of_birth DATE,
  nationality VARCHAR(100),

  -- Identification Documents
  id_type VARCHAR(50), -- passport, national_id, drivers_license
  id_number VARCHAR(100),
  id_issue_country VARCHAR(100),
  id_expiry_date DATE,
  id_document_url TEXT, -- S3/Storage URL

  -- Address
  address_line1 VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),

  -- Guest Preferences
  room_preferences JSONB DEFAULT '{}', -- smoking, floor, view, etc.
  dietary_restrictions TEXT[],
  special_requests TEXT,

  -- VIP & Loyalty
  vip_status BOOLEAN DEFAULT false,
  loyalty_tier VARCHAR(20), -- bronze, silver, gold, platinum
  loyalty_points INTEGER DEFAULT 0,

  -- Metadata
  total_stays INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  notes TEXT, -- Staff notes

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_guests_hotel ON guests(hotel_id);
CREATE INDEX idx_guests_user ON guests(user_id);
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_guests_vip ON guests(vip_status);
```

#### `reservations`
Complete booking and reservation management.

```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "RES-2025-001234"

  -- References
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,

  -- Dates
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  actual_check_in_time TIMESTAMP,
  actual_check_out_time TIMESTAMP,

  -- Room Details
  room_number VARCHAR(20),
  room_type VARCHAR(50), -- standard, deluxe, suite, presidential
  number_of_guests INTEGER DEFAULT 1,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,

  -- Payment
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, partial, paid, refunded
  payment_method VARCHAR(50),
  deposit_paid DECIMAL(10, 2) DEFAULT 0,

  -- Status
  status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, checked_in, checked_out, cancelled, no_show
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP,

  -- Special Requests
  special_requests TEXT,
  notes TEXT, -- Staff notes

  -- Ministry Reporting
  reported_to_shomos BOOLEAN DEFAULT false,
  ministry_report_date TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT chk_dates CHECK (check_out_date > check_in_date),
  CONSTRAINT chk_reservation_status CHECK (status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'))
);

CREATE INDEX idx_reservations_hotel ON reservations(hotel_id);
CREATE INDEX idx_reservations_guest ON reservations(guest_id);
CREATE INDEX idx_reservations_code ON reservations(reservation_code);
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_room ON reservations(room_id);
```

#### `rooms`
Hotel room inventory and management.

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,

  -- Room Identity
  room_number VARCHAR(20) NOT NULL,
  floor INTEGER,
  building VARCHAR(50),

  -- Room Type & Features
  room_type VARCHAR(50) NOT NULL, -- standard, deluxe, suite, presidential
  bed_type VARCHAR(50), -- single, double, queen, king, twin
  max_occupancy INTEGER DEFAULT 2,
  size_sqm DECIMAL(6, 2),

  -- Amenities
  amenities TEXT[], -- wifi, tv, minibar, safe, balcony, etc.
  features JSONB DEFAULT '{}',


  -- Status
  status VARCHAR(20) DEFAULT 'available', -- available, occupied, cleaning, maintenance, out_of_order
  is_accessible BOOLEAN DEFAULT false,
  smoking_allowed BOOLEAN DEFAULT false,

  -- Maintenance
  last_cleaned_at TIMESTAMP,
  last_maintenance_at TIMESTAMP,
  next_maintenance_date DATE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(hotel_id, room_number),
  CONSTRAINT chk_room_status CHECK (status IN ('available', 'occupied', 'cleaning', 'maintenance', 'out_of_order'))
);

CREATE INDEX idx_rooms_hotel ON rooms(hotel_id);
CREATE INDEX idx_rooms_number ON rooms(hotel_id, room_number);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_type ON rooms(room_type);
```

---

### 3. Services & Orders

#### `minibar_items`
Minibar inventory and pricing.

```sql
CREATE TABLE minibar_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,

  -- Item Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- drinks, snacks, alcohol, other
  subcategory VARCHAR(50),

  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  cost_price DECIMAL(10, 2), -- For profit calculation

  -- Inventory
  sku VARCHAR(50),
  barcode VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 10,

  -- Product Info
  brand VARCHAR(100),
  size VARCHAR(50),
  unit VARCHAR(20), -- piece, bottle, can, pack

  -- Images
  image_url TEXT,
  thumbnail_url TEXT,

  -- Availability
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  available_from TIME,
  available_until TIME,

  -- Dietary/Allergen Info
  allergens TEXT[],
  dietary_labels TEXT[], -- vegetarian, vegan, gluten_free, halal, kosher

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_minibar_items_hotel ON minibar_items(hotel_id);
CREATE INDEX idx_minibar_items_category ON minibar_items(category);
CREATE INDEX idx_minibar_items_active ON minibar_items(is_active);
```

#### `restaurant_menus`
Restaurant menu management for hotel restaurants.

```sql
CREATE TABLE restaurant_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,

  -- Menu Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  menu_type VARCHAR(50) NOT NULL, -- breakfast, lunch, dinner, room_service, bar

  -- Availability
  is_active BOOLEAN DEFAULT true,
  available_days TEXT[], -- ['monday', 'tuesday', ...]
  available_from TIME,
  available_until TIME,

  -- Display
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_restaurant_menus_hotel ON restaurant_menus(hotel_id);
CREATE INDEX idx_restaurant_menus_restaurant ON restaurant_menus(restaurant_id);
CREATE INDEX idx_restaurant_menus_type ON restaurant_menus(menu_type);
```

#### `menu_items`
Individual menu items.

```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID NOT NULL REFERENCES restaurant_menus(id) ON DELETE CASCADE,

  -- Item Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- appetizers, mains, desserts, beverages

  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Dietary Info
  allergens TEXT[],
  dietary_labels TEXT[],
  spice_level INTEGER, -- 0-5
  calories INTEGER,

  -- Images
  image_url TEXT,

  -- Availability
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  preparation_time INTEGER, -- minutes

  -- Display
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_menu_items_menu ON menu_items(menu_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
```

#### `restaurants`
Hotel restaurant/dining locations.

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,

  -- Restaurant Details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cuisine_type VARCHAR(100), -- italian, chinese, international, etc.
  location VARCHAR(100), -- lobby, rooftop, poolside

  -- Contact
  phone VARCHAR(50),
  extension VARCHAR(10),

  -- Hours
  opening_time TIME,
  closing_time TIME,

  -- Capacity
  seating_capacity INTEGER,

  -- Services
  offers_room_service BOOLEAN DEFAULT false,
  offers_delivery BOOLEAN DEFAULT false,
  accepts_reservations BOOLEAN DEFAULT true,

  -- Status
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_restaurants_hotel ON restaurants(hotel_id);
CREATE INDEX idx_restaurants_active ON restaurants(is_active);
```

#### `orders`
Universal order table for all services (minibar, room service, spa, etc.).

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., "ORD-2025-001234"

  -- References
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,

  -- Order Details
  room_number VARCHAR(20),
  order_type VARCHAR(50) NOT NULL, -- minibar, room_service, restaurant, spa, laundry, other
  source VARCHAR(50), -- guest_app, phone, front_desk, restaurant

  -- Restaurant specific
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  table_number VARCHAR(20),
  dining_type VARCHAR(20), -- dine_in, room_service, takeaway

  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  service_charge DECIMAL(10, 2) DEFAULT 0,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  tip DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- Status & Workflow
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, preparing, ready, delivered, completed, cancelled
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, charged_to_room, failed

  -- Timing
  requested_delivery_time TIMESTAMP,
  confirmed_at TIMESTAMP,
  prepared_at TIMESTAMP,
  delivered_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,

  -- Delivery Info
  delivery_location VARCHAR(255),
  delivery_instructions TEXT,

  -- Staff Assignment
  assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  prepared_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  delivered_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Notes
  guest_notes TEXT,
  staff_notes TEXT,
  cancellation_reason TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT chk_order_type CHECK (order_type IN ('minibar', 'room_service', 'restaurant', 'spa', 'laundry', 'concierge', 'other')),
  CONSTRAINT chk_order_status CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'))
);

CREATE INDEX idx_orders_hotel ON orders(hotel_id);
CREATE INDEX idx_orders_guest ON orders(guest_id);
CREATE INDEX idx_orders_reservation ON orders(reservation_id);
CREATE INDEX idx_orders_room ON orders(room_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_type ON orders(order_type);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

#### `order_items`
Line items for orders.

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  -- Item Reference (polymorphic)
  item_type VARCHAR(50) NOT NULL, -- minibar_item, menu_item, spa_service, custom
  item_id UUID, -- References minibar_items.id or menu_items.id

  -- Snapshot at time of order (prices may change)
  name_snapshot VARCHAR(255) NOT NULL,
  description_snapshot TEXT,
  price_snapshot DECIMAL(10, 2) NOT NULL,

  -- Quantity & Customization
  quantity INTEGER NOT NULL DEFAULT 1,
  customizations JSONB DEFAULT '{}', -- { "no_ice": true, "extra_sauce": "spicy" }
  special_instructions TEXT,

  -- Pricing
  unit_price DECIMAL(10, 2) NOT NULL,
  line_total DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT chk_item_type CHECK (item_type IN ('minibar_item', 'menu_item', 'spa_service', 'custom'))
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_type ON order_items(item_type, item_id);
```

---

### 4. Feedback & Communication

#### `feedback`
Guest feedback and reviews with detailed tracking.

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- References
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,

  -- Guest Info (snapshot)
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_phone VARCHAR(50),
  room_number VARCHAR(20),

  -- Feedback Type
  feedback_type VARCHAR(50) DEFAULT 'general', -- general, complaint, compliment, suggestion, issue
  category VARCHAR(50), -- room, service, food, cleanliness, staff, amenities, other
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent

  -- Ratings (1-5 stars)
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  room_rating INTEGER CHECK (room_rating >= 1 AND room_rating <= 5),
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),

  -- Content
  title VARCHAR(255),
  comment TEXT NOT NULL,

  -- Source
  source VARCHAR(50) DEFAULT 'guest_app', -- guest_app, email, phone, in_person, survey, online_review

  -- Status & Workflow
  status VARCHAR(20) DEFAULT 'new', -- new, acknowledged, in_progress, resolved, closed
  sentiment VARCHAR(20), -- positive, neutral, negative

  -- Response
  response_text TEXT,
  responded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  responded_at TIMESTAMP,

  -- Resolution
  resolution_notes TEXT,
  resolved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP,

  -- Follow-up
  requires_follow_up BOOLEAN DEFAULT false,
  follow_up_date DATE,

  -- Public Review (if from external platforms)
  is_public_review BOOLEAN DEFAULT false,
  review_platform VARCHAR(50), -- google, tripadvisor, booking_com
  review_url TEXT,

  -- Internal Use
  is_featured BOOLEAN DEFAULT false, -- Display as testimonial
  internal_notes TEXT,
  tags TEXT[],

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT chk_feedback_status CHECK (status IN ('new', 'acknowledged', 'in_progress', 'resolved', 'closed'))
);

CREATE INDEX idx_feedback_hotel ON feedback(hotel_id);
CREATE INDEX idx_feedback_guest ON feedback(guest_id);
CREATE INDEX idx_feedback_reservation ON feedback(reservation_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_priority ON feedback(priority);
CREATE INDEX idx_feedback_type ON feedback(feedback_type);
CREATE INDEX idx_feedback_rating ON feedback(overall_rating);
CREATE INDEX idx_feedback_created ON feedback(created_at DESC);
```

#### `feedback_interactions`
Track all interactions related to feedback (calls, emails, meetings).

```sql
CREATE TABLE feedback_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,

  -- Interaction Details
  interaction_type VARCHAR(50) NOT NULL, -- call, email, in_person, note
  interaction_date TIMESTAMP DEFAULT NOW(),

  -- Staff Member
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(255),

  -- Content
  subject VARCHAR(255),
  notes TEXT NOT NULL,
  outcome VARCHAR(50), -- successful, no_answer, left_message, resolved, escalated

  -- Follow-up
  requires_follow_up BOOLEAN DEFAULT false,
  next_follow_up_date DATE,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedback_interactions_feedback ON feedback_interactions(feedback_id);
CREATE INDEX idx_feedback_interactions_date ON feedback_interactions(interaction_date DESC);
```

#### `notifications`
System notifications for guests and staff.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Recipients
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,

  -- Notification Details
  type VARCHAR(50) NOT NULL, -- booking_confirmed, order_status, check_in_reminder, feedback_response, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  -- Channels
  channels TEXT[] DEFAULT '{"app"}', -- app, email, sms, push

  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,

  -- Delivery Status
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP,
  sms_sent BOOLEAN DEFAULT false,
  sms_sent_at TIMESTAMP,
  push_sent BOOLEAN DEFAULT false,
  push_sent_at TIMESTAMP,

  -- Links & Actions
  action_url TEXT,
  action_label VARCHAR(100),

  -- Related Entity
  related_entity_type VARCHAR(50), -- order, reservation, feedback
  related_entity_id UUID,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_guest ON notifications(guest_id);
CREATE INDEX idx_notifications_hotel ON notifications(hotel_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

---

### 6. Guest App Configuration

#### `guest_app_configs`
Customizable guest-facing app settings per hotel.

```sql
CREATE TABLE guest_app_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,

  -- Branding
  logo_url TEXT,
  primary_color VARCHAR(7), -- hex color
  secondary_color VARCHAR(7),
  banner_image_url TEXT,

  -- Welcome Content
  welcome_title VARCHAR(255),
  welcome_message TEXT,

  -- Contact Information
  concierge_phone VARCHAR(50),
  reception_phone VARCHAR(50),
  emergency_phone VARCHAR(50),
  whatsapp_number VARCHAR(50),

  -- Features Enabled
  minibar_enabled BOOLEAN DEFAULT true,
  room_service_enabled BOOLEAN DEFAULT true,
  spa_booking_enabled BOOLEAN DEFAULT false,
  concierge_enabled BOOLEAN DEFAULT true,
  checkout_enabled BOOLEAN DEFAULT true,
  feedback_enabled BOOLEAN DEFAULT true,

  -- Content Sections
  sections JSONB DEFAULT '[]', -- Array of configurable sections

  -- Terms & Policies
  terms_url TEXT,
  privacy_url TEXT,

  -- Language & Localization
  default_language VARCHAR(10) DEFAULT 'en',
  available_languages TEXT[] DEFAULT '{"en"}',

  -- Published
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(hotel_id)
);

CREATE INDEX idx_guest_app_configs_hotel ON guest_app_configs(hotel_id);
```

#### `guest_app_sections`
Dynamic sections for the guest app (spa, transportation, etc.).

```sql
CREATE TABLE guest_app_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,

  -- Section Details
  section_type VARCHAR(50) NOT NULL, -- spa, transportation, dining, activities, services
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- icon identifier

  -- Display
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  -- Contact/Action
  phone VARCHAR(50),
  email VARCHAR(255),
  action_url TEXT,
  action_type VARCHAR(50), -- call, email, web, in_app

  -- Items in this section
  items JSONB DEFAULT '[]',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_guest_app_sections_hotel ON guest_app_sections(hotel_id);
CREATE INDEX idx_guest_app_sections_type ON guest_app_sections(section_type);
CREATE INDEX idx_guest_app_sections_active ON guest_app_sections(is_active);
```

---

### 7. Analytics & Reporting

#### `analytics_events`
Track user interactions and events for analytics.

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- References
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,

  -- Event Details
  event_type VARCHAR(100) NOT NULL, -- page_view, order_placed, feedback_submitted, check_in, etc.
  event_category VARCHAR(50), -- user_action, system_event, transaction

  -- Context
  platform VARCHAR(20), -- web, mobile, admin
  user_agent TEXT,
  ip_address INET,

  -- Data
  event_data JSONB DEFAULT '{}',

  -- Session
  session_id VARCHAR(100),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_hotel ON analytics_events(hotel_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
```

#### `revenue_reports`
Daily revenue aggregation for performance tracking.

```sql
CREATE TABLE revenue_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,

  -- Report Period
  report_date DATE NOT NULL,
  report_type VARCHAR(20) DEFAULT 'daily', -- daily, weekly, monthly, yearly

  -- Room Revenue
  rooms_occupied INTEGER DEFAULT 0,
  rooms_available INTEGER DEFAULT 0,
  occupancy_rate DECIMAL(5, 2) DEFAULT 0, -- percentage
  room_revenue DECIMAL(12, 2) DEFAULT 0,
  average_daily_rate DECIMAL(10, 2) DEFAULT 0,

  -- Service Revenue
  minibar_revenue DECIMAL(10, 2) DEFAULT 0,
  restaurant_revenue DECIMAL(10, 2) DEFAULT 0,
  spa_revenue DECIMAL(10, 2) DEFAULT 0,
  other_revenue DECIMAL(10, 2) DEFAULT 0,

  -- Total
  total_revenue DECIMAL(12, 2) DEFAULT 0,

  -- Guests
  total_guests INTEGER DEFAULT 0,
  new_guests INTEGER DEFAULT 0,
  returning_guests INTEGER DEFAULT 0,

  -- Satisfaction
  average_rating DECIMAL(3, 2),
  total_feedback_count INTEGER DEFAULT 0,
  positive_feedback_count INTEGER DEFAULT 0,
  negative_feedback_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(hotel_id, report_date, report_type)
);

CREATE INDEX idx_revenue_reports_hotel ON revenue_reports(hotel_id);
CREATE INDEX idx_revenue_reports_date ON revenue_reports(report_date DESC);
CREATE INDEX idx_revenue_reports_type ON revenue_reports(report_type);
```

---

### 8. Supporting Tables

#### `audit_logs`
Complete audit trail for compliance and security.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Actor
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  user_role VARCHAR(50),

  -- Context
  hotel_id UUID REFERENCES hotels(id) ON DELETE SET NULL,

  -- Action
  action VARCHAR(100) NOT NULL, -- create, update, delete, login, logout, export, etc.
  entity_type VARCHAR(50) NOT NULL, -- guest, order, reservation, user, etc.
  entity_id UUID,

  -- Details
  description TEXT,
  changes JSONB, -- { "old": {...}, "new": {...} }

  -- Request Info
  ip_address INET,
  user_agent TEXT,
  request_method VARCHAR(10),
  request_path TEXT,

  -- Result
  status VARCHAR(20) DEFAULT 'success', -- success, failure, error
  error_message TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_hotel ON audit_logs(hotel_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

#### `settings`
Global and per-hotel configurable settings.

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE, -- NULL for global settings

  -- Setting Identity
  setting_key VARCHAR(100) NOT NULL,
  setting_category VARCHAR(50), -- system, email, payment, features, etc.

  -- Value
  setting_value TEXT NOT NULL,
  value_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(hotel_id, setting_key)
);

CREATE INDEX idx_settings_hotel ON settings(hotel_id);
CREATE INDEX idx_settings_key ON settings(setting_key);
CREATE INDEX idx_settings_category ON settings(setting_category);
```

---

## User Roles & Permissions

### Role Hierarchy

```
SuperAdmin (Global)
├── Full system access
├── Manage all hotels
├── Create/delete hotels
├── Manage all users
├── View all analytics
├── System configuration
└── Billing & subscriptions

Hotel Admin (Per-Hotel)
├── Full hotel access
├── Manage hotel settings
├── Manage staff users
├── View hotel analytics
├── Manage inventory
├── Cannot access other hotels
├── View analytics
├── Manage guests & reservations
├── Manage orders
├── Handle feedback
├── Manage staff schedules
├── imited settings access
├── Check-in/check-out
├── Manage reservations
├── View/update guest info
├── Process payments
└── Handle basic requests

Restaurant Staff (Per-Hotel)
├── View/manage restaurant orders
├── Update order status
├── View menu
└── Limited guest info

Housekeeping (Per-Hotel)
├── View room status
├── Update cleaning status
└── Report maintenance issues

Guest (Per-Reservation)
├── View own reservation
├── Place orders
├── Submit feedback
├── View bills
└── Update preferences
```

### Permission System

Implement Row Level Security (RLS) in Supabase:

```sql
-- Example RLS Policy for hotels table
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- SuperAdmins see all hotels
CREATE POLICY "SuperAdmins can view all hotels"
  ON hotels FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'superadmin'
    )
  );

-- Hotel staff can only see their assigned hotels
CREATE POLICY "Hotel staff can view their hotels"
  ON hotels FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hotel_users
      JOIN users ON users.id = hotel_users.user_id
      WHERE users.auth_id = auth.uid()
      AND hotel_users.hotel_id = hotels.id
      AND hotel_users.status = 'active'
    )
  );

-- Similar policies for guests, orders, reservations, etc.
```

---

## API Endpoints

### Authentication

```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/register -- will be from supabase
GET    /api/auth/me
PUT    /api/auth/profile
```

### SuperAdmin Endpoints

```
# Hotels Management
GET    /api/superadmin/hotels
POST   /api/superadmin/hotels
GET    /api/superadmin/hotels/{hotel_id}
PUT    /api/superadmin/hotels/{hotel_id}
DELETE /api/superadmin/hotels/{hotel_id}
PATCH  /api/superadmin/hotels/{hotel_id}/status

# Users Management (All)
GET    /api/superadmin/users
POST   /api/superadmin/users
GET    /api/superadmin/users/{user_id}
PUT    /api/superadmin/users/{user_id}
DELETE /api/superadmin/users/{user_id}

# Global Analytics
GET    /api/superadmin/analytics/overview
GET    /api/superadmin/analytics/revenue
GET    /api/superadmin/analytics/hotels-performance

# System Settings
GET    /api/superadmin/settings
PUT    /api/superadmin/settings/{key}

# Audit Logs
GET    /api/superadmin/audit-logs
```

### Admin Endpoints (Hotel-Specific)

```
# Dashboard & Analytics
GET    /api/admin/hotels/{hotel_id}/dashboard
GET    /api/admin/hotels/{hotel_id}/analytics/revenue
GET    /api/admin/hotels/{hotel_id}/analytics/guests
GET    /api/admin/hotels/{hotel_id}/analytics/feedback
GET    /api/admin/hotels/{hotel_id}/analytics/occupancy

# Hotel Settings
GET    /api/admin/hotels/{hotel_id}/settings
PUT    /api/admin/hotels/{hotel_id}/settings

# Guests Management
GET    /api/admin/hotels/{hotel_id}/guests
POST   /api/admin/hotels/{hotel_id}/guests
GET    /api/admin/hotels/{hotel_id}/guests/{guest_id}
PUT    /api/admin/hotels/{hotel_id}/guests/{guest_id}
DELETE /api/admin/hotels/{hotel_id}/guests/{guest_id}
GET    /api/admin/hotels/{hotel_id}/guests/{guest_id}/history

# Reservations
GET    /api/admin/hotels/{hotel_id}/reservations
POST   /api/admin/hotels/{hotel_id}/reservations
GET    /api/admin/hotels/{hotel_id}/reservations/{reservation_id}
PUT    /api/admin/hotels/{hotel_id}/reservations/{reservation_id}
DELETE /api/admin/hotels/{hotel_id}/reservations/{reservation_id}
POST   /api/admin/hotels/{hotel_id}/reservations/{reservation_id}/check-in
POST   /api/admin/hotels/{hotel_id}/reservations/{reservation_id}/check-out
POST   /api/admin/hotels/{hotel_id}/reservations/{reservation_id}/cancel

# Rooms Management
GET    /api/admin/hotels/{hotel_id}/rooms
POST   /api/admin/hotels/{hotel_id}/rooms
GET    /api/admin/hotels/{hotel_id}/rooms/{room_id}
PUT    /api/admin/hotels/{hotel_id}/rooms/{room_id}
DELETE /api/admin/hotels/{hotel_id}/rooms/{room_id}
PATCH  /api/admin/hotels/{hotel_id}/rooms/{room_id}/status

# Orders Management
GET    /api/admin/hotels/{hotel_id}/orders
GET    /api/admin/hotels/{hotel_id}/orders/{order_id}
PATCH  /api/admin/hotels/{hotel_id}/orders/{order_id}/status
PUT    /api/admin/hotels/{hotel_id}/orders/{order_id}
POST   /api/admin/hotels/{hotel_id}/orders/{order_id}/assign

# Minibar Management
GET    /api/admin/hotels/{hotel_id}/minibar/items
POST   /api/admin/hotels/{hotel_id}/minibar/items
GET    /api/admin/hotels/{hotel_id}/minibar/items/{item_id}
PUT    /api/admin/hotels/{hotel_id}/minibar/items/{item_id}
DELETE /api/admin/hotels/{hotel_id}/minibar/items/{item_id}
PATCH  /api/admin/hotels/{hotel_id}/minibar/items/{item_id}/stock

# Restaurant Management
GET    /api/admin/hotels/{hotel_id}/restaurants
POST   /api/admin/hotels/{hotel_id}/restaurants
GET    /api/admin/hotels/{hotel_id}/restaurants/{restaurant_id}
PUT    /api/admin/hotels/{hotel_id}/restaurants/{restaurant_id}
DELETE /api/admin/hotels/{hotel_id}/restaurants/{restaurant_id}

GET    /api/admin/hotels/{hotel_id}/restaurants/{restaurant_id}/menus
POST   /api/admin/hotels/{hotel_id}/restaurants/{restaurant_id}/menus
GET    /api/admin/hotels/{hotel_id}/restaurants/{restaurant_id}/menus/{menu_id}
PUT    /api/admin/hotels/{hotel_id}/restaurants/{restaurant_id}/menus/{menu_id}
DELETE /api/admin/hotels/{hotel_id}/restaurants/{restaurant_id}/menus/{menu_id}

GET    /api/admin/hotels/{hotel_id}/menus/{menu_id}/items
POST   /api/admin/hotels/{hotel_id}/menus/{menu_id}/items
GET    /api/admin/hotels/{hotel_id}/menus/{menu_id}/items/{item_id}
PUT    /api/admin/hotels/{hotel_id}/menus/{menu_id}/items/{item_id}
DELETE /api/admin/hotels/{hotel_id}/menus/{menu_id}/items/{item_id}

# Feedback Management
GET    /api/admin/hotels/{hotel_id}/feedback
GET    /api/admin/hotels/{hotel_id}/feedback/{feedback_id}
PATCH  /api/admin/hotels/{hotel_id}/feedback/{feedback_id}/status
POST   /api/admin/hotels/{hotel_id}/feedback/{feedback_id}/respond
POST   /api/admin/hotels/{hotel_id}/feedback/{feedback_id}/interactions
GET    /api/admin/hotels/{hotel_id}/feedback/{feedback_id}/interactions

# Guest App Configuration
GET    /api/admin/hotels/{hotel_id}/guest-app/config
PUT    /api/admin/hotels/{hotel_id}/guest-app/config
POST   /api/admin/hotels/{hotel_id}/guest-app/publish

GET    /api/admin/hotels/{hotel_id}/guest-app/sections
POST   /api/admin/hotels/{hotel_id}/guest-app/sections
GET    /api/admin/hotels/{hotel_id}/guest-app/sections/{section_id}
PUT    /api/admin/hotels/{hotel_id}/guest-app/sections/{section_id}
DELETE /api/admin/hotels/{hotel_id}/guest-app/sections/{section_id}

# Notifications
GET    /api/admin/hotels/{hotel_id}/notifications
POST   /api/admin/hotels/{hotel_id}/notifications
```

### Guest Endpoints

```
# Guest Profile
GET    /api/guest/profile
PUT    /api/guest/profile

# Current Reservation
GET    /api/guest/reservation/current
GET    /api/guest/reservation/{reservation_id}
GET    /api/guest/reservation/{reservation_id}/bill

# Guest App Content
GET    /api/guest/app/config
GET    /api/guest/app/sections

# Orders
GET    /api/guest/orders
POST   /api/guest/orders
GET    /api/guest/orders/{order_id}
DELETE /api/guest/orders/{order_id}  # Cancel if pending

# Minibar
GET    /api/guest/minibar/items
GET    /api/guest/minibar/items/{item_id}

# Restaurants & Menus
GET    /api/guest/restaurants
GET    /api/guest/restaurants/{restaurant_id}
GET    /api/guest/restaurants/{restaurant_id}/menus
GET    /api/guest/menus/{menu_id}/items

# Feedback
POST   /api/guest/feedback
GET    /api/guest/feedback
GET    /api/guest/feedback/{feedback_id}

# Services
POST   /api/guest/services/request  # Concierge, housekeeping, etc.
GET    /api/guest/services/requests

# Notifications
GET    /api/guest/notifications
PATCH  /api/guest/notifications/{notification_id}/read
PATCH  /api/guest/notifications/mark-all-read
```

---

## Security & Scalability

### Security Best Practices

1. **Authentication & Authorization**
   - Use Supabase Auth with JWT tokens
   - Implement Row Level Security (RLS) on all tables
   - Multi-factor authentication for admin users
   - Session management with secure cookies

2. **Data Protection**
   - Encrypt sensitive data (ID documents, payment info)
   - Hash passwords with bcrypt
   - Use HTTPS only
   - Implement rate limiting on all API endpoints
   - Sanitize all user inputs

3. **API Security**
   - API key rotation for ministry integrations
   - Request validation and sanitization
   - CORS configuration
   - API versioning (v1, v2)

4. **Audit & Compliance**
   - Log all data access and modifications
   - GDPR compliance (right to be forgotten)
   - Data retention policies
   - Regular security audits


### Scalability Considerations

1. **Database**
   - Use database indexes on frequently queried columns
   - Implement connection pooling
   - Consider read replicas for analytics queries
   - Partition large tables (orders, analytics_events) by date

2. **Caching**
   - Redis for session management
   - Cache frequently accessed data (menus, hotel settings)
   - CDN for static assets (images, documents)

3. **API Design**
   - Pagination on all list endpoints (default: 20 items)
   - Filtering, sorting, and search capabilities
   - GraphQL for complex queries (optional)
   - WebSocket for real-time updates (order status, notifications)

4. **Performance**
   - Lazy loading for guest app content
   - Image optimization and compression
   - Background jobs for heavy tasks (reports)
   - Queue system for order processing

5. **Multi-tenancy**
   - Hotel isolation at database level
   - Separate storage buckets per hotel
   - Resource limits per hotel
   - Independent scaling per hotel

---

## Integration Points

### 1. Ministry/Government System
- **Check-in/Check-out reporting**
- **Guest registration submission**
- **Daily occupancy reports**
- **Security alerts**
- API-based or manual submission fallback

### 2. Payment Gateways
- Stripe/PayPal for online payments
- Charge to room functionality
- Multi-currency support
- Refund processing
### 4. Housekeeping Systems
- Room status updates
- Maintenance requests
- Cleaning schedules

### 5. Email/WHATSAPP Services
- SendGrid/Mailgun for emails
- WhatsApp Business API
- Push notifications (Firebase)

### 6. Analytics Platforms
- Google Analytics
- Mixpanel
- Custom dashboards

### 7. External Booking Platforms
- Booking.com
- Expedia
- Airbnb
- Channel manager integration

---

## Sample API Request/Response Examples

### 1. Create Guest Order (Minibar)

**POST** `/api/guest/orders`

```json
{
  "order_type": "minibar",
  "room_number": "305",
  "items": [
    {
      "item_id": "uuid-of-coca-cola",
      "quantity": 2,
      "customizations": {}
    },
    {
      "item_id": "uuid-of-chips",
      "quantity": 1,
      "special_instructions": "No salt"
    }
  ],
  "delivery_instructions": "Please knock softly",
  "requested_delivery_time": "2025-10-28T14:30:00Z"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": "uuid-order",
    "order_number": "ORD-2025-001234",
    "status": "pending",
    "total_amount": 15.50,
    "estimated_delivery": "20-30 minutes",
    "items": [
      {
        "name": "Coca Cola",
        "quantity": 2,
        "unit_price": 5.00,
        "line_total": 10.00
      },
      {
        "name": "Chips",
        "quantity": 1,
        "unit_price": 3.50,
        "line_total": 3.50
      }
    ],
    "subtotal": 13.50,
    "tax": 2.00,
    "total": 15.50
  }
}
```

### 2. Get Hotel Dashboard Analytics

**GET** `/api/admin/hotels/{hotel_id}/dashboard`

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "period": "today",
    "date": "2025-10-28",
    "revenue": {
      "total": 45250.00,
      "rooms": 38000.00,
      "minibar": 2150.00,
      "restaurant": 4200.00,
      "other": 900.00
    },
    "occupancy": {
      "total_rooms": 120,
      "occupied_rooms": 98,
      "available_rooms": 22,
      "occupancy_rate": 81.67,
      "average_daily_rate": 387.76
    },
    "guests": {
      "checked_in": 98,
      "checking_in_today": 15,
      "checking_out_today": 12,
      "total_guests": 182
    },
    "orders": {
      "pending": 8,
      "in_progress": 3,
      "completed": 45,
      "total_today": 56
    },
    "feedback": {
      "average_rating": 4.6,
      "total_reviews": 23,
      "pending_response": 5
    }
  }
}
```

### 3. Submit Guest Feedback

**POST** `/api/guest/feedback`

```json
{
  "feedback_type": "compliment",
  "category": "service",
  "overall_rating": 5,
  "service_rating": 5,
  "room_rating": 4,
  "cleanliness_rating": 5,
  "title": "Excellent Service!",
  "comment": "The staff at the front desk were incredibly helpful and friendly. Special thanks to Maria!"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "message": "Thank you for your feedback!",
  "data": {
    "id": "uuid-feedback",
    "status": "new",
    "created_at": "2025-10-28T10:30:00Z"
  }
}
```

### 4. Check-in Reservation

**POST** `/api/admin/hotels/{hotel_id}/reservations/{reservation_id}/check-in`

```json
{
  "room_id": "uuid-room-305",
  "actual_check_in_time": "2025-10-28T14:15:00Z",
  "id_verified": true,
  "notes": "Early check-in approved"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Guest checked in successfully",
  "data": {
    "reservation_id": "uuid-reservation",
    "reservation_code": "RES-2025-001234",
    "status": "checked_in",
    "room_number": "305",
    "guest_name": "John Doe",
    "check_out_date": "2025-10-30",
    "ministry_reported": true
  }
}
```

---
