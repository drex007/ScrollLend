import { useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";
import { extractEthersErrorReason } from "../utils/EthersErrorReason";

export const useBorrowAsset = (onSuccess?: () => void) => {
  const { contract } = useWallet();
  const [isBorrowing, setIsBorrowing] = useState<boolean>(false);
  const [errorBorrow, setErrorBorrow] = useState<string | null>(null);

  const borrowAsset = async (token: string, amount: string) => {
    setErrorBorrow(null);

    if (!contract) {
      setErrorBorrow("Smart contract not available");
      return;
    }

    setIsBorrowing(true);
    try {
      const repaymentTimestamp = Math.floor(Date.now() / 1000) + 2592000;
      await contract.borrowAsset(token, amount, repaymentTimestamp);

      if (onSuccess) onSuccess();
    } catch (error) {
      const reason = extractEthersErrorReason(error);
      setErrorBorrow(reason);
      console.error("Borrow Asset Error:", reason);
    } finally {
      setIsBorrowing(false);
    }
  };

  return { borrowAsset, isBorrowing, errorBorrow };
};
