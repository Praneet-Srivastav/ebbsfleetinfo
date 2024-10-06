import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star } from 'lucide-react'
import { getPromotedBusinesses, Business } from '../services/BusinessService'

const HomePage: React.FC = () => {
  const [promotedBusinesses, setPromotedBusinesses] = useState<Business[]>([])

  useEffect(() => {
    const fetchPromotedBusinesses = async () => {
      const businesses = await getPromotedBusinesses()
      setPromotedBusinesses(businesses)
    }
    fetchPromotedBusinesses()
  }, [])

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-8 text-gray-800">Search Local Businesses</h1>
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for businesses..."
            className="w-full p-4 pr-12 rounded-full border-2 border-blue-300 focus:outline-none focus:border-blue-500 shadow-md"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500" size={24} />
        </div>
      </div>
      <Link to="/listings" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition duration-300 shadow-md">
        Browse All Listings
      </Link>

      <section className="mt-16">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">Featured Businesses</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {promotedBusinesses.map((business) => (
            <Link key={business.id} to={`/business/${business.id}`} className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
                  <p className="text-gray-600 mb-4">{business.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-yellow-400 text-yellow-900 py-1 px-2 rounded-full text-sm font-semibold">Featured</span>
                    <div className="flex items-center">
                      <Star className="text-yellow-400 mr-1" size={18} />
                      <span>{business.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage