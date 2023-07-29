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

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class IncomesController {
  constructor(private readonly expensesService: IncomesService) {}
}
