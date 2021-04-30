import React, { Component } from 'react';
import * as d3 from 'd3';
class Chart extends Component {
    componentDidMount() {
        const data = [
            {
                id: 1,
                date: 'cycle 9',
                value: 10,
            },
            {
                id: 2,
                date: 'cycle 10',
                value: 15,
            },
            {
                id: 3,
                date: 'cycle 11',
                value: 20,
            },
            {
                id: 4,
                date: 'cycle 15',
                value: 2,
            },
            {
                id: 5,
                date: 'cycle 15',
                value: 25,
            },
            {
                id: 6,
                date: 'cycle 18',
                value: 15,
            },
            {
                id: 7,
                date: 'cycle 20',
                value: 20,
            },
            {
                id: 8,
                date: 'cycle 25',
                value: 19,
            },
            {
                id: 9,
                date: 'cycle 30',
                value: 15,
            },
            {
                id: 10,
                date: 'cycle 30',
                value: 6,
            },
            {
                id: 11,
                date: 'cycle 31',
                value: 10,
            },
        ];
        const margins = { top: 10, bottom: 10 };
        const chartWidth = 700;
        const chartHeight = 350 - margins.top - margins.bottom;
        const xScale = d3.scaleBand().rangeRound([0, chartWidth]).padding(0.1);
        const yScale = d3.scaleLinear().range([chartHeight, 0]);
        const chartContainer = d3
            .select(this.refs.chart)
            .append('svg')
            .attr('width', chartWidth)
            .attr('height', chartHeight + margins.top + margins.bottom);
        const yGrid = d3
            .axisLeft()
            .scale(yScale)
            .tickFormat('')
            .ticks(10)
            .tickSizeInner(-10);
        xScale.domain(data.map((d) => d.date));
        yScale.domain([0, d3.max(data, (d) => d.value) + 3]);
        const chart = chartContainer.append('g');
        const tooltip = d3
            .select(this.refs.chart)
            .append('div')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .text('tooltip');
        chart
            .append('g')
            .call(d3.axisTop(xScale).tickSizeOuter(0).tickSize(0))
            .attr('transform', `translate(-22, ${chartHeight + 20})`)
            .attr('color', '#707070');
        chart
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('rx', 8)
            .classed('bar', true)
            .attr('width', 24)
            .attr('height', (data) => chartHeight - yScale(data.value))
            .attr('background', '#0000')
            .attr('fill', '#007bff')
            .attr('x', (data) => xScale(data.date))
            .attr('y', (data) => yScale(data.value));
        chart
            .selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .text((data) => data.value)
            .attr('fill', '#707070')
            .attr('y', (data) => yScale(data.value))
            .attr('font-size', 10)
            .classed('label', true);
        chart
            .append('g')
            .attr('class', 'y-grid')
            .attr('transform', 'translate(' + '0' + ', 0)')
            .call(yGrid);
        chart
            .select('.bar')
            .on('mouseover', (event) => {
                tooltip.style('visibility', 'visible');
                tooltip.style('top', event.pageY + 'px');
                tooltip.style('left', event.pageX + 'px');
            })
            .on('mouseout', () => {
                tooltip.style('visibility', 'hidden');
            });
    }
    render() {
        return <div ref="chart"></div>;
    }
}
export default Chart;
