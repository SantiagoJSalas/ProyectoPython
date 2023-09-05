// Importación de módulos y componentes
import axios from 'axios'
import {
  Table,
  LoadingOverlay,
  ActionIcon,
  Flex,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Modal,
  useMantineTheme
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { IconTrash, IconPencilStar, IconPlus } from '@tabler/icons-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import formatApiUrl from '../utilities/formatApiUrl'

// Estilos CSS en línea
const styles = {
  pageContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem"
  },
  floatingActionButton: {
    position: "absolute",
    right: "1rem",
    bottom: "1rem"
  }
}

// Función asincrónica para obtener todas las personas
const getAllPeople = async () => {
  const url = formatApiUrl("/people/")

  const { data } = await axios.get(url)

  return data
}

// Función asincrónica para crear una persona
const createPerson = async (fields) => {
  const url = formatApiUrl("/people/sign_up")

  await axios.post(url, fields)
}

// Función asincrónica para actualizar una persona
const updatePerson = async (updatedPerson) => {
  const url = formatApiUrl("/people/")

  await axios.put(url, updatedPerson)
}

// Función asincrónica para eliminar una persona
const deletePerson = async (identificationCardNumber) => {
  const url = formatApiUrl(`/people/${identificationCardNumber}`)

  await axios.delete(url)
}

// Función para validar el número de cédula
const validate_identification_card_number = (identification_card_number) => {
  if (isNaN(Number(identification_card_number))) {
    return "Ingresa tu número de cédula"
  }

  if (identification_card_number.length !== 9) {
    return "El número de cédula consiste de nueve dígitos"
  }

  return null
}

// Componente para el modal de actualización
const UpdateModal = ({ person, onClose, onSuccess, onError }) => {
  const form = useForm({
    initialValues: person,
    validate: {
      name: (value) => value === "" ? "Ingresa tu nombre" : null,
      first_surname: (value) => value === "" ? "Ingresa tu primer apellido" : null,
      second_surname: (value) => value === "" ? "Ingresa tu segundo apellido" : null,
      address: (value) => value === "" ? "Ingresa tu dirección" : null,
      email: (value) => value === "" ? "Ingresa un correo electrónico" : null,
      password: (value) => value === "" ? "Ingresa una contraseña" : null,
    }
  })
  const updatePersonMutation = useMutation(
    ({ updatedPerson }) => updatePerson(updatedPerson),
    {
      onError: onError,
      onSuccess: onSuccess
    }
  )

  const handleSubmit = () => {
    form.validate()

    if (form.isValid()) {
      updatePersonMutation.mutate({ updatedPerson: form.values })
    }
  }

  return (
    <Flex direction="column" align="center" gap="1.5rem">
      <LoadingOverlay visible={updatePersonMutation.isLoading} />

      <Flex justify="space-evenly" gap="2rem">
        <Flex direction="column" gap="1.5rem">
          <TextInput
            label="Nombre"
            placeholder="Tu nombre"
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Primer apellido"
            placeholder="Tu primer apellido"
            {...form.getInputProps("first_surname")}
          />

          <TextInput
            label="Segundo apellido"
            placeholder="Tu segundo apellido"
            {...form.getInputProps("second_surname")}
          />
        </Flex>

        <Flex direction="column" gap="1.5rem">
          <TextInput
            label="Dirección"
            placeholder="Tu dirección"
            {...form.getInputProps("address")}
          />

          <TextInput
            label="Correo electrónico"
            placeholder="Tu correo electrónico"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            {...form.getInputProps("password")}
            style={{ width: "100%" }}
          />
        </Flex>
      </Flex>

      <Flex
        justify="space-evenly"
        align="center"
        gap="2rem"
        style={{ width: "100%" }}
      >
        <Button
          onClick={onClose}
          color="red"
          style={{ width: "100%" }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit}
          style={{ width: "100%" }}
        >
          Confirmar
        </Button>
      </Flex>
    </Flex>
  )
}

