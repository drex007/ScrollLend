import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";
import { TOKENS } from "../utils/Tokens";

export interface LiquidityPool {
  symbol: string;
  address: string;
  decimals: number;
  amount: string;
  withdrawalTime: number;
  addedAt: number;
}

export const useLiquidityPool = (refreshKey?: number) => {
  const { contract, account } = useWallet();
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);
  const [loadingLiquidityPools, setLoadingLiquidityPools] =
    useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState<boolean>(true); // 🔹 Estado para controlar la carga inicial

  const fetchLiquidityPools = async (isInitialLoad = false) => {
    if (!contract || !account) return;

    // 🔹 Activar loading solo en la primera carga
    if (isInitialLoad) setLoadingLiquidityPools(true);

    try {
      const pools = await Promise.all(
        TOKENS.map(async (token) => {
          const pool = await contract.getLiquidityPool(account, token.address);
          return {
            ...token,
            amount: pool.amount,
            withdrawalTime: pool.withdrawalTime,
            addedAt: pool.addedAt,
          };
        })
      );
      setLiquidityPools(pools.filter((pool) => pool.addedAt !== 0));
    } catch (error) {
      console.error("Error fetching liquidity pools:", error);
    } finally {
      if (isInitialLoad) {
        setLoadingLiquidityPools(false);
        setInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    fetchLiquidityPools(true);
  }, [contract, account]);

  useEffect(() => {
    if (!initialLoad) {
      fetchLiquidityPools(false);
    }
  }, [refreshKey]);

  return { liquidityPools, loadingLiquidityPools, fetchLiquidityPools };
};
