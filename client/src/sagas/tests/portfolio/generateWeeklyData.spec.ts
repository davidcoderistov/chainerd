import { put, call, select, all } from 'redux-saga/effects'
import { generateWeeklyData, generateBalances, generatePortfolioData } from '../../portfolio'
import { portfolioActions } from '../../../slices/portfolio'
import { getBlockNumber, getEthPriceAt } from '../../../services'
import { getNetwork } from '../../../selectors/network'
import { getWeeklyData, toRoundedEth, toRoundedFiat } from '../../../utils'
import moment from 'moment'


describe('Test *generateWeeklyData saga', () => {
    const startBlock = 'startBlock'
    const endBlock = 'endBlock'
    const network = 'mainnet'
    const balances = [
        {
            balance: '300000000000000000',
            timestamp: '1657019657000',
        },
        {
            balance: '743000000000000000',
            timestamp: '1649157257000',
        },
        {
            balance: '1323400000000000000',
            timestamp: '1652008457000',
        },
    ]

    const payload = { address: '0x4281eCF07378Ee595C564a59048801330f3084eE' }
    const it = generateWeeklyData(portfolioActions.fetchWeekly(payload))

    let start: moment.Moment, end: moment.Moment

    beforeAll(() => {
        const now = moment()
        start = now.clone().subtract(1, 'week')
        end = now.clone()
    })

    test('*generateWeeklyData should select network', () => {
        expect(it.next()).toEqual({
            value: select(getNetwork),
            done: false,
        })
    })

    test('*generateWeeklyData should call get start block', () => {
        // @ts-ignore
        expect(it.next(network)).toEqual({
            value: call(getBlockNumber, start.unix(), network),
            done: false,
        })
    })

    test('*generateWeeklyData should call get end block', () => {
        // @ts-ignore
        expect(it.next(startBlock)).toEqual({
            value: call(getBlockNumber, end.unix(), network),
            done: false,
        })
    })

    test('*generateWeeklyData should call *generateBalances saga', () => {
        // @ts-ignore
        expect(it.next(endBlock)).toEqual({
            value: call(
                generateBalances,
                { address: payload.address, startBlock, endBlock }
            ),
            done: false,
        })
    })

    test('*generateWeeklyData should call get eth prices', () => {
        const ethData = getWeeklyData(start, end, balances, '0')

        // @ts-ignore
        expect(it.next({ balances })).toEqual({
            value: all(
                ethData.map(({ x }) => {
                    const [year, month, day] = x.split('-')
                    return call(getEthPriceAt, `${day}-${month}-${year}`)
                })
            ),
            done: false,
        })
    })

    test('*generateWeeklyData should call *generatePortfolio saga', () => {
        const ethData = getWeeklyData(start, end, balances, '0')
        const ethPrices = ['2200', '3200', '1500']

        // @ts-ignore
        expect(it.next(ethPrices)).toEqual({
            value: call(
                generatePortfolioData,
                { ethData, ethPrices, hasBalances: balances.length > 0, address: payload.address, }
            ),
            done: false,
        })
    })

    test('*generateWeeklyData should dispatch fulfilled action', () => {
        const ethData = getWeeklyData(start, end, balances, '0')
        const ethPrices = ['2200', '3200', '1500']
        const portfolioData = {
            ethData: ethData.map(({ x, y }) => ({
                x,
                y: toRoundedEth(Number(y))
            })),
            fiatData: ethData.map(({ x, y }, index) => ({
                x,
                y: toRoundedFiat(Number(ethPrices[index]) * Number(y))
            }))
        }
        // @ts-ignore
        expect(it.next(portfolioData)).toEqual({
            value: put(portfolioActions.fetchWeeklyFulfilled({
                address: payload.address,
                data: {
                    eth: portfolioData.ethData,
                    fiat: portfolioData.fiatData
                }
            })),
            done: false,
        })
    })

    test('*generateWeeklyData should terminate', () => {
        expect(it.next()).toEqual({
            value: undefined,
            done: true,
        })
    })

})