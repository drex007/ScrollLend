import "./config/WalletConnectConfig";
import { WalletContextProvider } from "./context/WalletConnectProvider";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <WalletContextProvider>
        <AppRoutes />
      </WalletContextProvider>
    </>
  );
};

export default App;
