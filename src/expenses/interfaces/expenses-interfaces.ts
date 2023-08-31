export interface Expense {
  expenseTypeName: string;
  expenseAmount: string;
  expenseCategoryName: string;
  expenseDate: string;
  expenseYear: string;
  expenseMonth: string;
  userEmail: string;
  id?: string;
}

export interface FormattedExpense {
  expense_type: string;
  expense_amount: string;
  expense_category: string;
  expense_date: string;
  expense_year: string;
  expense_month: string;
  id: string;
  user_email?: string;
  created_at?: Date;
  updated_at: Date;
}

export interface ExpensesCategories {
  expense_category: string;
  id: string;
  created_at: Date;
}

export interface ExpensesTypes {
  expense_type: string;
  expense_category: string;
  id: string;
  created_at: Date;
}

export interface TransformedExpenseMonth {
  expense_month: string;
}

export interface TransformedExpenseDate {
  expense_date: string;
}
