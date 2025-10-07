import type { Dayjs } from "dayjs";

export interface BackendResponse {
  message: string,
  data: any,
  code: number
}

type MessageFuncs = {
  success: (content: string) => void;
  error: (content: string) => void;
};

export const messageService: MessageFuncs = {
  success: () => {},
  error: () => {},
};

export interface GoogleUser {
  name: string,
  email: string,
  idToken: string,
  uid: string
}

export interface InputEmailModalProps {
  openEmail: boolean,
  setOpenEmail: (value: boolean) => void
}

export interface AccountInformation {
  email: string,
  name: string,
  dob: Dayjs | null,
  gender: string | null,
  password: string
}

export interface InputOtpModalProps {
  openOtp: boolean,
  email: string,
  expiryOtp: number,
  verifyEmail: boolean,
  accountInformation: AccountInformation | null,
  setOpenOtp: (value: boolean) => void,
  setExpiryOtp: (value: number) => void,
  sendOtp: (value: string, isLoading: boolean) => void
}

export interface ResetPasswordModalProps {
  openReset: boolean,
  email: string,
  setOpenReset: (value: boolean) => void
}