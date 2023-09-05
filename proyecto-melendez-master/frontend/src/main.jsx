// Importaciones necesarias
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// Creación de una instancia de QueryClient
const queryClient = new QueryClient()

// Renderizado de la aplicación en el elemento con el id 'root'
ReactDOM.createRoot(document.getElementById('root')).render(
  // Uso de React.StrictMode para identificar y corregir problemas potenciales
  <React.StrictMode>
    {/* Proveedor de QueryClient para gestionar el estado global de las consultas */}
    <QueryClientProvider client={queryClient}>
      {/* Proveedor de Mantine para la utilización de componentes de Mantine */}
      <MantineProvider>
        {/* Componente principal de la aplicación */}
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
