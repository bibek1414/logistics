// Represents each contact number entry
type FranchiseContact = {
  first_name: string;
  last_name: string;
  phone_number: string;
};

// Represents each franchise object
export interface Franchise {
  id: number;
  name: string;
  short_form: string | null;
  distributor: number;
  new_order_count: number;
  franchise_contact_numbers: FranchiseContact[];
}

// Represents the full dataset
export type FranchiseList = Franchise[];
