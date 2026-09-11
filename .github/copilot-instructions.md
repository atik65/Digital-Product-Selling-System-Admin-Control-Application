# Copilot Instructions

## Stack & Environment

- **Core**: React 19 + Vite (ESM only), React Router 6, TanStack Query v5, Tailwind CSS v4 + shadcn/radix UI
- **State**: Zustand v5 for global state (easyModal system) - no Context API
- **Forms**: react-hook-form + yup validation, custom `useFormik` wrapper
- **Auth**: HttpOnly cookie (server-managed) + encrypted localStorage for user profile
- **Imports**: Use `@/*` absolute paths ([jsconfig.json](jsconfig.json) + Vite alias)
- **Commands**: `npm run dev` (opens browser, proxy `/api`), `npm run build`, `npm run lint`, `npm run preview`
- **Project**: Bangladesh High Commission in Paris admin dashboard (consular services management)
- **Theme**: Dark/light mode toggle via [src/components/theme/](src/components/theme/) - uses next-themes pattern
- **Utilities**: @mantine/hooks for `useDebouncedValue`, `useDidUpdate` (not full Mantine UI)

**Environment setup**: Requires `.env` file with:

```env
VITE_APP_TITLE=<app-name>
VITE_API_BASE_URL_PROD=<prod-api-url>
VITE_API_BASE_URL_DEV=<dev-api-url>
VITE_CRYPTOJS_SECRET_KEY=<secret-key>
VITE_API_PROXY_TARGET=<optional-proxy-override>  # Overrides default proxy target
```

**Tailwind CSS v4**: Uses new CSS-first approach via `@import "tailwindcss"` in [src/styles/index.css](src/styles/index.css) - no `tailwind.config.js` needed. Custom variants: `@custom-variant dark (&:is(.dark *))` for theme support.

**Development state**: Currently using mock data in pages. API integration patterns are established but endpoints need backend implementation. All data-fetching hooks are ready; replace mock data with actual API calls when backend is available.

## Configuration & API Structure

**Config file**: [src/config/base.js](src/config/base.js) reads:

- `VITE_APP_TITLE`, `VITE_API_BASE_URL_DEV/PROD`, `VITE_CRYPTOJS_SECRET_KEY`
- Exports `config.baseURL` based on `import.meta.env.PROD`

**API endpoints**: Define as objects `{ endpoint, path, method }`:

```js
const authApi = {
  login: { endpoint: "/api/user/auth", path: "/login", method: "post" },
};
```

See [src/pages/auth/api/index.js](src/pages/auth/api/index.js). Centralize per feature (auth, appointments, etc.).

