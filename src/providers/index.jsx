;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import useThemeStore from "@/store/useThemeStore";

function ThemeProvider({ children }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}

export function Providers({ children }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: { fontFamily: "inherit" },
                    }}
                />
            </ThemeProvider>
        </QueryClientProvider>
    );
}