class apiError extends Error {
    constructor(
        StatusCode,
        message = "something went wrong",
        errors = [],) 
    {
        super(message)
        this.message=message
        this.data=null
        this.StatusCode=StatusCode
        this.success=false
        this.errors=errors
    }
}

export {apiError}