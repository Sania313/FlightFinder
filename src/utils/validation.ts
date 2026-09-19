import { SearchParams } from '../models/flight';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export function validateSearch(params: SearchParams): ValidationResult {
  if (!params.origin.trim() || !params.destination.trim()) {
    return { isValid: false, message: 'Please enter both origin and destination.' };
  }

  if (params.origin.trim().toUpperCase() === params.destination.trim().toUpperCase()) {
    return { isValid: false, message: 'Origin and destination cannot be the same.' };
  }

  if (!params.departureDate) {
    return { isValid: false, message: 'Please select a departure date.' };
  }

  if (params.tripType === 'round-trip') {
    if (!params.returnDate) {
      return { isValid: false, message: 'Please select a return date.' };
    }
    if (new Date(params.returnDate) < new Date(params.departureDate)) {
      return { isValid: false, message: 'Return date cannot be earlier than departure date.' };
    }
  }

  if (params.passengers < 1) {
    return { isValid: false, message: 'At least 1 passenger is required.' };
  }

  return { isValid: true, message: '' };
}