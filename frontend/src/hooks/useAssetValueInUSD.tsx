import { useState } from "react";
import { parseUnits, formatUnits } from "ethers";
import { useWallet } from "../context/WalletConnectProvider";

export const useAssetValueInUSD = () => {
  const { contract } = useWallet();
  const [loadingValueInUSD, setLoadingValueInUSD] = useState<boolean>(false);

  const getAssetValue = async (token: string, amount: string) => {
    if (!contract) {
      console.warn("useAssetValueInUSD: Contract not available");
      return null;
    }

    setLoadingValueInUSD(true);

    try {
      const valueInUSD = await contract.getAssetValueInUSD(
        token,
        parseUnits(amount, 18)
      );
      return formatUnits(valueInUSD, 18);
    } catch (error) {
      console.error("Error fetching asset value in USD:", error);
      return null;
    } finally {
      setLoadingValueInUSD(false);
    }
  };

  return { getAssetValue, loadingValueInUSD };
};
