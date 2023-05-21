interface ErrorResponse {
  code: 200 | 201 | 204 | 400 | 404 | 500 | 403 | 401;
  data: null;
  error: string;
  message: string;
  success: boolean;
}
