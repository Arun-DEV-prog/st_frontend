
// Used for displaying in the table
export interface Service {
  id: string;
  service: string;
  price: string;
  purchases: number;
  duration: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  publishStatus: 'published' | 'draft';
}

// Raw API specialist type (for future use if needed)
export interface SpecialistApi {
  id: string;
  title: string;
  slug: string;
  description: string;
  base_price: string;
  platform_fee_amount: string;
  final_price: string;
  verification_status: 'approved' | 'pending' | 'rejected';
  is_verified: boolean;
  is_draft: boolean;
  duration_days: number;
  average_rating: string;
  total_number_of_ratings: number;
  created_at: string;
  deleted_at: string | null;
  media: any[];
}

export type TabType = 'All' | 'Drafts' | 'Published';

export type SortDirection = 'asc' | 'desc';