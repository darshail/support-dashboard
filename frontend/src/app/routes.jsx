import { createBrowserRouter, Navigate } from 'react-router-dom'
import GuestRoute from '../components/auth/GuestRoute'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import { DashboardLayout } from '../layouts'
import {
  CustomerExperiencePage,
  DashboardPage,
  ExecutiveDashboardPage,
  IssuesPage,
  LoginPage,
  OperationsPage,
} from '../pages'
import { ROUTES } from '../utils/constants'

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <GuestRoute />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.EXECUTIVE, element: <ExecutiveDashboardPage /> },
          { path: ROUTES.ISSUES, element: <IssuesPage /> },
          { path: ROUTES.OPERATIONS, element: <OperationsPage /> },
          { path: ROUTES.CUSTOMER_EXPERIENCE, element: <CustomerExperiencePage /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
  { path: '*', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
])
