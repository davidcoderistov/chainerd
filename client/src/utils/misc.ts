
export function getAxiosErrorMessage (error: any, defaultMessage: string): string {
    return error && error.response && error.response.data && error.response.data.error ?
        error.response.data.error : defaultMessage
}

export function getGenericErrorMessage (error: any, defaultMessage: string): string {
    return error && error.message ? error.message : defaultMessage
}