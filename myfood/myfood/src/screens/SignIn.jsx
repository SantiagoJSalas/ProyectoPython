import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    try {
      // Supongamos que esta es la petición a tu API.
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (data.success) {
        navigate('/signin');
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  }

  return (
    <Box width="400px" p={4} m="20px auto">
      <VStack spacing={4}>
        <FormControl id="email" onSubmit={handleRegister}>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Email" />
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Password" />
        </FormControl>

        <Button colorScheme="blue" type="submit" onClick={() => navigate('/main')}>
          Sign In
        </Button>

        <Text>
          No tienes una cuenta? 
          <Button 
            colorScheme="teal" 
            variant="link" 
            onClick={() => navigate('/signup')}
          >
            Registrarse
          </Button>
        </Text>
      </VStack>
    </Box>
  );
}

export default SignIn;
