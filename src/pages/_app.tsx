import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useSettingsStore } from "~~/src/state-managers";
import { MainLayout } from "../layouts/MainLayout";
import { GlobalEffectsProvider } from "../shared/components/GlobalEffectsProvider";
import "~~/src/shared/styles/globals.css";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const FacelessApp = ({ Component, pageProps }: AppProps) => {

  const wagmiConfig = useSettingsStore((state) => state.wagmiConfig);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <GlobalEffectsProvider>

          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>

        </GlobalEffectsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default FacelessApp;