// Componente para el modal de eliminación
const DeleteModal = ({ person, onClose, onSuccess, onError }) => {
  const deletePersonMutation = useMutation(
    ({ identificationCardNumber }) => deletePerson(identificationCardNumber),
    {
      onError: onError,
      onSuccess: onSuccess
    }
  )

  const handleDelete = () => {
    deletePersonMutation.mutate({
      identificationCardNumber: person.identification_card_number
    })
  }

  return (
    <Flex direction="column" align="center" gap="1.5rem">
      <LoadingOverlay visible={deletePersonMutation.isLoading} />

      <Text fz={30}>
        ¿Estás seguro?
      </Text>

      <Text fz={15}>
        Estás a punto de eliminar a una persona
      </Text>

      <Flex
        justify="space-evenly"
        align="center"
        gap="2rem"
        style={{ width: "100%" }}
      >
        <Button
          onClick={onClose}
          color="red"
          style={{ width: "100%" }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleDelete}
          style={{ width: "100%" }}
        >
          Confirmar
        </Button>
      </Flex>
    </Flex>
  )
}

// Componente para cada fila de la tabla
const TableRow = ({ person }) => {
  const [isUpdateModalOpened, updateModalHandlers] = useDisclosure(false)
  const [isDeleteModalOpened, deleteModalHandlers] = useDisclosure(false)

  const makeModalExitHandler = (alertMessage, exitHandler) => {
    const handler = () => {
      alert(alertMessage)

      exitHandler()
    }

    return handler
  }

  return (
    <tr>
      <td align="center">
        <Text fz="md">
          {person.identification_card_number}
        </Text>
      </td>

      <td align="center">
        <Text fz="md">
          {person.name}
        </Text>
      </td>

      <td align="center">
        <Text fz="md">
          {person.first_surname}
        </Text>
      </td>

      <td align="center">
        <Text fz="md">
          {person.second_surname}
        </Text>
      </td>

      <td align="center">
        <Text fz="md">
          {person.address}
        </Text>
      </td>

      <td align="center">
        <Text fz="md">
          {person.email}
        </Text>
      </td>

      <td align="center">
        <ActionIcon onClick={updateModalHandlers.open}>
          <IconPencilStar />
        </ActionIcon>
      </td>

      <td align="center">
        <ActionIcon onClick={deleteModalHandlers.open}>
          <IconTrash />
        </ActionIcon>
      </td>

      <Modal
        opened={isUpdateModalOpened}
        onClose={updateModalHandlers.close}
        centered
      >
        <UpdateModal
          person={person}
          onClose={updateModalHandlers.close}
          onSuccess={makeModalExitHandler("La persona se actualizó correctamente", updateModalHandlers.close)}
          onError={makeModalExitHandler("No se pudo actualizar a la persona", updateModalHandlers.close)}
        />
      </Modal>

      <Modal
        opened={isDeleteModalOpened}
        onClose={deleteModalHandlers.close}
        centered
      >
        <DeleteModal
          person={person}
          onClose={deleteModalHandlers.close}
          onSuccess={makeModalExitHandler("La persona se eliminó correctamente", deleteModalHandlers.close)}
          onError={makeModalExitHandler("No se pudo eliminar a la persona", deleteModalHandlers.close)}
        />
      </Modal>
    </tr>
  )
}

