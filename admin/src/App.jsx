// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddItems from "./pages/AddItems";
import ListItems from "./pages/ListItems";
import Orders from "./pages/Orders";
import Sidebar from "./components/Sidebar";
import Header from "./components/common/Header";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 pt-16  ml-64 transition-all duration-300">
            <Routes>
              <Route path="/add-items" element={<AddItems />} />
              <Route path="/list-items" element={<ListItems />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
