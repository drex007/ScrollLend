import { useState } from "react";
import { parseUnits, Contract } from "ethers";
import { ERC_20 } from "../abis/ERC_20";
import { useWallet } from "../context/WalletConnectProvider";
import { CONTRACT_ADDRESS } from "../utils/LendingBorrowingContract";

export const useDepositCollateral = () => {
  const { contract, signer, account } = useWallet();
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  const depositCollateral = async (
    tokenAddress: string,
    amount: string,
    decimals: number
  ) => {
    if (!contract || !signer || !account) {
      console.error("Contract, signer or account not connected");
      return;
    }

    try {
      setIsDepositing(true);

      // TODO - move to class
      const tokenContract = new Contract(tokenAddress, ERC_20, signer);
      const parsedAmount = parseUnits(amount, decimals);

      // approve
      const approveTx = await tokenContract.approve(
        CONTRACT_ADDRESS,
        parsedAmount
      );
      await approveTx.wait();
      console.log("`approve` completed.");

      await contract.depositCollateral(tokenAddress, amount);
      console.log("`depositCollateral` completed.");
    } catch (error) {
      console.error("Error in `depositCollateral()`:", error);
    } finally {
      setIsDepositing(false);
    }
  };

  return { depositCollateral, isDepositing };
};
