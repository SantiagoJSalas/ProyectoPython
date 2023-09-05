import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/login'; // Verifica la ruta correcta
import Main from './screens/main'; // Verifica la ruta correcta

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={Login} />
        <Route path="/main" component={Main} />
      </Routes>
    </Router>

  );
}

export default App;
