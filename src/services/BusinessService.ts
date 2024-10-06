import { db } from '../firebase'
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy, limit, startAfter, arrayUnion } from 'firebase/firestore'

const BUSINESSES_PER_PAGE = 10

export interface Business {
  id?: string
  name: string
  category: string
  address: string
  phone: string
  website: string
  description: string
  isPromoted: boolean
  rating?: number
  priceRating?: number
  reachRating?: number
  qualityRating?: number
  feedbacks?: Feedback[]
}

export interface Feedback {
  comment: string
  price: number
  reach: number
  quality: number
}

export const addBusiness = async (business: Business) => {
  await addDoc(collection(db, 'businesses'), business)
}

export const getBusinesses = async (lastVisible: any = null, searchTerm: string = '') => {
  let q = query(collection(db, 'businesses'), orderBy('name'), limit(BUSINESSES_PER_PAGE))

  if (lastVisible) {
    q = query(q, startAfter(lastVisible))
  }

  if (searchTerm) {
    q = query(q, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'))
  }

  const snapshot = await getDocs(q)
  const businesses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business))
  const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1]

  return { businesses, lastVisibleDoc }
}

export const getBusiness = async (id: string) => {
  const docRef = doc(db, 'businesses', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Business
  } else {
    throw new Error('Business not found')
  }
}

export const updateBusiness = async (id: string, business: Partial<Business>) => {
  const docRef = doc(db, 'businesses', id)
  await updateDoc(docRef, business)
}

export const getPromotedBusinesses = async () => {
  const q = query(collection(db, 'businesses'), where('isPromoted', '==', true), limit(3))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business))
}

export const addFeedback = async (businessId: string, feedback: Feedback) => {
  const businessRef = doc(db, 'businesses', businessId)
  const businessDoc = await getDoc(businessRef)
  
  if (businessDoc.exists()) {
    const business = businessDoc.data() as Business
    const newFeedbacks = [...(business.feedbacks || []), feedback]
    
    const newRating = newFeedbacks.reduce((sum, fb) => sum + (fb.price + fb.reach + fb.quality) / 3, 0) / newFeedbacks.length
    const newPriceRating = newFeedbacks.reduce((sum, fb) => sum + fb.price, 0) / newFeedbacks.length
    const newReachRating = newFeedbacks.reduce((sum, fb) => sum + fb.reach, 0) / newFeedbacks.length
    const newQualityRating = newFeedbacks.reduce((sum, fb) => sum + fb.quality, 0) / newFeedbacks.length

    await updateDoc(businessRef, {
      feedbacks: arrayUnion(feedback),
      rating: newRating,
      priceRating: newPriceRating,
      reachRating: newReachRating,
      qualityRating: newQualityRating
    })
  }
}