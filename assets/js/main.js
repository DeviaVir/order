'use strict';

var Debug_history = []
  , DEBUG = true
  , TRACE = 'trace'
  , WARN  = 'warn'
  , ERR   = 'error'
  , orderApp = angular.module( 'orderApp', [ 'ngRoute' ] );

// Init foundation scripts
$(document).foundation();

// Angular :)
orderApp.run([
	'Socket', 'Order', '$location', function kickOff( Socket, Order, $location ) {
		// Send to our loader until we have what we need
		var resumePath = $location.$$path
		  , loading    = true;

		if( true === loading )
			$location.path( '/loading' );

		// Connect to our Primus node
	    Socket.create( function() {
	    	Order.load( $location.$$host.split('.')[0], function() {
	    		setTimeout( function() {
	    			loading = false;
		    		if( resumePath && resumePath != '/loading' )
			    		window.location = '#' + resumePath;
			    	else
			    		window.location = '#/';
			    }, 3000 );
	    	})
	    });
	}]
).config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl'
		})
		.when('/kitchen', {
			templateUrl: 'views/kitchen.html',
			controller: 'KitchenCtrl'
		})
		.when('/bar', {
			templateUrl: 'views/bar.html',
			controller: 'BarCtrl'
		})
		.when('/waiter', {
			templateUrl: 'views/waiter.html',
			controller: 'WaiterCtrl'
		})
		.when('/manager', {
			templateUrl: 'views/manager.html',
			controller: 'ManagerCtrl'
		})
		.when( '/loading', {
			templateUrl: 'views/loading.html'
		})
		.otherwise({
			redirectTo: '/'
		});
});

window.Rainbow&&(window.Rainbow.linecount=function(k){this.splitLines=function(b){var c=[[]];b=b.childNodes;for(var f=0;f<b.length;f++){var a=b[f],d=[],e=c[c.length-1];if(3===a.nodeType)d=a.nodeValue.split("\n");else for(var g=a.innerHTML.split("\n"),h=0;h<g.length;h++){var j=a.cloneNode();j.innerHTML=g[h];d.push(j.outerHTML)}e.push(d[0]||"&#8203;");for(a=0;a<d.length-1;a++)c.push([d[a+1]||"&#8203;"])}return c};k.onHighlight(function(b){var c=document.createElement("table");c.className="rainbow";
c.setAttribute("data-language",b.getAttribute("data-language"));for(var f=this.splitLines(b),a=0;a<f.length;a++){var d=f[a],e=a+1,g=c.insertRow(-1);g.className="line line-"+e;var h=g.insertCell(-1);h.className="line-number";h.setAttribute("data-line-number",e);e=g.insertCell(-1);e.className="line-code";e.innerHTML=d.join("")}b=b.parentNode;b.innerHTML="";b.appendChild(c)})}(window.Rainbow));

