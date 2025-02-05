import React, { useEffect } from "react";
import { DAppProvider, Config, useEthers } from "@usedapp/core";

const CHAIN_ID = Number(import.meta.env.VITE_SCROLL_CHAIN_ID);
const RPC_URL = import.meta.env.VITE_SCROLL_RPC_URL;

const config: Config = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [CHAIN_ID]: RPC_URL,
  },
};

const NetworkHandler = ({ children }: { children: React.ReactNode }) => {
  const { chainId, switchNetwork } = useEthers();

  useEffect(() => {
    if (chainId && chainId !== CHAIN_ID) {
      switchNetwork?.(CHAIN_ID);
    }
  }, [chainId]);

  return <>{children}</>;
};

export const DAppContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <DAppProvider config={config}>
      <NetworkHandler>{children}</NetworkHandler>
    </DAppProvider>
  );
};
