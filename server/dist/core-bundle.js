<<<<<<< HEAD
/*! For license information please see core-bundle.js.LICENSE.txt */
(()=>{var e={9669:(e,t,r)=>{e.exports=r(1609)},7970:(e,t,r)=>{"use strict";var n=r(4867),s=r(6026),o=r(4097),i=r(5327),a=r(8605),c=r(7211),l=r(938).http,u=r(938).https,h=r(8835),d=r(8761),p=r(696),_=r(5061),m=r(481),f=/https:?/;function v(e,t,r){if(e.hostname=t.host,e.host=t.host,e.port=t.port,e.path=r,t.auth){var n=Buffer.from(t.auth.username+":"+t.auth.password,"utf8").toString("base64");e.headers["Proxy-Authorization"]="Basic "+n}e.beforeRedirect=function(e){e.headers.host=e.host,v(e,t,e.href)}}e.exports=function(e){return new Promise((function(t,r){var C=function(e){t(e)},g=function(e){r(e)},y=e.data,b=e.headers;if(b["User-Agent"]||b["user-agent"]||(b["User-Agent"]="axios/"+p.version),y&&!n.isStream(y)){if(Buffer.isBuffer(y));else if(n.isArrayBuffer(y))y=Buffer.from(new Uint8Array(y));else{if(!n.isString(y))return g(_("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",e));y=Buffer.from(y,"utf-8")}b["Content-Length"]=y.length}var R=void 0;e.auth&&(R=(e.auth.username||"")+":"+(e.auth.password||""));var w=o(e.baseURL,e.url),E=h.parse(w),x=E.protocol||"http:";if(!R&&E.auth){var P=E.auth.split(":");R=(P[0]||"")+":"+(P[1]||"")}R&&delete b.Authorization;var S=f.test(x),D=S?e.httpsAgent:e.httpAgent,I={path:i(E.path,e.params,e.paramsSerializer).replace(/^\?/,""),method:e.method.toUpperCase(),headers:b,agent:D,agents:{http:e.httpAgent,https:e.httpsAgent},auth:R};e.socketPath?I.socketPath=e.socketPath:(I.hostname=E.hostname,I.port=E.port);var T,O=e.proxy;if(!O&&!1!==O){var F=x.slice(0,-1)+"_proxy",N=process.env[F]||process.env[F.toUpperCase()];if(N){var A=h.parse(N),L=process.env.no_proxy||process.env.NO_PROXY,q=!0;if(L&&(q=!L.split(",").map((function(e){return e.trim()})).some((function(e){return!!e&&("*"===e||"."===e[0]&&E.hostname.substr(E.hostname.length-e.length)===e||E.hostname===e)}))),q&&(O={host:A.hostname,port:A.port,protocol:A.protocol},A.auth)){var k=A.auth.split(":");O.auth={username:k[0],password:k[1]}}}}O&&(I.headers.host=E.hostname+(E.port?":"+E.port:""),v(I,O,x+"//"+E.hostname+(E.port?":"+E.port:"")+I.path));var j=S&&(!O||f.test(O.protocol));e.transport?T=e.transport:0===e.maxRedirects?T=j?c:a:(e.maxRedirects&&(I.maxRedirects=e.maxRedirects),T=j?u:l),e.maxBodyLength>-1&&(I.maxBodyLength=e.maxBodyLength);var U=T.request(I,(function(t){if(!U.aborted){var r=t,o=t.req||U;if(204!==t.statusCode&&"HEAD"!==o.method&&!1!==e.decompress)switch(t.headers["content-encoding"]){case"gzip":case"compress":case"deflate":r=r.pipe(d.createUnzip()),delete t.headers["content-encoding"]}var i={status:t.statusCode,statusText:t.statusMessage,headers:t.headers,config:e,request:o};if("stream"===e.responseType)i.data=r,s(C,g,i);else{var a=[];r.on("data",(function(t){a.push(t),e.maxContentLength>-1&&Buffer.concat(a).length>e.maxContentLength&&(r.destroy(),g(_("maxContentLength size of "+e.maxContentLength+" exceeded",e,null,o)))})),r.on("error",(function(t){U.aborted||g(m(t,e,null,o))})),r.on("end",(function(){var t=Buffer.concat(a);"arraybuffer"!==e.responseType&&(t=t.toString(e.responseEncoding),e.responseEncoding&&"utf8"!==e.responseEncoding||(t=n.stripBOM(t))),i.data=t,s(C,g,i)}))}}}));U.on("error",(function(t){U.aborted&&"ERR_FR_TOO_MANY_REDIRECTS"!==t.code||g(m(t,e,null,U))})),e.timeout&&U.setTimeout(e.timeout,(function(){U.abort(),g(_("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",U))})),e.cancelToken&&e.cancelToken.promise.then((function(e){U.aborted||(U.abort(),g(e))})),n.isStream(y)?y.on("error",(function(t){g(m(t,e,null,U))})).pipe(U):U.end(y)}))}},5448:(e,t,r)=>{"use strict";var n=r(4867),s=r(6026),o=r(4372),i=r(5327),a=r(4097),c=r(4109),l=r(7985),u=r(5061);e.exports=function(e){return new Promise((function(t,r){var h=e.data,d=e.headers;n.isFormData(h)&&delete d["Content-Type"];var p=new XMLHttpRequest;if(e.auth){var _=e.auth.username||"",m=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";d.Authorization="Basic "+btoa(_+":"+m)}var f=a(e.baseURL,e.url);if(p.open(e.method.toUpperCase(),i(f,e.params,e.paramsSerializer),!0),p.timeout=e.timeout,p.onreadystatechange=function(){if(p&&4===p.readyState&&(0!==p.status||p.responseURL&&0===p.responseURL.indexOf("file:"))){var n="getAllResponseHeaders"in p?c(p.getAllResponseHeaders()):null,o={data:e.responseType&&"text"!==e.responseType?p.response:p.responseText,status:p.status,statusText:p.statusText,headers:n,config:e,request:p};s(t,r,o),p=null}},p.onabort=function(){p&&(r(u("Request aborted",e,"ECONNABORTED",p)),p=null)},p.onerror=function(){r(u("Network Error",e,null,p)),p=null},p.ontimeout=function(){var t="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),r(u(t,e,"ECONNABORTED",p)),p=null},n.isStandardBrowserEnv()){var v=(e.withCredentials||l(f))&&e.xsrfCookieName?o.read(e.xsrfCookieName):void 0;v&&(d[e.xsrfHeaderName]=v)}if("setRequestHeader"in p&&n.forEach(d,(function(e,t){void 0===h&&"content-type"===t.toLowerCase()?delete d[t]:p.setRequestHeader(t,e)})),n.isUndefined(e.withCredentials)||(p.withCredentials=!!e.withCredentials),e.responseType)try{p.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&p.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&p.upload&&p.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){p&&(p.abort(),r(e),p=null)})),h||(h=null),p.send(h)}))}},1609:(e,t,r)=>{"use strict";var n=r(4867),s=r(1849),o=r(321),i=r(7185);function a(e){var t=new o(e),r=s(o.prototype.request,t);return n.extend(r,o.prototype,t),n.extend(r,t),r}var c=a(r(5655));c.Axios=o,c.create=function(e){return a(i(c.defaults,e))},c.Cancel=r(5263),c.CancelToken=r(4972),c.isCancel=r(6502),c.all=function(e){return Promise.all(e)},c.spread=r(8713),c.isAxiosError=r(6268),e.exports=c,e.exports.default=c},5263:e=>{"use strict";function t(e){this.message=e}t.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},t.prototype.__CANCEL__=!0,e.exports=t},4972:(e,t,r)=>{"use strict";var n=r(5263);function s(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var r=this;e((function(e){r.reason||(r.reason=new n(e),t(r.reason))}))}s.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},s.source=function(){var e;return{token:new s((function(t){e=t})),cancel:e}},e.exports=s},6502:e=>{"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},321:(e,t,r)=>{"use strict";var n=r(4867),s=r(5327),o=r(782),i=r(3572),a=r(7185);function c(e){this.defaults=e,this.interceptors={request:new o,response:new o}}c.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=a(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=[i,void 0],r=Promise.resolve(e);for(this.interceptors.request.forEach((function(e){t.unshift(e.fulfilled,e.rejected)})),this.interceptors.response.forEach((function(e){t.push(e.fulfilled,e.rejected)}));t.length;)r=r.then(t.shift(),t.shift());return r},c.prototype.getUri=function(e){return e=a(this.defaults,e),s(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},n.forEach(["delete","get","head","options"],(function(e){c.prototype[e]=function(t,r){return this.request(a(r||{},{method:e,url:t,data:(r||{}).data}))}})),n.forEach(["post","put","patch"],(function(e){c.prototype[e]=function(t,r,n){return this.request(a(n||{},{method:e,url:t,data:r}))}})),e.exports=c},782:(e,t,r)=>{"use strict";var n=r(4867);function s(){this.handlers=[]}s.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},s.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},s.prototype.forEach=function(e){n.forEach(this.handlers,(function(t){null!==t&&e(t)}))},e.exports=s},4097:(e,t,r)=>{"use strict";var n=r(1793),s=r(7303);e.exports=function(e,t){return e&&!n(t)?s(e,t):t}},5061:(e,t,r)=>{"use strict";var n=r(481);e.exports=function(e,t,r,s,o){var i=new Error(e);return n(i,t,r,s,o)}},3572:(e,t,r)=>{"use strict";var n=r(4867),s=r(8527),o=r(6502),i=r(5655);function a(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return a(e),e.headers=e.headers||{},e.data=s(e.data,e.headers,e.transformRequest),e.headers=n.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),n.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||i.adapter)(e).then((function(t){return a(e),t.data=s(t.data,t.headers,e.transformResponse),t}),(function(t){return o(t)||(a(e),t&&t.response&&(t.response.data=s(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))}},481:e=>{"use strict";e.exports=function(e,t,r,n,s){return e.config=t,r&&(e.code=r),e.request=n,e.response=s,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},7185:(e,t,r)=>{"use strict";var n=r(4867);e.exports=function(e,t){t=t||{};var r={},s=["url","method","data"],o=["headers","auth","proxy","params"],i=["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","timeoutMessage","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","decompress","maxContentLength","maxBodyLength","maxRedirects","transport","httpAgent","httpsAgent","cancelToken","socketPath","responseEncoding"],a=["validateStatus"];function c(e,t){return n.isPlainObject(e)&&n.isPlainObject(t)?n.merge(e,t):n.isPlainObject(t)?n.merge({},t):n.isArray(t)?t.slice():t}function l(s){n.isUndefined(t[s])?n.isUndefined(e[s])||(r[s]=c(void 0,e[s])):r[s]=c(e[s],t[s])}n.forEach(s,(function(e){n.isUndefined(t[e])||(r[e]=c(void 0,t[e]))})),n.forEach(o,l),n.forEach(i,(function(s){n.isUndefined(t[s])?n.isUndefined(e[s])||(r[s]=c(void 0,e[s])):r[s]=c(void 0,t[s])})),n.forEach(a,(function(n){n in t?r[n]=c(e[n],t[n]):n in e&&(r[n]=c(void 0,e[n]))}));var u=s.concat(o).concat(i).concat(a),h=Object.keys(e).concat(Object.keys(t)).filter((function(e){return-1===u.indexOf(e)}));return n.forEach(h,l),r}},6026:(e,t,r)=>{"use strict";var n=r(5061);e.exports=function(e,t,r){var s=r.config.validateStatus;r.status&&s&&!s(r.status)?t(n("Request failed with status code "+r.status,r.config,null,r.request,r)):e(r)}},8527:(e,t,r)=>{"use strict";var n=r(4867);e.exports=function(e,t,r){return n.forEach(r,(function(r){e=r(e,t)})),e}},5655:(e,t,r)=>{"use strict";var n=r(4867),s=r(6016),o={"Content-Type":"application/x-www-form-urlencoded"};function i(e,t){!n.isUndefined(e)&&n.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var a,c={adapter:("undefined"!=typeof XMLHttpRequest?a=r(5448):"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process)&&(a=r(7970)),a),transformRequest:[function(e,t){return s(t,"Accept"),s(t,"Content-Type"),n.isFormData(e)||n.isArrayBuffer(e)||n.isBuffer(e)||n.isStream(e)||n.isFile(e)||n.isBlob(e)?e:n.isArrayBufferView(e)?e.buffer:n.isURLSearchParams(e)?(i(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):n.isObject(e)?(i(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};n.forEach(["delete","get","head"],(function(e){c.headers[e]={}})),n.forEach(["post","put","patch"],(function(e){c.headers[e]=n.merge(o)})),e.exports=c},1849:e=>{"use strict";e.exports=function(e,t){return function(){for(var r=new Array(arguments.length),n=0;n<r.length;n++)r[n]=arguments[n];return e.apply(t,r)}}},5327:(e,t,r)=>{"use strict";var n=r(4867);function s(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,r){if(!t)return e;var o;if(r)o=r(t);else if(n.isURLSearchParams(t))o=t.toString();else{var i=[];n.forEach(t,(function(e,t){null!=e&&(n.isArray(e)?t+="[]":e=[e],n.forEach(e,(function(e){n.isDate(e)?e=e.toISOString():n.isObject(e)&&(e=JSON.stringify(e)),i.push(s(t)+"="+s(e))})))})),o=i.join("&")}if(o){var a=e.indexOf("#");-1!==a&&(e=e.slice(0,a)),e+=(-1===e.indexOf("?")?"?":"&")+o}return e}},7303:e=>{"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},4372:(e,t,r)=>{"use strict";var n=r(4867);e.exports=n.isStandardBrowserEnv()?{write:function(e,t,r,s,o,i){var a=[];a.push(e+"="+encodeURIComponent(t)),n.isNumber(r)&&a.push("expires="+new Date(r).toGMTString()),n.isString(s)&&a.push("path="+s),n.isString(o)&&a.push("domain="+o),!0===i&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},1793:e=>{"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},6268:e=>{"use strict";e.exports=function(e){return"object"==typeof e&&!0===e.isAxiosError}},7985:(e,t,r)=>{"use strict";var n=r(4867);e.exports=n.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a");function s(e){var n=e;return t&&(r.setAttribute("href",n),n=r.href),r.setAttribute("href",n),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:"/"===r.pathname.charAt(0)?r.pathname:"/"+r.pathname}}return e=s(window.location.href),function(t){var r=n.isString(t)?s(t):t;return r.protocol===e.protocol&&r.host===e.host}}():function(){return!0}},6016:(e,t,r)=>{"use strict";var n=r(4867);e.exports=function(e,t){n.forEach(e,(function(r,n){n!==t&&n.toUpperCase()===t.toUpperCase()&&(e[t]=r,delete e[n])}))}},4109:(e,t,r)=>{"use strict";var n=r(4867),s=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,r,o,i={};return e?(n.forEach(e.split("\n"),(function(e){if(o=e.indexOf(":"),t=n.trim(e.substr(0,o)).toLowerCase(),r=n.trim(e.substr(o+1)),t){if(i[t]&&s.indexOf(t)>=0)return;i[t]="set-cookie"===t?(i[t]?i[t]:[]).concat([r]):i[t]?i[t]+", "+r:r}})),i):i}},8713:e=>{"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}},4867:(e,t,r)=>{"use strict";var n=r(1849),s=Object.prototype.toString;function o(e){return"[object Array]"===s.call(e)}function i(e){return void 0===e}function a(e){return null!==e&&"object"==typeof e}function c(e){if("[object Object]"!==s.call(e))return!1;var t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function l(e){return"[object Function]"===s.call(e)}function u(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),o(e))for(var r=0,n=e.length;r<n;r++)t.call(null,e[r],r,e);else for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.call(null,e[s],s,e)}e.exports={isArray:o,isArrayBuffer:function(e){return"[object ArrayBuffer]"===s.call(e)},isBuffer:function(e){return null!==e&&!i(e)&&null!==e.constructor&&!i(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:a,isPlainObject:c,isUndefined:i,isDate:function(e){return"[object Date]"===s.call(e)},isFile:function(e){return"[object File]"===s.call(e)},isBlob:function(e){return"[object Blob]"===s.call(e)},isFunction:l,isStream:function(e){return a(e)&&l(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&"undefined"!=typeof window&&"undefined"!=typeof document},forEach:u,merge:function e(){var t={};function r(r,n){c(t[n])&&c(r)?t[n]=e(t[n],r):c(r)?t[n]=e({},r):o(r)?t[n]=r.slice():t[n]=r}for(var n=0,s=arguments.length;n<s;n++)u(arguments[n],r);return t},extend:function(e,t,r){return u(t,(function(t,s){e[s]=r&&"function"==typeof t?n(t,r):t})),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")},stripBOM:function(e){return 65279===e.charCodeAt(0)&&(e=e.slice(1)),e}}},696:e=>{"use strict";e.exports=JSON.parse('{"_from":"axios","_id":"axios@0.21.1","_inBundle":false,"_integrity":"sha512-dKQiRHxGD9PPRIUNIWvZhPTPpl1rf/OxTYKsqKUDjBwYylTvV7SjSHJb9ratfyzM6wCdLCOYLzs73qpg5c4iGA==","_location":"/axios","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"axios","name":"axios","escapedName":"axios","rawSpec":"","saveSpec":null,"fetchSpec":"latest"},"_requiredBy":["#USER","/"],"_resolved":"https://registry.npmjs.org/axios/-/axios-0.21.1.tgz","_shasum":"22563481962f4d6bde9a76d516ef0e5d3c09b2b8","_spec":"axios","_where":"d:\\\\Code\\\\VBox\\\\core","author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/axios/axios/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}],"dependencies":{"follow-redirects":"^1.10.0"},"deprecated":false,"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"bundlesize":"^0.17.0","coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.0.2","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^20.1.0","grunt-karma":"^2.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.2.0","karma-coverage":"^1.1.1","karma-firefox-launcher":"^1.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.2.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^5.2.0","sinon":"^4.5.0","typescript":"^2.8.1","url-search-params":"^0.10.0","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"},"homepage":"https://github.com/axios/axios","jsdelivr":"dist/axios.min.js","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","name":"axios","repository":{"type":"git","url":"git+https://github.com/axios/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","fix":"eslint --fix lib/**/*.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test && bundlesize","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","unpkg":"dist/axios.min.js","version":"0.21.1"}')},9435:e=>{var t=1e3,r=60*t,n=60*r,s=24*n;function o(e,t,r,n){var s=t>=1.5*r;return Math.round(e/r)+" "+n+(s?"s":"")}e.exports=function(e,i){i=i||{};var a,c,l=typeof e;if("string"===l&&e.length>0)return function(e){if(!((e=String(e)).length>100)){var o=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);if(o){var i=parseFloat(o[1]);switch((o[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return 315576e5*i;case"weeks":case"week":case"w":return 6048e5*i;case"days":case"day":case"d":return i*s;case"hours":case"hour":case"hrs":case"hr":case"h":return i*n;case"minutes":case"minute":case"mins":case"min":case"m":return i*r;case"seconds":case"second":case"secs":case"sec":case"s":return i*t;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return i;default:return}}}}(e);if("number"===l&&isFinite(e))return i.long?(a=e,(c=Math.abs(a))>=s?o(a,c,s,"day"):c>=n?o(a,c,n,"hour"):c>=r?o(a,c,r,"minute"):c>=t?o(a,c,t,"second"):a+" ms"):function(e){var o=Math.abs(e);return o>=s?Math.round(e/s)+"d":o>=n?Math.round(e/n)+"h":o>=r?Math.round(e/r)+"m":o>=t?Math.round(e/t)+"s":e+"ms"}(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))}},1227:(e,t,r)=>{t.formatArgs=function(t){if(t[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+t[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const r="color: "+this.color;t.splice(1,0,r,"color: inherit");let n=0,s=0;t[0].replace(/%[a-zA-Z%]/g,(e=>{"%%"!==e&&(n++,"%c"===e&&(s=n))})),t.splice(s,0,r)},t.save=function(e){try{e?t.storage.setItem("debug",e):t.storage.removeItem("debug")}catch(e){}},t.load=function(){let e;try{e=t.storage.getItem("debug")}catch(e){}return!e&&"undefined"!=typeof process&&"env"in process&&(e=process.env.DEBUG),e},t.useColors=function(){return!("undefined"==typeof window||!window.process||"renderer"!==window.process.type&&!window.process.__nwjs)||("undefined"==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))},t.storage=function(){try{return localStorage}catch(e){}}(),t.destroy=(()=>{let e=!1;return()=>{e||(e=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],t.log=console.debug||console.log||(()=>{}),e.exports=r(2447)(t);const{formatters:n}=e.exports;n.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}},2447:(e,t,r)=>{e.exports=function(e){function t(e){let r,s=null;function o(...e){if(!o.enabled)return;const n=o,s=Number(new Date),i=s-(r||s);n.diff=i,n.prev=r,n.curr=s,r=s,e[0]=t.coerce(e[0]),"string"!=typeof e[0]&&e.unshift("%O");let a=0;e[0]=e[0].replace(/%([a-zA-Z%])/g,((r,s)=>{if("%%"===r)return"%";a++;const o=t.formatters[s];if("function"==typeof o){const t=e[a];r=o.call(n,t),e.splice(a,1),a--}return r})),t.formatArgs.call(n,e),(n.log||t.log).apply(n,e)}return o.namespace=e,o.useColors=t.useColors(),o.color=t.selectColor(e),o.extend=n,o.destroy=t.destroy,Object.defineProperty(o,"enabled",{enumerable:!0,configurable:!1,get:()=>null===s?t.enabled(e):s,set:e=>{s=e}}),"function"==typeof t.init&&t.init(o),o}function n(e,r){const n=t(this.namespace+(void 0===r?":":r)+e);return n.log=this.log,n}function s(e){return e.toString().substring(2,e.toString().length-2).replace(/\.\*\?$/,"*")}return t.debug=t,t.default=t,t.coerce=function(e){return e instanceof Error?e.stack||e.message:e},t.disable=function(){const e=[...t.names.map(s),...t.skips.map(s).map((e=>"-"+e))].join(",");return t.enable(""),e},t.enable=function(e){let r;t.save(e),t.names=[],t.skips=[];const n=("string"==typeof e?e:"").split(/[\s,]+/),s=n.length;for(r=0;r<s;r++)n[r]&&("-"===(e=n[r].replace(/\*/g,".*?"))[0]?t.skips.push(new RegExp("^"+e.substr(1)+"$")):t.names.push(new RegExp("^"+e+"$")))},t.enabled=function(e){if("*"===e[e.length-1])return!0;let r,n;for(r=0,n=t.skips.length;r<n;r++)if(t.skips[r].test(e))return!1;for(r=0,n=t.names.length;r<n;r++)if(t.names[r].test(e))return!0;return!1},t.humanize=r(9435),t.destroy=function(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")},Object.keys(e).forEach((r=>{t[r]=e[r]})),t.names=[],t.skips=[],t.formatters={},t.selectColor=function(e){let r=0;for(let t=0;t<e.length;t++)r=(r<<5)-r+e.charCodeAt(t),r|=0;return t.colors[Math.abs(r)%t.colors.length]},t.enable(t.load()),t}},5158:(e,t,r)=>{"undefined"==typeof process||"renderer"===process.type||!0===process.browser||process.__nwjs?e.exports=r(1227):e.exports=r(39)},39:(e,t,r)=>{const n=r(3867),s=r(1669);t.init=function(e){e.inspectOpts={};const r=Object.keys(t.inspectOpts);for(let n=0;n<r.length;n++)e.inspectOpts[r[n]]=t.inspectOpts[r[n]]},t.log=function(...e){return process.stderr.write(s.format(...e)+"\n")},t.formatArgs=function(r){const{namespace:n,useColors:s}=this;if(s){const t=this.color,s="[3"+(t<8?t:"8;5;"+t),o=`  ${s};1m${n} [0m`;r[0]=o+r[0].split("\n").join("\n"+o),r.push(s+"m+"+e.exports.humanize(this.diff)+"[0m")}else r[0]=(t.inspectOpts.hideDate?"":(new Date).toISOString()+" ")+n+" "+r[0]},t.save=function(e){e?process.env.DEBUG=e:delete process.env.DEBUG},t.load=function(){return process.env.DEBUG},t.useColors=function(){return"colors"in t.inspectOpts?Boolean(t.inspectOpts.colors):n.isatty(process.stderr.fd)},t.destroy=s.deprecate((()=>{}),"Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."),t.colors=[6,2,3,4,5,1];try{const e=r(2130);e&&(e.stderr||e).level>=2&&(t.colors=[20,21,26,27,32,33,38,39,40,41,42,43,44,45,56,57,62,63,68,69,74,75,76,77,78,79,80,81,92,93,98,99,112,113,128,129,134,135,148,149,160,161,162,163,164,165,166,167,168,169,170,171,172,173,178,179,184,185,196,197,198,199,200,201,202,203,204,205,206,207,208,209,214,215,220,221])}catch(e){}t.inspectOpts=Object.keys(process.env).filter((e=>/^debug_/i.test(e))).reduce(((e,t)=>{const r=t.substring(6).toLowerCase().replace(/_([a-z])/g,((e,t)=>t.toUpperCase()));let n=process.env[t];return n=!!/^(yes|on|true|enabled)$/i.test(n)||!/^(no|off|false|disabled)$/i.test(n)&&("null"===n?null:Number(n)),e[r]=n,e}),{}),e.exports=r(2447)(t);const{formatters:o}=e.exports;o.o=function(e){return this.inspectOpts.colors=this.useColors,s.inspect(e,this.inspectOpts).split("\n").map((e=>e.trim())).join(" ")},o.O=function(e){return this.inspectOpts.colors=this.useColors,s.inspect(e,this.inspectOpts)}},2261:(e,t,r)=>{var n;e.exports=function(){if(!n)try{n=r(5158)("follow-redirects")}catch(e){n=function(){}}n.apply(null,arguments)}},938:(e,t,r)=>{var n=r(8835),s=n.URL,o=r(8605),i=r(7211),a=r(2413).Writable,c=r(2357),l=r(2261),u=Object.create(null);["abort","aborted","connect","error","socket","timeout"].forEach((function(e){u[e]=function(t,r,n){this._redirectable.emit(e,t,r,n)}}));var h=y("ERR_FR_REDIRECTION_FAILURE",""),d=y("ERR_FR_TOO_MANY_REDIRECTS","Maximum number of redirects exceeded"),p=y("ERR_FR_MAX_BODY_LENGTH_EXCEEDED","Request body larger than maxBodyLength limit"),_=y("ERR_STREAM_WRITE_AFTER_END","write after end");function m(e,t){a.call(this),this._sanitizeOptions(e),this._options=e,this._ended=!1,this._ending=!1,this._redirectCount=0,this._redirects=[],this._requestBodyLength=0,this._requestBodyBuffers=[],t&&this.on("response",t);var r=this;this._onNativeResponse=function(e){r._processResponse(e)},this._performRequest()}function f(e){var t={maxRedirects:21,maxBodyLength:10485760},r={};return Object.keys(e).forEach((function(o){var i=o+":",a=r[i]=e[o],u=t[o]=Object.create(a);Object.defineProperties(u,{request:{value:function(e,o,a){if("string"==typeof e){var u=e;try{e=C(new s(u))}catch(t){e=n.parse(u)}}else s&&e instanceof s?e=C(e):(a=o,o=e,e={protocol:i});return"function"==typeof o&&(a=o,o=null),(o=Object.assign({maxRedirects:t.maxRedirects,maxBodyLength:t.maxBodyLength},e,o)).nativeProtocols=r,c.equal(o.protocol,i,"protocol mismatch"),l("options",o),new m(o,a)},configurable:!0,enumerable:!0,writable:!0},get:{value:function(e,t,r){var n=u.request(e,t,r);return n.end(),n},configurable:!0,enumerable:!0,writable:!0}})})),t}function v(){}function C(e){var t={protocol:e.protocol,hostname:e.hostname.startsWith("[")?e.hostname.slice(1,-1):e.hostname,hash:e.hash,search:e.search,pathname:e.pathname,path:e.pathname+e.search,href:e.href};return""!==e.port&&(t.port=Number(e.port)),t}function g(e,t){var r;for(var n in t)e.test(n)&&(r=t[n],delete t[n]);return r}function y(e,t){function r(e){Error.captureStackTrace(this,this.constructor),this.message=e||t}return r.prototype=new Error,r.prototype.constructor=r,r.prototype.name="Error ["+e+"]",r.prototype.code=e,r}m.prototype=Object.create(a.prototype),m.prototype.abort=function(){this._currentRequest.removeAllListeners(),this._currentRequest.on("error",v),this._currentRequest.abort(),this.emit("abort"),this.removeAllListeners()},m.prototype.write=function(e,t,r){if(this._ending)throw new _;if(!("string"==typeof e||"object"==typeof e&&"length"in e))throw new TypeError("data should be a string, Buffer or Uint8Array");"function"==typeof t&&(r=t,t=null),0!==e.length?this._requestBodyLength+e.length<=this._options.maxBodyLength?(this._requestBodyLength+=e.length,this._requestBodyBuffers.push({data:e,encoding:t}),this._currentRequest.write(e,t,r)):(this.emit("error",new p),this.abort()):r&&r()},m.prototype.end=function(e,t,r){if("function"==typeof e?(r=e,e=t=null):"function"==typeof t&&(r=t,t=null),e){var n=this,s=this._currentRequest;this.write(e,t,(function(){n._ended=!0,s.end(null,null,r)})),this._ending=!0}else this._ended=this._ending=!0,this._currentRequest.end(null,null,r)},m.prototype.setHeader=function(e,t){this._options.headers[e]=t,this._currentRequest.setHeader(e,t)},m.prototype.removeHeader=function(e){delete this._options.headers[e],this._currentRequest.removeHeader(e)},m.prototype.setTimeout=function(e,t){var r=this;function n(){r._timeout&&clearTimeout(r._timeout),r._timeout=setTimeout((function(){r.emit("timeout"),s()}),e)}function s(){clearTimeout(this._timeout),t&&r.removeListener("timeout",t),this.socket||r._currentRequest.removeListener("socket",n)}return t&&this.on("timeout",t),this.socket?n():this._currentRequest.once("socket",n),this.once("response",s),this.once("error",s),this},["flushHeaders","getHeader","setNoDelay","setSocketKeepAlive"].forEach((function(e){m.prototype[e]=function(t,r){return this._currentRequest[e](t,r)}})),["aborted","connection","socket"].forEach((function(e){Object.defineProperty(m.prototype,e,{get:function(){return this._currentRequest[e]}})})),m.prototype._sanitizeOptions=function(e){if(e.headers||(e.headers={}),e.host&&(e.hostname||(e.hostname=e.host),delete e.host),!e.pathname&&e.path){var t=e.path.indexOf("?");t<0?e.pathname=e.path:(e.pathname=e.path.substring(0,t),e.search=e.path.substring(t))}},m.prototype._performRequest=function(){var e=this._options.protocol,t=this._options.nativeProtocols[e];if(t){if(this._options.agents){var r=e.substr(0,e.length-1);this._options.agent=this._options.agents[r]}var s=this._currentRequest=t.request(this._options,this._onNativeResponse);for(var o in this._currentUrl=n.format(this._options),s._redirectable=this,u)o&&s.on(o,u[o]);if(this._isRedirect){var i=0,a=this,c=this._requestBodyBuffers;!function e(t){if(s===a._currentRequest)if(t)a.emit("error",t);else if(i<c.length){var r=c[i++];s.finished||s.write(r.data,r.encoding,e)}else a._ended&&s.end()}()}}else this.emit("error",new TypeError("Unsupported protocol "+e))},m.prototype._processResponse=function(e){var t=e.statusCode;this._options.trackRedirects&&this._redirects.push({url:this._currentUrl,headers:e.headers,statusCode:t});var r=e.headers.location;if(r&&!1!==this._options.followRedirects&&t>=300&&t<400){if(this._currentRequest.removeAllListeners(),this._currentRequest.on("error",v),this._currentRequest.abort(),e.destroy(),++this._redirectCount>this._options.maxRedirects)return void this.emit("error",new d);((301===t||302===t)&&"POST"===this._options.method||303===t&&!/^(?:GET|HEAD)$/.test(this._options.method))&&(this._options.method="GET",this._requestBodyBuffers=[],g(/^content-/i,this._options.headers));var s=g(/^host$/i,this._options.headers)||n.parse(this._currentUrl).hostname,o=n.resolve(this._currentUrl,r);l("redirecting to",o),this._isRedirect=!0;var i=n.parse(o);if(Object.assign(this._options,i),i.hostname!==s&&g(/^authorization$/i,this._options.headers),"function"==typeof this._options.beforeRedirect){var a={headers:e.headers};try{this._options.beforeRedirect.call(null,this._options,a)}catch(e){return void this.emit("error",e)}this._sanitizeOptions(this._options)}try{this._performRequest()}catch(e){var c=new h("Redirected request failed: "+e.message);c.cause=e,this.emit("error",c)}}else e.responseUrl=this._currentUrl,e.redirects=this._redirects,this.emit("response",e),this._requestBodyBuffers=[]},e.exports=f({http:o,https:i}),e.exports.wrap=f},6560:e=>{"use strict";e.exports=(e,t=process.argv)=>{const r=e.startsWith("-")?"":1===e.length?"-":"--",n=t.indexOf(r+e),s=t.indexOf("--");return-1!==n&&(-1===s||n<s)}},2043:function(e,t,r){var n,s;!function(o,i){"use strict";void 0===(s="function"==typeof(n=function(){var e=function(){},t="undefined",r=typeof window!==t&&typeof window.navigator!==t&&/Trident\/|MSIE /.test(window.navigator.userAgent),n=["trace","debug","info","warn","error"];function s(e,t){var r=e[t];if("function"==typeof r.bind)return r.bind(e);try{return Function.prototype.bind.call(r,e)}catch(t){return function(){return Function.prototype.apply.apply(r,[e,arguments])}}}function o(){console.log&&(console.log.apply?console.log.apply(console,arguments):Function.prototype.apply.apply(console.log,[console,arguments])),console.trace&&console.trace()}function i(n){return"debug"===n&&(n="log"),typeof console!==t&&("trace"===n&&r?o:void 0!==console[n]?s(console,n):void 0!==console.log?s(console,"log"):e)}function a(t,r){for(var s=0;s<n.length;s++){var o=n[s];this[o]=s<t?e:this.methodFactory(o,t,r)}this.log=this.debug}function c(e,r,n){return function(){typeof console!==t&&(a.call(this,r,n),this[e].apply(this,arguments))}}function l(e,t,r){return i(e)||c.apply(this,arguments)}function u(e,r,s){var o,i=this,c="loglevel";function u(){var e;if(typeof window!==t&&c){try{e=window.localStorage[c]}catch(e){}if(typeof e===t)try{var r=window.document.cookie,n=r.indexOf(encodeURIComponent(c)+"=");-1!==n&&(e=/^([^;]+)/.exec(r.slice(n))[1])}catch(e){}return void 0===i.levels[e]&&(e=void 0),e}}"string"==typeof e?c+=":"+e:"symbol"==typeof e&&(c=void 0),i.name=e,i.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},i.methodFactory=s||l,i.getLevel=function(){return o},i.setLevel=function(r,s){if("string"==typeof r&&void 0!==i.levels[r.toUpperCase()]&&(r=i.levels[r.toUpperCase()]),!("number"==typeof r&&r>=0&&r<=i.levels.SILENT))throw"log.setLevel() called with invalid level: "+r;if(o=r,!1!==s&&function(e){var r=(n[e]||"silent").toUpperCase();if(typeof window!==t&&c){try{return void(window.localStorage[c]=r)}catch(e){}try{window.document.cookie=encodeURIComponent(c)+"="+r+";"}catch(e){}}}(r),a.call(i,r,e),typeof console===t&&r<i.levels.SILENT)return"No console available for logging"},i.setDefaultLevel=function(e){u()||i.setLevel(e,!1)},i.enableAll=function(e){i.setLevel(i.levels.TRACE,e)},i.disableAll=function(e){i.setLevel(i.levels.SILENT,e)};var h=u();null==h&&(h=null==r?"WARN":r),i.setLevel(h,!1)}var h=new u,d={};h.getLogger=function(e){if("symbol"!=typeof e&&"string"!=typeof e||""===e)throw new TypeError("You must supply a name when creating a logger.");var t=d[e];return t||(t=d[e]=new u(e,h.getLevel(),h.methodFactory)),t};var p=typeof window!==t?window.log:void 0;return h.noConflict=function(){return typeof window!==t&&window.log===h&&(window.log=p),h},h.getLoggers=function(){return d},h.default=h,h})?n.call(t,r,t,e):n)||(e.exports=s)}()},2130:(e,t,r)=>{"use strict";const n=r(2087),s=r(3867),o=r(6560),{env:i}=process;let a;function c(e,t={}){return 0!==(r=function(e,{streamIsTTY:t,sniffFlags:r=!0}={}){const s=function(){if("FORCE_COLOR"in i)return"true"===i.FORCE_COLOR?1:"false"===i.FORCE_COLOR?0:0===i.FORCE_COLOR.length?1:Math.min(Number.parseInt(i.FORCE_COLOR,10),3)}();void 0!==s&&(a=s);const c=r?a:s;if(0===c)return 0;if(r){if(o("color=16m")||o("color=full")||o("color=truecolor"))return 3;if(o("color=256"))return 2}if(e&&!t&&void 0===c)return 0;const l=c||0;if("dumb"===i.TERM)return l;if("win32"===process.platform){const e=n.release().split(".");return Number(e[0])>=10&&Number(e[2])>=10586?Number(e[2])>=14931?3:2:1}if("CI"in i)return["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI","GITHUB_ACTIONS","BUILDKITE","DRONE"].some((e=>e in i))||"codeship"===i.CI_NAME?1:l;if("TEAMCITY_VERSION"in i)return/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(i.TEAMCITY_VERSION)?1:0;if("truecolor"===i.COLORTERM)return 3;if("TERM_PROGRAM"in i){const e=Number.parseInt((i.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(i.TERM_PROGRAM){case"iTerm.app":return e>=3?3:2;case"Apple_Terminal":return 2}}return/-256(color)?$/i.test(i.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(i.TERM)||"COLORTERM"in i?1:l}(e,{streamIsTTY:e&&e.isTTY,...t}))&&{level:r,hasBasic:!0,has256:r>=2,has16m:r>=3};var r}o("no-color")||o("no-colors")||o("color=false")||o("color=never")?a=0:(o("color")||o("colors")||o("color=true")||o("color=always"))&&(a=1),e.exports={supportsColor:c,stdout:c({isTTY:s.isatty(1)}),stderr:c({isTTY:s.isatty(2)})}},6050:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ArrayHook=void 0;class r{constructor(){}static initialise(){r.initialised||(r.initialised=!0,Array.prototype.equals&&console.warn("Warning: possible duplicate definition of Array.prototype.equals."),Array.prototype.equals=function(e){if(!e)return!1;if(this.length!=e.length)return!1;for(var t=0,r=this.length;t<r;t++)if(this[t]instanceof Array&&e[t]instanceof Array){if(!this[t].equals(e[t]))return!1}else{if(this[t].equals)return this[t].equals(e[t]);if(this[t]!=e[t])return!1}return!0},Object.defineProperty(Array.prototype,"equals",{enumerable:!1}))}}t.ArrayHook=r,r.initialised=!1,r.initialise()},52:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CallDataBatched=t.CallData=t.CallKeepAlive=t.CallLeaderResolve=t.CallIceCandidate=t.CallAnswer=t.CallOffer=t.CallParticipation=t.ETransportType=void 0;const n=r(7288);var s;(s=t.ETransportType||(t.ETransportType={}))[s.Rtc=0]="Rtc",s[s.Web=1]="Web";class o{constructor(e,t,r,n=Math.random()){this._meetingId=e,this._isCandidateLeader=r,this._sessionSubId=t,this._glareResolve=n||Math.random()}get meetingId(){return this._meetingId}get isCandidateLeader(){return this._isCandidateLeader}get sessionSubId(){return this._sessionSubId}get glareResolve(){return this._glareResolve}get type(){return o.__type}equals(e){return this._meetingId===e._meetingId&&this._sessionSubId===e._sessionSubId&&this._isCandidateLeader===e._isCandidateLeader&&this._glareResolve.toPrecision(10)===e._glareResolve.toPrecision(10)}toJSON(){return{__type:o.__type,attributes:{_meetingId:this._meetingId,_sessionSubId:this._sessionSubId,_isCandidateLeader:this._isCandidateLeader,_glareResolve:this._glareResolve}}}static revive(e){return e.attributes?o.reviveDb(e.attributes):o.reviveDb(e)}static reviveDb(e){return new o(e._meetingId,e._sessionSubId,e._isCandidateLeader,e._glareResolve)}}t.CallParticipation=o,o.__type="CallParticipation";class i{constructor(e,t,r,n){this._from=e,this._to=t,this._offer=r,this._transport=n}get from(){return this._from}get to(){return this._to}get offer(){return this._offer}get transport(){return this._transport}get type(){return i.__type}equals(e){return this._from.equals(e._from)&&this._to.equals(e._to)&&this._offer===e._offer&&this._transport===e._transport}toJSON(){return{__type:i.__type,attributes:{_from:this._from,_to:this._to,_offer:this._offer,_transport:this.transport}}}static revive(e){return e.attributes?i.reviveDb(e.attributes):i.reviveDb(e)}static reviveDb(e){return new i(o.revive(e._from),o.revive(e._to),e._offer,e._transport)}}t.CallOffer=i,i.__type="CallOffer";class a{constructor(e,t,r,n){this._from=e,this._to=t,this._answer=r,this._transport=n}get from(){return this._from}get to(){return this._to}get answer(){return this._answer}get transport(){return this._transport}get type(){return a.__type}equals(e){return this._from.equals(e._from)&&this._to.equals(e._to)&&this._answer===e._answer&&this._transport===e._transport}toJSON(){return{__type:a.__type,attributes:{_from:this._from,_to:this._to,_answer:this._answer,_transport:this._transport}}}static revive(e){return e.attributes?a.reviveDb(e.attributes):a.reviveDb(e)}static reviveDb(e){return new a(o.revive(e._from),o.revive(e._to),e._answer,e._transport)}}t.CallAnswer=a,a.__type="CallAnswer";class c{constructor(e,t,r,n){this._from=e,this._to=t,this._ice=r,this._outbound=n}get from(){return this._from}get to(){return this._to}get ice(){return this._ice}get outbound(){return this._outbound}get type(){return c.__type}equals(e){return this._from.equals(e._from)&&this._to.equals(e._to)&&this._ice===e._ice&&this._outbound===e._outbound}toJSON(){return{__type:c.__type,attributes:{_from:this._from,_to:this._to,_ice:this._ice,_outbound:this._outbound}}}static revive(e){return e.attributes?c.reviveDb(e.attributes):c.reviveDb(e)}static reviveDb(e){return new c(o.revive(e._from),o.revive(e._to),e._ice,e._outbound)}}t.CallIceCandidate=c,c.__type="CallIceCandidate";class l{constructor(e=new Date,t=Math.random()){this._glareDate=e,this._glareResolve=t}get type(){return l.__type}equals(e){return this._glareDate.getTime()===e._glareDate.getTime()&&this._glareResolve.toPrecision(10)===e._glareResolve.toPrecision(10)}isWinnerVs(e){return this._glareDate.getTime()<e._glareDate.getTime()||this._glareDate.getTime()===e._glareDate.getTime()&&this._glareResolve<e._glareResolve}toJSON(){return{__type:l.__type,attributes:{_glareDate:this._glareDate,_glareResolve:this._glareResolve}}}static revive(e){return e.attributes?l.reviveDb(e.attributes):l.reviveDb(e)}static reviveDb(e){return new l(new Date(e._glareDate),Number(e._glareResolve))}}t.CallLeaderResolve=l,l.__type="CallLeaderResolve";class u{constructor(e=0){this._sequenceNo=e}get sequenceNo(){return this._sequenceNo}get type(){return u.__type}equals(e){return this._sequenceNo===e._sequenceNo}toJSON(){return{__type:u.__type,attributes:{_sequenceNo:this._sequenceNo}}}static revive(e){return e.attributes?u.reviveDb(e.attributes):u.reviveDb(e)}static reviveDb(e){return new u(e._sequenceNo)}}t.CallKeepAlive=u,u.__type="CallKeepAlive";class h{constructor(e,t,r){this._from=e,this._to=t,this._data=r}get from(){return this._from}get to(){return this._to}get data(){return this._data}get type(){return h.__type}equals(e){return this._from.equals(e._from)&&this._to.equals(e._to)&&this._data===e._data}toJSON(){return{__type:h.__type,attributes:{_from:this._from,_to:this._to,_data:JSON.stringify(this._data)}}}static revive(e){return e.attributes?h.reviveDb(e.attributes):h.reviveDb(e)}static reviveDb(e){var t=new n.StreamableTypes;return new h(o.revive(e._from),o.revive(e._to),t.reviveFromJSON(e._data))}}t.CallData=h,h.__type="CallData";class d{constructor(e,t,r){this._from=e,this._to=t,this._data=r}get from(){return this._from}get to(){return this._to}get data(){return this._data}get type(){return h.__type}equals(e){return this._from.equals(e._from)&&this._to.equals(e._to)&&this.data===e.data}toJSON(){return{__type:d.__type,attributes:{_from:this._from,_to:this._to,_data:JSON.stringify(this._data)}}}static revive(e){return e.attributes?d.reviveDb(e.attributes):d.reviveDb(e)}static reviveDb(e){let t=new Array(e._to?e._to.length:0);for(var r=0;e._to&&r<e._to.length;r++)t[r]=o.revive(e._to[r]);var s=new n.StreamableTypes;return new d(o.revive(e._from),t,s.reviveFromJSON(e._data))}}t.CallDataBatched=d,d.__type="CallDataBatched"},8115:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DateHook=void 0;class r{constructor(){}static initialise(){r.initialised||(r.initialised=!0,r.weekdays=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"),Date.prototype.getWeekDay&&console.warn("Warning: possible duplicate definition of Date.prototype.getWeekDay."),Date.prototype.getWeekDay=function(){var e=this.getDay();return r.weekdays[e]})}}t.DateHook=r,r.initialised=!1,r.initialise()},1036:(e,t)=>{"use strict";var r,n,s;Object.defineProperty(t,"__esModule",{value:!0}),t.EFourStateRagEnum=t.EThreeStateRagEnum=t.EThreeStateSwitchEnum=void 0,(s=t.EThreeStateSwitchEnum||(t.EThreeStateSwitchEnum={}))[s.On=0]="On",s[s.Off=1]="Off",s[s.Indeterminate=2]="Indeterminate",(n=t.EThreeStateRagEnum||(t.EThreeStateRagEnum={}))[n.Red=0]="Red",n[n.Amber=1]="Amber",n[n.Green=2]="Green",(r=t.EFourStateRagEnum||(t.EFourStateRagEnum={}))[r.Red=0]="Red",r[r.Amber=1]="Amber",r[r.Green=2]="Green",r[r.Indeterminate=3]="Indeterminate"},9584:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isEqual=void 0,t.isEqual=function e(t,r){var n=Object.prototype.toString.call(t);if(n!==Object.prototype.toString.call(r))return!1;if(["[object Array]","[object Object]"].indexOf(n)<0)return!1;var s="[object Array]"===n?t.length:Object.keys(t).length;if(s!==("[object Array]"===n?r.length:Object.keys(r).length))return!1;var o=function(t,r){var n=Object.prototype.toString.call(t);if(["[object Array]","[object Object]"].indexOf(n)>=0){if(!e(t,r))return!1}else{if(n!==Object.prototype.toString.call(r))return!1;if("[object Function]"===n){if(t.toString()!==r.toString())return!1}else if(t!==r)return!1}};if("[object Array]"===n){for(var i=0;i<s;i++)if(!1===o(t[i],r[i]))return!1}else for(var a in t)if(t.hasOwnProperty(a)&&!1===o(t[a],r[a]))return!1;return!0}},165:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Facility=void 0;class r{constructor(e,t,r,n,s){this._id=e,this._externalId=t,this._name=r,this._thumbnailUrl=n,this._homepageUrl=s}get id(){return this._id}get externalId(){return this._externalId}get name(){return this._name}get thumbnailUrl(){return this._thumbnailUrl}get homepageUrl(){return this._homepageUrl}get type(){return r.__type}equals(e){return this._id===e._id&&this._externalId===e._externalId&&this._name===e._name&&this._thumbnailUrl===e._thumbnailUrl&&this._homepageUrl===e._homepageUrl}toJSON(){return{__type:r.__type,attributes:{_id:this._id,_externalId:this._externalId,_name:this._name,_thumbnailUrl:this._thumbnailUrl,_homepageUrl:this._homepageUrl}}}static revive(e){return e.attributes?r.reviveDb(e.attributes):r.reviveDb(e)}static reviveDb(e){return new r(e._id,e._externalId,e._name,e._thumbnailUrl,e._homepageUrl)}}t.Facility=r,r.__type="Facility"},5887:(e,t)=>{"use strict";var r,n,s,o;Object.defineProperty(t,"__esModule",{value:!0}),t.GymClockState=t.GymClockAction=t.GymClockSpec=t.EGymClockAction=t.EGymClockState=t.EGymClockMusic=t.EGymClockDuration=void 0,function(e){e[e.Five=0]="Five",e[e.Ten=1]="Ten",e[e.Fifteen=2]="Fifteen",e[e.Twenty=3]="Twenty"}(r=t.EGymClockDuration||(t.EGymClockDuration={})),function(e){e[e.Uptempo=0]="Uptempo",e[e.Midtempo=1]="Midtempo",e[e.None=2]="None"}(n=t.EGymClockMusic||(t.EGymClockMusic={})),(o=t.EGymClockState||(t.EGymClockState={}))[o.Stopped=0]="Stopped",o[o.CountingDown=1]="CountingDown",o[o.Running=2]="Running",o[o.Paused=3]="Paused",(s=t.EGymClockAction||(t.EGymClockAction={}))[s.Start=0]="Start",s[s.Stop=1]="Stop",s[s.Pause=2]="Pause";class i{constructor(e=r.Ten,t=n.None,s=""){this._durationEnum=e,this._musicEnum=t,this._musicUrl=s}get durationEnum(){return this._durationEnum}get musicEnum(){return this._musicEnum}get musicUrl(){return this._musicUrl}get type(){return i.__type}equals(e){return this._durationEnum===e._durationEnum&&this._musicEnum===e._musicEnum&&this._musicUrl===e._musicUrl}toJSON(){return{__type:i.__type,attributes:{_durationEnum:this._durationEnum,_musicEnum:this._musicEnum,_musicUrl:this._musicUrl}}}static revive(e){return e.attributes?i.reviveDb(e.attributes):i.reviveDb(e)}static reviveDb(e){return new i(e._durationEnum,e._musicEnum,e._musicUrl)}}t.GymClockSpec=i,i.__type="GymClockSpec";class a{constructor(e){this._actionEnum=e}get actionEnum(){return this._actionEnum}get type(){return a.__type}equals(e){return this._actionEnum===e._actionEnum}toJSON(){return{__type:a.__type,attributes:{_actionEnum:this._actionEnum}}}static revive(e){return e.attributes?a.reviveDb(e.attributes):a.reviveDb(e)}static reviveDb(e){return new a(e._actionEnum)}}t.GymClockAction=a,a.__type="GymClockAction";class c{constructor(e,t){this._stateEnum=e,this._secondsIn=t}get stateEnum(){return this._stateEnum}get secondsIn(){return this._secondsIn}get type(){return c.__type}equals(e){return this._stateEnum===e._stateEnum&&this._secondsIn===e._secondsIn}toJSON(){return{__type:c.__type,attributes:{_stateEnum:this._stateEnum,_secondsIn:this._secondsIn}}}static revive(e){return e.attributes?c.reviveDb(e.attributes):c.reviveDb(e)}static reviveDb(e){return new c(e._stateEnum,e._secondsIn)}}t.GymClockState=c,c.__type="GymClockState"},8765:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.LiveDocumentChannelFactoryStub=void 0;const n=r(7288);var s=null;class o{constructor(){this.types=new n.StreamableTypes,this.onNewCallParticipation=function(e){},this.onCommandApply=function(e){},this.onCommandReverse=function(){},this.onDocument=function(e){}}onCommandApplyInner(e){this.onCommandApply&&this.onCommandApply(this.types.reviveFromJSON(e))}onCommandReverseInner(){this.onCommandReverse&&this.onCommandReverse()}onDocumentInner(e){this.onDocument&&this.onDocument(this.types.reviveFromJSON(e))}sendDocumentTo(e,t){this.onDocumentInner(JSON.stringify(t))}broadcastCommandApply(e){this.onCommandApplyInner(JSON.stringify(e))}broadcastCommandReverse(){this.onCommandReverseInner()}}t.LiveDocumentChannelFactoryStub=class{constructor(){}createConnectionIn(){return s||(s=new o),s}createConnectionOut(){return s||(s=new o),s}}},5386:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.LiveUndoCommand=t.LiveCommandProcessor=void 0,t.LiveCommandProcessor=class{constructor(e,t,r){this._lastCommandIndex=-1,this._document=e,this._channel=r,this._outbound=t,this._commands=new Array,this.invalidateIndex(),this._changeListeners=new Array,void 0!==t&&!t&&r&&(r.onCommandApply=this.onCommandApply.bind(this),r.onCommandReverse=this.onCommandReverse.bind(this),r.onDocument=this.onDocument.bind(this))}addChangeListener(e){this._changeListeners.push(e)}adoptAndApply(e){if(this.isValidIndex()?(0!=this._lastCommandIndex&&(this._commands=this._commands.splice(this._lastCommandIndex)),this._commands.unshift(e)):(this._lastCommandIndex=0,this._commands.unshift(e)),e.applyTo(this._document),void 0!==this._outbound&&this._channel&&this._outbound&&this._channel.broadcastCommandApply(e),this._changeListeners)for(var t=0;t<this._changeListeners.length;t++)this._changeListeners[t](e,this._document)}canUndo(){return!!(this._commands.length>0&&this.isValidIndex()&&this._lastCommandIndex<this._commands.length)&&this._commands[this._lastCommandIndex].canReverse()}canRedo(){return!!(this._commands.length>0&&this.isValidIndex()&&this._lastCommandIndex>0)}undo(){this.canUndo()&&(this._commands[this._lastCommandIndex].reverseFrom(this._document),this._channel&&this._outbound&&this._channel.broadcastCommandReverse(this._commands[this._lastCommandIndex]),this._lastCommandIndex++)}redo(){this.canRedo()&&(this._lastCommandIndex--,this._commands[this._lastCommandIndex].applyTo(this._document),this._channel&&this._outbound&&this._channel.broadcastCommandApply(this._commands[this._lastCommandIndex]))}clearCommands(){this._commands=new Array,this.invalidateIndex()}onCommandApply(e){this.adoptAndApply(e)}onCommandReverse(e){this.undo()}onDocument(e){this._document.assign(e),this.clearCommands()}invalidateIndex(){this._lastCommandIndex=-1}isValidIndex(){return-1!=this._lastCommandIndex}};class r{constructor(e=0){this._sequenceNo=e}get sequenceNo(){return this._sequenceNo}get type(){return r.__type}equals(e){return this._sequenceNo===e._sequenceNo}toJSON(){return{__type:r.__type,attributes:{_sequenceNo:this._sequenceNo}}}static revive(e){return e.attributes?r.reviveDb(e.attributes):r.reviveDb(e)}static reviveDb(e){return new r(e._sequenceNo)}}t.LiveUndoCommand=r,r.__type="LiveUndoCommand"},9840:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.LiveDocumentRemote=t.LiveDocumentMaster=void 0;class r{constructor(e,t,r,n,s){if(this._localPerson=e,this._localCallParticipation=t,this._channel=r?n.createConnectionOut():n.createConnectionIn(),this._document=s.createLiveDocument(r,this._channel),this._commandProcessor=this._document.createCommandProcessor(),r){var o=this;this._channel.onNewCallParticipation=function(e){o.channel.sendDocumentTo(e,o._document)}}}get localCallParticipation(){return this._localCallParticipation}get localPerson(){return this._localPerson}get document(){return this._document}get channel(){return this._channel}get commandProcessor(){return this._commandProcessor}}t.LiveDocumentMaster=class extends r{constructor(e,t,r,n){super(e,t,!0,r,n)}},t.LiveDocumentRemote=class extends r{constructor(e,t,r,n){super(e,t,!1,r,n)}}},7383:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.LiveWorkoutFactory=t.LiveWorkoutChannelFactoryPeer=t.LiveWhiteboardSelection=t.LiveWhiteboardCommand=t.LiveWorkout=void 0;const n=r(7288),s=r(52),o=r(5386);class i{constructor(e,t,r,n){this._outbound=r,n&&(this._channel=n),this._whiteboardText=e,this._resultsText=t}createCommandProcessor(){return new o.LiveCommandProcessor(this,this._outbound,this._channel)}get whiteboardText(){return this._whiteboardText}set whiteboardText(e){this._whiteboardText=e}get resultsText(){return this._resultsText}set resultsText(e){this._resultsText=e}get type(){return i.__type}equals(e){if(e.type===this.type){var t=e;return this._whiteboardText===t._whiteboardText&&this._resultsText===t._resultsText}return!1}assign(e){if(e.type===this.type){var t=e;this._whiteboardText=t._whiteboardText,this._resultsText=t._resultsText}}toJSON(){return{__type:i.__type,attributes:{_whiteboardText:this._whiteboardText,_resultsText:this._resultsText}}}static revive(e){return e.attributes?i.reviveDb(e.attributes):i.reviveDb(e)}static reviveDb(e){return new i(e._whiteboardText,e._resultsText)}}t.LiveWorkout=i,i.__type="LiveWorkout";class a{constructor(e,t){this._selection=new c,this._text=e,this._priorText=t}get type(){return a.__type}selection(){return this._selection}applyTo(e){if(e.type===i.__type){var t=e;this._priorText===t.whiteboardText&&(t.whiteboardText=this._text)}}reverseFrom(e){e.type==i.__type&&(e.whiteboardText=this._priorText)}canReverse(){return!0}toJSON(){return{__type:a.__type,attributes:{_text:this._text,_priorText:this._priorText}}}static revive(e){return e.attributes?a.reviveDb(e.attributes):a.reviveDb(e)}static reviveDb(e){return new a(e._text,e._priorText)}}t.LiveWhiteboardCommand=a,a.__type="LiveWhiteboardCommand";class c{constructor(){}type(){return"LiveWhiteboardSelection"}}t.LiveWhiteboardSelection=c;class l{constructor(e){this._types=new n.StreamableTypes,this.onNewCallParticipation=function(e){},this.onCommandApply=function(e){},this.onCommandReverse=function(){},this.onDocument=function(e){},this._peer=e,e.addRemoteDataListener(this.onData.bind(this))}onData(e){this._peer.isEdgeOnly()?(e.type===i.__type&&this.onDocument(e),e.type===a.__type&&this.onCommandApply(e),e.type===o.LiveUndoCommand.__type&&this.onCommandReverse()):e.type===s.CallParticipation.__type&&this.onNewCallParticipation(e)}sendDocumentTo(e,t){this._peer.sendTo(e,t)}broadcastCommandApply(e){this._peer.broadcast(e)}broadcastCommandReverse(){this._peer.broadcast(new o.LiveUndoCommand)}}t.LiveWorkoutChannelFactoryPeer=class{constructor(e){this._connection=e}createConnectionIn(){return new l(this._connection)}createConnectionOut(){return new l(this._connection)}},t.LiveWorkoutFactory=class{constructor(){}createLiveDocument(e,t){return new i("Waiting...[doc version1]","Waiting...[doc version2]",e,t)}}},8227:function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.LoggerFactory=t.ELoggerType=void 0;const s=n(r(9669)),o=r(4941);var i;!function(e){e[e.Server=0]="Server",e[e.Client=1]="Client"}(i=t.ELoggerType||(t.ELoggerType={}));t.LoggerFactory=class{constructor(){}createLogger(e,t){switch(e){case i.Server:return new a(t);case i.Client:default:return new a(t)}}};class a{constructor(e){this.logger=new o.ClientLoggerWrap,this.shipToSever=e}logError(e,t,r,n){if(this.logger.logError(e,t,r,n?JSON.stringify(n,null,2):""),this.shipToSever){const o=e+"."+t+": "+r+(n?JSON.stringify(n,null,2):"");s.default.post("/api/error",{params:{message:o}})}}logInfo(e,t,r,n){this.logger.logInfo(e,t,r,n?JSON.stringify(n,null,2):"")}}},4941:function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.ClientLoggerWrap=void 0;const s=n(r(9669));var o=r(2043);o.setLevel("info"),t.ClientLoggerWrap=class{constructor(){this.logger=o}logError(e,t,r,n){let o=new Date;const i=" "+e+"."+t+": "+r+(n||"")+" at:"+o.getHours()+":"+o.getMinutes()+":"+o.getSeconds()+":"+o.getMilliseconds();this.logger.error("Error:"+i),s.default.post("/api/error",{params:{message:encodeURIComponent(i)}}).then((e=>{}))}logInfo(e,t,r,n){let s=new Date,o=s.getHours()+":"+s.getMinutes()+":"+s.getSeconds()+":"+s.getMilliseconds();this.logger.info("Info: "+e+"."+t+": "+r+(n||"")+" at:"+o)}}},3351:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PeerFactory=void 0;const n=r(8227),s=r(52),o=r(8391),i=r(6403);(new n.LoggerFactory).createLogger(n.ELoggerType.Client,!0),t.PeerFactory=class{constructor(){}createCallerConnection(e,t,r,n,a,c,l,u){switch(t){case s.ETransportType.Rtc:default:return new o.PeerCallerRtc(r,n,a,c,l);case s.ETransportType.Web:return new i.PeerCallerWeb(r,n,a,c,l)}}createRecieverConnection(e,t,r,n,a,c,l,u){switch(t){case s.ETransportType.Rtc:default:return new o.PeerRecieverRtc(r,n,a,c,l);case s.ETransportType.Web:return new i.PeerRecieverWeb(r,n,a,c,l)}}}},3743:(e,t)=>{"use strict";var r;Object.defineProperty(t,"__esModule",{value:!0}),t.PeerNameCache=t.EPeerConnectionType=void 0,(r=t.EPeerConnectionType||(t.EPeerConnectionType={}))[r.Caller=0]="Caller",r[r.Reciever=1]="Reciever",t.PeerNameCache=class{constructor(){this.nameMap=new Map}addReturnUnique(e){if(!this.nameMap.has(e))return this.nameMap.set(e,!0),e;for(var t=1;;){var r=e+":"+t.toString();if(!this.nameMap.has(r))return this.nameMap.set(r,!0),r;t++}}}},404:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PeerLink=void 0;const n=r(8227),s=r(3743),o=r(3351);var i=(new n.LoggerFactory).createLogger(n.ELoggerType.Client,!0);class a{constructor(e,t,r,n,i,a,c,l){this.onRemoteData=function(e){},this.onRemoteFail=function(e){},this._outbound=e,this._localCallParticipation=r,this._remoteCallParticipation=n,this._person=i,this._transport=t;let u=new o.PeerFactory;e?(this._peerCaller=u.createCallerConnection(s.EPeerConnectionType.Caller,t,r,n,i,a,c,l),this._peerCaller.onRemoteData=this.onRemoteDataInner.bind(this),this._peerCaller.onRemoteFail=this.onRemoteFailInner.bind(this),this._peerReciever=void 0):(this._peerReciever=u.createRecieverConnection(s.EPeerConnectionType.Reciever,t,r,n,i,a,c,l),this._peerReciever.onRemoteData=this.onRemoteDataInner.bind(this),this._peerReciever.onRemoteFail=this.onRemoteFailInner.bind(this),this._peerCaller=void 0)}get remoteCallParticipation(){return this._remoteCallParticipation}get localCallParticipation(){return this._localCallParticipation}get person(){return this._person}get isOutbound(){return this._outbound}get transport(){return this._transport}placeCall(){this._outbound&&this._peerCaller?this._peerCaller.placeCall():i.logError(a.className,"placeCall","Recieved placeCall but do not have caller:",null)}answerCall(e){!this._outbound&&this._peerReciever?this._peerReciever.answerCall(e):i.logError(a.className,"answerCall","Recieved offer but do not have reciever:",e)}handleAnswer(e){this._outbound&&this._peerCaller?this._peerCaller.handleAnswer(e):i.logError(a.className,"handleAnswer","Recieved answer but do not have caller:",e)}handleIceCandidate(e){this._outbound?this._peerCaller&&this._peerCaller.handleIceCandidate(e):this._peerReciever&&this._peerReciever.handleIceCandidate(e)}handleRemoteData(e){this._outbound?this._peerCaller&&this._peerCaller.handleRemoteData(e):this._peerReciever&&this._peerReciever.handleRemoteData(e)}send(e){this._outbound&&this._peerCaller&&this._peerCaller.send(e),!this._outbound&&this._peerReciever&&this._peerReciever.send(e)}isConnectedToLeader(){return!!(!this._outbound&&this._peerReciever&&this._peerReciever.remotePerson()&&this._peerReciever.remoteCallParticipation().isCandidateLeader&&this._peerReciever.isConnected())||!!(this._outbound&&this._peerCaller&&this._peerCaller.remotePerson()&&this._peerCaller.remoteCallParticipation().isCandidateLeader&&this._peerCaller.isConnected())}isConnectedToPerson(e){return!(this._outbound||!this._peerReciever||!this._peerReciever.remotePersonIs(e)||!this._peerReciever.isConnected())||!!(this._outbound&&this._peerCaller&&this._peerCaller.remotePersonIs(e)&&this._peerCaller.isConnected())}onRemoteDataInner(e){this.onRemoteData&&this.onRemoteData(e)}onRemoteFailInner(){this.onRemoteFail&&this.onRemoteFail(this)}}t.PeerLink=a,a.className="PeerLink"},8391:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PeerRecieverRtc=t.PeerCallerRtc=t.RtcConfigFactory=t.ERtcConfigurationType=void 0;const n=r(8586),s=r(4900),o=r(8227),i=r(7288),a=r(52),c=r(3743);var l,u=(new o.LoggerFactory).createLogger(o.ELoggerType.Client,!0);!function(e){e[e.StunOnly=0]="StunOnly",e[e.TurnOnly=1]="TurnOnly",e[e.StunThenTurn=2]="StunThenTurn",e[e.Nothing=3]="Nothing"}(l=t.ERtcConfigurationType||(t.ERtcConfigurationType={}));const h=l.StunThenTurn;class d{constructor(){}createConfig(e){switch(e){case l.Nothing:return{iceServers:[]};case l.StunOnly:return{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}]};case l.TurnOnly:return{iceServers:[{urls:"turn:ec2-18-216-213-192.us-east-2.compute.amazonaws.com:3480",username:"ubuntu",credential:"1wtutona"}]};case l.StunThenTurn:default:return{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}]}}}}t.RtcConfigFactory=d,t.PeerCallerRtc=class{constructor(e,t,r,n,s){this.onRemoteData=function(e){},this.onRemoteFail=function(){},this.peerHelp=new p(e,t,r,n,s),this.peerHelp.onRemoteData=this.onRemoteDataInner.bind(this),this.peerHelp.onRemoteFail=this.onRemoteFailInner.bind(this)}localCallParticipation(){return this.peerHelp.localCallParticipation}remoteCallParticipation(){return this.peerHelp.remoteCallParticipation}localPerson(){return this.peerHelp.localPerson}remotePerson(){return this.peerHelp.remotePerson}remotePersonIs(e){return!!this.peerHelp.remotePerson&&this.peerHelp.remotePerson.name===e}isConnected(){return this.peerHelp.isChannelConnected}placeCall(){this.peerHelp.createConnection(c.EPeerConnectionType.Caller,"Caller")}handleAnswer(e){this.peerHelp.handleAnswer(e)}handleIceCandidate(e){this.peerHelp.handleIceCandidate(e)}handleRemoteData(e){}send(e){this.peerHelp.send(e)}close(){this.peerHelp.close()}onRemoteDataInner(e){this.onRemoteData&&this.onRemoteData(e)}onRemoteFailInner(){this.onRemoteFail&&this.onRemoteFail()}},t.PeerRecieverRtc=class{constructor(e,t,r,n,s){this.onRemoteData=function(e){},this.onRemoteFail=function(){},this.peerHelp=new p(e,t,r,n,s),this.peerHelp.onRemoteData=this.onRemoteDataInner.bind(this),this.peerHelp.onRemoteFail=this.onRemoteFailInner.bind(this)}localCallParticipation(){return this.peerHelp.localCallParticipation}remoteCallParticipation(){return this.peerHelp.remoteCallParticipation}localPerson(){return this.peerHelp.localPerson}remotePerson(){return this.peerHelp.remotePerson}remotePersonIs(e){return!!this.peerHelp.remotePerson&&this.peerHelp.remotePerson.name===e}isConnected(){return this.peerHelp.isChannelConnected}answerCall(e){this.peerHelp.createConnection(c.EPeerConnectionType.Reciever,"Reciever"),this.peerHelp.answerCall(e)}handleIceCandidate(e){this.peerHelp.handleIceCandidate(e)}handleRemoteData(e){}send(e){this.peerHelp.send(e)}close(){this.peerHelp.close()}onRemoteDataInner(e){this.onRemoteData&&this.onRemoteData(e)}onRemoteFailInner(){this.onRemoteFail&&this.onRemoteFail()}};class p{constructor(e,t,r,n,o){this.onRemoteData=function(e){},this.onRemoteFail=function(){},this._localCallParticipation=e,this._remoteCallParticipation=t,this._localPerson=r,this._nameCache=n,this._signaller=o,this._types=new i.StreamableTypes,this._isChannelConnected=!1,this._isIceConnected=!1,this._sendChannel=void 0,this._recieveChannel=void 0,this._sendQueue=new s.Queue,this._connection=void 0,this._iceQueue=new s.Queue}get localCallParticipation(){return this._localCallParticipation}get remoteCallParticipation(){return this._remoteCallParticipation}get localPerson(){return this._localPerson}get remotePerson(){return this._remotePerson}get isChannelConnected(){return this._isChannelConnected}get isIceConnected(){return this._isIceConnected}createConnection(e,t){let r=(new d).createConfig(h);this._connection=new RTCPeerConnection(r),this._connection.onicecandidate=e=>{this.onIceCandidate(e.candidate,this.remoteCallParticipation)},e===c.EPeerConnectionType.Caller?this._connection.onnegotiationneeded=e=>{this.onNegotiationNeededCaller.bind(this)(e)}:this._connection.onnegotiationneeded=e=>{this.onNegotiationNeededReciever.bind(this)(e)},this._connection.ondatachannel=e=>{this.onRecieveDataChannel.bind(this)(e.channel)},this._connection.oniceconnectionstatechange=e=>{this.onIceConnectionStateChange.bind(this)(e,this._connection)},this._connection.onconnectionstatechange=e=>{this.onConnectionStateChange.bind(this)(e,this._connection)},this._connection.onicecandidateerror=e=>{this.onIceCandidateError.bind(this)(e)},this.createSendChannel(this._connection,t)}onIceCandidate(e,t){var r=new a.CallIceCandidate(this.localCallParticipation,t,e,!0);this._signaller.sendIceCandidate(r)}onNegotiationNeededCaller(e){var t=this;u.logInfo(p.className,"onNegotiationNeededCaller","Event:",e),this._connection.createOffer({iceRestart:!0}).then((e=>t._connection.setLocalDescription(e))).then((()=>{u.logInfo(p.className,"onNegotiationNeededCaller","Posting offer",null);var e=new a.CallOffer(t.localCallParticipation,t.remoteCallParticipation,t._connection.localDescription,a.ETransportType.Rtc);t._signaller.sendOffer(e)}))}onNegotiationNeededReciever(e){u.logInfo(p.className,"onNegotiationNeededReciever","Event:",e)}onConnectionStateChange(e,t){switch(u.logInfo(p.className,"onConnectionStateChange","State:",t.connectionState),t.connectionState){case"connected":case"disconnected":break;case"failed":this._isChannelConnected=!1,this.onRemoteFail&&this.onRemoteFail();break;case"closed":this._isChannelConnected=!1}}handleIceCandidate(e){this._connection&&this._connection.remoteDescription&&this._connection.remoteDescription.type?e.ice&&(this.isIceConnected||this._connection.addIceCandidate(new RTCIceCandidate(e.ice)).catch((e=>{u.logError(p.className,"handleIceCandidate","error:",e)}))):this._iceQueue.enqueue(e)}handleAnswer(e){var t=this;this._isIceConnected||this._connection.setRemoteDescription(new RTCSessionDescription(e.answer)).then((()=>{for(u.logInfo(p.className,"handleAnswer","succeeded",null);!t._iceQueue.isEmpty();)t.handleIceCandidate.bind(t)(t._iceQueue.dequeue())})).catch((e=>{u.logError(p.className,"handleAnswer","error:",e)}))}answerCall(e){let t=this;this._connection.setRemoteDescription(new RTCSessionDescription(e.offer)).then((()=>t._connection.createAnswer({iceRestart:!0}))).then((e=>t._connection.setLocalDescription(e))).then((()=>{u.logInfo(p.className,"answerCall","Posting answer",null);var r=new a.CallAnswer(t.localCallParticipation,e.from,t._connection.localDescription,a.ETransportType.Rtc);this._signaller.sendAnswer(r).then((e=>{for(;!t._iceQueue.isEmpty();)t.handleIceCandidate.bind(t)(t._iceQueue.dequeue())}))}))}close(){this._connection.close()}createSendChannel(e,t){this._sendChannel&&this._sendChannel.close(),this._sendChannel=e.createDataChannel(t),this._sendChannel.onopen=e=>{this.onSendChannelOpen(e,this._sendChannel)},this._sendChannel.onerror=this.onSendChannelError.bind(this),this._sendChannel.onmessage=this.onSendChannelMessage.bind(this),this._sendChannel.onclose=this.onSendChannelClose.bind(this)}send(e){if(this._sendChannel&&"open"===this._sendChannel.readyState){for(;!this._sendQueue.isEmpty();)this._sendChannel.send(JSON.stringify(this._sendQueue.dequeue()));this._sendChannel.send(JSON.stringify(e))}else this._sendQueue.enqueue(e)}onSendChannelOpen(e,t){this._isChannelConnected=!0;try{t.send(JSON.stringify(this.localPerson))}catch(e){u.logError(p.className,"onSendChannelOpen","error:",e)}}onSendChannelMessage(e){u.logInfo(p.className,"onSendChannelMessage","message:",e.data)}onSendChannelError(e){let t=e;u.logError(p.className,"onSendChannelError","error:",t.error)}onSendChannelClose(e){u.logInfo(p.className,"onSendChannelClose","event:",e)}onIceConnectionStateChange(e,t){var r=t.iceConnectionState;u.logInfo(p.className,"onIceConnectionStateChange","state:",r),"connected"===r&&(this._isIceConnected=!0),"failed"===r&&(this._isIceConnected=!1)}onIceCandidateError(e){var t=e;701===t.errorCode?u.logError(p.className,"onIceCandidateError",t.url+" ",t.errorText):u.logInfo(p.className,"onIceCandidateError","event:",e)}onRecieveDataChannel(e){u.logInfo(p.className,"onRecieveDataChannel","",null),this._recieveChannel&&this._recieveChannel.close(),this._recieveChannel=e,this._recieveChannel.onmessage=e=>{this.onRecieveChannelMessage(e)},this._recieveChannel.onopen=e=>{this.onRecieveChannelOpen(e,this._recieveChannel)},this._recieveChannel.onclose=this.onRecieveChannelClose.bind(this),this._recieveChannel.onerror=this.onRecieveChannelError.bind(this)}onRecieveChannelOpen(e,t){u.logInfo(p.className,"onRecieveChannelOpen","",null)}onRecieveChannelError(e){var t=e;u.logError(p.className,"onRecieveChannelError","error:",t.error)}onRecieveChannelClose(e){u.logInfo(p.className,"onRecieveChannelClose","",null)}onRecieveChannelMessage(e){var t=e,r=this._types.reviveFromJSON(t.data);if(r.type===n.Person.__type){var s=r;this._remotePerson=new n.Person(s.id,s.externalId,this._nameCache.addReturnUnique(s.name),s.email,s.thumbnailUrl,s.lastAuthCode),this.onRemoteData&&this.onRemoteData(this._remoteCallParticipation),this.onRemoteData&&this.onRemoteData(this._remotePerson)}else this.onRemoteData&&this.onRemoteData(r)}}p.className="RtcPeerHelper"},6403:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.WebPeerHelper=t.PeerRecieverWeb=t.PeerCallerWeb=void 0;const n=r(8586),s=r(4900),o=r(8227),i=r(7288),a=r(52);(new o.LoggerFactory).createLogger(o.ELoggerType.Client,!0),t.PeerCallerWeb=class{constructor(e,t,r,n,s){this.onRemoteData=function(e){},this.onRemoteFail=function(){},this.peerHelp=new c(e,t,r,n,s),this.peerHelp.onRemoteData=this.onRemoteDataInner.bind(this),this.peerHelp.onRemoteFail=this.onRemoteFailInner.bind(this)}localCallParticipation(){return this.peerHelp.localCallParticipation}remoteCallParticipation(){return this.peerHelp.remoteCallParticipation}localPerson(){return this.peerHelp.localPerson}remotePerson(){return this.peerHelp.remotePerson}remotePersonIs(e){return!!this.peerHelp.remotePerson&&this.peerHelp.remotePerson.name===e}isConnected(){return this.peerHelp.isChannelConnected}placeCall(){this.peerHelp.placeCall()}handleAnswer(e){this.peerHelp.handleAnswer(e)}handleIceCandidate(e){}handleRemoteData(e){this.peerHelp.handleRemoteData(e)}send(e){this.peerHelp.send(e)}close(){this.peerHelp.close()}onRemoteDataInner(e){this.onRemoteData&&this.onRemoteData(e)}onRemoteFailInner(){this.onRemoteFail&&this.onRemoteFail()}},t.PeerRecieverWeb=class{constructor(e,t,r,n,s){this.onRemoteData=function(e){},this.onRemoteFail=function(){},this.peerHelp=new c(e,t,r,n,s),this.peerHelp.onRemoteData=this.onRemoteDataInner.bind(this),this.peerHelp.onRemoteFail=this.onRemoteFailInner.bind(this)}localCallParticipation(){return this.peerHelp.localCallParticipation}remoteCallParticipation(){return this.peerHelp.remoteCallParticipation}localPerson(){return this.peerHelp.localPerson}remotePerson(){return this.peerHelp.remotePerson}remotePersonIs(e){return!!this.peerHelp.remotePerson&&this.peerHelp.remotePerson.name===e}isConnected(){return this.peerHelp.isChannelConnected}answerCall(e){this.peerHelp.answerCall(e)}handleIceCandidate(e){}handleRemoteData(e){this.peerHelp.handleRemoteData(e)}send(e){this.peerHelp.send(e)}close(){this.peerHelp.close()}onRemoteDataInner(e){this.onRemoteData&&this.onRemoteData(e)}onRemoteFailInner(){this.onRemoteFail&&this.onRemoteFail()}};class c{constructor(e,t,r,n,s){this.onRemoteData=function(e){},this.onRemoteFail=function(){},this._localCallParticipation=e,this._remoteCallParticipation=t,this._localPerson=r,this._nameCache=n,this._signaller=s,this._types=new i.StreamableTypes,this._isChannelConnected=!1}get localCallParticipation(){return this._localCallParticipation}get remoteCallParticipation(){return this._remoteCallParticipation}get localPerson(){return this._localPerson}get remotePerson(){return this._remotePerson}get isChannelConnected(){return this._isChannelConnected}placeCall(){let e=new a.CallOffer(this._localCallParticipation,this._remoteCallParticipation,"Web",a.ETransportType.Web);this._signaller.sendOffer(e)}handleAnswer(e){this._isChannelConnected=!0,this.send(this._localPerson),c.drainSendQueue(this._signaller)}answerCall(e){let t=new a.CallAnswer(this._localCallParticipation,this._remoteCallParticipation,"Web",a.ETransportType.Web);this._signaller.sendAnswer(t),this._isChannelConnected=!0,this.send(this._localPerson),c.drainSendQueue(this._signaller)}close(){}send(e){if(!c._dataForBatch)return c._dataForBatch=e,c._sender=this._localCallParticipation,void c._recipents.push(this._remoteCallParticipation);e===c._dataForBatch&&this._localCallParticipation===c._sender||(c.drainSendQueue(this._signaller),c._dataForBatch=e,c._sender=this._localCallParticipation),c._recipents.push(this._remoteCallParticipation),c._dataForBatch=e}handleRemoteData(e){this.onRecieveMessage(e)}static drainSendQueue(e){if(c._dataForBatch){let e=new a.CallDataBatched(c._sender,c._recipents.map((e=>e)),c._dataForBatch);c._dataForBatch=void 0,c._sender=void 0,c._recipents=new Array,c._sendQueue.enqueue(e)}for(;!c._sendQueue.isEmpty();)e.sendData(c._sendQueue.dequeue())}onRecieveMessage(e){var t=e.data;if(t.type===n.Person.__type){var r=t;this._remotePerson=new n.Person(r.id,r.externalId,this._nameCache.addReturnUnique(r.name),r.email,r.thumbnailUrl,r.lastAuthCode),this.onRemoteData&&this.onRemoteData(this._remoteCallParticipation),this.onRemoteData&&this.onRemoteData(this._remotePerson)}else this.onRemoteData&&this.onRemoteData(t)}}t.WebPeerHelper=c,c.className="WebPeerHelper",c._sendQueue=new s.Queue,c._dataForBatch=void 0,c._recipents=new Array,c._sender=void 0},8586:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Person=void 0;class r{constructor(e,t,r,n,s,o){this._id=e,this._externalId=t,this._name=r,this._email=n,this._thumbnailUrl=s,this._lastAuthCode=o}get id(){return this._id}get externalId(){return this._externalId}get name(){return this._name}get email(){return this._email}get thumbnailUrl(){return this._thumbnailUrl}get lastAuthCode(){return this._lastAuthCode}get type(){return r.__type}equals(e){return this._id===e._id&&this._externalId===e._externalId&&this._name===e._name&&this._email===e._email&&this._thumbnailUrl===e._thumbnailUrl&&this._lastAuthCode===e._lastAuthCode}toJSON(){return{__type:r.__type,attributes:{_id:this._id,_externalId:this._externalId,_name:this._name,_email:this._email,_thumbnailUrl:this._thumbnailUrl,_lastAuthCode:this._lastAuthCode}}}static revive(e){return e.attributes?r.reviveDb(e.attributes):r.reviveDb(e)}static reviveDb(e){return new r(e._id,e._externalId,e._name,e._email,e._thumbnailUrl,e._lastAuthCode)}}t.Person=r,r.__type="Person"},4900:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.QueueAny=t.QueueNumber=t.QueueString=t.Queue=void 0;class r{constructor(){this.offset=0,this.queue=new Array}getLength(){return this.queue.length-this.offset}isEmpty(){return 0==this.queue.length}enqueue(e){this.queue.push(e)}dequeue(){if(0==this.queue.length)return;let e=this.queue[this.offset];return 2*++this.offset>=this.queue.length&&(this.queue=this.queue.slice(this.offset),this.offset=0),e}peek(){return this.queue.length>0?this.queue[this.offset]:void 0}}t.Queue=r,t.QueueString=class extends r{constructor(){super()}},t.QueueNumber=class extends r{constructor(){super()}},t.QueueAny=class extends r{constructor(){super()}}},4301:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SignalMessage=void 0;const n=r(7288);class s{constructor(e,t,r,n,s){this._id=e,this._meetingId=t,this._sessionSubId=r,this._sequenceNo=n,this._data=s}get id(){return this._id}get meetingId(){return this._meetingId}get sessionSubId(){return this._sessionSubId}get sequenceNo(){return this._sequenceNo}get data(){return this._data}get type(){return s.__type}equals(e){return this._id===e._id&&this._meetingId===e._meetingId&&this._sessionSubId===e._sessionSubId&&this._sequenceNo===e._sequenceNo&&this._data.equals(e._data)}toJSON(){return{__type:s.__type,attributes:{_id:this._id,_meetingId:this._meetingId,_sessionSubId:this._sessionSubId,_sequenceNo:this._sequenceNo,_data:JSON.stringify(this._data)}}}static revive(e){return e.attributes?s.reviveDb(e.attributes):s.reviveDb(e)}static reviveDb(e){var t=new n.StreamableTypes;return new s(e._id,e._meetingId,e._sessionSubId,e._sequenceNo,t.reviveFromJSON(e._data))}static toStored(e){return new s(e._id,e._meetingId,e._sessionSubId,e._sequenceNo,JSON.stringify(e._data))}static fromStored(e){var t=new n.StreamableTypes;return new s(e._id,e._meetingId,e._sessionSubId,e._sequenceNo,t.reviveFromJSON(e._data))}}t.SignalMessage=s,s.__type="SignalMessage"},7288:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.StreamableTypes=void 0;const n=r(8586),s=r(165),o=r(52),i=r(4301),a=r(3217),c=r(2306),l=r(5887),u=r(7383),h=r(5386);t.StreamableTypes=class{constructor(){this._types={},this._types.Person=n.Person,this._types.Facility=s.Facility,this._types.CallParticipation=o.CallParticipation,this._types.CallOffer=o.CallOffer,this._types.CallAnswer=o.CallAnswer,this._types.CallIceCandidate=o.CallIceCandidate,this._types.CallLeaderResolve=o.CallLeaderResolve,this._types.CallKeepAlive=o.CallKeepAlive,this._types.CallData=o.CallData,this._types.CallDataBatched=o.CallDataBatched,this._types.SignalMessage=i.SignalMessage,this._types.UserFacilities=a.UserFacilities,this._types.Whiteboard=c.Whiteboard,this._types.WhiteboardElement=c.WhiteboardElement,this._types.GymClockSpec=l.GymClockSpec,this._types.GymClockAction=l.GymClockAction,this._types.GymClockState=l.GymClockState,this._types.LiveWorkout=u.LiveWorkout,this._types.LiveWhiteboardCommand=u.LiveWhiteboardCommand,this._types.LiveUndoCommand=h.LiveUndoCommand}isObjectKey(e){let t=Number(e);return""===e||!isNaN(t-0)}reviveFromJSON(e){var t=this;return JSON.parse(e,(function(e,r){return t.isObjectKey(e)&&r.hasOwnProperty("__type")?t._types[r.__type].revive(r):this[e]}))}}},3217:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.UserFacilities=void 0;const n=r(8586),s=r(165),o=r(9584);class i{constructor(e,t,r,n=new Array){this._sessionId=e,this._person=t,this._currentFacility=r,this._facilities=n}get sessionId(){return this._sessionId}get person(){return this._person}get currentFacility(){return this._currentFacility}get facilities(){return this._facilities}get type(){return i.__type}equals(e){return this._sessionId===e._sessionId&&this._person.equals(e._person)&&this._currentFacility.equals(e._currentFacility)&&o.isEqual(this._facilities,e._facilities)}toJSON(){let e=new Array(this._facilities.length);for(var t=0;t<this._facilities.length;t++)e[t]=this._facilities[t].toJSON();return{__type:i.__type,attributes:{_sessionId:this._sessionId,_person:this._person.toJSON(),_currentFacility:this._currentFacility.toJSON(),_facilities:e}}}static revive(e){return e.attributes?i.reviveDb(e.attributes):i.reviveDb(e)}static reviveDb(e){let t=new Array;if(e._facilities){t.length=e._facilities.length;for(var r=0;r<e._facilities.length;r++)t[r]=s.Facility.revive(e._facilities[r])}return new i(e._sessionId,n.Person.revive(e._person),e._currentFacility?s.Facility.revive(e._currentFacility):new s.Facility(null,"","Unknown","building-black128x128.png","(No homepage)"),t)}}t.UserFacilities=i,i.__type="UserFacilities"},2306:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.WhiteboardElement=t.Whiteboard=void 0;class r{constructor(e,t){this._workout=e,this._results=t}get workout(){return this._workout}get results(){return this._results}get type(){return r.__type}equals(e){return this._workout.equals(e._workout)&&this._results.equals(e._results)}toJSON(){return{__type:r.__type,attributes:{_workout:this._workout,_results:this._results}}}static revive(e){return e.attributes?r.reviveDb(e.attributes):r.reviveDb(e)}static reviveDb(e){return new r(n.revive(e._workout),n.revive(e._results))}}t.Whiteboard=r,r.__type="Whiteboard";class n{constructor(e){this._text=e}get text(){return this._text}get type(){return n.__type}equals(e){return this._text===e._text}assign(e){this._text=e._text}toJSON(){return{__type:n.__type,attributes:{_text:this._text}}}static revive(e){return e.attributes?n.reviveDb(e.attributes):n.reviveDb(e)}static reviveDb(e){return new n(e._text)}}t.WhiteboardElement=n,n.__type="WhiteboardElement"},2357:e=>{"use strict";e.exports=require("assert")},8605:e=>{"use strict";e.exports=require("http")},7211:e=>{"use strict";e.exports=require("https")},2087:e=>{"use strict";e.exports=require("os")},2413:e=>{"use strict";e.exports=require("stream")},3867:e=>{"use strict";e.exports=require("tty")},8835:e=>{"use strict";e.exports=require("url")},1669:e=>{"use strict";e.exports=require("util")},8761:e=>{"use strict";e.exports=require("zlib")}},t={};function r(n){if(t[n])return t[n].exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,r),s.exports}var n={};(()=>{"use strict";var e=n;Object.defineProperty(e,"__esModule",{value:!0});const t=r(8227),s=r(6050),o=r(8586),i=r(165),a=r(7288),c=r(8115),l=r(4900),u=r(52),h=r(4301),d=r(3217),p=r(2306),_=r(5887),m=r(1036),f=r(404),v=r(3743),C=r(8391),g=r(6403),y=r(3351),b=r(7383),R=r(5386),w=r(8765),E=r(9840);var x={LoggerFactory:t.LoggerFactory,ELoggerType:t.ELoggerType,StreamableTypes:a.StreamableTypes,Person:o.Person,Facility:i.Facility,Queue:l.Queue,QueueString:l.QueueString,QueueNumber:l.QueueNumber,QueueAny:l.QueueAny,ETransportType:u.ETransportType,CallParticipation:u.CallParticipation,CallOffer:u.CallOffer,CallAnswer:u.CallAnswer,CallIceCandidate:u.CallIceCandidate,CallLeaderResolve:u.CallLeaderResolve,CallKeepAlive:u.CallKeepAlive,CallData:u.CallData,CallDataBatched:u.CallDataBatched,SignalMessage:h.SignalMessage,UserFacilities:d.UserFacilities,Whiteboard:p.Whiteboard,WhiteboardElement:p.WhiteboardElement,EGymClockDuration:_.EGymClockDuration,EGymClockMusic:_.EGymClockMusic,EGymClockState:_.EGymClockState,EGymClockAction:_.EGymClockAction,GymClockSpec:_.GymClockSpec,GymClockAction:_.GymClockAction,GymClockState:_.GymClockState,EThreeStateSwitchEnum:m.EThreeStateSwitchEnum,EThreeStateRagEnum:m.EThreeStateRagEnum,EFourStateRagEnum:m.EFourStateRagEnum,PeerLink:f.PeerLink,EPeerConnectionType:v.EPeerConnectionType,PeerNameCache:v.PeerNameCache,PeerCallerRtc:C.PeerCallerRtc,PeerRecieverRtc:C.PeerRecieverRtc,PeerCallerWeb:g.PeerCallerWeb,PeerRecieverWeb:g.PeerRecieverWeb,PeerFactory:y.PeerFactory,LiveCommandProcessor:R.LiveCommandProcessor,LiveUndoCommand:R.LiveUndoCommand,LiveDocumentChannelFactoryStub:w.LiveDocumentChannelFactoryStub,LiveWorkout:b.LiveWorkout,LiveWhiteboardCommand:b.LiveWhiteboardCommand,LiveDocumentMaster:E.LiveDocumentMaster,LiveDocumentRemote:E.LiveDocumentRemote,LiveWorkoutChannelFactoryPeer:b.LiveWorkoutChannelFactoryPeer,LiveWorkoutFactory:b.LiveWorkoutFactory};s.ArrayHook.initialise(),c.DateHook.initialise(),e.default=x})();var s=exports;for(var o in n)s[o]=n[o];n.__esModule&&Object.defineProperty(s,"__esModule",{value:!0})})();
=======
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/http.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/adapters/http.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var http = __webpack_require__(/*! http */ "http");
var https = __webpack_require__(/*! https */ "https");
var httpFollow = __webpack_require__(/*! follow-redirects */ "./node_modules/follow-redirects/index.js").http;
var httpsFollow = __webpack_require__(/*! follow-redirects */ "./node_modules/follow-redirects/index.js").https;
var url = __webpack_require__(/*! url */ "url");
var zlib = __webpack_require__(/*! zlib */ "zlib");
var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var enhanceError = __webpack_require__(/*! ../core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var isHttps = /https:?/;

/**
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} proxy
 * @param {string} location
 */
function setProxy(options, proxy, location) {
  options.hostname = proxy.host;
  options.host = proxy.host;
  options.port = proxy.port;
  options.path = location;

  // Basic proxy authorization
  if (proxy.auth) {
    var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
    options.headers['Proxy-Authorization'] = 'Basic ' + base64;
  }

  // If a proxy is used, any redirects must also pass through the proxy
  options.beforeRedirect = function beforeRedirect(redirection) {
    redirection.headers.host = redirection.host;
    setProxy(redirection, proxy, redirection.href);
  };
}

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var resolve = function resolve(value) {
      resolvePromise(value);
    };
    var reject = function reject(value) {
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port,
            protocol: parsedProxyUrl.protocol
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;

      // return the last request in case of redirects
      var lastRequest = res.req || req;


      // if no content, is HEAD request or decompress disabled we should not decompress
      if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
        // add the unzipper to the body stream processing pipeline
          stream = stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        }
      }

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
            if (!config.responseEncoding || config.responseEncoding === 'utf8') {
              responseData = utils.stripBOM(responseData);
            }
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(config.timeout, function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      });
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/http.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"_from":"axios","_id":"axios@0.21.1","_inBundle":false,"_integrity":"sha512-dKQiRHxGD9PPRIUNIWvZhPTPpl1rf/OxTYKsqKUDjBwYylTvV7SjSHJb9ratfyzM6wCdLCOYLzs73qpg5c4iGA==","_location":"/axios","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"axios","name":"axios","escapedName":"axios","rawSpec":"","saveSpec":null,"fetchSpec":"latest"},"_requiredBy":["#USER","/"],"_resolved":"https://registry.npmjs.org/axios/-/axios-0.21.1.tgz","_shasum":"22563481962f4d6bde9a76d516ef0e5d3c09b2b8","_spec":"axios","_where":"d:\\\\Code\\\\VBox\\\\core","author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/axios/axios/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}],"dependencies":{"follow-redirects":"^1.10.0"},"deprecated":false,"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"bundlesize":"^0.17.0","coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.0.2","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^20.1.0","grunt-karma":"^2.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.2.0","karma-coverage":"^1.1.1","karma-firefox-launcher":"^1.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.2.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^5.2.0","sinon":"^4.5.0","typescript":"^2.8.1","url-search-params":"^0.10.0","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"},"homepage":"https://github.com/axios/axios","jsdelivr":"dist/axios.min.js","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","name":"axios","repository":{"type":"git","url":"git+https://github.com/axios/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","fix":"eslint --fix lib/**/*.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test && bundlesize","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","unpkg":"dist/axios.min.js","version":"0.21.1"}');

/***/ }),

/***/ "./node_modules/debug/node_modules/ms/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/debug/node_modules/ms/index.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ "./node_modules/debug/src/common.js":
/*!******************************************!*\
  !*** ./node_modules/debug/src/common.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(/*! ms */ "./node_modules/debug/node_modules/ms/index.js");
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ "./node_modules/debug/src/index.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(/*! ./browser.js */ "./node_modules/debug/src/browser.js");
} else {
	module.exports = __webpack_require__(/*! ./node.js */ "./node_modules/debug/src/node.js");
}


