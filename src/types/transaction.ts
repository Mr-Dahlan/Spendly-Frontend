export type TransactionType = "income" | "expense" | string;

export interface Transaction {
  transaction_id: number;
  user_id: number;
  category_id: number;
  type: TransactionType;
  amount: string;
  description: string;
  transaction_date: string; // ISO 8601
  created_at: string;
  updated_at: string;
}

export interface TransactionSummary {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface GetAllTransactionsResponse {
  success: boolean;
  summary: TransactionSummary;
  data: Transaction[];
}

export interface CreateTransactionPayload {
  user_id: number;
  category_id: number;
  type: TransactionType;
  amount: string;
  description: string;
  transaction_date: string;
}

export interface UpdateTransactionPayload extends Partial<CreateTransactionPayload> {}

export interface TransactionFilters {
  user_id?: number;
  category_id?: number;
  type?: TransactionType;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}