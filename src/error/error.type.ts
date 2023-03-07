export enum ErrorTypes {
  Operational,
  Programming,
}

export enum OperationalType {
  Database,
  Network,
  Overload,
  DuplicateRequest,
  RateLimit,
  // bad data
  InvalidInput,
}
