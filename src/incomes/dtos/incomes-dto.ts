export interface IncomeDto {
  incomeTypeName: string;
  incomeAmount: string;
  incomeDate: string;
  incomeYear: string;
  incomeMonth: string;
  userEmail: string;
  id?: string;
}

export interface FormattedIncomes {
  id: string;
  income_type: string;
  income_amount: string;
  income_date: string | number | Date;
  income_year: string;
  income_month: string;
  user_email: string;
  created_at: string;
  updated_at: string;
}

export interface IncomesTypes {
  income_type: string;
  income_category: string;
  id: string;
  created_at: Date;
}
