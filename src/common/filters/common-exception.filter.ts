import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private sendResponse(
    host: ArgumentsHost,
    status: number,
    errorResponse: object,
  ) {
    const { httpAdapter } = this.httpAdapterHost;
    const response = host.switchToHttp().getResponse();
    httpAdapter.reply(response, errorResponse, status);
  }

  private handleNonHttpException(host: ArgumentsHost) {
    const errorResponse = {
      resultCode: HttpStatus.INTERNAL_SERVER_ERROR,
      resultMsg: '알 수 없는 오류입니다.',
    };

    this.sendResponse(host, HttpStatus.INTERNAL_SERVER_ERROR, errorResponse);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const logMsg =
      exception instanceof Error ? exception.message : 'Unknown Error';
    this.logger.error(`[Exception] ${new Date().toISOString()} : ${logMsg}`);

    const isHttpException = exception instanceof HttpException;

    if (!isHttpException) {
      return this.handleNonHttpException(host);
    }
    const status = exception.getStatus();
    let resultMsg = exception.message;

    switch (status) {
      case 401:
        resultMsg = '사용할 수 없는 토큰입니다.';
        break;
    }
    const errorResponse = {
      resultCode: status,
      resultMsg,
    };

    this.sendResponse(host, status, errorResponse);
  }
}
