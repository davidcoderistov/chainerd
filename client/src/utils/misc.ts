import _reduce from 'lodash/reduce'
import _sortBy from 'lodash/sortBy'
import _sum from 'lodash/sum'

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
    const distributed: {[a: number]: number } = _sortBy(numbers, function(x: number) { return Math.round(x) - x }).reduce(function(acc, x, i) {
        const add = off > i ? 1 : 0
        const sub = i >= (numbers.length + off) ? 1 : 0
        return {
            ...acc,
            [x]: Math.round(x) + add - sub
        }
    }, {})
    return numbers.map(number => distributed[number])
}

export function distributePercentages (numbers: number[]) {
    const sum = _sum(numbers)
    if (sum > 0) {
        const percentages = numbers.map(number => number / sum * 100)
        return distribute(percentages)
    }
    return numbers
}