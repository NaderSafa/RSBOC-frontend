import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/Layout'
import Login from '../components/Authentication/Login'
import Register from '../components/Authentication/Register'

import PrivateRoutes from '../Routes/PrivateRoutes'
import UserProfile from '../components/Authentication/UserProfile'
import AdminDashboard from '../Routes/AdminDashboard'
import Pages404 from '../pages/utility/pages-404'
import Logout from '../components/Authentication/Logout'
import ForgetPasswordPage from '../components/Authentication/ForgetPassword'
import Dashboard from '../components/Dashboard'
import OrderDetails from '../components/orders/OrderDetails'
import CreatePassword from '../components/Authentication/CreatePassword'
import ChangePassword from '../components/Authentication/ChangePassword'
import AdminOrders from '../components/orders/AdminOrders'
import MoleculesTable from '../components/Reports/Molecules/MoleculesTable'
// import GenerateReport from '../components/Reports/GenerateReport'
import PharmacyProfile from '../components/Authentication/PharmacyProfile'
import PharmaciesTable from '../components/Pharmacies/PharmaciesTable'
import AdminsTable from '../components/Administrators/AdminsTable'
import PharmacyOrders from '../components/orders/PharmacyOrders'
// import SessionTimeOut from '../components/Authentication/SessionTimeOut'
import MoleculesReport from '../components/Reports/MoleculesReport'
import MoleculeHistory from '../components/Reports/Molecules/MoleculeHistory'
import PharmacyDashboard from '../components/Dashboard/PharmacyDashboard'
import ManufacturersAdmin from '../components/Reports/Manufacturers/ManufacturersAdmin'
import ManufacturersPharmacy from '../components/Reports/Manufacturers/ManufacturersPharmacy'
import AdminUploadFile from '../components/Upload/AdminUploadFile'
import LoginScreen from '../components/Authentication/screens/login.screen'
import RegisterScreen from '../components/Authentication/screens/register.screen'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoutes />,
    errorElement: <Pages404 />,
    children: [
      {
        path: '',
        element: <MainLayout />,
        children: [
          { index: true, element: <PharmacyDashboard /> },
          { path: 'profile', element: <UserProfile /> },
          { path: 'orders', element: <PharmacyOrders /> },
          { path: 'orders/:orderId', element: <OrderDetails /> },
          { path: 'manufacturers', element: <ManufacturersPharmacy /> },
          {
            path: 'admin',
            element: <AdminDashboard />,
            children: [
              {
                index: true,
                element: <Dashboard />,
              },
              {
                path: 'profile',
                element: <UserProfile />,
              },
              {
                path: 'pharmacies',
                element: <PharmaciesTable />,
              },
              {
                path: 'reports/manufacturers',
                element: <ManufacturersAdmin />,
              },
              {
                path: 'pharmacies/:pharmacyId',
                element: <PharmacyProfile />,
              },
              {
                path: 'admins-list',
                element: <AdminsTable />,
              },

              {
                path: 'orders',
                element: <AdminOrders />,
              },
              {
                path: 'orders/:orderId',
                element: <OrderDetails />,
              },
              {
                path: 'molecules',
                element: <MoleculesTable />,
              },
              {
                path: 'upload-file',
                element: <AdminUploadFile />,
              },
              {
                path: 'reports',
                children: [
                  // {
                  //   index: true,
                  //   element: <GenerateReport />,
                  // },

                  {
                    path: 'molecules',
                    element: <MoleculesReport />,
                  },
                  {
                    path: 'molecules/:din',
                    element: <MoleculeHistory />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/loginOld',
    element: <Login />,
  },
  {
    path: '/register',
    element: <RegisterScreen />,
  },
  {
    path: '/registerOld',
    element: <Register />,
  },
  {
    path: '/create-password',
    element: <CreatePassword />,
  },
  // {
  //   path: '/session-timeout',
  //   element: <SessionTimeOut />,
  // },
  {
    path: '/forget-password',
    element: <ForgetPasswordPage />,
  },
  {
    path: '/change-password',
    element: <ChangePassword />,
  },
  {
    path: '/logout',
    element: <Logout />,
  },
])
