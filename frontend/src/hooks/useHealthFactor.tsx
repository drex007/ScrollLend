import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";

export const useHealthFactor = () => {
  const { contract, account } = useWallet();
  const [healthFactor, setHealthFactor] = useState<string | null>(null);

  useEffect(() => {
    if (!contract || !account) {
      console.log("useHealthFactor: Esperando valores correctos...");
      return;
    }

    const fetchHealthFactor = async () => {
      console.log("useHealthFactor: Ejecutando consulta...");
      try {
        const factor = await contract.userHealthFactor(account);
        setHealthFactor(factor);
      } catch (error) {
        console.error("Error fetching health factor:", error);
      }
    };

    fetchHealthFactor();
  }, [contract, account]);

  return { healthFactor };
};
