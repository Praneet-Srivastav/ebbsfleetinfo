import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Phone, Globe, Star } from 'lucide-react'
import { getBusiness, updateBusiness, Business } from '../services/BusinessService'

const BusinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [business, setBusiness] = useState<Business | null>(null)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    const fetchBusiness = async () => {
      if (id) {
        const fetchedBusiness = await getBusiness(id)
        setBusiness(fetchedBusiness)
      }
    }
    fetchBusiness()
  }, [id])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (business && business.id) {
      const updatedBusiness = {
        ...business,
        reviews: [...(business.reviews || []), newReview],
        rating: calculateNewRating(business, newReview.rating)
      }
      await updateBusiness(business.id, updatedBusiness)
      setBusiness(updatedBusiness)
      setNewReview({ rating: 5, comment: '' })
    }
  }

  const calculateNewRating = (business: Business, newRating: number) => {
    const totalReviews = (business.reviews?.length || 0) + 1
    const currentTotalRating = (business.rating || 0) * (totalReviews - 1)
    return (currentTotalRating + newRating) / totalReviews
  }

  if (!business) return <div>Loading...</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{business.name}</h1>
      <p className="text-gray-600 mb-4">{business.category}</p>
      <div className="flex items-center mb-4">
        <Star className="text-yellow-400 mr-1" size={18} />
        <span>{business.rating?.toFixed(1) || 'N/A'}</span>
      </div>
      <div className="space-y-2 mb-6">
        <p className="flex items-center">
          <MapPin className="mr-2" size={18} />
          {business.address}
        </p>
        <p className="flex items-center">
          <Phone className="mr-2" size={18} />
          {business.phone}
        </p>
        <p className="flex items-center">
          <Globe className="mr-2" size={18} />
          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {business.website}
          </a>
        </p>
      </div>
      <p className="text-gray-700 mb-6">{business.description}</p>

      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      {business.reviews?.map((review, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-100 rounded">
          <div className="flex items-center mb-2">
            <Star className="text-yellow-400 mr-1" size={16} />
            <span>{review.rating}</span>
          </div>
          <p>{review.comment}</p>
        </div>
      ))}

      <h3 className="text-xl font-semibold mb-2">Add a Review</h3>
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block mb-1">Rating</label>
          <select
            id="rating"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comment" className="block mb-1">Comment</label>
          <textarea
            id="comment"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit Review
        </button>
      </form>
    </div>
  )
}

export default BusinessPage