import { useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";
import { Contract } from "ethers/contract";
import { ERC_20 } from "../abis/ERC_20";
import { parseUnits } from "ethers/utils";
import { CONTRACT_ADDRESS } from "../utils/LendingBorrowingContract";

export const useAddLiquidity = () => {
  const { contract, signer } = useWallet();
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);

      // TODO - move to class
      const tokenContract = new Contract(token, ERC_20, signer);
      const parsedAmount = parseUnits(amount, 18);

      // approve
      const approveTx = await tokenContract.approve(
        CONTRACT_ADDRESS,
        parsedAmount
      );
      await approveTx.wait();
      console.log("`approve` completed.");

      const withdrawalTime =
        Math.floor(Date.now() / 1000) + lockPeriod * 24 * 60 * 60;

      await contract.addLiquidity(token, amount, withdrawalTime);
    } catch (err: any) {
      console.error("Error adding liquidity:", err);
      setError(err.message || "Failed to add liquidity");
    } finally {
      setIsAddingLiquidity(false);
    }
  };

  return { addLiquidity, isAddingLiquidity, error };
};
