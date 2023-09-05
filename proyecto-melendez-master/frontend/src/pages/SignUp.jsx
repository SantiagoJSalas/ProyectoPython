import axios from 'axios'; // Importa la biblioteca axios para realizar solicitudes HTTP
import {
  TextInput,
  PasswordInput,
  Button,
  Text,
  Flex,
  LoadingOverlay,
  Alert,
  useMantineTheme,
} from '@mantine/core'; // Importa componentes de interfaz de usuario de Mantine
import { identificationCardNumberAtom } from '../context'; // Importa un átomo de Jotai
import { useAtom } from 'jotai'; // Importa la función useAtom de Jotai
import { useDisclosure } from '@mantine/hooks'; // Importa el hook useDisclosure de Mantine
import { useForm } from '@mantine/form'; // Importa el hook useForm de Mantine
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate de react-router-dom
import { useMutation } from '@tanstack/react-query'; // Importa el hook useMutation de react-query
import formatApiUrl from '../utilities/formatApiUrl'; // Importa una función para formatear una URL

// Estilos CSS para la página y el formulario
const styles = {
  pageContainer: {
    // Estilos de diseño para la página
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
  },
  formContainer: {
    // Estilos de diseño para el formulario
    width: 'fit-content',
    height: 'fit-content',
    border: '0.5px solid silver',
    borderRadius: '8px',
    boxShadow:
      '0 15px 15px 5px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: '2rem',
  },
};

// Función para realizar la solicitud de registro
const signUp = async (fields) => {
  const url = formatApiUrl('/people/sign_up');
  await axios.post(url, fields);
};

// Función para validar el número de cédula ingresado en el formulario
const validate_identification_card_number = (identification_card_number) => {
  if (isNaN(Number(identification_card_number))) {
    return 'Ingresa tu número de cédula';
  }

  if (identification_card_number.length !== 9) {
    return 'El número de cédula consiste de nueve dígitos';
  }

  return null;
};

// Componente del formulario de registro
const Form = ({ onError }) => {
  const navigate = useNavigate();
  const [_, setIdentificationCardNumber] = useAtom(
    identificationCardNumberAtom
  );

  // Configuración y estado del formulario usando Mantine useForm
  const form = useForm({
    initialValues: {
      identification_card_number: '',
      name: '',
      first_surname: '',
      second_surname: '',
      address: '',
      email: '',
      password: '',
    },
    validate: {
      identification_card_number: validate_identification_card_number,
      name: (value) => (value === '' ? 'Ingresa tu nombre' : null),
      first_surname: (value) =>
        value === '' ? 'Ingresa tu primer apellido' : null,
      second_surname: (value) =>
        value === '' ? 'Ingresa tu segundo apellido' : null,
      address: (value) => (value === '' ? 'Ingresa tu dirección' : null),
      email: (value) =>
        value === '' ? 'Ingresa un correo electrónico' : null,
      password: (value) =>
        value === '' ? 'Ingresa una contraseña' : null,
    },
  });

  // Función para manejar el éxito del registro
  const handleSuccess = () => {
    setIdentificationCardNumber(form.values.identification_card_number);
    form.reset();
    alert('Registrado con éxito');
    navigate('/content/people');
  };

  // Función para manejar errores durante el registro
  const handleError = (error) => {
    if (error.response.data.message === 'PERSON_ALREADY_EXISTS') {
      onError();
    } else {
      console.log(error);
    }
  };

  // Uso de react-query para la solicitud de registro
  const signUpMutation = useMutation(
    ({ fields }) => signUp(fields),
    {
      onSuccess: handleSuccess,
      onError: handleError,
    }
  );

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    form.validate();

    if (form.isValid()) {
      signUpMutation.mutate({ fields: form.values });
    }
  };

  return (
    <div style={styles.formContainer}>
      <LoadingOverlay visible={signUpMutation.isLoading} />

      <Flex style={{ width: '100%' }}>
        {/* Campo de entrada para el número de cédula */}
        <TextInput
          label="Número de cédula"
          placeholder="Tu número de cédula"
          {...form.getInputProps('identification_card_number')}
          style={{ width: '100%' }}
        />
      </Flex>

      <Flex justify="space-evenly" gap="2rem">
        {/* Campos de entrada para nombre, apellidos, dirección, correo y contraseña */}
        <Flex direction="column" gap="1.5rem">
          <TextInput
            label="Nombre"
            placeholder="Tu nombre"
            {...form.getInputProps('name')}
          />

          <TextInput
            label="Primer apellido"
            placeholder="Tu primer apellido"
            {...form.getInputProps('first_surname')}
          />

          <TextInput
            label="Segundo apellido"
            placeholder="Tu segundo apellido"
            {...form.getInputProps('second_surname')}
          />
        </Flex>

        <Flex direction="column" gap="1.5rem">
          <TextInput
            label="Dirección"
            placeholder="Tu dirección"
            {...form.getInputProps('address')}
          />

          <TextInput
            label="Correo electrónico"
            placeholder="Tu correo electrónico"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            {...form.getInputProps('password')}
            style={{ width: '100%' }}
          />
        </Flex>
      </Flex>

      {/* Botón para enviar el formulario de registro */}
      <Button onClick={handleSubmit} style={{ width: '100%' }}>
        Registrarse
      </Button>
    </div>
  );
};

// Componente principal de la página de registro
export default () => {
  const theme = useMantineTheme();
  const [isAlertOpened, alertHandlers] = useDisclosure(false);
  const navigate = useNavigate();

  return (
    <div style={styles.pageContainer}>
      {/* Título de la página */}
      <Text color={theme.primaryColor} fz={40} fw={700}>
        Registrate
      </Text>

      {/* Renderiza el formulario de registro */}
      <Form onError={alertHandlers.open} />

      {/* Botón para redirigir a la página de inicio de sesión */}
      <Button onClick={() => navigate('/sign-in')}>
        Inicia sesión
      </Button>

      {/* Alerta que se muestra en caso de error */}
      {isAlertOpened ? (
        <Alert
          title="Error"
          color="red"
          onClose={alertHandlers.close}
          withCloseButton
        >
          Ya existe una persona registrada con el número de cédula que ingresaste
        </Alert>
      ) : null}
    </div>
  );
};
