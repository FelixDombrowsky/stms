import React from 'react'
import CIcon from '@coreui/icons-react'
import probe_icon from './assets/images/icons/probe.svg'
import probe_gray from './assets/images/icons/probe_gray.svg'
import {
  cilDrop,
  cilSpeedometer,
  cilSettings,
  cilDescription,
  cibHighly,
  cilColorFill,
  cilSnowflake,
  cilWindowMaximize,
  cilColumns,
  cilImageBroken,
  cilHealing,
  cilGraph,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react-pro'
import { Translation } from '../node_modules/react-i18next'
import { HugeiconsIcon } from '@hugeicons/react'
import { PolyTankIcon } from '@hugeicons/core-free-icons'
import { RectangleCircle } from 'lucide-react'

const _nav = [
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Dashboard')}</Translation>,
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info-gradient',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavTitle,
    name: <Translation>{(t) => t('function')}</Translation>,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Fuel Loading')}</Translation>,
    to: '/function/fuelLoad',
    icon: <CIcon icon={cilColorFill} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <Translation>{(t) => t('Leak Test')}</Translation>,
    to: '/function/leakTest',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: <Translation>{(t) => t('Reports')}</Translation>,
  },
  {
    component: CNavGroup,
    name: <Translation>{(t) => t('Reports')}</Translation>,
    to: '/base',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Fuel Level Report',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Fuel Load Report',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Leak Test Report',
        to: '/base/calendar',
        // badge: {
        //   color: 'danger-gradient',
        //   text: 'PRO',
        // },
      },
    ],
  },
  {
    component: CNavTitle,
    name: <Translation>{(t) => t('Settings')}</Translation>,
  },
  {
    component: CNavGroup,
    name: 'Probe',
    icon: <CIcon icon={cibHighly} customClassName="nav-icon" />,
    // icon: <img src={probe_gray} className="nav-icon" />,
    to: '/probe',
    items: [
      {
        component: CNavItem,
        name: <Translation>{(t) => t('Probe Config')}</Translation>,
        to: '/probe/config',
      },
      {
        component: CNavItem,
        name: <Translation>{(t) => t('Probe Setting')}</Translation>,
        to: '/probe/setting',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Fuel',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    to: '/fuel',
    items: [
      {
        component: CNavItem,
        name: <Translation>{(t) => t('Fuel Type')}</Translation>,
        to: '/fuel/type',
      },
      {
        component: CNavItem,
        name: <Translation>{(t) => t('Fuel Name')}</Translation>,
        to: '/fuel/name',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Tank',
    icon: <RectangleCircle className="nav-icon-edit me-2" />,
    to: '/tank',
    items: [
      {
        component: CNavItem,
        name: 'Tank Setting',
        to: '/tank/setting',
      },
      {
        component: CNavItem,
        name: 'Tank Guide Chart',
        to: '/tank/guide',
      },
    ],
  },
]

export default _nav
