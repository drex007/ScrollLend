import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { scrollSepolia } from '@reown/appkit/networks';


const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const metadata = {
  name: 'ScrollLend',
  description: '',
  url: 'https://drex007.github.io/ScrollLend/',
  icons: ['https://avatars.mywebsite.com/']
}

export const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [scrollSepolia],
  metadata,
  projectId,
  features: {
    analytics: true
  }
})
