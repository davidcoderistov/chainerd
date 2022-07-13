
export function getAxiosErrorMessage (error: any, defaultMessage: string): string {
    return error && error.response && error.response.data && error.response.data.error ?
        error.response.data.error : defaultMessage
}

export function getGenericErrorMessage (error: any, defaultMessage: string): string {
    return error && error.message ? error.message : defaultMessage
}

export function getErrorMessage (error: any, defaultMessage: string): string {
    if (error && error.message) {
        return error.message
    } else if (error && error.response && error.response.data && error.response.data.error) {
        return error.response.data.error
    } else {
        return defaultMessage
    }
}