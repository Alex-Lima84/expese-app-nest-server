import {
  Controller,
  Get,
  Param,
  Res,
  HttpStatus,
  UseGuards,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from 'src/jwt-guard/jwt-auth.guard';
import { ExpenseDto } from './dtos/expenses-dto';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('entries/:userEmail/:expenseQuantity')
  async getExpenses(
    @Param('userEmail') userEmail: string,
    @Param('expenseQuantity') expenseQuantity: string,
    @Res() res: Response,
  ) {
    console.log(userEmail);
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

  @Get('/expense/:userEmail/:id')
  async getExpenseInfo(
    @Param('userEmail') userEmail: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const expenseInfo = await this.expensesService.getExpenseInfo(
        userEmail,
        id,
      );
      res.json(expenseInfo);
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
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const expenseTypes = await this.expensesService.getExpensesTypes(
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

  @Get('/expenses-years/:userEmail')
  async getExpensesYears(
    @Param('userEmail') userEmail: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        console.log('erro no e-mail');
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const expenses = await this.expensesService.getExpensesYears(userEmail);
      res.json(expenses);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Get('/expenses-month/:expenseYear/:userEmail')
  async getExpenseMonthsByYear(
    @Param('userEmail') userEmail: string,
    @Param('expenseYear') expenseYear: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const expenseMonthsByYear =
        await this.expensesService.getExpenseMonthsByYear(
          userEmail,
          expenseYear,
        );
      res.json(expenseMonthsByYear);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Get('/expenses-month/:expenseMonth/:currentExpenseYear/:userEmail')
  async getExpensesByMonthAndYear(
    @Param('userEmail') userEmail: string,
    @Param('expenseMonth') expenseMonth: string,
    @Param('currentExpenseYear') currentExpenseYear: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const expenseMonthsByYear =
        await this.expensesService.getExpensesByMonthAndYear(
          userEmail,
          expenseMonth,
          currentExpenseYear,
        );
      res.json(expenseMonthsByYear);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Post('/expense-entry')
  async createExpenseEntry(
    @Body() expenseEntryDto: ExpenseDto,
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
      const newExpense = await this.expensesService.createExpensesEntry({
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

  @Put('/expense/:userEmail/:id')
  async editExpense(
    @Body() expenseUpdateDto: ExpenseDto,
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
        id,
      } = expenseUpdateDto;
      const editExpense = await this.expensesService.editExpense({
        expenseTypeName,
        expenseAmount,
        expenseCategoryName,
        expenseDate,
        expenseYear,
        expenseMonth,
        id,
        userEmail,
      });
      res.json(editExpense);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Delete('/expense/:userEmail/:id')
  async deleteExpense(
    @Param('userEmail') userEmail: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const deleteExpense = await this.expensesService.deleteExpense(
        userEmail,
        id,
      );
      res.json(deleteExpense);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }
}
