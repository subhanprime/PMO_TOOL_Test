class CustomError extends Error {
    statusCode: any;
    constructor(message: string, statusCode: any) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
        this.statusCode = statusCode;
    }
}

export default CustomError;