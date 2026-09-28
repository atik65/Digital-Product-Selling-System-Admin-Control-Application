/**
 * Route path to human-readable label dictionary.
 * Maps exact route paths or segment slugs to friendly labels.
 */
export const ROUTE_TITLES = {
  "": "Overview",
  "/": "Overview",
  overview: "Overview",
  "/overview": "Overview",

  // Store Catalog
  products: "Products Catalog",
  "/products": "Products Catalog",
  categories: "Categories",
  "/categories": "Categories",

  // Sales & Finances
  orders: "Orders Fulfillment",
  "/orders": "Orders Fulfillment",
  payments: "Payment Verification",
  "/payments": "Payment Verification",
  "payment-methods": "Payment Gateways",
  "/payment-methods": "Payment Gateways",
  "sms-logs": "SMS Device Logs",
  "/sms-logs": "SMS Device Logs",
  "wallet-topups": "Wallet Top-Ups",
  "/wallet-topups": "Wallet Top-Ups",

  // Customers & Marketing
  users: "Customer Directory",
  "/users": "Customer Directory",
  coupons: "Discount Coupons",
  "/coupons": "Discount Coupons",
  lottery: "Lucky Spin Lotteries",
  "/lottery": "Lucky Spin Lotteries",
  marketing: "Marketing CMS",
  "/marketing": "Marketing CMS",
  "marketing/popups": "Popups & Modals",
  "marketing/campaigns": "Marketing Campaigns",
  "marketing/banners": "Promotional Banners",

  // System & Profile
  settings: "Site Settings",
  "/settings": "Site Settings",
  profile: "Profile",
  "/profile": "Profile",
  update: "Update Profile",
  "/profile/update": "Update Profile",
  "change-password": "Change Password",
  "/profile/change-password": "Change Password",

  // Demo
  demo: "Demo Starter",
  "/demo": "Demo Starter",
};

/**
 * Formats a raw URL segment into a clean, human-readable Title Case label.
 * E.g. "wallet-topups" -> "Wallet Top-Ups", "123" -> "#123", "add-edit" -> "Add Edit"
 *
 * @param {string} segment
 * @param {string} [fullPath]
 * @returns {string}
 */
export const formatBreadcrumbLabel = (segment, fullPath = "") => {
  if (!segment) return "";

  // Check exact full path match first
  if (fullPath && ROUTE_TITLES[fullPath]) {
    return ROUTE_TITLES[fullPath];
  }

  // Check segment match in dictionary
  const lowerSegment = segment.toLowerCase();
  if (ROUTE_TITLES[lowerSegment]) {
    return ROUTE_TITLES[lowerSegment];
  }

  // Pure numeric IDs (e.g. "12", "105") -> "#12", "#105"
  if (/^\d+$/.test(segment)) {
    return `#${segment}`;
  }

  // Hex or UUID hashes (e.g. mongo id or uuid) -> "Details"
  if (/^[0-9a-fA-F-]{20,}$/.test(segment)) {
    return "Details";
  }

  // Fallback: convert kebab-case and snake_case into Title Case
  return segment
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Generates an array of breadcrumb objects from a URL pathname.
 *
 * @param {string} pathname Current route path (e.g. "/products", "/profile/update")
 * @param {object} [options]
 * @param {string} [options.rootTitle="Overview"] Label for the root/home breadcrumb
 * @param {string} [options.rootHref="/"] URL for the root breadcrumb
 * @returns {Array<{ label: string, href: string, isCurrent: boolean }>}
 *
 * @example
 * getBreadcrumbs("/profile/update")
 * // [
 * //   { label: "Overview", href: "/", isCurrent: false },
 * //   { label: "Profile", href: "/profile", isCurrent: false },
 * //   { label: "Update Profile", href: "/profile/update", isCurrent: true }
 * // ]
 */
export const getBreadcrumbs = (pathname = "/", options = {}) => {
  const { rootTitle = "Overview", rootHref = "/" } = options;

  // Clean pathname: remove query string or hash if present
  const cleanPath = (pathname || "/").split("?")[0].split("#")[0];

  // Split into segments and discard empty strings
  const segments = cleanPath.split("/").filter(Boolean);

  // If at root or overview, return single breadcrumb item
  if (segments.length === 0 || (segments.length === 1 && segments[0] === "overview")) {
    return [
      {
        label: rootTitle,
        href: rootHref,
        isCurrent: true,
      },
    ];
  }

  const breadcrumbs = [
    {
      label: rootTitle,
      href: rootHref,
      isCurrent: false,
    },
  ];

  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isCurrent = index === segments.length - 1;
    const label = formatBreadcrumbLabel(segment, currentPath);

    breadcrumbs.push({
      label,
      href: currentPath,
      isCurrent,
    });
  });

  return breadcrumbs;
};

export default getBreadcrumbs;
