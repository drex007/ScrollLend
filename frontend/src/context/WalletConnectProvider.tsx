import { createContext, useContext, useState, useEffect } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Signer } from "ethers";
import { EthersLendingBorrowingContract } from "../infraestructure/EthersLendingBorrowingContract";
import { ILendingBorrowingContract } from "../application/contracts/ILendingBorrowingContract";

interface WalletContextType {
  account: string | null;
  provider: BrowserProvider | null;
  signer: Signer | null;
  contract: ILendingBorrowingContract | null;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  provider: null,
  signer: null,
  contract: null,
});

export const useWallet = () => useContext(WalletContext);

export const WalletContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<ILendingBorrowingContract | null>(
    null
  );

  useEffect(() => {
    if (
      isConnected &&
      walletProvider &&
      Object.keys(walletProvider).length > 0
    ) {
      const ethersProvider = new BrowserProvider(walletProvider);
      ethersProvider.getSigner().then((signerInstance) => {
        setProvider(ethersProvider);
        setSigner(signerInstance);
        setContract(new EthersLendingBorrowingContract(signerInstance));
      });
    } else {
      setProvider(null);
      setSigner(null);
      setContract(null);
    }
  }, [isConnected, walletProvider]);

  return (
    <WalletContext.Provider
      value={{ account: address || null, provider, signer, contract }}
    >
      {children}
    </WalletContext.Provider>
  );
};
