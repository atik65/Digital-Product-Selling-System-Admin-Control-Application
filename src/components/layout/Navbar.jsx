import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", path: "/" },
  { key: "appointments", label: "Appointments", path: "/appointments" },
  // {
  //   key: "document",
  //   label: "Document Verification",
  //   path: "/document-verification",
  // },
  { key: "session", label: "Session Management", path: "/session-management" },
  { key: "users", label: "Users", path: "/users" },
  {
    key: "doc-category",
    label: "Category Management",
    path: "/document-category",
  },
  {
    key: "desk-management",
    label: "Desk Management",
    path: "/desk-management",
  },
  {
    key: "service-desk",
    label: "Service Desk",
    path: "/service-desk",
  },
  // {
  //   key: "settings",
  //   label: "Settings",
  //   submenu: [
  //     {
  //       key: "document",
  //       label: "Document",
  //       items: [
  //         {
  //           key: "doc-category",
  //           label: "Document Category",
  //           path: "/document-category",
  //         },
  //         { key: "doc-type", label: "Document Type", path: "/document-type" },
  //       ],
  //     },
  //     {
  //       key: "website",
  //       label: "Website Management",
  //       items: [
  //         {
  //           key: "website-settings",
  //           label: "Website Settings",
  //           path: "/website-settings",
  //         },
  //         {
  //           key: "website-content",
  //           label: "Website Content",
  //           path: "/website-content",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (item) => {
    // Support submenu array, submenu object with items, and legacy subItems
    const items = Array.isArray(item.submenu)
      ? item.submenu
      : item.submenu?.items || item.subItems;
    if (items) {
      return items.some((subItem) => isActive(subItem.path));
    }
    return false;
  };

  const handleNavClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex gap-8">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.key}
              className="relative"
              onMouseEnter={() =>
                (item.submenu || item.subItems) && setOpenDropdown(item.key)
              }
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => handleNavClick(item)}
                className={cn(
                  "relative py-4 text-sm font-medium transition-colors hover:text-gray-900 flex items-center gap-1",
                  isActive(item.path) || isParentActive(item)
                    ? "text-gray-900"
                    : "text-gray-500"
                )}
              >
                {item.label}
                {(item.submenu || item.subItems) && (
                  <ChevronDown className="h-4 w-4" />
                )}
                {(isActive(item.path) || isParentActive(item)) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
                )}
              </button>

              {(item.submenu || item.subItems) && openDropdown === item.key && (
                <div className="absolute top-full left-0 mt-0 bg-white border border-gray-200 rounded-md shadow-lg py-2 min-w-50 z-50">
                  {Array.isArray(item.submenu) ? (
                    item.submenu.map((subItem) => {
                      // Check if this is a grouped item (has items property)
                      if (subItem.items) {
                        return (
                          <div key={subItem.key}>
                            <div className="px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                              {subItem.label}
                            </div>
                            {subItem.items.map((nestedItem) => (
                              <button
                                key={nestedItem.key}
                                onClick={() => navigate(nestedItem.path)}
                                className={cn(
                                  "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50",
                                  isActive(nestedItem.path)
                                    ? "text-emerald-600 font-medium"
                                    : "text-gray-700"
                                )}
                              >
                                {nestedItem.label}
                              </button>
                            ))}
                          </div>
                        );
                      }
                      // Flat item (has path property)
                      return (
                        <button
                          key={subItem.key}
                          onClick={() => navigate(subItem.path)}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50",
                            isActive(subItem.path)
                              ? "text-emerald-600 font-medium"
                              : "text-gray-700"
                          )}
                        >
                          {subItem.label}
                        </button>
                      );
                    })
                  ) : (
                    <>
                      {item.submenu?.group && (
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                          {item.submenu.group}
                        </div>
                      )}
                      {(item.submenu?.items || item.subItems).map((subItem) => (
                        <button
                          key={subItem.key}
                          onClick={() => navigate(subItem.path)}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50",
                            isActive(subItem.path)
                              ? "text-emerald-600 font-medium"
                              : "text-gray-700"
                          )}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
