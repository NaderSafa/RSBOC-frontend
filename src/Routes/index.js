import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/Layout'
import PrivateRoutes from '../Routes/PrivateRoutes'
import AdminDashboard from '../Routes/AdminDashboard'
import Pages404 from '../pages/utility/pages-404'
import Dashboard from '../components/Dashboard'
import OrderDetails from '../components/orders/OrderDetails'
import AdminOrders from '../components/orders/AdminOrders'
import MoleculesTable from '../components/Reports/Molecules/MoleculesTable'
// import GenerateReport from '../components/Reports/GenerateReport'
import PharmaciesTable from '../components/Pharmacies/PharmaciesTable'
import AdminsTable from '../components/Administrators/AdminsTable'
import PharmacyOrders from '../components/orders/PharmacyOrders'
// import SessionTimeOut from '../features/Authentication/SessionTimeOut'
import MoleculesReport from '../components/Reports/MoleculesReport'
import MoleculeHistory from '../components/Reports/Molecules/MoleculeHistory'
import PharmacyDashboard from '../components/Dashboard/PharmacyDashboard'
import ManufacturersAdmin from '../components/Reports/Manufacturers/ManufacturersAdmin'
import ManufacturersPharmacy from '../components/Reports/Manufacturers/ManufacturersPharmacy'
import AdminUploadFile from '../components/Upload/AdminUploadFile'
import UserProfile from '../features/Authentication/UserProfile'
import PharmacyProfile from '../features/Authentication/PharmacyProfile'

// authentication screens
import LoginScreen from '../features/Authentication/screens/login.screen'
import RegisterScreen from '../features/Authentication/screens/register.screen'
import LogoutScreen from '../features/Authentication/screens/logout.screen'

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
    path: '/register',
    element: <RegisterScreen />,
  },
  {
    path: '/logout',
    element: <LogoutScreen />,
  },
])
