import type { ReactNode } from "react"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { Toaster } from "@/components/ui/sonner"
import { IdentityProvider } from "@/context/IdentityContext"
import { EventConfigProvider } from "@/context/EventConfigContext"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <IdentityProvider>
          <EventConfigProvider>
            {children}
            <Toaster position="top-center" richColors />
          </EventConfigProvider>
        </IdentityProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
