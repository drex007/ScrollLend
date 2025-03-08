import { useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";
import { Contract } from "ethers/contract";
import { ERC_20 } from "../abis/ERC_20";
import { parseUnits } from "ethers/utils";
import { CONTRACT_ADDRESS } from "../utils/LendingBorrowingContract";

export const useAddLiquidity = (onSuccess?: () => void) => {
  const { contract, signer } = useWallet();
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);

  const addLiquidity = async (
    token: string,
    amount: string,
    lockPeriod: number
  ) => {
    if (!contract || !signer) {
      console.error("Contract, signer or account not connected");
      return;
    }

    try {
      setIsAddingLiquidity(true);

      const tokenContract = new Contract(token, ERC_20, signer);
      const parsedAmount = parseUnits(amount, 18);

      // Approve
      const approveTx = await tokenContract.approve(
        CONTRACT_ADDRESS,
        parsedAmount
      );
      await approveTx.wait();

      // Deposit Liquidity
      const withdrawalTime =
        Math.floor(Date.now() / 1000) + lockPeriod * 24 * 60 * 60;
      await contract.addLiquidity(token, amount, withdrawalTime);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding liquidity:", error);
    } finally {
      setIsAddingLiquidity(false);
    }
  };

  return { addLiquidity, isAddingLiquidity };
};
