import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";
import { TOKENS } from "../utils/Tokens";

export interface CollateralToken {
  symbol: string;
  address: string;
  decimals: number;
  amount: string;
}

export const useCollateral = (refreshKey?: number) => {
  const { contract, account } = useWallet();
  const [collateral, setCollateral] = useState<CollateralToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState<boolean>(true); // 🔹 Nuevo estado para la carga inicial

  const fetchCollateral = async (isInitialLoad: boolean = false) => {
    if (!contract || !account) {
      console.warn("useCollateral: Contract or account not available");
      return;
    }

    if (isInitialLoad) setLoading(true);

    try {
      const collateralData = await Promise.all(
        TOKENS.map(async (token) => {
          const amount = await contract.collateralDeposited(
            account,
            token.address
          );
          return { ...token, amount };
        })
      );
      setCollateral(collateralData);
    } catch (error) {
      console.error("Error fetching collateral:", error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    fetchCollateral(true);
  }, [contract, account]);

  useEffect(() => {
    if (!initialLoad) {
      fetchCollateral(false);
    }
  }, [refreshKey]);

  return { collateral, loading, fetchCollateral };
};
