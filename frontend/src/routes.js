import { element, exact } from 'prop-types'
import React from 'react'
import { Translation } from '../node_modules/react-i18next'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Function
const FuelLoad = React.lazy(() => import('./views/functionPage/FuelLoad'))
const LeakTest = React.lazy(() => import('./views/functionPage/LeakTest'))

// Reports
const fuelLevel = React.lazy(() => import('./views/reportPage/fuelLevelReport'))

// Settings
const ProbeSetting = React.lazy(() => import('./views/settingPage/ProbeSetting'))
const ProbeConfig = React.lazy(() => import('./views/settingPage/ProbeConfig'))
const FuelName = React.lazy(() => import('./views/settingPage/FuelName'))
const FuelType = React.lazy(() => import('./views/settingPage/FuelType'))
const TankSetting = React.lazy(() => import('./views/settingPage/TankSetting'))
const TankGuide = React.lazy(() => import('./views/settingPage/TankGuide'))

const routes = [
  { path: '/', exact: true, name: <Translation>{(t) => t('home')}</Translation> },
  {
    path: '/dashboard',
    name: <Translation>{(t) => t('Dashboard')}</Translation>,
    element: Dashboard,
  },

  // Function
  { path: '/function/fuelLoad', name: 'FuelLoad', element: FuelLoad, exact: true },
  { path: '/function/leakTest', name: 'LeakTest', element: LeakTest, exact: true },

  // Reports
  { path: '/report/fuelLevel', name: 'FuelLevel', element: fuelLevel, exact: true },

  // Setting
  {
    path: '/probe',
    name: 'probe',
    element: ProbeSetting,
    exact: true,
  },
  { path: '/probe/setting', name: 'ProbeSetting', element: ProbeSetting, exact: true },
  { path: '/probe/config', name: 'ProbeConfig', element: ProbeConfig, exact: true },

  { path: '/fuel', name: 'Fuel', element: FuelType, exact: true },
  { path: '/fuel/name', name: 'FuelName', element: FuelName, exact: true },
  { path: '/fuel/type', name: 'FuelType', element: FuelType, exact: true },

  { path: '/tank/setting', name: 'TankSetting', element: TankSetting, exact: true },
  { path: '/tank/guide', name: 'TankGuide', element: TankGuide, exact: true },
]

export default routes
