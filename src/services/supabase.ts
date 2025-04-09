import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)

// Portfolio service
export const portfolioService = {
  async getPortfolioItems() {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },
  
  async getPortfolioItemsByCategory(category: string) {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching portfolio items by category:', error)
      return []
    }
    
    return data || []
  }
}

// Contact form service
export const contactService = {
  async submitContactForm(formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    message: string
  }) {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([formData])
    
    if (error) throw error
    return data
  }
}

// Booking service
export const bookingService = {
  async submitBookingForm(formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    preferredDate: string
    eventLocation: string
    packageType: string
    additionalNotes: string
  }) {
    const { data, error } = await supabase
      .from('booking_requests')
      .insert([formData])
    
    if (error) throw error
    return data
  }
}

// Testimonials service
export const testimonialService = {
  async getTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching testimonials:', error)
      return []
    }
    
    return data || []
  }
}