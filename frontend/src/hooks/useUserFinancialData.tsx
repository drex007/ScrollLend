import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";

export const useUserFinancialData = (refreshKey?: number) => {
  const { contract, account } = useWallet();
  const [borrowedAmount, setBorrowedAmount] = useState<string>("0");
  const [collateralAmount, setCollateralAmount] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      if (!contract || !account) {
        console.warn("useUserFinancialData: Contract or account not available");
        return;
      }

      setLoading(true);
      try {
        const borrowed = await contract.getUserTotalBorrowed(account);
        const collateral = await contract.getUserTotalCollateral(account);

        setBorrowedAmount(borrowed);
        setCollateralAmount(collateral);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [contract, account, refreshKey]);

  return { borrowedAmount, collateralAmount, loading };
};
