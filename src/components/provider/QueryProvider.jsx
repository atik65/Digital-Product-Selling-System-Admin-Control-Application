import { queryClientInstance } from "@/lib/queryInstance";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const QueryProvider = ({ children }) => {
  const [queryClient] = useState(queryClientInstance);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
