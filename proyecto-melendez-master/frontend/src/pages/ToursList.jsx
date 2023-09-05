import axios from 'axios'
import {
  Table,
  LoadingOverlay,
  ActionIcon,
  Flex,
  Text,
  TextInput,
  Button,
  Modal,
  useMantineTheme
} from '@mantine/core'
import ReactStars from 'react-stars'
import { identificationCardNumberAtom } from '../context'
import { useAtom } from 'jotai'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router-dom'
import { IconTrash, IconPencilStar, IconEye, IconPlus } from '@tabler/icons-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import formatApiUrl from '../utilities/formatApiUrl'

const styles = {
  // Estilos para el contenedor de la página
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
  // Estilos para el botón flotante
  floatingActionButton: {
    position: "absolute",
    right: "1rem",
    bottom: "1rem"
  }
}

// Función para manejar el cierre de un modal
const makeModalExitHandler = (alertMessage, exitHandler) => {
  const handler = () => {
    alert(alertMessage)
    exitHandler()
  }
  return handler
}

// Función para obtener todas las los tours para un número de identificación
const getAllTours = async (identificationCardNumber) => {
  const url = formatApiUrl(`/tours/${identificationCardNumber}`)
  const { data } = await axios.get(url)
  return data
}

// Función para actualizar el tour
const updateTour = async (updatedTour) => {
  const url = formatApiUrl("/tours/")
  await axios.put(url, updatedTour)
}

// Función para eliminar el tour
const deleteTour = async (tourId) => {
  const url = formatApiUrl(`/tours/${tourId}`)
  await axios.delete(url)
}

// Función para crear una nuevo tour
const createTour = async (fields) => {
  const url = formatApiUrl("/tours/")
  await axios.post(url, fields)
}

// Función para actualizar la calificación de el tour
const updateRating = async (identificationCardNumber, tourId, newRating) => {
  const url = formatApiUrl(`/ratings/${identificationCardNumber}/${tourId}`)
  await axios.put(url, {
    score: newRating
  })
}

