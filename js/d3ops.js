  //http://stackoverflow.com/questions/10736946/how-to-set-a-svg-rect-elements-background-image
  $('document').ready(function(){
  	d3.csv("./data/coachmeans.csv", function(data){
  	    data.sort(function(a, b){
  	        return b["PassAtt"] - a["PassAtt"];
  	    });
  	   var margin = {
        top: 10,
        right: 10,
        bottom: 50,
        left: 75
      };
      var width = 1100 - margin.left - margin.right;
      var height = 600 - margin.top - margin.bottom;
      var barWidth = Math.floor(width / data.length);
  		//data[58] is average]
  		var xScale = d3.scale.linear().domain([data.length-1, 0]).range([0, width * 0.98]);
  		var yScale = d3.scale.linear().domain([d3.max(data, function(d){
  		  return Math.floor(d["PassAtt"]);
  		}) * 1.02, d3.min(data, function(d){
  		  return Math.floor(d["PassAtt"]);
  		}) * 0.95])
  		.range([0, height]);
  		
  		var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks((data.length-1)/5);
      
      var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(10);
      
      var infobox = d3.select(".card").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);   
      
      var chart = d3.select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
 chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
       .append("text")
       .attr("x", width/2)
       .attr("y", 40)
       .text("Rank among current head coaches and offensive coordinators");
chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -(height/2))
      .attr("dy", "0.8em")
      .style("text-anchor", "end")
      .text("Average Annual Pass Attempts");
      
      chart.selectAll(".bar")
      .data(data).enter()
      .append("rect")
      .attr("x", function(d, index){
        return xScale(index);
      })
      .attr("y", function(d){
        return yScale(d["PassAtt"]);
      })
      .attr("width", barWidth)
      .attr("height", function(d){
          return height - yScale(d["PassAtt"]);
        })
      .on("mouseover", function(d, i){
        var yearWord = d["Exp"] == 1 ? "year" : "years";
         var rect = d3.select(this);
         rect.attr("class", "mouseover");
        infobox.transition()
          .duration(100)
          .style("opacity", 0.9)
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 50) + "px");
          infobox.html("<span class='name'>" + d["Name"] + ", " + d["Team"] + " " + d["Position"] + "</span><br /><span class='exactNumber'>" + d["PassAtt"]
          + " attempts per year</span><br /><span class='expNum'>in " + d["Exp"] + " " + yearWord + " of OC or HC experience</span>");
      })
      .on("mouseout", function() {
        var rect = d3.select(this);
        rect.attr("class", "mouseoff");
        infobox.transition()
          .duration(500)
          .style("opacity", 0);
      });
      });
  	});