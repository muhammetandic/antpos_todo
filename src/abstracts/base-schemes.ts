export interface ISoftDeleted {
  isDeleted: boolean;
}

export interface IAuditable {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
