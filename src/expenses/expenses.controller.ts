import {
  Controller,
  Get,
  Param,
  Res,
  HttpStatus,
  UseGuards,
  Body,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from 'src/jwt-guard/jwt-auth.guard';
import { ExpenseEntryDto } from './dtos/expense-entry-dto';

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
        console.log('erro no e-mail');
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
  async getExpensesCategories(@Res() res: Response) {
    try {
      const expensesCategories =
        await this.expensesService.getExpensesCategories();
      res.json(expensesCategories);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Get('/types/:userEmail/:categoryId')
  async getExpenseTypes(
    @Param('userEmail') userEmail: string,
    @Param('categoryId') categoryId: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        console.log('erro no e-mail');
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const expenseTypes = await this.expensesService.getExpenseTypes(
        userEmail,
        categoryId,
      );
      res.json(expenseTypes);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Post('/expense-entry')
  async createExpenseEntry(
    @Body() expenseEntryDto: ExpenseEntryDto,
    @Res() res: Response,
  ) {
    try {
      const {
        expenseTypeName,
        expenseAmount,
        expenseCategoryName,
        expenseDate,
        expenseYear,
        expenseMonth,
        userEmail,
      } = expenseEntryDto;
      const id = uuidv4();
      const newExpense = await this.expensesService.createExpenseEntry({
        expenseTypeName,
        expenseAmount,
        expenseCategoryName,
        expenseDate,
        expenseYear,
        expenseMonth,
        id,
        userEmail,
      });
      res.json(newExpense);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }
}
