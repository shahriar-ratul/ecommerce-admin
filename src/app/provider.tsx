"use client";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import AbilityProvider from "@/components/providers/AbilityProvider";
import QueryProvider from "@/components/providers/QueryProvider";

interface Props {
  children: React.ReactNode;
}
export default function Providers({ children }: Props) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AbilityProvider>
          <QueryProvider>
            <Provider store={store}>
              <TooltipProvider>{children}</TooltipProvider>
            </Provider>
          </QueryProvider>
        </AbilityProvider>
      </ThemeProvider>
    </>
  );
}
