import moment from 'moment'
import _groupBy from 'lodash/groupBy'

function getLatestBalances (
    balances: Array<{ balance: string, timestamp: string }>,
    groupBy: (balance: { balance: string, timestamp: string }) => string
): { [timeSignature: string]: string} {
    const groupedBalances = _groupBy(balances, groupBy)
    return Object.keys(groupedBalances).reduce((accum, timeSignature) => ({
        ...accum,
        [timeSignature]: groupedBalances[timeSignature][groupedBalances[timeSignature].length - 1].balance
    }), {})
}

function generateDays (start: moment.Moment, end: moment.Moment): Array<moment.Moment> {
    const currDay = start.clone()
    const days = []
    while (currDay.isSameOrBefore(end, 'day')) {
        days.push(currDay.clone())
        currDay.add(1, 'day')
    }
    return days
}

function getDailyKey (date: moment.Moment): string {
    return date.format('YYYY-MM-DD')
}

function generateDailyPoints ({ days, balancesByDay, defaultBalance }: {
    days: Array<moment.Moment>,
    balancesByDay?: { [timeSignature: string]: string },
    defaultBalance?: string
}): Array<{ x: string, y: string }> {
    let initialBalance: string | undefined = defaultBalance
    if (balancesByDay) {
        initialBalance = balancesByDay[Object.keys(balancesByDay)[0]]
    }
    return days.map(day => {
        const dailyKey = getDailyKey(day)
        if (balancesByDay && balancesByDay.hasOwnProperty(dailyKey)) {
            initialBalance = balancesByDay[dailyKey]
        }
        return {
            x: day.format('YYYY-MM-DD'),
            y: initialBalance ? initialBalance : '0',
        }
    })
}

function getDailyData (start: moment.Moment, end: moment.Moment, balances: Array<{ balance: string, timestamp: string }>, defaultBalance?: string): Array<{ x: string, y: string }> {
    const days = generateDays(start, end)
    if (balances.length > 0) {
        const balancesByDay = getLatestBalances(
            balances,
            balance => getDailyKey(moment.unix(Number(balance.timestamp)))
        )
        return generateDailyPoints({
            days,
            balancesByDay,
        })
    }
    return generateDailyPoints({
        days,
        defaultBalance,
    })
}

export function getWeeklyData (start: moment.Moment, end: moment.Moment, balances: Array<{ balance: string, timestamp: string }>, defaultBalance?: string): Array<{ x: string, y: string }> {
    return getDailyData(start, end, balances, defaultBalance)
}

export function getMonthlyData (start: moment.Moment, end: moment.Moment, balances: Array<{ balance: string, timestamp: string }>, defaultBalance?: string): Array<{ x: string, y: string }> {
    return getDailyData(start, end, balances, defaultBalance)
}

// Yearly data methods

function generateWeeks (start: moment.Moment, end: moment.Moment): Array<moment.Moment> {
    const currDate = start.clone()
    const weeks = []
    while (currDate.isSameOrBefore(end, 'week')) {
        weeks.push(currDate.clone())
        currDate.add(1, 'week')
    }
    return weeks
}

function getWeeklyKey (date: moment.Moment): string {
    return `${date.format('YYYY')}/${date.week()}`
}

function generateYearlyPoints ({ weeks, end, balancesByWeek, defaultBalance }: {
    weeks: Array<moment.Moment>,
    end: moment.Moment,
    balancesByWeek?: { [timeSignature: string]: string },
    defaultBalance?: string
}): Array<{ x: string, y: string }> {
    let initialBalance: string | undefined = defaultBalance
    if (balancesByWeek) {
        initialBalance = balancesByWeek[Object.keys(balancesByWeek)[0]]
    }
    const yearlyPoints = weeks.map(week => {
        const weeklyKey = getWeeklyKey(week)
        if (balancesByWeek && balancesByWeek.hasOwnProperty(weeklyKey)) {
            initialBalance = balancesByWeek[weeklyKey]
        }
        return {
            x: week.clone().startOf('week').format('YYYY-MM-DD'),
            y: initialBalance ? initialBalance : '0',
        }
    })
    const lastWeek = weeks[weeks.length - 1]
    if (end.isAfter(lastWeek.clone().startOf('week'), 'day')) {
        yearlyPoints.push({
            x: end.format('YYYY-MM-DD'),
            y:  initialBalance ? initialBalance : '0',
        })
    }
    return yearlyPoints
}

export function getYearlyData (start: moment.Moment, end: moment.Moment, balances: Array<{ balance: string, timestamp: string }>, defaultBalance?: string): Array<{ x: string, y: string }> {
    const weeks = generateWeeks(start, end)
    if (balances.length > 0) {
        const balancesByWeek = getLatestBalances(
            balances,
            balance => getWeeklyKey(moment.unix(Number(balance.timestamp)))
        )
        return generateYearlyPoints({
            weeks,
            end,
            balancesByWeek,
        })
    }
    return generateYearlyPoints({
        weeks,
        end,
        defaultBalance
    })
}

// End of yearly data methods