"use client"
import React from 'react'
import { ThemeProvider } from "@/components/theme-provider";
import { config } from "@/components/wagmi";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header"
const queryClient = new QueryClient();

const Provider = ({children}:{children:React.ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      <RainbowKitProvider>
         
     <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <Toaster richColors closeButton />
                <Header />

          {children}
        </ThemeProvider>
          
          </RainbowKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
  )
}

export default Provider
