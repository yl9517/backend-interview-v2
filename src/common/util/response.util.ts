export class ResponseUtil {
  static success<T>(data?: T) {
    if (data) {
      return {
        resultCode: 200,
        resultMsg: 'OK',
        ...data,
      };
    }
    return {
      resultCode: 200,
      resultMsg: 'OK',
    };
  }
}
