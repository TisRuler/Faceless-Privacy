
// import { 
//     ChainType, 
//     NetworkName, 
//     RailgunProxyContract,
//     RelayAdaptContract
// } from '@railgun-community/shared-models';
// import { Polygon } from '~~/src/assets/images/tokens';
// import { ChainData } from './types';
// import { polygonAmoy } from "viem/chains"

// export const polygonAmoyData: ChainData = {
//     id: 80002,
//     name: "Polygon Amoy",

//     // Public and Private flow
//     publicModeBaseToken: {
//         address: "0x21d4Ec3C9a2408C5535ecc26a09d94dC7B7f5c10",
//         logoURI: Polygon,
//         name: "Polygon Ecosystem Token",
//         symbol: "POL",
//         decimals: 18,
//         chainId: 80002,
//         isBaseToken: true,
//     },
//     privateModeBaseToken: {
//     address: "0x21d4Ec3C9a2408C5535ecc26a09d94dC7B7f5c10",
//     logoURI: Polygon,
//     name: "Wrapped Polygon Ecosystem Token",
//     symbol: "WPOL",
//     },

//     // Privacy pool viewing
//     defaultShieldingTokensList: [
//     { address: "0x21d4Ec3C9a2408C5535ecc26a09d94dC7B7f5c10", commonQuantitys: ["0.01", "0.05", "0.075", "1"] },
//   ],
//     defaultPrivacyPoolTokenList: "0x21d4Ec3C9a2408C5535ecc26a09d94dC7B7f5c10",
//     batchConfig: {
//      customBlocksPerBatch: 12000,
//      defaultBlocksPerBatch: 12000,
//      batchQuantity: 10,
//     },
//     anonymityPoolAddress: RailgunProxyContract.Polygon_Amoy,

//     // Shared 
//     railgunNetworkName: NetworkName.PolygonAmoy,
//     railgunNetworkName: NetworkName.Polygon,
//     railgunChain: {
//       type: ChainType.EVM,
//       id: 80002,
//     },
//     supportsEIP1559: true,
//     blockExplorer: { name: "Polyscan", url: "https://amoy.polygonscan.com" },
//     popularTokenMetadata: {
//         '0x21d4Ec3C9a2408C5535ecc26a09d94dC7B7f5c10': {
//         logoUri: Polygon,
//         tokenPriceApi: 'https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd',
//         },
//     } as { [key: string]: { logoUri: string, tokenPriceApi: string } },
//
//     // Other
//     viemChain: polygonAmoy,
// };