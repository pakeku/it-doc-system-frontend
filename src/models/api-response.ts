import { AppError } from "./app-error";

export interface ApiResponse {
  data: any | null;
  error: AppError | null;
}
