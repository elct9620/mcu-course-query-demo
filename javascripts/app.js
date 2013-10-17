(function(){var e,r,n,t,o,u,c,s;s=function(e,r,n,t,o){return n.length-1>r?n[r+1].match(/(INSERT|CREATE|DROP|PRAGMA|BEGIN|COMMIT)/)?e.transaction(function(u){return u.executeSql(n[r]+";",[],function(){return s(e,r+1,n,t,o)})},function(u){return console.log("Query error in ",n[r],u.message),s(e,r+1,n,t,o)}):(n[r+1]=n[r]+";\n"+n[r+1],s(e,r+1,n,t,o)):("function"==typeof o&&o(),console.log("Done importing!"))},c=function(e){return e.transaction(function(e){return e.executeSql("select 'drop table ' || name || ';' as cmd from sqlite_master where type = 'table';",[],function(e,r){var n,t,o,u,c,s,a;for(s=r.rows,a=[],t=u=0,c=s.length;c>u;t=++u)o=s[t],n=r.rows.item(t).cmd,a.push(e.executeSql(n,[],function(){return n=null},function(e,r){return console.log(r.message)}));return a})})},r=openDatabase("mcu","1.0","MCU Course Database",1048576),c(r,"mcu"),n={1:"通識",2:"必修",3:"選修",4:"教育"},o={1:"大學日間部",2:"碩士班",3:"海青班",4:"研碩士班",5:"博士班",6:"碩士專班"},t={1:"上學期",2:"下學期",3:"全學期"},u={0:"不區分",1:"一年級",2:"二年級",3:"三年級",4:"四年級",5:"五年級"},e=angular.module("CourseQuery",[]),e.controller("CourseController",["$scope",function(e){return e.page=1,e.perPage=25,e.maxPage=1,e.ready=!1,e.course_query="",e.course_code_query="",$.get("mcu.sql",function(n){return s(r,2,n.split(";\n"),"mcu",function(){return e.ready=!0,e.$apply()})}),e.courses=[],e.formatSelectType=function(e){return n[e]},e.formatSystem=function(e){return o[e]},e.formatSemester=function(e){return t[e]},e.formatYear=function(e){return u[e]},e.getCourses=function(r){var n,t;return n=e.page||1,e.perPage=r,e.maxPage=Math.ceil(e.courses.length/r),t=e.courses.slice((n-1)*r,n*r)},e.getRepeat=function(e){return new Array(e)},e.changePage=function(r){return e.page=r},e.update=function(){var n,t;return e.page=1,e.maxPage=1,e.courses=[],0>=e.course_query.length&&0>=e.course_code_query.length?void 0:(t=[],e.course_query.length>0&&t.push("course_name LIKE '%"+e.course_query+"%'"),e.course_code_query.length>0&&t.push("course_code LIKE '%"+e.course_code_query+"%'"),n=t.join(" AND "),r.transaction(function(r){return r.executeSql("SELECT * FROM courses WHERE "+n+";",[],function(r,n){var t,o,u,c,s,a,l;for(a=n.rows,l=[],o=c=0,s=a.length;s>c;o=++c)u=a[o],t=n.rows.item(o),e.courses.push({system:t.system,select_type:t.select_type,code:t.course_code,class_code:t.class_code,name:t.course_name,selected_people:t.selected_people,max_people:t.max_people,credit:t.credit,year:t.year,semester:t.semester}),l.push(e.$apply());return l},function(e,r){return console.log("Error: "+r.message)})}))}}])}).call(this);