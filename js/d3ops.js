  //onclick: display overview of coach's data
  var currentAverage = "mean";
  var currentCategory = "PassAtt";
  var renderPercent = false;
  
  var margin = {
        top: 10,
        right: 10,
        bottom: 50,
        left: 75
};

var width = (window.innerWidth - margin.right - margin.left) * 0.9;
var height = (window.innerHeight - margin.top - margin.bottom) * 0.8;

var infobox = d3.select(".card").append("div")
      .attr("class", "tooltip")
      .attr("id", "infobox")
      .style("opacity", 0);   
      
      
  function visualize(category, renderPercent, averageType){
    var dataURL = (averageType=="mean" ? ("./data/coachmeans.csv"): ("./data/coachmedians.csv"));
    var yAxisFormat = (renderPercent ? d3.format("%"): d3.format("d"));
    var chart = d3.select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.csv(dataURL, function(data){
      	 data.sort(function(a, b){
  	        return b[category] - a[category];
  	    });
  	   var barWidth = Math.floor(width / data.length);
  	   
  		var xScale = d3.scale.linear().domain([data.length, 0]).range([0, width * 0.98]);
  		
  		var yScale = d3.scale.linear().domain([d3.max(data, function(d){
  		  return (d[category] * 1.02);
  		}), d3.min(data, function(d){
  		  return (d[category]) * 0.95;
  		})])
  		.range([0, height]);
  		
  		var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(Math.floor(((data.length)/5) * (width/1100)));

      var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(Math.floor(10 * (height/650)))
      .tickFormat(yAxisFormat);
 chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
       .append("text")
       .attr("x", (width/2) - 120)
       .attr("y", 40)
       .text("Rank among current HCs and OCs");
chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", -(height/2) + 130)
      .attr("dy", "0.8em")
      .style("text-anchor", "end")
      .text(statUnits(category));
      
      
      chart.selectAll(".bar")
      .data(data).enter()
      .append("rect")
      .attr("x", function(d, index){
        return xScale(index) - barWidth;
      })
      .attr("y", function(d){
        return yScale(d[category]);
      })
      .attr("width", barWidth)
      .attr("height", function(d){
          return height - yScale(d[category]);
        })
      .attr("id", function(d){
        if(d["Coach"] == "Average"){
          return "avgBar"
        }
        else{
          return "";
        }
      })
      .on("mouseover", function(d, i){
        console.log(d);
        var yearWord = d["YrsExp"] == 1 ? "year" : "years";
         var rect = d3.select(this);
         rect.attr("class", "mouseover");
        infobox.transition()
          .duration(100)
          .style("opacity", 0.65)
          .style("left", (d3.event.pageX -150) + "px")
          .style("top", (d3.event.pageY - 200) + "px");
          infobox.html("<br /><img class='logo' width='100' src='" + "./img/" + d["Team"] + ".png'" + "/><br /><br /><span class='name'>" + 
          (d["Coach"] != "Average" ? (d["Coach"]): ("NFL")) + ", " + (d["Coach"] != "Average" ? (d["Team"]): ("")) + " " + 
          (d["Coach"] != "Average" ? (d["Position"]) : ("average active HC or OC")) + "</span><br /><br /><span class='exactNumber'>" + 
          (renderPercent ? ((100 * d[category]).toFixed(2)) : (d[category]))
          + " " + statUnits(category) + "</span><br /><span class='expNum'>in " + d["YrsExp"] + " " + yearWord + " of OC or HC experience</span>");
      })
      .on("mouseout", function() {
        var rect = d3.select(this);
        rect.attr("class", "mouseoff");
        infobox.transition()
          .duration(500)
          .style("opacity", 0);
      });
    });
  }
  
  $('document').ready(function(){
  	   visualize(currentCategory, renderPercent, currentAverage); //default render
  	});
  	
