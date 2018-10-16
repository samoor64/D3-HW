var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv('data.csv').then(function(data) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append('g')
    .call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  var curX = "poverty";
  var curY = "obesity";

  var circRadius;
  function crGet() {
    if (width <= 530) {
      circRadius = 5;
    }
    else {
      circRadius = 10;
    }
  }
crGet();

  var circlesGroup = chartGroup.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', d => xLinearScale(d.poverty))
  .attr('cy', d => yLinearScale(d.healthcare))
  .attr('r', '15')
  .attr('fill', 'blue')
  .attr('opacity', '.5')
  
  chartGroup.selectAll('circle')
  .data(data)
  .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Average Income: ${d.income}<br>Average Age: ${d.age}`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on('mouseover', toolTip.show);
  circlesGroup.on('mouseout', toolTip.hide);

  // Create axes labels
  chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Healthcare');

  chartGroup.append('text')
    .attr('transform', `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr('class', 'axisText')
    .text('Poverty');
});
