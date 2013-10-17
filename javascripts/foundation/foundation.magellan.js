(function(t,a){"use strict";Foundation.libs.magellan={name:"magellan",version:"4.2.2",settings:{activeClass:"active",threshold:0},init:function(a,i,e){return this.scope=a||this.scope,Foundation.inherit(this,"data_options"),"object"==typeof i&&t.extend(!0,this.settings,i),"string"!=typeof i?(this.settings.init||(this.fixed_magellan=t("[data-magellan-expedition]"),this.set_threshold(),this.last_destination=t("[data-magellan-destination]").last(),this.events()),this.settings.init):this[i].call(this,e)},events:function(){var i=this;t(this.scope).on("arrival.fndtn.magellan","[data-magellan-arrival]",function(){var a=t(this),e=a.closest("[data-magellan-expedition]"),n=e.attr("data-magellan-active-class")||i.settings.activeClass;a.closest("[data-magellan-expedition]").find("[data-magellan-arrival]").not(a).removeClass(n),a.addClass(n)}),this.fixed_magellan.on("update-position.fndtn.magellan",function(){t(this)}).trigger("update-position"),t(a).on("resize.fndtn.magellan",function(){this.fixed_magellan.trigger("update-position")}.bind(this)).on("scroll.fndtn.magellan",function(){var e=t(a).scrollTop();i.fixed_magellan.each(function(){var a=t(this);"undefined"==typeof a.data("magellan-top-offset")&&a.data("magellan-top-offset",a.offset().top),"undefined"==typeof a.data("magellan-fixed-position")&&a.data("magellan-fixed-position",!1);var n=e+i.settings.threshold>a.data("magellan-top-offset"),s=a.attr("data-magellan-top-offset");a.data("magellan-fixed-position")!=n&&(a.data("magellan-fixed-position",n),n?(a.addClass("fixed"),a.css({position:"fixed",top:0})):(a.removeClass("fixed"),a.css({position:"",top:""})),n&&"undefined"!=typeof s&&0!=s&&a.css({position:"fixed",top:s+"px"}))})}),this.last_destination.length>0&&t(a).on("scroll.fndtn.magellan",function(){var e=t(a).scrollTop(),n=e+t(a).height(),s=Math.ceil(i.last_destination.offset().top);t("[data-magellan-destination]").each(function(){var a=t(this),l=a.attr("data-magellan-destination"),o=a.offset().top-e;i.settings.threshold>=o&&t("[data-magellan-arrival='"+l+"']").trigger("arrival"),n>=t(i.scope).height()&&s>e&&n>s&&t("[data-magellan-arrival]").last().trigger("arrival")})}),this.settings.init=!0},set_threshold:function(){this.settings.threshold||(this.settings.threshold=this.fixed_magellan.length>0?this.outerHeight(this.fixed_magellan,!0):0)},off:function(){t(this.scope).off(".fndtn.magellan")},reflow:function(){}}})(Foundation.zj,this,this.document);