import { DAppProvider } from "./context/DappContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <DAppProvider>
        <AppRoutes />
      </DAppProvider>
    </>
  );
};

export default App;
