import { Contract, formatUnits, parseUnits, Signer } from "ethers";
import { ILendingBorrowingContract } from "../application/contracts/ILendingBorrowingContract";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./../utils/LendingBorrowingContract";
import { BrowserProvider } from "ethers";

export class EthersLendingBorrowingContract implements ILendingBorrowingContract {
  private contract: Contract;

  constructor(provider: BrowserProvider | Signer) {
    this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }

  async depositCollateral(token: string, amount: string): Promise<void> {
    const tx = await this.contract.depositCollateral(token, parseUnits(amount, 18));
    await tx.wait();
  }

  async borrowAsset(token: string, amount: string, repaymentTimestamp: number): Promise<void> {
    const tx = await this.contract.borrowAsset(token, parseUnits(amount, 18), repaymentTimestamp);
    await tx.wait();
  }

  async withdrawCollateralDeposited(token: string): Promise<void> {
    const tx = await this.contract.withdrawCollateralDeposited(token);
    await tx.wait();
  }

  async repayLoan(token: string, amount: string): Promise<void> {
    const tx = await this.contract.repayLoan(token, parseUnits(amount, 18));
    await tx.wait();
  }

  async liquidatePosition(userToLiquidate: string, borrowedAsset: string, collateralAsset: string, amount: string): Promise<void> {
    const tx = await this.contract.liquidatePosition(userToLiquidate, borrowedAsset, collateralAsset, parseUnits(amount, 18));
    await tx.wait();
  }

  // 🔹 Consultas de usuario
  async getUserTotalBorrowed(user: string): Promise<string> {
    const amount = await this.contract.userTotalBorrowedAssetInUsd(user);
    return formatUnits(amount, 18);
  }

  async getUserTotalCollateral(user: string): Promise<string> {
    const amount = await this.contract.userTotalCollateralAssetInUsd(user);
    return formatUnits(amount, 18);
  }

  async allowedBorrowingAmount(user: string): Promise<string> {
    const amount = await this.contract.allowedBorrowingAmount(user);
    return formatUnits(amount, 18);
  }

  async checkForBrokenHealthFactor(user: string): Promise<boolean> {
    try {
      await this.contract.checkForBrokenHealthFactor(user);
      return true;
    } catch {
      return false;
    }
  }

  async userHealthFactor(user: string): Promise<string> {
    try {
      console.log("Llamando a userHealthFactor con:", user);

      // Usamos provider.call() directamente para evitar problemas con ethers v5.7
      const data = await this.contract.provider.call({
        to: this.contract.address,
        data: this.contract.interface.encodeFunctionData("userHealthFactor", [user]),
      });

      const decoded = this.contract.interface.decodeFunctionResult("userHealthFactor", data);
      return formatUnits(decoded[0], 18);
    } catch (error) {
      console.error("Error en userHealthFactor:", error);
      return "0"; // Valor seguro en caso de error
    }
  }


  // 🔹 Gestión de liquidez
  async addLiquidity(token: string, amount: string, withdrawalTime: number): Promise<void> {
    const tx = await this.contract.addLiquidity(token, parseUnits(amount, 18), withdrawalTime);
    await tx.wait();
  }

  async withdrawFromLiquidityPool(token: string): Promise<void> {
    const tx = await this.contract.withdrawFromLiquidityPool(token);
    await tx.wait();
  }

  async totalLiquidity(token: string): Promise<string> {
    const amount = await this.contract.totalLiquidity(token);
    return formatUnits(amount, 18);
  }

  async calculateBasicLPRewards(token: string): Promise<string> {
    const rewards = await this.contract.calculateBasicLPRewards(token);
    return formatUnits(rewards, 18);
  }

  // 🔹 Rebalanceo y tesorería
  async rebalancePortfolio(swapFrom: string, swapTo: string, amount: string): Promise<void> {
    const tx = await this.contract.rebalancePortfolio(swapFrom, swapTo, parseUnits(amount, 18));
    await tx.wait();
  }

  async treasury(token: string): Promise<string> {
    const amount = await this.contract.treasury(token);
    return formatUnits(amount, 18);
  }

  // 🔹 Información general
  async getTotalValueLocked(token: string): Promise<string> {
    const value = await this.contract.tvl(token);
    return formatUnits(value, 18);
  }

  async priceFeeds(token: string): Promise<string> {
    return await this.contract.priceFeeds(token);
  }

  // 🔹 Gestión de propiedad
  async transferOwnership(newOwner: string): Promise<void> {
    const tx = await this.contract.transferOwnership(newOwner);
    await tx.wait();
  }

  async acceptOwnership(): Promise<void> {
    const tx = await this.contract.acceptOwnership();
    await tx.wait();
  }
}