/***/ }),

/***/ "./node_modules/debug/src/node.js":
/*!****************************************!*\
  !*** ./node_modules/debug/src/node.js ***!
  \****************************************/
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(/*! tty */ "tty");
const util = __webpack_require__(/*! util */ "util");

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(/*! supports-color */ "./node_modules/supports-color/index.js");

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ "./node_modules/follow-redirects/debug.js":
/*!************************************************!*\
  !*** ./node_modules/follow-redirects/debug.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debug;

module.exports = function () {
  if (!debug) {
    try {
      /* eslint global-require: off */
      debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/index.js")("follow-redirects");
    }
    catch (error) {
      debug = function () { /* */ };
    }
  }
  debug.apply(null, arguments);
};


/***/ }),

/***/ "./node_modules/follow-redirects/index.js":
/*!************************************************!*\
  !*** ./node_modules/follow-redirects/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var url = __webpack_require__(/*! url */ "url");
var URL = url.URL;
var http = __webpack_require__(/*! http */ "http");
var https = __webpack_require__(/*! https */ "https");
var Writable = __webpack_require__(/*! stream */ "stream").Writable;
var assert = __webpack_require__(/*! assert */ "assert");
var debug = __webpack_require__(/*! ./debug */ "./node_modules/follow-redirects/debug.js");

