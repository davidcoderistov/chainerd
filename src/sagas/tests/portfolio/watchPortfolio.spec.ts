import { takeLatest } from 'redux-saga/effects'
import watchPortfolio, {
    generateWeeklyData,
    generateMonthlyData,
    generateYearlyData,
    fetchLatestTransactions,
} from '../../portfolio'
import { portfolioActions } from '../../../slices/portfolio'


describe('Test *watchPortfolio saga', () => {
    const it = watchPortfolio()

    test('*watchPortfolio should watch for *generateWeeklyData saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(portfolioActions.fetchWeekly.type, generateWeeklyData),
            done: false,
        })
    })

    test('*watchPortfolio should watch for *generateMonthlyData saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(portfolioActions.fetchMonthly.type, generateMonthlyData),
            done: false,
        })
    })

    test('*watchPortfolio should watch for *generateYearlyData saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(portfolioActions.fetchYearly.type, generateYearlyData),
            done: false,
        })
    })

    test('*watchPortfolio should watch for *fetchLatestTransactions saga', () => {
        expect(it.next()).toEqual({
            value: takeLatest(portfolioActions.fetchLatestTransactions.type, fetchLatestTransactions),
            done: false,
        })
    })

    test('*watchPortfolio should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })
})