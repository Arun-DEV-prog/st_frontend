export interface Service {
  id: number;
  service: string;
  price: string;
  purchases: number;
  duration: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  publishStatus: 'published' | 'draft';
}

export type TabType = 'All' | 'Drafts' | 'Published';

export type SortDirection = 'asc' | 'desc';