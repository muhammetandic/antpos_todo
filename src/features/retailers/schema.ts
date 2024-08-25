import { IAuditable, ISoftDeleted } from "../../abstracts/base-schemes.js";

export interface ICustomer extends ISoftDeleted, IAuditable {
  email?: string;
  phone: string;
  name: string;
  defaultAddress: string;
  invoiceAddress: string;
  identityNumber: string;
}