/* Rainbow v1.2 rainbowco.de | included languages: html, css */
window.Rainbow=function(){function q(a){var b,c=a.getAttribute&&a.getAttribute("data-language")||0;if(!c){a=a.attributes;for(b=0;b<a.length;++b)if("data-language"===a[b].nodeName)return a[b].nodeValue}return c}function B(a){var b=q(a)||q(a.parentNode);if(!b){var c=/\blang(?:uage)?-(\w+)/;(a=a.className.match(c)||a.parentNode.className.match(c))&&(b=a[1])}return b}function C(a,b){for(var c in f[d]){c=parseInt(c,10);if(a==c&&b==f[d][c]?0:a<=c&&b>=f[d][c])delete f[d][c],delete j[d][c];if(a>=c&&a<f[d][c]||
b>c&&b<f[d][c])return!0}return!1}function r(a,b){return'<span class="'+a.replace(/\./g," ")+(l?" "+l:"")+'">'+b+"</span>"}function s(a,b,c,i){var e=a.exec(c);if(e){++t;!b.name&&"string"==typeof b.matches[0]&&(b.name=b.matches[0],delete b.matches[0]);var k=e[0],g=e.index,u=e[0].length+g,h=function(){function e(){s(a,b,c,i)}t%100>0?e():setTimeout(e,0)};if(C(g,u))h();else{var m=v(b.matches),l=function(a,c,i){if(a>=c.length)i(k);else{var d=e[c[a]];if(d){var g=b.matches[c[a]],f=g.language,h=g.name&&g.matches?
g.matches:g,j=function(b,d,g){var f;f=0;var h;for(h=1;h<c[a];++h)e[h]&&(f=f+e[h].length);d=g?r(g,d):d;k=k.substr(0,f)+k.substr(f).replace(b,d);l(++a,c,i)};f?n(d,f,function(a){j(d,a)}):typeof g==="string"?j(d,d,g):w(d,h.length?h:[h],function(a){j(d,a,g.matches?g.name:0)})}else l(++a,c,i)}};l(0,m,function(a){b.name&&(a=r(b.name,a));if(!j[d]){j[d]={};f[d]={}}j[d][g]={replace:e[0],"with":a};f[d][g]=u;h()})}}else i()}function v(a){var b=[],c;for(c in a)a.hasOwnProperty(c)&&b.push(c);return b.sort(function(a,
b){return b-a})}function w(a,b,c){function i(b,k){k<b.length?s(b[k].pattern,b[k],a,function(){i(b,++k)}):D(a,function(a){delete j[d];delete f[d];--d;c(a)})}++d;i(b,0)}function D(a,b){function c(a,b,i,f){if(i<b.length){++x;var h=b[i],l=j[d][h],a=a.substr(0,h)+a.substr(h).replace(l.replace,l["with"]),h=function(){c(a,b,++i,f)};0<x%250?h():setTimeout(h,0)}else f(a)}var i=v(j[d]);c(a,i,0,b)}function n(a,b,c){var d=m[b]||[],e=m[y]||[],b=z[b]?d:d.concat(e);w(a.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&(?![\w\#]+;)/g,
"&amp;"),b,c)}function o(a,b,c){if(b<a.length){var d=a[b],e=B(d);return!(-1<(" "+d.className+" ").indexOf(" rainbow "))&&e?(e=e.toLowerCase(),d.className+=d.className?" rainbow":"rainbow",n(d.innerHTML,e,function(k){d.innerHTML=k;j={};f={};p&&p(d,e);setTimeout(function(){o(a,++b,c)},0)})):o(a,++b,c)}c&&c()}function A(a,b){var a=a&&"function"==typeof a.getElementsByTagName?a:document,c=a.getElementsByTagName("pre"),d=a.getElementsByTagName("code"),e,f=[],g=[];for(e=0;e<c.length;++e)c[e].getElementsByTagName("code").length?
c[e].innerHTML=c[e].innerHTML.replace(/^\s+/,"").replace(/\s+$/,""):f.push(c[e]);for(e=0;e<d.length;++e)g.push(d[e]);o(g.concat(f),0,b)}var j={},f={},m={},z={},d=0,y=0,t=0,x=0,l,p;return{extend:function(a,b,c){1==arguments.length&&(b=a,a=y);z[a]=c;m[a]=b.concat(m[a]||[])},b:function(a){p=a},a:function(a){l=a},color:function(a,b,c){if("string"==typeof a)return n(a,b,c);if("function"==typeof a)return A(0,a);A(a,b)}}}();
document.addEventListener?document.addEventListener("DOMContentLoaded",Rainbow.color,!1):window.attachEvent("onload",Rainbow.color);Rainbow.onHighlight=Rainbow.b;Rainbow.addClass=Rainbow.a;Rainbow.extend("html",[{name:"source.php.embedded",matches:{2:{language:"php"}},pattern:/&lt;\?=?(?!xml)(php)?([\s\S]*?)(\?&gt;)/gm},{name:"source.css.embedded",matches:{"0":{language:"css"}},pattern:/&lt;style(.*?)&gt;([\s\S]*?)&lt;\/style&gt;/gm},{name:"source.js.embedded",matches:{"0":{language:"javascript"}},pattern:/&lt;script(?! src)(.*?)&gt;([\s\S]*?)&lt;\/script&gt;/gm},{name:"comment.html",pattern:/&lt;\!--[\S\s]*?--&gt;/g},{matches:{1:"support.tag.open",2:"support.tag.close"},pattern:/(&lt;)|(\/?\??&gt;)/g},
{name:"support.tag",matches:{1:"support.tag",2:"support.tag.special",3:"support.tag-name"},pattern:/(&lt;\??)(\/|\!?)(\w+)/g},{matches:{1:"support.attribute"},pattern:/([a-z-]+)(?=\=)/gi},{matches:{1:"support.operator",2:"string.quote",3:"string.value",4:"string.quote"},pattern:/(=)('|")(.*?)(\2)/g},{matches:{1:"support.operator",2:"support.value"},pattern:/(=)([a-zA-Z\-0-9]*)\b/g},{matches:{1:"support.attribute"},pattern:/\s(\w+)(?=\s|&gt;)(?![\s\S]*&lt;)/g}],!0);Rainbow.extend("css",[{name:"comment",pattern:/\/\*[\s\S]*?\*\//gm},{name:"constant.hex-color",pattern:/#([a-f0-9]{3}|[a-f0-9]{6})(?=;|\s|,|\))/gi},{matches:{1:"constant.numeric",2:"keyword.unit"},pattern:/(\d+)(px|em|cm|s|%)?/g},{name:"string",pattern:/('|")(.*?)\1/g},{name:"support.css-property",matches:{1:"support.vendor-prefix"},pattern:/(-o-|-moz-|-webkit-|-ms-)?[\w-]+(?=\s?:)(?!.*\{)/g},{matches:{1:[{name:"entity.name.sass",pattern:/&amp;/g},{name:"direct-descendant",pattern:/&gt;/g},{name:"entity.name.class",
pattern:/\.[\w\-_]+/g},{name:"entity.name.id",pattern:/\#[\w\-_]+/g},{name:"entity.name.pseudo",pattern:/:[\w\-_]+/g},{name:"entity.name.tag",pattern:/\w+/g}]},pattern:/([\w\ ,:\.\#\&\;\-_]+)(?=.*\{)/g},{matches:{2:"support.vendor-prefix",3:"support.css-value"},pattern:/(:|,)\s*(-o-|-moz-|-webkit-|-ms-)?([a-zA-Z-]*)(?=\b)(?!.*\{)/g},{matches:{1:"support.tag.style",2:[{name:"string",pattern:/('|")(.*?)(\1)/g},{name:"entity.tag.style",pattern:/(\w+)/g}],3:"support.tag.style"},pattern:/(&lt;\/?)(style.*?)(&gt;)/g}],
!0);

// debug command
var debug = ((function( msg ){ Debug_history.push(msg);if(Debug_history.length > 100) { Debug_history.shift() }; if( typeof(console) == 'undefined' || !DEBUG ) return false; var wantBackTrace = false, logType = 'log'; if( msg == WARN || msg == ERR || msg == TRACE || msg == null ){ logType = ( msg == null ? 'log' : msg ); if( logType == TRACE ) { wantBackTrace = true; logType = WARN; }; msg = arguments[1]; } var file = '', func = '', backTrace; try{ fail; }catch(e){ if( ('stack' in e) ){ var cur = ( e.stack.split( '\n' ).length > 2 ? 2 : (e.stack.split( '\n' ).length-1) ); func = e.stack.split( '\n' )[cur].split( '.' ); func = ( func.length >= 2 ? func[1].split( ' (http' )[0] : 'anonymous' ); file = e.stack.split( '\n' )[cur]; file = file.split( '/javascript/' ); if( file.length == 1 ) file = file[0].split( '/socket/' ); file = file[( file.length-1 )].split( '.js' )[0]; backTrace = e.stack.split( '\n' ).slice(cur).join( '\n' ); } } var now = new Date(); console[( logType )](( typeof msg == 'object' ? msg : '[' + ( now.getHours() < 10 ? '0' + now.getHours() : now.getHours() ) + ':' + (  now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes() ) + ':' + ( now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds() ) + '] [' + file + ':' + func + '] ' + msg )); if(wantBackTrace){ console.log(backTrace); } }) || (function(){ return true; }));