// Create handlers that pass events from native requests
var eventHandlers = Object.create(null);
["abort", "aborted", "connect", "error", "socket", "timeout"].forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

// Error types with codes
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  ""
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded"
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  // Abort the internal request
  this._currentRequest.removeAllListeners();
  this._currentRequest.on("error", noop);
  this._currentRequest.abort();

  // Abort this request
  this.emit("abort");
  this.removeAllListeners();
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;
  if (callback) {
    this.on("timeout", callback);
  }

  // Sets up a timer to trigger a timeout event
  function startTimer() {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
  }

  // Prevent a timeout from triggering
  function clearTimer() {
    clearTimeout(this._timeout);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!this.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }

  // Start the timer when the socket is opened
  if (this.socket) {
    startTimer();
  }
  else {
    this._currentRequest.once("socket", startTimer);
  }

  this.once("response", clearTimer);
  this.once("error", clearTimer);

  return this;
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var event in eventHandlers) {
    /* istanbul ignore else */
    if (event) {
      request.on(event, eventHandlers[event]);
    }
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors
        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          /* istanbul ignore else */
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  var location = response.headers.location;
  if (location && this._options.followRedirects !== false &&
      statusCode >= 300 && statusCode < 400) {
    // Abort the current request
    this._currentRequest.removeAllListeners();
    this._currentRequest.on("error", noop);
    this._currentRequest.abort();
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();

    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new TooManyRedirectsError());
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
        // RFC7231§6.4.4: The 303 (See Other) status code indicates that
        // the server is redirecting the user agent to a different resource […]
        // A user agent can perform a retrieval request targeting that URI
        // (a GET or HEAD request if using HTTP) […]
        (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    }

    // Drop the Host header, as the redirect might lead to a different host
    var previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers) ||
      url.parse(this._currentUrl).hostname;

    // Create the redirected request
    var redirectUrl = url.resolve(this._currentUrl, location);
    debug("redirecting to", redirectUrl);
    this._isRedirect = true;
    var redirectUrlParts = url.parse(redirectUrl);
    Object.assign(this._options, redirectUrlParts);

    // Drop the Authorization header if redirecting to another host
    if (redirectUrlParts.hostname !== previousHostName) {
      removeMatchingHeaders(/^authorization$/i, this._options.headers);
    }

    // Evaluate the beforeRedirect callback
    if (typeof this._options.beforeRedirect === "function") {
      var responseDetails = { headers: response.headers };
      try {
        this._options.beforeRedirect.call(null, this._options, responseDetails);
      }
      catch (err) {
        this.emit("error", err);
        return;
      }
      this._sanitizeOptions(this._options);
    }

    // Perform the redirected request
    try {
      this._performRequest();
    }
    catch (cause) {
      var error = new RedirectionError("Redirected request failed: " + cause.message);
      error.cause = cause;
      this.emit("error", error);
    }
  }
  else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters
      if (typeof input === "string") {
        var urlStr = input;
        try {
          input = urlToOptions(new URL(urlStr));
        }
        catch (err) {
          /* istanbul ignore next */
          input = url.parse(urlStr);
        }
      }
      else if (URL && (input instanceof URL)) {
        input = urlToOptions(input);
      }
      else {
        callback = options;
        options = input;
        input = { protocol: protocol };
      }
      if (typeof options === "function") {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

/* istanbul ignore next */
function noop() { /* empty */ }

// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
  var options = {
    protocol: urlObject.protocol,
    hostname: urlObject.hostname.startsWith("[") ?
      /* istanbul ignore next */
      urlObject.hostname.slice(1, -1) :
      urlObject.hostname,
    hash: urlObject.hash,
    search: urlObject.search,
    pathname: urlObject.pathname,
    path: urlObject.pathname + urlObject.search,
    href: urlObject.href,
  };
  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }
  return options;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return lastValue;
}

