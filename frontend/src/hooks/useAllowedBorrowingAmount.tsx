import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { useWallet } from "../context/WalletConnectProvider";

export const useAllowedBorrowingAmount = () => {
  const { contract, account } = useWallet();
  const [allowedAmount, setAllowedAmount] = useState<string | null>(null);
  const [loadingAllowedAmount, setLoadingAllowedAmount] =
    useState<boolean>(true);

  useEffect(() => {
    const fetchAllowedAmount = async () => {
      if (!contract || !account) {
        console.warn(
          "useAllowedBorrowingAmount: Contract or account not available"
        );
        return;
      }

      setLoadingAllowedAmount(true);

      try {
        const amount = await contract.allowedBorrowingAmount(account);
        setAllowedAmount(formatUnits(amount, 18));
      } catch (error) {
        console.error("Error fetching allowed borrowing amount:", error);
      } finally {
        setLoadingAllowedAmount(false);
      }
    };

    fetchAllowedAmount();
  }, [contract, account]);

  return { allowedAmount, loadingAllowedAmount };
};
