import { RouterProvider } from 'react-router-dom'
import { AppProvider, AuthProvider, DataProvider } from '../context'
import { router } from './routes'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </DataProvider>
    </AuthProvider>
  )
}
