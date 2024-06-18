import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ReqLoggerMiddleware implements NestMiddleware {
  private logger: Logger
  use(req: any, res: any, next: () => void) {
    this.logger.log(req)
    next();
  }
}
