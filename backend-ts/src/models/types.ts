// Types for the streaming availability API

export interface Show {
  ImdbId: string;
  Title: string;
  Year: string;
  Type: string;
  ImageUrl: string;
  ImdbRating: string;
  Overview: string;
  Genres?: string[];
  StreamingOptions?: {
    [country: string]: StreamingOption[];
  };
}

export interface ServiceInfo {
  service: string;
  streamingType: string;
  quality?: string;
  link: string;
  price?: {
    amount: number;
    currency: string;
    formatted: string;
  };
  addOn?: {
    name: string;
  };
}

// Original StreamingOption for backward compatibility
export interface StreamingOption {
  Service: {
    Name: string;
  };
  Type: string;
  Quality?: string;
  Price?: {
    Formatted: string;
  };
  Addon?: {
    Name: string;
  };
  Link: string;
}

export interface ApiResponse {
  result?: any[];
  shows?: Show[];
  hasMore?: boolean;
  page?: number;
  totalPages?: number;
  totalResults?: number;
}

export interface CachedData {
  timestamp: Date;
  shows: Show[];
}

export interface Cache {
  [key: string]: CachedData;
} 