class apiError extends Error {
    constructor(
        Status,
        message = "something went wrong",
        errors = [],) 
    {
        super(message)
        this.message=message
        this.data=null
        this.Status=Status
        this.success=false
        this.errors=errors
    }
}

export {apiError}

//netstat -aon | findstr :8000
//taskkill /PID 1000 /F