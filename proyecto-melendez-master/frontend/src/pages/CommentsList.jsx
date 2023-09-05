import axios from 'axios'
import {
  Flex,
  Textarea,
  ActionIcon,
  Card,
  Text,
  Button,
  Divider,
  LoadingOverlay,
  Modal,
  TextInput,
  useMantineTheme
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash, IconPencilStar } from '@tabler/icons-react'
import { AiOutlineSend } from 'react-icons/ai'
import { useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import formatApiUrl from '../utilities/formatApiUrl'

// Función para crear un comentario
const createComment = async (tourId, comment) => {
  const url = formatApiUrl(`/comments/${tourId}`)

  await axios.post(url, {
    content: comment
  })
}

// Función para actualizar un comentario
const updateComment = async (comment) => {
  const url = formatApiUrl("/comments/")

  await axios.put(url, comment)
}

// Función para eliminar un comentario
const deleteComment = async (comment) => {
  const url = formatApiUrl(`/comments/${comment.comment_id}`)

  await axios.delete(url)
}

// Componente para la entrada de comentarios
const CommentInput = ({ tourId }) => {
  const theme = useMantineTheme()
  const navigate = useNavigate()
  const [comment, setComment] = useState("")
  const createCommentMutation = useMutation(
    ({ tourId, comment }) => createComment(tourId, comment),
    {
      onError: () => alert("No se pudo añadir el comentario"),
      onSuccess: () => {
        navigate("/content/tours")

        alert("El comentario se añadió con éxito")
      }
    }
  )

  const handleSubmit = () => {
    createCommentMutation.mutate({
      tourId,
      comment
    })
  }

  return (
    <Flex
      direction="row"
      justify="space-evenly"
      align="center"
      gap="1rem"
      style={{ width: "100%" }}
    >
      <LoadingOverlay visible={createCommentMutation.isLoading} />

      <Textarea
        placeholder="Comentario"
        value={comment}
        onChange={(event) => setComment(event.currentTarget.value)}
        radius="md"
        size="md"
        style={{ width: "100%" }}
        minRows={2}
        maxRows={2}
      />

      <ActionIcon
        variant="filled"
        radius="xl"
        size="xl"
        color={theme.primaryColor}
        onClick={handleSubmit}
      >
        <AiOutlineSend size={20} />
      </ActionIcon>
    </Flex>
  )
}

// Componente para el modal de actualización de comentario
const UpdateCommentModal = ({ comment }) => {
  const navigate = useNavigate()
  const [updatedContent, setUpdatedContent] = useState(comment.content)
  const updateCommentMutation = useMutation(
    ({ comment }) => updateComment(comment),
    {
      onError: () => alert("El comentario no se pudo editar"),
      onSuccess: () => {
        navigate("/content/tours")

        alert("El comentario se editó con éxito")
      }
    }
  )

  const handleSubmit = () => {
    updateCommentMutation.mutate({
      comment: {
        ...comment,
        content: updatedContent
      }
    })
  }

  return (
    <Flex
      direction="column"
      justify="space-evenly"
      align="center"
      gap="1rem"
    >
      <Text fz="xl">
        Edita tu comentario
      </Text>

      <TextInput
        value={updatedContent}
        onChange={(event) => setUpdatedContent(event.target.value)}
      />

      <Button
        onClick={handleSubmit}
      >
        Confirmar
      </Button>
    </Flex>
  )
}

// Componente para mostrar un comentario
const CommentTile = ({ comment }) => {
  const [
    isUpdateCommentModalVisible,
    updateCommentModalHandlers
  ] = useDisclosure(false)
  const navigate = useNavigate()
  const deleteCommentMutation = useMutation(
    ({ comment }) => deleteComment(comment),
    {
      onError: () => alert("No se pudo eliminar el comentario"),
      onSuccess: () => {
        navigate("/content/tours")

        alert("El comentario se eliminó correctamente")
      }
    }
  )

  const handleDelete = () => {
    deleteCommentMutation.mutate({ comment })
  }

  return (
    <Card
      style={{ width: "100%" }}
      shadow="sm"
      withBorder
    >
      <LoadingOverlay visible={deleteCommentMutation.isLoading} />

      <Flex justify="space-between">
        <Text fz="xl">
          {comment.content}
        </Text>

        <Flex gap="0.5rem">
          <ActionIcon
            onClick={updateCommentModalHandlers.open}
          >
            <IconPencilStar />
          </ActionIcon>

          <ActionIcon
            onClick={handleDelete}
          >
            <IconTrash />
          </ActionIcon>
        </Flex>
      </Flex>

      <Modal
        opened={isUpdateCommentModalVisible}
        onClose={updateCommentModalHandlers.close}
        centered
      >
        <UpdateCommentModal comment={comment} />
      </Modal>
    </Card>
  )
}

// Componente para listar los comentarios
const CommentsList = ({ comments }) => {
  const commentsTiles = comments.map((comment) => {
    return (
      <CommentTile
        key={comment.comment_id}
        comment={comment}
      />
    )
  })

  return (
    <Flex
      direction="column"
      justify="space-between"
      gap="0.75rem"
    >
      {commentsTiles}
    </Flex>
  )
}

export default () => {
  const { state } = useLocation()
  const { tour } = state

  return (
    <Flex
      direction="column"
      gap="1rem"
      style={{ width: "100%" }}
    >
      <CommentInput tourId={tour.tour_id} />

      <Divider />

      <CommentsList comments={tour.comments} />
    </Flex>
  )
}
