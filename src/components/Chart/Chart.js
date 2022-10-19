import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import flatMap from "array.prototype.flatmap";
import PropTypes from 'prop-types'

// type Props = {
//     message: string;
//     type: "error" | "warning" | "success";
//     id: string;
// }

import { getXScale, getYScale, drawAxis, drawLine, animateLine } from "../../js/Utils";
const data = [
    [
        {
            color: "#ebedf0",
            contributionCount: 0,
            date: "2020-01-08T00:00:00.000+00:00"
        },
        {
            color: "#7bc96f",
            contributionCount: 3,
            date: "2020-01-09T00:00:00.000+00:00"
        },
    ],
    [
        {
            color: "#c6e48b",
            contributionCount: 1,
            date: "2020-01-16T00:00:00.000+00:00"
        },
        {
            color: "#ebedf0",
            contributionCount: 0,
            date: "2020-01-17T00:00:00.000+00:00"
        },
        {
            color: "#c6e48b",
            contributionCount: 2,
            date: "2020-01-18T00:00:00.000+00:00"
        }
    ],
    [
        {
            color: "#c6e48b",
            contributionCount: 1,
            date: "2020-01-26T00:00:00.000+00:00"
        },
        {
            color: "#c6e48b",
            contributionCount: 2,
            date: "2020-01-27T00:00:00.000+00:00"
        }
    ],
    [
        {
            color: "#c6e48b",
            contributionCount: 1,
            date: "2020-02-02T00:00:00.000+00:00"
        },
        {
            color: "#c6e48b",
            contributionCount: 2,
            date: "2020-02-03T00:00:00.000+00:00"
        },
        {
            color: "#196127",
            contributionCount: 7,
            date: "2020-02-04T00:00:00.000+00:00"
        },
        {
            color: "#239a3b",
            contributionCount: 6,
            date: "2020-02-05T00:00:00.000+00:00"
        },
        {
            color: "#196127",
            contributionCount: 8,
            date: "2020-02-06T00:00:00.000+00:00"
        },
        {
            color: "#ebedf0",
            contributionCount: 0,
            date: "2020-02-07T00:00:00.000+00:00"
        },
        {
            color: "#ebedf0",
            contributionCount: 0,
            date: "2020-02-08T00:00:00.000+00:00"
        }
    ],
    [
        {
            color: "#ebedf0",
            contributionCount: 0,
            date: "2020-02-09T00:00:00.000+00:00"
        }
    ]
];
export const Chart = () => {
    const d3ref = useRef(null);
    const dataRef = useRef(flatMap(data, (e) => e));
    console.log(dataRef);
    useEffect(() => {
        function init() {
            const width = 400;
            const height = 100;
            const margin = 10;

            const xScale = d3
                .scaleTime()
                .domain(d3.extent(dataRef.current, (d) => new Date(d.date)))
                .range([0, width]);

            const yScale = d3
                .scaleLinear()
                .domain([
                    0,
                    d3.max(data, (d) => d3.max(d.map((el) => el.contributionCount)))
                ])
                .range([height, 0]);

            const line = d3
                .line()
                .x((d) => xScale(d.x))
                .y((d) => yScale(d.y));
            // .curve(d3.curveMonotoneX);

            const dataset = dataRef.current.map((d) => ({
                x: new Date(d.date),
                y: d.contributionCount
            }));

            const svg = d3
                .select(d3ref.current)
                .append("svg")
                .attr("width", width + margin * 2)
                .attr("height", height + margin * 2)
                .append("g")
                .attr("transform", `translate(${margin}, ${margin})`);

            // svg
            //   .append("g")
            //   .attr("class", "x axis")
            //   .attr("transform", `translate(0, ${height})`)
            //   .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat(xFormat)));

            // svg
            //   .append("g")
            //   .attr("class", "y axis")
            //   .call(d3.axisLeft(yScale));

            svg.append("path").datum(dataset).attr("class", "line").attr("d", line);
        }
        init();
    }, []);
    return (
        <div>
            <div ref={d3ref} />
        </div>
    );
}

