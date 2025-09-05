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

export interface InputOtpModalProps {
  openOtp: boolean,
  email: string,
  setOpenOtp: (value: boolean) => void
}