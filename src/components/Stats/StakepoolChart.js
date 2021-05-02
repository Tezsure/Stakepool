import { Chart } from 'react-google-charts';
import React from 'react';

export default function StakepoolChart(props) {
    const { statsResponse } = props;
    // const minValue = currentCycleData[network].currentCycle - 10;
    // const maxValue = currentCycleData[network].currentCycle - 1;
    const chartData = [];
    const tableData = [];

    chartData.push(['x', 'Total bet', 'ROI']);
    if (statsResponse.length === 0) chartData.push([0, 0, 0]);
    if (statsResponse.length !== 0)
        tableData.push([
            { type: 'string', label: 'Cycle' },
            { type: 'string', label: 'Total bet' },
            { type: 'string', label: 'ROI' },
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
                loader={<div>Loading Chart</div>}
                data={chartData}
                options={{
                    hAxis: {
                        title: 'Cycle',
                    },
                    vAxis: {
                        title: 'Total bet',
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
                height={'300px'}
                chartType="Table"
                loader={<div>Loading Chart</div>}
                data={tableData}
                options={{
                    width: '100%',
                }}
                rootProps={{ 'data-testid': '1' }}
            />
        </>
    );
}