function createErrorType(code, defaultMessage) {
  function CustomError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.message = message || defaultMessage;
  }
  CustomError.prototype = new Error();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  CustomError.prototype.code = code;
  return CustomError;
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;


/***/ }),

/***/ "./node_modules/has-flag/index.js":
/*!****************************************!*\
  !*** ./node_modules/has-flag/index.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ "./node_modules/loglevel/lib/loglevel.js":
/*!***********************************************!*\
  !*** ./node_modules/loglevel/lib/loglevel.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";
    var isIE = (typeof window !== undefinedType) && (typeof window.navigator !== undefinedType) && (
        /Trident\/|MSIE /.test(window.navigator.userAgent)
    );

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Trace() doesn't print the message in IE, so for that case we need to wrap it
    function traceForIE() {
        if (console.log) {
            if (console.log.apply) {
                console.log.apply(console, arguments);
            } else {
                // In old IE, native console methods themselves don't have apply().
                Function.prototype.apply.apply(console.log, [console, arguments]);
            }
        }
        if (console.trace) console.trace();
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (methodName === 'trace' && isIE) {
            return traceForIE;
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;

      var storageKey = "loglevel";
      if (typeof name === "string") {
        storageKey += ":" + name;
      } else if (typeof name === "symbol") {
        storageKey = undefined;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType || !storageKey) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType || !storageKey) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if ((typeof name !== "symbol" && typeof name !== "string") || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    // ES6 default export, for compatibility
    defaultLogger['default'] = defaultLogger;

    return defaultLogger;
}));


/***/ }),

/***/ "./node_modules/supports-color/index.js":
/*!**********************************************!*\
  !*** ./node_modules/supports-color/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(/*! os */ "os");
const tty = __webpack_require__(/*! tty */ "tty");
const hasFlag = __webpack_require__(/*! has-flag */ "./node_modules/has-flag/index.js");

const {env} = process;

let flagForceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	flagForceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	flagForceColor = 1;
}

function envForceColor() {
	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			return 1;
		}

		if (env.FORCE_COLOR === 'false') {
			return 0;
		}

		return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, {streamIsTTY, sniffFlags = true} = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== undefined) {
		flagForceColor = noFlagForceColor;
	}

	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;

	if (forceColor === 0) {
		return 0;
	}

	if (sniffFlags) {
		if (hasFlag('color=16m') ||
			hasFlag('color=full') ||
			hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE', 'DRONE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream, options = {}) {
	const level = supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options
	});

	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel({isTTY: tty.isatty(1)}),
	stderr: getSupportLevel({isTTY: tty.isatty(2)})
};


/***/ }),

/***/ "./dev/ArrayHook.tsx":
/*!***************************!*\
  !*** ./dev/ArrayHook.tsx ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// Hooks the Array class so it has an 'equals' method.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArrayHook = void 0;
class ArrayHook {
    constructor() {
    }
    static initialise() {
        if (ArrayHook.initialised)
            return;
        ArrayHook.initialised = true;
        // Warn if overriding existing method
        if (Array.prototype.equals)
            console.warn("Warning: possible duplicate definition of Array.prototype.equals.");
        // attach the .equals method to Array's prototype to call it on any array
        Array.prototype.equals = function (array) {
            // if the other array is a falsy value, return
            if (!array)
                return false;
            // compare lengths - can save a lot of time 
            if (this.length != array.length)
                return false;
            for (var i = 0, l = this.length; i < l; i++) {
                // Check if we have nested arrays
                if (this[i] instanceof Array && array[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!this[i].equals(array[i]))
                        return false;
                }
                else if (this[i].equals) {
                    // If the objects have an equals method, use it
                    return (this[i].equals(array[i]));
                }
                else if (this[i] != array[i]) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
            return true;
        };
        // Hide method from for-in loops
        Object.defineProperty(Array.prototype, "equals", { enumerable: false });
    }
}
exports.ArrayHook = ArrayHook;
ArrayHook.initialised = false;
ArrayHook.initialise();


/***/ }),