d3.select(window).on('resize', resize); 
  	
  $("#statSelector").on("change", function(){
    currentCategory = $("#statSelector").val();
    renderPercent = currentCategory.slice(-4) == "Prct";
    var chartNode = document.getElementById("chart");
    $("#chart").empty(); //erase previous chart
    visualize(currentCategory, renderPercent, currentAverage); //make chart with the new category
  });
  
  $("#averageSelector").on("change", function(){
     currentAverage = $("#averageSelector").val();
    $("#chart").empty(); //erase previous chart
    visualize(currentCategory, renderPercent, currentAverage);
  });
  
  function resize(){
width = (window.innerWidth - margin.right - margin.left) * 0.9;
height = (window.innerHeight - margin.top - margin.bottom) * 0.8;
$("#chart").empty(); //erase previous chart
 visualize(currentCategory, renderPercent, currentAverage);

  }
  
  function statUnits(category){
    switch(category){
      case "PassAtt":
        return "Pass attempts per year";
      case "RushAtt":
        return "Rush attempts per year";
      case "PassCmp":
        return "Pass completions per year";
      case "PassYds":
        return "Passing yards per year";
      case "RushYds":
        return "Team rushing yards per year";
      case "CompletionPrct":
        return "Average annual completion percentage";
      case "PassTDs":
        return "Passing TDs per year";
      case "PassInt":
        return "Interceptions thrown per year";
      case "YdsPerPass":
        return "Average annual yards per pass";
      case "YdsPerRush":
        return "Average annual yards per carry";
      case "TopRushAtt":
        return "Average annual carries by team leader";
      case "TopRushYds":
        return "Average annual rushing yards by team leader";
      case "RushTDs":
        return "Rushing TDs per year";
      case "TopRushTDs":
        return "Average annual rushing touchdowns by team leader";
      case "QbRuYds":
        return "Average QB rushing yards per year";
      case "TopWrRec":
        return "Average receptions by leading WR";
      case "TopTwoWrRec":
        return "Average receptions from team's two leading WRs";
      case "TopWrYds":
        return "Average receiving yards for leading WR";
      case "TopTwoWrYds":
        return "Average receiving yards for team's two leading WRs";
      case "TopWrTDs":
        return "Average receiving TDs by leading WR";
      case "TopTwoWrTDs":
        return "Average receiving TDs by team's two leading WRs";
      case "TopTeRec":
        return "Average receptions by leading TE";
      case "TopTeYds":
        return "Average receiving yards for leading TE";
      case "TopTeTDs":
        return "Average receiving TDs for leading TE";
      case "TopRbRecs":
        return "Average receptions by leading RB";
      case "TopRbReYds":
        return "Average receiving yards for leading RB";
      case "TopRushAttPrct":
        return "Average % of rush attempts by team leader";
      case "TopRushYdsPrct":
        return "Average % of rushing yards by team leader";
      case "TopRushTDsPrct":
        return "Average % of rushing TDs by team leader";
      case "TopWrRecPrct":
        return "Average % of receptions by leading WR";
      case "StartingWrRecPrct":
        return "Average % of receptions by team's two leading WRs";
      case "TopWrYdsPrct":
        return "Average % of receiving yards by leading WR";
      case "StartingWrYdsPrct":
        return "Average % of receiving yards by top two WRs";
      case "TopWrTdPrct":
        return "Average % of receving TDs by leading WR";
      case "StartingWrTDsPrct":
        return "Average % of receving TDs by top two WRs";
      case "TopTeRecPrct":
        return "Average % of catches by leading TE";
      case "TopTeYdsPrct":
        return "Average % of receving yards by leading TE";
      case "TopTeTdsPrct":
        return "Average % of receiving TDs by leading TE";
      case "TopRbRecPrct":
        return "Average % of catches by leading RB";
      case "TopRbReYdsPrct":
        return "Average % of receiving yards by leading RB";
      default:
        return "units per year";
    }
  }