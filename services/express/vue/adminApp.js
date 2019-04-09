'use strict';

var adminApp = new Vue({
    el: '#adminApp',
    data:{
      
    },
    watch: {
    },
    methods: {
    },
    mounted: function () {
      this.$nextTick(function () {
        getApi('/api/me', 'me');
      })
    },
    
    end: {
      
    }
  })