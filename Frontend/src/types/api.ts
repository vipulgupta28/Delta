export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
    status: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
  
  export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
  }
  
  export interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    category?: string;
    tags?: string[];
  }
  