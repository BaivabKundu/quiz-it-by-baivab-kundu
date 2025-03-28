import React from "react";

import Main from "components/Main";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "reactquery";
import queryClient from "utils/queryClient";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <ToastContainer />
      <Main />
    </Router>
  </QueryClientProvider>
);

export default App;
