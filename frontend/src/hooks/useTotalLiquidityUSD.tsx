import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";
import { TOKENS } from "../utils/Tokens";

export interface TotalLiquidityUSD {
  symbol: string;
  address: string;
  decimals: number;
  amount: string;
}

export const useTotalLiquidityUSD = () => {
  const { contract } = useWallet();
  const [totalLiquidityUSD, setTotalLiquidityUSD] = useState<
    TotalLiquidityUSD[]
  >([]);
  const [loadingTotalLiquidityUSD, setLoadingTotalLiquidityUSD] =
    useState(true);

  useEffect(() => {
    const fetchGetTotalLiquidityUSD = async () => {
      if (!contract) {
        console.warn("useTotalLiquidityUSD: contract not available");
        return;
      }
      try {
        const totalLiquidityUSDData = await Promise.all(
          TOKENS.map(async (token) => {
            const amountLiquitity = await contract.totalLiquidity(
              token.address
            );
            const amountUSD = await contract.getAssetValueInUSD(
              token.address,
              amountLiquitity
            );
            return {
              ...token,
              amount: amountUSD,
            };
          })
        );
        setTotalLiquidityUSD(totalLiquidityUSDData);
      } catch (error) {
        console.log("Error fetching total liquidity USD:", error);
      } finally {
        setLoadingTotalLiquidityUSD(false);
      }
    };
    fetchGetTotalLiquidityUSD();
  }, [contract]);

  return { totalLiquidityUSD, loadingTotalLiquidityUSD };
};
