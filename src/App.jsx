import { ThemeProvider } from "@/components/theme/theme-provider";
import { RouterProvider } from "react-router-dom";
import QueryProvider from "./components/provider/QueryProvider";
import ScrollToTop from "./components/common/ScrollToTop";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { ModalRenderer } from "./lib/easyModal";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="bottom-right" />
        <ScrollToTop />
        <ModalRenderer />
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
