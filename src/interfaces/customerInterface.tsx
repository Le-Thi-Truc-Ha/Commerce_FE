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