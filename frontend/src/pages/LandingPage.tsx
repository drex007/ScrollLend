import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();

  useEffect(() => {
    if (isConnected) {
      navigate("/app");
    }
  }, [isConnected]);

  const connectAndGoToApp = async () => {
    if (isConnected) {
      navigate("/app");
    } else {
      open();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-200">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          ScrollLend
        </h1>
        <h2 className="text-3xl font-extrabold ">
          Borrowing & Lending on Scroll
        </h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          A secure and efficient way to lend, borrow, and optimize your assets
          with AI-driven automation.
        </p>
        <button
          onClick={() => connectAndGoToApp()}
          className="mt-6 btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Go to App
        </button>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto text-center py-16 px-6">
        <h2 className="text-3xl font-semibold text-gray-100">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-green-400">Lending</h3>
            <p className="text-gray-400 mt-2">
              Earn passive income by supplying liquidity and earning rewards.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-yellow-400">Borrowing</h3>
            <p className="text-gray-400 mt-2">
              Secure low-cost loans using your collateral with flexible terms.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-blue-400">
              Collateral Management
            </h3>
            <p className="text-gray-400 mt-2">
              Deposit and withdraw collateral to maintain your borrowing power.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-purple-400">
              AI-Driven Rebalancing
            </h3>
            <p className="text-gray-400 mt-2">
              Optimize your asset allocation automatically with AI.
            </p>
          </div>
        </div>
      </section>

      {/* Scroll Blockchain Benefits */}
      <section className="max-w-4xl mx-auto text-center py-16 px-6">
        <h2 className="text-3xl font-semibold text-gray-100">
          Powered by Scroll Blockchain
        </h2>
        <p className="text-gray-400 mt-4">
          Scroll combines <b>Ethereum security</b> with{" "}
          <b>low fees and scalability</b>, making it the ideal blockchain for
          our DeFi platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-blue-400">
              Ethereum Security
            </h3>
            <p className="text-gray-400 mt-2">
              Built with zk-Rollups, ensuring trustless and verifiable
              transactions.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-green-400">Low Fees</h3>
            <p className="text-gray-400 mt-2">
              Optimized gas costs, reducing transaction expenses for users.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-yellow-400">
              Scalability
            </h3>
            <p className="text-gray-400 mt-2">
              Fast transaction speeds without compromising decentralization.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400">
        <p>ScrollLend DeFi App. Built on Scroll with ❤️</p>
      </footer>
    </div>
  );
};
