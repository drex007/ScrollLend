import { useState } from "react";
import { useDapp } from "../context/DappContext";

export const useWithdrawCollateral = () => {
  const { contract, account } = useDapp();
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  const withdrawCollateral = async (tokenAddress: string) => {
    if (!contract || !account) {
      console.error("Contract or account not aviable");
      return;
    }

    try {
      setIsWithdrawing(true);

      const withdrawTx = await contract.withdrawCollateralDeposited(
        tokenAddress
      );
      await withdrawTx.wait();
      console.log("`withdrawCollateralDeposited()` success");
    } catch (error) {
      console.error("Error in `withdrawCollateralDeposited()`:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return { withdrawCollateral, isWithdrawing };
};
