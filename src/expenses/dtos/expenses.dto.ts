export class ExpenseDTO {
  expenseTypeName: string;
  expenseAmount: string;
  expenseCategoryName: string;
  expenseDate: string;
  expenseYear: string;
  expenseMonth: string;
  userEmail: string;
  id?: string;
}

export class FormattedExpense {
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

export class ExpensesCategories {
  expense_category: string;
  id: string;
  created_at: Date;
}

export class ExpensesTypes {
  expense_type: string;
  expense_category: string;
  id: string;
  created_at: Date;
}

export class TransformedExpenseMonth {
  expense_month: string;
}

export class TransformedExpenseDate {
  expense_date: string;
}
