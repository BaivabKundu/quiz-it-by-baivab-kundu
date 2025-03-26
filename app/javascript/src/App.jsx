import React from "react";

import Main from "components/Main";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "reactquery";
import queryClient from "utils/queryClient";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <Main />
    </Router>
  </QueryClientProvider>
);

export default App;
