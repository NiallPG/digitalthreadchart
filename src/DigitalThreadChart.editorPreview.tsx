import { ReactElement, createElement } from "react";
import { DigitalThreadChartPreviewProps } from "../typings/DigitalThreadChartProps";

export function preview({ chartTitle, showLegend }: DigitalThreadChartPreviewProps): ReactElement {
    // Sample data for preview
    const sampleData = [
        { code: "AD", count: 7 },
        { code: "AT", count: 6 },
        { code: "BAT", count: 4 },
        { code: "CP", count: 6 }
    ];

    return (
        <div style={{ 
            padding: "20px", 
            backgroundColor: "#f8f9fa",
            border: "2px dashed #dee2e6",
            borderRadius: "8px",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px"
        }}>
            <h3 style={{ 
                margin: 0, 
                color: "#495057",
                fontSize: "18px",
                fontWeight: 600
            }}>
                {chartTitle || "Digital Thread Chart"}
            </h3>
            
            {showLegend && (
                <div style={{ 
                    display: "flex", 
                    gap: "20px",
                    fontSize: "12px",
                    color: "#6c757d"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "15px", height: "15px", backgroundColor: "#00A9A5", borderRadius: "2px" }}></div>
                        <span>Presentation</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "15px", height: "15px", backgroundColor: "#0B5563", borderRadius: "2px" }}></div>
                        <span>eXplore Intro</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "15px", height: "15px", backgroundColor: "#00CED1", borderRadius: "2px" }}></div>
                        <span>Process Diagram</span>
                    </div>
                </div>
            )}
            
            <div style={{ 
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%"
            }}>
                {/* Simple bar chart preview */}
                <div style={{ display: "flex", gap: "15px", alignItems: "flex-end" }}>
                    {sampleData.map((item, index) => (
                        <div key={index} style={{ textAlign: "center" }}>
                            <div style={{ 
                                display: "flex", 
                                gap: "2px",
                                marginBottom: "5px",
                                alignItems: "flex-end"
                            }}>
                                <div style={{ 
                                    width: "25px", 
                                    height: `${item.count * 10}px`,
                                    backgroundColor: "#00A9A5",
                                    opacity: 0.3
                                }}></div>
                                <div style={{ 
                                    width: "25px", 
                                    height: `${(item.count - 1) * 10}px`,
                                    backgroundColor: "#0B5563",
                                    opacity: 0.3
                                }}></div>
                                <div style={{ 
                                    width: "25px", 
                                    height: `${(item.count - 2) * 10}px`,
                                    backgroundColor: "#00CED1",
                                    opacity: 0.3
                                }}></div>
                            </div>
                            <div style={{ fontSize: "12px", color: "#6c757d" }}>
                                {item.code}({item.count})
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <p style={{ 
                margin: 0, 
                color: "#6c757d", 
                fontSize: "12px",
                textAlign: "center"
            }}>
                Configure data sources in the properties panel
            </p>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/DigitalThreadChart.css");
}