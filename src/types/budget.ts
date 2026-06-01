export type BudgetPeriod = "weekly" | "monthly" | "yearly";

export type BudgetStatus =
  | "exceeded"
  | "warning"
  | "safe"
  | string;

// ── Usage / analytics ───────────────────────
export interface BudgetUsage {
  amount_limit: number;
  spent: number;
  remaining: number;
  percentage: number;

  is_exceeded: boolean;
  is_warning: boolean;

  status: BudgetStatus;

  period: BudgetPeriod;

  start_date: string;
  end_date: string;
}

// ── Main entity ─────────────────────────────
export interface Budget {
  budget_id: number;

  user_id: number;
  category_id: number;

  amount_limit: string;

  period: BudgetPeriod;

  start_date: string;

  created_at: string;
  updated_at: string;

  usage: BudgetUsage;
}

// ── Response shapes ─────────────────────────
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

// ── Payload shapes ──────────────────────────
export interface CreateBudgetPayload {
  category_id: number;

  amount_limit: number;

  period: BudgetPeriod;

  start_date: string;
}

export interface UpdateBudgetPayload
  extends Partial<CreateBudgetPayload> {}

// ── Filtering ───────────────────────────────
export interface BudgetFilters {
  category_id?: number;
  status?: BudgetStatus;
}