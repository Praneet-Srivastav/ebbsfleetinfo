import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Building2 size={24} />
          <span className="text-xl font-bold">Ebssfleet.info</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/listings" className="hover:underline">Listings</Link>
          {user && <Link to="/admin" className="hover:underline">Admin</Link>}
          {user ? (
            <button
              onClick={() => logout()}
              className="flex items-center space-x-1 bg-white text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition duration-300"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1 bg-white text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition duration-300"
            >
              <LogIn size={18} />
              <span>Admin Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header