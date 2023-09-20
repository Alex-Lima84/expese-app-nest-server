export class Income {
  incomeTypeName: string;
  incomeAmount: string;
  incomeDate: string;
  incomeYear: string;
  incomeMonth: string;
  userEmail: string;
  id?: string;
}

export class FormattedIncomes {
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

export class IncomesTypes {
  income_type: string;
  income_category: string;
  id: string;
  created_at: Date;
}

export class TransformedIncomeMonth {
  income_month: string;
}

export class TransformedIncomeDate {
  income_date: string;
}
