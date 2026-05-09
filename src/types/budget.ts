export type BudgetStatus = "exceeded" | "warning" | "safe" | string;

export interface BudgetUsage {
  amount_limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  is_exceeded: boolean;
  is_warning: boolean;
  status: BudgetStatus;
}

export interface Budget {
  budget_id: number;
  user_id: number;
  category_id: number;
  amount_limit: string;
  due_date: string; // ISO 8601
  created_at: string;
  updated_at: string;
  usage: BudgetUsage;
}

// ── Response shapes ──────────────────────────

export interface BudgetMutationResponse {
  success: boolean;
  message: string;
  data: Budget;
}

export interface GetAllBudgetsResponse {
  success: boolean;
  data: Budget[];
}

export interface GetBudgetByIdResponse {
  success: boolean;
  data: Budget;
}

// ── Payload shapes ───────────────────────────

export interface CreateBudgetPayload {
  user_id: number;
  category_id: number;
  amount_limit: string;
  due_date: string;
}

export interface UpdateBudgetPayload extends Partial<CreateBudgetPayload> {}

export interface BudgetFilters {
  user_id?: number;
  category_id?: number;
  status?: BudgetStatus;
}