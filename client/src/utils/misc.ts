import _reduce from 'lodash/reduce'
import _sortBy from 'lodash/sortBy'

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

export function distribute (numbers: number[]) {
    const off = 100 - _reduce(numbers, function(acc, x) { return acc + Math.round(x) }, 0)
    return _sortBy(numbers, function(x: number) { return Math.round(x) - x }).map(function(x, i) {
        const add = off > i ? 1 : 0
        const sub = i >= (numbers.length + off) ? 1 : 0
        return Math.round(x) + add - sub
    })
}