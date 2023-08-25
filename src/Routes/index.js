import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/Layout'
import PrivateRoutes from '../Routes/PrivateRoutes'
import AdminDashboard from '../Routes/AdminDashboard'
import Pages404 from '../pages/utility/pages-404'
// import GenerateReport from '../components/Reports/GenerateReport'
// import SessionTimeOut from '../features/Authentication/SessionTimeOut'
import UserProfile from '../features/Authentication/UserProfile'
// authentication screens
import LoginScreen from '../features/Authentication/screens/login.screen'
import RegisterScreen from '../features/Authentication/screens/register.screen'
import LogoutScreen from '../features/Authentication/screens/logout.screen'
import ChampionshipsScreen from '../features/championships/screens/championships.screen'
import PlayersScreen from '../features/players/screens/players.screen'
import ChampionshipScreen from '../features/championships/screens/championship.screen'
import PlayerScreen from '../features/players/screens/player.screen'
import PlayerDashboard from '../features/players/screens/player.dashboard.screen'
import EventScreen from '../features/events/screens/event.screen'
import EventsScreen from '../features/events/screens/events.screen'
import VerifiedScreen from '../features/Authentication/screens/verified.screen'
import EventRegisterScreen from '../features/events/screens/event.register.screen'
import ForgotPasswordScreen from '../features/Authentication/screens/forgot-password.screen'
import ChampionshipDashboard from '../features/championships/screens/championship.dashboard.screen'
import EventManageScreen from '../features/events/screens/event.manage.screen'
import SingleElimination from '../features/events/components/events/single-elimination.event'

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
          {
            path: '',
            children: [
              { index: true, element: <PlayerDashboard /> },
              { path: 'profile', element: <PlayerScreen /> },
              { path: 'players', element: <ChampionshipsScreen /> },
              { path: 'players/:playerId', element: <PlayerScreen /> },
              { path: 'championships', element: <ChampionshipsScreen /> },
              {
                path: 'championships/:championshipId',
                element: <ChampionshipScreen />,
              },
              { path: 'events', element: <EventsScreen /> },
              {
                path: 'events/:eventId',
                element: <EventScreen />,
              },
              {
                path: 'events/:eventId/register',
                element: <EventRegisterScreen />,
              },
              {
                path: 'events/:eventId/manage',
                element: <EventManageScreen />,
              },
              {
                path: 'single',
                element: <SingleElimination />,
              },
            ],
          },
          {
            path: 'champ',
            element: <ChampionshipDashboard />,
            children: [
              {
                path: 'events/:eventId/manage',
                element: <EventManageScreen />,
              },
            ],
          },
          {
            path: 'admin',
            element: <AdminDashboard />,
            children: [
              {
                path: 'profile',
                element: <UserProfile />,
              },
              {
                path: 'reports',
                children: [
                  // {
                  //   index: true,
                  //   element: <GenerateReport />,
                  // },
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
    path: '/verified',
    element: <VerifiedScreen />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordScreen />,
  },
  {
    path: '/logout',
    element: <LogoutScreen />,
  },
])
