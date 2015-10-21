import './main.css!';
import tmpl from './main-tmpl.html!text';
import 'app/directives/selectize';
import d3 from "d3";
import Vue from 'vue';


function graph(component){

    var graph = {
      nodes:[],
      links:[]
    };

    component.members.map(function(item,index){
        graph.nodes.push({name:item.title,group:index});
        item.tags.split(',').map(function(val,idx){
            var target = graph.nodes.length;
            graph.nodes.push({name:val,group:index});
            graph.links.push({source:index,target:target,value:1});
        });
    });

    var width = 600,
        height = 500;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);

    var svg = d3.select(".graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var gnodes = svg.selectAll('g.gnode')
        .data(graph.nodes)
        .enter()
        .append('g')
        .classed('gnode', true);
    
    var node = gnodes.append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

    var labels = gnodes.append("text")
        .text(function(d) { return d.name; });


    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        gnodes.attr("transform", function(d) { 
            return 'translate(' + [d.x, d.y] + ')'; 
        });
    });

    console.log(graph);
}


Vue.component('tags-panel', {
	data: function(){
		return {
			members: [
        {title:'foo',tags:'this,is,a,test'},
        {title:'bar',tags:'this,is,another,test'}],
			new_member_title: null,
		};
	},
  	template: tmpl,
  	props: ['path'],
  	computed: {
  		all_tags: function(){
  			var results = [];
  			this.members.
  			map((item)=>{
  				return item.tags || '';
  			}).
  			join(',').
  			split(',').
  			sort().
  			map((item) =>{
  				if(item && results.indexOf(item)==-1){
  					results.push(item);
  				}
  			});
  			return results;
  		}
  	},
	methods: {
		"add_member": function(){
			this.members.push({
				title: this.new_member_title,
				tags: null
			});
      this.new_member_title = '';
		}
	},
	events: {},
	watch:{},
    ready: function(){
        graph(this);
    }
});
