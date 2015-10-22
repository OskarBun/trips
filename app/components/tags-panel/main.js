import './main.css!';
import tmpl from './main-tmpl.html!text';
import 'app/directives/selectize';
import d3 from "d3";
import Vue from 'vue';


function graph(component){

    var terms = [];

    var graph = {
      nodes:[],
      links:[]
    };

    component.members.map(function(item){
        var id = graph.nodes.length;
        var member = {id:id,label:item.title,group:id,value:1};
        graph.nodes.push(member);
        item.tags.split(',').map(function(val){
            var target = graph.nodes.length;
            var term = terms.find(x => x.label==val);
            if(!term){
                term = { id:graph.nodes.length, label:val, value:1 };
                graph.nodes.push(term);
                terms.push(term);
            } else {
                term.value += 1;
            }
            member.value += 1;
            var value = 1;
            graph.links.map(link => {
                if(link.target == term.target){
                    link.value += 1;
                    value = link.value;
                }
            });
            graph.links.push({source:member.id,target:term.id,value:value});
        });
    });

    var width  = d3.select(".graph")[0][0].clientWidth,
        height = 600;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(d=>{
            return -d.value*1000;
         })
        .gravity(0.3)
        .size([width, height]);

    d3.select(".graph").select("svg").remove();
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
            .style("stroke-width", function(d) { return d.target.value; });

    var gnodes = svg.selectAll('g.gnode')
        .data(graph.nodes)
        .enter()
        .append('g')
        .classed('gnode', true);
    
    var node = gnodes.append("circle")
        .attr("class", "node")
        .attr("r", 40)
        .style("opacity", 0.8)
        .style('stroke-width',1)
        .style('stroke','black')
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    var labels = gnodes.append("text")
        .attr("text-anchor","middle")
        .attr("y",6)
        .text(function(d) { return d.label; });


    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        gnodes.attr("transform", function(d) { 
            return 'translate(' + [d.x, d.y] + ')'; 
        });
    });
}


Vue.component('tags-panel', {
	data: function(){
		return {
			members: [
                {title:'Foo',tags:'sleeping,swimming,beach,food'},
                {title:'Bar',tags:'beach,museums,water-skiing,shopping,swimming'},
                {title:'Bert',tags:'food,water-skiing,beach,sunning'}],
			new_member_title: null,
		};
	},
  	template: tmpl,
  	props: ['path'],
  	computed: {
  		all_tags: function(){
  			var results = [];
  			this.members
      			.map(item => {
      				return item.tags || '';
      			 })
      			.join(',')
      			.split(',')
      			.sort()
      			.map( item => {
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
				tags: ''
			});
            this.new_member_title = '';
		},
        "do_graph": function(){
            graph(this);
        }
	},
	events: {},
	watch:{
        "all_tags": function(){
            this.do_graph();
        }
    },
    ready: function(){
        this.do_graph();
    }
});
