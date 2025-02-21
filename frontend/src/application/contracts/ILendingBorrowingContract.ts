export interface ILendingBorrowingContract {
  // Gestión de colateral y préstamos
  depositCollateral(token: string, amount: string, destinationChainSelector: number, destinationContract: string): Promise<void>;
  borrowAsset(token: string, amount: string, repaymentTimestamp: number, destinationChainSelector: number): Promise<void>;
  withdrawCollateralDeposited(token: string, destinationChainSelector: number, destinationContract: string): Promise<void>;
  repayLoan(token: string, amount: string): Promise<void>;
  liquidatePosition(userToLiquidate: string, borrowedAsset: string, collateralAsset: string, amount: string): Promise<void>;

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

  // Rebalanceo y tesorería
  rebalancePortfolio(swapFrom: string, swapTo: string, amount: string): Promise<void>;
  treasury(token: string): Promise<string>;

  // Información general
  getTotalValueLocked(token: string): Promise<string>;
  priceFeeds(token: string): Promise<string>;

  // Gestión de propiedad
  transferOwnership(newOwner: string): Promise<void>;
  acceptOwnership(): Promise<void>;
}