/***/ "./dev/Call.tsx":
/*!**********************!*\
  !*** ./dev/Call.tsx ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CallDataBatched = exports.CallData = exports.CallKeepAlive = exports.CallLeaderResolve = exports.CallIceCandidate = exports.CallAnswer = exports.CallOffer = exports.CallParticipation = exports.ETransportType = void 0;
const StreamableTypes_1 = __webpack_require__(/*! ./StreamableTypes */ "./dev/StreamableTypes.tsx");
var ETransportType;
(function (ETransportType) {
    ETransportType[ETransportType["Rtc"] = 0] = "Rtc";
    ETransportType[ETransportType["Web"] = 1] = "Web";
})(ETransportType = exports.ETransportType || (exports.ETransportType = {}));
//==============================//
// CallParticipation class
//==============================//
class CallParticipation {
    /**
     * Create a CallParticipation object
     * @param meetingId - ID for the facility hosting the call
     * @param isCandidateLeader - true if the person is a possible call leader
     * @param sessionSubId - iD for the call session (in case same person joins > once from same browser)
     * @param glareResolve - if provided, a number to use for the glareResolution test. By design, don't reset this
     *    - same CallParticipation should keep the same glareResolve throughout its lifetime
     */
    constructor(meetingId, sessionSubId, isCandidateLeader, glareResolve = Math.random()) {
        this._meetingId = meetingId;
        this._isCandidateLeader = isCandidateLeader;
        this._sessionSubId = sessionSubId;
        if (glareResolve)
            this._glareResolve = glareResolve;
        else
            this._glareResolve = Math.random();
    }
    /**
    * set of 'getters' for private variables
    */
    get meetingId() {
        return this._meetingId;
    }
    get isCandidateLeader() {
        return this._isCandidateLeader;
    }
    get sessionSubId() {
        return this._sessionSubId;
    }
    get glareResolve() {
        return this._glareResolve;
    }
    get type() {
        return CallParticipation.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._meetingId === rhs._meetingId) &&
            (this._sessionSubId === rhs._sessionSubId) &&
            (this._isCandidateLeader === rhs._isCandidateLeader) &&
            (this._glareResolve.toPrecision(10) === rhs._glareResolve.toPrecision(10)));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallParticipation.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _meetingId: this._meetingId,
                _sessionSubId: this._sessionSubId,
                _isCandidateLeader: this._isCandidateLeader,
                _glareResolve: this._glareResolve
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallParticipation.reviveDb(data.attributes);
        return CallParticipation.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallParticipation(data._meetingId, data._sessionSubId, data._isCandidateLeader, data._glareResolve);
    }
    ;
}
exports.CallParticipation = CallParticipation;
CallParticipation.__type = "CallParticipation";
//==============================//
// CallOffer class
//==============================//
class CallOffer {
    /**
     * Create a CallOffer object
     * @param from - CallParticipation
     * @param to - CallParticipation
     * @param offer - the WebRTC Offer
     * @param transport = transport type (Web or RTC)
     */
    constructor(from, to, offer, transport) {
        this._from = from;
        this._to = to;
        this._offer = offer;
        this._transport = transport;
    }
    /**
    * set of 'getters' for private variables
    */
    get from() {
        return this._from;
    }
    get to() {
        return this._to;
    }
    get offer() {
        return this._offer;
    }
    get transport() {
        return this._transport;
    }
    get type() {
        return CallOffer.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._from.equals(rhs._from)) &&
            (this._to.equals(rhs._to)) &&
            (this._offer === rhs._offer) &&
            (this._transport === rhs._transport));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallOffer.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _from: this._from,
                _to: this._to,
                _offer: this._offer,
                _transport: this.transport
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallOffer.reviveDb(data.attributes);
        return CallOffer.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallOffer(CallParticipation.revive(data._from), CallParticipation.revive(data._to), data._offer, data._transport);
    }
    ;
}
exports.CallOffer = CallOffer;
CallOffer.__type = "CallOffer";
//==============================//
// CallAnswer class
//==============================//
class CallAnswer {
    /**
     * Create a CallAnswer object
     * @param from - CallParticipation
     * @param to - CallParticipation
     * @param answer - the WebRTC Offer
     * @param transport = transport type (Web or RTC)
     */
    constructor(from, to, answer, transport) {
        this._from = from;
        this._to = to;
        this._answer = answer;
        this._transport = transport;
    }
    /**
    * set of 'getters' for private variables
    */
    get from() {
        return this._from;
    }
    get to() {
        return this._to;
    }
    get answer() {
        return this._answer;
    }
    get transport() {
        return this._transport;
    }
    get type() {
        return CallAnswer.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._from.equals(rhs._from)) &&
            (this._to.equals(rhs._to)) &&
            (this._answer === rhs._answer) &&
            (this._transport === rhs._transport));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallAnswer.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _from: this._from,
                _to: this._to,
                _answer: this._answer,
                _transport: this._transport
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallAnswer.reviveDb(data.attributes);
        return CallAnswer.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallAnswer(CallParticipation.revive(data._from), CallParticipation.revive(data._to), data._answer, data._transport);
    }
    ;
}
exports.CallAnswer = CallAnswer;
CallAnswer.__type = "CallAnswer";
//==============================//
// CallIceCandidate class
//==============================//
class CallIceCandidate {
    /**
     * Create a CallIceCandidate object
     * @param from - CallParticipation
     * @param to - CallParticipation
     * @param ice - the WebRTC ice, may be null
     * @param outbound - TRUE if this is from an outbound (Offer) connection
     */
    constructor(from, to, ice, outbound) {
        this._from = from;
        this._to = to;
        this._ice = ice;
        this._outbound = outbound;
    }
    /**
    * set of 'getters' for private variables
    */
    get from() {
        return this._from;
    }
    get to() {
        return this._to;
    }
    get ice() {
        return this._ice;
    }
    get outbound() {
        return this._outbound;
    }
    get type() {
        return CallIceCandidate.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._from.equals(rhs._from)) &&
            (this._to.equals(rhs._to)) &&
            (this._ice === rhs._ice) &&
            (this._outbound === rhs._outbound));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallIceCandidate.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _from: this._from,
                _to: this._to,
                _ice: this._ice,
                _outbound: this._outbound
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallIceCandidate.reviveDb(data.attributes);
        return CallIceCandidate.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallIceCandidate(CallParticipation.revive(data._from), CallParticipation.revive(data._to), data._ice, data._outbound);
    }
    ;
}
exports.CallIceCandidate = CallIceCandidate;
CallIceCandidate.__type = "CallIceCandidate";
//==============================//
// CallLeaderResolve class - used to resolve who is the call leader. 
// Send random numbers to each other, highest wins. 
//==============================//
class CallLeaderResolve {
    /**
     * Create a CallLeaderResolve object
     * @param glareDate - if provided, date the call leader logged in. By design, don't reset this
     *    - same CallParticipation should keep the same glareDate throughout its lifetime
     * @param glareResolve - if provided, a number to use for the glareResolution test. By design, don't reset this
     *    - same CallParticipation should keep the same glareResolve throughout its lifetime
     */
    constructor(glareDate = new Date(), glareResolve = Math.random()) {
        this._glareDate = glareDate;
        this._glareResolve = glareResolve;
    }
    /**
    * set of 'getters' for private variables
    */
    get type() {
        return CallLeaderResolve.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._glareDate.getTime() === rhs._glareDate.getTime() &&
            this._glareResolve.toPrecision(10) === rhs._glareResolve.toPrecision(10));
    }
    ;
    /**
     * test to see if this object wins the resolution
     * @param rhs - the object to compare this one to.
     */
    isWinnerVs(rhs) {
        // Use the date first - this means first person logged in is usually the winner
        // else use the random value to do a lottery, lowest wins so directionality is the same
        return ((this._glareDate.getTime() < rhs._glareDate.getTime()) ||
            ((this._glareDate.getTime() === rhs._glareDate.getTime()) && (this._glareResolve < rhs._glareResolve)));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallLeaderResolve.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _glareDate: this._glareDate,
                _glareResolve: this._glareResolve
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallLeaderResolve.reviveDb(data.attributes);
        return CallLeaderResolve.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallLeaderResolve(new Date(data._glareDate), Number(data._glareResolve));
    }
    ;
}
exports.CallLeaderResolve = CallLeaderResolve;
CallLeaderResolve.__type = "CallLeaderResolve";
//==============================//
// CallKeepAlive class
//==============================//
class CallKeepAlive {
    /**
     * Create a CallKeepAlive object
     */
    constructor(sequenceNo = 0) {
        this._sequenceNo = sequenceNo;
    }
    /**
    * set of 'getters' for private variables
    */
    get sequenceNo() {
        return this._sequenceNo;
    }
    get type() {
        return CallKeepAlive.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._sequenceNo === rhs._sequenceNo));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallKeepAlive.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _sequenceNo: this._sequenceNo,
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallKeepAlive.reviveDb(data.attributes);
        return CallKeepAlive.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallKeepAlive(data._sequenceNo);
    }
    ;
}
exports.CallKeepAlive = CallKeepAlive;
CallKeepAlive.__type = "CallKeepAlive";
//==============================//
// CallData class
//==============================//
class CallData {
    /**
     * Create a CallData object - used when webRTC fails & data is shipped via server
     * @param from - CallParticipation
     * @param to - CallParticipation
     * @param data - the data payload
     */
    constructor(from, to, data) {
        this._from = from;
        this._to = to;
        this._data = data;
    }
    /**
    * set of 'getters' for private variables
    */
    get from() {
        return this._from;
    }
    get to() {
        return this._to;
    }
    get data() {
        return this._data;
    }
    get type() {
        return CallData.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._from.equals(rhs._from)) &&
            (this._to.equals(rhs._to)) &&
            (this._data === rhs._data));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallData.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _from: this._from,
                _to: this._to,
                _data: JSON.stringify(this._data)
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallData.reviveDb(data.attributes);
        return CallData.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        var types = new StreamableTypes_1.StreamableTypes();
        return new CallData(CallParticipation.revive(data._from), CallParticipation.revive(data._to), types.reviveFromJSON(data._data));
    }
    ;
}
exports.CallData = CallData;
CallData.__type = "CallData";
//==============================//
// CallDataBatched class
//==============================//
class CallDataBatched {
    /**
     * Create a CallDataBatched object - used when webRTC fails & data is shipped via server
     * This class is used when data is to be delivered to possibly multiple participants
     * @param from - CallParticipation
     * @param to - CallParticipation - for this version, its an array.
     * @param data - the data payload
     */
    constructor(from, to, data) {
        this._from = from;
        this._to = to;
        this._data = data;
    }
    /**
    * set of 'getters' for private variables
    */
    get from() {
        return this._from;
    }
    get to() {
        return this._to;
    }
    get data() {
        return this._data;
    }
    get type() {
        return CallData.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._from.equals(rhs._from)) &&
            (this._to.equals(rhs._to)) && // Uses the equals method from ArrayHook
            this.data === rhs.data);
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallDataBatched.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _from: this._from,
                _to: this._to,
                _data: JSON.stringify(this._data)
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallDataBatched.reviveDb(data.attributes);
        return CallDataBatched.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        // revive the list of targets
        let revivedParticipations = new Array(data._to ? data._to.length : 0);
        for (var i = 0; data._to && i < data._to.length; i++) {
            revivedParticipations[i] = CallParticipation.revive(data._to[i]);
        }
        var types = new StreamableTypes_1.StreamableTypes();
        return new CallDataBatched(CallParticipation.revive(data._from), revivedParticipations, types.reviveFromJSON(data._data));
    }
    ;
}
exports.CallDataBatched = CallDataBatched;
CallDataBatched.__type = "CallDataBatched";


/***/ }),

/***/ "./dev/DateHook.tsx":
/*!**************************!*\
  !*** ./dev/DateHook.tsx ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateHook = void 0;
/*! Copyright TXPCo, 2020, 2021 */
class DateHook {
    constructor() {
    }
    static initialise() {
        if (DateHook.initialised)
            return;
        DateHook.initialised = true;
        //Create an array containing each day, starting with Sunday.
        DateHook.weekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
        // Warn if overriding existing method
        if (Date.prototype.getWeekDay)
            console.warn("Warning: possible duplicate definition of Date.prototype.getWeekDay.");
        // attach the .getWeekDay method to Date's prototype to call it on any Date
        Date.prototype.getWeekDay = function () {
            //Use the getDay() method to get the day.
            var day = this.getDay();
            // Return the element that corresponds to that index.
            return DateHook.weekdays[day];
        };
    }
}
exports.DateHook = DateHook;
DateHook.initialised = false;
DateHook.initialise();


/***/ }),

/***/ "./dev/Enum.tsx":
/*!**********************!*\
  !*** ./dev/Enum.tsx ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020, 2021 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EFourStateRagEnum = exports.EThreeStateRagEnum = exports.EThreeStateSwitchEnum = void 0;
var EThreeStateSwitchEnum;
(function (EThreeStateSwitchEnum) {
    EThreeStateSwitchEnum[EThreeStateSwitchEnum["On"] = 0] = "On";
    EThreeStateSwitchEnum[EThreeStateSwitchEnum["Off"] = 1] = "Off";
    EThreeStateSwitchEnum[EThreeStateSwitchEnum["Indeterminate"] = 2] = "Indeterminate";
})(EThreeStateSwitchEnum = exports.EThreeStateSwitchEnum || (exports.EThreeStateSwitchEnum = {}));
;
var EThreeStateRagEnum;
(function (EThreeStateRagEnum) {
    EThreeStateRagEnum[EThreeStateRagEnum["Red"] = 0] = "Red";
    EThreeStateRagEnum[EThreeStateRagEnum["Amber"] = 1] = "Amber";
    EThreeStateRagEnum[EThreeStateRagEnum["Green"] = 2] = "Green";
})(EThreeStateRagEnum = exports.EThreeStateRagEnum || (exports.EThreeStateRagEnum = {}));
;
var EFourStateRagEnum;
(function (EFourStateRagEnum) {
    EFourStateRagEnum[EFourStateRagEnum["Red"] = 0] = "Red";
    EFourStateRagEnum[EFourStateRagEnum["Amber"] = 1] = "Amber";
    EFourStateRagEnum[EFourStateRagEnum["Green"] = 2] = "Green";
    EFourStateRagEnum[EFourStateRagEnum["Indeterminate"] = 3] = "Indeterminate";
})(EFourStateRagEnum = exports.EFourStateRagEnum || (exports.EFourStateRagEnum = {}));
;


/***/ }),

/***/ "./dev/Equals.tsx":
/*!************************!*\
  !*** ./dev/Equals.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isEqual = void 0;
function isEqual(value, other) {
    // Get the value type
    var type = Object.prototype.toString.call(value);
    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other))
        return false;
    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0)
        return false;
    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen)
        return false;
    // Compare two items
    var compare = function (item1, item2) {
        // Get the object type
        var itemType = Object.prototype.toString.call(item1);
        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2))
                return false;
        }
        // Otherwise, do a simple comparison
        else {
            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2))
                return false;
            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString())
                    return false;
            }
            else {
                if (item1 !== item2)
                    return false;
            }
        }
    };
    // Compare properties
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false)
                return false;
        }
    }
    else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false)
                    return false;
            }
        }
    }
    // If nothing failed, return true
    return true;
}
exports.isEqual = isEqual;
;


/***/ }),

/***/ "./dev/Facility.tsx":
/*!**************************!*\
  !*** ./dev/Facility.tsx ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Facility = void 0;
class Facility {
    /**
     * Create a Person object
     * @param _id - Mongo-DB assigned ID
     * @param externalId - ID assigned by external system (like facebook)
     * @param name - plain text user name
     * @param thumbnailUrl - URL to thumbnail image
     * @param lastAuthCode - provided by underlying identity system when user logs in
     */
    constructor(_id, externalId, name, thumbnailUrl, homepageUrl) {
        this._id = _id;
        this._externalId = externalId;
        this._name = name;
        this._thumbnailUrl = thumbnailUrl;
        this._homepageUrl = homepageUrl;
    }
    /**
    * set of 'getters' for private variables
    */
    get id() {
        return this._id;
    }
    get externalId() {
        return this._externalId;
    }
    get name() {
        return this._name;
    }
    get thumbnailUrl() {
        return this._thumbnailUrl;
    }
    get homepageUrl() {
        return this._homepageUrl;
    }
    get type() {
        return Facility.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._id === rhs._id) &&
            (this._externalId === rhs._externalId) &&
            (this._name === rhs._name) &&
            (this._thumbnailUrl === rhs._thumbnailUrl) &&
            (this._homepageUrl === rhs._homepageUrl));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: Facility.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _externalId: this._externalId,
                _name: this._name,
                _thumbnailUrl: this._thumbnailUrl,
                _homepageUrl: this._homepageUrl
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return Facility.reviveDb(data.attributes);
        else
            return Facility.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        return new Facility(data._id, data._externalId, data._name, data._thumbnailUrl, data._homepageUrl);
    }
    ;
}
exports.Facility = Facility;
Facility.__type = "Facility";
;


/***/ }),

/***/ "./dev/GymClock.tsx":
/*!**************************!*\
  !*** ./dev/GymClock.tsx ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// GymClock spec is a 'templae' for a clock - how log, wether to play music, and which music. 
// GymClockAction is a way to send the start, pause, stop list via Rpc
// GymClockState is a class to represent the state of a running clock - is is started, stopped, paused etc, and if running, for how long. 
// GymClock is a running clock - created from a spec, then can start, stop, pause etc. 
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GymClockState = exports.GymClockAction = exports.GymClockSpec = exports.EGymClockAction = exports.EGymClockState = exports.EGymClockMusic = exports.EGymClockDuration = void 0;
var EGymClockDuration;
(function (EGymClockDuration) {
    EGymClockDuration[EGymClockDuration["Five"] = 0] = "Five";
    EGymClockDuration[EGymClockDuration["Ten"] = 1] = "Ten";
    EGymClockDuration[EGymClockDuration["Fifteen"] = 2] = "Fifteen";
    EGymClockDuration[EGymClockDuration["Twenty"] = 3] = "Twenty";
})(EGymClockDuration = exports.EGymClockDuration || (exports.EGymClockDuration = {}));
;
var EGymClockMusic;
(function (EGymClockMusic) {
    EGymClockMusic[EGymClockMusic["Uptempo"] = 0] = "Uptempo";
    EGymClockMusic[EGymClockMusic["Midtempo"] = 1] = "Midtempo";
    EGymClockMusic[EGymClockMusic["None"] = 2] = "None";
})(EGymClockMusic = exports.EGymClockMusic || (exports.EGymClockMusic = {}));
;
var EGymClockState;
(function (EGymClockState) {
    EGymClockState[EGymClockState["Stopped"] = 0] = "Stopped";
    EGymClockState[EGymClockState["CountingDown"] = 1] = "CountingDown";
    EGymClockState[EGymClockState["Running"] = 2] = "Running";
    EGymClockState[EGymClockState["Paused"] = 3] = "Paused";
})(EGymClockState = exports.EGymClockState || (exports.EGymClockState = {}));
;
var EGymClockAction;
(function (EGymClockAction) {
    EGymClockAction[EGymClockAction["Start"] = 0] = "Start";
    EGymClockAction[EGymClockAction["Stop"] = 1] = "Stop";
    EGymClockAction[EGymClockAction["Pause"] = 2] = "Pause";
})(EGymClockAction = exports.EGymClockAction || (exports.EGymClockAction = {}));
;
const countDownSeconds = 15;
// Keep this function  declation up here in case an extra Enum is added above & this needs to change
function calculateCountToSeconds(durationEnum) {
    switch (durationEnum) {
        case EGymClockDuration.Five:
            return (countDownSeconds + 5 * 60);
        default:
        case EGymClockDuration.Ten:
            return (countDownSeconds + 10 * 60);
        case EGymClockDuration.Fifteen:
            return (countDownSeconds + 15 * 60);
        case EGymClockDuration.Twenty:
            return (countDownSeconds + 20 * 60);
    }
}
;
//==============================//
// GymClockSpec class
//==============================//
class GymClockSpec {
    /**
     * Create a GymClockSpec object
     * @param durationEnum - one of the enumeration objects (10, 15, 20, ...)
     * @param musicEnum - one of the enumeration objects (Uptempo, Midtempo, none, ...)
     * @param musicUrl - string URL to the music file. Can be null.
     */
    constructor(durationEnum = EGymClockDuration.Ten, musicEnum = EGymClockMusic.None, musicUrl = '') {
        this._durationEnum = durationEnum;
        this._musicEnum = musicEnum;
        this._musicUrl = musicUrl;
    }
    /**
    * set of 'getters' for private variables
    */
    get durationEnum() {
        return this._durationEnum;
    }
    get musicEnum() {
        return this._musicEnum;
    }
    get musicUrl() {
        return this._musicUrl;
    }
    get type() {
        return GymClockSpec.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._durationEnum === rhs._durationEnum
            && this._musicEnum === rhs._musicEnum
            && this._musicUrl === rhs._musicUrl);
    }
    ;
    /**
  * Method that serializes to JSON
  */
    toJSON() {
        return {
            __type: GymClockSpec.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _durationEnum: this._durationEnum,
                _musicEnum: this._musicEnum,
                _musicUrl: this._musicUrl
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return GymClockSpec.reviveDb(data.attributes);
        return GymClockSpec.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new GymClockSpec(data._durationEnum, data._musicEnum, data._musicUrl);
    }
    ;
}
exports.GymClockSpec = GymClockSpec;
GymClockSpec.__type = "GymClockSpec";
//==============================//
// GymClockAction class 
// Exists just to transport en enum of RPC with a type
//==============================//
class GymClockAction {
    /**
     * Create a GymClockAction object
     */
    constructor(actionEnum) {
        this._actionEnum = actionEnum;
    }
    /**
    * set of 'getters' for private variables
    */
    get actionEnum() {
        return this._actionEnum;
    }
    get type() {
        return GymClockAction.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._actionEnum === rhs._actionEnum);
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: GymClockAction.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _actionEnum: this._actionEnum
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return GymClockAction.reviveDb(data.attributes);
        return GymClockAction.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new GymClockAction(data._actionEnum);
    }
    ;
}
exports.GymClockAction = GymClockAction;
GymClockAction.__type = "GymClockAction";
//==============================//
// GymClockState class 
//==============================//
class GymClockState {
    /**
     * Create a GymClockState object
     */
    constructor(stateEnum, secondsIn) {
        this._stateEnum = stateEnum;
        this._secondsIn = secondsIn;
    }
    /**
    * set of 'getters' for private variables
    */
    get stateEnum() {
        return this._stateEnum;
    }
    get secondsIn() {
        return this._secondsIn;
    }
    get type() {
        return GymClockState.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._stateEnum === rhs._stateEnum &&
            this._secondsIn === rhs._secondsIn);
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: GymClockState.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _stateEnum: this._stateEnum,
                _secondsIn: this._secondsIn
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return GymClockState.reviveDb(data.attributes);
        return GymClockState.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new GymClockState(data._stateEnum, data._secondsIn);
    }
    ;
}
exports.GymClockState = GymClockState;
GymClockState.__type = "GymClockState";


/***/ }),

/***/ "./dev/LiveChannel.tsx":
/*!*****************************!*\
  !*** ./dev/LiveChannel.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// Modules in the LiveDocument architecture:
// LiveChannelStub - contains a stub implementation of LiveChannel, short - circuits any streaming and just passes document & commands from publisher to subscriber in test harness.
// LiveCommand - contains LiveCommandProcessor - maintains a log of commands, drives undo/redo, and manages publish/scrscribe connection to channels
// LiveDocumentCentral - contains classes that aggregate creation of live documents. 
// LiveInterfaces - defines abstract interfaces for Document, Selection, Command, ...
// LiveWorkout - contains a concrete implementation of a LiveDocument for the live workout app. 
// Conceptually, this architecture needs be thought of as:
//    - Document, which is Streamable and can be sent to remote parties
//    - a set of Commands, each of which are Streamable and can be sent to remote parties. A Command contains a Selection to which it is applied. 
//    - Master and Remote CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LiveDocumentChannelFactoryStub = void 0;
const StreamableTypes_1 = __webpack_require__(/*! ./StreamableTypes */ "./dev/StreamableTypes.tsx");
// Stubbing for testing
var docInOut = null;
// Stubbing for testing
class LiveChannelStub {
    constructor() {
        this.types = new StreamableTypes_1.StreamableTypes;
        // Override these for data from notifications 
        this.onNewCallParticipation = function (ev) { };
        this.onCommandApply = function (ev) { };
        this.onCommandReverse = function () { };
        this.onDocument = function (ev) { };
    }
    onCommandApplyInner(command) {
        if (this.onCommandApply)
            this.onCommandApply(this.types.reviveFromJSON(command));
    }
    onCommandReverseInner() {
        if (this.onCommandReverse)
            this.onCommandReverse();
    }
    onDocumentInner(document) {
        if (this.onDocument)
            this.onDocument(this.types.reviveFromJSON(document));
    }
    sendDocumentTo(recipient, document) {
        this.onDocumentInner(JSON.stringify(document));
    }
    broadcastCommandApply(command) {
        this.onCommandApplyInner(JSON.stringify(command));
    }
    broadcastCommandReverse() {
        this.onCommandReverseInner();
    }
}
class LiveDocumentChannelFactoryStub {
    constructor() {
    }
    createConnectionIn() {
        if (!docInOut)
            docInOut = new LiveChannelStub();
        return docInOut;
    }
    createConnectionOut() {
        if (!docInOut)
            docInOut = new LiveChannelStub();
        return docInOut;
    }
}
exports.LiveDocumentChannelFactoryStub = LiveDocumentChannelFactoryStub;


/***/ }),

/***/ "./dev/LiveCommand.tsx":
/*!*****************************!*\
  !*** ./dev/LiveCommand.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// Modules in the LiveDocument architecture:
// LiveChannelStub - contains a stub implementation of LiveChannel, short - circuits any streaming and just passes document & commands from publisher to subscriber in test harness.
// LiveCommand - contains LiveCommandProcessor - maintains a log of commands, drives undo/redo, and manages publish/scrscribe connection to channels
// LiveDocumentCentral - contains classes that aggregate creation of live documents. 
// LiveInterfaces - defines abstract interfaces for Document, Selection, Command, ...
// LiveWorkout - contains a concrete implementation of a LiveDocument for the live workout app. 
// Conceptually, this architecture needs be thought of as:
//    - Document, which is Streamable and can be sent to remote parties
//    - a set of Commands, each of which are Streamable and can be sent to remote parties. A Command contains a Selection to which it is applied. 
//    - CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LiveUndoCommand = exports.LiveCommandProcessor = void 0;
class LiveCommandProcessor {
    constructor(document, outbound, channel) {
        this._lastCommandIndex = -1;
        this._document = document;
        this._channel = channel;
        this._outbound = outbound;
        this._commands = new Array();
        this.invalidateIndex();
        this._changeListeners = new Array();
        if (outbound !== undefined && (!outbound && channel)) {
            channel.onCommandApply = this.onCommandApply.bind(this);
            channel.onCommandReverse = this.onCommandReverse.bind(this);
            channel.onDocument = this.onDocument.bind(this);
        }
    }
    addChangeListener(fn) {
        this._changeListeners.push(fn);
    }
    ;
    adoptAndApply(command) {
        if (!this.isValidIndex()) {
            // This case is the first command since a new document
            this._lastCommandIndex = 0;
            this._commands.unshift(command);
        }
        else {
            // If we have undone a series of commands, need to throw away irrelevant ones & put the new command at the head
            if (this._lastCommandIndex != 0) {
                this._commands = this._commands.splice(this._lastCommandIndex);
            }
            this._commands.unshift(command);
        }
        // Apply the comment
        command.applyTo(this._document);
        // Broadcast to remote listeners
        if (this._outbound !== undefined && this._channel && this._outbound)
            this._channel.broadcastCommandApply(command);
        // notify local listeners
        if (this._changeListeners) {
            for (var i = 0; i < this._changeListeners.length; i++) {
                this._changeListeners[i](this._document, command);
            }
        }
    }
    canUndo() {
        // can undo if we have anything in the list and we are not at the end
        if (this._commands.length > 0 && this.isValidIndex() && this._lastCommandIndex < this._commands.length) {
            return (this._commands[this._lastCommandIndex].canReverse());
        }
        else
            return false;
    }
    canRedo() {
        // can redo if we have anything in the list and we are not at the start
        if (this._commands.length > 0 && this.isValidIndex() && this._lastCommandIndex > 0)
            return true;
        else
            return false;
    }
    undo() {
        if (this.canUndo()) {
            // move forward one step after undoing - opposite of 'redo' 
            this._commands[this._lastCommandIndex].reverseFrom(this._document);
            if (this._channel && this._outbound)
                this._channel.broadcastCommandReverse(this._commands[this._lastCommandIndex]);
            this._lastCommandIndex++;
        }
    }
    redo() {
        if (this.canRedo()) {
            // move back one step before applying - opposite of 'undo' 
            this._lastCommandIndex--;
            this._commands[this._lastCommandIndex].applyTo(this._document);
            if (this._channel && this._outbound)
                this._channel.broadcastCommandApply(this._commands[this._lastCommandIndex]);
        }
    }
    clearCommands() {
        this._commands = new Array();
        this.invalidateIndex();
    }
    onCommandApply(command) {
        this.adoptAndApply(command);
    }
    onCommandReverse(command) {
        this.undo();
    }
    onDocument(document) {
        this._document.assign(document);
        this.clearCommands();
        // notify local listeners, command is NULL but we send the entire document
        if (this._changeListeners) {
            for (var i = 0; i < this._changeListeners.length; i++) {
                this._changeListeners[i](this._document);
            }
        }
    }
    invalidateIndex() {
        this._lastCommandIndex = -1;
    }
    isValidIndex() {
        return (this._lastCommandIndex != -1);
    }
}
exports.LiveCommandProcessor = LiveCommandProcessor;
// Streamable object that is sent to instruct an 'undo'
class LiveUndoCommand {
    /**
     * Create a LiveUndoCommand object
     */
    constructor(sequenceNo = 0) {
        this._sequenceNo = sequenceNo;
    }
    /**
    * set of 'getters' for private variables
    */
    get sequenceNo() {
        return this._sequenceNo;
    }
    get type() {
        return LiveUndoCommand.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._sequenceNo === rhs._sequenceNo));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: LiveUndoCommand.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _sequenceNo: this._sequenceNo,
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return LiveUndoCommand.reviveDb(data.attributes);
        return LiveUndoCommand.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new LiveUndoCommand(data._sequenceNo);
    }
    ;
}
exports.LiveUndoCommand = LiveUndoCommand;
LiveUndoCommand.__type = "LiveUndoCommand";


