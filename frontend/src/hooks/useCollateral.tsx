import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { useWallet } from "../context/WalletConnectProvider";
import { TOKENS } from "../utils/Tokens";

export interface CollateralToken {
  symbol: string;
  address: string;
  decimals: number;
  amount: string;
}

export const useCollateral = () => {
  const { contract, account } = useWallet();
  const [collateral, setCollateral] = useState<CollateralToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCollateral = async () => {
      if (!contract || !account) {
        console.warn("useCollateral: Contract or account not available");
        return;
      }

      setLoading(true);

      try {
        const collateralData = await Promise.all(
          TOKENS.map(async (token) => {
            const amount = await contract.collateralDeposited(
              account,
              token.address
            );
            return {
              ...token,
              amount,
            };
          })
        );

        setCollateral(collateralData);
      } catch (error) {
        console.error("Error to get the collateral:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollateral();
  }, [contract, account]);

  return { collateral, loading };
};
