export class Result<T> {
  status: number;
  error?: string;
  data?: T;

  constructor(status: number);
  constructor(status: number, error: string);
  constructor(status: number, data: T);
  constructor(status: number, errorOrData?: string | T) {
    this.status = status;

    if (typeof errorOrData === "string") {
      this.error = errorOrData;
    } else {
      this.data = errorOrData;
    }
  }
}
