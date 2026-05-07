import { NavLink } from 'react-router-dom'
import {
  HomeIcon, UsersIcon, BanknotesIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  BanknotesIcon as BanknotesIconSolid,
} from '@heroicons/react/24/solid'
import './Sidebar.css'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: HomeIcon,      IconActive: HomeIconSolid },
  { to: '/clients',   label: 'Clientes',  Icon: UsersIcon,     IconActive: UsersIconSolid },
  { to: '/costs',     label: 'Costos',    Icon: BanknotesIcon, IconActive: BanknotesIconSolid },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            {/* Ícono de rayo inline — sin dependencia extra */}
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white"
                 stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="sidebar__logo-text">Gestión</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(({ to, label, Icon, IconActive }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive
                  ? <IconActive className="sidebar__link-icon" />
                  : <Icon      className="sidebar__link-icon" />}
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}