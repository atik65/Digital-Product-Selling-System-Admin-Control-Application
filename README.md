# 💎 Digital Product Selling System — Admin Dashboard & Control Panel

A modern, high-performance, mobile-first administrative management platform designed specifically for digital goods e-commerce (game currencies, in-game top-ups, subscriptions, software keys, and gift cards).

Built with **React 19**, **Vite**, **Tailwind CSS v4**, **TanStack Query**, **Radix UI**, and native mobile gestures via **Vaul iOS Drawers**, seamlessly integrated with a **FastAPI** asynchronous backend.

---

## 🚀 Key Highlights & Architecture

- **📱 Mobile-First Responsive Design**: Desktop view renders rich data tables (`TableMaker`), while screens `< md` automatically adapt to tactile touch cards (`MobileCard`) and native swipe-to-dismiss iOS-style bottom drawers (`vaul`).
- **🔗 URL-First State Management**: All table filters, search terms, pagination offsets, and tabs are synchronized directly with URL search parameters (`useSyncParams`), enabling seamless link sharing and back/forward browser navigation.
- **🛡️ Secure HttpOnly Cookie Authentication**: Local development proxy and backend issue `HttpOnly` session tokens with credentials verification, safeguarding against client-side XSS attacks, backed by `<ProtectedRoute>` guards.
- **⚡ Automatic Cache Invalidation**: TanStack Query mutations (`useRequest`) trigger targeted cache invalidations, instantly refreshing tables and KPI metric counters across modules without full page reloads.
- **🧩 Dynamic Product Input Builder**: Allows administrators to specify custom runtime user inputs (e.g., `Player ID`, `Zone ID`, `Server Name`, `Account Email`) required during digital product checkout.
- **৳ Localized Currency & Visual Polish**: Built-in Bangladeshi Taka (`৳`) currency formatting, humanized timestamps, dynamic image upload previewers, and distinct status pills.

---

## 📦 Feature Modules Breakdown

```
Admin Control Panel
├── 📊 Executive Dashboard (Real-time KPIs, Action Alerts & Feeds)
├── 🛍️ Store Catalog
│   ├── Categories (Image uploads, sorting priority, status toggling)
│   └── Products (Dynamic custom checkout fields & tier packages)
├── 💳 Sales & Finances
│   ├── Order Management (Fulfillment status workflow & customer data)
│   ├── Payment Verification Queue (Manual TrxID verification & proofs)
│   ├── Payment Gateways (bKash, Nagad, Rocket, Upay manual wallets)
│   ├── SMS Forwarder Audit Logs (Live gateway incoming SMS stream)
│   └── Wallet Management (User reload requests & manual balance adjustments)
├── 👥 Customers & Marketing
│   ├── Customer Directory (Balances, verification, role switcher)
│   ├── Promotional Coupons (Fixed/percentage discounts & constraints)
│   ├── Gamified Lottery (Campaigns, tiered prize pools & entry logs)
│   └── Marketing CMS (Hero promotional banners & announcement popups)
└── ⚙️ System Settings (Branding, logos, contact hotlines & community links)
```

---

### 1. 📊 Executive Dashboard (`/`)
- **Key Metrics Overview**: Real-time counters for Total Revenue (`৳`), Total Orders, Active Registered Customers, and Live Catalog Items.
- **Urgent Action Center**: Prominent alert cards highlighting pending manual payment verifications and wallet top-ups awaiting immediate approval.
- **Activity Streams**: Side-by-side feed of recent orders and manual payment submissions with 1-click navigation.

### 2. 📁 Store Catalog
- **Categories (`/categories`)**:
  - Image preview, name, URL slug, display order, and active/inactive toggle.
  - Create and edit modals with integrated multipart image uploads.
  - Mobile touch card view and bottom drawer inspection.
- **Products & Packages (`/products`)**:
  - Base pricing, category attribution, stock count, and active/featured toggles.
  - **Dynamic Field Builder (`ManageFieldsModal`)**: Add required user input fields for game top-ups (`Player ID`, `Zone ID`, `Server`) with input type choices (`text`, `number`, `select`) and regex validation rules.
  - **Package / Tier Manager (`ManagePackagesModal`)**: Configure multi-tier offerings (e.g., `100 Diamonds = ৳95`, `Weekly Diamond Pass = ৳180`) with bonus amounts and delivery notes.

### 3. 💳 Sales & Finances
- **Orders (`/orders`)**:
  - Filterable order list with customer name, product package, payment method, and amount.
  - **Status Transitions**: Advance orders through `pending` ➔ `processing` ➔ `completed` / `cancelled` / `refunded`.
  - **Custom Field Inspection**: View customer-submitted dynamic data (e.g., UID/Player ID) in the bottom order detail drawer.
  - **Internal Admin Notes**: Add staff audit notes to any order.
- **Payment Verification Queue (`/payments`)**:
  - Review manual mobile banking payments (bKash, Nagad, Rocket, Upay).
  - Displays Sender Phone Number, Transaction ID (`TrxID`), Amount, and uploaded payment screenshot/receipt.
  - 1-click Approve or Reject dialog with reason recording.
