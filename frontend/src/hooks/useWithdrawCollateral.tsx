import { useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";
import { extractEthersErrorReason } from "../utils/EthersErrorReason";

export const useWithdrawCollateral = (
  onSuccess?: () => void,
  onError?: (errorMessage: string) => void
) => {
  const { contract, account } = useWallet();
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  const withdrawCollateral = async (tokenAddress: string) => {
    if (!contract || !account) {
      console.error("Contract or account not available");
      return;
    }

    try {
      setIsWithdrawing(true);

      await contract.withdrawCollateralDeposited(tokenAddress);
      console.log("`withdrawCollateralDeposited()` success");

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error in `withdrawCollateralDeposited()`:", error);

      const errorMsg =
        extractEthersErrorReason(error) || "Unknown error occurred";

      if (onError) onError(errorMsg);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return {
    withdrawCollateral,
    isWithdrawing,
  };
};
