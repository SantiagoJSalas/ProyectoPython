import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './screens/main'; // Verifica la ruta correcta
import SignIn from './screens/SignIn'; // Verifica la ruta correcta
import SignUp from './screens/SignUp'; // Verifica la ruta correcta
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
    </ChakraProvider>
    </QueryClientProvider>

  );
}

export default App;
