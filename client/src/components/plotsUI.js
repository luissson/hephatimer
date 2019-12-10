
import React from 'react';
import * as d3 from 'd3'

export class PlotsUI extends React.Component {
    constructor(props) {
        super(props);

        this.state = { dataLoaded:false, data:[] };

        this.showData = this.showData.bind(this);
        this.getData = this.getData.bind(this);
        this.buildPlot = this.buildPlot.bind(this);
    };

    componentDidMount(){
        this.getData();
    }

    showData() {
        if(this.state.dataLoaded){
            this.buildPlot();
        } else {
            return [];
        }
    }

    async getData() {
        let seshName = this.props.session.sessionName;
        var stopwatches = [];
        if(seshName){
            await fetch('timerdb/getstopwatches?name=' + seshName, {
                method: 'GET',
                headers: {
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                }}
            )
            .then(r=>r.json())
            .then(r => {
                stopwatches = r.session[0].timers;
                this.setState({dataLoaded:true, data:stopwatches});
            })
        }
    }

    buildPlot(){
        var startDates = [];

        for(let i = 0; i < this.state.data.length; i++){
            startDates.push(new Date(this.state.data[i].startDate));
        }

        var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 860 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
        
        // parse the date / time
        var parseDate = d3.timeParse("%d-%m-%Y");

        // set the ranges
        var x = d3.scaleTime()
                .domain([new Date(2019, 10, 1), new Date(2020, 1, 1)])
                .rangeRound([0, width]);
        var y = d3.scaleLinear()
                .range([height, 0]);
        
        // set the parameters for the histogram
        var histogram = d3.histogram()
            .value(function(d) { return d; })
            .domain(x.domain())
            .thresholds(x.ticks(d3.timeDay));
        
        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("body");

        if(svg.select("svg")){
            svg.select("svg").remove();
        }

        svg = d3.select("#plotDiv")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");
            
        // get the data
        var data = startDates;
        
        // group the data for the bars
        var bins = histogram(data);
        
        // Scale the range of the data in the y domain
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);
        
        // append the bar rectangles to the svg element
        svg.selectAll("rect")
            .data(bins)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 1)
            .attr("transform", function(d) {
                return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); });
        
        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
    }

    render() {
        return (
        <div id="plotDiv" ref="plotDiv">
            <h5>Plots:</h5> 
            <div>
                {this.showData()}
                {this.props.session.sessionName} Plot
            </div>
        </div>
        );
    }
}