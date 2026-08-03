export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  created_at: string;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  item_type: 'lost' | 'found';
  location: string;
  date_event: string;
  status: 'open' | 'matched' | 'claimed' | 'resolved';
  image_url?: string;
  tags?: string;
  reward_amount?: number;
  secret_verification_question?: string;
  user_id?: number;
}

export interface Match {
  id: number;
  lost_item: Item;
  found_item: Item;
  match_score: number;
  status: string;
  ai_explanation?: string;
  created_at: string;
}

export interface Claim {
  id: number;
  item_id: number;
  claimant_id: number;
  proof_description: string;
  verification_answer?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  item?: Item;
}

export interface DashboardStats {
  total_lost: number;
  total_found: number;
  active_matches: number;
  resolved_count: number;
  success_rate_percent: number;
}
