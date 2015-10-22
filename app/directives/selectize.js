import $ from 'jquery';
import 'selectize';
import Vue from 'vue';


Vue.directive('selectize', {
  twoWay: true,
  bind: function () {
    // do preparation work
    // e.g. add event listeners or expensive stuff
    // that needs to be run only once
    var self = this;
    setTimeout(()=>{
      $(this.el).selectize({
    	    delimiter: ',',
    	    persist: false,
          //plugins: ['remove_button'],
    	    create: function(input) {
    	        return {
    	            value: input,
    	            text: input
    	        };
    	    },
    	    onChange: function(value){
      	    	self.set(value);
      	  }
      	});
    },0);
  },
  update: function (newValue, oldValue) {
    // do something based on the updated value
    // this will also be called for the initial value
    $(this.el).val(newValue);
  },
  unbind: function () {
    // do clean up work
    // e.g. remove event listeners added in bind()
  }
});
