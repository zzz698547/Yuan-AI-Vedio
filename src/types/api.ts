export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  error: string;
};
