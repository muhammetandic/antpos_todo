import { Result } from "../../abstracts/commons.js";
import { status } from "../../helpers/response.js";
import { EmptyResponse } from "../todo/models.js";
import { AddressDto, CreateAddressResponseDto } from "./model.js";
import { Address, IAddress } from "./schema.js";

export const createAddressAsync = async (
  currentUser: string,
  dto: AddressDto,
): Promise<Result<CreateAddressResponseDto>> => {
  const address = new Address<IAddress>({
    phone: dto.phone,
    email: dto.email,
    addressLine1: dto.addressLine1,
    addressLine2: dto.addressLine2,
    district: dto.district,
    city: dto.city,
    country: dto.country || "TR",
    identityNumber: dto.identityNumber,
    createdAt: new Date(Date.now()),
    createdBy: currentUser,
    isDeleted: false,
  });

  await address.save();
  const data = { id: address._id.toString() } as CreateAddressResponseDto;
  return new Result(status.Created, data);
};

export const getAllAddressesAsync = async (): Promise<Result<AddressDto[]>> => {
  const addresses = await Address.find({ isDeleted: false }).lean();
  const result = addresses?.map((address) => ({
    id: address._id,
    phone: address.phone,
    email: address.email,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    district: address.district,
    city: address.city,
    country: address.country,
    identityNumber: address.identityNumber,
  }));
  return new Result(status.Ok, result);
};

export const getAddressByIdAsync = async (id: string): Promise<Result<AddressDto>> => {
  const address = await Address.findOne({ _id: id, isDeleted: false }).lean();
  if (!address) {
    return new Result(status.NotFound, {} as AddressDto);
  }

  const result = {
    id: address._id,
    phone: address.phone,
    email: address.email,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    district: address.district,
    city: address.city,
    country: address.country,
    identityNumber: address.identityNumber,
  };
  return new Result(status.Ok, result);
};

export const updateAddressAsync = async (
  currentUser: string,
  id: string,
  dto: AddressDto,
): Promise<Result<EmptyResponse>> => {
  const address = await Address.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      phone: dto.phone,
      email: dto.email,
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      district: dto.district,
      city: dto.city,
      country: dto.country,
      identityNumber: dto.identityNumber,
      updatedBy: currentUser,
      updatedAt: new Date(Date.now()),
    },
    { new: true },
  );

  if (!address) {
    return new Result(status.NotFound, "Address not found");
  }
  return new Result(status.NoContent, {});
};

export const removeAddressAsync = async (currentUser: string, id: string): Promise<Result<EmptyResponse>> => {
  const address = await Address.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
    },
    { new: true },
  );

  if (!address) {
    return new Result(status.NotFound, "Address not found");
  }
  return new Result(status.NoContent, {});
};
