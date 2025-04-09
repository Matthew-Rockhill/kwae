import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Portfolio service
export const portfolioService = {
  async getPortfolioItems() {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching portfolio items:', error)
      return []
    }
    
    return data || []
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
  async submitContactForm(formData: any) {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        inquiry_type: formData.inquiryType,
        message: formData.message,
        created_at: new Date().toISOString()
      }])
    
    if (error) {
      console.error('Error submitting contact form:', error)
      throw error
    }
    
    return data
  }
}

// Booking service
export const bookingService = {
  async submitBookingForm(formData: any) {
    const { data, error } = await supabase
      .from('booking_submissions')
      .insert([{
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        package_type: formData.packageType,
        event_date: formData.eventDate,
        event_location: formData.eventLocation,
        additional_notes: formData.additionalNotes,
        created_at: new Date().toISOString()
      }])
    
    if (error) {
      console.error('Error submitting booking form:', error)
      throw error
    }
    
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