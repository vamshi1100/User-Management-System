import React from "react";

import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";

import Admin from "./admin/Admin";
import Admindisplay from "./admin/Admindisplay";
import Userdisplay from "./admin/Userdisplay";
import Edit from "./admin/Edit";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/admindisplay" element={<Admindisplay />} />
          <Route path="/Userdisplay" element={<Userdisplay />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/logout" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
