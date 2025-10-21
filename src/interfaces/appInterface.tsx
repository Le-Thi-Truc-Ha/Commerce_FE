import type { Dayjs } from "dayjs";
import { motion, type MotionProps } from "framer-motion";

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

export interface ModalLoadingProps {
  message: string,
  open: boolean
}

export interface GoogleUser {
  name: string,
  email: string,
  idToken: string,
  uid: string
}

export interface LoadingModalProps {
  message: string,
  open: boolean
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

export interface ProductionCardProps {
  productId: number,
  url: string,
  name: string,
  price: number,
  star: number,
  discount: string | null,
  category: string,
  isLike: boolean,
  status: number,
  saleFigure: number
}

export interface RawProduction {
  category: {id: number, parentId: number | null},
  id: number, 
  favourites: {id: number}[],
  medias: {url: string}[], 
  name: string, 
  productPromotions: {promotion: {percent: number}}[],
  productVariants: {price: number}[], 
  rateStar: number,
  status: number,
  saleFigure: number
}

export const MotionDiv = motion.div
export const divConfig: MotionProps = {
  initial: {opacity: 0},
  animate: {opacity: 1},
  exit: {opacity: 0},
  transition: {duration: 0.3}
}