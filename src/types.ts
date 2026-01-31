export interface Transaction {
  id: string;
  customerName: string;
  amount: number;
  isPaid: boolean;
  date: string;
  notes: string;
  createdAt: string;
  isHiddenFromRecent?: boolean;
  description?: string;
}

export interface CustomerSummary {
  name: string;
  transactions: Transaction[];
  lastTransaction: string;
}