// Componente para el modal de actualización de el tour
const UpdateModal = ({ tour, onClose, onSuccess, onError }) => {
  const form = useForm({
    initialValues: tour,
    validate: {
      location: (value) => value === "" ? "Ingresa donde es el tour" : null,
      start_date: (value) => value === "" ? "Ingresa la fecha de inicio" : null,
      end_date: (value) => value === "" ? "Ingresa la fecha en la cuál termina el tour" : null,
      airline: (value) => value === "" ? "Ingresa la aerolínea del tour" : null,
    }
  })
  const updateTourMutation = useMutation(
    ({ updatedTour }) => updateTour(updatedTour),
    {
      onError: onError,
      onSuccess: onSuccess
    }
  )

  const handleSubmit = () => {
    form.validate()

    if (form.isValid()) {
      updateTourMutation.mutate({ updatedTour: form.values })
    }
  }

  return (
    <Flex direction="column" align="center" gap="1.5rem">
      <LoadingOverlay visible={updateTourMutation.isLoading} />

      <Flex
        style={{ width: "100%" }}
      >
        <TextInput
          label="Ubicación"
          placeholder="Ubicación"
          {...form.getInputProps("location")}
          style={{ width: "100%" }}
        />
      </Flex>

      <Flex direction="row" gap="1.5rem">
        <TextInput
          label="Inicio"
          placeholder="Fecha de inicio"
          {...form.getInputProps("start_date")}
        />

        <TextInput
          label="Fin"
          placeholder="Fecha en la cual termina el tour"
          {...form.getInputProps("end_date")}
        />
      </Flex>

      <Flex
        style={{ width: "100%" }}
      >
          <TextInput
            label="Aerolínea"
            placeholder="La aerolínea"
            {...form.getInputProps("airline")}
            style={{ width: "100%" }}
          />
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

// Componente para el modal de eliminación de el tour
const DeleteModal = ({ tour, onClose, onSuccess, onError }) => {
  const deleteTourMutation = useMutation(
    ({ tourId }) => deleteTour(tourId),
    {
      onError: onError,
      onSuccess: onSuccess
    }
  )

  const handleDelete = () => {
    deleteTourMutation.mutate({
      tourId: tour.tour_id
    })
  }

  return (
    <Flex direction="column" align="center" gap="1.5rem">
      <LoadingOverlay visible={deleteTourMutation.isLoading} />

      <Text fz={30}>
        ¿Estás seguro?
      </Text>

      <Text fz={15}>
        Estás apunto de eliminar a el tour
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

// Componente para el modal de creación de una nuevo tour
const CreateModal = ({ onSuccess, onError }) => {
  const form = useForm({
    initialValues: {
      location: "",
      start_date: "",
      end_date: "",
      airline: "",
    },
    validate: {
      location: (value) => value === "" ? "Ingresa donde es el tour" : null,
      start_date: (value) => value === "" ? "Ingresa la fecha de inicio" : null,
      end_date: (value) => value === "" ? "Ingresa la fecha en la cuál termina el tour" : null,
      airline: (value) => value === "" ? "Ingresa la aerolínea del tour" : null,
    }
  })
  const createTourMutation = useMutation(
    ({ fields }) => createTour(fields),
    {
      onError: onError,
      onSuccess: onSuccess
    }
  )

  const handleSubmit = () => {
    form.validate()

    if (form.isValid()) {
      createTourMutation.mutate({ fields: form.values })
    }
  }

  return (
    <Flex direction="column" align="center" gap="1.5rem">
      <LoadingOverlay visible={createTourMutation.isLoading} />

      <Flex
        style={{ width: "100%" }}
      >
        <TextInput
          label="Ubicación"
          placeholder="Ubicación"
          {...form.getInputProps("location")}
          style={{ width: "100%" }}
        />
      </Flex>

      <Flex direction="row" gap="1.5rem">
        <TextInput
          label="Inicio"
          placeholder="Fecha de inicio"
          {...form.getInputProps("start_date")}
        />

        <TextInput
          label="Fin"
          placeholder="Fecha en la cual termina el tour"
          {...form.getInputProps("end_date")}
        />
      </Flex>

      <Flex
        style={{ width: "100%" }}
      >
          <TextInput
            label="Aerolínea"
            placeholder="La aerolínea"
            {...form.getInputProps("airline")}
            style={{ width: "100%" }}
          />
      </Flex>

      <Button
        onClick={handleSubmit}
        style={{ width: "100%" }}
      >
        Crear
      </Button>
    </Flex>
  )
}

// Componente para mostrar y permitir la calificación de el tour
const RatingStars = ({ tour, rating }) => {
  const [identificationCardNumber, _] = useAtom(identificationCardNumberAtom)
  const queryClient = useQueryClient()

  const updateRatingMutation = useMutation(
    ({
      identificationCardNumber,
      tourId,
      newRating
    }) => updateRating(
      identificationCardNumber,
      tourId,
      newRating
    ),
    {
      onError: () => alert("No se pudo reevaluar el tour"),
      onSuccess: () => queryClient.refetchQueries("allTours")
    }
  )

  const handleRatingChange = (newRating) => {
    updateRatingMutation.mutate({
      identificationCardNumber,
      tourId: tour.tour_id,
      newRating
    })
  }

  return (
    <Flex justify="center" align="center">
      <LoadingOverlay visible={updateRatingMutation.isLoading} />

      <ReactStars
        count={5}
        value={rating.score}
        onChange={handleRatingChange}
        half={false}
      />
    </Flex>
  )
}

// Componente para representar una fila de la tabla de los tours
const TableRow = ({ tour, rating }) => {
  const [isUpdateModalOpened, updateModalHandlers] = useDisclosure(false)
  const [isDeleteModalOpened, deleteModalHandlers] = useDisclosure(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const updateAsistanceMutation = useMutation(
    ({ asistance }) => updateTour({ ...tour, asistance }),
    {
      onError: () => alert("No se pudo registar tu asistencia al recorrido"),
      onSuccess: () => queryClient.refetchQueries("allTours")
    }
  )

  const navigateToComments = () => {
    navigate(`/content/comments`, {
      state: {
        tour: tour
      }
    })
  }

  const handleUpdateAsistance = () => {
    updateAsistanceMutation.mutate({ asistance: !tour.asistance })
  }

  return (
    <tr>
      <td align="center">
        <Text fz="md">
          {tour.location}
        </Text>
      </td>

      <td align="center">
        <Text fz="md">
          {tour.start_date}
        </Text>
      </td>

      <td align="center">
        <Text fz="md">
          {tour.end_date}
        </Text>
      </td>

      <td align="center">
        <Text fz="md">
          {tour.airline}
        </Text>
      </td>

      <td align="center">
        <LoadingOverlay visible={updateAsistanceMutation.isLoading} />

        <Button onClick={handleUpdateAsistance}>
          {tour.asistance ? "Asisto" : "No asisto"}
        </Button>
      </td>

      <td align="center">
        <RatingStars
          tour={tour}
          rating={rating}
        />
      </td>

      <td align="center">
        <ActionIcon onClick={navigateToComments}>
          <IconEye />
        </ActionIcon>
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
          tour={tour}
          onClose={updateModalHandlers.close}
          onSuccess={makeModalExitHandler("el tour se actualizó correctamente", updateModalHandlers.close)}
          onError={makeModalExitHandler("No se pudo actualizar a el tour", updateModalHandlers.close)}
        />
      </Modal>

      <Modal
        opened={isDeleteModalOpened}
        onClose={deleteModalHandlers.close}
        centered
      >
        <DeleteModal
          tour={tour}
          onClose={deleteModalHandlers.close}
          onSuccess={makeModalExitHandler("el tour se eliminó correctamente", deleteModalHandlers.close)}
          onError={makeModalExitHandler("No se pudo eliminar a el tour", deleteModalHandlers.close)}
        />
      </Modal>
    </tr>
  )
}

const TourManagement = () => {
  const theme = useMantineTheme()
  const [identificationCardNumber, _] = useAtom(identificationCardNumberAtom)
  const [isCreateModalOpened, createModalHandlers] = useDisclosure(false)
  const toursQuery = useQuery({
    queryKey: ["allTours"],
    queryFn: () => getAllTours(identificationCardNumber),
    enabled: identificationCardNumber !== null
  })

  if (toursQuery.isLoading) {
    return (
      <div>
        <LoadingOverlay visible={toursQuery.isLoading} />
      </div>
    )
  }

  const tableRows = toursQuery.data.map(([tour, rating]) => {
    return (
      <TableRow
        key={tour.tour_id}
        tour={tour}
        rating={rating}
      />
    )
  })

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
            <td align="center">Destino</td>
            <td align="center">Fecha de inicio</td>
            <td align="center">Fecha en que termina</td>
            <td align="center">Aerolínea</td>
            <td align="center">Asistencia</td>
            <td align="center">Evaluación</td>
            <td align="center">Comentarios</td>
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
          onSuccess={makeModalExitHandler("el tour se creó con éxito", createModalHandlers.close)}
          onError={makeModalExitHandler("No se pudo crear el tour", createModalHandlers.close)}
        />
      </Modal>
    </div>
  )
}

export default TourManagement
