import { Request } from "express";

export type TUser = {
  id: string;
  email: string;
  role: string;
}

export type TRequest = Request & { user?: TUser };