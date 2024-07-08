import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';
import { ResponseError, ResponseSuccess } from '../common/dto/response.dto';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const {
      httpVersion,
      url,
      currentUser,
      headers,
      method,
      baseUrl,
      originalUrl,
      params,
      query,
      body,
      ip,
    } = req;
    const startTime = Date.now(); // Capture request start time
    const timestamp = moment
      .unix(Math.floor(new Date().getTime() / 1000))
      .format('YYYY-MM-DD HH:mm:ss');

    const logMessage = `${timestamp} ${method} ${originalUrl} ${JSON.stringify(body)} ${JSON.stringify(params)} ${JSON.stringify(query)}`;

    res.on('finish', () => {
      let responseData = res.locals.responseData;
      let payload = res.locals.payload;
      let decryptedPayload = res.locals.decryptedPayload;

      // console.log(JSON.stringify(payload));
      // console.log(JSON.stringify(decryptedPayload));

      if (responseData instanceof ResponseError) {
        Logger.error(logMessage);
      } else if (responseData instanceof ResponseSuccess) {
        Logger.log(logMessage);
      }
    });

    res.on('close', () => {
      // const { statusCode } = res;
      // console.log(`${method} ${statusCode}`);
    });

    next();
  }
}
