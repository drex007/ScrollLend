import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";

export const useTotalValueLockedUSD = () => {
  const { contract } = useWallet();
  const [totalValueLockedUSD, setTotalValueLockedUSD] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTVL = async () => {
      if (!contract) return;

      setLoading(true);
      try {
        const tvl = await contract.getTotalValueLocked();
        setTotalValueLockedUSD(tvl);
      } catch (error) {
        console.error("Error fetching Total Value Locked:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVL();
  }, [contract]);

  return { totalValueLockedUSD, loading };
};
