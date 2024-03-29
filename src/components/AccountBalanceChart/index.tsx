import React, { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../../config'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Tooltip,
    TooltipItem,
    Filler,
    ChartArea,
    ScriptableContext,
    TooltipPositionerFunction,
    ChartType,
    ChartData,
    Chart,
} from 'chart.js'
import { Skeleton } from '@mui/material'
import { Line } from 'react-chartjs-2'
import moment from 'moment'
import _max from 'lodash/max'
import 'chartjs-adapter-moment'

// Register chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    TimeScale,
    LineElement,
    Tooltip,
    Filler,
)

// Define custom tooltip positioner
declare module 'chart.js' {
    interface TooltipPositionerMap {
        topPositioner: TooltipPositionerFunction<ChartType>
    }
}

Tooltip.positioners.topPositioner = function(elements, eventPosition) {
    // @ts-ignore
    const pos = Tooltip.positioners.average(elements, eventPosition)

    // Happens when nothing is found
    if (pos === false) {
        return false
    }
    const chart = this.chart

    return {
        x: pos.x,
        y: chart.chartArea.top,
        xAlign: 'center',
        yAlign: 'bottom',
    }
}

// Gradient function
function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top)

    gradient.addColorStop(0, 'rgba(118,106,192,0)')
    gradient.addColorStop(.425, 'rgba(109, 150, 242, 0.2)')

    return gradient
}

// Chart options
const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        mode: 'index' as const,
    },
    scales: {
        x: {
            type: 'time' as const,
            ticks: {
                color: '#999999',
            },
            grid: {
                display: false
            },
        },
        y: {
            grid: {
                display: false
            },
            ticks: {
                color: '#999999',
                count: 3,
            },
            beginAtZero: true,
        }
    },
    elements: {
        line: {
            borderColor: 'rgba(109, 150, 242, 0.8)',
            fill: true,
            tension: 0.1,
            backgroundColor: (context: ScriptableContext<'line'>) => createGradient(context.chart.ctx, context.chart.chartArea)
        },
        point: {
            borderColor: 'rgba(109, 150, 242, 0.8)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderWidth: 0,
            hoverBorderWidth: 3,
            hoverRadius: 5,
        }
    },
    plugins: {
        tooltip: {
            position: 'topPositioner' as const,
            padding: {
                left: 30,
                right: 30,
                top: 10,
                bottom: 10,
            },
            displayColors: false,
            backgroundColor: '#FFFFFF',
            borderWidth: 4,
            borderColor: '#F6F6F6',
            titleColor: '#000000',
            titleMarginBottom: 5,
            titleAlign: 'center' as const,
            titleFont: {
                family: 'Roboto',
                weight: 'bold',
                size: 18
            },
            bodyColor: '#999999',
            bodyAlign: 'center' as const,
            bodyFont: {
                family: 'Roboto',
                weight: 'normal',
                size: 12
            },
        }
    }
}

const plugins = [
    {
        id: 'NoDataPlugin',
        afterDraw: function (chart: Chart<'line'>) {
            const datasets = chart.data.datasets
            if (!Array.isArray(datasets) || datasets.length < 1 ||
                !Array.isArray(datasets[0].data) || datasets[0].data.length < 1) {
                const ctx = chart.ctx
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.font = '22px Roboto'
                ctx.fillStyle = '#adb5bd'
                ctx.fillText('This account has no transactions yet', chart.width / 2, chart.height / 2)
                ctx.restore()
            }
        },
    },
]

interface LinePoint {
    x: string
    y: string
}

export interface AccountBalanceChartProps {
    data: LinePoint[]
    type: 'weekly' | 'monthly' | 'yearly'
    loading: boolean
    fiat: boolean
    height: number
}

export default function AccountBalanceChart ({ data, type, loading, fiat, height }: AccountBalanceChartProps) {

    const { theme } = useContext(ThemeContext)

    const [chartData, setChartData] = useState<ChartData<'line', LinePoint>>({ datasets: [] })
    const [chartOptions, setChartOptions] = useState({})
    const showNoData = data.length >= 1 ? data.every((point: any) => point.y === '0') : true

    useEffect(() => {
        setChartData({
            // @ts-ignore
            datasets: [{ data: showNoData ? [] : data }]
        })
    }, [data])

    useEffect(() => {
        const setOptions = (unit: 'day' | 'month', stepSize: number, max: number, format: string) => ({
            ...options,
            scales: {
                ...options.scales,
                x: {
                    ...options.scales.x,
                    time: {
                        unit,
                        stepSize,
                    },
                    ticks: {
                        ...options.scales.x.ticks,
                        color: theme.main.paper.text.secondary,
                        display: !showNoData,
                    }
                },
                y: {
                    ...options.scales.y,
                    max,
                    ticks: {
                        ...options.scales.x.ticks,
                        color: theme.main.paper.text.secondary,
                        display: !showNoData,
                    }
                }
            },
            plugins: {
                ...options.plugins,
                tooltip: {
                    ...options.plugins.tooltip,
                    callbacks: {
                        title: (title: TooltipItem<'line'>[]) => {
                            const value = title[0].formattedValue
                            if (fiat) {
                                return `$${value}`
                            }
                            return `${value} ETH`
                        },
                        label: (label: TooltipItem<'line'>) => {
                            const { x }: any = label.parsed
                            return moment(x).format(format)
                        },
                    }
                }
            },
        })

        const getMax = (): number => {
            const max = _max(data.map(point => Number(point.y)))
            if (typeof max === 'undefined') {
                return 100
            }
            const upperBound = max * 1.4
            if (upperBound < 1) {
                if (upperBound > 0) {
                    return upperBound
                }
                return 100
            } else {
                const maxRounded = Math.round(upperBound)
                const numDigits = Math.max(Math.floor(Math.log10(Math.abs(maxRounded))), 0) + 1
                if (numDigits > 2) {
                    const squareBy = Math.pow(10, numDigits - 2)
                    const max = Math.ceil(maxRounded / squareBy) * squareBy
                    if (max > 0) {
                        return max
                    }
                    return 100
                }
                if (maxRounded % 2) {
                    const max = maxRounded + 1
                    if (max > 0) {
                        return max
                    }
                    return 100
                }
                if (maxRounded > 0) {
                    return maxRounded
                }
                return 100
            }
        }

        if (type === 'weekly') {
            setChartOptions(setOptions('day', 1, getMax(), 'dddd, MMMM D YYYY'))
        } else if (type === 'monthly') {
            setChartOptions(setOptions('day', 5, getMax(), 'dddd, MMMM D YYYY'))
        } else if (type === 'yearly') {
            setChartOptions(setOptions('month', 2, getMax(), 'MMMM D, YYYY'))
        }
    }, [data, type, showNoData])

    return (
        <div style={{ height: `${height}px` }}>
            { loading ? (
                <Skeleton variant='rectangular' height={height} animation='wave'/>
            ) : (
                <Line data={chartData} options={chartOptions} plugins={plugins} height={height}/>
            )}
        </div>
    )
}

