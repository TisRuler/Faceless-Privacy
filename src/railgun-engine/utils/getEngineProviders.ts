import { FallbackProviderJsonConfig } from "@railgun-community/shared-models";
import { SupportedChainId } from "~~/src/shared/types";
import { getRpcsForChain } from "~~/src/shared/utils/network";

const createEngineProvider = (
  chainId: number,
  defaultURLs: string[],
): FallbackProviderJsonConfig => ({
  chainId,
  providers: defaultURLs.map((url, index) => ({
    provider: url,
    priority: index + 1,
    weight: 1,
  })),
});

export const getEngineProviders = async (id: SupportedChainId): Promise<FallbackProviderJsonConfig> => {
  const providerUrls = await getRpcsForChain(id);

  return createEngineProvider(id, providerUrls);
};