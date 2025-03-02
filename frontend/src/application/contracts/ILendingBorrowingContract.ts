import { Events } from "../../dto/events";

export interface ILendingBorrowingContract {
  // Gestión de colateral y préstamos
  depositCollateral(token: string, amount: string, destinationChainSelector: number, destinationContract: string): Promise<void>;
  borrowAsset(token: string, amount: string, repaymentTimestamp: number, destinationChainSelector: number): Promise<void>;
  withdrawCollateralDeposited(token: string, destinationChainSelector: number, destinationContract: string): Promise<void>;
  collateralDeposited(user: string, token: string): Promise<string>;
  repayLoan(token: string, amount: string): Promise<void>;
  liquidatePosition(userToLiquidate: string, borrowedAsset: string, collateralAsset: string, amount: string): Promise<void>;
  getAssetValueInUSD(token: string, amount: string): Promise<string>;

  // Consultas de usuario
  getUserTotalBorrowed(user: string): Promise<string>;
  getUserTotalCollateral(user: string): Promise<string>;
  allowedBorrowingAmount(user: string): Promise<string>;
  checkForBrokenHealthFactor(user: string): Promise<boolean>;
  userHealthFactor(user: string): Promise<string>;

  // Gestión de liquidez
  addLiquidity(token: string, amount: string, withdrawalTime: number): Promise<void>;
  withdrawFromLiquidityPool(token: string): Promise<void>;
  totalLiquidity(token: string): Promise<string>;
  calculateBasicLPRewards(token: string): Promise<string>;

  getLiquidityPool(user: string, token: string): Promise<{
    amount: string;
    withdrawalTime: number;
    addedAt: number;
  }>;

  // Rebalanceo y tesorería
  rebalancePortfolio(swapFrom: string, swapTo: string, amount: string): Promise<void>;
  treasury(token: string): Promise<string>;

  // Información general
  getTotalValueLocked(): Promise<string>;
  getTotalValueLockedByToken(token: string): Promise<string>;
  priceFeeds(token: string): Promise<string>;

  // Gestión de propiedad
  transferOwnership(newOwner: string): Promise<void>;
  acceptOwnership(): Promise<void>;

  // filtros
  queryFilterEventByAccount(acount: string, eventName: string, fromBlock: number, toBlock: number | string): Promise<Events[]>
  getLastBlock(): Promise<number>
}
