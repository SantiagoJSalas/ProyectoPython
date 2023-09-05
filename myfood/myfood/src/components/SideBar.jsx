import { useState } from 'react';
import { Box, Button, Input, VStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';

const Sidebar = ({ families, onSelect }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newFamilyName, setNewFamilyName] = useState('');
    const [localFamilies, setLocalFamilies] = useState(families);

    const handleAddFamily = () => {
        if (newFamilyName.trim()) {
            const newFamily = { id: Date.now(), name: newFamilyName };
            setLocalFamilies([...localFamilies, newFamily]);
            setNewFamilyName('');
            onClose();

            // En este punto, también podrías hacer una petición POST a tu API para guardar la nueva familia.
        }
    };

    return (
        <Box width="250px" padding="20px" borderRight="1px solid gray">
            <VStack spacing={3} align="start">
                {localFamilies.map(family => (
                    <Button key={family.id} variant="ghost" onClick={() => onSelect(family)}>
                        {family.name}
                    </Button>
                ))}
                <Button onClick={onOpen}>
                    Agregar Familia
                </Button>
            </VStack>

            {/* Modal para agregar nueva familia */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Agregar nueva familia</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input 
                            placeholder="Nombre de la familia" 
                            value={newFamilyName}
                            onChange={e => setNewFamilyName(e.target.value)}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddFamily}>
                            Agregar
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Sidebar;
