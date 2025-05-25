import { getDefaultConfig} from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';

const anvil = {
    id: 31_337,
    name: 'Anvil',
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
    iconBackground: '#fff',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['http://localhost:8545'] },
    },
    blockExplorers: {
        default: { name: 'Anvil', url: 'http://localhost:8545' },
    },
    testnet: true,
};

export const config = getDefaultConfig({
    appName: 'RainbowKit demo',
    projectId: 'YOUR_PROJECT_ID',
    chains: [anvil, mainnet, polygon, optimism, arbitrum, base],
    // transports: {
    //     [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/...'),
    //     [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/...'),
    // },
});