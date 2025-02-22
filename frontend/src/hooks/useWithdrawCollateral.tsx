import { useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";

export const useWithdrawCollateral = () => {
  const { contract, account } = useWallet();
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  const withdrawCollateral = async (tokenAddress: string) => {
    if (!contract || !account) {
      console.error("Contract or account not aviable");
      return;
    }

    try {
      setIsWithdrawing(true);

      await contract.withdrawCollateralDeposited(tokenAddress);
      console.log("`withdrawCollateralDeposited()` success");
    } catch (error) {
      console.error("Error in `withdrawCollateralDeposited()`:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return { withdrawCollateral, isWithdrawing };
};
