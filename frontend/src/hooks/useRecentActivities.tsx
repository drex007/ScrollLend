import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletConnectProvider";
import { Events } from "../dto/events";

interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
}

interface PastActivity {
  date: number;
  action: string;
  amount: string;
  tokenInfo: TokenInfo;
}

export const usePastActivities = () => {
  const { provider, account, contract } = useWallet();
  const [activities, setActivities] = useState<PastActivity[]>([]);
  const [loadingPastActivities, setLoadingPastActivities] =
    useState<boolean>(true);

  useEffect(() => {
    if (!provider || !account || !contract) return;

    const fetchPastEvents = async () => {
      const eventNames: string[] = Object.keys(EVENT_ACTION_MAP);

      const lastBlock = await contract.getLastBlock();
      const allEvents: Events[][] = await Promise.all(
        eventNames.map((eventName) =>
          contract.queryFilterEventByAccount(
            account,
            eventName,
            lastBlock - 100000,
            "latest"
          )
        )
      );

      const pastEvents: PastActivity[] = allEvents
        .flat()
        .map((event) => {
          const action: string = EVENT_ACTION_MAP[event.eventName] || "Unknown";
          const tokenInfo: TokenInfo = TOKEN_MAP[event.token];
          return {
            date: event.timeStamp,
            action,
            tokenInfo,
            amount: event.amount,
          };
        })
        .sort((a, b) => (a.date < b.date ? 1 : -1));
      console.log("pastEvents", pastEvents);
      setActivities(pastEvents);
      setLoadingPastActivities(false);
    };

    fetchPastEvents();
  }, [provider, account]);

  return { activities, loadingPastActivities };
};

const EVENT_ACTION_MAP: Record<string, string> = {
  LendingBorrowingContract__BorrowSuccessful: "Borrow",
  LendingBorrowingContract_LoanRepayed: "Repay",
  LendingBorrowingContract_CollateralWithdrawn: "Collateral Withdraw",
  LendingBorrowingContract_LiquidityDepositSuccessful: "Liquidity Deposit",
  LendingBorrowingContract_LiquidityWithdrawn: "Liquidity Withdraw",
  LendingBorrowingContract__DepositSuccessful: "Collateral Deposit",
};

const TOKEN_MAP: Record<string, TokenInfo> = {
  "0xC27Bb2572977Af7e35FfFe2F55c9b83C2e8084c4": {
    symbol: "sUSDT",
    address: "0xC27Bb2572977Af7e35FfFe2F55c9b83C2e8084c4",
    decimals: 18,
  },
  "0x281D5a078fEcc2D113b5FD1ADA814C75F9397bAa": {
    symbol: "wBTC",
    address: "0x281D5a078fEcc2D113b5FD1ADA814C75F9397bAa",
    decimals: 18,
  },
  "0x08Fe95f3E49C2d5231Eef694C2087a7a550D7593": {
    symbol: "wETH",
    address: "0x08Fe95f3E49C2d5231Eef694C2087a7a550D7593",
    decimals: 18,
  },
};
