import { Box, Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";

const SignIn = () => {
  return (
    <Box width="400px" p={4} m="20px auto">
      <VStack spacing={4}>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Email" />
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Password" />
        </FormControl>

        <Button colorScheme="blue" type="submit">
          Sign In
        </Button>
      </VStack>
    </Box>
  );
}

export default SignIn;
