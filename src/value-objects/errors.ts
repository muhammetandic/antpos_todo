export class MongoDbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MongoDbError";
  }
}
