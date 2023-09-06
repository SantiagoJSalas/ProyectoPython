import { Box, Button, FormControl, FormLabel, Input, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <Box width="400px" p={4} m="20px auto">
      <VStack spacing={4}>
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input type="text" placeholder="Username" />
        </FormControl>

        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Email" />
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Password" />
        </FormControl>

        <FormControl id="confirm-password">
          <FormLabel>Confirm Password</FormLabel>
          <Input type="password" placeholder="Confirm Password" />
        </FormControl>

        <Button colorScheme="teal" type="submit" onClick={() => navigate('/main')}>
          Sign Up
        </Button>
        <Text>
          Ya tienes una cuenta? 
          <Button 
            colorScheme="teal" 
            variant="link" 
            onClick={() => navigate('/')}
          >
            Inicia Sesion
          </Button>
        </Text>
      </VStack>
    </Box>
  );
}

export default SignUp;
