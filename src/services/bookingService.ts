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
    // Strict: require VITE_API_BASE_URL to be set
    if (!import.meta.env.VITE_API_BASE_URL) {
      throw new Error('VITE_API_BASE_URL environment variable must be set!');
    }
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // Debug logging
    console.log('🔧 API Base URL:', this.apiBaseUrl);
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
      return {
        success: false,
        message: 'Failed to submit booking. Please try again or contact us directly.',
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