**Axios instance**: [src/lib/axiosInstance.js](src/lib/axiosInstance.js) uses `baseURL: "/"` + `withCredentials: true`. Vite proxies `/api` in dev mode ([vite.config.js](vite.config.js#L28-L32)). No Authorization header needed - cookies handle auth automatically.

## Authentication Flow

**CRITICAL - HttpOnly Cookie Pattern**: Server sets `auth_token` cookie with HttpOnly flag - **JavaScript cannot read it**. Auth state relies on `signedIn` cookie for client-side checks.

**State management**: Authentication handled via cookies:

- Server sets `auth_token` (HttpOnly) and `signedIn` cookies on login
- `signedIn` cookie readable by JS for route protection checks
- User profile stored in encrypted localStorage via [src/lib/storage.js](src/lib/storage.js)
- Logout: calls [src/lib/logout.js](src/lib/logout.js) utility, clears localStorage

**Route protection**: [src/routes/ProtectedRoute.jsx](src/routes/ProtectedRoute.jsx):

```js
const isLoggedIn = getCookie("signedIn") === "true";
```

**Logout utility**: [src/lib/logout.js](src/lib/logout.js) - centralized logout logic:

```js
import logout from "@/lib/logout";
await logout(); // Calls API + clears localStorage + redirects to /login
```

**IMPORTANT**: `logout()` handles redirect internally - don't call `navigate()` after logout. Used by:

- User-triggered logouts (nav menus, profile actions)
- Global 401 handler in [src/lib/queryInstance.js](src/lib/queryInstance.js)

**Storage encryption**: [src/lib/storage.js](src/lib/storage.js) wraps localStorage with AES encryption via [src/lib/encryptDecrypt.js](src/lib/encryptDecrypt.js):

```js
import {
  getStoredValue,
  setStoredValue,
  removeStoredValue,
} from "@/lib/storage";
const profile = getStoredValue("userProfile", null); // Auto-decrypts
```

**Routes**: [src/routes/index.jsx](src/routes/index.jsx):

- **Protected routes** (/, /appointments, etc.): wrapped in `<ProtectedRoute />` → renders `<AdminLayout><Outlet /></AdminLayout>`, redirects to `/login` if unauthenticated
- **Public routes** (/login, /register, etc.): wrapped in `<PublicRoute />` → renders `<Outlet />`, redirects to `/` if authenticated
- **Do NOT nest `<Outlet />`** in child route elements; both route wrappers already provide it

**Auth pages**: login, signup, forgot-password, verify-otp, reset-password. All use [src/pages/auth/AuthLayout.jsx](src/pages/auth/AuthLayout.jsx) (2/3 hero image, 1/3 form on desktop).

**Layout structure**: [src/components/layout/AdminLayout.jsx](src/components/layout/AdminLayout.jsx):

- Uses shadcn sidebar component ([src/components/app-sidebar.jsx](src/components/app-sidebar.jsx))
- Navigation config in sidebar component with `<nav-main>`, `<nav-projects>`, `<nav-user>` subcomponents
- Header with breadcrumbs and theme toggle ([src/components/layout/Header.jsx](src/components/layout/Header.jsx))
- Navbar provides main navigation tabs ([src/components/layout/Navbar.jsx](src/components/layout/Navbar.jsx))

## Data Fetching & Mutations

**Query client**: [src/lib/queryInstance.js](src/lib/queryInstance.js) globally handles 401s:

- Disables retries for 401 responses
- Calls `handleUnauthorized()` → calls [src/lib/logout.js](src/lib/logout.js), redirects to `/login`
- **Never manually redirect on 401**; let the query client handle it
- Uses shared logout utility to ensure consistent cleanup

**Cache revalidation**: Use `revalidateCache(cacheKey)` from [src/lib/queryInstance.js](src/lib/queryInstance.js):

```js
import { revalidateCache } from "@/lib/queryInstance";
revalidateCache("userProfile"); // Debounced 1s, batch-friendly
```

**GET queries**: Use [src/hooks/useApi.js](src/hooks/useApi.js):

```js
const { data, isLoading, refetch } = useApi({
  api: authApi.login,
  cacheKey: ["users", searchTerm],
  params: { page: 1 }, // URL query params
  filter: { status: "active" }, // POST body or query string
  trigger: true, // disable with false
  isInfinite: false, // for infinite scroll
});
```

- Standard options: no refetch on window focus/reconnect, retry disabled for 401
- Infinite queries: set `isInfinite: true`, uses `cursor` param + `getNextPageParam`

**Mutations (POST/PUT/DELETE)**: Use [src/hooks/useRequest.js](src/hooks/useRequest.js):

```js
const { mutateAsync } = useRequest();

await mutateAsync({
  data: formData,
  api: authApi.register,
  cacheKey: "users", // for optimistic updates
  addEditCacheKey: "userDetail", // for single item cache update
  id: userId, // for update/delete (null = create)
  sort: "desc", // "asc" or "desc" for optimistic insert
  form, // react-hook-form instance
  handleDone: (res) => {}, // success callback
  handleError: (err) => {}, // error callback
  isToast: true, // auto toast on success
});
```

- **422 validation errors**: automatically wired to `form.setError()` by field name
- **Optimistic updates**: supports pagination (`paginationCrud`) or infinite scroll (`infiniteCrud`)
- **Auto toasts**: success messages via Sonner (disable with `isToast: false`)

## Project Structure & Organization

**Feature folder pattern**: Each feature in `src/pages/{feature}/` contains:

- `{Feature}.jsx` - Main component
- `api/index.js` - API endpoint definitions with cacheKey
- `utils/schema.js` - Yup validation schemas
- `utils/columns.jsx` - Table column configurations (for list views)
- `components/` - Feature-specific components (AddEdit, etc.)

**Example**: [src/pages/settings/document-type/](src/pages/settings/document-type/) structure:

```
settings/document-type/
├── DocumentType.jsx
├── api/index.js          # API endpoints + cacheKey
├── utils/
│   ├── schema.js         # Form validation
│   └── columns.jsx       # Table columns
└── components/
    └── AddEdit.jsx       # Add/Edit sheet
```

**Note**: Some features are nested under parent routes (e.g., `/settings/document-type`, `/settings/staffs`). Follow this pattern for grouped admin features.

**API endpoint pattern** ([src/pages/settings/document-type/api/index.js](src/pages/settings/document-type/api/index.js)):

```js
const endpoint = "/api/admin/document-type";

const documentTypeApi = {
  cacheKey: "documentTypes", // For TanStack Query cache
  list: { endpoint, path: "/list", method: "get" },
  create: { endpoint, path: "/create", method: "post" },
  update: (id) => ({ endpoint, path: `/update/${id}`, method: "put" }),
  delete: (id) => ({ endpoint, path: `/delete/${id}`, method: "delete" }),
  show: (id) => ({ endpoint, path: `/show/${id}`, method: "get" }),
};
```

## Forms & Validation

**Pattern**: Schemas in `utils/schema.js` (previously at feature root):

```js
// schema.js
import * as yup from "yup";
const loginSchema = {
  validation: yup.object({ email: yup.string().email().required() }),
  values: () => ({ email: "" }),
};
export default loginSchema;

// Login.jsx
import useFormik from "@/hooks/useFormik";
const form = useFormik({
  schema: loginSchema.validation,
  defaultValues: loginSchema.values(),
  onSubmit,
  mode: "onChange",
});
```

**Components**: Use from [src/components/common/Formik/](src/components/common/Formik/):

- `<FormikWrapper form={form}>` wraps form, handles submit
- `<FieldInput>`, `<CheckBoxField>`, `<RadioField>`, `<SwitchField>`, `<FileInput>`, `<TimeStampInput>`
- All auto-wire to react-hook-form, show validation errors

**FileInput**: [src/components/common/Formik/FileInput.jsx](src/components/common/Formik/FileInput.jsx) - Advanced file upload with compression & cropping:

```jsx
<FileInput
  name="avatar"
  form={form}
  label="Profile Picture"
  cropType="circle" // "circle" or "square" (default)
  acceptedTypes="image" // "image", "video", or "both"
  data={existingImage} // for reset to initial value
/>
```

- **Auto-compression**: Images → max 1MB/1920px, Videos → max 50MB/5 min
- **Drag & drop**: Full support with visual feedback
- **Image cropping**: Uses `react-advanced-cropper` with circle/square stencils
- **Memory safe**: Auto-cleanup of blob URLs in `useEffect` return
- **Actions**: Reset (to `data` prop), Crop (images only), Remove (clear field)

**Validation flow**: yup schema → react-hook-form → server 422 errors → `useRequest` → `form.setError(field, message)`

## Table & Data Display Patterns

**TableMaker setup** ([src/components/common/table/TableMaker.jsx](src/components/common/table/TableMaker.jsx)):

```js
// 1. Define columns with custom cell renderers
const columns = [
  { header: "ID", accessorKey: "id" },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => <span>{row.name}</span>, // Access row directly, NOT row.original
  },
];

// 2. Use useTable hook for data fetching & URL sync
const { tableInfo } = useTable({
  filter: { search, status, category },
  api: { method: "get", endpoint: "/api/items", path: "/" },
  apiCacheKey: "items",
});
// ⚠️ IMPORTANT: useTable is at [src/components/common/table/hooks/useTable.jsx](src/components/common/table/hooks/useTable.jsx)

// 3. Mock data structure (for development)
const tableInfoWithMockData = {
  ...tableInfo,
  data: {
    items: mockData, // REQUIRED for select all functionality
    pagination: { page: 1, per_page: 10, total: mockData.length, lastPage: 1 },
  },
  isLoading: false,
};
```

**CRITICAL Table conventions**:

- Table cells receive `row` directly (not `row.original`) - access as `row.id`, `row.name`
- Cell renderers get `{ row, tableInfo, toast, navigate, logics }` props from [Table.jsx](src/components/common/table/Table.jsx)
- `navigate` is pre-injected - use directly: `onClick={() => navigate(\`/path?id=\${row.id}\`)}`
- Data must include `items` array for select all checkbox: `{ items: [...], pagination: {...} }`
- Mock data requires `_id` field (MongoDB convention) for row selection: `{ id: "123", _id: "123", ...data }`
- Use `TableSearch` component (not native input) - provides debounced search with URL sync
- Use `Select` component (not native select) - consistent styling + better UX

**Search & filters**:

```jsx
<TableSearch
  placeholder="Search..."
  searchTableParams={search}
  tableInfo={tableInfo}
  leftIcon={
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
  } // default
  rightIcon={<Filter className="..." />} // optional
  className="w-96"
/>
```

- **Auto-padding**: `pl-10` when `leftIcon` present, `pr-10` when `rightIcon` present
- **Default icon**: Search icon on left (can override with `leftIcon` prop)
- **Custom render**: Use `renderSearchButton` for full custom control (legacy support)

```jsx
<Select
  inputClassName="min-w-[180px]"
  placeholder="All Status"
  optionSchema={{ id: "id", label: "label" }}
  manualOption={[{ id: "active", label: "Active" }]}
  value={status}
  setValue={(value) => routerSyncParams({ status: value })}
/>
```

````

## URL & State Management Conventions

**URL parameters**: Use kebab-case for clean, SEO-friendly URLs:

```js
// ✅ GOOD: Clean URLs
status: "under-review"; // URL: ?status=under-review
category: "visa-application";

// ❌ AVOID: Space encoding
status: "under review"; // URL: ?status=under+review (messy)
````

**Display labels**: Separate storage values from display text:

```js
const statusLabels = {
  "documents-submitted": "Documents Submitted",
  "under-review": "Under Review",
  "slot-offered": "Slot Offered",
};
// Use in cell: {statusLabels[row.status]}
```

**URL state sync**: [src/hooks/useSyncParams.js](src/hooks/useSyncParams.js) syncs filter state to URL:

```js
const { routerSyncParams, searchParamsSyncParams } = useSyncParams();

// Updates URL and triggers re-fetch
routerSyncParams({ search: "john", page: 2, status: "" });

// Get params from URL
const search = searchParamsSyncParams?.get("search") || "";

// Initialize state from URL (for persistence on reload)
const [activeTab, setActiveTab] = useState(category || "all");
```

**Detail view pattern**: Check for URL param to show detail vs list view ([DocumentVerification.jsx](src/pages/document/DocumentVerification.jsx)):

```jsx
const [searchParams] = useSearchParams();
const applicantId = searchParams.get("applicant_id");

if (applicantId) {
  // Show detail view with applicant data
  return <DetailView applicant={mockData[applicantId]} />;
}
// Show list view
return <ListView />;
```

## UI Components & Styling

**shadcn/ui**: [src/components/ui/](src/components/ui/) contains Radix UI wrappers. Follow shadcn patterns.

**Common helpers**:

- [src/components/common/Image.jsx](src/components/common/Image.jsx): Lazy-loads with IntersectionObserver
- [src/components/common/editor/RichTextEditor.jsx](src/components/common/editor/RichTextEditor.jsx): Jodit WYSIWYG editor
- [src/components/common/select/Select.jsx](src/components/common/select/Select.jsx): Dropdown with API support
- [src/components/common/table/TableSearch.jsx](src/components/common/table/TableSearch.jsx): Debounced search (500ms)

**Status badges**: Define styles and labels separately:

```jsx
const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
};
<span className={cn("rounded-full px-3 py-1", statusStyles[status])}>
  {statusLabels[status]}
</span>;
```

## Error Handling & Edge Cases

- **401 Unauthorized**: Handled globally by query client; triggers logout + redirect to `/login`
- **422 Validation**: `useRequest` auto-wires field errors to form; no manual mapping needed
- **Network errors**: Handled by TanStack Query retry logic (max 3 attempts, exponential backoff)
- **Loading states**: Check `isLoading` from `useApi`, `isSubmitting` from `form.formState`
- **Empty states**: Provide custom `noDataRender` to TableMaker for empty result UX

## Domain & Feature Context

**Project**: Admin dashboard for Bangladesh High Commission in Paris (consular services management)

**Features**:

- **Overview**: Dashboard with statistics and charts
- **Appointments**: Scheduling with category tabs, status filters, table view, detail navigation
- **Document Verification**: Applicant detail view with information cards and action buttons
- **Document Management**: Document types and categories with full CRUD (table-based)
- **Slot Management**: Time slot administration
- **Users**: User management and permissions

**Current state**: Using mock data; API integration patterns established but endpoints need backend implementation

**Navigation patterns**:

- List to detail: Pass ID via URL param (e.g., `/document-verification?applicant_id=APT-2024-001`)
- Table cells get pre-injected `navigate` function from [Table.jsx](src/components/common/table/Table.jsx)
- Detail views: Use `useSearchParams()` to read param, show detail if exists, otherwise list/404
- **Navbar**: Horizontal tabs with dropdown submenus (see [Navbar.jsx](src/components/layout/Navbar.jsx) for NAV_ITEMS)

## Adding New Features

1. **Create feature folder structure**:
   ```
   src/pages/{feature}/
   ├── {Feature}.jsx
   ├── api/index.js
   ├── utils/
   │   ├── schema.js
   │   └── columns.jsx (if table-based)
   └── components/
       └── AddEdit.jsx
   ```
2. **Define API**: Create `api/index.js` with endpoint objects and cacheKey
3. **Add validation**: Create `utils/schema.js` with yup schema + default values
4. **Table columns**: Create `utils/columns.jsx` for table views (export named `{feature}Columns`)
5. **Add route**: Update [src/routes/index.jsx](src/routes/index.jsx) under `<ProtectedRoute>` children
6. **Update nav**: Add to `NAV_ITEMS` in [src/components/layout/Navbar.jsx](src/components/layout/Navbar.jsx)
7. **Use patterns**: `useApi` for GET, `useRequest` + `useFormik` for mutations, `TableMaker` + `useTable` for lists

## Utility Patterns

**Shared utilities** in [src/lib/](src/lib/):

- `logout.js` - Centralized logout API call + cleanup (used throughout app & queryInstance)
- `storage.js` - Encrypted localStorage wrapper (getStoredValue, setStoredValue, removeStoredValue)
- `cookies.js` - Simple cookie wrapper (NOTE: Server's HttpOnly cookies can't be read by JS)
- `queryInstance.js` - TanStack Query client with 401 handling + revalidateCache helper
- `axiosInstance.js` - Axios with `withCredentials: true` for cookie-based auth
- `easyModal/` - Zustand-based global modal management (see below)

**Anti-patterns**:

- ❌ Don't try to read HttpOnly cookies with JS (use localStorage for client state)
- ❌ Don't duplicate logout logic (use [src/lib/logout.js](src/lib/logout.js))
- ❌ Don't call React hooks in utility files (keep utilities plain JS)
- ❌ Don't manually handle 401 redirects (query client handles globally)
- ❌ Don't encrypt client-side cookies (use HttpOnly for sensitive data or encrypted localStorage)
- ❌ Don't use React Context for state management (use Zustand instead)

## EasyModal System (Global Modal Management)

**Architecture**: Zustand-based modal system for opening modals anywhere without Context/Provider boilerplate or component state.

**Structure** ([src/lib/easyModal/](src/lib/easyModal/)):

```
easyModal/
├── index.js          # Public API (openModal, closeModal, ModalRenderer)
├── store.js          # Zustand state management
├── registry.js       # Modal component registry (lazy-loaded)
└── ModalRenderer.jsx # Renders active modals (add to App.jsx)
```

**Usage pattern**:

```js
// 1. Register modal in registry.js
const MODAL_REGISTRY = {
  documentType: lazy(() =>
    import("@/pages/settings/document-type/components/AddEdit")
  ),
};

// 2. Open modal from anywhere (no state, no hooks needed)
import { openModal } from "@/lib/easyModal";
openModal("documentType", {
  editData: null,
  onClose: () => revalidateCache("documentTypes"),
});

// 3. ModalRenderer already added to App.jsx root
```

**Key features**:

- **Lazy loading**: Modals only load when first opened (performance)
- **No state management**: Direct function calls, no useState/Context needed
- **Animation-aware**: 300ms delay before DOM removal for close animations
- **Multiple modals**: Can open multiple modals simultaneously
- **Type-safe registry**: All modals centralized in [src/lib/easyModal/registry.js](src/lib/easyModal/registry.js)

**Common use case** - Quick add from Select component:

```jsx
<Select
  form={form}
  name="document_type_ids"
  api={baseApis.document_types}
  onAddNew={() =>
    openModal("documentType", {
      onClose: () => revalidateCache(baseApis.document_types.cacheKey),
    })
  }
/>
```

**Why Zustand over Context**: Avoids Context re-render issues, no Provider boilerplate, better performance, simpler API. Context API is deprecated in this project for global state.
