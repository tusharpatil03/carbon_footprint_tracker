class HandleError extends Error {
  status: number;
  name: string;
  constructor(name: string, message: string, status: number) {
    super(message);
    this.message = message;
    this.name = name;
    this.status = status;
  }
}

export default HandleError;
