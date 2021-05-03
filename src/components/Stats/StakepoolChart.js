import { Chart } from 'react-google-charts';
import React from 'react';

export default function StakepoolChart(props) {
    const { statsResponse } = props;
    const chartData = [];
    const tableData = [];

    chartData.push(['x', 'Total bet amount', 'ROI']);
    if (statsResponse.length === 0) chartData.push([0, 0, 0]);
    if (statsResponse.length !== 0)
        tableData.push([
            { type: 'string', label: 'Cycle' },
            { type: 'string', label: 'Total bet amount' },
            { type: 'number', label: 'ROI' },
        ]);
    statsResponse.forEach((elem) => {
        if (elem.success) {
            chartData.push([
                elem.data.cycle,
                elem.data.totalBetAmount / Math.pow(10, 6),
                elem.data.aggregateROIPercent,
            ]);
            tableData.push([
                elem.data.cycle,
                elem.data.totalBetAmount / Math.pow(10, 6),
                elem.data.aggregateROIPercent,
            ]);
        }
    });

    return (
        <>
            <Chart
                height={'500px'}
                chartType="LineChart"
                data={chartData}
                options={{
                    hAxis: {
                        title: 'Cycle',
                    },
                    vAxis: {
                        title: 'Total bet amount',
                    },
                    series: {
                        1: {
                            curveType: 'function',
                        },
                    },
                    animation: {
                        startup: true,
                        easing: 'linear',
                        duration: 1500,
                    },
                    width: '100%',
                }}
                rootProps={{ 'data-testid': '2' }}
            />
            <Chart
                chartType="Table"
                data={tableData}
                options={{
                    width: '100%',
                }}
                rootProps={{ 'data-testid': '1' }}
            />
        </>
    );
}
