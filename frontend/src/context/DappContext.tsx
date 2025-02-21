import { createContext, useContext, useState } from "react";
import { BrowserProvider, Contract, Signer } from "ethers";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "../utils/LendingBorrowingContract";

const DappContext = createContext<{
  contract: Contract | null;
  account: string | null;
  provider: BrowserProvider | null;
  signer: Signer | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}>({
  contract: null,
  account: null,
  provider: null,
  signer: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const useDapp = () => useContext(DappContext);

export const DAppProvider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installet");
      return;
    }
    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const signerInstance = await browserProvider.getSigner();
      const address = await signerInstance.getAddress();

      setProvider(browserProvider);
      setSigner(signerInstance);
      setAccount(address);

      setContract(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerInstance));
    } catch (error) {
      console.error("Error to connect MetaMask:", error);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
  };

  return (
    <DappContext.Provider
      value={{
        contract,
        account,
        provider,
        signer,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </DappContext.Provider>
  );
};
