export class CommandInvalidException extends Error {
  constructor() {
    super();
    this.name = "CommandInvalidException";
  }
}

export class UnknownOutputException extends Error {
  constructor() {
    super();
    this.name = "UnknownOutputException";
  }
}

export class CodeNotFoundException extends Error {
  constructor() {
    super();
    this.name = "CodeNotFoundException";
  }
}

export class InvalidImeiException extends Error {
  constructor() {
    super();
    this.name = "InvalidImeiException";
  }
}
