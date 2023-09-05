// Importación de bibliotecas y componentes necesarios
import { identificationCardNumberAtom } from '../context'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

// Componente funcional que redirige a diferentes rutas basado en la existencia de un número de identificación
export default () => {
  // Utiliza el hook useAtom para obtener el número de identificación del contexto global
  const [identificationCardNumber, _] = useAtom(identificationCardNumberAtom)
  const navigate = useNavigate()

  // Utiliza el hook useEffect para realizar acciones cuando el componente se monta o cuando cambia la variable identificationCardNumber
  useEffect(() => {
    // Comprueba si el número de identificación es nulo
    if (identificationCardNumber === null) {
      // Si es nulo, redirige al usuario a la ruta "/sign-up" (registro)
      navigate("/sign-up")
    } else {
      // Si no es nulo, redirige al usuario a la ruta "/content"
      navigate("/content")
    }
  }, [identificationCardNumber]) // Esta dependencia asegura que el efecto se ejecute cuando identificationCardNumber cambia
}
