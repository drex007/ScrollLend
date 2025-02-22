import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { useWallet } from "../context/WalletConnectProvider";

const TOKENS = [
  {
    symbol: "sUSDT",
    address: "0xC27Bb2572977Af7e35FfFe2F55c9b83C2e8084c4",
    decimals: 18,
  },
  {
    symbol: "wBTC",
    address: "0x281D5a078fEcc2D113b5FD1ADA814C75F9397bAa",
    decimals: 18,
  },
  {
    symbol: "wETH",
    address: "0x08Fe95f3E49C2d5231Eef694C2087a7a550D7593",
    decimals: 18,
  },
];

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
              amount: formatUnits(amount, token.decimals),
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
