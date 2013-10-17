(function(t,o,n){"use strict";Foundation.libs.dropdown={name:"dropdown",version:"4.3.0",settings:{activeClass:"open",is_hover:!1,opened:function(){},closed:function(){}},init:function(o,n,s){return this.scope=o||this.scope,Foundation.inherit(this,"throttle scrollLeft data_options"),"object"==typeof n&&t.extend(!0,this.settings,n),"string"!=typeof n?(this.settings.init||this.events(),this.settings.init):this[n].call(this,s)},events:function(){var s=this;t(this.scope).on("click.fndtn.dropdown","[data-dropdown]",function(o){var n=t.extend({},s.settings,s.data_options(t(this)));o.preventDefault(),n.is_hover||s.toggle(t(this))}).on("mouseenter","[data-dropdown]",function(){var o=t.extend({},s.settings,s.data_options(t(this)));o.is_hover&&s.toggle(t(this))}).on("mouseleave","[data-dropdown-content]",function(){var o=t('[data-dropdown="'+t(this).attr("id")+'"]'),n=t.extend({},s.settings,s.data_options(o));n.is_hover&&s.close.call(s,t(this))}).on("opened.fndtn.dropdown","[data-dropdown-content]",this.settings.opened).on("closed.fndtn.dropdown","[data-dropdown-content]",this.settings.closed),t(n).on("click.fndtn.dropdown",function(o){var n=t(o.target).closest("[data-dropdown-content]");if(!t(o.target).data("dropdown"))return n.length>0&&(t(o.target).is("[data-dropdown-content]")||t.contains(n.first()[0],o.target))?(o.stopPropagation(),void 0):(s.close.call(s,t("[data-dropdown-content]")),void 0)}),t(o).on("resize.fndtn.dropdown",s.throttle(function(){s.resize.call(s)},50)).trigger("resize"),this.settings.init=!0},close:function(o){var n=this;o.each(function(){t(this).hasClass(n.settings.activeClass)&&(t(this).css(Foundation.rtl?"right":"left","-99999px").removeClass(n.settings.activeClass),t(this).trigger("closed"))})},open:function(t,o){this.css(t.addClass(this.settings.activeClass),o),t.trigger("opened")},toggle:function(o){var n=t("#"+o.data("dropdown"));this.close.call(this,t("[data-dropdown-content]").not(n)),n.hasClass(this.settings.activeClass)?this.close.call(this,n):(this.close.call(this,t("[data-dropdown-content]")),this.open.call(this,n,o))},resize:function(){var o=t("[data-dropdown-content].open"),n=t("[data-dropdown='"+o.attr("id")+"']");o.length&&n.length&&this.css(o,n)},css:function(n,s){var e=n.offsetParent(),i=s.offset();if(i.top-=e.offset().top,i.left-=e.offset().left,this.small())n.css({position:"absolute",width:"95%",left:"2.5%","max-width":"none",top:i.top+this.outerHeight(s)});else{if(!Foundation.rtl&&t(o).width()>this.outerWidth(n)+s.offset().left){var d=i.left;n.hasClass("right")&&n.removeClass("right")}else{n.hasClass("right")||n.addClass("right");var d=i.left-(this.outerWidth(n)-this.outerWidth(s))}n.attr("style","").css({position:"absolute",top:i.top+this.outerHeight(s),left:d})}return n},small:function(){return 768>t(o).width()||t("html").hasClass("lt-ie9")},off:function(){t(this.scope).off(".fndtn.dropdown"),t("html, body").off(".fndtn.dropdown"),t(o).off(".fndtn.dropdown"),t("[data-dropdown-content]").off(".fndtn.dropdown"),this.settings.init=!1},reflow:function(){}}})(Foundation.zj,this,this.document);