import type { Dispatch, SetStateAction } from "react"
import type { ProductionCardProps, RawProduction } from "./appInterface"

export interface AddressInformation {
    id: number,
    name: string,
    phone: string,
    address: string
}

export interface AddressInput {
    name: string,
    phone: string,
    city: number | null,
    district: number | null,
    ward: number | null,
    detail: string,
    isDefault: boolean
}

export interface CreateAddressModalProps {
    openModal: boolean,
    setOpenModal: (value: boolean) => void,
    addressList: AddressInformation[],
    setAddressList: (value: AddressInformation[]) => void,
    mode: string,
    setMode: (value: string) => void,
    setAddressDefault: (value: number) => void
}

export interface FeedbackModalProps {
    openModal: boolean,
    setOpenModal: (value: boolean) => void
}

export interface FavouriteListProps {
  id: number,
  productCard: ProductionCardProps
}
export interface RawFavourite {
  id: number,
  product: RawProduction
}

export interface CartProduct {
  productId: number,
  productVariantId: number,
  cartId: number,
  parentCategory: string,
  url: string, 
  name: string, 
  price: number, 
  discount: number | null
  color: string, 
  size: string, 
  quantityOrder: number,
  quantity: number,
  status: number
}

export interface ProductionFavouriteProps {
    id: number,
    productCard: ProductionCardProps
    setFavouriteList: Dispatch<SetStateAction<FavouriteListProps[]>>,
    type: string,
    setTotal: Dispatch<SetStateAction<number>>,
    take: number
}