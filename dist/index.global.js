"use strict";var Siya=(()=>{var h=Object.defineProperty;var N=Object.getOwnPropertyDescriptor;var D=Object.getOwnPropertyNames;var z=Object.prototype.hasOwnProperty;var P=(e,i)=>{for(var t in i)h(e,t,{get:i[t],enumerable:!0})},$=(e,i,t,r)=>{if(i&&typeof i=="object"||typeof i=="function")for(let n of D(i))!z.call(e,n)&&n!==t&&h(e,n,{get:()=>i[n],enumerable:!(r=N(i,n))||r.enumerable});return e};var j=e=>$(h({},"__esModule",{value:!0}),e);var J={};P(J,{default:()=>K});var g=[],B=0,l=new Map,a={toasts:[],config:{position:"top-right",duration:4e3,max:5,pauseOnHover:!0,rich:!1,closable:!0,stack:!1}};function u(){g.forEach(e=>e(a))}function w(e){return g.push(e),()=>{g=g.filter(i=>i!==e)}}function _(e){if(!e.id||!e.duration||e.duration<=0)return;let i={start:performance.now(),remaining:e.duration,paused:!1,raf:null},t=()=>{if(e.id&&l.has(e.id)){if(!i.paused){let r=performance.now()-i.start;if(i.remaining-r<=0){l.delete(e.id),y(e.id);return}}i.raf=requestAnimationFrame(t)}};i.raf=requestAnimationFrame(t),l.set(e.id,i)}function E(e){let i=l.get(e);if(!i||i.paused)return;let t=performance.now()-i.start;i.remaining-=t,i.paused=!0,i.raf&&cancelAnimationFrame(i.raf)}function C(e){let i=l.get(e);if(!i||!i.paused)return;i.paused=!1,i.start=performance.now();let t=()=>{if(l.has(e)){if(!i.paused){let r=performance.now()-i.start;if(i.remaining-r<=0){l.delete(e),y(e);return}}i.raf=requestAnimationFrame(t)}};i.raf=requestAnimationFrame(t)}function L(e){var r,n,d,c,f;let i=(r=e.persistent)!=null?r:!1,t={id:++B,type:e.type||"default",title:e.title||"",message:e.message||"",actions:e.actions||[],duration:i?0:(n=e.duration)!=null?n:a.config.duration,pauseOnHover:(d=e.pauseOnHover)!=null?d:a.config.pauseOnHover,rich:(c=e.rich)!=null?c:a.config.rich,closable:(f=e.closable)!=null?f:a.config.closable,persistent:i,visible:!0};return a.toasts=[t,...a.toasts],a.toasts.length>a.config.max&&(a.toasts=a.toasts.slice(0,a.config.max)),u(),i||_(t),t}function y(e){let i=a.toasts.find(r=>r.id===e);if(!i)return;i.visible=!1,u();let t=l.get(e);t!=null&&t.raf&&cancelAnimationFrame(t.raf),l.delete(e),setTimeout(()=>{a.toasts=a.toasts.filter(r=>r.id!==e),u()},200)}function v(e,i){a.toasts=a.toasts.map(t=>t.id===e?{...t,...i}:t),u()}function M(){l.forEach(e=>{e.raf&&cancelAnimationFrame(e.raf)}),l.clear(),a.toasts=[],u()}function b(e){var t;let i=(((t=e.actions)==null?void 0:t.length)||0)>0;return`
        <div class="siya-inner">

            <div class="siya-icon"></div>

            <div class="siya-body">

                <div class="siya-content">

                    ${e.title?'<div class="siya-title"></div>':""}

                    <div class="siya-message"></div>

                </div>

                ${i?`
                            <div class="siya-actions">

                                ${e.actions.map((r,n)=>`
                                        <button
                                            class="siya-action"
                                            data-action="${n}"
                                            type="button"
                                        >
                                            ${r.label}
                                        </button>
                                    `).join("")}

                            </div>
                        `:""}

            </div>

            <button
                class="siya-close"
                type="button"
                aria-label="Close notification"
            >
                \xD7
            </button>

        </div>

        ${e.duration&&e.duration>0?`
                    <div class="siya-progress">

                        <div class="siya-progress-bar"></div>

                    </div>
                `:""}
    `}var Y={success:`
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="12" cy="12" r="10"></circle>

            <path d="M8 12l2.5 2.5L16 9"></path>
        </svg>
    `,error:`
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        >
            <circle cx="12" cy="12" r="10"></circle>

            <path d="M9 9l6 6M15 9l-6 6"></path>
        </svg>
    `,warning:`
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>

            <path d="M12 9v4"></path>

            <path d="M12 17h.01"></path>
        </svg>
    `,info:`
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        >
            <circle cx="12" cy="12" r="10"></circle>

            <path d="M12 10v4"></path>

            <path d="M12 7h.01"></path>
        </svg>
    `,default:`
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"></path>

            <path d="M13.73 21a2 2 0 01-3.46 0"></path>
        </svg>
    `},S=Y;function G(e){var f;let i=document.createElement("div"),t=e.type||"default";i.classList.add("siya-toast"),i.classList.add(`siya-${t}`),e.rich&&i.classList.add("siya-rich"),i.classList.add("enter"),i.innerHTML=b(e);let r=i.querySelector(".siya-icon");r&&(r.innerHTML=S[t]||S.default||"");let n=i.querySelector(".siya-title");n&&(n.textContent=e.title||"");let d=i.querySelector(".siya-message");d&&(d.textContent=e.message||""),(f=i.querySelector(".siya-close"))==null||f.addEventListener("click",()=>{e.id&&y(e.id)});let c=i.querySelector(".siya-actions");if(c&&e.actions&&(c.innerHTML="",e.actions.forEach(s=>{let o=document.createElement("button");o.className="siya-action",o.type="button",o.textContent=s.label,o.addEventListener("click",m=>{var p;m.stopPropagation(),(p=s.onClick)==null||p.call(s,e,{dismiss:()=>{e.id&&y(e.id)}}),e.id&&y(e.id)}),c.appendChild(o)})),e.pauseOnHover&&e.id&&(i.addEventListener("mouseenter",()=>E(e.id)),i.addEventListener("mouseleave",()=>C(e.id))),e.duration&&e.duration>0&&e.id){let s=i.querySelector(".siya-progress-bar");if(s){let o=0,m=()=>{if(!i.isConnected)return;let p=l.get(e.id);if(!p)return;let q=p.paused?0:performance.now()-p.start,H=p.remaining-q,I=Math.max(H/e.duration,0);s.style.transform=`scaleX(${I})`,o=requestAnimationFrame(m)};s.style.transformOrigin="left",o=requestAnimationFrame(m),i.__progressRAF=o}}return requestAnimationFrame(()=>{i.classList.remove("enter"),i.classList.add("enter-active")}),i}function T(){let e=null,i=new Map,t;function r(d){if(e)return e;let c=document.createElement("div");return c.className=`siya-container siya-${d.config.position}`,document.body.appendChild(c),e=c,c}function n(d){let c=new Set,f=r(d);d.toasts.forEach(s=>{if(!s.visible||!s.id||(c.add(s.id),i.has(s.id)))return;let o=G(s);i.set(s.id,o),f.appendChild(o)}),i.forEach((s,o)=>{c.has(o)||(s.classList.add("leave-active"),setTimeout(()=>{s.__progressRAF&&cancelAnimationFrame(s.__progressRAF),s.remove(),i.delete(o)},200))})}return{mount(d){t=w(n),n(d)},unmount(){t==null||t(),e==null||e.remove(),e=null,i.clear()}}}var A={};var O=!1;function k(){if(O||typeof document=="undefined")return;let e=document.createElement("style");e.textContent=A,document.head.appendChild(e),O=!0}var F,R=!1;function x(){R||(k(),F=T(),F.mount(a),R=!0)}var X={init(e={}){a.config={...a.config,...e},x()},toast(e={}){return x(),L({...e,type:e.type||"default"})},success(e,i={}){return this.toast({...i,message:e,type:"success"})},error(e,i={}){return this.toast({...i,message:e,type:"error"})},info(e,i={}){return this.toast({...i,message:e,type:"info"})},warning(e,i={}){return this.toast({...i,message:e,type:"warning"})},action(e,i,t){return this.toast({title:e,message:i,actions:[{label:t.label||"Action",onClick:t.onClick}],duration:0})},promise(e,i={}){x();let t=this.toast({message:i.loading,type:"info",duration:0});return Promise.resolve(e).then(r=>(v(t.id,{message:typeof i.success=="function"?i.success(r):i.success,type:"success"}),setTimeout(()=>{y(t.id)},1500),r)).catch(r=>{throw v(t.id,{message:typeof i.error=="function"?i.error(r):i.error,type:"error"}),setTimeout(()=>{y(t.id)},2e3),r})},confirm(e,i={}){return x(),this.toast({title:e,message:i.message||"",duration:0,rich:!0,actions:[{label:i.cancel||"Cancel",onClick:()=>{var t;(t=i.onCancel)==null||t.call(i)}},{label:i.confirm||"Confirm",onClick:()=>{var t;(t=i.onConfirm)==null||t.call(i)}}]})},clear:M},K=X;return j(J);})();

window.Siya = Siya.default || Siya;

