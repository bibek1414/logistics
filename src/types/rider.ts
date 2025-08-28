export interface Rider {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: "YDM_Rider"; // since all shown are the same role
  franchise: string | null;
  address: string;
}

export type RidersResponse = Rider[];
