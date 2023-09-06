import { useState, useEffect } from 'react';
import { Box, Grid, Flex, Heading, Text, Button, Input, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import formatURL from "../utilities/apiFormat";
import axios from 'axios';

const Main = () => {
    const [families, setFamilies] = useState([
        { id: 1, name: 'Familia López' },
        { id: 2, name: 'Familia Pérez' }
    ]);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [products, setProducts] = useState([]);
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newProductName, setNewProductName] = useState('');
    const [newProductQuantity, setNewProductQuantity] = useState('');
    useEffect(() => {
        // Obtener las familias del servidor al cargar el componente
        const fetchFamilies = async () => {
            try {
                const response = await axios.get("http://localhost:8000/families/");
                console.log(response.data);
                const transformedData = response.data.map(item => {
                    return {
                        id: item.id,
                        name: item.name
                    }
                });
                console.log(transformedData);
                setFamilies(transformedData);
            } catch (error) {
                console.error("Error fetching families:", error);
            }
        };

        fetchFamilies();
    }, []);
    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(formatURL(`products/${productId}`));
            setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        } catch (error) {
            console.error(`Error deleting product ${productId}:`, error);
        }
    };
    const handleAddProduct = async () => {
        if (newProductName.trim() && newProductQuantity) {
            try {
                const productData = {
                    id: "1",
                    name: newProductName,
                    quantity: parseInt(newProductQuantity, 10), // Convert to integer
                    family_id: selectedFamily.id // Change "familyId" to "family_id"
                };
    
                const response = await axios.post(formatURL('products/'), productData);
                const newProduct = response.data;
    
                setProducts(prevProducts => [...prevProducts, newProduct]);
                setNewProductName('');
                setNewProductQuantity('');
                onClose();
            } catch (error) {
                console.error("Error adding product:", error);
            }
        }
    };
    

    const getProductsForFamily = async (familyId) => {
        try {
            const response = await axios.get(formatURL(`products/families/${familyId}/products`));
            return response.data;
        } catch (error) {
            console.error(`Error fetching products for family ${familyId}:`, error);
            return [];
        }
    }

    const handleFamilySelect = async (family) => {
        setSelectedFamily(family);
        const familyProducts = await getProductsForFamily(family.id); // agrega 'await' aquí
        setProducts(familyProducts);
    }
    

    const handleIncreaseQuantity = (productId) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId
                    ? { ...product, quantity: parseInt(product.quantity) + 1 }
                    : product
            )
        );
    };

    const handleDecreaseQuantity = (productId) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId && product.quantity > 0
                    ? { ...product, quantity: product.quantity - 1 }
                    : product
            )
        );
    };

    return (
        <Flex>
            <Sidebar families={families} onSelect={handleFamilySelect} />
            <Box flex="1" overflowY="auto">
                {selectedFamily && (
                    <Box padding="20px">
                        <Heading marginBottom="20px">
                            Productos de {selectedFamily.name}
                            <Button size="sm" marginLeft="10px" onClick={onOpen}>
                                Agregar Producto
                            </Button>
                        </Heading>
                        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                            {products.map(product => (
                                <Box key={product.id} p={5} shadow="md" borderWidth="1px">
                                    <Heading fontSize="xl">{product.name}</Heading>
                                    <Flex justifyContent="space-between" mt={4}>
                                        <Text>Cantidad: {product.quantity}</Text>
                                        <Box>
                                            <Button size="xs" onClick={() => handleIncreaseQuantity(product.id)}>+</Button>
                                            <Button size="xs" onClick={() => handleDecreaseQuantity(product.id)}>-</Button>
                                            <Button size="xs" colorScheme="red" onClick={() => handleDeleteProduct(product.id)}>Eliminar</Button>
                                        </Box>
                                    </Flex>
                                </Box>
                            ))}
                        </Grid>
                    </Box>
                )}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Agregar nuevo producto</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Input 
                                placeholder="Nombre del producto" 
                                value={newProductName}
                                onChange={e => setNewProductName(e.target.value)}
                                marginBottom="10px"
                            />
                            <Input 
                                placeholder="Cantidad" 
                                value={newProductQuantity}
                                onChange={e => setNewProductQuantity(e.target.value)}
                                type="number"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleAddProduct}>
                                Agregar
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </Flex>
    );
}

export default Main;
