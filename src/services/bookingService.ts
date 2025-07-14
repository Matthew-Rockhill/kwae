export interface BookingData {
  selectedPackage: string
  firstName: string
  lastName: string
  email: string
  phone: string
  eventDate?: string
  additionalNotes?: string
  submittedAt: string
}

export interface BookingResponse {
  success: boolean
  message: string
  bookingId?: string
}

class BookingService {
  private apiBaseUrl: string

  constructor() {
    // You can set this to your actual API endpoint
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 
      (import.meta.env.PROD ? 'https://kristin-with-an-eye.vercel.app/api' : 'http://localhost:3001/api')
  }

  /**
   * Submit a booking to the database and send notification email
   */
  async submitBooking(bookingData: BookingData): Promise<BookingResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Booking submission error:', error)
      
      // For development, let's store in localStorage and send a mock email
      if (import.meta.env.DEV) {
        return this.handleDevSubmission(bookingData)
      }
      
      return {
        success: false,
        message: 'Failed to submit booking. Please try again or contact us directly.',
      }
    }
  }

  /**
   * Development fallback - store in localStorage and log
   */
  private async handleDevSubmission(bookingData: BookingData): Promise<BookingResponse> {
    try {
      // Store in localStorage for development
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const bookingId = `booking_${Date.now()}`
      
      const booking = {
        ...bookingData,
        id: bookingId,
      }
      
      existingBookings.push(booking)
      localStorage.setItem('bookings', JSON.stringify(existingBookings))
      
      // Log the booking data for development
      console.log('📅 New Booking Received:', booking)
      console.log('💌 Email would be sent to: hello@kristinmathilde.com')
      console.log('📧 Customer email:', bookingData.email)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        success: true,
        message: 'Booking submitted successfully! (Development mode)',
        bookingId,
      }
    } catch (error) {
      console.error('Dev submission error:', error)
      return {
        success: false,
        message: 'Failed to submit booking.',
      }
    }
  }

  /**
   * Get all bookings (for admin use)
   */
  async getBookings(): Promise<BookingData[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/bookings`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching bookings:', error)
      
      // Return localStorage bookings in development
      if (import.meta.env.DEV) {
        return JSON.parse(localStorage.getItem('bookings') || '[]')
      }
      
      return []
    }
  }

  /**
   * Send a test email (for testing purposes)
   */
  async sendTestEmail(): Promise<BookingResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return await response.json()
    } catch (error) {
      console.error('Test email error:', error)
      return {
        success: false,
        message: 'Failed to send test email.',
      }
    }
  }

  private getAuthToken(): string {
    // You would implement proper authentication here
    return localStorage.getItem('authToken') || ''
  }
}

// Export singleton instance
export const bookingService = new BookingService() 