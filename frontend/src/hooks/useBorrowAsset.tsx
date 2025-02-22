import { useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";

export const useBorrowAsset = () => {
  const { contract } = useWallet();
  const [isBorrowing, setIsBorrowing] = useState<boolean>(false);

  const borrowAsset = async (token: string, amount: string) => {
    if (!contract) {
      console.warn("useBorrowAsset: Contract not available");
      return;
    }

    setIsBorrowing(true);
    try {
      const repaymentTimestamp = Math.floor(Date.now() / 1000) + 2592000; // +30 días
      await contract.borrowAsset(token, amount, repaymentTimestamp);
      console.log("Loan request successful!");
    } catch (error) {
      console.error("Error requesting loan:", error);
    } finally {
      setIsBorrowing(false);
    }
  };

  return { borrowAsset, isBorrowing };
};
