/**
 * This file was generated from DigitalThreadChart.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, ListValue, ListAttributeValue } from "mendix";

export interface DigitalThreadChartContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    industryData: ListValue;
    industryCode: ListAttributeValue<string>;
    industryName?: ListAttributeValue<string>;
    digitalThreads: ListValue;
    hasPresentation: ListAttributeValue<boolean>;
    hasExploreIntro: ListAttributeValue<boolean>;
    hasProcessDiagram: ListAttributeValue<boolean>;
    chartTitle: string;
    showLegend: boolean;
    showCapacityBars: boolean;
    chartHeight: number;
    barWidth: number;
    colorPresentation: string;
    colorExplore: string;
    colorProcess: string;
    onBarClick?: ActionValue;
    animationDuration: number;
}

export interface DigitalThreadChartPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    industryData: {} | { caption: string } | { type: string } | null;
    industryCode: string;
    industryName: string;
    digitalThreads: {} | { caption: string } | { type: string } | null;
    hasPresentation: string;
    hasExploreIntro: string;
    hasProcessDiagram: string;
    chartTitle: string;
    showLegend: boolean;
    showCapacityBars: boolean;
    chartHeight: number | null;
    barWidth: number | null;
    colorPresentation: string;
    colorExplore: string;
    colorProcess: string;
    onBarClick: {} | null;
    animationDuration: number | null;
}
