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

export const useLiquidityPool = () => {
  const { contract, account } = useWallet();
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);
  const [loadingLiquidityPools, setLoadingLiquidityPools] =
    useState<boolean>(true);

  useEffect(() => {
    const fetchLiquidityPools = async () => {
      if (!contract || !account) return;

      setLoadingLiquidityPools(true);
      try {
        const pools = await Promise.all(
          TOKENS.map(async (token) => {
            const pool = await contract.getLiquidityPool(
              account,
              token.address
            );
            return {
              ...token,
              amount: pool.amount,
              withdrawalTime: pool.withdrawalTime,
              addedAt: pool.addedAt,
            };
          })
        );
        const poolFilter = pools.filter(
          (pool) => pool.addedAt !== 0 && pool.withdrawalTime !== 0
        );
        setLiquidityPools(poolFilter);
      } catch (error) {
        console.error("Error fetching liquidity pools:", error);
      } finally {
        setLoadingLiquidityPools(false);
      }
    };

    fetchLiquidityPools();
  }, [contract, account]);

  return { liquidityPools, loadingLiquidityPools };
};
