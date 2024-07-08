import { Logger } from '@nestjs/common';
import { IResponse } from '../interfaces/response.interface';

export class ResponseError implements IResponse {
  constructor(infoMessage: string, data?: any) {
    this.success = false;
    this.message = infoMessage;
    this.data = data;
    Logger.error(infoMessage, data);
    // this.logger.info('I am an info message!', {
    //   props: {
    //     foo: 'bar',
    //     baz: 'qux',
    //   },
    // });

    // console.warn(
    //   new Date().toString() +
    //     ' - [Response]: ' +
    //     infoMessage +
    //     (data ? ' - ' + JSON.stringify(data) : ''),
    // );
  }
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  success: boolean;
}

export class ResponseSuccess implements IResponse {
  constructor(infoMessage: string, data?: any, notLog?: boolean) {
    this.success = true;
    this.message = infoMessage;
    this.data = data;
    if (!notLog) {
      // Logger.log(this.success);
      // try {
      //   var offuscateRequest = JSON.parse(JSON.stringify(data));
      //   if (offuscateRequest && offuscateRequest.token)
      //     offuscateRequest.token = '*******';
      //   console.log(
      //     new Date().toString() +
      //       ' - [Response]: ' +
      //       JSON.stringify(offuscateRequest),
      //   );
      // } catch (error) {}
    }
  }
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  success: boolean;
}
