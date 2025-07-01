import { ReactElement, createElement, useEffect, useRef, useState } from "react";
import { DigitalThreadChartContainerProps } from "../typings/DigitalThreadChartProps";
import { ValueStatus } from "mendix";
import * as d3 from "d3";

import "./ui/DigitalThreadChart.css";

interface IndustryChartData {
    code: string;
    name: string;
    totalThreads: number;
    presentationCount: number;
    exploreCount: number;
    processCount: number;
}

export function DigitalThreadChart(props: DigitalThreadChartContainerProps): ReactElement {
    const {
        name,
        industryData,
        industryCode,
        industryName,
        digitalThreads,
        hasPresentation,
        hasExploreIntro,
        hasProcessDiagram,
        chartTitle,
        showLegend,
        showCapacityBars,
        chartHeight,
        colorPresentation,
        colorExplore,
        colorProcess,
        onBarClick,
        animationDuration
    } = props;

    const chartRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: chartHeight });
    const [chartData, setChartData] = useState<IndustryChartData[]>([]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height: chartHeight });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        
        const resizeObserver = new ResizeObserver(handleResize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
        };
    }, [chartHeight]);

    // Process data from Mendix
    useEffect(() => {
        if (industryData && industryData.status === ValueStatus.Available && industryData.items) {
            const processedData: IndustryChartData[] = [];

            industryData.items.forEach(industry => {
                try {
                    const code = industryCode.get(industry);
                    const name = industryName ? industryName.get(industry) : null;

                    if (code.status !== ValueStatus.Available) {
                        return;
                    }

                    let presentationCount = 0;
                    let exploreCount = 0;
                    let processCount = 0;
                    let totalThreads = 0;

                    // Access digitalThreads directly as a ListValue
                    if (digitalThreads && digitalThreads.status === ValueStatus.Available && digitalThreads.items) {
                        digitalThreads.items.forEach((thread: any) => {
                            totalThreads++;
                            
                            const hasP = hasPresentation.get(thread);
                            const hasE = hasExploreIntro.get(thread);
                            const hasD = hasProcessDiagram.get(thread);

                            if (hasP.status === ValueStatus.Available && hasP.value) {
                                presentationCount++;
                            }
                            if (hasE.status === ValueStatus.Available && hasE.value) {
                                exploreCount++;
                            }
                            if (hasD.status === ValueStatus.Available && hasD.value) {
                                processCount++;
                            }
                        });
                    }

                    processedData.push({
                        code: code.value || "",
                        name: name?.status === ValueStatus.Available ? name.value || "" : "",
                        totalThreads,
                        presentationCount,
                        exploreCount,
                        processCount
                    });
                } catch (error) {
                    console.error("Error processing industry data:", error);
                }
            });

            setChartData(processedData);
        }
    }, [industryData, industryCode, industryName, digitalThreads, hasPresentation, hasExploreIntro, hasProcessDiagram]);

    // Render D3 chart
    useEffect(() => {
        if (!chartRef.current || dimensions.width === 0 || chartData.length === 0) return;

        // Clear existing chart
        d3.select(chartRef.current).selectAll("*").remove();

        const margin = { top: 40, right: 80, bottom: 60, left: 60 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create scales
        const xScale = d3.scaleBand()
            .domain(chartData.map(d => d.code))
            .range([0, width])
            .padding(0.3);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.totalThreads) || 0])
            .range([height, 0]);

        // Create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale)
            .ticks(Math.min(d3.max(chartData, d => d.totalThreads) || 0, 10))
            .tickFormat(d3.format("d"));

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("font-size", "12px");

        // Add industry counts to x-axis labels
        svg.selectAll(".x-axis text")
            .text((_, i) => `${chartData[i].code}(${chartData[i].totalThreads})`);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        // Add grid lines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-height)
                .tickFormat(() => "")
            )
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.3);

        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat(() => "")
            )
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.3);

        // Create bar groups
        const barGroups = svg.selectAll(".bar-group")
            .data(chartData)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("transform", d => `translate(${xScale(d.code)},0)`);

        const barGroupWidth = xScale.bandwidth();
        const barSpacing = 2;
        const individualBarWidth = (barGroupWidth - barSpacing * 2) / 3;

        // Add capacity bars (transparent background)
        if (showCapacityBars) {
            barGroups.append("rect")
                .attr("class", "capacity-bar presentation-capacity")
                .attr("x", 0)
                .attr("y", d => yScale(d.totalThreads))
                .attr("width", individualBarWidth)
                .attr("height", d => height - yScale(d.totalThreads))
                .attr("fill", colorPresentation)
                .attr("opacity", 0.2);

            barGroups.append("rect")
                .attr("class", "capacity-bar explore-capacity")
                .attr("x", individualBarWidth + barSpacing)
                .attr("y", d => yScale(d.totalThreads))
                .attr("width", individualBarWidth)
                .attr("height", d => height - yScale(d.totalThreads))
                .attr("fill", colorExplore)
                .attr("opacity", 0.2);

            barGroups.append("rect")
                .attr("class", "capacity-bar process-capacity")
                .attr("x", (individualBarWidth + barSpacing) * 2)
                .attr("y", d => yScale(d.totalThreads))
                .attr("width", individualBarWidth)
                .attr("height", d => height - yScale(d.totalThreads))
                .attr("fill", colorProcess)
                .attr("opacity", 0.2);
        }

        // Add actual data bars with animation
        barGroups.append("rect")
            .attr("class", "data-bar presentation-bar")
            .attr("x", 0)
            .attr("y", height)
            .attr("width", individualBarWidth)
            .attr("height", 0)
            .attr("fill", colorPresentation)
            .style("cursor", onBarClick ? "pointer" : "default")
            .on("click", function() {
                if (onBarClick && onBarClick.canExecute) {
                    onBarClick.execute();
                }
            })
            .transition()
            .duration(animationDuration)
            .attr("y", d => yScale(d.presentationCount))
            .attr("height", d => height - yScale(d.presentationCount));

        barGroups.append("rect")
            .attr("class", "data-bar explore-bar")
            .attr("x", individualBarWidth + barSpacing)
            .attr("y", height)
            .attr("width", individualBarWidth)
            .attr("height", 0)
            .attr("fill", colorExplore)
            .style("cursor", onBarClick ? "pointer" : "default")
            .on("click", function() {
                if (onBarClick && onBarClick.canExecute) {
                    onBarClick.execute();
                }
            })
            .transition()
            .duration(animationDuration)
            .delay((_, i) => i * 100)
            .attr("y", d => yScale(d.exploreCount))
            .attr("height", d => height - yScale(d.exploreCount));

        barGroups.append("rect")
            .attr("class", "data-bar process-bar")
            .attr("x", (individualBarWidth + barSpacing) * 2)
            .attr("y", height)
            .attr("width", individualBarWidth)
            .attr("height", 0)
            .attr("fill", colorProcess)
            .style("cursor", onBarClick ? "pointer" : "default")
            .on("click", function() {
                if (onBarClick && onBarClick.canExecute) {
                    onBarClick.execute();
                }
            })
            .transition()
            .duration(animationDuration)
            .delay((_, i) => i * 100)
            .attr("y", d => yScale(d.processCount))
            .attr("height", d => height - yScale(d.processCount));

        // Add value labels on bars
        barGroups.selectAll(".value-label")
            .data(d => [
                { value: d.presentationCount, x: individualBarWidth / 2, key: 'presentation' },
                { value: d.exploreCount, x: individualBarWidth + barSpacing + individualBarWidth / 2, key: 'explore' },
                { value: d.processCount, x: (individualBarWidth + barSpacing) * 2 + individualBarWidth / 2, key: 'process' }
            ])
            .enter()
            .append("text")
            .attr("class", "value-label")
            .attr("x", d => d.x)
            .attr("y", height)
            .attr("text-anchor", "middle")
            .attr("dy", "-5")
            .style("font-size", "12px")
            .style("fill", "#333")
            .style("opacity", 0)
            .text(d => d.value > 0 ? d.value : "")
            .transition()
            .duration(animationDuration)
            .delay((_, i) => i * 100)
            .attr("y", function(d) {
                const parentElement = this.parentNode as Element;
                const parent = d3.select(parentElement).datum() as IndustryChartData;
                if (d.key === 'presentation') return yScale(parent.presentationCount);
                if (d.key === 'explore') return yScale(parent.exploreCount);
                return yScale(parent.processCount);
            })
            .style("opacity", 1);

    }, [chartData, dimensions, showCapacityBars, colorPresentation, colorExplore, colorProcess, onBarClick, animationDuration]);

    // Loading state
    if (!industryData || industryData.status === ValueStatus.Loading) {
        return (
            <div className={`digital-thread-chart ${name}`} ref={containerRef}>
                <div className="loading-state">Loading digital thread data...</div>
            </div>
        );
    }

    // Error state
    if (industryData.status === ValueStatus.Unavailable) {
        return (
            <div className={`digital-thread-chart ${name}`} ref={containerRef}>
                <div className="error-state">Unable to load data. Please check your configuration.</div>
            </div>
        );
    }

    // No data state
    if (!industryData.items || industryData.items.length === 0) {
        return (
            <div className={`digital-thread-chart ${name}`} ref={containerRef}>
                <div className="no-data-state">No industry data available.</div>
            </div>
        );
    }

    return (
        <div className={`digital-thread-chart ${name}`} ref={containerRef}>
            {chartTitle && <h2 className="chart-title">{chartTitle}</h2>}
            {showLegend && (
                <div className="chart-legend">
                    <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: colorPresentation }}></span>
                        <span className="legend-label">Presentation</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: colorExplore }}></span>
                        <span className="legend-label">eXplore Intro</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: colorProcess }}></span>
                        <span className="legend-label">Process Diagram</span>
                    </div>
                </div>
            )}
            <div className="chart-container" ref={chartRef}></div>
        </div>
    );
}