/***/ }),

/***/ "./dev/LiveDocumentCentral.tsx":
/*!*************************************!*\
  !*** ./dev/LiveDocumentCentral.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// Modules in the LiveDocument architecture:
// LiveChannelStub - contains a stub implementation of LiveChannel, short - circuits any streaming and just passes document & commands from publisher to subscriber in test harness.
// LiveCommand - contains LiveCommandProcessor - maintains a log of commands, drives undo/redo, and manages publish/scrscribe connection to channels
// LiveDocumentCentral - contains classes that aggregate creation of live documents. 
// LiveInterfaces - defines abstract interfaces for Document, Selection, Command, ...
// LiveWorkout - contains a concrete implementation of a LiveDocument for the live workout app. 
// Conceptually, this architecture needs be thought of as:
//    - Document, which is Streamable and can be sent to remote parties
//    - a set of Commands, each of which are Streamable and can be sent to remote parties. A Command contains a Selection to which it is applied. 
//    - CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LiveDocumentRemote = exports.LiveDocumentMaster = void 0;
class LiveDocumentConnection {
    constructor(localPerson, localCallParticipation, outbound, channelFactory, documentFactory) {
        this._localPerson = localPerson;
        this._localCallParticipation = localCallParticipation;
        this._channel = outbound ? channelFactory.createConnectionOut() : channelFactory.createConnectionIn();
        this._document = documentFactory.createLiveDocument(outbound, this._channel);
        this._commandProcessor = this._document.createCommandProcessor();
        // If we are outbound, when there is a new joiner, send them the document
        if (outbound) {
            var self = this;
            this._channel.onNewCallParticipation = function (ev) {
                self.channel.sendDocumentTo(ev, self._document);
            };
        }
    }
    /**
    * set of 'getters' & some 'setters' for private variables
    */
    get localCallParticipation() {
        return this._localCallParticipation;
    }
    get localPerson() {
        return this._localPerson;
    }
    get document() {
        return this._document;
    }
    get channel() {
        return this._channel;
    }
    get commandProcessor() {
        return this._commandProcessor;
    }
}
class LiveDocumentMaster extends LiveDocumentConnection {
    constructor(person, localCallParticipation, channelFactory, documentFactory) {
        super(person, localCallParticipation, true, channelFactory, documentFactory);
    }
}
exports.LiveDocumentMaster = LiveDocumentMaster;
class LiveDocumentRemote extends LiveDocumentConnection {
    constructor(person, localCallParticipation, channelFactory, documentFactory) {
        super(person, localCallParticipation, false, channelFactory, documentFactory);
    }
}
exports.LiveDocumentRemote = LiveDocumentRemote;


/***/ }),

/***/ "./dev/LiveWorkout.tsx":
/*!*****************************!*\
  !*** ./dev/LiveWorkout.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// Modules in the LiveDocument architecture:
// LiveChannelStub - contains a stub implementation of LiveChannel, short - circuits any streaming and just passes document & commands from publisher to subscriber in test harness.
// LiveCommand - contains LiveCommandProcessor - maintains a log of commands, drives undo/redo, and manages publish/scrscribe connection to channels
// LiveDocumentCentral - contains classes that aggregate creation of live documents. 
// LiveInterfaces - defines abstract interfaces for Document, Selection, Command, ...
// LiveWorkout - contains a concrete implementation of a LiveDocument for the live workout app. 
// Conceptually, this architecture needs be thought of as:
//    - Document, which is Streamable and can be sent to remote parties
//    - a set of Commands, each of which are Streamable and can be sent to remote parties. A Command contains a Selection to which it is applied. 
//    - CommandProcessor. The Master applies commands and then sends a copy to all Remote CommandProcessors.
// 
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LiveWorkoutFactory = exports.LiveWorkoutChannelFactoryPeer = exports.LiveResultsSelection = exports.LiveWhiteboardSelection = exports.LiveResultsCommand = exports.LiveWhiteboardCommand = exports.LiveWorkout = void 0;
const StreamableTypes_1 = __webpack_require__(/*! ./StreamableTypes */ "./dev/StreamableTypes.tsx");
const Call_1 = __webpack_require__(/*! ./Call */ "./dev/Call.tsx");
const LocalStore_1 = __webpack_require__(/*! ./LocalStore */ "./dev/LocalStore.tsx");
const LiveCommand_1 = __webpack_require__(/*! ./LiveCommand */ "./dev/LiveCommand.tsx");
////////////////////////////////////////
// LiveWorkout - class to represents the entire state of a workout. 
// Contains the workout brief(whiteboard), results, clock spec, clock state, call state.
////////////////////////////////////////
class LiveWorkout {
    constructor(whiteboardText, resultsText, outbound, channel) {
        this._outbound = outbound;
        if (channel)
            this._channel = channel;
        this._whiteboardText = whiteboardText;
        this._resultsText = resultsText;
    }
    createCommandProcessor() {
        return new LiveCommand_1.LiveCommandProcessor(this, this._outbound, this._channel);
    }
    // Getter and setter for whitebard text
    get whiteboardText() {
        return this._whiteboardText;
    }
    set whiteboardText(whiteboardText) {
        this._whiteboardText = whiteboardText;
    }
    // Getter and setter for results text
    get resultsText() {
        return this._resultsText;
    }
    set resultsText(resultsText) {
        this._resultsText = resultsText;
    }
    // type is read only
    get type() {
        return LiveWorkout.__type;
    }
    // test for equality
    // Only tests content fields - excludes channel etc
    equals(rhs) {
        if (rhs.type === this.type) {
            var workout = rhs;
            return (this._whiteboardText === workout._whiteboardText &&
                this._resultsText === workout._resultsText);
        }
        else
            return false;
    }
    assign(rhs) {
        // This is called if an entire new document gets sent e.g are just joining meeting
        // or had become detached
        if (rhs.type === this.type) {
            var workout = rhs;
            this._whiteboardText = workout._whiteboardText;
            this._resultsText = workout._resultsText;
        }
    }
    /**
        * Method that serializes to JSON
        */
    toJSON() {
        return {
            __type: LiveWorkout.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _whiteboardText: this._whiteboardText,
                _resultsText: this._resultsText
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return LiveWorkout.reviveDb(data.attributes);
        else
            return LiveWorkout.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        return new LiveWorkout(data._whiteboardText, data._resultsText);
    }
    ;
}
exports.LiveWorkout = LiveWorkout;
LiveWorkout.__type = "LiveWorkout";
////////////////////////////////////////
// LiveWhiteboardCommand - class to represents the whiteboard within a workout. 
////////////////////////////////////////
class LiveWhiteboardCommand {
    constructor(text, _priorText) {
        this._selection = new LiveWhiteboardSelection(); // This command always has the same selection - the entire whiteboard. 
        this._text = text;
        this._priorText = _priorText; // Caller has to make sure this === current state at time of calling.
        // Otherwise can lead to problems when commands are copied around between sessions
    }
    // type is read only
    get type() {
        return LiveWhiteboardCommand.__type;
    }
    selection() {
        return this._selection;
    }
    applyTo(document) {
        // Since we downcast, need to check type
        if (document.type === LiveWorkout.__type) {
            var wo = document;
            // Verify that the document has not changed since the command was created
            if (this._priorText === wo.whiteboardText)
                wo.whiteboardText = this._text;
            // save in local cache
            new LocalStore_1.StoredWorkoutState().saveWorkout(wo.whiteboardText);
        }
    }
    reverseFrom(document) {
        // Since we downcast, need to check type
        if (document.type == LiveWorkout.__type) {
            var wo = document;
            wo.whiteboardText = this._priorText;
        }
    }
    canReverse() {
        return true;
    }
    /**
        * Method that serializes to JSON
        */
    toJSON() {
        return {
            __type: LiveWhiteboardCommand.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _text: this._text,
                _priorText: this._priorText
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return LiveWhiteboardCommand.reviveDb(data.attributes);
        else
            return LiveWhiteboardCommand.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        return new LiveWhiteboardCommand(data._text, data._priorText);
    }
    ;
}
exports.LiveWhiteboardCommand = LiveWhiteboardCommand;
LiveWhiteboardCommand.__type = "LiveWhiteboardCommand";
////////////////////////////////////////
// LiveResultsCommand - class to represents the whiteboard within a workout.
////////////////////////////////////////
class LiveResultsCommand {
    constructor(text, _priorText) {
        this._selection = new LiveResultsSelection(); // This command always has the same selection - the entire whiteboard. 
        this._text = text;
        this._priorText = _priorText; // Caller has to make sure this === current state at time of calling.
        // Otherwise can lead to problems when commands are copied around between sessions
    }
    // type is read only
    get type() {
        return LiveResultsCommand.__type;
    }
    selection() {
        return this._selection;
    }
    applyTo(document) {
        // Since we downcast, need to check type
        if (document.type === LiveWorkout.__type) {
            var wo = document;
            // Verify that the document has not changed since the command was created
            if (this._priorText === wo.resultsText)
                wo.resultsText = this._text;
        }
    }
    reverseFrom(document) {
        // Since we downcast, need to check type
        if (document.type == LiveWorkout.__type) {
            var wo = document;
            wo.resultsText = this._priorText;
        }
    }
    canReverse() {
        return true;
    }
    /**
        * Method that serializes to JSON
        */
    toJSON() {
        return {
            __type: LiveResultsCommand.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _text: this._text,
                _priorText: this._priorText
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return LiveResultsCommand.reviveDb(data.attributes);
        else
            return LiveResultsCommand.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        return new LiveResultsCommand(data._text, data._priorText);
    }
    ;
}
exports.LiveResultsCommand = LiveResultsCommand;
LiveResultsCommand.__type = "LiveResultsCommand";
////////////////////////////////////////
// LiveWhiteboardSelection - Class to represent the 'selection' of the whiteboard within a Workout document.
////////////////////////////////////////
class LiveWhiteboardSelection {
    constructor() {
    }
    type() {
        return "LiveWhiteboardSelection";
    }
}
exports.LiveWhiteboardSelection = LiveWhiteboardSelection;
////////////////////////////////////////
// LiveWhiteboardSelection - Class to represent the 'selection' of the results within a Workout document.
////////////////////////////////////////
class LiveResultsSelection {
    constructor() {
    }
    type() {
        return "LiveResultsSelection";
    }
}
exports.LiveResultsSelection = LiveResultsSelection;
////////////////////////////////////////
// LiveWorkoutChannelPeer - Implemntation of ILiveDocumentChannel over RTC/peer architecture
////////////////////////////////////////
class LiveWorkoutChannelPeer {
    constructor(peer) {
        this._types = new StreamableTypes_1.StreamableTypes;
        // Override these for data from notifications 
        this.onNewCallParticipation = function (ev) { };
        this.onCommandApply = function (ev) { };
        this.onCommandReverse = function () { };
        this.onDocument = function (ev) { };
        this._peer = peer;
        peer.addRemoteDataListener(this.onData.bind(this));
    }
    onData(ev) {
        if (this._peer.isEdgeOnly()) {
            // Edge nodes listen for document updates
            if (ev.type === LiveWorkout.__type) {
                this.onDocument(ev);
            }
            if (ev.type === LiveWhiteboardCommand.__type) {
                this.onCommandApply(ev);
            }
            if (ev.type === LiveResultsCommand.__type) {
                this.onCommandApply(ev);
            }
            if (ev.type === LiveCommand_1.LiveUndoCommand.__type) {
                this.onCommandReverse();
            }
        }
        else {
            // Hub node listens for new participants and sends them the document when they join
            if (ev.type === Call_1.CallParticipation.__type) {
                this.onNewCallParticipation(ev);
            }
        }
    }
    sendDocumentTo(recipient, document) {
        this._peer.sendTo(recipient, document);
    }
    broadcastCommandApply(command) {
        this._peer.broadcast(command);
    }
    broadcastCommandReverse() {
        this._peer.broadcast(new LiveCommand_1.LiveUndoCommand());
    }
}
////////////////////////////////////////
// LiveWorkoutChannelFactoryPeer - Creates the type of channel we need to exchange Workout Documents
// pass this to ILiveDocumentMaster / Remote in LiveDocumentCentral.
////////////////////////////////////////
class LiveWorkoutChannelFactoryPeer {
    constructor(connection) {
        this._connection = connection;
    }
    createConnectionIn() {
        return new LiveWorkoutChannelPeer(this._connection);
    }
    createConnectionOut() {
        return new LiveWorkoutChannelPeer(this._connection);
    }
}
exports.LiveWorkoutChannelFactoryPeer = LiveWorkoutChannelFactoryPeer;
////////////////////////////////////////
// LiveWorkoutFactory - Creates the Workout Documents, pass this to ILiveDocumentMaster / Remote in LiveDocumentCentral. 
////////////////////////////////////////
class LiveWorkoutFactory {
    constructor() {
    }
    createLiveDocument(outbound, channel) {
        // Use cached copy of the workout if there is one
        let storedWorkoutState = new LocalStore_1.StoredWorkoutState();
        let storedWorkout = storedWorkoutState.loadWorkout();
        if (storedWorkout.length === 0) {
            if (outbound)
                storedWorkout = LiveWorkoutFactory.defaultWorkoutTextMaster;
            else
                storedWorkout = LiveWorkoutFactory.defaultWorkoutTextRemote;
        }
        var resultsText = outbound ? LiveWorkoutFactory.defaultResultsTextMaster : LiveWorkoutFactory.defaultWorkoutTextRemote;
        return new LiveWorkout(storedWorkout, resultsText, outbound, channel);
    }
}
exports.LiveWorkoutFactory = LiveWorkoutFactory;
LiveWorkoutFactory.defaultWorkoutTextMaster = "No workout set. Click the button above ?.";
LiveWorkoutFactory.defaultWorkoutTextRemote = "Waiting for Coach to join.";
LiveWorkoutFactory.defaultResultsTextMaster = "Waiting for people to join.";
LiveWorkoutFactory.defaultResultsTextRemote = "Waiting for people to join.";


/***/ }),

/***/ "./dev/LocalStore.tsx":
/*!****************************!*\
  !*** ./dev/LocalStore.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StoredWorkoutState = exports.StoredMeetingState = exports.LocalStore = void 0;
//==============================//
// LocalStore class
//==============================//
class LocalStore {
    /**
     * Initialises repository
     */
    constructor() {
    }
    /**
     *
     * saveValue
     * @param key - key to use to look up data
     * @param value - value to save
     */
    saveValue(key, value) {
        if (typeof window !== 'undefined' && window.localStorage)
            window.localStorage.setItem(key, value.toString());
    }
    ;
    /**
     *
     * loadValue
     * @param key - key to use to look up data
     */
    loadValue(key) {
        if (typeof window !== 'undefined' && window.localStorage)
            return window.localStorage.getItem(key);
        else
            return null;
    }
    ;
    /**
     *
     * clearValue
     * @param key - key to use to look up data
     */
    clearValue(key) {
        if (typeof window !== 'undefined' && window.localStorage)
            window.localStorage.removeItem(key);
    }
}
exports.LocalStore = LocalStore;
const lastMeetingId = "lastMeetingId";
const lastNameId = "lastName";
const lastWorkoutId = "lastWorkout";
const lastClockId = "lastClock";
const lastClockStateId = "lastClockState";
//==============================//
// StoredMeetingState class
//==============================//
class StoredMeetingState {
    constructor() {
        this._store = new LocalStore();
    }
    /**
     *
     * saveMeetingId
     * @param meetingId - value to save
     */
    saveMeetingId(meetingId) {
        this._store.saveValue(lastMeetingId, meetingId);
    }
    ;
    /**
     *
     * loadMeetingId
     */
    loadMeetingId() {
        var ret = this._store.loadValue(lastMeetingId);
        if (!ret)
            ret = "";
        return ret;
    }
    ;
    /**
     *
     * saveName
     * @param meetingId - value to save
     */
    saveName(meetingId) {
        this._store.saveValue(lastNameId, meetingId);
    }
    ;
    /**
     *
     * loadName
     */
    loadName() {
        var ret = this._store.loadValue(lastNameId);
        if (!ret)
            ret = "";
        return ret;
    }
    ;
}
exports.StoredMeetingState = StoredMeetingState;
//==============================//
// StoredWorkoutState class
//==============================//
class StoredWorkoutState {
    constructor() {
        this._store = new LocalStore();
    }
    /**
     *
     * saveWorkout
     * @param workout - value to save
     */
    saveWorkout(workout) {
        this._store.saveValue(lastWorkoutId, workout);
    }
    ;
    /**
     *
     * loadWorkout
     */
    loadWorkout() {
        var ret = this._store.loadValue(lastWorkoutId);
        if (!ret)
            ret = "";
        return ret;
    }
    ;
    /**
     *
     * saveClockSpec
     * @param clock - value to save
     */
    saveClockSpec(clock) {
        this._store.saveValue(lastClockId, clock);
    }
    ;
    /**
     *
     * loadClockSpec
     */
    loadClockSpec() {
        var ret = this._store.loadValue(lastClockId);
        if (!ret)
            ret = "";
        return ret;
    }
    ;
    /**
     *
     * saveClockState
     * @param clock - value to save
     */
    saveClockState(clock) {
        this._store.saveValue(lastClockStateId, clock);
    }
    ;
    /**
     *
     * loadClockState
     */
    loadClockState() {
        var ret = this._store.loadValue(lastClockStateId);
        if (!ret)
            ret = "";
        return ret;
    }
    ;
}
exports.StoredWorkoutState = StoredWorkoutState;


/***/ }),

/***/ "./dev/Logger.tsx":
/*!************************!*\
  !*** ./dev/Logger.tsx ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020, 2021 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerFactory = exports.ELoggerType = void 0;
// External components
const axios_1 = __importDefault(__webpack_require__(/*! axios */ "./node_modules/axios/index.js"));
//import { ServerLoggerWrap } from './LoggerServerWrap';
const LoggerClientWrap_1 = __webpack_require__(/*! ./LoggerClientWrap */ "./dev/LoggerClientWrap.tsx");
var ELoggerType;
(function (ELoggerType) {
    ELoggerType[ELoggerType["Server"] = 0] = "Server";
    ELoggerType[ELoggerType["Client"] = 1] = "Client";
})(ELoggerType = exports.ELoggerType || (exports.ELoggerType = {}));
class LoggerFactory {
    constructor() {
    }
    createLogger(loggerType, shipToSever) {
        switch (loggerType) {
            case ELoggerType.Server:
                return new ClientLogger(shipToSever);
            case ELoggerType.Client:
            default:
                return new ClientLogger(shipToSever);
        }
    }
}
exports.LoggerFactory = LoggerFactory;
/*
class ServerLogger implements ILogger {

   private logger: any;

   constructor() {

      // instantiate a new Winston Logger with the settings defined above
      this.logger = new ServerLoggerWrap();
   }

   logError(component: string,
      method: string,
      message: string,
      data: any
   ) : void {
      this.logger.logError (
         component,
         method,
         message,
         data ? JSON.stringify (data, null, 2) : ""
      );
   }

   logInfo(component: string,
      method: string,
      message: string,
      data: any
   ) : void {
      this.logger.logInfo (
         component,
         method,
         message,
         data ? JSON.stringify(data, null, 2) : ""
      );
   }
}
*/
class ClientLogger {
    constructor(shipToSever) {
        // instantiate a new Winston Logger with the settings defined above
        this.logger = new LoggerClientWrap_1.ClientLoggerWrap();
        this.shipToSever = shipToSever;
    }
    logError(component, method, message, data) {
        this.logger.logError(component, method, message, data ? JSON.stringify(data, null, 2) : "");
        if (this.shipToSever) {
            const msg = component + "." + method + ": " + message + (data ? JSON.stringify(data, null, 2) : "");
            axios_1.default.post('/api/error', { params: { message: msg } });
        }
    }
    logInfo(component, method, message, data) {
        this.logger.logInfo(component, method, message, data ? JSON.stringify(data, null, 2) : "");
    }
}
var LoggerEntryPoints = {
    LoggerFactory: LoggerFactory,
    ELoggerType: ELoggerType
};


/***/ }),

/***/ "./dev/LoggerClientWrap.tsx":
/*!**********************************!*\
  !*** ./dev/LoggerClientWrap.tsx ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientLoggerWrap = void 0;
// external components
const axios_1 = __importDefault(__webpack_require__(/*! axios */ "./node_modules/axios/index.js"));
var logging = __webpack_require__(/*! loglevel */ "./node_modules/loglevel/lib/loglevel.js");
logging.setLevel("info");
class ClientLoggerWrap {
    constructor() {
        // instantiate a new Winston Logger with the settings defined above
        this.logger = logging;
    }
    logError(fromClass, fromMethod, info, objAsJSON) {
        let date = new Date();
        let timeString = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();
        const msg = ' ' + fromClass + "." + fromMethod + ": " + info + (objAsJSON ? objAsJSON : "") + ' at:' + timeString;
        this.logger.error('Error:' + msg);
        axios_1.default.post('/api/error', { params: { message: encodeURIComponent(msg) } })
            .then((response) => {
        });
    }
    logInfo(fromClass, fromMethod, info, objAsJSON) {
        let date = new Date();
        let timeString = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();
        this.logger.info('Info: ' + fromClass + "." + fromMethod + ": " + info + (objAsJSON ? objAsJSON : "") + ' at:' + timeString);
    }
}
exports.ClientLoggerWrap = ClientLoggerWrap;


/***/ }),

/***/ "./dev/PeerFactory.tsx":
/*!*****************************!*\
  !*** ./dev/PeerFactory.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerConnection : overall orchestration & interface to the UI.
// PeerFactory - creates Rtc or Web versions as necessary to meet a request for a PeerCaller or PeerSender. 
// PeerInterfaces - defines abstract interfaces for PeerCaller, PeerSender, PeerSignalsender, PeerSignalReciever etc 
// PeerLink - contains a connection, plus logic to bridge the send/receieve differences, and depends only on abstract classes. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender, send and recieve data via WebRTC
// PeerSignaller - contains an implementation of the PeerSignalSender & PeerSignalReciever interfaces.
// PeerWeb  - contains concrete implementations of PeerCaller and PeerSender, sends and recoeved data via the node.js server
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PeerFactory = void 0;
const Logger_1 = __webpack_require__(/*! ./Logger */ "./dev/Logger.tsx");
const Call_1 = __webpack_require__(/*! ./Call */ "./dev/Call.tsx");
const PeerRtc_1 = __webpack_require__(/*! ./PeerRtc */ "./dev/PeerRtc.tsx");
const PeerWeb_1 = __webpack_require__(/*! ./PeerWeb */ "./dev/PeerWeb.tsx");
var logger = new Logger_1.LoggerFactory().createLogger(Logger_1.ELoggerType.Client, true);
class PeerFactory {
    constructor() {
    }
    createCallerConnection(connectionType, transport, localCallParticipation, remoteCallParticipation, person, nameCache, signaller, signalReciever) {
        switch (transport) {
            case Call_1.ETransportType.Rtc:
            default:
                return new PeerRtc_1.PeerCallerRtc(localCallParticipation, remoteCallParticipation, person, nameCache, signaller);
            case Call_1.ETransportType.Web:
                return new PeerWeb_1.PeerCallerWeb(localCallParticipation, remoteCallParticipation, person, nameCache, signaller);
        }
    }
    createRecieverConnection(connectionType, transport, localCallParticipation, remoteCallParticipation, person, nameCache, signaller, signalReciever) {
        switch (transport) {
            case Call_1.ETransportType.Rtc:
            default:
                return new PeerRtc_1.PeerRecieverRtc(localCallParticipation, remoteCallParticipation, person, nameCache, signaller);
            case Call_1.ETransportType.Web:
                return new PeerWeb_1.PeerRecieverWeb(localCallParticipation, remoteCallParticipation, person, nameCache, signaller);
        }
    }
}
exports.PeerFactory = PeerFactory;


/***/ }),

/***/ "./dev/PeerInterfaces.tsx":
/*!********************************!*\
  !*** ./dev/PeerInterfaces.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerConnection : overall orchestration & interface to the UI.
// PeerFactory - creates Rtc or Web versions as necessary to meet a request for a PeerCaller or PeerSender. 
// PeerInterfaces - defines abstract interfaces for PeerCaller, PeerSender, PeerSignalsender, PeerSignalReciever etc 
// PeerLink - contains a connection, plus logic to bridge the send/receieve differences, and depends only on abstract classes. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender, send and recieve data via WebRTC
// PeerSignaller - contains an implementation of the PeerSignalSender & PeerSignalReciever interfaces.
// PeerWeb  - contains concrete implementations of PeerCaller and PeerSender, sends and recoeved data via the node.js server
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PeerNameCache = exports.EPeerConnectionType = void 0;
var EPeerConnectionType;
(function (EPeerConnectionType) {
    EPeerConnectionType[EPeerConnectionType["Caller"] = 0] = "Caller";
    EPeerConnectionType[EPeerConnectionType["Reciever"] = 1] = "Reciever";
})(EPeerConnectionType = exports.EPeerConnectionType || (exports.EPeerConnectionType = {}));
// Helper class - take a name like 'Jon' and if the name is not unique for the session,
// tries variants like 'Jon:1', 'Jon:2' and so on until a unique one (for this session) is found.
// This is to distinguish the same person joining mutliple times (multiple devices or serial log ins such as browser refresh)
class PeerNameCache {
    constructor() {
        this.nameMap = new Map();
    }
    addReturnUnique(name) {
        if (!this.nameMap.has(name)) {
            this.nameMap.set(name, true);
            return name;
        }
        var index = 1;
        while (true) {
            var newName = name + ':' + index.toString();
            if (!this.nameMap.has(newName)) {
                this.nameMap.set(newName, true);
                return newName;
            }
            index++;
        }
    }
}
exports.PeerNameCache = PeerNameCache;


/***/ }),

