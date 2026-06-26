export interface Rider {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: "YDM_Rider"; // since all shown are the same role
  franchise: string | null;
  factory?: string | null;
  address: string;
}

export interface RidersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rider[];
}

export interface RiderCommissionStats {
  commission_earned: number;
  lifetime_commission_earned: number;
  lifetime_commission_paid: number;
  remaining_balance: number;
}

export interface RiderPackageStats {
  packages_assigned: number;
  packages_delivered: number;
  total_packages_delivered_lifetime: number;
}

import { SaleItem } from "./sales";

export interface RiderOrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SaleItem[];
}

export interface RiderCommissionPayment {
  id: number;
  rider: string | number;
  amount: string;
  paid_at: string;
  remarks: string;
}

export interface RiderCommissionPaymentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RiderCommissionPayment[];
}


