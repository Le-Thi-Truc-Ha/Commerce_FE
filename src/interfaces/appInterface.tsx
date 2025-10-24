import type dayjs from "dayjs";
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

export interface ProductDetail {
  id: number,
  name: string,
  percent: number | null,
  variant: {
    id: number, 
    color: string,
    size: string, 
    price: number, 
    quantity: number
  }[],
  size: string[],
  color: string[],
  isLike: boolean,
  image: string[],
  description: string,
  totalRate: number,
  averageStar: number,
  rate: {
    id: number,
    createAt: Dayjs,
    accountId: number,
    name: string,
    star: number,
    content: string,
    url: string[]
    size: string,
    color: string
  }[]
}

export interface RawProductDetail {
  count: number,
  product: {
    id: number,
    name: string,
    description: string,
    rateStar: number | null,
    favourites: {
      id: number,
    }[],
    medias: {
      url: string,
    }[],
    productPromotions: {
      promotion: {
        percent: number,
      } | null,
    }[],
    productVariants: {
      id: number,
      price: number,
      quantity: number,
      size: string,
      color: string,
    }[],
  },
  rate: {
    id: number;
    medias: {
      url: string;
    }[];
    productVariant: {
      id: number;
      size: string;
      color: string;
    };
    account: {
      id: number;
      email: string;
      };
    content: string;
    feeedbackDate: Date;
    star: number;
  }[]
}

export const MotionDiv = motion.div
export const divConfig: MotionProps = {
  initial: {opacity: 0},
  animate: {opacity: 1},
  exit: {opacity: 0},
  transition: {duration: 0.3}
}

export const configProvider = {
  Input: {
    borderRadius: 20,
    activeBorderColor: "var(--color6)",
    activeShadow: "0 0 0 2px var(--color2)",
    hoverBorderColor: "var(--color4)",
  },
  DatePicker: {
    borderRadius: 20,
    activeBorderColor: "var(--color6)",
    activeShadow: "0 0 0 2px var(--color2)",
    hoverBorderColor: "var(--color4)",
  },
  Select: {
    borderRadius: 20,
    activeBorderColor: "var(--color6)",
    activeOutlineColor: "var(--color2)",
    hoverBorderColor: "var(--color4)",
    optionActiveBg: "var(--color2)",
    controlItemBgActive: "var(--color4)"
  },
  Button: {
    defaultActiveBorderColor: "var(--color7)",
    defaultActiveColor: "var(--color7)",
    defaultHoverBorderColor: "var(--color6)",
    defaultHoverColor: "var(--color6)",
    defaultShadow: "0 0 0 black",

    colorPrimary: "var(--color5)",
    colorPrimaryActive: "var(--color6)",
    colorPrimaryHover: "var(--color4)",
    primaryShadow: "0 0 0 black",
    colorPrimaryTextHover: "var(--color4)",
    colorPrimaryTextActive: "var(--color6)"
  },
  Checkbox: {
    colorPrimary: "var(--color7)",
    colorPrimaryHover: "var(--color6)"
  },
  Divider: {
    colorSplit: "rgba(0, 0, 0, 0.5)",
  },
  Radio: {
    colorPrimaryActive: "var(--color7)",
    colorPrimary: "var(--color6)",
    colorPrimaryHover: "var(--color5)",
    colorPrimaryBorder: "var(--color8)"
  }
}