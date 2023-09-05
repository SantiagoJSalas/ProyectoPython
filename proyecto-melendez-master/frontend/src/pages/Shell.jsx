// Importación de bibliotecas y componentes necesarios
import axios from 'axios'
import {
  AppShell,
  Navbar,
  NavLink,
  Header,
  Flex,
  Divider,
  Text,
  LoadingOverlay,
  useMantineTheme
} from '@mantine/core'
import { identificationCardNumberAtom } from '../context'
import { useAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useNavigate } from 'react-router-dom'
import { BsFillPersonFill } from 'react-icons/bs'
import { BiSolidHome } from 'react-icons/bi'
import formatApiUrl from '../utilities/formatApiUrl'

// Función para obtener información de una persona utilizando su número de identificación
const getPerson = async (identificationCardNumber) => {
  const url = formatApiUrl(`/people/${identificationCardNumber}`)

  const { data } = await axios.get(url)

  return data
}

// Componente para el encabezado de la aplicación
const AppHeader = () => {
  const theme = useMantineTheme()

  return (
    <Header
      height={60}
      p="xs"
    >
      <Text fz={30} fw={700} color={theme.primaryColor}>
        Tours
      </Text>
    </Header>
  )
}

// Componente para mostrar la información del usuario
const UserTile = () => {
  const theme = useMantineTheme()
  const [identificationCardNumber, _] = useAtom(identificationCardNumberAtom)
  
  // Utiliza el hook useQuery para obtener información del usuario
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => getPerson(identificationCardNumber),
    enabled: identificationCardNumber !== null
  })

  // Si la consulta está en progreso, muestra una superposición de carga
  if (userQuery.isLoading) {
    return (
      <LoadingOverlay visible={userQuery.isLoading} />
    )
  }

  // Muestra la información del usuario
  return (
    <Flex direction="column" justify="space-evenly" align="flex-start">
      <Text fz={18} color={theme.primaryColor}>
        {`${userQuery.data.name} ${userQuery.data.first_surname} ${userQuery.data.second_surname}`}
      </Text>

      <Text fz={12} color="gray">
        {userQuery.data.identification_card_number}
      </Text>

      <Text fz={12} color="gray">
        {userQuery.data.email}
      </Text>
    </Flex>
  )
}

// Componente para la barra de navegación de la aplicación
const AppNavBar = () => {
  const navigate = useNavigate()

  return (
    <Navbar
      width={{ base: 300 }}
      p="lg"
    >
      <Navbar.Section grow>
        <Flex direction="column" gap="0.75rem" >
          <NavLink
            label="Personas"
            icon={<BsFillPersonFill />}
            onClick={() => navigate("people")}
          />

          <NavLink
            label="Tours"
            icon={<BiSolidHome />}
            onClick={() => navigate("tours")}
          />
        </Flex>
      </Navbar.Section>

      <Divider />

      <Navbar.Section py="lg">
        <UserTile />
      </Navbar.Section>
    </Navbar>
  )
}

// Componente principal de la aplicación
export default () => {
  return (
    <AppShell
      padding="md"
      navbar={<AppNavBar />}
      header={<AppHeader />}
    >
      {/* El componente Outlet se utiliza para renderizar las rutas anidadas */}
      <Outlet />
    </AppShell>
  )
}
