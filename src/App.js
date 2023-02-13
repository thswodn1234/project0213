import "./App.css";
import { Routes, Route } from "react-router-dom";
import SelectMain from "./Page/Select/SelectMain";
import Log from "./Page/Log/Log";
import Order from "./Page/Order/OrderMain";
import OrderList from "./Page/Order/OrderList";
import Navi from "./component/Navi";

function App() {
  return (
    <>
      <header>
        <Navi />
        <div className="left-nav"></div>

        <Routes>
          <Route path="/" element={<SelectMain />} />
          <Route path="/log" element={<Log />} />
          <Route path="/Order" element={<OrderList />} />
          <Route path="/OrderMain" element={<Order />} />
        </Routes>
      </header>
    </>
  );
}

export default App;
