import {
  Controller,
  Get,
  Param,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from 'src/jwt-guard/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('/:userEmail/:expenseQuantity')
  async getExpenses(
    @Param('userEmail') userEmail: string,
    @Param('expenseQuantity') expenseQuantity: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const expenses = await this.expensesService.getExpenses(
        userEmail,
        expenseQuantity,
      );
      res.json(expenses);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }
  @Get('/categories')
  async getExpensesCategories() {
    const expensesCategories =
      await this.expensesService.getExpensesCategories();
    return expensesCategories;
  }
}
