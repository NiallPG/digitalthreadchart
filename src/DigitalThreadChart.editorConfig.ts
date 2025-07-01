import { DigitalThreadChartPreviewProps } from "../typings/DigitalThreadChartProps";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[];
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[];
};

export type Problem = {
    property?: string;
    severity?: "error" | "warning" | "deprecation";
    message: string;
    studioMessage?: string;
    url?: string;
    studioUrl?: string;
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number;
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string;
    data?: string;
    property?: object;
    width?: number;
    height?: number;
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[];
    borders?: boolean;
    borderRadius?: number;
    backgroundColor?: string;
    borderWidth?: number;
    padding?: number;
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow";
};

type TextProps = BaseProps & {
    type: "Text";
    content: string;
    fontSize?: number;
    fontColor?: string;
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object;
    placeholder: string;
    showDataSourceHeader?: boolean;
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object;
    child: PreviewProps;
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null;
    child?: PreviewProps;
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

export function getProperties(
    _values: DigitalThreadChartPreviewProps,
    defaultProperties: Properties
): Properties {
    // Hide color properties in Studio if needed
    // Currently returning all properties as-is
    return defaultProperties;
}

export function check(values: DigitalThreadChartPreviewProps): Problem[] {
    const errors: Problem[] = [];
    
    // Check if data source is configured
    if (!values.industryData) {
        errors.push({
            property: "industryData",
            message: "Industry data source is required",
            severity: "error"
        });
    }
    
    // Check if required attributes are mapped
    if (values.industryData && !values.industryCode) {
        errors.push({
            property: "industryCode",
            message: "Industry code attribute must be selected",
            severity: "error"
        });
    }
    
    if (values.industryData && !values.digitalThreads) {
        errors.push({
            property: "digitalThreads",
            message: "Digital threads data source must be configured",
            severity: "error"
        });
    }
    
    // Check collateral attributes
    if (values.digitalThreads) {
        if (!values.hasPresentation) {
            errors.push({
                property: "hasPresentation",
                message: "Presentation attribute must be selected",
                severity: "error"
            });
        }
        if (!values.hasExploreIntro) {
            errors.push({
                property: "hasExploreIntro",
                message: "eXplore Intro attribute must be selected",
                severity: "error"
            });
        }
        if (!values.hasProcessDiagram) {
            errors.push({
                property: "hasProcessDiagram",
                message: "Process Diagram attribute must be selected",
                severity: "error"
            });
        }
    }
    
    // Validate chart dimensions
    if (values.chartHeight !== null && values.chartHeight < 200) {
        errors.push({
            property: "chartHeight",
            message: "Chart height should be at least 200 pixels",
            severity: "warning"
        });
    }
    
    if (values.barWidth !== null && (values.barWidth < 20 || values.barWidth > 100)) {
        errors.push({
            property: "barWidth",
            message: "Bar width should be between 20 and 100 pixels",
            severity: "warning"
        });
    }
    
    return errors;
}