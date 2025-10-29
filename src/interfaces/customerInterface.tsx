import type { Dispatch, SetStateAction } from "react"
import type { ProductionCardProps, RawProduction } from "./appInterface"
import type { Dayjs } from "dayjs"

export interface AddressInformation {
  id: number,
  name: string,
  phone: string,
  address: string,
  longitude: number,
  latitude: number
}

export interface AddressInput {
  name: string,
  phone: string,
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
  statusCart: number,
  statusProduct: number
}

export interface ProductionFavouriteProps {
  id: number,
  productCard: ProductionCardProps
  setFavouriteList: Dispatch<SetStateAction<FavouriteListProps[]>>,
  type: string,
  setTotal: Dispatch<SetStateAction<number>>,
  take: number
}

export interface AddCartModalProps {
  openAddCart: boolean,
  setopenAddCart: Dispatch<SetStateAction<boolean>>,
  productId: number,
  variantId: number | null,
  quantity: number | null,
  cartId: number | null,
  cartList: CartProduct[] | null,
  setCartList: Dispatch<SetStateAction<CartProduct[]>> | null,
  indexOfCart: number | null,
  setTotalPrice: Dispatch<SetStateAction<number[]>> | null,
  setQuantityOrderList: Dispatch<SetStateAction<number[]>> | null
}

export interface AddressListModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  setName: Dispatch<SetStateAction<string>>,
  setPhone: Dispatch<SetStateAction<string>>,
  setDetailAddress: Dispatch<SetStateAction<string>>,
  setRegionAddress: Dispatch<SetStateAction<string>>,
  setLongitude: Dispatch<SetStateAction<number>>,
  setLatitude: Dispatch<SetStateAction<number>>,
  setRegionArray: Dispatch<SetStateAction<string[]>>,
  setRegionObj: Dispatch<SetStateAction<{cityCode: number | null, districtCode: number | null, wardCode: number | null}>>
  setGetAddressLoading: Dispatch<SetStateAction<boolean>>,
  cityList: any[],
  setDistrictList: Dispatch<SetStateAction<any[]>>,
  setWardList: Dispatch<SetStateAction<any[]>>
}

export interface ShipVoucher {
  id: number,
  code: string,
  name: string,
  discountPercent: number,
  startDate: Dayjs,
  endDate: Dayjs,
  description: string,
  type: number,
  condition: number
}

export interface ProductVoucher {
  id: number,
  code: string,
  name: string,
  discountPercent: number,
  startDate: Dayjs,
  endDate: Dayjs,
  description: string,
  type: number,
  condition: number,
  productId: number[]
}

export interface VoucherModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  shipVoucherList: ShipVoucher[],
  productVoucherList: ProductVoucher[]
  productVoucherSelect: number,
  setProductVoucherSelect: Dispatch<SetStateAction<number>>,
  shipVoucherSelect: number,
  setShipVoucherSelect: Dispatch<SetStateAction<number>>,
  setProductDiscount: Dispatch<SetStateAction<number>>,
  setShipDiscount: Dispatch<SetStateAction<number>>,
  totalPriceProductType3: number,
  totalPrice: number,
  shippingFee: number
}