import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";
import { TOKENS } from "../utils/Tokens";

interface PendingInterest {
  symbol: string;
  address: string;
  decimals: number;
  amount: string | "Not Available";
}

export const usePendingInterest = () => {
  const { contract } = useWallet();
  const [pendingInterest, setPendingInterest] = useState<PendingInterest[]>([]);
  const [loadingPendingInterest, setLoadingPendingInterest] = useState(true);

  useEffect(() => {
    const fetchPendingInterest = async () => {
      if (!contract) {
        console.warn("usePendingInterest: contract not available");
        return;
      }
      try {
        const interestData = await Promise.all(
          TOKENS.map(async (token) => {
            try {
              const amount = await contract.calculateBasicLPRewards(
                token.address
              );
              return { ...token, amount };
            } catch (error) {
              console.warn(`⚠️ No rewards available for ${token.symbol}`);
              return { ...token, amount: "Not Available" };
            }
          })
        );
        setPendingInterest(interestData);
      } catch (error) {
        console.error("Error fetching pending interest:", error);
      } finally {
        setLoadingPendingInterest(false);
      }
    };

    fetchPendingInterest();
  }, [contract]);

  return { pendingInterest, loadingPendingInterest };
};
