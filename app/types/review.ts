/**
 * Review types and interfaces
 * Defines the shape of review data throughout the application
 */

/**
 * Core review interface matching Firestore schema
 */
export interface Review {
  // Required fields
  id: string; // Auto-generated document ID (Firebase)
  userId: string; // UID of the user who created the review
  userName: string; // Display name of the reviewer
  rating: number; // Rating from 1 to 5 (integer)
  reviewText: string; // Main review content (min 10 chars, max 2000 chars)
  mediaTitle: string; // Title of the media being reviewed
  mediaType: "movie" | "music" | "book"; // Type of media
  createdAt: string | Date; // ISO string or Date object of review creation

  // Optional fields
  mediaId?: string; // External ID for the media (e.g., IMDb ID, ISBN)
  updatedAt?: string | Date; // ISO string of last update
  tags?: string[]; // Optional tags for categorization
  helpful?: number; // Helpful votes counter (default: 0)
  unhelpful?: number; // Unhelpful votes counter (default: 0)
}

/**
 * Review form data (used when creating/updating reviews)
 */
export interface ReviewFormData {
  rating: number;
  reviewText: string;
  mediaId?: string;
  mediaTitle: string;
  mediaType: "movie" | "music" | "book";
  tags?: string[];
}

/**
 * Backend response types
 */
export interface ReviewResponse {
  success: boolean;
  review: Review;
  message?: string;
}

export interface ReviewsListResponse {
  count: number;
  reviews: Review[];
}

/**
 * Validation error types
 */
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
