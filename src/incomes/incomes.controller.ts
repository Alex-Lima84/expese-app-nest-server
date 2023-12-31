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
import { IncomesService } from './incomes.service';
import { JwtAuthGuard } from 'src/jwt-guard/jwt-auth.guard';
import { Income } from './dtos/incomes.dto';

@Controller('incomes')
@UseGuards(JwtAuthGuard)
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Get('/:userEmail')
  async getIncomes(
    @Param('userEmail') userEmail: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        console.log('erro no e-mail');
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const incomes = await this.incomesService.getIncomes(userEmail);
      res.json(incomes);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Get('income/:userEmail/:id')
  async getIncomeInfo(
    @Param('userEmail') userEmail: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        console.log('erro no e-mail');
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const incomeInfo = await this.incomesService.getIncomeInfo(userEmail, id);
      res.json(incomeInfo);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Get('/income-types/:userEmail')
  async getIncomesTypes(
    @Param('userEmail') userEmail: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const incomeTypes = await this.incomesService.getIncomesTypes(userEmail);
      res.json(incomeTypes);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Get('/incomes-years/:userEmail')
  async getIncomesYears(
    @Param('userEmail') userEmail: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        console.log('erro no e-mail');
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const incomesYears = await this.incomesService.getIncomesYears(userEmail);
      res.json(incomesYears);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Get('/incomes-month/:incomeYear/:userEmail')
  async getIncomeMonthsByYear(
    @Param('userEmail') userEmail: string,
    @Param('incomeYear') incomeYear: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const incomeMonthsByYear =
        await this.incomesService.getIncomeMonthsByYear(userEmail, incomeYear);
      res.json(incomeMonthsByYear);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Get('/incomes-month/:incomeMonth/:currentIncomeYear/:userEmail')
  async getIncomesByMonthAndYear(
    @Param('userEmail') userEmail: string,
    @Param('incomeMonth') incomeMonth: string,
    @Param('currentIncomeYear') currentIncomeYear: string,
    @Res() res: Response,
  ) {
    try {
      const request = res.req;
      if (userEmail !== request['userEmail']) {
        return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
      }

      const incomesByMonthAndYear =
        await this.incomesService.getIncomesByMonthAndYear(
          userEmail,
          incomeMonth,
          currentIncomeYear,
        );

      res.json(incomesByMonthAndYear);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Post('/income-entry')
  async createIncomeEntry(
    @Body() incomeEntryDto: Income,
    @Res() res: Response,
  ) {
    try {
      const {
        incomeTypeName,
        incomeAmount,
        incomeDate,
        incomeYear,
        incomeMonth,
        userEmail,
      } = incomeEntryDto;
      const id = uuidv4();

      const newIncome = await this.incomesService.createIncomeEntry({
        incomeTypeName,
        incomeAmount,
        incomeDate,
        incomeYear,
        incomeMonth,
        id,
        userEmail,
      });

      res.json(newIncome);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Put('/income/:userEmail/:id')
  async editIncome(@Body() incomeUpdateDto: Income, @Res() res: Response) {
    try {
      const {
        incomeTypeName,
        incomeAmount,
        incomeDate,
        incomeYear,
        incomeMonth,
        userEmail,
        id,
      } = incomeUpdateDto;
      const editIncome = await this.incomesService.editIncome({
        incomeTypeName,
        incomeAmount,
        incomeDate,
        incomeYear,
        incomeMonth,
        id,
        userEmail,
      });
      res.json(editIncome);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }

  @Delete('/income/:userEmail/:id')
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

      const deleteIncome = await this.incomesService.deleteIncome(
        userEmail,
        id,
      );
      res.json(deleteIncome);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred' });
    }
  }
}
