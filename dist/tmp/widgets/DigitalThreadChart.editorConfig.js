'use strict';

function getProperties(_values, defaultProperties) {
  // Hide color properties in Studio if needed
  // Currently returning all properties as-is
  return defaultProperties;
}
function check(values) {
  var errors = [];
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
exports.check = check;
exports.getProperties = getProperties;