- **Payment Methods & Gateways (`/payment-methods`)**:
  - Manage payment accounts: Account Type (`Personal`, `Agent`, `Merchant`), wallet number, instructions, and QR code image.
- **SMS Forwarder Audit Logs (`/sms-logs`)**:
  - Live inspection log of incoming SMS received by Android gateway forwarders.
  - Shows raw message body, detected sender, parsed amount, and matched TrxIDs.
- **Wallet Top-Up Management (`/wallet-topups`)**:
  - Customer digital wallet reload queue with approval workflow.
  - **Manual Balance Adjustments (`WalletAdjustModal`)**: Credit or Debit any customer's wallet balance directly with administrative audit remarks.

### 4. 👥 Customers & Marketing
- **Customer Directory (`/users`)**:
  - View registered customers, email verification status, registration date, and current wallet balance.
  - Toggle user active status or promote/demote between `user` and `admin` roles.
  - Customer detail drawer displaying full order and wallet summary.
- **Coupons & Discounts (`/coupons`)**:
  - Discount codes supporting Percentage (`%`) or Fixed (`৳`) deductions.
  - Configurable minimum purchase requirement, maximum discount caps, expiration dates, and per-user usage limits.
- **Gamified Lottery (`/lottery`)**:
  - Host lottery and lucky-spin campaigns with ticket pricing and scheduled duration.
  - **Prize Pool Configurator (`ManagePrizesModal`)**: Add tiered rewards (Cashback, Diamonds, Items) with probabilities/weights and stock allocations.
  - **Ticket Entries Log (`LotteryEntriesModal`)**: Live audit log of purchased tickets and winning roll records.
- **Marketing CMS (`/marketing`)**:
  - **Hero Banners**: Responsive carousel banners with desktop and mobile image URLs, click-through links, and priority ordering.
  - **Announcement Popups**: Timed or exit-intent promotional popups with call-to-action buttons.

### 5. ⚙️ System Settings (`/settings`)
- **Branding & Identity**: Site title, app description, logo, and favicon upload.
- **Support & Communication**: Customer service email, hotline phone numbers, and official Telegram & WhatsApp channel links.

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite` |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) + Custom Tailwind Design System |
| **Mobile Drawer** | [Vaul](https://vaul.emilkowal.ski/) (iOS-style gesture drawer) |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) + Axios |
| **Forms & Validation** | [Formik](https://formik.org/) / [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) |
| **Icons & Feedback** | [Lucide React](https://lucide.dev/) + [Sonner](https://sonner.emilkowal.ski/) Toasts |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) |

---

## 📁 Project Directory Structure

```
src/
├── components/            # Reusable UI primitives
│   ├── app-sidebar.jsx    # Grouped navigation sidebar with SPA routing
│   ├── common/            # Shared form inputs, dialogs, and table components
│   │   ├── table/         # TableMaker, TableSearch, TablePagination, useTable
│   │   └── form/          # FormikWrapper, FormField, Select, Switch
│   └── layout/            # AdminLayout, Header, UserNav
├── hooks/                 # Custom utility hooks (useApi, useRequest, useProfile)
├── lib/                   # Shared utilities & configurations
│   ├── axiosInstance.js   # Centralized Axios client with credentials
│   ├── formatters.js      # BDT Currency (৳), date, and badge helpers
│   ├── media.js           # Multipart file upload and image URL resolver
│   └── cookies.js         # Cookie management
├── routes/                # ProtectedRoute, PublicRoute, and central router definitions
└── views/                 # Feature view modules (Demo Pattern)
    ├── auth/              # Admin login & authentication
    ├── categories/        # Category management & drawer
    ├── coupons/           # Promotional discounts
    ├── demo/              # Starter pattern reference
    ├── lottery/           # Gamified campaigns, prizes & tickets
    ├── marketing/         # Hero banners & announcement popups
    ├── orders/            # Order fulfillment & custom input inspector
    ├── overview/          # Executive dashboard & metrics
    ├── payments/          # Payment verification, gateways & SMS logs
    ├── products/          # Products, dynamic field builder & packages
    ├── settings/          # Store settings & branding
    ├── users/             # Customer directory & balances
    └── wallet/            # Wallet reload queue & balance adjustments
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **FastAPI Backend**: Running locally on `http://localhost:8000` (or configured via reverse proxy)

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Development Server
Start the local Vite development server:
```bash
npm run dev
```
The application will launch at `http://localhost:9000` (proxied to the FastAPI backend).

### 3. Production Build
Verify types and bundle the production assets:
```bash
npm run build
```
Assets are compiled into the `dist/` directory with code splitting.

---

## 🔐 Default Admin Credentials

When the backend database is seeded with initial demo data:

| Field | Value |
| :--- | :--- |
| **Portal URL** | `http://localhost:9000/login` |
| **Admin Email** | `admin@example.com` |
| **Password** | `admin123` |
| **Access Level** | Super Administrator (`role: admin`) |

*(Note: Regular customer accounts logging into the admin portal are automatically rejected with a `403 Forbidden` guard).*

---

## 📄 License
Private & Proprietary — Developed for Digital Product Selling System.
