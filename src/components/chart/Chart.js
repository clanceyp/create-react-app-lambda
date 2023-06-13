import React, {useState, useEffect, useRef, useContext} from 'react';
import { IngridentContext } from "../../contexts/IngridentContext";
import * as d3 from 'd3';
import './chart.css';


export const Chart = () => {

    // Insulin from injection to peak effectivness
    const insulinPeak = 60;
    const getSugarData = (giD) => {
        return [
            { sugar: 4, duration: 0 },
            { sugar: 4, duration: (insulinPeak - giD) },
            { sugar: 12, duration: insulinPeak },
            { sugar: 4, duration: (insulinPeak + giD * 2) },
            { sugar: 4, duration: 150 }
        ]
    }
    const drawChart = (d3ref) => {
// Duration according to Glycimic Index

        // let giDuration = 15;

        const CHART = {
            width: 600,
            height: 360,
            x: 150,
            y: 14,
            colors: {
                bg: "lemonchiffon",
                sugar: "green",
                insulin: "steelblue"
            },
            graph: {
                size: 0,
                colour: "steelblue"
            },
            animate: {
                duration: 1200
            }
        }
        CHART.graph.size = CHART.height / (CHART.y*2);

// Data for the blood sugar line
        const sugarData = liveSugarData;

// Duration of insulin effect (2.5 hours)
        const insulinDuration = 150;

// Calculate the insulin data points
        const insulinData = [
            { sugar: 2, duration: 0 },
            { sugar: 12, duration: insulinPeak },
            { sugar: 6, duration: insulinPeak + (insulinPeak/2) },
            { sugar: 3, duration: 150 }
        ];

        const leadTime = (insulinPeak - giDuration)

// log the difference between the start of
       // console.log("Time difference:", leadTime);

// Create the SVG container
        const svg = d3.select(d3ref.current)
            .append("svg")
            .attr("width", CHART.width)
            .attr("height", CHART.height);

// Define scales
        const xScale = d3.scaleLinear()
            .domain([0, CHART.x]) // X-axis range from 0 to 150
            .range([0, CHART.width]);

        const yScale = d3.scaleLinear()
            .domain([0, CHART.y]) // Blood glucose level range from 0 to 14
            .range([CHART.height, 0]);

// Define the graph paper pattern
        const pattern = svg.append("defs")
            .append("pattern")
            .attr("id", "graph-paper")
            .attr("width", CHART.graph.size) // Width of each pattern cell
            .attr("height", CHART.graph.size) // Height of each pattern cell
            .attr("patternUnits", "userSpaceOnUse");

// Add horizontal lines to the pattern
        pattern.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", CHART.graph.size)
            .attr("y2", 0)
            .attr("stroke", CHART.graph.colour)
            .attr("stroke-width", 0.5);

// Add vertical lines to the pattern
        pattern.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", CHART.graph.size)
            .attr("stroke", CHART.graph.colour)
            .attr("stroke-width", 0.5);

// Append the background color panel
       // console.log("background panel:", leadTime, insulinPeak, insulinPeak - leadTime, xScale(insulinPeak - leadTime) );
        const backgroundPanel = svg.append("rect")
            .attr("x", xScale(leadTime))
            .attr("width", xScale(insulinPeak - leadTime)) // Width corresponds to the x-axis value of 60
            .attr("y", 0)
            .attr("height", CHART.height) // Full height of the chart
            .attr("fill", CHART.colors.bg);

// Append a rectangle with the graph paper pattern as the background
        svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", CHART.width)
            .attr("height", CHART.height)
            .attr("fill", "url(#graph-paper)");

// Create line generators
// Define the sugar line generator
        const sugarLine = d3.line()
            .x(d => xScale(d.duration))
            .y(d => yScale(d.sugar))
            .curve(d3.curveMonotoneX)

        const insulinLine = d3.line()
            .x(d => xScale(d.duration))
            .y(d => yScale(d.sugar))
            .curve(d3.curveBasis);

        const curve = d3.line().curve(d3.curveNatural);

// Append the sugar line
        const sugarLineElement = svg.append("path")
            .datum(sugarData)
            .attr("d", sugarLine)
            .attr("fill", "none")
            .attr("stroke", CHART.colors.sugar)
            .attr("stroke-width", 2);

// Append the insulin line
        svg.append("path")
            .datum(insulinData)
            .attr("d", insulinLine)
            .attr("fill", "none")
            .attr("stroke", CHART.colors.insulin)
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4 4"); // Add dashed style to differentiate the line

// Append axes and labels
        svg.append("g")
            .attr("transform", `translate(0, ${CHART.height})`)
            .call(d3.axisBottom(xScale).ticks(15));

        svg.append("g")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("x", -50)
            .attr("y", -10)
            .attr("text-anchor", "start")

        const introOffset = 60;

        svg.append("g")
            .append("text")
            .attr("x", introOffset)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("class", "intro")
            .text("Take insulin");

        const timeBeforeLabel = svg.append("g")
            .append("text")
            .attr("x", introOffset)
            .attr("y", 70)
            .attr("text-anchor", "middle")
            .attr("class", "intro intro--large")
            .text(leadTime);

        svg.append("g")
            .append("text")
            .attr("x", -72)
            .attr("y", introOffset + 45)
            .attr("width", 70)
            .attr("text-anchor", "start")
            .attr("class", "intro")
            .attr("transform", "rotate(-90)")
            .text("mins");

        svg.append("g")
            .append("text")
            .attr("x", introOffset)
            .attr("y", 100)
            .attr("text-anchor", "middle")
            .attr("class", "intro")
            .text("before eating");

        svg.append("text")
            .attr("x", CHART.width/2)
            .attr("y", CHART.height + 40)
            .attr("text-anchor", "middle")
            .text("Duration (minutes)");

// svg.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("x", - CHART.height/2)
//     .attr("y", -25)
//     .attr("text-anchor", "middle")
//     .text("mmol/L");

        chartConfig.current = { svg, sugarLineElement, backgroundPanel, timeBeforeLabel, CHART, sugarLine, xScale };
        setLoading(false);
        //
        //
        // const updateLeadTime = (gi) => {
        //     // () => setIndex((index) => (index === 0 ? 1 : 0))
        //     setGiDuration(() => gi);
        //     // giDuration = gid;
        //
        //     sugarLineElement
        //         .datum(getSugarData())
        //         .transition()
        //         .duration(CHART.animate.duration)
        //         .attr("d", sugarLine)
        //
        //     const newLeadTime = (insulinPeak - giDuration)
        //
        //     backgroundPanel
        //         .transition()
        //         .duration(CHART.animate.duration)
        //         .attr("width", xScale(newLeadTime)) // Width corresponds to the x-axis value of 60
        //
        //     let counter = 0;
        //     const t = (n, d) => {
        //         const getNewTime = () => {
        //             if (d) {
        //                 n = n + 1;
        //                 return leadTime - n;
        //             } else {
        //                 n = n + 1;
        //                 return leadTime + n;
        //             }
        //         }
        //         const b = getNewTime();
        //         timeBeforeLabel
        //             .text(b)
        //         setTimeout(() => {
        //             if ((d && b <= newLeadTime) ||
        //                 (!d && b >= newLeadTime) ||
        //                 counter > 40) {
        //                 leadTime = newLeadTime;
        //                 timeBeforeLabel
        //                     .text(leadTime)
        //                 return;
        //             }
        //             counter = counter + 1
        //             t(n, d);
        //         }, 50);
        //     }
        //     t(0, newLeadTime < leadTime)
        // }
        //
        // setTimeout(() => {
        //     updateLeadTime(35)
        // }, 3000)
        //
        // setTimeout(() => {
        //     updateLeadTime(10)
        // }, 6000)
        //
        // setTimeout(() => {
        //     updateLeadTime(24)
        // }, 9000)
    }

    const d3ref = useRef(null);
    const [loading, setLoading] = useState(true);
    const {giDuration, setGiDuration} = useContext(IngridentContext);
    const [leadTime, setLeadTime] = useState(insulinPeak - giDuration)
    const chartConfig = useRef();
    const liveSugarData = getSugarData(giDuration);

    useEffect(() => {
        // the static setup
        drawChart(d3ref, giDuration, setGiDuration);
    }, []);
    useEffect(() => {
        // dynamic bit
        if (loading || !chartConfig.current) {
           // console.log('ooch');
            return;
        }
        // console.log('oo i get here!')
        const { svg, sugarLineElement, backgroundPanel, timeBeforeLabel, CHART, sugarLine, xScale } = chartConfig.current;
        // const leadTime = (insulinPeak - giDuration);
        // console.log("giDuration", giDuration)
        // console.log(liveSugarData)
        sugarLineElement
            .datum(liveSugarData)
            .transition()
            .duration(CHART.animate.duration)
            .attr("d", sugarLine)

        const newLeadTime = (insulinPeak - giDuration)

        backgroundPanel
            .transition()
            .duration(CHART.animate.duration)
            .attr("x", xScale(newLeadTime))
            .attr("width", xScale(insulinPeak - newLeadTime)) // Width corresponds to the x-axis value of 60

        let counter = 0;
        const t = (n, d) => {
            const getNewTime = () => {
                if (d) {
                    n = n + 1;
                    return leadTime - n;
                } else {
                    n = n + 1;
                    return leadTime + n;
                }
            }
            const b = getNewTime();
            timeBeforeLabel
                .text(b)
            setTimeout(() => {
                if ((d && b <= newLeadTime) ||
                    (!d && b >= newLeadTime) ||
                    counter > 40) {
                    setLeadTime(() => newLeadTime);
                    timeBeforeLabel
                        .text(leadTime)
                    return;
                }
                counter = counter + 1
                t(n, d);
            }, 50);
        }
        t(0, newLeadTime < leadTime)
    }, [liveSugarData, loading]);
    return (
        <div>
            <button onClick={() => setGiDuration((giDuration) => giDuration > 45 ? 12 : giDuration + 15)}>
                toggle <span>{giDuration}</span>
            </button>
            <div id="graph" ref={d3ref} />
        </div>
    );
}

