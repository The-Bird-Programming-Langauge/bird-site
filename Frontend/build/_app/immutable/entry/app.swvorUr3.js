const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["../nodes/0.DONsWP-G.js","../chunks/disclose-version.BZNNxwED.js","../chunks/runtime.B86c_EQ3.js","../assets/0.Dv834SzA.css","../nodes/1.DliSPS83.js","../chunks/stores.CaCbvOrp.js","../chunks/entry.dz__FNTx.js","../chunks/store.De9OuTSV.js","../nodes/2.DqQ7RdPw.js","../chunks/DocsText.C82zCeA9.js","../chunks/header.CoSiyrLM.js","../chunks/index-client.BfbeWHmQ.js","../chunks/terminal.BIqdWfMN.js","../assets/terminal.ddcHt3UE.css","../nodes/3.DTR-D_I-.js","../nodes/4.B0B39qGy.js"])))=>i.map(i=>d[i]);
var F=n=>{throw TypeError(n)};var q=(n,t,r)=>t.has(n)||F("Cannot "+r);var l=(n,t,r)=>(q(n,t,"read from private field"),r?r.call(n):t.get(n)),T=(n,t,r)=>t.has(n)?F("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(n):t.set(n,r),O=(n,t,r,a)=>(q(n,t,"write to private field"),a?a.call(n,r):t.set(n,r),r);import{D as U,L as H,z as J,E as K,A as Q,F as X,Y as Z,h as v,d as x,ak as M,al as $,ah as tt,p as et,u as rt,k as st,am as nt,f as w,a as at,an as S,s as ot,c as it,t as ct,r as lt,x as C}from"../chunks/runtime.B86c_EQ3.js";import{h as ut,f as dt,u as ft,a as mt}from"../chunks/store.De9OuTSV.js";import{c as D,a as P,t as N,b as ht}from"../chunks/disclose-version.BZNNxwED.js";import{p as I,o as _t,a as vt,i as V,b as j}from"../chunks/index-client.BfbeWHmQ.js";function p(n,t,r){U&&H();var a=n,o,c;J(()=>{o!==(o=t())&&(c&&(Z(c),c=null),o&&(c=Q(()=>r(a,o))))},K),U&&(a=X)}function gt(n){return class extends yt{constructor(t){super({component:n,...t})}}}var g,d;class yt{constructor(t){T(this,g);T(this,d);var c;var r=new Map,a=(s,e)=>{var f=tt(e);return r.set(s,f),f};const o=new Proxy({...t.props||{},$$events:{}},{get(s,e){return v(r.get(e)??a(e,Reflect.get(s,e)))},has(s,e){return v(r.get(e)??a(e,Reflect.get(s,e))),Reflect.has(s,e)},set(s,e,f){return x(r.get(e)??a(e,f),f),Reflect.set(s,e,f)}});O(this,d,(t.hydrate?ut:dt)(t.component,{target:t.target,anchor:t.anchor,props:o,context:t.context,intro:t.intro??!1,recover:t.recover})),(!((c=t==null?void 0:t.props)!=null&&c.$$host)||t.sync===!1)&&M(),O(this,g,o.$$events);for(const s of Object.keys(l(this,d)))s==="$set"||s==="$destroy"||s==="$on"||$(this,s,{get(){return l(this,d)[s]},set(e){l(this,d)[s]=e},enumerable:!0});l(this,d).$set=s=>{Object.assign(o,s)},l(this,d).$destroy=()=>{ft(l(this,d))}}$set(t){l(this,d).$set(t)}$on(t,r){l(this,g)[t]=l(this,g)[t]||[];const a=(...o)=>r.call(this,...o);return l(this,g)[t].push(a),()=>{l(this,g)[t]=l(this,g)[t].filter(o=>o!==a)}}$destroy(){l(this,d).$destroy()}}g=new WeakMap,d=new WeakMap;const Et="modulepreload",bt=function(n,t){return new URL(n,t).href},z={},R=function(t,r,a){let o=Promise.resolve();if(r&&r.length>0){const s=document.getElementsByTagName("link"),e=document.querySelector("meta[property=csp-nonce]"),f=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));o=Promise.allSettled(r.map(u=>{if(u=bt(u,a),u in z)return;z[u]=!0;const y=u.endsWith(".css"),A=y?'[rel="stylesheet"]':"";if(!!a)for(let m=s.length-1;m>=0;m--){const _=s[m];if(_.href===u&&(!y||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${A}`))return;const i=document.createElement("link");if(i.rel=y?"stylesheet":Et,y||(i.as="script"),i.crossOrigin="",i.href=u,f&&i.setAttribute("nonce",f),document.head.appendChild(i),y)return new Promise((m,_)=>{i.addEventListener("load",m),i.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${u}`)))})}))}function c(s){const e=new Event("vite:preloadError",{cancelable:!0});if(e.payload=s,window.dispatchEvent(e),!e.defaultPrevented)throw s}return o.then(s=>{for(const e of s||[])e.status==="rejected"&&c(e.reason);return t().catch(c)})},St={};var Pt=N('<div id="svelte-announcer" aria-live="assertive" aria-atomic="true" style="position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"><!></div>'),Rt=N("<!> <!>",1);function kt(n,t){et(t,!0);let r=I(t,"components",23,()=>[]),a=I(t,"data_0",3,null),o=I(t,"data_1",3,null);rt(()=>t.stores.page.set(t.page)),st(()=>{t.stores,t.page,t.constructors,r(),t.form,a(),o(),t.stores.page.notify()});let c=S(!1),s=S(!1),e=S(null);_t(()=>{const E=t.stores.page.subscribe(()=>{v(c)&&(x(s,!0),nt().then(()=>{x(e,vt(document.title||"untitled page"))}))});return x(c,!0),E});const f=C(()=>t.constructors[1]);var u=Rt(),y=w(u);V(y,()=>t.constructors[1],E=>{var i=D();const m=C(()=>t.constructors[0]);var _=w(i);p(_,()=>v(m),(b,L)=>{j(L(b,{get data(){return a()},get form(){return t.form},children:(h,wt)=>{var B=D(),W=w(B);p(W,()=>v(f),(Y,G)=>{j(G(Y,{get data(){return o()},get form(){return t.form}}),k=>r()[1]=k,()=>{var k;return(k=r())==null?void 0:k[1]})}),P(h,B)},$$slots:{default:!0}}),h=>r()[0]=h,()=>{var h;return(h=r())==null?void 0:h[0]})}),P(E,i)},E=>{var i=D();const m=C(()=>t.constructors[0]);var _=w(i);p(_,()=>v(m),(b,L)=>{j(L(b,{get data(){return a()},get form(){return t.form}}),h=>r()[0]=h,()=>{var h;return(h=r())==null?void 0:h[0]})}),P(E,i)});var A=ot(y,2);V(A,()=>v(c),E=>{var i=Pt(),m=it(i);V(m,()=>v(s),_=>{var b=ht();ct(()=>mt(b,v(e))),P(_,b)}),lt(i),P(E,i)}),P(n,u),at()}const Ct=gt(kt),Dt=[()=>R(()=>import("../nodes/0.DONsWP-G.js"),__vite__mapDeps([0,1,2,3]),import.meta.url),()=>R(()=>import("../nodes/1.DliSPS83.js"),__vite__mapDeps([4,1,2,5,6,7]),import.meta.url),()=>R(()=>import("../nodes/2.DqQ7RdPw.js"),__vite__mapDeps([8,1,2,5,6,7,9,10,11,12,13]),import.meta.url),()=>R(()=>import("../nodes/3.DTR-D_I-.js"),__vite__mapDeps([14,1,2,5,6,11,7,10,9]),import.meta.url),()=>R(()=>import("../nodes/4.B0B39qGy.js"),__vite__mapDeps([15,1,2,5,6,7,12,10,11,13]),import.meta.url)],It=[],Vt={"/":[2],"/docs":[3],"/playground":[4]},jt={handleError:({error:n})=>{console.error(n)},reroute:()=>{}};export{Vt as dictionary,jt as hooks,St as matchers,Dt as nodes,Ct as root,It as server_loads};
