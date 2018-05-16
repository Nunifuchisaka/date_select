;(function($, window, document, undefined){
"use strict";

window.DATE_SELECT = new Object();

var now = new Now();

function Now(){
  this.date = new Date();
  this.year = this.date.getFullYear();
  this.month = this.date.getMonth() + 1;
  this.day = this.date.getDate();
}

function getLastDay(year, month){
  var last_day = new Array('', 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0){
    last_day[2] = 29;
  }
  return last_day[month];
}


/*
## DATE_SELECT.Model
*/

DATE_SELECT.Model = Backbone.Model.extend({
  
  defaults: function(){
    return {
      year: now.year,
      month: now.month,
      day: now.day,
      last_day: 0
    }
  },
  
  initialize: function(){
    _.bindAll(this, "setLastDay");
    this.setLastDay();
    this.on("change", this.setLastDay);
  },
  
  setLastDay: function(){
    var data = this.toJSON(),
        last_day = getLastDay(data.year, data.month);
    this.set("last_day", last_day);
  }
  
});



/*
## DATE_SELECT.View
*/

DATE_SELECT.View = Backbone.View.extend({
  
  initialize: function(){
    _.bindAll(this, "changeYear", "changeMonth", "changeDay", "setDay", "setResult");
    
    this.$year = this.$(".js_date_select_1__year");
    this.$month = this.$(".js_date_select_1__month");
    this.$day = this.$(".js_date_select_1__day");
    
    this.$year.val( this.model.get("year") );
    
    var month_html = "";
    for(var i = 1; i <= 12; i++){
      month_html += '<option value="'+i+'">'+i+'</option>';
    }
    this.$month.html(month_html);
    this.$month.val( this.model.get("month") );
    
    this.setDay();
    
    this.model.on("change:year", this.setDay);
    this.model.on("change:month", this.setDay);
    this.model.on("change", this.setResult);
    this.setResult();
    
    this.$year.change(this.changeYear);
    this.$month.change(this.changeMonth);
    this.$day.change(this.changeDay);
  },
  
  setResult: function(){
    var year = this.model.get("year"),
        month = this.model.get("month"),
        day = this.model.get("day"),
        last_day = this.model.get("last_day");
    this.$el.attr({
      "data-year": year,
      "data-month": month,
      "data-day": day,
      "data-date": year + "." + month + "." + day,
      "data-last_day": last_day,
    });
    this.trigger("changed");
  },
  
  changeYear: function(){
    this.model.set("year", parseInt(this.$year.val()) );
  },
  
  changeMonth: function(){
    this.model.set("month", parseInt(this.$month.val()) );
  },
  
  changeDay: function(){
    this.model.set("day", parseInt(this.$day.val()) );
  },
  
  setDay: function(){
    var year = this.model.get("year"),
        month = this.model.get("month"),
        day = this.model.get("day"),
        last_day = getLastDay(year, month),
        html = "";
    for( var i = 1; i <= last_day; i++ ){
      if( i === day ){
        html += '<option value="' + i + '" selected="selected">' + i + '</option>\n';
      } else {
        html += '<option value="' + i + '">' + i + '</option>\n';
      }
    }
    this.$day.html(html);
  }
  
});


})(jQuery, this, this.document);