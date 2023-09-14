import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWTSECRET);
      request['userEmail'] = decoded.email;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
