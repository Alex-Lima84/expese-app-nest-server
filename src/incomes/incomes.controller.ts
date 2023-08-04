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

@Controller('incomes')
@UseGuards(JwtAuthGuard)
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) { }

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
}
