/*!
 * jquery.tickClock.js - Ticking Clock Plugin
 *
 * Copyright (c) 2011 Jedford Seculles
 * http://www.sourcepad.com/
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Launch  : May 2011
 * Version : 0.1 (Alpha)
 * Released: Monday 3nd May, 2011 - 00:00
 *
 * Developer Team: Jedford Seculles, Teejay Obazee, Rodel Medina
 */

(function($){
  
  // A global array used by the functions of the plug-in:
  var gVars = {};
  var opts = {};
  var intervalRate = 'd'; // d (day), h (hour), m (minute), s (second)
  var dials = ['orange','blue','green'];

  // Extending the jQuery core:
  $.fn.tickClock = function(options){
  
    // "this" contains the elements that were selected when calling the plugin: $('elements').tickClock();
    // If the selector returned more than one element, use the first one:
    
    var container = this.eq(0);
  
    if(!container)
    {
      try{
        console.log("Invalid selector!");
      } catch(e){}
      
      return false;
    }
    
    if(!options) {opts = {};}
    else {opts = options;}
    
    debugTime = new Date();
    
    var defaults = {
      testCurrTime: (debugTime.getMonth() + 1) + '/' + debugTime.getDate() + '/' + debugTime.getFullYear() + ' ' + debugTime.getHours() + ':' + debugTime.getMinutes() + ':' + debugTime.getSeconds(),
      observedTime: (debugTime.getMonth() + 1) + '/' + (debugTime.getDate() - 1) + '/' + debugTime.getFullYear() + ' ' + debugTime.getHours() + ':' + debugTime.getMinutes() + ':' + debugTime.getSeconds(),
      colors: ['orange','blue','green'], // n number of colors will represent each dial. Each color should have corresponding CSS jquery.tickClock.css
      countPattern: 'down', // up, down
      maxTime: 365, // for 365 days
      maxHours: 48
    };
    
    $.each(defaults,function(k,v){
      opts[k] = opts[k] || defaults[k];
    });
    
    // Calling the setUp function and passing the container,
    // will be available to the setUp function as "this":
    setUp.call(container);
    
    return this;
  }; // end tickClock
  
  function setUp()
  {
    // n number of colors will represent each dial.
    // Each color should have corresponding CSS jquery.tickClock.css
    // Available colors of the dials:
    // var colors = ['orange','blue','green'];
    dials = opts.colors;
    
    var tmp;
    var i;
    
    for(i=0;i<dials.length;i++)
    {
      // Creating a new element and setting the color as a class name:
      
      tmp = $('<div>').attr('class',dials[i]+' clock').html(
        '<div class="display"></div>'+
        
        '<div class="front left"></div>'+
        
        '<div class="rotate left">'+
          '<div class="bg left"></div>'+
        '</div>'+
        
        '<div class="rotate right">'+
          '<div class="bg right"></div>'+
        '</div>'
      );
      
      // Appending to the container:
      $(this).append(tmp);
      
      // Assigning some of the elements as variables for speed:
      tmp.rotateLeft = tmp.find('.rotate.left');
      tmp.rotateRight = tmp.find('.rotate.right');
      tmp.display = tmp.find('.display');
      
      // Adding the dial as a global variable. Will be available as gVars.colorName
      gVars[dials[i]] = tmp;
    }
    
    // Setting up a interval, executed every 1000 milliseconds:
    setInterval(function(){
      var diffTime;
      var diffInSecs;
      var days; 
      var hours;
      var minutes;
      var seconds;
      var mxHours = opts.maxHours;
      var mxTime = opts.maxTime;
      var currentTime = new Date();
      // var currentTime = new Date(opts.testCurrTime); // uncomment to test time
      var targetTime = new Date(opts.observedTime);
      
      if(opts.countPattern==='down')
        {
          diffTime = new Date(currentTime-targetTime);
          diffInSecs = Math.floor(diffTime.valueOf()/1000);
          days = (Math.floor(diffInSecs/86400))%mxTime;
          hours = mxHours-(Math.floor(diffInSecs/3600))%mxHours;
          minutes = 60-(Math.floor(diffInSecs/60))%60;
          seconds = 60-(Math.floor(diffInSecs/1))%60;
        }
      else
        {
          diffTime = new Date(targetTime-currentTime);
          diffInSecs = Math.floor(diffTime.valueOf()/1000);
          days = (Math.floor(diffInSecs/86400))%mxTime;
          hours = (Math.floor(diffInSecs/3600))%mxHours;
          minutes = (Math.floor(diffInSecs/60))%60;
          seconds = (Math.floor(diffInSecs/1))%60;
        }
      
      var tTime = days;
      
      if(days < 4)
      {
        tTime = hours;
        mxTime = mxHours + 1;
        intervalRate = 'h';
      }
      
      if(days > 0 && hours === 1 && minutes <= 59 && intervalRate === 'h')
      {
        tTime = minutes;
        mxTime = 60;
        intervalRate = 'm';
      }
      
      if(days > 0 && hours === 1 && minutes === 1 && seconds <= 59 && intervalRate === 'm')
      {
        tTime = seconds;
        mxTime = 60;
        intervalRate = 's';
      }
      
      if(days > 0 && hours >= mxHours)
      {
        tTime = 0;
        mxTime = 1;
        intervalRate = 'NaN'
      }
      
      console.log(intervalRate);
      
      $.each(dials, function(k,v){
        animation(gVars[v], tTime, mxTime);
      });
      
      // Default value from jquery.tzineClock
      // var h = currentTime.getHours();
      // var m = currentTime.getMinutes();
      // var s = currentTime.getSeconds();
      // animation(gVars.green, s, 60);
      // animation(gVars.blue, m, 60);
      // animation(gVars.orange, h, 12);
    },1000);
  }
  
  function animation(clock, current, total)
  {
    // Calculating the current angle:
    var angle = (360/total)*(current+1);

    var element;

    if(current==0)
    {
      // Hiding the right half of the background:
      clock.rotateRight.hide();

      // Resetting the rotation of the left part:
      rotateElement(clock.rotateLeft,0);
    }

    if(angle<=180)
    {
      // Hiding the right half of the background:
      clock.rotateRight.hide();

      // Resetting the rotation of the left part:
      rotateElement(clock.rotateLeft,0);
      
      // The left part is rotated, and the right is currently hidden:
      element = clock.rotateLeft;
    }
    else
    {
      // The first part of the rotation has completed, so we start rotating the right part:
      clock.rotateRight.show();
      clock.rotateLeft.show();

      rotateElement(clock.rotateLeft, 180);

      element = clock.rotateRight;
      angle = angle-180;
    }

    rotateElement(element,angle);

    // Setting the text inside of the display element, inserting a leading zero if needed:
    clock.display.html(current<10?'0'+current:current);
    clock.display.append('<small>'+intervalRate+'</small>');
  }

  function rotateElement(element, angle)
  {
    // Rotating the element, depending on the browser:
    var rotate = 'rotate('+angle+'deg)';

    if(element.css('MozTransform')!=undefined)
      element.css('MozTransform',rotate);

    else if(element.css('WebkitTransform')!=undefined)
      element.css('WebkitTransform',rotate);

    // A version for internet explorer using filters, works but is a bit buggy (no surprise here):
    else if(element.css("filter")!=undefined)
    {
      var cos = Math.cos(Math.PI * 2 / 360 * angle);
      var sin = Math.sin(Math.PI * 2 / 360 * angle);

      element.css("filter","progid:DXImageTransform.Microsoft.Matrix(M11="+cos+",M12=-"+sin+",M21="+sin+",M22="+cos+",SizingMethod='auto expand',FilterType='nearest neighbor')");

      element.css("left",-Math.floor((element.width()-200)/2));
      element.css("top",-Math.floor((element.height()-200)/2));
    }

  }

})(jQuery)