import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { addBusiness } from '../services/BusinessService'

const AdminPage: React.FC = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    phone: '',
    website: '',
    description: '',
    isPromoted: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addBusiness(formData)
      alert('Business added successfully!')
      setFormData({
        name: '',
        category: '',
        address: '',
        phone: '',
        website: '',
        description: '',
        isPromoted: false,
      })
    } catch (error) {
      console.error('Error adding business:', error)
      alert('Failed to add business. Please try again.')
    }
  }

  const addSampleListings = async () => {
    const sampleListings = [
      {
        name: "John's Carpentry",
        category: "Carpenter",
        address: "123 Wood St, Craftsville, CS 12345",
        phone: "(555) 123-4567",
        website: "www.johnscarpentry.com",
        description: "Expert carpentry services with 20 years of experience. Specializing in custom furniture and home renovations.",
        isPromoted: true,
      },
      {
        name: "Handy Harry's Services",
        category: "Handyman",
        address: "456 Fix-It Ave, Repairton, RT 67890",
        phone: "(555) 987-6543",
        website: "www.handyharry.com",
        description: "No job too small! From minor repairs to major home improvements, Handy Harry has got you covered.",
        isPromoted: false,
      },
      {
        name: "Perfect Painters Co.",
        category: "Painter",
        address: "789 Color Blvd, Brushville, BV 54321",
        phone: "(555) 246-8135",
        website: "www.perfectpainters.com",
        description: "Transform your space with our expert painting services. Interior and exterior painting for residential and commercial properties.",
        isPromoted: true,
      },
      {
        name: "Elite Electricians",
        category: "Electrician",
        address: "321 Volt Lane, CurrentCity, CC 13579",
        phone: "(555) 369-2580",
        website: "www.eliteelectricians.com",
        description: "Licensed and insured electricians providing top-notch electrical services for your home and business.",
        isPromoted: false,
      },
      {
        name: "Plumb Perfect",
        category: "Plumber",
        address: "654 Pipe St, Flowtown, FT 97531",
        phone: "(555) 159-7532",
        website: "www.plumbperfect.com",
        description: "24/7 emergency plumbing services. From leaky faucets to complete pipe replacements, we do it all!",
        isPromoted: true,
      }
    ]

    for (const listing of sampleListings) {
      try {
        await addBusiness(listing)
        console.log(`Added ${listing.name}`)
      } catch (error) {
        console.error(`Error adding ${listing.name}:`, error)
      }
    }
    alert('Sample listings added successfully!')
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <button 
        onClick={addSampleListings}
        className="mb-8 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
      >
        Add Sample Listings
      </button>
      <h2 className="text-2xl font-bold mb-4">Add New Business</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* ... (rest of the form remains unchanged) ... */}
      </form>
    </div>
  )
}

export default AdminPage