import _reduce from 'lodash/reduce'
import _sortBy from 'lodash/sortBy'
import _sum from 'lodash/sum'
import moment from 'moment'

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

export function getAgo (timestamp: string): string {
    const now = moment()
    const start = moment.unix(Number(timestamp))
    if (now.diff(start, 'minutes') < 1) {
        const seconds = now.diff(start, 'seconds')
        return `${seconds} ${seconds > 1 ? 'seconds' : 'second'} ago`
    } else if (now.diff(start, 'hours') < 1) {
        const minutes = now.diff(start, 'minutes')
        return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`
    } else if (now.diff(start, 'days') < 1) {
        const hours = now.diff(start, 'hours')
        return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`
    } else if (now.diff(start, 'weeks') < 1) {
        const days = now.diff(start, 'days')
        return `${days} ${days > 1 ? 'days' : 'day'} ago`
    } else {
        return start.format('LLL')
    }
}