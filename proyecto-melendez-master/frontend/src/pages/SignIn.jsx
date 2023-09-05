// Importación de bibliotecas y componentes necesarios
import axios from 'axios'
import {
  TextInput,
  PasswordInput,
  Button,
  Text,
  LoadingOverlay,
  Alert,
  useMantineTheme
} from '@mantine/core'
import { identificationCardNumberAtom } from '../context'
import { useAtom } from 'jotai'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import formatApiUrl from '../utilities/formatApiUrl'

// Estilos en objetos JavaScript
const styles = {
  pageContainer: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem"
  },
  formContainer: {
    width: "fit-content",
    height: "fit-content",
    border: "0.5px solid silver",
    borderRadius: "8px",
    boxShadow: "0 15px 15px 5px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: "2rem"
  }
}

// Función para realizar la solicitud de inicio de sesión
const signIn = async (fields) => {
  const url = formatApiUrl("/people/sign_in")

  // Realiza una solicitud POST a la URL de inicio de sesión y devuelve los datos de la respuesta
  const { data } = await axios.post(url, fields)

  return data
}

// Componente del formulario de inicio de sesión
const Form = ({ onError }) => {
  const navigate = useNavigate()
  const [_, setIdentificationCardNumber] = useAtom(identificationCardNumberAtom)
  
  // Configuración y gestión del formulario con el hook useForm de Mantine
  const form = useForm({
    initialValues: {
      email: "",
      password: ""
    },
    validate: {
      // Validación de campos
      email: (value) => value === "" ? "Ingresa tu correo electrónico" : null,
      password: (value) => value === "" ? "Ingresa tu contraseña" : null,
    }
  })

  // Función que se ejecuta cuando el inicio de sesión es exitoso
  const handleSuccess = (person) => {
    form.reset()

    // Almacena el número de identificación en el estado global
    setIdentificationCardNumber(person.identification_card_number)

    // Muestra un mensaje de éxito y navega a una página de contenido
    alert("Se inició sesión con éxito")

    navigate("/content/people")
  }

  // Función que se ejecuta cuando hay un error en el inicio de sesión
  const handleError = (error) => {
    if (error.response.data.message === "PERSON_DOES_NOT_EXIST") {
      onError()
    } else {
      console.log(error)
    }
  }

  // Hook useMutation de React Query para gestionar la mutación de inicio de sesión
  const signInMutation = useMutation(
    ({ fields }) => signIn(fields),
    {
      onSuccess: handleSuccess,
      onError: handleError
    }
  )

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = () => {
    form.validate()

    if (form.isValid()) {
      signInMutation.mutate({ fields: form.values })
    }
  }

  return (
    <div style={styles.formContainer}>
      {/* Muestra una superposición de carga si la mutación está en progreso */}
      <LoadingOverlay visible={signInMutation.isLoading} />
      
      {/* Campo de entrada de texto para el correo electrónico */}
      <TextInput
        label="Correo electrónico"
        placeholder="Tu correo electrónico"
        {...form.getInputProps("email")}
        style={{ width: "100%" }}
      />

      {/* Campo de entrada de contraseña */}
      <PasswordInput
        label="Contraseña"
        placeholder="Tu contraseña"
        {...form.getInputProps("password")}
        style={{ width: "100%" }}
      />

      {/* Botón para enviar el formulario */}
      <Button
        onClick={handleSubmit}
        style={{ width: "100%" }}
      >
        Iniciar sesión
      </Button>
    </div>
  )
}

// Componente principal
export default () => {
  const theme = useMantineTheme()
  const [isAlertOpened, alertHandlers] = useDisclosure(false)
  const navigate = useNavigate()

  return (
    <div style={styles.pageContainer}>
      {/* Título de la página */}
      <Text
        color={theme.primaryColor}
        fz={40}
        fw={700}
      >
        Inicia sesión
      </Text>

      {/* Renderiza el formulario de inicio de sesión */}
      <Form onError={alertHandlers.open} />

      {/* Botón para navegar a la página de registro */}
      <Button onClick={() => navigate("/sign-up")}>
        Registrate
      </Button>

      {/* Muestra una alerta en caso de error en el inicio de sesión */}
      {
        isAlertOpened ?
        (
          <Alert
            title="Error"
            color="red"
            onClose={alertHandlers.close}
            withCloseButton
          >
            Correo electrónico o contraseña incorrectos
          </Alert>
        ) :
        null
      }
    </div>
  )
}
