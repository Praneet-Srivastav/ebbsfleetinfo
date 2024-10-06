import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getBusinesses, Business, addFeedback } from '../services/BusinessService'
import { Search, Star } from 'lucide-react'

const ListingPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [feedback, setFeedback] = useState({ businessId: '', comment: '', price: 0, reach: 0, quality: 0 })

  const fetchBusinesses = async () => {
    const { businesses: newBusinesses, lastVisibleDoc } = await getBusinesses(lastVisible, searchTerm)
    setBusinesses(prev => [...prev, ...newBusinesses])
    setLastVisible(lastVisibleDoc)
    setHasMore(newBusinesses.length > 0)
  }

  useEffect(() => {
    setBusinesses([])
    setLastVisible(null)
    setHasMore(true)
    fetchBusinesses()
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setBusinesses([])
    setLastVisible(null)
    setHasMore(true)
    fetchBusinesses()
  }

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFeedback(prev => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (category: string, value: number) => {
    setFeedback(prev => ({ ...prev, [category]: value }))
  }

  const handleFeedbackSubmit = async (e: React.FormEvent, businessId: string) => {
    e.preventDefault()
    await addFeedback(businessId, feedback)
    setFeedback({ businessId: '', comment: '', price: 0, reach: 0, quality: 0 })
    fetchBusinesses() // Refresh the list to show updated ratings
  }

  const StarRating: React.FC<{ category: string, value: number, onChange: (value: number) => void }> = ({ category, value, onChange }) => {
    return (
      <div className="flex items-center">
        <span className="mr-2">{category}:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            onClick={() => onChange(star)}
            fill={star <= value ? "gold" : "none"}
            stroke={star <= value ? "gold" : "currentColor"}
            className="cursor-pointer"
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Business Listings</h1>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pr-10 border rounded"
          />
          <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Search size={20} />
          </button>
        </div>
      </form>
      <InfiniteScroll
        dataLength={businesses.length}
        next={fetchBusinesses}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <div className="space-y-8">
          {businesses.map((business) => (
            <div key={business.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <Link to={`/business/${business.id}`}>
                <h2 className="text-xl font-semibold mb-2">{business.name}</h2>
              </Link>
              <p className="text-gray-600 mb-2">{business.category}</p>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-400 mr-1" size={18} />
                <span>{business.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <form onSubmit={(e) => handleFeedbackSubmit(e, business.id!)}>
                <textarea
                  name="comment"
                  value={feedback.businessId === business.id ? feedback.comment : ''}
                  onChange={handleFeedbackChange}
                  placeholder="Leave a comment..."
                  className="w-full p-2 border rounded mb-2"
                  onClick={() => setFeedback(prev => ({ ...prev, businessId: business.id! }))}
                />
                <div className="space-y-2 mb-2">
                  <StarRating category="Price" value={feedback.price} onChange={(value) => handleRatingChange('price', value)} />
                  <StarRating category="Reach" value={feedback.reach} onChange={(value) => handleRatingChange('reach', value)} />
                  <StarRating category="Quality" value={feedback.quality} onChange={(value) => handleRatingChange('quality', value)} />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Submit Feedback
                </button>
              </form>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default ListingPage