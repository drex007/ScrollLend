import { toUtf8String } from "ethers";

export const extractEthersErrorReason = (error: any): string => {
  if (error.reason) return error.reason;

  if (error.data && typeof error.data === "string") {
    try {
      const reasonHex = error.data.slice(138);
      const decoded = toUtf8String("0x" + reasonHex);
      return decoded || "Transaction reverted.";
    } catch {
      return "Transaction reverted.";
    }
  }

  return error.message || "Transaction reverted.";
};