// Componente para el modal de creación
const CreateModal = ({ onSuccess, onError }) => {
  const queryClient = useQueryClient()
  const form = useForm({
    initialValues: {
      identification_card_number: "",
      name: "",
      first_surname: "",
      second_surname: "",
      address: "",
      email: "",
      password: ""
    },
    validate: {
      identification_card_number: validate_identification_card_number,
      name: (value) => value === "" ? "Ingresa tu nombre" : null,
      first_surname: (value) => value === "" ? "Ingresa tu primer apellido" : null,
      second_surname: (value) => value === "" ? "Ingresa tu segundo apellido" : null,
      address: (value) => value === "" ? "Ingresa tu dirección" : null,
      email: (value) => value === "" ? "Ingresa un correo electrónico" : null,
      password: (value) => value === "" ? "Ingresa una contraseña" : null,
    }
  })

  const createPersonMutation = useMutation(
    ({ fields }) => createPerson(fields),
    {
      onError: onError,
      onSuccess: () => {
        queryClient.invalidateQueries("allPeople")
        onSuccess()
      }
    }
  )

  const handleSubmit = () => {
    form.validate()

    if (form.isValid()) {
      createPersonMutation.mutate({ fields: form.values })
    }
  }

  return (
    <Flex direction="column" align="center" gap="1.5rem">
      <LoadingOverlay visible={createPersonMutation.isLoading} />

      <Flex
        style={{ width: "100%" }}
      >
        <TextInput
          label="Número de cédula"
          placeholder="Tu número de cédula"
          {...form.getInputProps("identification_card_number")}
          style={{ width: "100%" }}
        />
      </Flex>

      <Flex justify="space-evenly" gap="2rem">
        <Flex direction="column" gap="1.5rem">
          <TextInput
            label="Nombre"
            placeholder="Tu nombre"
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Primer apellido"
            placeholder="Tu primer apellido"
            {...form.getInputProps("first_surname")}
          />

          <TextInput
            label="Segundo apellido"
            placeholder="Tu segundo apellido"
            {...form.getInputProps("second_surname")}
          />
        </Flex>

        <Flex direction="column" gap="1.5rem">
          <TextInput
            label="Dirección"
            placeholder="Tu dirección"
            {...form.getInputProps("address")}
          />

          <TextInput
            label="Correo electrónico"
            placeholder="Tu correo electrónico"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Contraseña"
            placeholder="Tu contraseña"
            {...form.getInputProps("password")}
            style={{ width: "100%" }}
          />
        </Flex>
      </Flex>

      <Button
        onClick={handleSubmit}
        style={{ width: "100%" }}
      >
        Confirmar
      </Button>
    </Flex>
  )
}

export default () => {
  const peopleQuery = useQuery({
    queryKey: ["allPeople"],
    queryFn: () => getAllPeople()
  })
  const theme = useMantineTheme()
  const [isCreateModalOpened, createModalHandlers] = useDisclosure(false)

  if (peopleQuery.isLoading) {
    return (
      <div>
        <LoadingOverlay visible={peopleQuery.isLoading} />
      </div>
    )
  }

  const tableRows = peopleQuery.data.map((person) => {
    return (
      <TableRow
        key={person.identification_card_number}
        person={person}
      />
    )
  })

  const makeModalExitHandler = (alertMessage, exitHandler) => {
    const handler = () => {
      alert(alertMessage)
      exitHandler()
    }

    return handler
  }

  return (
    <div style={styles.pageContainer}>
      <Table
        striped
        highlightOnHover
        withBorder
        withColumnBorders
        style={{ width: "80%" }}
      >
        <thead>
          <tr>
            <td align="center">Cédula</td>
            <td align="center">Nombre</td>
            <td align="center">Primer apellido</td>
            <td align="center">Segundo apellido</td>
            <td align="center">Dirección</td>
            <td align="center">Correo electrónico</td>
            <td align="center">Actualizar</td>
            <td align="center">Eliminar</td>
          </tr>
        </thead>

        <tbody>
          {tableRows}
        </tbody>
      </Table>

      <ActionIcon
        size="xl"
        radius="xl"
        variant="filled"
        color={theme.primaryColor}
        style={styles.floatingActionButton}
        onClick={createModalHandlers.open}
      >
        <IconPlus />
      </ActionIcon>

      <Modal
        opened={isCreateModalOpened}
        onClose={createModalHandlers.close}
        centered
      >
        <CreateModal
          onSuccess={makeModalExitHandler("La persona se creó con éxito", createModalHandlers.close)}
          onError={(error) => {
            const message = error.response.data.message === "PERSON_ALREADY_EXISTS" ?
              "Ya existe una persona con el número de cédula que ingresaste" :
              "No se pudo crear la persona con éxito"

            makeModalExitHandler(message)()
          }}
        />
      </Modal>
    </div>
  )
}
