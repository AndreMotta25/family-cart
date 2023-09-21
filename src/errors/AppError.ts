interface IError {
  statusCode?: number;
  message: string;
}

class AppError {
  statusCode: number;
  message: string;

  constructor({ message, statusCode = 400 }: IError) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export { AppError };
