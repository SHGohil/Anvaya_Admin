export interface HttpResponse<T> {
    err: {
      error: string;
      message: string;
      name: string;
      code: number;
    } | undefined | null;
    data: T | null;
  }