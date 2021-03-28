class HttpError extends Error {
  constructor(name, httpStatusCode, message) {
    super(message);
    this.name = name;
    this.httpStatusCode = httpStatusCode;
  }
}

module.exports = HttpError;