/***/ "./dev/PeerLink.tsx":
/*!**************************!*\
  !*** ./dev/PeerLink.tsx ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerConnection : overall orchestration & interface to the UI.
// PeerFactory - creates Rtc or Web versions as necessary to meet a request for a PeerCaller or PeerSender. 
// PeerInterfaces - defines abstract interfaces for PeerCaller, PeerSender, PeerSignalsender, PeerSignalReciever etc 
// PeerLink - contains a connection, plus logic to bridge the send/receieve differences, and depends only on abstract classes. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender, send and recieve data via WebRTC
// PeerSignaller - contains an implementation of the PeerSignalSender & PeerSignalReciever interfaces.
// PeerWeb  - contains concrete implementations of PeerCaller and PeerSender, sends and recoeved data via the node.js server
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PeerLink = void 0;
const Logger_1 = __webpack_require__(/*! ./Logger */ "./dev/Logger.tsx");
const PeerInterfaces_1 = __webpack_require__(/*! ./PeerInterfaces */ "./dev/PeerInterfaces.tsx");
const PeerFactory_1 = __webpack_require__(/*! ./PeerFactory */ "./dev/PeerFactory.tsx");
function uuidPart() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
}
;
function uuid() {
    return (uuidPart() + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + uuidPart() + uuidPart());
}
var logger = new Logger_1.LoggerFactory().createLogger(Logger_1.ELoggerType.Client, true);
class PeerLink {
    constructor(outbound, transport, localCallParticipation, remoteCallParticipation, person, nameCache, signalSender, signalReciever) {
        // Override these to get data notification from the link
        this.onRemoteData = function (ev) { };
        this.onRemoteFail = function (ev) { };
        this._outbound = outbound;
        this._localCallParticipation = localCallParticipation;
        this._remoteCallParticipation = remoteCallParticipation;
        this._person = person;
        this._transport = transport;
        let factory = new PeerFactory_1.PeerFactory();
        if (outbound) {
            this._peerCaller = factory.createCallerConnection(PeerInterfaces_1.EPeerConnectionType.Caller, transport, localCallParticipation, remoteCallParticipation, person, nameCache, signalSender, signalReciever);
            this._peerCaller.onRemoteData = this.onRemoteDataInner.bind(this);
            this._peerCaller.onRemoteFail = this.onRemoteFailInner.bind(this);
            this._peerReciever = undefined;
        }
        else {
            this._peerReciever = factory.createRecieverConnection(PeerInterfaces_1.EPeerConnectionType.Reciever, transport, localCallParticipation, remoteCallParticipation, person, nameCache, signalSender, signalReciever);
            this._peerReciever.onRemoteData = this.onRemoteDataInner.bind(this);
            this._peerReciever.onRemoteFail = this.onRemoteFailInner.bind(this);
            this._peerCaller = undefined;
        }
    }
    get remoteCallParticipation() {
        return this._remoteCallParticipation;
    }
    get localCallParticipation() {
        return this._localCallParticipation;
    }
    get person() {
        return this._person;
    }
    get isOutbound() {
        return this._outbound;
    }
    get transport() {
        return this._transport;
    }
    placeCall() {
        if (this._outbound && this._peerCaller)
            this._peerCaller.placeCall();
        else
            logger.logError(PeerLink.className, 'placeCall', "Recieved placeCall but do not have caller:", null);
    }
    answerCall(offer) {
        if (!this._outbound && this._peerReciever)
            this._peerReciever.answerCall(offer);
        else
            logger.logError(PeerLink.className, 'answerCall', "Recieved offer but do not have reciever:", offer);
    }
    handleAnswer(answer) {
        if (this._outbound && this._peerCaller)
            this._peerCaller.handleAnswer(answer);
        else
            logger.logError(PeerLink.className, 'handleAnswer', "Recieved answer but do not have caller:", answer);
    }
    handleIceCandidate(ice) {
        // Ice candidate messages can be sent while we are still resolving glare - e.g. we are calling each other, and we killed our side while we have
        // incoming messages still pending
        // So fail silently if we get unexpected Ice candidate messages 
        if (this._outbound) {
            if (this._peerCaller)
                this._peerCaller.handleIceCandidate(ice);
            // else silent fail
        }
        else {
            if (this._peerReciever)
                this._peerReciever.handleIceCandidate(ice);
            // else silent fail
        }
    }
    handleRemoteData(data) {
        if (this._outbound) {
            if (this._peerCaller)
                this._peerCaller.handleRemoteData(data);
            // else silent fail
        }
        else {
            if (this._peerReciever)
                this._peerReciever.handleRemoteData(data);
            // else silent fail
        }
    }
    send(obj) {
        if (this._outbound && this._peerCaller)
            this._peerCaller.send(obj);
        if (!this._outbound && this._peerReciever)
            this._peerReciever.send(obj);
    }
    isConnectedToLeader() {
        if (!this._outbound && this._peerReciever && this._peerReciever.remotePerson()
            && this._peerReciever.remoteCallParticipation().isCandidateLeader
            && this._peerReciever.isConnected()) {
            return true;
        }
        if (this._outbound && this._peerCaller && this._peerCaller.remotePerson()
            && this._peerCaller.remoteCallParticipation().isCandidateLeader
            && this._peerCaller.isConnected()) {
            return true;
        }
        return false;
    }
    isConnectedToPerson(name) {
        if (!this._outbound && this._peerReciever
            && this._peerReciever.remotePersonIs(name)
            && this._peerReciever.isConnected()) {
            return true;
        }
        if (this._outbound && this._peerCaller
            && this._peerCaller.remotePersonIs(name)
            && this._peerCaller.isConnected()) {
            return true;
        }
        return false;
    }
    onRemoteDataInner(ev) {
        if (this.onRemoteData)
            this.onRemoteData(ev);
    }
    onRemoteFailInner() {
        if (this.onRemoteFail)
            this.onRemoteFail(this);
    }
}
exports.PeerLink = PeerLink;
PeerLink.className = 'PeerLink';


/***/ }),

/***/ "./dev/PeerRtc.tsx":
/*!*************************!*\
  !*** ./dev/PeerRtc.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerConnection : overall orchestration & interface to the UI.
// PeerFactory - creates Rtc or Web versions as necessary to meet a request for a PeerCaller or PeerSender. 
// PeerInterfaces - defines abstract interfaces for PeerCaller, PeerSender, PeerSignalsender, PeerSignalReciever etc 
// PeerLink - contains a connection, plus logic to bridge the send/receieve differences, and depends only on abstract classes. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender, send and recieve data via WebRTC
// PeerSignaller - contains an implementation of the PeerSignalSender & PeerSignalReciever interfaces.
// PeerWeb  - contains concrete implementations of PeerCaller and PeerSender, sends and recoeved data via the node.js server
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PeerRecieverRtc = exports.PeerCallerRtc = exports.RtcConfigFactory = exports.ERtcConfigurationType = void 0;
// This app, this library
const Person_1 = __webpack_require__(/*! ./Person */ "./dev/Person.tsx");
const Queue_1 = __webpack_require__(/*! ./Queue */ "./dev/Queue.tsx");
const Logger_1 = __webpack_require__(/*! ./Logger */ "./dev/Logger.tsx");
const StreamableTypes_1 = __webpack_require__(/*! ./StreamableTypes */ "./dev/StreamableTypes.tsx");
const Call_1 = __webpack_require__(/*! ./Call */ "./dev/Call.tsx");
const PeerInterfaces_1 = __webpack_require__(/*! ./PeerInterfaces */ "./dev/PeerInterfaces.tsx");
var logger = new Logger_1.LoggerFactory().createLogger(Logger_1.ELoggerType.Client, true);
var ERtcConfigurationType;
(function (ERtcConfigurationType) {
    ERtcConfigurationType[ERtcConfigurationType["StunOnly"] = 0] = "StunOnly";
    ERtcConfigurationType[ERtcConfigurationType["TurnOnly"] = 1] = "TurnOnly";
    ERtcConfigurationType[ERtcConfigurationType["StunThenTurn"] = 2] = "StunThenTurn";
    ERtcConfigurationType[ERtcConfigurationType["Nothing"] = 3] = "Nothing"; // this is used to force fallback to web for testing
})(ERtcConfigurationType = exports.ERtcConfigurationType || (exports.ERtcConfigurationType = {}));
// Set this to control connection scope
const rtcConfigType = ERtcConfigurationType.StunThenTurn;
class RtcConfigFactory {
    constructor() {
    }
    createConfig(configType) {
        switch (configType) {
            case ERtcConfigurationType.Nothing:
                let noConfiguration = {
                    iceServers: []
                };
                return noConfiguration;
            case ERtcConfigurationType.StunOnly:
                let stunConfiguration = {
                    iceServers: [{
                            "urls": "stun:stun.l.google.com:19302"
                        },
                        {
                            "urls": "stun:stun1.l.google.com:19302"
                        }]
                };
                return stunConfiguration;
            case ERtcConfigurationType.TurnOnly:
                let turnConfiguration = {
                    iceServers: [{
                            "urls": "turn:ec2-18-216-213-192.us-east-2.compute.amazonaws.com:3480",
                            username: 'ubuntu',
                            credential: '1wtutona'
                        }
                    ]
                };
                return turnConfiguration;
            case ERtcConfigurationType.StunThenTurn:
            default:
                let defaultConfiguration = {
                    iceServers: [{
                            "urls": "stun:stun.l.google.com:19302"
                        },
                        {
                            "urls": "stun:stun1.l.google.com:19302"
                        } /* 2021/3/5 - this leads to log timeouts ... ,
                        {
                           "urls": "turn:ec2-18-216-213-192.us-east-2.compute.amazonaws.com:3480",
                           username: 'ubuntu',
                           credential: '1wtutona'
                        }*/
                    ]
                };
                return defaultConfiguration;
        }
    }
}
exports.RtcConfigFactory = RtcConfigFactory;
class PeerCallerRtc {
    constructor(localCallParticipation, remoteCallParticipation, person, nameCache, signaller) {
        // Override this for data from notifications 
        this.onRemoteData = function (ev) { };
        this.onRemoteFail = function () { };
        this.peerHelp = new RtcPeerHelper(localCallParticipation, remoteCallParticipation, person, nameCache, signaller);
        // Hook to pass any data up the chain
        this.peerHelp.onRemoteData = this.onRemoteDataInner.bind(this);
        this.peerHelp.onRemoteFail = this.onRemoteFailInner.bind(this);
    }
    /**
    * set of 'getters' for private variables
    */
    localCallParticipation() {
        return this.peerHelp.localCallParticipation;
    }
    remoteCallParticipation() {
        return this.peerHelp.remoteCallParticipation;
    }
    localPerson() {
        return this.peerHelp.localPerson;
    }
    remotePerson() {
        return this.peerHelp.remotePerson;
    }
    remotePersonIs(name) {
        if (this.peerHelp.remotePerson) {
            return (this.peerHelp.remotePerson.name === name);
        }
        else {
            return false;
        }
    }
    isConnected() {
        return this.peerHelp.isChannelConnected;
    }
    placeCall() {
        this.peerHelp.createConnection(PeerInterfaces_1.EPeerConnectionType.Caller, "Caller");
    }
    handleAnswer(answer) {
        this.peerHelp.handleAnswer(answer);
    }
    handleIceCandidate(ice) {
        this.peerHelp.handleIceCandidate(ice);
    }
    handleRemoteData(data) {
        // No-op - we dont expect to recieve data from fallback channel
        // TODO - make an assert() fail??
    }
    send(obj) {
        this.peerHelp.send(obj);
    }
    close() {
        this.peerHelp.close();
    }
    onRemoteDataInner(ev) {
        if (this.onRemoteData) {
            this.onRemoteData(ev);
        }
    }
    onRemoteFailInner() {
        if (this.onRemoteFail) {
            this.onRemoteFail();
        }
    }
}
exports.PeerCallerRtc = PeerCallerRtc;
class PeerRecieverRtc {
    constructor(localCallParticipation, remoteCallParticipation, person, nameCache, signaller) {
        // Override these for data from notifications 
        this.onRemoteData = function (ev) { };
        this.onRemoteFail = function () { };
        this.peerHelp = new RtcPeerHelper(localCallParticipation, remoteCallParticipation, person, nameCache, signaller);
        // Hook to pass any data up the chain
        this.peerHelp.onRemoteData = this.onRemoteDataInner.bind(this);
        this.peerHelp.onRemoteFail = this.onRemoteFailInner.bind(this);
    }
    /**
    * set of 'getters' for private variables
    */
    localCallParticipation() {
        return this.peerHelp.localCallParticipation;
    }
    remoteCallParticipation() {
        return this.peerHelp.remoteCallParticipation;
    }
    localPerson() {
        return this.peerHelp.localPerson;
    }
    remotePerson() {
        return this.peerHelp.remotePerson;
    }
    remotePersonIs(name) {
        if (this.peerHelp.remotePerson) {
            return (this.peerHelp.remotePerson.name === name);
        }
        else {
            return false;
        }
    }
    isConnected() {
        return this.peerHelp.isChannelConnected;
    }
    answerCall(offer) {
        this.peerHelp.createConnection(PeerInterfaces_1.EPeerConnectionType.Reciever, "Reciever");
        this.peerHelp.answerCall(offer);
    }
    handleIceCandidate(ice) {
        this.peerHelp.handleIceCandidate(ice);
    }
    handleRemoteData(data) {
        // No-op - we dont expect to recieve data from fallback channel
        // TODO - make an assert() fail??
    }
    send(obj) {
        this.peerHelp.send(obj);
    }
    close() {
        this.peerHelp.close();
    }
    onRemoteDataInner(ev) {
        if (this.onRemoteData) {
            this.onRemoteData(ev);
        }
    }
    onRemoteFailInner() {
        if (this.onRemoteFail) {
            this.onRemoteFail();
        }
    }
}
exports.PeerRecieverRtc = PeerRecieverRtc;
class RtcPeerHelper {
    constructor(localCallParticipation, remoteCallParticipation, person, nameCache, signaller) {
        // Override these for notifications 
        this.onRemoteData = function (ev) { };
        this.onRemoteFail = function () { };
        this._localCallParticipation = localCallParticipation;
        this._remoteCallParticipation = remoteCallParticipation;
        this._localPerson = person;
        this._nameCache = nameCache;
        this._signaller = signaller;
        this._types = new StreamableTypes_1.StreamableTypes();
        this._isChannelConnected = false;
        this._isIceConnected = false;
        this._sendChannel = undefined;
        this._recieveChannel = undefined;
        this._sendQueue = new Queue_1.Queue();
        this._connection = undefined;
        this._iceQueue = new Queue_1.Queue();
    }
    /**
    * set of 'getters' & some 'setters' for private variables
    */
    get localCallParticipation() {
        return this._localCallParticipation;
    }
    get remoteCallParticipation() {
        return this._remoteCallParticipation;
    }
    get localPerson() {
        return this._localPerson;
    }
    get remotePerson() {
        return this._remotePerson;
    }
    get isChannelConnected() {
        return this._isChannelConnected;
    }
    get isIceConnected() {
        return this._isIceConnected;
    }
    // Connection handling
    //////////
    createConnection(type, channelName) {
        let factory = new RtcConfigFactory();
        let configuration = factory.createConfig(rtcConfigType);
        this._connection = new RTCPeerConnection(configuration);
        this._connection.onicecandidate = (ice) => {
            this.onIceCandidate(ice.candidate, this.remoteCallParticipation);
        };
        if (type === PeerInterfaces_1.EPeerConnectionType.Caller) {
            this._connection.onnegotiationneeded = (ev) => { this.onNegotiationNeededCaller.bind(this)(ev); };
        }
        else {
            this._connection.onnegotiationneeded = (ev) => { this.onNegotiationNeededReciever.bind(this)(ev); };
        }
        this._connection.ondatachannel = (ev) => { this.onRecieveDataChannel.bind(this)(ev.channel); };
        this._connection.oniceconnectionstatechange = (ev) => { this.onIceConnectionStateChange.bind(this)(ev, this._connection); };
        this._connection.onconnectionstatechange = (ev) => { this.onConnectionStateChange.bind(this)(ev, this._connection); };
        this._connection.onicecandidateerror = (ev) => { this.onIceCandidateError.bind(this)(ev); };
        this.createSendChannel(this._connection, channelName);
    }
    onIceCandidate(candidate, to) {
        // Send our call ICE candidate in
        var callIceCandidate = new Call_1.CallIceCandidate(this.localCallParticipation, to, candidate, true);
        this._signaller.sendIceCandidate(callIceCandidate);
    }
    onNegotiationNeededCaller(ev) {
        var self = this;
        logger.logInfo(RtcPeerHelper.className, 'onNegotiationNeededCaller', 'Event:', ev);
        // ICE enumeration does not start until we create a local description, so call createOffer() to kick this off
        this._connection.createOffer({ iceRestart: true })
            .then(offer => self._connection.setLocalDescription(offer))
            .then(() => {
            // Send our call offer data in
            logger.logInfo(RtcPeerHelper.className, 'onNegotiationNeededCaller', 'Posting offer', null);
            var callOffer = new Call_1.CallOffer(self.localCallParticipation, self.remoteCallParticipation, self._connection.localDescription, Call_1.ETransportType.Rtc);
            self._signaller.sendOffer(callOffer);
        });
    }
    ;
    onNegotiationNeededReciever(ev) {
        logger.logInfo(RtcPeerHelper.className, 'onNegotiationNeededReciever', 'Event:', ev);
    }
    ;
    onConnectionStateChange(ev, pc) {
        logger.logInfo(RtcPeerHelper.className, 'onConnectionStateChange', 'State:', pc.connectionState);
        switch (pc.connectionState) {
            case "connected":
                break;
            case "disconnected":
                break;
            case "failed":
                // The connection has been closed or failed
                this._isChannelConnected = false;
                if (this.onRemoteFail)
                    this.onRemoteFail();
                break;
            case "closed":
                // The connection has been closed or failed
                this._isChannelConnected = false;
                break;
        }
    }
    handleIceCandidate(ice) {
        // ICE candidates can arrive before call offer/answer
        // If we have not yet set remoteDescription, queue the iceCandidate for later
        if (!this._connection
            || !this._connection.remoteDescription
            || !this._connection.remoteDescription.type) {
            this._iceQueue.enqueue(ice);
            return;
        }
        if (ice.ice) {
            if (!this.isIceConnected) { // dont add another candidate if we are connected
                this._connection.addIceCandidate(new RTCIceCandidate(ice.ice))
                    .catch(e => {
                    // TODO - analyse error paths
                    logger.logError(RtcPeerHelper.className, 'handleIceCandidate', "error:", e);
                });
            }
        } /* Debugging ICE - does setting a null candidate from the remote interfere with the local??
         * else {
           this.recieveConnection.addIceCandidate(null)
              .catch(e => {
                 // TODO - analyse error paths
                 logger.logError('RtcReciever', 'handleIceCandidate', "error on null ICE candidate:", e);
              });
        } */
    }
    handleAnswer(answer) {
        var self = this;
        if (!this._isIceConnected) {
            this._connection.setRemoteDescription(new RTCSessionDescription(answer.answer))
                .then(() => {
                logger.logInfo(RtcPeerHelper.className, 'handleAnswer', 'succeeded', null);
                // Dequeue any iceCandidates that were enqueued while we had not set remoteDescription
                while (!self._iceQueue.isEmpty()) {
                    self.handleIceCandidate.bind(self)(self._iceQueue.dequeue());
                }
            })
                .catch(e => {
                logger.logError(RtcPeerHelper.className, 'handleAnswer', 'error:', e);
            });
        }
    }
    answerCall(remoteOffer) {
        let self = this;
        this._connection.setRemoteDescription(new RTCSessionDescription(remoteOffer.offer))
            .then(() => self._connection.createAnswer({ iceRestart: true }))
            .then((answer) => self._connection.setLocalDescription(answer))
            .then(() => {
            logger.logInfo(RtcPeerHelper.className, 'answerCall', 'Posting answer', null);
            // Send our call answer data in
            var callAnswer = new Call_1.CallAnswer(self.localCallParticipation, remoteOffer.from, self._connection.localDescription, Call_1.ETransportType.Rtc);
            this._signaller.sendAnswer(callAnswer)
                .then((response) => {
                // Dequeue any iceCandidates that were enqueued while we had not set remoteDescription
                while (!self._iceQueue.isEmpty()) {
                    self.handleIceCandidate.bind(self)(self._iceQueue.dequeue());
                }
            });
        });
    }
    close() {
        this._connection.close();
    }
    // Send channel handling
    //////////
    createSendChannel(connection, name) {
        if (this._sendChannel) {
            this._sendChannel.close();
        }
        this._sendChannel = connection.createDataChannel(name);
        this._sendChannel.onopen = (ev) => { this.onSendChannelOpen(ev, this._sendChannel); };
        this._sendChannel.onerror = this.onSendChannelError.bind(this);
        this._sendChannel.onmessage = this.onSendChannelMessage.bind(this);
        this._sendChannel.onclose = this.onSendChannelClose.bind(this);
    }
    send(obj) {
        if (this._sendChannel && this._sendChannel.readyState === 'open') {
            // Dequeue any messages that were enqueued while we were not ready
            while (!this._sendQueue.isEmpty()) {
                this._sendChannel.send(JSON.stringify(this._sendQueue.dequeue()));
            }
            this._sendChannel.send(JSON.stringify(obj));
        }
        else {
            this._sendQueue.enqueue(obj);
        }
    }
    onSendChannelOpen(ev, dc) {
        this._isChannelConnected = true;
        try {
            // By convention, new joiners broadcast a 'Person' object to peers
            dc.send(JSON.stringify(this.localPerson));
        }
        catch (e) {
            logger.logError(RtcPeerHelper.className, 'onSendChannelOpen', "error:", e);
        }
    }
    onSendChannelMessage(msg) {
        logger.logInfo(RtcPeerHelper.className, 'onSendChannelMessage', "message:", msg.data);
    }
    onSendChannelError(ev) {
        let ev2 = ev;
        logger.logError(RtcPeerHelper.className, 'onSendChannelError', "error:", ev2.error);
    }
    onSendChannelClose(ev) {
        logger.logInfo(RtcPeerHelper.className, 'onSendChannelClose', "event:", ev);
    }
    // ICE handling
    //////////
    onIceConnectionStateChange(ev, pc) {
        var state = pc.iceConnectionState;
        logger.logInfo(RtcPeerHelper.className, 'onIceConnectionStateChange', "state:", state);
        if (state === "connected") {
            this._isIceConnected = true;
        }
        if (state === "failed") {
            this._isIceConnected = false;
            // TODO restartIce here
        }
    }
    onIceCandidateError(ev) {
        var ev2 = ev;
        if (ev2.errorCode === 701) {
            logger.logError(RtcPeerHelper.className, 'onIceCandidateError', ev2.url + ' ', ev2.errorText);
        }
        else {
            logger.logInfo(RtcPeerHelper.className, 'onIceCandidateError', 'event:', ev);
        }
    }
    // Recieve channel handling
    //////////
    onRecieveDataChannel(channel) {
        logger.logInfo(RtcPeerHelper.className, 'onRecieveDataChannel', '', null);
        if (this._recieveChannel) {
            this._recieveChannel.close();
        }
        this._recieveChannel = channel;
        this._recieveChannel.onmessage = (ev) => { this.onRecieveChannelMessage(ev); };
        this._recieveChannel.onopen = (ev) => { this.onRecieveChannelOpen(ev, this._recieveChannel); };
        this._recieveChannel.onclose = this.onRecieveChannelClose.bind(this);
        this._recieveChannel.onerror = this.onRecieveChannelError.bind(this);
    }
    onRecieveChannelOpen(ev, dc) {
        logger.logInfo(RtcPeerHelper.className, 'onRecieveChannelOpen', '', null);
    }
    onRecieveChannelError(ev) {
        var ev2 = ev;
        logger.logError(RtcPeerHelper.className, 'onRecieveChannelError', "error:", ev2.error);
    }
    onRecieveChannelClose(ev) {
        logger.logInfo(RtcPeerHelper.className, 'onRecieveChannelClose', '', null);
    }
    onRecieveChannelMessage(ev) {
        // Too noisy to keep this on 
        // logger.logInfo('RtcCaller', 'onrecievechannelmessage', "message:", msg.data);
        var ev2 = ev;
        var remoteCallData = this._types.reviveFromJSON(ev2.data);
        // Store the person we are talking to - allows tracking in the UI later
        if (remoteCallData.type === Person_1.Person.__type) {
            var person = remoteCallData;
            // Store a unique derivation of name in case a person join multiple times
            this._remotePerson = new Person_1.Person(person.id, person.externalId, this._nameCache.addReturnUnique(person.name), person.email, person.thumbnailUrl, person.lastAuthCode);
            // New document listeners expect a 'CallParticipation'
            if (this.onRemoteData) {
                this.onRemoteData(this._remoteCallParticipation);
            }
            // Some document listeners expect a 'Person'
            if (this.onRemoteData) {
                this.onRemoteData(this._remotePerson);
            }
        }
        else {
            if (this.onRemoteData) {
                this.onRemoteData(remoteCallData);
            }
        }
    }
}
RtcPeerHelper.className = 'RtcPeerHelper';


/***/ }),

