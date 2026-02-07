import type { Church } from "@/api/churches";

export type BankAccount = {
  id: string;
  bank_name: unknown;
  account_number: string;
  account_holder_name: string;
  branch_name: string | null;
  swift_code: string | null;
  is_primary: boolean;
  is_active: boolean;
  church_id: string;
  created_at: string;
  updated_at: string;
};

export type ChurchImage = {
  id: string;
  church_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type TypedChurch = Church & {
  bank_accounts?: BankAccount[];
  church_images?: ChurchImage[];
};

export const categoryLabels: Record<string, string> = {
  church: "Church",
  monastery: "Monastery",
  "female-monastery": "Female Monastery",
};
