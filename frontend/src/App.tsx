import { DAppContext } from "./context/DappContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <DAppContext>
        <AppRoutes />
      </DAppContext>
    </>
  );
};

export default App;
