import{D as Q,L as me,aB as _e,z as be,aC as Ee,aD as V,a2 as Te,O as ie,ah as oe,aa as se,ao as ue,aE as fe,X as W,A as K,Y as j,ak as Se,F as $e,o as Oe,t as he,c as F,r as H,f as L}from"./runtime.B86c_EQ3.js";import{e as qe,s as U,f as ve,C as ee,S as re}from"./header.CoSiyrLM.js";import{a as q,t as J,c as I}from"./disclose-version.BZNNxwED.js";import"./stores.CaCbvOrp.js";import{p as ne,i as ce}from"./index-client.BfbeWHmQ.js";const te=0,Y=1,ae=2;function Ie(k,h,f,u,d){Q&&me();var b=k,E=_e(),A=Oe,g,v,x,m,$=(E?ie:oe)(void 0),T=(E?ie:oe)(void 0),B=!1;function w(_,R){B=!0,R&&(se(O),ue(O),fe(A));try{_===te&&f&&(v?W(v):v=K(()=>f(b))),_===Y&&u&&(x?W(x):x=K(()=>u(b,$))),_===ae&&d&&(m?W(m):m=K(()=>d(b,T))),_!==te&&v&&j(v,()=>v=null),_!==Y&&x&&j(x,()=>x=null),_!==ae&&m&&j(m,()=>m=null)}finally{R&&(fe(null),ue(null),se(null),Se())}}var O=be(()=>{if(g!==(g=h())){if(Ee(g)){var _=g;B=!1,_.then(R=>{_===g&&(V($,R),w(Y,!0))},R=>{if(_===g)throw V(T,R),w(ae,!0),T.v}),Q||Te(()=>{B||w(te,!0)})}else V($,g),w(Y,!1);return()=>g=null}});Q&&(b=$e)}async function Fe(k){const h=await fetch(`./${k}.bird`);return h.ok?await h.text():"Error fetching code"}var pe={exports:{}};(function(k){(function(h,f){k.exports?k.exports=f():h.moo=f()})(qe,function(){var h=Object.prototype.hasOwnProperty,f=Object.prototype.toString,u=typeof new RegExp().sticky=="boolean";function d(e){return e&&f.call(e)==="[object RegExp]"}function b(e){return e&&typeof e=="object"&&!d(e)&&!Array.isArray(e)}function E(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function A(e){var r=new RegExp("|"+e);return r.exec("").length-1}function g(e){return"("+e+")"}function v(e){if(!e.length)return"(?!)";var r=e.map(function(t){return"(?:"+t+")"}).join("|");return"(?:"+r+")"}function x(e){if(typeof e=="string")return"(?:"+E(e)+")";if(d(e)){if(e.ignoreCase)throw new Error("RegExp /i flag not allowed");if(e.global)throw new Error("RegExp /g flag is implied");if(e.sticky)throw new Error("RegExp /y flag is implied");if(e.multiline)throw new Error("RegExp /m flag is implied");return e.source}else throw new Error("Not a pattern: "+e)}function m(e,r){return e.length>r?e:Array(r-e.length+1).join(" ")+e}function $(e,r){for(var t=e.length,a=0;;){var i=e.lastIndexOf(`
`,t-1);if(i===-1||(a++,t=i,a===r)||t===0)break}var n=a<r?0:t+1;return e.substring(n).split(`
`)}function T(e){for(var r=Object.getOwnPropertyNames(e),t=[],a=0;a<r.length;a++){var i=r[a],n=e[i],o=[].concat(n);if(i==="include"){for(var c=0;c<o.length;c++)t.push({include:o[c]});continue}var s=[];o.forEach(function(l){b(l)?(s.length&&t.push(w(i,s)),t.push(w(i,l)),s=[]):s.push(l)}),s.length&&t.push(w(i,s))}return t}function B(e){for(var r=[],t=0;t<e.length;t++){var a=e[t];if(a.include){for(var i=[].concat(a.include),n=0;n<i.length;n++)r.push({include:i[n]});continue}if(!a.type)throw new Error("Rule has no type: "+JSON.stringify(a));r.push(w(a.type,a))}return r}function w(e,r){if(b(r)||(r={match:r}),r.include)throw new Error("Matching rules cannot also include states");var t={defaultType:e,lineBreaks:!!r.error||!!r.fallback,pop:!1,next:null,push:null,error:!1,fallback:!1,value:null,type:null,shouldThrow:!1};for(var a in r)h.call(r,a)&&(t[a]=r[a]);if(typeof t.type=="string"&&e!==t.type)throw new Error("Type transform cannot be a string (type '"+t.type+"' for token '"+e+"')");var i=t.match;return t.match=Array.isArray(i)?i:i?[i]:[],t.match.sort(function(n,o){return d(n)&&d(o)?0:d(o)?-1:d(n)?1:o.length-n.length}),t}function O(e){return Array.isArray(e)?B(e):T(e)}var _=w("error",{lineBreaks:!0,shouldThrow:!0});function R(e,r){for(var t=null,a=Object.create(null),i=!0,n=null,o=[],c=[],s=0;s<e.length;s++)e[s].fallback&&(i=!1);for(var s=0;s<e.length;s++){var l=e[s];if(l.include)throw new Error("Inheritance is not allowed in stateless lexers");if(l.error||l.fallback){if(t)throw!l.fallback==!t.fallback?new Error("Multiple "+(l.fallback?"fallback":"error")+" rules not allowed (for token '"+l.defaultType+"')"):new Error("fallback and error are mutually exclusive (for token '"+l.defaultType+"')");t=l}var p=l.match.slice();if(i)for(;p.length&&typeof p[0]=="string"&&p[0].length===1;){var C=p.shift();a[C.charCodeAt(0)]=l}if(l.pop||l.push||l.next){if(!r)throw new Error("State-switching options are not allowed in stateless lexers (for token '"+l.defaultType+"')");if(l.fallback)throw new Error("State-switching options are not allowed on fallback tokens (for token '"+l.defaultType+"')")}if(p.length!==0){i=!1,o.push(l);for(var P=0;P<p.length;P++){var G=p[P];if(d(G)){if(n===null)n=G.unicode;else if(n!==G.unicode&&l.fallback===!1)throw new Error("If one rule is /u then all must be")}}var D=v(p.map(x)),S=new RegExp(D);if(S.test(""))throw new Error("RegExp matches empty string: "+S);var N=A(D);if(N>0)throw new Error("RegExp has capture groups: "+S+`
Use (?: … ) instead`);if(!l.lineBreaks&&S.test(`
`))throw new Error("Rule should declare lineBreaks: "+S);c.push(g(D))}}var M=t&&t.fallback,z=u&&!M?"ym":"gm",X=u||M?"":"|";n===!0&&(z+="u");var xe=new RegExp(v(c)+X,z);return{regexp:xe,groups:o,fast:a,error:t||_}}function de(e){var r=R(O(e));return new y({start:r},"start")}function le(e,r,t){var a=e&&(e.push||e.next);if(a&&!t[a])throw new Error("Missing state '"+a+"' (in token '"+e.defaultType+"' of state '"+r+"')");if(e&&e.pop&&+e.pop!=1)throw new Error("pop must be 1 (in token '"+e.defaultType+"' of state '"+r+"')")}function ge(e,r){var t=e.$all?O(e.$all):[];delete e.$all;var a=Object.getOwnPropertyNames(e);r||(r=a[0]);for(var i=Object.create(null),n=0;n<a.length;n++){var o=a[n];i[o]=O(e[o]).concat(t)}for(var n=0;n<a.length;n++)for(var o=a[n],c=i[o],s=Object.create(null),l=0;l<c.length;l++){var p=c[l];if(p.include){var C=[l,1];if(p.include!==o&&!s[p.include]){s[p.include]=!0;var P=i[p.include];if(!P)throw new Error("Cannot include nonexistent state '"+p.include+"' (in state '"+o+"')");for(var G=0;G<P.length;G++){var D=P[G];c.indexOf(D)===-1&&C.push(D)}}c.splice.apply(c,C),l--}}for(var S=Object.create(null),n=0;n<a.length;n++){var o=a[n];S[o]=R(i[o],!0)}for(var n=0;n<a.length;n++){for(var N=a[n],M=S[N],z=M.groups,l=0;l<z.length;l++)le(z[l],N,S);for(var X=Object.getOwnPropertyNames(M.fast),l=0;l<X.length;l++)le(M.fast[X[l]],N,S)}return new y(S,r)}function we(e){for(var r=typeof Map<"u",t=r?new Map:Object.create(null),a=Object.getOwnPropertyNames(e),i=0;i<a.length;i++){var n=a[i],o=e[n],c=Array.isArray(o)?o:[o];c.forEach(function(s){if(typeof s!="string")throw new Error("keyword must be string (in keyword '"+n+"')");r?t.set(s,n):t[s]=n})}return function(s){return r?t.get(s):t[s]}}var y=function(e,r){this.startState=r,this.states=e,this.buffer="",this.stack=[],this.reset()};y.prototype.reset=function(e,r){return this.buffer=e||"",this.index=0,this.line=r?r.line:1,this.col=r?r.col:1,this.queuedToken=r?r.queuedToken:null,this.queuedText=r?r.queuedText:"",this.queuedThrow=r?r.queuedThrow:null,this.setState(r?r.state:this.startState),this.stack=r&&r.stack?r.stack.slice():[],this},y.prototype.save=function(){return{line:this.line,col:this.col,state:this.state,stack:this.stack.slice(),queuedToken:this.queuedToken,queuedText:this.queuedText,queuedThrow:this.queuedThrow}},y.prototype.setState=function(e){if(!(!e||this.state===e)){this.state=e;var r=this.states[e];this.groups=r.groups,this.error=r.error,this.re=r.regexp,this.fast=r.fast}},y.prototype.popState=function(){this.setState(this.stack.pop())},y.prototype.pushState=function(e){this.stack.push(this.state),this.setState(e)};var ye=u?function(e,r){return e.exec(r)}:function(e,r){var t=e.exec(r);return t[0].length===0?null:t};y.prototype._getGroup=function(e){for(var r=this.groups.length,t=0;t<r;t++)if(e[t+1]!==void 0)return this.groups[t];throw new Error("Cannot find token type for matched text")};function ke(){return this.value}if(y.prototype.next=function(){var e=this.index;if(this.queuedGroup){var r=this._token(this.queuedGroup,this.queuedText,e);return this.queuedGroup=null,this.queuedText="",r}var t=this.buffer;if(e!==t.length){var o=this.fast[t.charCodeAt(e)];if(o)return this._token(o,t.charAt(e),e);var a=this.re;a.lastIndex=e;var i=ye(a,t),n=this.error;if(i==null)return this._token(n,t.slice(e,t.length),e);var o=this._getGroup(i),c=i[0];return n.fallback&&i.index!==e?(this.queuedGroup=o,this.queuedText=c,this._token(n,t.slice(e,i.index),e)):this._token(o,c,e)}},y.prototype._token=function(e,r,t){var a=0;if(e.lineBreaks){var i=/\n/g,n=1;if(r===`
`)a=1;else for(;i.exec(r);)a++,n=i.lastIndex}var o={type:typeof e.type=="function"&&e.type(r)||e.defaultType,value:typeof e.value=="function"?e.value(r):r,text:r,toString:ke,offset:t,lineBreaks:a,line:this.line,col:this.col},c=r.length;if(this.index+=c,this.line+=a,a!==0?this.col=c-n+1:this.col+=c,e.shouldThrow){var s=new Error(this.formatError(o,"invalid syntax"));throw s}return e.pop?this.popState():e.push?this.pushState(e.push):e.next&&this.setState(e.next),o},typeof Symbol<"u"&&Symbol.iterator){var Z=function(e){this.lexer=e};Z.prototype.next=function(){var e=this.lexer.next();return{value:e,done:!e}},Z.prototype[Symbol.iterator]=function(){return this},y.prototype[Symbol.iterator]=function(){return new Z(this)}}return y.prototype.formatError=function(e,r){if(e==null)var t=this.buffer.slice(this.index),e={text:t,offset:this.index,lineBreaks:t.indexOf(`
`)===-1?0:1,line:this.line,col:this.col};var a=2,i=Math.max(e.line-a,1),n=e.line+a,o=String(n).length,c=$(this.buffer,this.line-e.line+a+1).slice(0,5),s=[];s.push(r+" at line "+e.line+" col "+e.col+":"),s.push("");for(var l=0;l<c.length;l++){var p=c[l],C=i+l;s.push(m(String(C),o)+"  "+p),C===e.line&&s.push(m("",o+e.col+1)+"^")}return s.join(`
`)},y.prototype.clone=function(){return new y(this.states,this.state)},y.prototype.has=function(e){return!0},{compile:de,states:ge,error:Object.freeze({error:!0}),fallback:Object.freeze({fallback:!0}),keywords:we}})})(pe);var Re=pe.exports;function He(k){const h=Re.compile({gray:[/\/\/.*?$/,/\/\*[\s\S]*?\*\//],white:{match:[" ",`
`,"	","+","-","*","/","%","=","+=","-=","*=","/=","%=","->","==","!=",">","<",">=","<=",";",".",",",":","?"],lineBreaks:!0},darkBlue:["var","const","type","true","false","fn"],green:["int","bool","float","str","void"],purple:["if","else","while","for","return","match","print"],orange:["(",")","{","}"],orange2:[/".*?"/,/'.*?'/,/"/],yellow:/0|[1-9]\d*/,lightBlue:/[a-zA-Z_]\w*/});h.reset(k);let f="";for(;;){const u=h.next();if(!u)break;switch(u.type){case"white":f+=u.value;break;case"gray":f+=`<code class="text-gray-500">${u.value}</code>`;break;case"darkBlue":f+=`<code class="text-sky-600">${u.value}</code>`;break;case"lightBlue":f+=`<code class="text-sky-400">${u.value}</code>`;break;case"yellow":f+=`<code class="text-yellow-300">${u.value}</code>`;break;case"green":f+=`<code class="text-green-400">${u.value}</code>`;break;case"orange2":case"orange":f+=`<code class="text-orange-300">${u.value}</code>`;break;case"purple":f+=`<code class="text-pink-400">${u.value}</code>`;break;default:f+=u.value}}return f}var Ae=J('<code class="bg-color-dark text-color-on-dark my-4 inline-block w-full overflow-auto whitespace-pre p-6 shadow-[10px_10px_0_0_black]"><!></code>');function Ue(k,h){let f=ne(h,"id",8,"");var u=Ae(),d=F(u);U(d,h,"default",{},null),H(u),he(()=>ve(u,"id",f())),q(k,u)}var Be=J('<div class="bg-primary-700 p-12"><!></div>'),Ce=J('<div class="bg-orange-400 p-12"><!></div>'),Pe=J('<div class="p-12"><!></div>');function Je(k,h){let f=ne(h,"color",8,"primary");var u=I(),d=L(u);ce(d,()=>f()==="primary",b=>{var E=Be(),A=F(E);ee(A,{children:(g,v)=>{re(g,{children:(x,m)=>{var $=I(),T=L($);U(T,h,"default",{},null),q(x,$)},$$slots:{default:!0}})},$$slots:{default:!0}}),H(E),q(b,E)},b=>{var E=I(),A=L(E);ce(A,()=>f()==="yellow",g=>{var v=Ce(),x=F(v);ee(x,{children:(m,$)=>{re(m,{children:(T,B)=>{var w=I(),O=L(w);U(O,h,"default",{},null),q(T,w)},$$slots:{default:!0}})},$$slots:{default:!0}}),H(v),q(g,v)},g=>{var v=Pe(),x=F(v);ee(x,{children:(m,$)=>{re(m,{children:(T,B)=>{var w=I(),O=L(w);U(O,h,"default",{},null),q(T,w)},$$slots:{default:!0}})},$$slots:{default:!0}}),H(v),q(g,v)},!0),q(b,E)}),q(k,u)}var Ge=J('<p class="text-2xl"><!></p>');function Xe(k,h){let f=ne(h,"id",8,"");var u=Ge(),d=F(u);U(d,h,"default",{},null),H(u),he(()=>ve(u,"id",f())),q(k,u)}export{Xe as D,Je as S,Ue as a,Ie as b,Fe as g,He as l};