/***/ "./dev/PeerWeb.tsx":
/*!*************************!*\
  !*** ./dev/PeerWeb.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerConnection : overall orchestration & interface to the UI.
// PeerFactory - creates Rtc or Web versions as necessary to meet a request for a PeerCaller or PeerSender. 
// PeerInterfaces - defines abstract interfaces for PeerCaller, PeerSender, PeerSignalsender, PeerSignalReciever etc 
// PeerLink - contains a connection, plus logic to bridge the send/receieve differences, and depends only on abstract classes. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender, send and recieve data via WebRTC
// PeerSignaller - contains an implementation of the PeerSignalSender & PeerSignalReciever interfaces.
// PeerWeb  - contains concrete implementations of PeerCaller and PeerSender, sends and recoeved data via the node.js server
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebPeerHelper = exports.PeerRecieverWeb = exports.PeerCallerWeb = void 0;
// This app, this library
const Person_1 = __webpack_require__(/*! ./Person */ "./dev/Person.tsx");
const Queue_1 = __webpack_require__(/*! ./Queue */ "./dev/Queue.tsx");
const Logger_1 = __webpack_require__(/*! ./Logger */ "./dev/Logger.tsx");
const StreamableTypes_1 = __webpack_require__(/*! ./StreamableTypes */ "./dev/StreamableTypes.tsx");
const Call_1 = __webpack_require__(/*! ./Call */ "./dev/Call.tsx");
var logger = new Logger_1.LoggerFactory().createLogger(Logger_1.ELoggerType.Client, true);
class PeerCallerWeb {
    constructor(localCallParticipation, remoteCallParticipation, person, nameCache, signaller) {
        // Override this for data from notifications 
        this.onRemoteData = function (ev) { };
        this.onRemoteFail = function () { };
        this.peerHelp = new WebPeerHelper(localCallParticipation, remoteCallParticipation, person, nameCache, signaller);
        // Hook to pass any data up the chain
        this.peerHelp.onRemoteData = this.onRemoteDataInner.bind(this);
        this.peerHelp.onRemoteFail = this.onRemoteFailInner.bind(this);
    }
    /**
    * set of 'getters' for private variables
    */
    localCallParticipation() {
        return this.peerHelp.localCallParticipation;
    }
    remoteCallParticipation() {
        return this.peerHelp.remoteCallParticipation;
    }
    localPerson() {
        return this.peerHelp.localPerson;
    }
    remotePerson() {
        return this.peerHelp.remotePerson;
    }
    remotePersonIs(name) {
        if (this.peerHelp.remotePerson) {
            return (this.peerHelp.remotePerson.name === name);
        }
        else {
            return false;
        }
    }
    isConnected() {
        return this.peerHelp.isChannelConnected;
    }
    placeCall() {
        this.peerHelp.placeCall();
    }
    handleAnswer(answer) {
        this.peerHelp.handleAnswer(answer);
    }
    handleIceCandidate(ice) {
        // No-op for web connection
    }
    handleRemoteData(data) {
        this.peerHelp.handleRemoteData(data);
    }
    send(obj) {
        this.peerHelp.send(obj);
    }
    close() {
        this.peerHelp.close();
    }
    onRemoteDataInner(ev) {
        if (this.onRemoteData) {
            this.onRemoteData(ev);
        }
    }
    onRemoteFailInner() {
        if (this.onRemoteFail) {
            this.onRemoteFail();
        }
    }
}
exports.PeerCallerWeb = PeerCallerWeb;
class PeerRecieverWeb {
    constructor(localCallParticipation, remoteCallParticipation, person, nameCache, signaller) {
        // Override these for data from notifications 
        this.onRemoteData = function (ev) { };
        this.onRemoteFail = function () { };
        this.peerHelp = new WebPeerHelper(localCallParticipation, remoteCallParticipation, person, nameCache, signaller);
        // Hook to pass any data up the chain
        this.peerHelp.onRemoteData = this.onRemoteDataInner.bind(this);
        this.peerHelp.onRemoteFail = this.onRemoteFailInner.bind(this);
    }
    /**
    * set of 'getters' for private variables
    */
    localCallParticipation() {
        return this.peerHelp.localCallParticipation;
    }
    remoteCallParticipation() {
        return this.peerHelp.remoteCallParticipation;
    }
    localPerson() {
        return this.peerHelp.localPerson;
    }
    remotePerson() {
        return this.peerHelp.remotePerson;
    }
    remotePersonIs(name) {
        if (this.peerHelp.remotePerson) {
            return (this.peerHelp.remotePerson.name === name);
        }
        else {
            return false;
        }
    }
    isConnected() {
        return this.peerHelp.isChannelConnected;
    }
    answerCall(offer) {
        this.peerHelp.answerCall(offer);
    }
    handleIceCandidate(ice) {
        // No-op for web connection
    }
    handleRemoteData(data) {
        this.peerHelp.handleRemoteData(data);
    }
    send(obj) {
        this.peerHelp.send(obj);
    }
    close() {
        this.peerHelp.close();
    }
    onRemoteDataInner(ev) {
        if (this.onRemoteData) {
            this.onRemoteData(ev);
        }
    }
    onRemoteFailInner() {
        if (this.onRemoteFail) {
            this.onRemoteFail();
        }
    }
}
exports.PeerRecieverWeb = PeerRecieverWeb;
class WebPeerHelper {
    constructor(localCallParticipation, remoteCallParticipation, person, nameCache, signaller) {
        // Override these for notifications 
        this.onRemoteData = function (ev) { };
        this.onRemoteFail = function () { };
        this._localCallParticipation = localCallParticipation;
        this._remoteCallParticipation = remoteCallParticipation;
        this._localPerson = person;
        this._nameCache = nameCache;
        this._signaller = signaller;
        this._types = new StreamableTypes_1.StreamableTypes();
        this._isChannelConnected = false;
    }
    /**
    * set of 'getters' & some 'setters' for private variables
    */
    get localCallParticipation() {
        return this._localCallParticipation;
    }
    get remoteCallParticipation() {
        return this._remoteCallParticipation;
    }
    get localPerson() {
        return this._localPerson;
    }
    get remotePerson() {
        return this._remotePerson;
    }
    get isChannelConnected() {
        return this._isChannelConnected;
    }
    // Connection handling
    //////////
    placeCall() {
        let offer = new Call_1.CallOffer(this._localCallParticipation, this._remoteCallParticipation, "Web", Call_1.ETransportType.Web);
        this._signaller.sendOffer(offer);
    }
    handleAnswer(answer) {
        this._isChannelConnected = true;
        // Send the local person to start the application handshake
        this.send(this._localPerson);
        WebPeerHelper.drainSendQueue(this._signaller);
    }
    answerCall(remoteOffer) {
        let answer = new Call_1.CallAnswer(this._localCallParticipation, this._remoteCallParticipation, "Web", Call_1.ETransportType.Web);
        this._signaller.sendAnswer(answer);
        this._isChannelConnected = true;
        // Send the local person to start the application handshake
        this.send(this._localPerson);
        WebPeerHelper.drainSendQueue(this._signaller);
    }
    close() {
        // TODO
    }
    send(obj) {
        if (!WebPeerHelper._dataForBatch) {
            // first call - just save the item and pass back control
            WebPeerHelper._dataForBatch = obj;
            WebPeerHelper._sender = this._localCallParticipation;
            WebPeerHelper._recipents.push(this._remoteCallParticipation);
            return;
        }
        else {
            if (obj === WebPeerHelper._dataForBatch && this._localCallParticipation === WebPeerHelper._sender) {
                // This case is a repeated re-send of the same item to different recipieents -> save the recipients
                WebPeerHelper._recipents.push(this._remoteCallParticipation);
            }
            else {
                // This case we have a new item being sent - flush the queue and restart
                WebPeerHelper.drainSendQueue(this._signaller);
                // Then save the new item and pass back control
                WebPeerHelper._dataForBatch = obj;
                WebPeerHelper._sender = this._localCallParticipation;
                WebPeerHelper._recipents.push(this._remoteCallParticipation);
            }
            WebPeerHelper._dataForBatch = obj;
        }
    }
    handleRemoteData(data) {
        this.onRecieveMessage(data);
    }
    static drainSendQueue(signaller) {
        if (WebPeerHelper._dataForBatch) {
            // Take a copy of the data to send as the send is anychronous & if new items come in we need to correctly accumulate them
            let callData = new Call_1.CallDataBatched(WebPeerHelper._sender, WebPeerHelper._recipents.map((x) => x), WebPeerHelper._dataForBatch);
            // Reset accumulated data
            WebPeerHelper._dataForBatch = undefined;
            WebPeerHelper._sender = undefined;
            WebPeerHelper._recipents = new Array();
            // Send our data.
            // we put it on a queue first as new data can arrive and get re-queued while we are sending to the server
            WebPeerHelper._sendQueue.enqueue(callData);
        }
        while (!WebPeerHelper._sendQueue.isEmpty()) {
            signaller.sendData(WebPeerHelper._sendQueue.dequeue());
        }
    }
    onRecieveMessage(data) {
        var remoteCallData = data.data;
        // Store the person we are talking to - allows tracking in the UI later
        if (remoteCallData.type === Person_1.Person.__type) {
            var person = remoteCallData;
            // Store a unique derivation of name in case a person join multiple times
            this._remotePerson = new Person_1.Person(person.id, person.externalId, this._nameCache.addReturnUnique(person.name), person.email, person.thumbnailUrl, person.lastAuthCode);
            // New document listeners expect a 'CallParticipation'
            if (this.onRemoteData) {
                this.onRemoteData(this._remoteCallParticipation);
            }
            // Some document listeners expect a 'Person'
            if (this.onRemoteData) {
                this.onRemoteData(this._remotePerson);
            }
        }
        else {
            if (this.onRemoteData) {
                this.onRemoteData(remoteCallData);
            }
        }
    }
}
exports.WebPeerHelper = WebPeerHelper;
WebPeerHelper.className = 'WebPeerHelper';
WebPeerHelper._sendQueue = new Queue_1.Queue();
WebPeerHelper._dataForBatch = undefined;
WebPeerHelper._recipents = new Array();
WebPeerHelper._sender = undefined;


/***/ }),

/***/ "./dev/Person.tsx":
/*!************************!*\
  !*** ./dev/Person.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Person = void 0;
class Person {
    /**
     * Create a Person object
     * @param _id - Mongo-DB assigned ID
     * @param externalId - ID assigned by external system (like facebook)
     * @param name - plain text user name
     * @param email - user email
     * @param thumbnailUrl - URL to thumbnail image
     * @param lastAuthCode - provided by underlying identity system when user logs in
     */
    constructor(_id, externalId, name, email, thumbnailUrl, lastAuthCode) {
        this._id = _id;
        this._externalId = externalId;
        this._name = name;
        this._email = email;
        this._thumbnailUrl = thumbnailUrl;
        this._lastAuthCode = lastAuthCode;
    }
    /**
    * set of 'getters' for private variables
    */
    get id() {
        return this._id;
    }
    get externalId() {
        return this._externalId;
    }
    get name() {
        return this._name;
    }
    get email() {
        return this._email;
    }
    get thumbnailUrl() {
        return this._thumbnailUrl;
    }
    get lastAuthCode() {
        return this._lastAuthCode;
    }
    get type() {
        return Person.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._id === rhs._id) &&
            (this._externalId === rhs._externalId) &&
            (this._name === rhs._name) &&
            (this._email === rhs._email) &&
            (this._thumbnailUrl === rhs._thumbnailUrl) &&
            (this._lastAuthCode === rhs._lastAuthCode));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: Person.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _externalId: this._externalId,
                _name: this._name,
                _email: this._email,
                _thumbnailUrl: this._thumbnailUrl,
                _lastAuthCode: this._lastAuthCode
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return Person.reviveDb(data.attributes);
        else
            return Person.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        return new Person(data._id, data._externalId, data._name, data._email, data._thumbnailUrl, data._lastAuthCode);
    }
    ;
}
exports.Person = Person;
Person.__type = "Person";
;


/***/ }),

/***/ "./dev/Queue.tsx":
/*!***********************!*\
  !*** ./dev/Queue.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020, 2021 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueAny = exports.QueueNumber = exports.QueueString = exports.Queue = void 0;
//==============================//
// Queue class
//==============================//
class Queue {
    /**
     * Creates a Queue
     */
    constructor() {
        this.offset = 0;
        this.queue = new Array();
    }
    // Returns the length of the queue.
    getLength() {
        return (this.queue.length - this.offset);
    }
    // Returns true if the queue is empty, and false otherwise.
    isEmpty() {
        return (this.queue.length == 0);
    }
    /* Enqueues the specified item. The parameter is:
     *
     * item - the item to enqueue
     */
    enqueue(item) {
        this.queue.push(item);
    }
    /* Dequeues an item and returns it. If the queue is empty, the value
     * 'undefined' is returned.
     */
    dequeue() {
        // if the queue is empty, return immediately
        if (this.queue.length == 0)
            return undefined;
        // store the item at the front of the queue
        let item = this.queue[this.offset];
        // increment the offset and remove the free space if necessary
        if (++(this.offset) * 2 >= this.queue.length) {
            this.queue = this.queue.slice(this.offset);
            this.offset = 0;
        }
        // return the dequeued item
        return item;
    }
    /* Returns the item at the front of the queue (without dequeuing it). If the
     * queue is empty then undefined is returned.
     */
    peek() {
        return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
    }
}
exports.Queue = Queue;
// Convencience classes for calls from plain javascript
class QueueString extends Queue {
    constructor() {
        super();
    }
}
exports.QueueString = QueueString;
class QueueNumber extends Queue {
    constructor() {
        super();
    }
}
exports.QueueNumber = QueueNumber;
class QueueAny extends Queue {
    constructor() {
        super();
    }
}
exports.QueueAny = QueueAny;


/***/ }),

/***/ "./dev/Signal.tsx":
/*!************************!*\
  !*** ./dev/Signal.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020, 2021 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalMessage = void 0;
const StreamableTypes_1 = __webpack_require__(/*! ./StreamableTypes */ "./dev/StreamableTypes.tsx");
//==============================//
// SignalMessage class
//==============================//
class SignalMessage {
    /**
     * Create a SignalMessage object
     * @param _id - Mongo-DB assigned ID
     * @param meetingId - ID for the meetingl*
     * @param sessionSubId - iD for the call session (in case same person joins > once from same browser)
     * @param sequenceNo - message sequence number, climbs nomintonicaly up from 0
     * @param data - data as an object. This is transformed to and from JSON for transport, must be registered with Type infrastructure
     */
    constructor(_id, _meetingId, sessionSubId, sequenceNo, data) {
        this._id = _id;
        this._meetingId = _meetingId;
        this._sessionSubId = sessionSubId;
        this._sequenceNo = sequenceNo;
        this._data = data;
    }
    /**
 * set of 'getters' for private variables
 */
    get id() {
        return this._id;
    }
    get meetingId() {
        return this._meetingId;
    }
    get sessionSubId() {
        return this._sessionSubId;
    }
    get sequenceNo() {
        return this._sequenceNo;
    }
    get data() {
        return this._data;
    }
    get type() {
        return SignalMessage.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._id === rhs._id &&
            (this._meetingId === rhs._meetingId) &&
            (this._sessionSubId === rhs._sessionSubId) &&
            (this._sequenceNo === rhs._sequenceNo) &&
            this._data.equals(rhs._data));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: SignalMessage.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _meetingId: this._meetingId,
                _sessionSubId: this._sessionSubId,
                _sequenceNo: this._sequenceNo,
                _data: JSON.stringify(this._data)
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return SignalMessage.reviveDb(data.attributes);
        else
            return SignalMessage.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        var types = new StreamableTypes_1.StreamableTypes();
        return new SignalMessage(data._id, data._meetingId, data._sessionSubId, data._sequenceNo, types.reviveFromJSON(data._data));
    }
    ;
    /**
     * Used to change the payload to JSON before storage
     * @param signalMessageIn - the object to transform
     */
    static toStored(signalMessageIn) {
        return new SignalMessage(signalMessageIn._id, signalMessageIn._meetingId, signalMessageIn._sessionSubId, signalMessageIn._sequenceNo, JSON.stringify(signalMessageIn._data));
    }
    /**
     * Used to change the payload to JSON after storage
     * @param signalMessageIn - the object to transform
     */
    static fromStored(signalMessageIn) {
        var types = new StreamableTypes_1.StreamableTypes();
        return new SignalMessage(signalMessageIn._id, signalMessageIn._meetingId, signalMessageIn._sessionSubId, signalMessageIn._sequenceNo, types.reviveFromJSON(signalMessageIn._data));
    }
}
exports.SignalMessage = SignalMessage;
SignalMessage.__type = "SignalMessage";


/***/ }),

/***/ "./dev/StreamableTypes.tsx":
/*!*********************************!*\
  !*** ./dev/StreamableTypes.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StreamableTypes = void 0;
/*! Copyright TXPCo, 2020, 2021 */
const Person_1 = __webpack_require__(/*! ./Person */ "./dev/Person.tsx");
const Facility_1 = __webpack_require__(/*! ./Facility */ "./dev/Facility.tsx");
const Call_1 = __webpack_require__(/*! ./Call */ "./dev/Call.tsx");
const Signal_1 = __webpack_require__(/*! ./Signal */ "./dev/Signal.tsx");
const UserFacilities_1 = __webpack_require__(/*! ./UserFacilities */ "./dev/UserFacilities.tsx");
const GymClock_1 = __webpack_require__(/*! ./GymClock */ "./dev/GymClock.tsx");
const LiveWorkout_1 = __webpack_require__(/*! ./LiveWorkout */ "./dev/LiveWorkout.tsx");
const LiveCommand_1 = __webpack_require__(/*! ./LiveCommand */ "./dev/LiveCommand.tsx");
//==============================//
// StreamableTypes class
//==============================//
class StreamableTypes {
    /**
     * Creates a StreamableTypes for use in streaming objects to and from JSON
     */
    constructor() {
        // Registry of types
        this._types = {};
        this._types.Person = Person_1.Person;
        this._types.Facility = Facility_1.Facility;
        this._types.CallParticipation = Call_1.CallParticipation;
        this._types.CallOffer = Call_1.CallOffer,
            this._types.CallAnswer = Call_1.CallAnswer;
        this._types.CallIceCandidate = Call_1.CallIceCandidate;
        this._types.CallLeaderResolve = Call_1.CallLeaderResolve;
        this._types.CallKeepAlive = Call_1.CallKeepAlive;
        this._types.CallData = Call_1.CallData;
        this._types.CallDataBatched = Call_1.CallDataBatched;
        this._types.SignalMessage = Signal_1.SignalMessage;
        this._types.UserFacilities = UserFacilities_1.UserFacilities;
        this._types.GymClockSpec = GymClock_1.GymClockSpec;
        this._types.GymClockAction = GymClock_1.GymClockAction;
        this._types.GymClockState = GymClock_1.GymClockState;
        this._types.LiveWorkout = LiveWorkout_1.LiveWorkout;
        this._types.LiveWhiteboardCommand = LiveWorkout_1.LiveWhiteboardCommand;
        this._types.LiveResultsCommand = LiveWorkout_1.LiveResultsCommand;
        this._types.LiveUndoCommand = LiveCommand_1.LiveUndoCommand;
    }
    isObjectKey(key) {
        let keyNum = Number(key);
        return key === '' || (!isNaN(keyNum - 0));
    }
    ;
    /**
      * Looks up a type name in JSON and returns a constructed object if there is a match
      * @param jsonString - the test to parse for a class
      */
    reviveFromJSON(jsonString) {
        var registry = this;
        return JSON.parse(jsonString, function (key, value) {
            if (registry.isObjectKey(key) && value.hasOwnProperty('__type'))
                return registry._types[value.__type].revive(value);
            else
                return this[key];
        });
    }
    ;
}
exports.StreamableTypes = StreamableTypes;


/***/ }),

/***/ "./dev/UserFacilities.tsx":
/*!********************************!*\
  !*** ./dev/UserFacilities.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020, 2021 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserFacilities = void 0;
const Person_1 = __webpack_require__(/*! ./Person */ "./dev/Person.tsx");
const Facility_1 = __webpack_require__(/*! ./Facility */ "./dev/Facility.tsx");
const Equals_1 = __webpack_require__(/*! ./Equals */ "./dev/Equals.tsx");
//==============================//
// UserFacilities class
//==============================//
class UserFacilities {
    /**
     * Create a HomePageData object
     * @param sessionId - session ID - is sent back to the client, allows client to restart interrupted comms as long as within TTL
     * @param person - object for current user
     * @param currentFacility - the current facility where the user is logged in
     * @param facilities - array of all facilities where the user has a role
     *
     */
    constructor(sessionId, person, currentFacility, facilities = new Array()) {
        this._sessionId = sessionId;
        this._person = person;
        this._currentFacility = currentFacility;
        this._facilities = facilities;
    }
    /**
    * set of 'getters' for private variables
    */
    get sessionId() {
        return this._sessionId;
    }
    get person() {
        return this._person;
    }
    get currentFacility() {
        return this._currentFacility;
    }
    get facilities() {
        return this._facilities;
    }
    get type() {
        return UserFacilities.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._sessionId === rhs._sessionId &&
            this._person.equals(rhs._person) &&
            this._currentFacility.equals(rhs._currentFacility) &&
            Equals_1.isEqual(this._facilities, rhs._facilities));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        let facilities = new Array(this._facilities.length);
        for (var i = 0; i < this._facilities.length; i++) {
            facilities[i] = this._facilities[i].toJSON();
        }
        return {
            __type: UserFacilities.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _sessionId: this._sessionId,
                _person: this._person.toJSON(),
                _currentFacility: this._currentFacility.toJSON(),
                _facilities: facilities
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return UserFacilities.reviveDb(data.attributes);
        else
            return UserFacilities.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        let facilities = new Array();
        if (data._facilities) {
            facilities.length = data._facilities.length;
            for (var i = 0; i < data._facilities.length; i++) {
                facilities[i] = Facility_1.Facility.revive(data._facilities[i]);
            }
        }
        return new UserFacilities(data._sessionId, Person_1.Person.revive(data._person), data._currentFacility ? Facility_1.Facility.revive(data._currentFacility)
            : new Facility_1.Facility(null, "", 'Unknown', 'building-black128x128.png', "(No homepage)"), facilities);
    }
}
exports.UserFacilities = UserFacilities;
UserFacilities.__type = "UserFacilities";


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");;

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!*****************************!*\
  !*** ./dev/EntryPoints.tsx ***!
  \*****************************/

/*! Copyright TXPCo, 2020, 2021 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Logger_1 = __webpack_require__(/*! ./Logger */ "./dev/Logger.tsx");
const ArrayHook_1 = __webpack_require__(/*! ./ArrayHook */ "./dev/ArrayHook.tsx");
const Person_1 = __webpack_require__(/*! ./Person */ "./dev/Person.tsx");
const Facility_1 = __webpack_require__(/*! ./Facility */ "./dev/Facility.tsx");
const StreamableTypes_1 = __webpack_require__(/*! ./StreamableTypes */ "./dev/StreamableTypes.tsx");
const DateHook_1 = __webpack_require__(/*! ./DateHook */ "./dev/DateHook.tsx");
const Queue_1 = __webpack_require__(/*! ./Queue */ "./dev/Queue.tsx");
const Call_1 = __webpack_require__(/*! ./Call */ "./dev/Call.tsx");
const Signal_1 = __webpack_require__(/*! ./Signal */ "./dev/Signal.tsx");
const UserFacilities_1 = __webpack_require__(/*! ./UserFacilities */ "./dev/UserFacilities.tsx");
const GymClock_1 = __webpack_require__(/*! ./GymClock */ "./dev/GymClock.tsx");
const Enum_1 = __webpack_require__(/*! ./Enum */ "./dev/Enum.tsx");
// Peer-peer architecture
const PeerLink_1 = __webpack_require__(/*! ./PeerLink */ "./dev/PeerLink.tsx");
const PeerInterfaces_1 = __webpack_require__(/*! ./PeerInterfaces */ "./dev/PeerInterfaces.tsx");
const PeerRtc_1 = __webpack_require__(/*! ./PeerRtc */ "./dev/PeerRtc.tsx");
const PeerWeb_1 = __webpack_require__(/*! ./PeerWeb */ "./dev/PeerWeb.tsx");
const PeerFactory_1 = __webpack_require__(/*! ./PeerFactory */ "./dev/PeerFactory.tsx");
// LiveDocument Architecture
const LiveWorkout_1 = __webpack_require__(/*! ./LiveWorkout */ "./dev/LiveWorkout.tsx");
const LiveCommand_1 = __webpack_require__(/*! ./LiveCommand */ "./dev/LiveCommand.tsx");
const LiveChannel_1 = __webpack_require__(/*! ./LiveChannel */ "./dev/LiveChannel.tsx");
const LiveDocumentCentral_1 = __webpack_require__(/*! ./LiveDocumentCentral */ "./dev/LiveDocumentCentral.tsx");
var EntryPoints = {
    LoggerFactory: Logger_1.LoggerFactory,
    ELoggerType: Logger_1.ELoggerType,
    StreamableTypes: StreamableTypes_1.StreamableTypes,
    Person: Person_1.Person,
    Facility: Facility_1.Facility,
    Queue: Queue_1.Queue,
    QueueString: Queue_1.QueueString,
    QueueNumber: Queue_1.QueueNumber,
    QueueAny: Queue_1.QueueAny,
    ETransportType: Call_1.ETransportType,
    CallParticipation: Call_1.CallParticipation,
    CallOffer: Call_1.CallOffer,
    CallAnswer: Call_1.CallAnswer,
    CallIceCandidate: Call_1.CallIceCandidate,
    CallLeaderResolve: Call_1.CallLeaderResolve,
    CallKeepAlive: Call_1.CallKeepAlive,
    CallData: Call_1.CallData,
    CallDataBatched: Call_1.CallDataBatched,
    SignalMessage: Signal_1.SignalMessage,
    UserFacilities: UserFacilities_1.UserFacilities,
    EGymClockDuration: GymClock_1.EGymClockDuration,
    EGymClockMusic: GymClock_1.EGymClockMusic,
    EGymClockState: GymClock_1.EGymClockState,
    EGymClockAction: GymClock_1.EGymClockAction,
    GymClockSpec: GymClock_1.GymClockSpec,
    GymClockAction: GymClock_1.GymClockAction,
    GymClockState: GymClock_1.GymClockState,
    EThreeStateSwitchEnum: Enum_1.EThreeStateSwitchEnum,
    EThreeStateRagEnum: Enum_1.EThreeStateRagEnum,
    EFourStateRagEnum: Enum_1.EFourStateRagEnum,
    // Peer Architecture
    PeerLink: PeerLink_1.PeerLink,
    EPeerConnectionType: PeerInterfaces_1.EPeerConnectionType,
    PeerNameCache: PeerInterfaces_1.PeerNameCache,
    PeerCallerRtc: PeerRtc_1.PeerCallerRtc,
    PeerRecieverRtc: PeerRtc_1.PeerRecieverRtc,
    PeerCallerWeb: PeerWeb_1.PeerCallerWeb,
    PeerRecieverWeb: PeerWeb_1.PeerRecieverWeb,
    PeerFactory: PeerFactory_1.PeerFactory,
    // Live Document Architecture
    LiveCommandProcessor: LiveCommand_1.LiveCommandProcessor,
    LiveUndoCommand: LiveCommand_1.LiveUndoCommand,
    LiveDocumentChannelFactoryStub: LiveChannel_1.LiveDocumentChannelFactoryStub,
    LiveWorkout: LiveWorkout_1.LiveWorkout,
    LiveWhiteboardCommand: LiveWorkout_1.LiveWhiteboardCommand,
    LiveDocumentMaster: LiveDocumentCentral_1.LiveDocumentMaster,
    LiveDocumentRemote: LiveDocumentCentral_1.LiveDocumentRemote,
    LiveWorkoutChannelFactoryPeer: LiveWorkout_1.LiveWorkoutChannelFactoryPeer,
    LiveWorkoutFactory: LiveWorkout_1.LiveWorkoutFactory
};
ArrayHook_1.ArrayHook.initialise();
DateHook_1.DateHook.initialise();
exports.default = EntryPoints;

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
>>>>>>> develop
//# sourceMappingURL=core-bundle.js.map