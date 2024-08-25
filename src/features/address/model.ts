export type AddressDto = {
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  district: string;
  city: string;
  country: string;
  identityNumber: string;
};

export type CreateAddressResponseDto = {
  id: string;
};
