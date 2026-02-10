import{e as fn,R,j as d,r as w,f as z,g as le,aK as wr,u as rl,h as nl,L as ns,aL as ol,a0 as ll,t as Mt,a1 as dl,aM as cl}from"./main-DceGpGwO.js";import{M as gn,C as ul,a as hl}from"./content-type-badge-Cpei_anj.js";import{u as ml,g as Pt}from"./locale-store-B7-CXBVt.js";import{B as at}from"./button-BHG2OhSC.js";import{D as kr,a as Mr,b as Lr,c as Rr,d as xr,e as Cr}from"./dialog-DVXoQ1Y_.js";import{I as pl}from"./input-CpzCFDUM.js";import{L as vl}from"./label-Dxc7L3gt.js";import{S as El,a as fl,b as gl,c as _l,d as bl}from"./select-Cs5v_HVJ.js";import{u as Al,c as zt}from"./index-p0R01vq7.js";import{u as ot,c as Dr}from"./index-dCKO-H-p.js";import{c as _n,u as yl,P as Pi}from"./index-DOOsqIPV.js";import{e as Tl,D as Sl,d as Il,f as wl,g as kl}from"./dropdown-menu-BKg05o6Q.js";import{P as Ml}from"./pause-CYWFn1F4.js";import{C as Ll}from"./getPseudoElementBounds-Dt3bew_I.js";import{c as Rl}from"./roles-BxusQDRQ.js";import{A as xl}from"./arrow-left-CGHMbIKH.js";import{V as Cl}from"./video-DT5zOMka.js";import{F as Dl}from"./file-text-DoWJZnk-.js";import{T as Pl}from"./trash-2-D-pc85fq.js";import{C as Nl}from"./church-81id59Vj.js";import{U as Ol}from"./user-CUHKimUD.js";import{C as Pr}from"./calendar-D6czeycA.js";import{E as Ul}from"./eye-uABj9HoH.js";import{H as $l}from"./heart-DGJe3sAB.js";import"./message-square-DyREG7ZW.js";import"./DialogTitle-DQILMd8w.js";import"./useOpenInteractionType-57V_whEH.js";import"./createBaseUIEventDetails-DZkIUnSu.js";import"./useSyncedFloatingRootContext-DdOu4aU5.js";import"./useRole-BGM6ddMg.js";import"./useField-BAEOusgc.js";import"./useValueChanged-DZJ1QgWJ.js";import"./CompositeList-BX-CoGc7.js";import"./CompositeItem-yDgGKS7w.js";import"./useCompositeItem--a0qhkcj.js";const Hl=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],Fl=fn("play",Hl);const Bl=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],Vl=fn("share-2",Bl);function Wl(t){const e=t+"CollectionProvider",[i,a]=_n(e),[s,r]=i(e,{collectionRef:{current:null},itemMap:new Map}),n=g=>{const{scope:f,children:u}=g,y=R.useRef(null),T=R.useRef(new Map).current;return d.jsx(s,{scope:f,itemMap:T,collectionRef:y,children:u})};n.displayName=e;const l=t+"CollectionSlot",c=Dr(l),_=R.forwardRef((g,f)=>{const{scope:u,children:y}=g,T=r(l,u),S=ot(f,T.collectionRef);return d.jsx(c,{ref:S,children:y})});_.displayName=l;const E=t+"CollectionItemSlot",m="data-radix-collection-item",v=Dr(E),p=R.forwardRef((g,f)=>{const{scope:u,children:y,...T}=g,S=R.useRef(null),x=ot(f,S),$=r(E,u);return R.useEffect(()=>($.itemMap.set(S,{ref:S,...T}),()=>{$.itemMap.delete(S)})),d.jsx(v,{[m]:"",ref:x,children:y})});p.displayName=E;function A(g){const f=r(t+"CollectionConsumer",g);return R.useCallback(()=>{const y=f.collectionRef.current;if(!y)return[];const T=Array.from(y.querySelectorAll(`[${m}]`));return Array.from(f.itemMap.values()).sort(($,ue)=>T.indexOf($.ref.current)-T.indexOf(ue.ref.current))},[f.collectionRef,f.itemMap])}return[{Provider:n,Slot:_,ItemSlot:p},A,a]}var jl=w.createContext(void 0);function Kl(t){const e=w.useContext(jl);return t||e||"ltr"}function Gl(t){const e=w.useRef({value:t,previous:t});return w.useMemo(()=>(e.current.value!==t&&(e.current.previous=e.current.value,e.current.value=t),e.current.previous),[t])}function ql(t){const[e,i]=w.useState(void 0);return yl(()=>{if(t){i({width:t.offsetWidth,height:t.offsetHeight});const a=new ResizeObserver(s=>{if(!Array.isArray(s)||!s.length)return;const r=s[0];let n,l;if("borderBoxSize"in r){const c=r.borderBoxSize,_=Array.isArray(c)?c[0]:c;n=_.inlineSize,l=_.blockSize}else n=t.offsetWidth,l=t.offsetHeight;i({width:n,height:l})});return a.observe(t,{box:"border-box"}),()=>a.unobserve(t)}else i(void 0)},[t]),e}function bn(t,[e,i]){return Math.min(i,Math.max(e,t))}var An=["PageUp","PageDown"],yn=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],Tn={"from-left":["Home","PageDown","ArrowDown","ArrowLeft"],"from-right":["Home","PageDown","ArrowDown","ArrowRight"],"from-bottom":["Home","PageDown","ArrowDown","ArrowLeft"],"from-top":["Home","PageDown","ArrowUp","ArrowLeft"]},ii="Slider",[ps,Yl,zl]=Wl(ii),[Sn]=_n(ii,[zl]),[Ql,Na]=Sn(ii),Gs=w.forwardRef((t,e)=>{const{name:i,min:a=0,max:s=100,step:r=1,orientation:n="horizontal",disabled:l=!1,minStepsBetweenThumbs:c=0,defaultValue:_=[a],value:E,onValueChange:m=()=>{},onValueCommit:v=()=>{},inverted:p=!1,form:A,...g}=t,f=w.useRef(new Set),u=w.useRef(0),T=n==="horizontal"?Zl:Xl,[S=[],x]=Al({prop:E,defaultProp:_,onChange:B=>{[...f.current][u.current]?.focus(),m(B)}}),$=w.useRef(S);function ue(B){const de=ad(S,B);P(B,de)}function me(B){P(B,u.current)}function be(){const B=$.current[u.current];S[u.current]!==B&&v(S)}function P(B,de,{commit:ze}={commit:!1}){const Le=od(r),Qe=ld(Math.round((B-a)/r)*r+a,Le),pe=bn(Qe,[a,s]);x((Ae=[])=>{const X=td(Ae,pe,de);if(nd(X,c*r)){u.current=X.indexOf(pe);const We=String(X)!==String(Ae);return We&&ze&&v(X),We?X:Ae}else return Ae})}return d.jsx(Ql,{scope:t.__scopeSlider,name:i,disabled:l,min:a,max:s,valueIndexToChangeRef:u,thumbs:f.current,values:S,orientation:n,form:A,children:d.jsx(ps.Provider,{scope:t.__scopeSlider,children:d.jsx(ps.Slot,{scope:t.__scopeSlider,children:d.jsx(T,{"aria-disabled":l,"data-disabled":l?"":void 0,...g,ref:e,onPointerDown:zt(g.onPointerDown,()=>{l||($.current=S)}),min:a,max:s,inverted:p,onSlideStart:l?void 0:ue,onSlideMove:l?void 0:me,onSlideEnd:l?void 0:be,onHomeKeyDown:()=>!l&&P(a,0,{commit:!0}),onEndKeyDown:()=>!l&&P(s,S.length-1,{commit:!0}),onStepKeyDown:({event:B,direction:de})=>{if(!l){const Qe=An.includes(B.key)||B.shiftKey&&yn.includes(B.key)?10:1,pe=u.current,Ae=S[pe],X=r*Qe*de;P(Ae+X,pe,{commit:!0})}}})})})})});Gs.displayName=ii;var[In,wn]=Sn(ii,{startEdge:"left",endEdge:"right",size:"width",direction:1}),Zl=w.forwardRef((t,e)=>{const{min:i,max:a,dir:s,inverted:r,onSlideStart:n,onSlideMove:l,onSlideEnd:c,onStepKeyDown:_,...E}=t,[m,v]=w.useState(null),p=ot(e,T=>v(T)),A=w.useRef(void 0),g=Kl(s),f=g==="ltr",u=f&&!r||!f&&r;function y(T){const S=A.current||m.getBoundingClientRect(),x=[0,S.width],ue=Qs(x,u?[i,a]:[a,i]);return A.current=S,ue(T-S.left)}return d.jsx(In,{scope:t.__scopeSlider,startEdge:u?"left":"right",endEdge:u?"right":"left",direction:u?1:-1,size:"width",children:d.jsx(kn,{dir:g,"data-orientation":"horizontal",...E,ref:p,style:{...E.style,"--radix-slider-thumb-transform":"translateX(-50%)"},onSlideStart:T=>{const S=y(T.clientX);n?.(S)},onSlideMove:T=>{const S=y(T.clientX);l?.(S)},onSlideEnd:()=>{A.current=void 0,c?.()},onStepKeyDown:T=>{const x=Tn[u?"from-left":"from-right"].includes(T.key);_?.({event:T,direction:x?-1:1})}})})}),Xl=w.forwardRef((t,e)=>{const{min:i,max:a,inverted:s,onSlideStart:r,onSlideMove:n,onSlideEnd:l,onStepKeyDown:c,..._}=t,E=w.useRef(null),m=ot(e,E),v=w.useRef(void 0),p=!s;function A(g){const f=v.current||E.current.getBoundingClientRect(),u=[0,f.height],T=Qs(u,p?[a,i]:[i,a]);return v.current=f,T(g-f.top)}return d.jsx(In,{scope:t.__scopeSlider,startEdge:p?"bottom":"top",endEdge:p?"top":"bottom",size:"height",direction:p?1:-1,children:d.jsx(kn,{"data-orientation":"vertical",..._,ref:m,style:{..._.style,"--radix-slider-thumb-transform":"translateY(50%)"},onSlideStart:g=>{const f=A(g.clientY);r?.(f)},onSlideMove:g=>{const f=A(g.clientY);n?.(f)},onSlideEnd:()=>{v.current=void 0,l?.()},onStepKeyDown:g=>{const u=Tn[p?"from-bottom":"from-top"].includes(g.key);c?.({event:g,direction:u?-1:1})}})})}),kn=w.forwardRef((t,e)=>{const{__scopeSlider:i,onSlideStart:a,onSlideMove:s,onSlideEnd:r,onHomeKeyDown:n,onEndKeyDown:l,onStepKeyDown:c,..._}=t,E=Na(ii,i);return d.jsx(Pi.span,{..._,ref:e,onKeyDown:zt(t.onKeyDown,m=>{m.key==="Home"?(n(m),m.preventDefault()):m.key==="End"?(l(m),m.preventDefault()):An.concat(yn).includes(m.key)&&(c(m),m.preventDefault())}),onPointerDown:zt(t.onPointerDown,m=>{const v=m.target;v.setPointerCapture(m.pointerId),m.preventDefault(),E.thumbs.has(v)?v.focus():a(m)}),onPointerMove:zt(t.onPointerMove,m=>{m.target.hasPointerCapture(m.pointerId)&&s(m)}),onPointerUp:zt(t.onPointerUp,m=>{const v=m.target;v.hasPointerCapture(m.pointerId)&&(v.releasePointerCapture(m.pointerId),r(m))})})}),Mn="SliderTrack",qs=w.forwardRef((t,e)=>{const{__scopeSlider:i,...a}=t,s=Na(Mn,i);return d.jsx(Pi.span,{"data-disabled":s.disabled?"":void 0,"data-orientation":s.orientation,...a,ref:e})});qs.displayName=Mn;var vs="SliderRange",Ys=w.forwardRef((t,e)=>{const{__scopeSlider:i,...a}=t,s=Na(vs,i),r=wn(vs,i),n=w.useRef(null),l=ot(e,n),c=s.values.length,_=s.values.map(v=>Rn(v,s.min,s.max)),E=c>1?Math.min(..._):0,m=100-Math.max(..._);return d.jsx(Pi.span,{"data-orientation":s.orientation,"data-disabled":s.disabled?"":void 0,...a,ref:l,style:{...t.style,[r.startEdge]:E+"%",[r.endEdge]:m+"%"}})});Ys.displayName=vs;var Es="SliderThumb",zs=w.forwardRef((t,e)=>{const i=Yl(t.__scopeSlider),[a,s]=w.useState(null),r=ot(e,l=>s(l)),n=w.useMemo(()=>a?i().findIndex(l=>l.ref.current===a):-1,[i,a]);return d.jsx(Jl,{...t,ref:r,index:n})}),Jl=w.forwardRef((t,e)=>{const{__scopeSlider:i,index:a,name:s,...r}=t,n=Na(Es,i),l=wn(Es,i),[c,_]=w.useState(null),E=ot(e,y=>_(y)),m=c?n.form||!!c.closest("form"):!0,v=ql(c),p=n.values[a],A=p===void 0?0:Rn(p,n.min,n.max),g=id(a,n.values.length),f=v?.[l.size],u=f?sd(f,A,l.direction):0;return w.useEffect(()=>{if(c)return n.thumbs.add(c),()=>{n.thumbs.delete(c)}},[c,n.thumbs]),d.jsxs("span",{style:{transform:"var(--radix-slider-thumb-transform)",position:"absolute",[l.startEdge]:`calc(${A}% + ${u}px)`},children:[d.jsx(ps.ItemSlot,{scope:t.__scopeSlider,children:d.jsx(Pi.span,{role:"slider","aria-label":t["aria-label"]||g,"aria-valuemin":n.min,"aria-valuenow":p,"aria-valuemax":n.max,"aria-orientation":n.orientation,"data-orientation":n.orientation,"data-disabled":n.disabled?"":void 0,tabIndex:n.disabled?void 0:0,...r,ref:E,style:p===void 0?{display:"none"}:t.style,onFocus:zt(t.onFocus,()=>{n.valueIndexToChangeRef.current=a})})}),m&&d.jsx(Ln,{name:s??(n.name?n.name+(n.values.length>1?"[]":""):void 0),form:n.form,value:p},a)]})});zs.displayName=Es;var ed="RadioBubbleInput",Ln=w.forwardRef(({__scopeSlider:t,value:e,...i},a)=>{const s=w.useRef(null),r=ot(s,a),n=Gl(e);return w.useEffect(()=>{const l=s.current;if(!l)return;const c=window.HTMLInputElement.prototype,E=Object.getOwnPropertyDescriptor(c,"value").set;if(n!==e&&E){const m=new Event("input",{bubbles:!0});E.call(l,e),l.dispatchEvent(m)}},[n,e]),d.jsx(Pi.input,{style:{display:"none"},...i,ref:r,defaultValue:e})});Ln.displayName=ed;function td(t=[],e,i){const a=[...t];return a[i]=e,a.sort((s,r)=>s-r)}function Rn(t,e,i){const r=100/(i-e)*(t-e);return bn(r,[0,100])}function id(t,e){return e>2?`Value ${t+1} of ${e}`:e===2?["Minimum","Maximum"][t]:void 0}function ad(t,e){if(t.length===1)return 0;const i=t.map(s=>Math.abs(s-e)),a=Math.min(...i);return i.indexOf(a)}function sd(t,e,i){const a=t/2,r=Qs([0,50],[0,a]);return(a-r(e)*i)*i}function rd(t){return t.slice(0,-1).map((e,i)=>t[i+1]-e)}function nd(t,e){if(e>0){const i=rd(t);return Math.min(...i)>=e}return!0}function Qs(t,e){return i=>{if(t[0]===t[1]||e[0]===e[1])return e[0];const a=(e[1]-e[0])/(t[1]-t[0]);return e[0]+a*(i-t[0])}}function od(t){return(String(t).split(".")[1]||"").length}function ld(t,e){const i=Math.pow(10,e);return Math.round(t*i)/i}var dd=Gs,xn=qs,Cn=Ys,Dn=zs;const cd=Object.freeze(Object.defineProperty({__proto__:null,Range:Cn,Root:dd,Slider:Gs,SliderRange:Ys,SliderThumb:zs,SliderTrack:qs,Thumb:Dn,Track:xn},Symbol.toStringTag,{value:"Module"}));const ud=new Set(["style","children","ref","key","suppressContentEditableWarning","suppressHydrationWarning","dangerouslySetInnerHTML"]),hd={className:"class",htmlFor:"for"};function md(t){return t.toLowerCase()}function Nr(t){if(typeof t=="boolean")return t?"":void 0;if(typeof t!="function"&&!(typeof t=="object"&&t!==null))return t}function O({react:t,tagName:e,elementClass:i,events:a,displayName:s,defaultProps:r,toAttributeName:n=md,toAttributeValue:l=Nr}){const c=Number.parseInt(t.version)>=19,_=t.forwardRef((E,m)=>{const v=t.useRef(null),p=t.useRef(new Map),A={},g={},f={},u={};for(const[y,T]of Object.entries(E)){if(ud.has(y)){f[y]=T;continue}const S=n(hd[y]??y);if(i.prototype&&y in i.prototype&&!(y in(globalThis.HTMLElement?.prototype??{}))&&!i.observedAttributes?.some($=>$===S)){u[y]=T;continue}if(y.startsWith("on")){A[y]=T;continue}const x=l(T);if(S&&x!=null&&(g[S]=String(x),c||(f[S]=x)),S&&c){const $=Nr(T);x!==$?f[S]=x:f[S]=T}}if(typeof window<"u"){for(const y in A){const T=A[y],S=y.endsWith("Capture"),x=(a?.[y]??y.slice(2).toLowerCase()).slice(0,S?-7:void 0);t.useLayoutEffect(()=>{const $=v?.current;if(!(!$||typeof T!="function"))return $.addEventListener(x,T,S),()=>{$.removeEventListener(x,T,S)}},[v?.current,T])}t.useLayoutEffect(()=>{if(v.current===null)return;const y=new Map;for(const T in u)Or(v.current,T,u[T]),p.current.delete(T),y.set(T,u[T]);for(const[T,S]of p.current)Or(v.current,T,void 0);p.current=y})}if(typeof window>"u"&&i?.getTemplateHTML&&i?.shadowRootOptions){const{mode:y,delegatesFocus:T}=i.shadowRootOptions,S=t.createElement("template",{shadowrootmode:y,shadowrootdelegatesfocus:T,dangerouslySetInnerHTML:{__html:i.getTemplateHTML(g,E)},key:"ce-la-react-ssr-template-shadow-root"});f.children=[S,f.children]}return t.createElement(e,{...r,...f,ref:t.useCallback(y=>{v.current=y,typeof m=="function"?m(y):m!==null&&(m.current=y)},[m])},f.children)});return _.displayName=s??i.name,_}function Or(t,e,i){t[e]=i,i==null&&e in(globalThis.HTMLElement?.prototype??{})&&t.removeAttribute(e)}const I={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_LOOP_REQUEST:"medialooprequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},H={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},Pn={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_BUFFERED:"mediaBuffered",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_CHAPTERS_CUES:"mediaChaptersCues",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_ENDED:"mediaEnded",MEDIA_ERROR:"mediaError",MEDIA_ERROR_CODE:"mediaErrorCode",MEDIA_ERROR_MESSAGE:"mediaErrorMessage",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_HEIGHT:"mediaHeight",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_IS_PIP:"mediaIsPip",MEDIA_LOADING:"mediaLoading",MEDIA_MUTED:"mediaMuted",MEDIA_LOOP:"mediaLoop",MEDIA_PAUSED:"mediaPaused",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_LANG:"mediaLang",MEDIA_WIDTH:"mediaWidth"},Nn=Object.entries(Pn),o=Nn.reduce((t,[e,i])=>(t[e]=i.toLowerCase(),t),{}),pd={USER_INACTIVE_CHANGE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"},ei=Nn.reduce((t,[e,i])=>(t[e]=i.toLowerCase(),t),{...pd});Object.entries(ei).reduce((t,[e,i])=>{const a=o[e];return a&&(t[i]=a),t},{userinactivechange:"userinactive"});const vd=Object.entries(o).reduce((t,[e,i])=>{const a=ei[e];return a&&(t[i]=a),t},{userinactive:"userinactivechange"}),Ve={SUBTITLES:"subtitles",CAPTIONS:"captions",CHAPTERS:"chapters",METADATA:"metadata"},Xt={DISABLED:"disabled",SHOWING:"showing"},os={MOUSE:"mouse",PEN:"pen",TOUCH:"touch"},Ee={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},qe={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"},Ed={FULLSCREEN:"fullscreen"};function fd(t){return t?.map(gd).join(" ")}function gd(t){if(t){const{id:e,width:i,height:a}=t;return[e,i,a].filter(s=>s!=null).join(":")}}function _d(t){return t?.map(bd).join(" ")}function bd(t){if(t){const{id:e,kind:i,language:a,label:s}=t;return[e,i,a,s].filter(r=>r!=null).join(":")}}function Zs(t){return typeof t=="number"&&!Number.isNaN(t)&&Number.isFinite(t)}const On=t=>new Promise(e=>setTimeout(e,t)),Ur=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],Ad=(t,e)=>{const i=t===1?Ur[e].singular:Ur[e].plural;return`${t} ${i}`},yi=t=>{if(!Zs(t))return"";const e=Math.abs(t),i=e!==t,a=new Date(0,0,0,0,0,e,0);return`${[a.getHours(),a.getMinutes(),a.getSeconds()].map((l,c)=>l&&Ad(l,c)).filter(l=>l).join(", ")}${i?" remaining":""}`};function nt(t,e){let i=!1;t<0&&(i=!0,t=0-t),t=t<0?0:t;let a=Math.floor(t%60),s=Math.floor(t/60%60),r=Math.floor(t/3600);const n=Math.floor(e/60%60),l=Math.floor(e/3600);return(isNaN(t)||t===1/0)&&(r=s=a="0"),r=r>0||l>0?r+":":"",s=((r||n>=10)&&s<10?"0"+s:s)+":",a=a<10?"0"+a:a,(i?"-":"")+r+s+a}const yd={"Start airplay":"Start airplay","Stop airplay":"Stop airplay",Audio:"Audio",Captions:"Captions","Enable captions":"Enable captions","Disable captions":"Disable captions","Start casting":"Start casting","Stop casting":"Stop casting","Enter fullscreen mode":"Enter fullscreen mode","Exit fullscreen mode":"Exit fullscreen mode",Mute:"Mute",Unmute:"Unmute",Loop:"Loop","Enter picture in picture mode":"Enter picture in picture mode","Exit picture in picture mode":"Exit picture in picture mode",Play:"Play",Pause:"Pause","Playback rate":"Playback rate","Playback rate {playbackRate}":"Playback rate {playbackRate}",Quality:"Quality","Seek backward":"Seek backward","Seek forward":"Seek forward",Settings:"Settings",Auto:"Auto","audio player":"audio player","video player":"video player",volume:"volume",seek:"seek","closed captions":"closed captions","current playback rate":"current playback rate","playback time":"playback time","media loading":"media loading",settings:"settings","audio tracks":"audio tracks",quality:"quality",play:"play",pause:"pause",mute:"mute",unmute:"unmute","chapter: {chapterName}":"chapter: {chapterName}",live:"live",Off:"Off","start airplay":"start airplay","stop airplay":"stop airplay","start casting":"start casting","stop casting":"stop casting","enter fullscreen mode":"enter fullscreen mode","exit fullscreen mode":"exit fullscreen mode","enter picture in picture mode":"enter picture in picture mode","exit picture in picture mode":"exit picture in picture mode","seek to live":"seek to live","playing live":"playing live","seek back {seekOffset} seconds":"seek back {seekOffset} seconds","seek forward {seekOffset} seconds":"seek forward {seekOffset} seconds","Network Error":"Network Error","Decode Error":"Decode Error","Source Not Supported":"Source Not Supported","Encryption Error":"Encryption Error","A network error caused the media download to fail.":"A network error caused the media download to fail.","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"An unsupported error occurred. The server or network failed, or your browser does not support this format.","The media is encrypted and there are no keys to decrypt it.":"The media is encrypted and there are no keys to decrypt it."};var $r;const ls={en:yd};let fs=(($r=globalThis.navigator)==null?void 0:$r.language)||"en";const Td=t=>{fs=t},Sd=t=>{var e,i,a;const[s]=fs.split("-");return((e=ls[fs])==null?void 0:e[t])||((i=ls[s])==null?void 0:i[t])||((a=ls.en)==null?void 0:a[t])||t},k=(t,e={})=>Sd(t).replace(/\{(\w+)\}/g,(i,a)=>a in e?String(e[a]):`{${a}}`);class Un{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}}let $n=class extends Un{};class Hr extends $n{constructor(){super(...arguments),this.role=null}}let Id=class{observe(){}unobserve(){}disconnect(){}};const Hn={createElement:function(){return new wi.HTMLElement},createElementNS:function(){return new wi.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent(t){return!1}},wi={ResizeObserver:Id,document:Hn,Node:$n,Element:Hr,HTMLElement:class extends Hr{constructor(){super(...arguments),this.innerHTML=""}get content(){return new wi.DocumentFragment}},DocumentFragment:class extends Un{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem(t){return null},setItem(t,e){},removeItem(t){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia(t){return{matches:!1,media:t}},DOMParser:class{parseFromString(e,i){return{body:{textContent:e}}}}},Fn="global"in globalThis&&globalThis?.global===globalThis||typeof window>"u"||typeof window.customElements>"u",Bn=Object.keys(wi).every(t=>t in globalThis),h=Fn&&!Bn?wi:globalThis,ce=Fn&&!Bn?Hn:globalThis.document,Fr=new WeakMap,Xs=t=>{let e=Fr.get(t);return e||Fr.set(t,e=new Set),e},Vn=new h.ResizeObserver(t=>{for(const e of t)for(const i of Xs(e.target))i(e)});function Wn(t,e){Xs(t).add(e),Vn.observe(t)}function jn(t,e){const i=Xs(t);i.delete(e),i.size||Vn.unobserve(t)}function Me(t){const e={};for(const i of t)e[i.name]=i.value;return e}function wd(t){var e;return(e=kd(t))!=null?e:Ni(t,"media-controller")}function kd(t){var e;const{MEDIA_CONTROLLER:i}=H,a=t.getAttribute(i);if(a)return(e=Ld(t))==null?void 0:e.getElementById(a)}const Kn=(t,e,i=".value")=>{const a=t.querySelector(i);a&&(a.textContent=e)},Md=(t,e)=>{const i=`slot[name="${e}"]`,a=t.shadowRoot.querySelector(i);return a?a.children:[]},Gn=(t,e)=>Md(t,e)[0],ai=(t,e)=>!t||!e?!1:t?.contains(e)?!0:ai(t,e.getRootNode().host),Ni=(t,e)=>{if(!t)return null;const i=t.closest(e);return i||Ni(t.getRootNode().host,e)};function qn(t=document){var e;const i=t?.activeElement;return i?(e=qn(i.shadowRoot))!=null?e:i:null}function Ld(t){var e;const i=(e=t?.getRootNode)==null?void 0:e.call(t);return i instanceof ShadowRoot||i instanceof Document?i:null}function Yn(t,{depth:e=3,checkOpacity:i=!0,checkVisibilityCSS:a=!0}={}){if(t.checkVisibility)return t.checkVisibility({checkOpacity:i,checkVisibilityCSS:a});let s=t;for(;s&&e>0;){const r=getComputedStyle(s);if(i&&r.opacity==="0"||a&&r.visibility==="hidden"||r.display==="none")return!1;s=s.parentElement,e--}return!0}function Rd(t,e,i,a){const s=a.x-i.x,r=a.y-i.y,n=s*s+r*r;if(n===0)return 0;const l=((t-i.x)*s+(e-i.y)*r)/n;return Math.max(0,Math.min(1,l))}function ee(t,e){const i=xd(t,a=>a===e);return i||zn(t,e)}function xd(t,e){var i,a;let s;for(s of(i=t.querySelectorAll("style:not([media])"))!=null?i:[]){let r;try{r=(a=s.sheet)==null?void 0:a.cssRules}catch{continue}for(const n of r??[])if(e(n.selectorText))return n}}function zn(t,e){var i,a;const s=(i=t.querySelectorAll("style:not([media])"))!=null?i:[],r=s?.[s.length-1];return r?.sheet?(r?.sheet.insertRule(`${e}{}`,r.sheet.cssRules.length),(a=r.sheet.cssRules)==null?void 0:a[r.sheet.cssRules.length-1]):(console.warn("Media Chrome: No style sheet found on style tag of",t),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}})}function K(t,e,i=Number.NaN){const a=t.getAttribute(e);return a!=null?+a:i}function se(t,e,i){const a=+i;if(i==null||Number.isNaN(a)){t.hasAttribute(e)&&t.removeAttribute(e);return}K(t,e,void 0)!==a&&t.setAttribute(e,`${a}`)}function C(t,e){return t.hasAttribute(e)}function D(t,e,i){if(i==null){t.hasAttribute(e)&&t.removeAttribute(e);return}C(t,e)!=i&&t.toggleAttribute(e,i)}function G(t,e,i=null){var a;return(a=t.getAttribute(e))!=null?a:i}function q(t,e,i){if(i==null){t.hasAttribute(e)&&t.removeAttribute(e);return}const a=`${i}`;G(t,e,void 0)!==a&&t.setAttribute(e,a)}var Qn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ze=(t,e,i)=>(Qn(t,e,"read from private field"),i?i.call(t):e.get(t)),Cd=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Hi=(t,e,i,a)=>(Qn(t,e,"write to private field"),e.set(t,i),i),he;function Dd(t){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `}class Oa extends h.HTMLElement{constructor(){if(super(),Cd(this,he,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=Me(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[H.MEDIA_CONTROLLER,o.MEDIA_PAUSED]}attributeChangedCallback(e,i,a){var s,r,n,l,c;e===H.MEDIA_CONTROLLER&&(i&&((r=(s=Ze(this,he))==null?void 0:s.unassociateElement)==null||r.call(s,this),Hi(this,he,null)),a&&this.isConnected&&(Hi(this,he,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(l=Ze(this,he))==null?void 0:l.associateElement)==null||c.call(l,this)))}connectedCallback(){var e,i,a,s;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),Hi(this,he,Pd(this)),this.getAttribute(H.MEDIA_CONTROLLER)&&((i=(e=Ze(this,he))==null?void 0:e.associateElement)==null||i.call(e,this)),(a=Ze(this,he))==null||a.addEventListener("pointerdown",this),(s=Ze(this,he))==null||s.addEventListener("click",this)}disconnectedCallback(){var e,i,a,s;this.getAttribute(H.MEDIA_CONTROLLER)&&((i=(e=Ze(this,he))==null?void 0:e.unassociateElement)==null||i.call(e,this)),(a=Ze(this,he))==null||a.removeEventListener("pointerdown",this),(s=Ze(this,he))==null||s.removeEventListener("click",this),Hi(this,he,null)}handleEvent(e){var i;const a=(i=e.composedPath())==null?void 0:i[0];if(["video","media-controller"].includes(a?.localName)){if(e.type==="pointerdown")this._pointerType=e.pointerType;else if(e.type==="click"){const{clientX:r,clientY:n}=e,{left:l,top:c,width:_,height:E}=this.getBoundingClientRect(),m=r-l,v=n-c;if(m<0||v<0||m>_||v>E||_===0&&E===0)return;const p=this._pointerType||"mouse";if(this._pointerType=void 0,p===os.TOUCH){this.handleTap(e);return}else if(p===os.MOUSE||p===os.PEN){this.handleMouseClick(e);return}}}}get mediaPaused(){return C(this,o.MEDIA_PAUSED)}set mediaPaused(e){D(this,o.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){const i=this.mediaPaused?I.MEDIA_PLAY_REQUEST:I.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new h.CustomEvent(i,{composed:!0,bubbles:!0}))}}he=new WeakMap;Oa.shadowRootOptions={mode:"open"};Oa.getTemplateHTML=Dd;function Pd(t){var e;const i=t.getAttribute(H.MEDIA_CONTROLLER);return i?(e=t.getRootNode())==null?void 0:e.getElementById(i):Ni(t,"media-controller")}h.customElements.get("media-gesture-receiver")||h.customElements.define("media-gesture-receiver",Oa);var gs=Oa,Js=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},_e=(t,e,i)=>(Js(t,e,"read from private field"),i?i.call(t):e.get(t)),fe=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},mt=(t,e,i,a)=>(Js(t,e,"write to private field"),e.set(t,i),i),Se=(t,e,i)=>(Js(t,e,"access private method"),i),ya,Nt,ki,Qt,Zi,_s,Zn,ui,Xi,bs,Xn,As,Jn,Mi,Ua,$a,er,ti,Li;const L={AUDIO:"audio",AUTOHIDE:"autohide",BREAKPOINTS:"breakpoints",GESTURES_DISABLED:"gesturesdisabled",KEYBOARD_CONTROL:"keyboardcontrol",NO_AUTOHIDE:"noautohide",USER_INACTIVE:"userinactive",AUTOHIDE_OVER_CONTROLS:"autohideovercontrols"};function Nd(t){return`
    <style>
      
      :host([${o.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
        outline: none;
      }

      :host {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        line-height: 0;
        background-color: var(--media-background-color, #000);
        overflow: hidden;
      }

      :host(:not([${L.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: start;
        pointer-events: none;
        background: none;
      }

      slot[name=media] {
        display: var(--media-slot-display, contents);
      }

      
      :host([${L.AUDIO}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${L.AUDIO}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${L.AUDIO}])[${L.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${L.AUDIO}])[${L.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${L.AUDIO}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${L.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${L.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
        align-self: stretch;
        flex-grow: 1;
      }

      slot[name=middle-chrome] {
        display: inline;
        flex-grow: 1;
        pointer-events: none;
        background: none;
      }

      
      ::slotted([slot=media]),
      ::slotted([slot=poster]) {
        width: 100%;
        height: 100%;
      }

      
      :host(:not([${L.AUDIO}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${L.NO_AUTOHIDE}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${L.USER_INACTIVE}]:not([${o.MEDIA_PAUSED}]):not([${o.MEDIA_IS_AIRPLAYING}]):not([${o.MEDIA_IS_CASTING}]):not([${L.AUDIO}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${L.NO_AUTOHIDE}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${L.USER_INACTIVE}]:not([${L.NO_AUTOHIDE}]):not([${o.MEDIA_PAUSED}]):not([${o.MEDIA_IS_CASTING}]):not([${L.AUDIO}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${L.USER_INACTIVE}][${L.AUTOHIDE_OVER_CONTROLS}]:not([${L.NO_AUTOHIDE}]):not([${o.MEDIA_PAUSED}]):not([${o.MEDIA_IS_CASTING}]):not([${L.AUDIO}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${L.AUDIO}])[${o.MEDIA_HAS_PLAYED}]) slot[name=poster] {
        display: none;
      }

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${gs.shadowRootOptions.mode}">
          ${gs.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `}const Od=Object.values(o),Ud="sm:384 md:576 lg:768 xl:960";function $d(t){eo(t.target,t.contentRect.width)}function eo(t,e){var i;if(!t.isConnected)return;const a=(i=t.getAttribute(L.BREAKPOINTS))!=null?i:Ud,s=Hd(a),r=Fd(s,e);let n=!1;if(Object.keys(s).forEach(l=>{if(r.includes(l)){t.hasAttribute(`breakpoint${l}`)||(t.setAttribute(`breakpoint${l}`,""),n=!0);return}t.hasAttribute(`breakpoint${l}`)&&(t.removeAttribute(`breakpoint${l}`),n=!0)}),n){const l=new CustomEvent(ei.BREAKPOINTS_CHANGE,{detail:r});t.dispatchEvent(l)}t.breakpointsComputed||(t.breakpointsComputed=!0,t.dispatchEvent(new CustomEvent(ei.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}function Hd(t){const e=t.split(/\s+/);return Object.fromEntries(e.map(i=>i.split(":")))}function Fd(t,e){return Object.keys(t).filter(i=>e>=parseInt(t[i]))}class Oi extends h.HTMLElement{constructor(){if(super(),fe(this,_s),fe(this,bs),fe(this,As),fe(this,Mi),fe(this,$a),fe(this,ti),fe(this,ya,0),fe(this,Nt,null),fe(this,ki,null),fe(this,Qt,void 0),this.breakpointsComputed=!1,fe(this,Zi,new MutationObserver(Se(this,_s,Zn).bind(this))),fe(this,ui,!1),fe(this,Xi,i=>{_e(this,ui)||(setTimeout(()=>{$d(i),mt(this,ui,!1)},0),mt(this,ui,!0))}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const i=Me(this.attributes),a=this.constructor.getTemplateHTML(i);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(a):this.shadowRoot.innerHTML=a}const e=this.querySelector(":scope > slot[slot=media]");e&&e.addEventListener("slotchange",()=>{if(!e.assignedElements({flatten:!0}).length){_e(this,Nt)&&this.mediaUnsetCallback(_e(this,Nt));return}this.handleMediaUpdated(this.media)})}static get observedAttributes(){return[L.AUTOHIDE,L.GESTURES_DISABLED].concat(Od).filter(e=>![o.MEDIA_RENDITION_LIST,o.MEDIA_AUDIO_TRACK_LIST,o.MEDIA_CHAPTERS_CUES,o.MEDIA_WIDTH,o.MEDIA_HEIGHT,o.MEDIA_ERROR,o.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,i,a){e.toLowerCase()==L.AUTOHIDE&&(this.autohide=a)}get media(){let e=this.querySelector(":scope > [slot=media]");return e?.nodeName=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(mt(this,Nt,e),e.localName.includes("-")&&await h.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;_e(this,Zi).observe(this,{childList:!0,subtree:!0}),Wn(this,_e(this,Xi));const i=this.getAttribute(L.AUDIO)!=null,a=k(i?"audio player":"video player");this.setAttribute("role","region"),this.setAttribute("aria-label",a),this.handleMediaUpdated(this.media),this.setAttribute(L.USER_INACTIVE,""),eo(this,this.getBoundingClientRect().width),this.addEventListener("pointerdown",this),this.addEventListener("pointermove",this),this.addEventListener("pointerup",this),this.addEventListener("mouseleave",this),this.addEventListener("keyup",this),(e=h.window)==null||e.addEventListener("mouseup",this)}disconnectedCallback(){var e;_e(this,Zi).disconnect(),jn(this,_e(this,Xi)),this.media&&this.mediaUnsetCallback(this.media),(e=h.window)==null||e.removeEventListener("mouseup",this)}mediaSetCallback(e){}mediaUnsetCallback(e){mt(this,Nt,null)}handleEvent(e){switch(e.type){case"pointerdown":mt(this,ya,e.timeStamp);break;case"pointermove":Se(this,bs,Xn).call(this,e);break;case"pointerup":Se(this,As,Jn).call(this,e);break;case"mouseleave":Se(this,Mi,Ua).call(this);break;case"mouseup":this.removeAttribute(L.KEYBOARD_CONTROL);break;case"keyup":Se(this,ti,Li).call(this),this.setAttribute(L.KEYBOARD_CONTROL,"");break}}set autohide(e){const i=Number(e);mt(this,Qt,isNaN(i)?0:i)}get autohide(){return(_e(this,Qt)===void 0?2:_e(this,Qt)).toString()}get breakpoints(){return G(this,L.BREAKPOINTS)}set breakpoints(e){q(this,L.BREAKPOINTS,e)}get audio(){return C(this,L.AUDIO)}set audio(e){D(this,L.AUDIO,e)}get gesturesDisabled(){return C(this,L.GESTURES_DISABLED)}set gesturesDisabled(e){D(this,L.GESTURES_DISABLED,e)}get keyboardControl(){return C(this,L.KEYBOARD_CONTROL)}set keyboardControl(e){D(this,L.KEYBOARD_CONTROL,e)}get noAutohide(){return C(this,L.NO_AUTOHIDE)}set noAutohide(e){D(this,L.NO_AUTOHIDE,e)}get autohideOverControls(){return C(this,L.AUTOHIDE_OVER_CONTROLS)}set autohideOverControls(e){D(this,L.AUTOHIDE_OVER_CONTROLS,e)}get userInteractive(){return C(this,L.USER_INACTIVE)}set userInteractive(e){D(this,L.USER_INACTIVE,e)}}ya=new WeakMap;Nt=new WeakMap;ki=new WeakMap;Qt=new WeakMap;Zi=new WeakMap;_s=new WeakSet;Zn=function(t){const e=this.media;for(const i of t){if(i.type!=="childList")continue;const a=i.removedNodes;for(const s of a){if(s.slot!="media"||i.target!=this)continue;let r=i.previousSibling&&i.previousSibling.previousElementSibling;if(!r||!e)this.mediaUnsetCallback(s);else{let n=r.slot!=="media";for(;(r=r.previousSibling)!==null;)r.slot=="media"&&(n=!1);n&&this.mediaUnsetCallback(s)}}if(e)for(const s of i.addedNodes)s===e&&this.handleMediaUpdated(e)}};ui=new WeakMap;Xi=new WeakMap;bs=new WeakSet;Xn=function(t){if(t.pointerType!=="mouse"&&t.timeStamp-_e(this,ya)<250)return;Se(this,$a,er).call(this),clearTimeout(_e(this,ki));const e=this.hasAttribute(L.AUTOHIDE_OVER_CONTROLS);([this,this.media].includes(t.target)||e)&&Se(this,ti,Li).call(this)};As=new WeakSet;Jn=function(t){if(t.pointerType==="touch"){const e=!this.hasAttribute(L.USER_INACTIVE);[this,this.media].includes(t.target)&&e?Se(this,Mi,Ua).call(this):Se(this,ti,Li).call(this)}else t.composedPath().some(e=>["media-play-button","media-fullscreen-button"].includes(e?.localName))&&Se(this,ti,Li).call(this)};Mi=new WeakSet;Ua=function(){if(_e(this,Qt)<0||this.hasAttribute(L.USER_INACTIVE))return;this.setAttribute(L.USER_INACTIVE,"");const t=new h.CustomEvent(ei.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(t)};$a=new WeakSet;er=function(){if(!this.hasAttribute(L.USER_INACTIVE))return;this.removeAttribute(L.USER_INACTIVE);const t=new h.CustomEvent(ei.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(t)};ti=new WeakSet;Li=function(){Se(this,$a,er).call(this),clearTimeout(_e(this,ki));const t=parseInt(this.autohide);t<0||mt(this,ki,setTimeout(()=>{Se(this,Mi,Ua).call(this)},t*1e3))};Oi.shadowRootOptions={mode:"open"};Oi.getTemplateHTML=Nd;h.customElements.get("media-container")||h.customElements.define("media-container",Oi);var Bd=Oi,to=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ae=(t,e,i)=>(to(t,e,"read from private field"),i?i.call(t):e.get(t)),oi=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Fi=(t,e,i,a)=>(to(t,e,"write to private field"),e.set(t,i),i),Ot,Ut,Ta,ft,Ge,et;class io{constructor(e,i,{defaultValue:a}={defaultValue:void 0}){oi(this,Ge),oi(this,Ot,void 0),oi(this,Ut,void 0),oi(this,Ta,void 0),oi(this,ft,new Set),Fi(this,Ot,e),Fi(this,Ut,i),Fi(this,Ta,new Set(a))}[Symbol.iterator](){return ae(this,Ge,et).values()}get length(){return ae(this,Ge,et).size}get value(){var e;return(e=[...ae(this,Ge,et)].join(" "))!=null?e:""}set value(e){var i;e!==this.value&&(Fi(this,ft,new Set),this.add(...(i=e?.split(" "))!=null?i:[]))}toString(){return this.value}item(e){return[...ae(this,Ge,et)][e]}values(){return ae(this,Ge,et).values()}forEach(e,i){ae(this,Ge,et).forEach(e,i)}add(...e){var i,a;e.forEach(s=>ae(this,ft).add(s)),!(this.value===""&&!((i=ae(this,Ot))!=null&&i.hasAttribute(`${ae(this,Ut)}`)))&&((a=ae(this,Ot))==null||a.setAttribute(`${ae(this,Ut)}`,`${this.value}`))}remove(...e){var i;e.forEach(a=>ae(this,ft).delete(a)),(i=ae(this,Ot))==null||i.setAttribute(`${ae(this,Ut)}`,`${this.value}`)}contains(e){return ae(this,Ge,et).has(e)}toggle(e,i){return typeof i<"u"?i?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,i){return this.remove(e),this.add(i),e===i}}Ot=new WeakMap;Ut=new WeakMap;Ta=new WeakMap;ft=new WeakMap;Ge=new WeakSet;et=function(){return ae(this,ft).size?ae(this,ft):ae(this,Ta)};const Vd=(t="")=>t.split(/\s+/),ao=(t="")=>{const[e,i,a]=t.split(":"),s=a?decodeURIComponent(a):void 0;return{kind:e==="cc"?Ve.CAPTIONS:Ve.SUBTITLES,language:i,label:s}},so=(t="",e={})=>Vd(t).map(i=>{const a=ao(i);return{...e,...a}}),ro=t=>t?Array.isArray(t)?t.map(e=>typeof e=="string"?ao(e):e):typeof t=="string"?so(t):[t]:[],Wd=({kind:t,label:e,language:i}={kind:"subtitles"})=>e?`${t==="captions"?"cc":"sb"}:${i}:${encodeURIComponent(e)}`:i,ys=(t=[])=>Array.prototype.map.call(t,Wd).join(" "),jd=(t,e)=>i=>i[t]===e,no=t=>{const e=Object.entries(t).map(([i,a])=>jd(i,a));return i=>e.every(a=>a(i))},Ti=(t,e=[],i=[])=>{const a=ro(i).map(no),s=r=>a.some(n=>n(r));Array.from(e).filter(s).forEach(r=>{r.mode=t})},Ha=(t,e=()=>!0)=>{if(!t?.textTracks)return[];const i=typeof e=="function"?e:no(e);return Array.from(t.textTracks).filter(i)},Kd=t=>{var e;return!!((e=t.mediaSubtitlesShowing)!=null&&e.length)||t.hasAttribute(o.MEDIA_SUBTITLES_SHOWING)},Gd=t=>{var e;const{media:i,fullscreenElement:a}=t;try{const s=a&&"requestFullscreen"in a?"requestFullscreen":a&&"webkitRequestFullScreen"in a?"webkitRequestFullScreen":void 0;if(s){const r=(e=a[s])==null?void 0:e.call(a);if(r instanceof Promise)return r.catch(()=>{})}else i?.webkitEnterFullscreen?i.webkitEnterFullscreen():i?.requestFullscreen&&i.requestFullscreen()}catch(s){console.error(s)}},Br="exitFullscreen"in ce?"exitFullscreen":"webkitExitFullscreen"in ce?"webkitExitFullscreen":"webkitCancelFullScreen"in ce?"webkitCancelFullScreen":void 0,qd=t=>{var e;const{documentElement:i}=t;if(Br){const a=(e=i?.[Br])==null?void 0:e.call(i);if(a instanceof Promise)return a.catch(()=>{})}},hi="fullscreenElement"in ce?"fullscreenElement":"webkitFullscreenElement"in ce?"webkitFullscreenElement":void 0,Yd=t=>{const{documentElement:e,media:i}=t,a=e?.[hi];return!a&&"webkitDisplayingFullscreen"in i&&"webkitPresentationMode"in i&&i.webkitDisplayingFullscreen&&i.webkitPresentationMode===Ed.FULLSCREEN?i:a},zd=t=>{var e;const{media:i,documentElement:a,fullscreenElement:s=i}=t;if(!i||!a)return!1;const r=Yd(t);if(!r)return!1;if(r===s||r===i)return!0;if(r.localName.includes("-")){let n=r.shadowRoot;if(!(hi in n))return ai(r,s);for(;n?.[hi];){if(n[hi]===s)return!0;n=(e=n[hi])==null?void 0:e.shadowRoot}}return!1},Qd="fullscreenEnabled"in ce?"fullscreenEnabled":"webkitFullscreenEnabled"in ce?"webkitFullscreenEnabled":void 0,Zd=t=>{const{documentElement:e,media:i}=t;return!!e?.[Qd]||i&&"webkitSupportsFullscreen"in i};let Bi;const tr=()=>{var t,e;return Bi||(Bi=(e=(t=ce)==null?void 0:t.createElement)==null?void 0:e.call(t,"video"),Bi)},Xd=async(t=tr())=>{if(!t)return!1;const e=t.volume;t.volume=e/2+.1;const i=new AbortController,a=await Promise.race([Jd(t,i.signal),ec(t,e)]);return i.abort(),a},Jd=(t,e)=>new Promise(i=>{t.addEventListener("volumechange",()=>i(!0),{signal:e})}),ec=async(t,e)=>{for(let i=0;i<10;i++){if(t.volume===e)return!1;await On(10)}return t.volume!==e},tc=/.*Version\/.*Safari\/.*/.test(h.navigator.userAgent),oo=(t=tr())=>h.matchMedia("(display-mode: standalone)").matches&&tc?!1:typeof t?.requestPictureInPicture=="function",lo=(t=tr())=>Zd({documentElement:ce,media:t}),ic=lo(),ac=oo(),sc=!!h.WebKitPlaybackTargetAvailabilityEvent,rc=!!h.chrome,Sa=t=>Ha(t.media,e=>[Ve.SUBTITLES,Ve.CAPTIONS].includes(e.kind)).sort((e,i)=>e.kind>=i.kind?1:-1),co=t=>Ha(t.media,e=>e.mode===Xt.SHOWING&&[Ve.SUBTITLES,Ve.CAPTIONS].includes(e.kind)),uo=(t,e)=>{const i=Sa(t),a=co(t),s=!!a.length;if(i.length){if(e===!1||s&&e!==!0)Ti(Xt.DISABLED,i,a);else if(e===!0||!s&&e!==!1){let r=i[0];const{options:n}=t;if(!n?.noSubtitlesLangPref){const E=globalThis.localStorage.getItem("media-chrome-pref-subtitles-lang"),m=E?[E,...globalThis.navigator.languages]:globalThis.navigator.languages,v=i.filter(p=>m.some(A=>p.language.toLowerCase().startsWith(A.split("-")[0]))).sort((p,A)=>{const g=m.findIndex(u=>p.language.toLowerCase().startsWith(u.split("-")[0])),f=m.findIndex(u=>A.language.toLowerCase().startsWith(u.split("-")[0]));return g-f});v[0]&&(r=v[0])}const{language:l,label:c,kind:_}=r;Ti(Xt.DISABLED,i,a),Ti(Xt.SHOWING,i,[{language:l,label:c,kind:_}])}}},ir=(t,e)=>t===e?!0:t==null||e==null||typeof t!=typeof e?!1:typeof t=="number"&&Number.isNaN(t)&&Number.isNaN(e)?!0:typeof t!="object"?!1:Array.isArray(t)?nc(t,e):Object.entries(t).every(([i,a])=>i in e&&ir(a,e[i])),nc=(t,e)=>{const i=Array.isArray(t),a=Array.isArray(e);return i!==a?!1:i||a?t.length!==e.length?!1:t.every((s,r)=>ir(s,e[r])):!0},oc=Object.values(qe);let Ia;const lc=Xd().then(t=>(Ia=t,Ia)),dc=async(...t)=>{await Promise.all(t.filter(e=>e).map(async e=>{if(!("localName"in e&&e instanceof h.HTMLElement))return;const i=e.localName;if(!i.includes("-"))return;const a=h.customElements.get(i);a&&e instanceof a||(await h.customElements.whenDefined(i),h.customElements.upgrade(e))}))},cc=new h.DOMParser,uc=t=>t&&(cc.parseFromString(t,"text/html").body.textContent||t),mi={mediaError:{get(t,e){const{media:i}=t;if(e?.type!=="playing")return i?.error},mediaEvents:["emptied","error","playing"]},mediaErrorCode:{get(t,e){var i;const{media:a}=t;if(e?.type!=="playing")return(i=a?.error)==null?void 0:i.code},mediaEvents:["emptied","error","playing"]},mediaErrorMessage:{get(t,e){var i,a;const{media:s}=t;if(e?.type!=="playing")return(a=(i=s?.error)==null?void 0:i.message)!=null?a:""},mediaEvents:["emptied","error","playing"]},mediaWidth:{get(t){var e;const{media:i}=t;return(e=i?.videoWidth)!=null?e:0},mediaEvents:["resize"]},mediaHeight:{get(t){var e;const{media:i}=t;return(e=i?.videoHeight)!=null?e:0},mediaEvents:["resize"]},mediaPaused:{get(t){var e;const{media:i}=t;return(e=i?.paused)!=null?e:!0},set(t,e){var i;const{media:a}=e;a&&(t?a.pause():(i=a.play())==null||i.catch(()=>{}))},mediaEvents:["play","playing","pause","emptied"]},mediaHasPlayed:{get(t,e){const{media:i}=t;return i?e?e.type==="playing":!i.paused:!1},mediaEvents:["playing","emptied"]},mediaEnded:{get(t){var e;const{media:i}=t;return(e=i?.ended)!=null?e:!1},mediaEvents:["seeked","ended","emptied"]},mediaPlaybackRate:{get(t){var e;const{media:i}=t;return(e=i?.playbackRate)!=null?e:1},set(t,e){const{media:i}=e;i&&Number.isFinite(+t)&&(i.playbackRate=+t)},mediaEvents:["ratechange","loadstart"]},mediaMuted:{get(t){var e;const{media:i}=t;return(e=i?.muted)!=null?e:!1},set(t,e){const{media:i,options:{noMutedPref:a}={}}=e;if(i){i.muted=t;try{const s=h.localStorage.getItem("media-chrome-pref-muted")!==null,r=i.hasAttribute("muted");if(a){s&&h.localStorage.removeItem("media-chrome-pref-muted");return}if(r&&!s)return;h.localStorage.setItem("media-chrome-pref-muted",t?"true":"false")}catch(s){console.debug("Error setting muted pref",s)}}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(t,e)=>{const{options:{noMutedPref:i}}=e,{media:a}=e;if(!(!a||a.muted||i))try{const s=h.localStorage.getItem("media-chrome-pref-muted")==="true";mi.mediaMuted.set(s,e),t(s)}catch(s){console.debug("Error getting muted pref",s)}}]},mediaLoop:{get(t){const{media:e}=t;return e?.loop},set(t,e){const{media:i}=e;i&&(i.loop=t)},mediaEvents:["medialooprequest"]},mediaVolume:{get(t){var e;const{media:i}=t;return(e=i?.volume)!=null?e:1},set(t,e){const{media:i,options:{noVolumePref:a}={}}=e;if(i){try{t==null?h.localStorage.removeItem("media-chrome-pref-volume"):!i.hasAttribute("muted")&&!a&&h.localStorage.setItem("media-chrome-pref-volume",t.toString())}catch(s){console.debug("Error setting volume pref",s)}Number.isFinite(+t)&&(i.volume=+t)}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(t,e)=>{const{options:{noVolumePref:i}}=e;if(!i)try{const{media:a}=e;if(!a)return;const s=h.localStorage.getItem("media-chrome-pref-volume");if(s==null)return;mi.mediaVolume.set(+s,e),t(+s)}catch(a){console.debug("Error getting volume pref",a)}}]},mediaVolumeLevel:{get(t){const{media:e}=t;return typeof e?.volume>"u"?"high":e.muted||e.volume===0?"off":e.volume<.5?"low":e.volume<.75?"medium":"high"},mediaEvents:["volumechange"]},mediaCurrentTime:{get(t){var e;const{media:i}=t;return(e=i?.currentTime)!=null?e:0},set(t,e){const{media:i}=e;!i||!Zs(t)||(i.currentTime=t)},mediaEvents:["timeupdate","loadedmetadata"]},mediaDuration:{get(t){const{media:e,options:{defaultDuration:i}={}}=t;return i&&(!e||!e.duration||Number.isNaN(e.duration)||!Number.isFinite(e.duration))?i:Number.isFinite(e?.duration)?e.duration:Number.NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},mediaLoading:{get(t){const{media:e}=t;return e?.readyState<3},mediaEvents:["waiting","playing","emptied"]},mediaSeekable:{get(t){var e;const{media:i}=t;if(!((e=i?.seekable)!=null&&e.length))return;const a=i.seekable.start(0),s=i.seekable.end(i.seekable.length-1);if(!(!a&&!s))return[Number(a.toFixed(3)),Number(s.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress","seekablechange"]},mediaBuffered:{get(t){var e;const{media:i}=t,a=(e=i?.buffered)!=null?e:[];return Array.from(a).map((s,r)=>[Number(a.start(r).toFixed(3)),Number(a.end(r).toFixed(3))])},mediaEvents:["progress","emptied"]},mediaStreamType:{get(t){const{media:e,options:{defaultStreamType:i}={}}=t,a=[qe.LIVE,qe.ON_DEMAND].includes(i)?i:void 0;if(!e)return a;const{streamType:s}=e;if(oc.includes(s))return s===qe.UNKNOWN?a:s;const r=e.duration;return r===1/0?qe.LIVE:Number.isFinite(r)?qe.ON_DEMAND:a},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},mediaTargetLiveWindow:{get(t){const{media:e}=t;if(!e)return Number.NaN;const{targetLiveWindow:i}=e,a=mi.mediaStreamType.get(t);return(i==null||Number.isNaN(i))&&a===qe.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},mediaTimeIsLive:{get(t){const{media:e,options:{liveEdgeOffset:i=10}={}}=t;if(!e)return!1;if(typeof e.liveEdgeStart=="number")return Number.isNaN(e.liveEdgeStart)?!1:e.currentTime>=e.liveEdgeStart;if(!(mi.mediaStreamType.get(t)===qe.LIVE))return!1;const s=e.seekable;if(!s)return!0;if(!s.length)return!1;const r=s.end(s.length-1)-i;return e.currentTime>=r},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},mediaSubtitlesList:{get(t){return Sa(t).map(({kind:e,label:i,language:a})=>({kind:e,label:i,language:a}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},mediaSubtitlesShowing:{get(t){return co(t).map(({kind:e,label:i,language:a})=>({kind:e,label:i,language:a}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(t,e)=>{var i,a;const{media:s,options:r}=e;if(!s)return;const n=l=>{var c;!r.defaultSubtitles||l&&![Ve.CAPTIONS,Ve.SUBTITLES].includes((c=l?.track)==null?void 0:c.kind)||uo(e,!0)};return s.addEventListener("loadstart",n),(i=s.textTracks)==null||i.addEventListener("addtrack",n),(a=s.textTracks)==null||a.addEventListener("removetrack",n),()=>{var l,c;s.removeEventListener("loadstart",n),(l=s.textTracks)==null||l.removeEventListener("addtrack",n),(c=s.textTracks)==null||c.removeEventListener("removetrack",n)}}]},mediaChaptersCues:{get(t){var e;const{media:i}=t;if(!i)return[];const[a]=Ha(i,{kind:Ve.CHAPTERS});return Array.from((e=a?.cues)!=null?e:[]).map(({text:s,startTime:r,endTime:n})=>({text:uc(s),startTime:r,endTime:n}))},mediaEvents:["loadstart","loadedmetadata"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(t,e)=>{var i;const{media:a}=e;if(!a)return;const s=a.querySelector('track[kind="chapters"][default][src]'),r=(i=a.shadowRoot)==null?void 0:i.querySelector(':is(video,audio) > track[kind="chapters"][default][src]');return s?.addEventListener("load",t),r?.addEventListener("load",t),()=>{s?.removeEventListener("load",t),r?.removeEventListener("load",t)}}]},mediaIsPip:{get(t){var e,i;const{media:a,documentElement:s}=t;if(!a||!s||!s.pictureInPictureElement)return!1;if(s.pictureInPictureElement===a)return!0;if(s.pictureInPictureElement instanceof HTMLMediaElement)return(e=a.localName)!=null&&e.includes("-")?ai(a,s.pictureInPictureElement):!1;if(s.pictureInPictureElement.localName.includes("-")){let r=s.pictureInPictureElement.shadowRoot;for(;r?.pictureInPictureElement;){if(r.pictureInPictureElement===a)return!0;r=(i=r.pictureInPictureElement)==null?void 0:i.shadowRoot}}return!1},set(t,e){const{media:i}=e;if(i)if(t){if(!ce.pictureInPictureEnabled){console.warn("MediaChrome: Picture-in-picture is not enabled");return}if(!i.requestPictureInPicture){console.warn("MediaChrome: The current media does not support picture-in-picture");return}const a=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};i.requestPictureInPicture().catch(s=>{if(s.code===11){if(!i.src){console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a src set.");return}if(i.readyState===0&&i.preload==="none"){const r=()=>{i.removeEventListener("loadedmetadata",n),i.preload="none"},n=()=>{i.requestPictureInPicture().catch(a),r()};i.addEventListener("loadedmetadata",n),i.preload="metadata",setTimeout(()=>{i.readyState===0&&a(),r()},1e3)}else throw s}else throw s})}else ce.pictureInPictureElement&&ce.exitPictureInPicture()},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},mediaRenditionList:{get(t){var e;const{media:i}=t;return[...(e=i?.videoRenditions)!=null?e:[]].map(a=>({...a}))},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaRenditionSelected:{get(t){var e,i,a;const{media:s}=t;return(a=(i=s?.videoRenditions)==null?void 0:i[(e=s.videoRenditions)==null?void 0:e.selectedIndex])==null?void 0:a.id},set(t,e){const{media:i}=e;if(!i?.videoRenditions){console.warn("MediaController: Rendition selection not supported by this media.");return}const a=t,s=Array.prototype.findIndex.call(i.videoRenditions,r=>r.id==a);i.videoRenditions.selectedIndex!=s&&(i.videoRenditions.selectedIndex=s)},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},mediaAudioTrackList:{get(t){var e;const{media:i}=t;return[...(e=i?.audioTracks)!=null?e:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaAudioTrackEnabled:{get(t){var e,i;const{media:a}=t;return(i=[...(e=a?.audioTracks)!=null?e:[]].find(s=>s.enabled))==null?void 0:i.id},set(t,e){const{media:i}=e;if(!i?.audioTracks){console.warn("MediaChrome: Audio track selection not supported by this media.");return}const a=t;for(const s of i.audioTracks)s.enabled=a==s.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]},mediaIsFullscreen:{get(t){return zd(t)},set(t,e,i){var a;t?(Gd(e),i.detail&&((a=e.media)==null||a.focus())):qd(e)},rootEvents:["fullscreenchange","webkitfullscreenchange"],mediaEvents:["webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"]},mediaIsCasting:{get(t){var e;const{media:i}=t;return!i?.remote||((e=i.remote)==null?void 0:e.state)==="disconnected"?!1:!!i.remote.state},set(t,e){var i,a;const{media:s}=e;if(s&&!(t&&((i=s.remote)==null?void 0:i.state)!=="disconnected")&&!(!t&&((a=s.remote)==null?void 0:a.state)!=="connected")){if(typeof s.remote.prompt!="function"){console.warn("MediaChrome: Casting is not supported in this environment");return}s.remote.prompt().catch(()=>{})}},remoteEvents:["connect","connecting","disconnect"]},mediaIsAirplaying:{get(){return!1},set(t,e){const{media:i}=e;if(i){if(!(i.webkitShowPlaybackTargetPicker&&h.WebKitPlaybackTargetAvailabilityEvent)){console.error("MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment");return}i.webkitShowPlaybackTargetPicker()}},mediaEvents:["webkitcurrentplaybacktargetiswirelesschanged"]},mediaFullscreenUnavailable:{get(t){const{media:e}=t;if(!ic||!lo(e))return Ee.UNSUPPORTED}},mediaPipUnavailable:{get(t){const{media:e}=t;if(!ac||!oo(e))return Ee.UNSUPPORTED;if(e?.disablePictureInPicture)return Ee.UNAVAILABLE}},mediaVolumeUnavailable:{get(t){const{media:e}=t;if(Ia===!1||e?.volume==null)return Ee.UNSUPPORTED},stateOwnersUpdateHandlers:[t=>{Ia==null&&lc.then(e=>t(e?void 0:Ee.UNSUPPORTED))}]},mediaCastUnavailable:{get(t,{availability:e="not-available"}={}){var i;const{media:a}=t;if(!rc||!((i=a?.remote)!=null&&i.state))return Ee.UNSUPPORTED;if(!(e==null||e==="available"))return Ee.UNAVAILABLE},stateOwnersUpdateHandlers:[(t,e)=>{var i;const{media:a}=e;return a?(a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||(i=a?.remote)==null||i.watchAvailability(r=>{t({availability:r?"available":"not-available"})}).catch(r=>{r.name==="NotSupportedError"?t({availability:null}):t({availability:"not-available"})}),()=>{var r;(r=a?.remote)==null||r.cancelWatchAvailability().catch(()=>{})}):void 0}]},mediaAirplayUnavailable:{get(t,e){if(!sc)return Ee.UNSUPPORTED;if(e?.availability==="not-available")return Ee.UNAVAILABLE},mediaEvents:["webkitplaybacktargetavailabilitychanged"],stateOwnersUpdateHandlers:[(t,e)=>{var i;const{media:a}=e;return a?(a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||(i=a?.remote)==null||i.watchAvailability(r=>{t({availability:r?"available":"not-available"})}).catch(r=>{r.name==="NotSupportedError"?t({availability:null}):t({availability:"not-available"})}),()=>{var r;(r=a?.remote)==null||r.cancelWatchAvailability().catch(()=>{})}):void 0}]},mediaRenditionUnavailable:{get(t){var e;const{media:i}=t;if(!i?.videoRenditions)return Ee.UNSUPPORTED;if(!((e=i.videoRenditions)!=null&&e.length))return Ee.UNAVAILABLE},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaAudioTrackUnavailable:{get(t){var e,i;const{media:a}=t;if(!a?.audioTracks)return Ee.UNSUPPORTED;if(((i=(e=a.audioTracks)==null?void 0:e.length)!=null?i:0)<=1)return Ee.UNAVAILABLE},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaLang:{get(t){const{options:{mediaLang:e}={}}=t;return e??"en"}}},hc={[I.MEDIA_PREVIEW_REQUEST](t,e,{detail:i}){var a,s,r;const{media:n}=e,l=i??void 0;let c,_;if(n&&l!=null){const[p]=Ha(n,{kind:Ve.METADATA,label:"thumbnails"}),A=Array.prototype.find.call((a=p?.cues)!=null?a:[],(g,f,u)=>f===0?g.endTime>l:f===u.length-1?g.startTime<=l:g.startTime<=l&&g.endTime>l);if(A){const g=/'^(?:[a-z]+:)?\/\//i.test(A.text)||(s=n?.querySelector('track[label="thumbnails"]'))==null?void 0:s.src,f=new URL(A.text,g);_=new URLSearchParams(f.hash).get("#xywh").split(",").map(y=>+y),c=f.href}}const E=t.mediaDuration.get(e);let v=(r=t.mediaChaptersCues.get(e).find((p,A,g)=>A===g.length-1&&E===p.endTime?p.startTime<=l&&p.endTime>=l:p.startTime<=l&&p.endTime>l))==null?void 0:r.text;return i!=null&&v==null&&(v=""),{mediaPreviewTime:l,mediaPreviewImage:c,mediaPreviewCoords:_,mediaPreviewChapter:v}},[I.MEDIA_PAUSE_REQUEST](t,e){t["mediaPaused"].set(!0,e)},[I.MEDIA_PLAY_REQUEST](t,e){var i,a,s,r;const n="mediaPaused",c=t.mediaStreamType.get(e)===qe.LIVE,_=!((i=e.options)!=null&&i.noAutoSeekToLive),E=t.mediaTargetLiveWindow.get(e)>0;if(c&&_&&!E){const m=(a=t.mediaSeekable.get(e))==null?void 0:a[1];if(m){const v=(r=(s=e.options)==null?void 0:s.seekToLiveOffset)!=null?r:0,p=m-v;t.mediaCurrentTime.set(p,e)}}t[n].set(!1,e)},[I.MEDIA_PLAYBACK_RATE_REQUEST](t,e,{detail:i}){const a="mediaPlaybackRate",s=i;t[a].set(s,e)},[I.MEDIA_MUTE_REQUEST](t,e){t["mediaMuted"].set(!0,e)},[I.MEDIA_UNMUTE_REQUEST](t,e){const i="mediaMuted";t.mediaVolume.get(e)||t.mediaVolume.set(.25,e),t[i].set(!1,e)},[I.MEDIA_LOOP_REQUEST](t,e,{detail:i}){const a="mediaLoop",s=!!i;return t[a].set(s,e),{mediaLoop:s}},[I.MEDIA_VOLUME_REQUEST](t,e,{detail:i}){const a="mediaVolume",s=i;s&&t.mediaMuted.get(e)&&t.mediaMuted.set(!1,e),t[a].set(s,e)},[I.MEDIA_SEEK_REQUEST](t,e,{detail:i}){const a="mediaCurrentTime",s=i;t[a].set(s,e)},[I.MEDIA_SEEK_TO_LIVE_REQUEST](t,e){var i,a,s;const r="mediaCurrentTime",n=(i=t.mediaSeekable.get(e))==null?void 0:i[1];if(Number.isNaN(Number(n)))return;const l=(s=(a=e.options)==null?void 0:a.seekToLiveOffset)!=null?s:0,c=n-l;t[r].set(c,e)},[I.MEDIA_SHOW_SUBTITLES_REQUEST](t,e,{detail:i}){var a;const{options:s}=e,r=Sa(e),n=ro(i),l=(a=n[0])==null?void 0:a.language;l&&!s.noSubtitlesLangPref&&h.localStorage.setItem("media-chrome-pref-subtitles-lang",l),Ti(Xt.SHOWING,r,n)},[I.MEDIA_DISABLE_SUBTITLES_REQUEST](t,e,{detail:i}){const a=Sa(e),s=i??[];Ti(Xt.DISABLED,a,s)},[I.MEDIA_TOGGLE_SUBTITLES_REQUEST](t,e,{detail:i}){uo(e,i)},[I.MEDIA_RENDITION_REQUEST](t,e,{detail:i}){const a="mediaRenditionSelected",s=i;t[a].set(s,e)},[I.MEDIA_AUDIO_TRACK_REQUEST](t,e,{detail:i}){const a="mediaAudioTrackEnabled",s=i;t[a].set(s,e)},[I.MEDIA_ENTER_PIP_REQUEST](t,e){const i="mediaIsPip";t.mediaIsFullscreen.get(e)&&t.mediaIsFullscreen.set(!1,e),t[i].set(!0,e)},[I.MEDIA_EXIT_PIP_REQUEST](t,e){t["mediaIsPip"].set(!1,e)},[I.MEDIA_ENTER_FULLSCREEN_REQUEST](t,e,i){const a="mediaIsFullscreen";t.mediaIsPip.get(e)&&t.mediaIsPip.set(!1,e),t[a].set(!0,e,i)},[I.MEDIA_EXIT_FULLSCREEN_REQUEST](t,e){t["mediaIsFullscreen"].set(!1,e)},[I.MEDIA_ENTER_CAST_REQUEST](t,e){const i="mediaIsCasting";t.mediaIsFullscreen.get(e)&&t.mediaIsFullscreen.set(!1,e),t[i].set(!0,e)},[I.MEDIA_EXIT_CAST_REQUEST](t,e){t["mediaIsCasting"].set(!1,e)},[I.MEDIA_AIRPLAY_REQUEST](t,e){t["mediaIsAirplaying"].set(!0,e)}},mc=({media:t,fullscreenElement:e,documentElement:i,stateMediator:a=mi,requestMap:s=hc,options:r={},monitorStateOwnersOnlyWithSubscriptions:n=!0})=>{const l=[],c={options:{...r}};let _=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0});const E=g=>{g!=null&&(ir(g,_)||(_=Object.freeze({..._,...g}),l.forEach(f=>f(_))))},m=()=>{const g=Object.entries(a).reduce((f,[u,{get:y}])=>(f[u]=y(c),f),{});E(g)},v={};let p;const A=async(g,f)=>{var u,y,T,S,x,$,ue,me,be,P,B,de,ze,Le,Qe,pe;const Ae=!!p;if(p={...c,...p??{},...g},Ae)return;await dc(...Object.values(g));const X=l.length>0&&f===0&&n,We=c.media!==p.media,It=((u=c.media)==null?void 0:u.textTracks)!==((y=p.media)==null?void 0:y.textTracks),lt=((T=c.media)==null?void 0:T.videoRenditions)!==((S=p.media)==null?void 0:S.videoRenditions),rs=((x=c.media)==null?void 0:x.audioTracks)!==(($=p.media)==null?void 0:$.audioTracks),wt=((ue=c.media)==null?void 0:ue.remote)!==((me=p.media)==null?void 0:me.remote),dt=c.documentElement!==p.documentElement,je=!!c.media&&(We||X),ct=!!((be=c.media)!=null&&be.textTracks)&&(It||X),j=!!((P=c.media)!=null&&P.videoRenditions)&&(lt||X),ut=!!((B=c.media)!=null&&B.audioTracks)&&(rs||X),ri=!!((de=c.media)!=null&&de.remote)&&(wt||X),Re=!!c.documentElement&&(dt||X),Ui=je||ct||j||ut||ri||Re,kt=l.length===0&&f===1&&n,_r=!!p.media&&(We||kt),br=!!((ze=p.media)!=null&&ze.textTracks)&&(It||kt),Ar=!!((Le=p.media)!=null&&Le.videoRenditions)&&(lt||kt),yr=!!((Qe=p.media)!=null&&Qe.audioTracks)&&(rs||kt),Tr=!!((pe=p.media)!=null&&pe.remote)&&(wt||kt),Sr=!!p.documentElement&&(dt||kt),Ir=_r||br||Ar||yr||Tr||Sr;if(!(Ui||Ir)){Object.entries(p).forEach(([F,ni])=>{c[F]=ni}),m(),p=void 0;return}Object.entries(a).forEach(([F,{get:ni,mediaEvents:Xo=[],textTracksEvents:Jo=[],videoRenditionsEvents:el=[],audioTracksEvents:tl=[],remoteEvents:il=[],rootEvents:al=[],stateOwnersUpdateHandlers:sl=[]}])=>{v[F]||(v[F]={});const ve=V=>{const Q=ni(c,V);E({[F]:Q})};let te;te=v[F].mediaEvents,Xo.forEach(V=>{te&&je&&(c.media.removeEventListener(V,te),v[F].mediaEvents=void 0),_r&&(p.media.addEventListener(V,ve),v[F].mediaEvents=ve)}),te=v[F].textTracksEvents,Jo.forEach(V=>{var Q,Ie;te&&ct&&((Q=c.media.textTracks)==null||Q.removeEventListener(V,te),v[F].textTracksEvents=void 0),br&&((Ie=p.media.textTracks)==null||Ie.addEventListener(V,ve),v[F].textTracksEvents=ve)}),te=v[F].videoRenditionsEvents,el.forEach(V=>{var Q,Ie;te&&j&&((Q=c.media.videoRenditions)==null||Q.removeEventListener(V,te),v[F].videoRenditionsEvents=void 0),Ar&&((Ie=p.media.videoRenditions)==null||Ie.addEventListener(V,ve),v[F].videoRenditionsEvents=ve)}),te=v[F].audioTracksEvents,tl.forEach(V=>{var Q,Ie;te&&ut&&((Q=c.media.audioTracks)==null||Q.removeEventListener(V,te),v[F].audioTracksEvents=void 0),yr&&((Ie=p.media.audioTracks)==null||Ie.addEventListener(V,ve),v[F].audioTracksEvents=ve)}),te=v[F].remoteEvents,il.forEach(V=>{var Q,Ie;te&&ri&&((Q=c.media.remote)==null||Q.removeEventListener(V,te),v[F].remoteEvents=void 0),Tr&&((Ie=p.media.remote)==null||Ie.addEventListener(V,ve),v[F].remoteEvents=ve)}),te=v[F].rootEvents,al.forEach(V=>{te&&Re&&(c.documentElement.removeEventListener(V,te),v[F].rootEvents=void 0),Sr&&(p.documentElement.addEventListener(V,ve),v[F].rootEvents=ve)});const $i=v[F].stateOwnersUpdateHandlers;if($i&&Ui&&(Array.isArray($i)?$i:[$i]).forEach(Q=>{typeof Q=="function"&&Q()}),Ir){const V=sl.map(Q=>Q(ve,p)).filter(Q=>typeof Q=="function");v[F].stateOwnersUpdateHandlers=V.length===1?V[0]:V}else Ui&&(v[F].stateOwnersUpdateHandlers=void 0)}),Object.entries(p).forEach(([F,ni])=>{c[F]=ni}),m(),p=void 0};return A({media:t,fullscreenElement:e,documentElement:i,options:r}),{dispatch(g){const{type:f,detail:u}=g;if(s[f]&&_.mediaErrorCode==null){E(s[f](a,c,g));return}f==="mediaelementchangerequest"?A({media:u}):f==="fullscreenelementchangerequest"?A({fullscreenElement:u}):f==="documentelementchangerequest"?A({documentElement:u}):f==="optionschangerequest"&&(Object.entries(u??{}).forEach(([y,T])=>{c.options[y]=T}),m())},getState(){return _},subscribe(g){return A({},l.length+1),l.push(g),g(_),()=>{const f=l.indexOf(g);f>=0&&(A({},l.length-1),l.splice(f,1))}}}};var ar=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},M=(t,e,i)=>(ar(t,e,"read from private field"),i?i.call(t):e.get(t)),ye=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},De=(t,e,i,a)=>(ar(t,e,"write to private field"),e.set(t,i),i),Be=(t,e,i)=>(ar(t,e,"access private method"),i),st,pi,N,gt,vi,Pe,Ji,Ei,ea,Ts,_t,Jt,ta,Ss,Is,ho;const mo=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"," ","f","m","k","c","l","j",">","<","p"],Vr=10,Wr=.025,jr=.25,pc=.25,vc=2,b={DEFAULT_SUBTITLES:"defaultsubtitles",DEFAULT_STREAM_TYPE:"defaultstreamtype",DEFAULT_DURATION:"defaultduration",FULLSCREEN_ELEMENT:"fullscreenelement",HOTKEYS:"hotkeys",KEYBOARD_BACKWARD_SEEK_OFFSET:"keyboardbackwardseekoffset",KEYBOARD_FORWARD_SEEK_OFFSET:"keyboardforwardseekoffset",KEYBOARD_DOWN_VOLUME_STEP:"keyboarddownvolumestep",KEYBOARD_UP_VOLUME_STEP:"keyboardupvolumestep",KEYS_USED:"keysused",LANG:"lang",LOOP:"loop",LIVE_EDGE_OFFSET:"liveedgeoffset",NO_AUTO_SEEK_TO_LIVE:"noautoseektolive",NO_DEFAULT_STORE:"nodefaultstore",NO_HOTKEYS:"nohotkeys",NO_MUTED_PREF:"nomutedpref",NO_SUBTITLES_LANG_PREF:"nosubtitleslangpref",NO_VOLUME_PREF:"novolumepref",SEEK_TO_LIVE_OFFSET:"seektoliveoffset"};let po=class extends Oi{constructor(){super(),ye(this,ea),ye(this,_t),ye(this,ta),ye(this,Is),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,ye(this,st,new io(this,b.HOTKEYS)),ye(this,pi,void 0),ye(this,N,void 0),ye(this,gt,null),ye(this,vi,void 0),ye(this,Pe,void 0),ye(this,Ji,i=>{var a;(a=M(this,N))==null||a.dispatch(i)}),ye(this,Ei,void 0),this.associateElement(this);let e={};De(this,vi,i=>{Object.entries(i).forEach(([a,s])=>{if(a in e&&e[a]===s)return;this.propagateMediaState(a,s);const r=a.toLowerCase(),n=new h.CustomEvent(vd[r],{composed:!0,detail:s});this.dispatchEvent(n)}),e=i}),this.hasAttribute(b.NO_HOTKEYS)?this.disableHotkeys():this.enableHotkeys()}static get observedAttributes(){return super.observedAttributes.concat(b.NO_HOTKEYS,b.HOTKEYS,b.DEFAULT_STREAM_TYPE,b.DEFAULT_SUBTITLES,b.DEFAULT_DURATION,b.NO_MUTED_PREF,b.NO_VOLUME_PREF,b.LANG,b.LOOP)}get mediaStore(){return M(this,N)}set mediaStore(e){var i,a;if(M(this,N)&&((i=M(this,Pe))==null||i.call(this),De(this,Pe,void 0)),De(this,N,e),!M(this,N)&&!this.hasAttribute(b.NO_DEFAULT_STORE)){Be(this,ea,Ts).call(this);return}De(this,Pe,(a=M(this,N))==null?void 0:a.subscribe(M(this,vi)))}get fullscreenElement(){var e;return(e=M(this,pi))!=null?e:this}set fullscreenElement(e){var i;this.hasAttribute(b.FULLSCREEN_ELEMENT)&&this.removeAttribute(b.FULLSCREEN_ELEMENT),De(this,pi,e),(i=M(this,N))==null||i.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}get defaultSubtitles(){return C(this,b.DEFAULT_SUBTITLES)}set defaultSubtitles(e){D(this,b.DEFAULT_SUBTITLES,e)}get defaultStreamType(){return G(this,b.DEFAULT_STREAM_TYPE)}set defaultStreamType(e){q(this,b.DEFAULT_STREAM_TYPE,e)}get defaultDuration(){return K(this,b.DEFAULT_DURATION)}set defaultDuration(e){se(this,b.DEFAULT_DURATION,e)}get noHotkeys(){return C(this,b.NO_HOTKEYS)}set noHotkeys(e){D(this,b.NO_HOTKEYS,e)}get keysUsed(){return G(this,b.KEYS_USED)}set keysUsed(e){q(this,b.KEYS_USED,e)}get liveEdgeOffset(){return K(this,b.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){se(this,b.LIVE_EDGE_OFFSET,e)}get noAutoSeekToLive(){return C(this,b.NO_AUTO_SEEK_TO_LIVE)}set noAutoSeekToLive(e){D(this,b.NO_AUTO_SEEK_TO_LIVE,e)}get noVolumePref(){return C(this,b.NO_VOLUME_PREF)}set noVolumePref(e){D(this,b.NO_VOLUME_PREF,e)}get noMutedPref(){return C(this,b.NO_MUTED_PREF)}set noMutedPref(e){D(this,b.NO_MUTED_PREF,e)}get noSubtitlesLangPref(){return C(this,b.NO_SUBTITLES_LANG_PREF)}set noSubtitlesLangPref(e){D(this,b.NO_SUBTITLES_LANG_PREF,e)}get noDefaultStore(){return C(this,b.NO_DEFAULT_STORE)}set noDefaultStore(e){D(this,b.NO_DEFAULT_STORE,e)}attributeChangedCallback(e,i,a){var s,r,n,l,c,_,E,m,v,p,A,g;if(super.attributeChangedCallback(e,i,a),e===b.NO_HOTKEYS)a!==i&&a===""?(this.hasAttribute(b.HOTKEYS)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):a!==i&&a===null&&this.enableHotkeys();else if(e===b.HOTKEYS)M(this,st).value=a;else if(e===b.DEFAULT_SUBTITLES&&a!==i)(s=M(this,N))==null||s.dispatch({type:"optionschangerequest",detail:{defaultSubtitles:this.hasAttribute(b.DEFAULT_SUBTITLES)}});else if(e===b.DEFAULT_STREAM_TYPE)(n=M(this,N))==null||n.dispatch({type:"optionschangerequest",detail:{defaultStreamType:(r=this.getAttribute(b.DEFAULT_STREAM_TYPE))!=null?r:void 0}});else if(e===b.LIVE_EDGE_OFFSET)(l=M(this,N))==null||l.dispatch({type:"optionschangerequest",detail:{liveEdgeOffset:this.hasAttribute(b.LIVE_EDGE_OFFSET)?+this.getAttribute(b.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(b.SEEK_TO_LIVE_OFFSET)?void 0:+this.getAttribute(b.LIVE_EDGE_OFFSET)}});else if(e===b.SEEK_TO_LIVE_OFFSET)(c=M(this,N))==null||c.dispatch({type:"optionschangerequest",detail:{seekToLiveOffset:this.hasAttribute(b.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(b.SEEK_TO_LIVE_OFFSET):void 0}});else if(e===b.NO_AUTO_SEEK_TO_LIVE)(_=M(this,N))==null||_.dispatch({type:"optionschangerequest",detail:{noAutoSeekToLive:this.hasAttribute(b.NO_AUTO_SEEK_TO_LIVE)}});else if(e===b.FULLSCREEN_ELEMENT){const f=a?(E=this.getRootNode())==null?void 0:E.getElementById(a):void 0;De(this,pi,f),(m=M(this,N))==null||m.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}else e===b.LANG&&a!==i?(Td(a),(v=M(this,N))==null||v.dispatch({type:"optionschangerequest",detail:{mediaLang:a}})):e===b.LOOP&&a!==i?(p=M(this,N))==null||p.dispatch({type:I.MEDIA_LOOP_REQUEST,detail:a!=null}):e===b.NO_VOLUME_PREF&&a!==i?(A=M(this,N))==null||A.dispatch({type:"optionschangerequest",detail:{noVolumePref:this.hasAttribute(b.NO_VOLUME_PREF)}}):e===b.NO_MUTED_PREF&&a!==i&&((g=M(this,N))==null||g.dispatch({type:"optionschangerequest",detail:{noMutedPref:this.hasAttribute(b.NO_MUTED_PREF)}}))}connectedCallback(){var e,i;!M(this,N)&&!this.hasAttribute(b.NO_DEFAULT_STORE)&&Be(this,ea,Ts).call(this),(e=M(this,N))==null||e.dispatch({type:"documentelementchangerequest",detail:ce}),super.connectedCallback(),M(this,N)&&!M(this,Pe)&&De(this,Pe,(i=M(this,N))==null?void 0:i.subscribe(M(this,vi))),M(this,Ei)!==void 0&&M(this,N)&&this.media&&setTimeout(()=>{var a,s,r;(s=(a=this.media)==null?void 0:a.textTracks)!=null&&s.length&&((r=M(this,N))==null||r.dispatch({type:I.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:M(this,Ei)}))},0),this.hasAttribute(b.NO_HOTKEYS)?this.disableHotkeys():this.enableHotkeys()}disconnectedCallback(){var e,i,a,s,r;if((e=super.disconnectedCallback)==null||e.call(this),M(this,N)){const n=M(this,N).getState();De(this,Ei,!!((i=n.mediaSubtitlesShowing)!=null&&i.length)),(a=M(this,N))==null||a.dispatch({type:"documentelementchangerequest",detail:void 0}),(s=M(this,N))==null||s.dispatch({type:I.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})}M(this,Pe)&&((r=M(this,Pe))==null||r.call(this),De(this,Pe,void 0))}mediaSetCallback(e){var i;super.mediaSetCallback(e),(i=M(this,N))==null||i.dispatch({type:"mediaelementchangerequest",detail:e}),e.hasAttribute("tabindex")||(e.tabIndex=-1)}mediaUnsetCallback(e){var i;super.mediaUnsetCallback(e),(i=M(this,N))==null||i.dispatch({type:"mediaelementchangerequest",detail:void 0})}propagateMediaState(e,i){qr(this.mediaStateReceivers,e,i)}associateElement(e){if(!e)return;const{associatedElementSubscriptions:i}=this;if(i.has(e))return;const a=this.registerMediaStateReceiver.bind(this),s=this.unregisterMediaStateReceiver.bind(this),r=Ac(e,a,s);Object.values(I).forEach(n=>{e.addEventListener(n,M(this,Ji))}),i.set(e,r)}unassociateElement(e){if(!e)return;const{associatedElementSubscriptions:i}=this;if(!i.has(e))return;i.get(e)(),i.delete(e),Object.values(I).forEach(s=>{e.removeEventListener(s,M(this,Ji))})}registerMediaStateReceiver(e){if(!e)return;const i=this.mediaStateReceivers;i.indexOf(e)>-1||(i.push(e),M(this,N)&&Object.entries(M(this,N).getState()).forEach(([s,r])=>{qr([e],s,r)}))}unregisterMediaStateReceiver(e){const i=this.mediaStateReceivers,a=i.indexOf(e);a<0||i.splice(a,1)}enableHotkeys(){this.addEventListener("keydown",Be(this,ta,Ss))}disableHotkeys(){this.removeEventListener("keydown",Be(this,ta,Ss)),this.removeEventListener("keyup",Be(this,_t,Jt))}get hotkeys(){return G(this,b.HOTKEYS)}set hotkeys(e){q(this,b.HOTKEYS,e)}keyboardShortcutHandler(e){var i,a,s,r,n,l,c,_,E;const m=e.target;if(((s=(a=(i=m.getAttribute(b.KEYS_USED))==null?void 0:i.split(" "))!=null?a:m?.keysUsed)!=null?s:[]).map(u=>u==="Space"?" ":u).filter(Boolean).includes(e.key))return;let p,A,g;if(!(M(this,st).contains(`no${e.key.toLowerCase()}`)||e.key===" "&&M(this,st).contains("nospace")||e.shiftKey&&(e.key==="/"||e.key==="?")&&M(this,st).contains("noshift+/")))switch(e.key){case" ":case"k":p=M(this,N).getState().mediaPaused?I.MEDIA_PLAY_REQUEST:I.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new h.CustomEvent(p,{composed:!0,bubbles:!0}));break;case"m":p=this.mediaStore.getState().mediaVolumeLevel==="off"?I.MEDIA_UNMUTE_REQUEST:I.MEDIA_MUTE_REQUEST,this.dispatchEvent(new h.CustomEvent(p,{composed:!0,bubbles:!0}));break;case"f":p=this.mediaStore.getState().mediaIsFullscreen?I.MEDIA_EXIT_FULLSCREEN_REQUEST:I.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new h.CustomEvent(p,{composed:!0,bubbles:!0}));break;case"c":this.dispatchEvent(new h.CustomEvent(I.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case"ArrowLeft":case"j":{const u=this.hasAttribute(b.KEYBOARD_BACKWARD_SEEK_OFFSET)?+this.getAttribute(b.KEYBOARD_BACKWARD_SEEK_OFFSET):Vr;A=Math.max(((r=this.mediaStore.getState().mediaCurrentTime)!=null?r:0)-u,0),g=new h.CustomEvent(I.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:A}),this.dispatchEvent(g);break}case"ArrowRight":case"l":{const u=this.hasAttribute(b.KEYBOARD_FORWARD_SEEK_OFFSET)?+this.getAttribute(b.KEYBOARD_FORWARD_SEEK_OFFSET):Vr;A=Math.max(((n=this.mediaStore.getState().mediaCurrentTime)!=null?n:0)+u,0),g=new h.CustomEvent(I.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:A}),this.dispatchEvent(g);break}case"ArrowUp":{const u=this.hasAttribute(b.KEYBOARD_UP_VOLUME_STEP)?+this.getAttribute(b.KEYBOARD_UP_VOLUME_STEP):Wr;A=Math.min(((l=this.mediaStore.getState().mediaVolume)!=null?l:1)+u,1),g=new h.CustomEvent(I.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:A}),this.dispatchEvent(g);break}case"ArrowDown":{const u=this.hasAttribute(b.KEYBOARD_DOWN_VOLUME_STEP)?+this.getAttribute(b.KEYBOARD_DOWN_VOLUME_STEP):Wr;A=Math.max(((c=this.mediaStore.getState().mediaVolume)!=null?c:1)-u,0),g=new h.CustomEvent(I.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:A}),this.dispatchEvent(g);break}case"<":{const u=(_=this.mediaStore.getState().mediaPlaybackRate)!=null?_:1;A=Math.max(u-jr,pc).toFixed(2),g=new h.CustomEvent(I.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:A}),this.dispatchEvent(g);break}case">":{const u=(E=this.mediaStore.getState().mediaPlaybackRate)!=null?E:1;A=Math.min(u+jr,vc).toFixed(2),g=new h.CustomEvent(I.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:A}),this.dispatchEvent(g);break}case"/":case"?":{e.shiftKey&&Be(this,Is,ho).call(this);break}case"p":{p=this.mediaStore.getState().mediaIsPip?I.MEDIA_EXIT_PIP_REQUEST:I.MEDIA_ENTER_PIP_REQUEST,g=new h.CustomEvent(p,{composed:!0,bubbles:!0}),this.dispatchEvent(g);break}}}};st=new WeakMap;pi=new WeakMap;N=new WeakMap;gt=new WeakMap;vi=new WeakMap;Pe=new WeakMap;Ji=new WeakMap;Ei=new WeakMap;ea=new WeakSet;Ts=function(){var t;this.mediaStore=mc({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(b.DEFAULT_SUBTITLES),defaultDuration:this.hasAttribute(b.DEFAULT_DURATION)?+this.getAttribute(b.DEFAULT_DURATION):void 0,defaultStreamType:(t=this.getAttribute(b.DEFAULT_STREAM_TYPE))!=null?t:void 0,liveEdgeOffset:this.hasAttribute(b.LIVE_EDGE_OFFSET)?+this.getAttribute(b.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(b.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(b.SEEK_TO_LIVE_OFFSET):this.hasAttribute(b.LIVE_EDGE_OFFSET)?+this.getAttribute(b.LIVE_EDGE_OFFSET):void 0,noAutoSeekToLive:this.hasAttribute(b.NO_AUTO_SEEK_TO_LIVE),noVolumePref:this.hasAttribute(b.NO_VOLUME_PREF),noMutedPref:this.hasAttribute(b.NO_MUTED_PREF),noSubtitlesLangPref:this.hasAttribute(b.NO_SUBTITLES_LANG_PREF)}})};_t=new WeakSet;Jt=function(t){const{key:e,shiftKey:i}=t;if(!(i&&(e==="/"||e==="?")||mo.includes(e))){this.removeEventListener("keyup",Be(this,_t,Jt));return}this.keyboardShortcutHandler(t)};ta=new WeakSet;Ss=function(t){var e;const{metaKey:i,altKey:a,key:s,shiftKey:r}=t,n=r&&(s==="/"||s==="?");if(n&&((e=M(this,gt))!=null&&e.open)){this.removeEventListener("keyup",Be(this,_t,Jt));return}if(i||a||!n&&!mo.includes(s)){this.removeEventListener("keyup",Be(this,_t,Jt));return}const l=t.target,c=l instanceof HTMLElement&&(l.tagName.toLowerCase()==="media-volume-range"||l.tagName.toLowerCase()==="media-time-range");[" ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(s)&&!(M(this,st).contains(`no${s.toLowerCase()}`)||s===" "&&M(this,st).contains("nospace"))&&!c&&t.preventDefault(),this.addEventListener("keyup",Be(this,_t,Jt),{once:!0})};Is=new WeakSet;ho=function(){M(this,gt)||(De(this,gt,ce.createElement("media-keyboard-shortcuts-dialog")),this.appendChild(M(this,gt))),M(this,gt).open=!0};const Ec=Object.values(o),fc=Object.values(Pn),vo=t=>{var e,i,a,s;let{observedAttributes:r}=t.constructor;!r&&((e=t.nodeName)!=null&&e.includes("-"))&&(h.customElements.upgrade(t),{observedAttributes:r}=t.constructor);const n=(s=(a=(i=t?.getAttribute)==null?void 0:i.call(t,H.MEDIA_CHROME_ATTRIBUTES))==null?void 0:a.split)==null?void 0:s.call(a,/\s+/);return Array.isArray(r||n)?(r||n).filter(l=>Ec.includes(l)):[]},gc=t=>{var e,i;return(e=t.nodeName)!=null&&e.includes("-")&&h.customElements.get((i=t.nodeName)==null?void 0:i.toLowerCase())&&!(t instanceof h.customElements.get(t.nodeName.toLowerCase()))&&h.customElements.upgrade(t),fc.some(a=>a in t)},ws=t=>gc(t)||!!vo(t).length,Kr=t=>{var e;return(e=t?.join)==null?void 0:e.call(t,":")},Gr={[o.MEDIA_SUBTITLES_LIST]:ys,[o.MEDIA_SUBTITLES_SHOWING]:ys,[o.MEDIA_SEEKABLE]:Kr,[o.MEDIA_BUFFERED]:t=>t?.map(Kr).join(" "),[o.MEDIA_PREVIEW_COORDS]:t=>t?.join(" "),[o.MEDIA_RENDITION_LIST]:fd,[o.MEDIA_AUDIO_TRACK_LIST]:_d},_c=async(t,e,i)=>{var a,s;if(t.isConnected||await On(0),typeof i=="boolean"||i==null)return D(t,e,i);if(typeof i=="number")return se(t,e,i);if(typeof i=="string")return q(t,e,i);if(Array.isArray(i)&&!i.length)return t.removeAttribute(e);const r=(s=(a=Gr[e])==null?void 0:a.call(Gr,i))!=null?s:i;return t.setAttribute(e,r)},bc=t=>{var e;return!!((e=t.closest)!=null&&e.call(t,'*[slot="media"]'))},pt=(t,e)=>{if(bc(t))return;const i=(s,r)=>{var n,l;ws(s)&&r(s);const{children:c=[]}=s??{},_=(l=(n=s?.shadowRoot)==null?void 0:n.children)!=null?l:[];[...c,..._].forEach(m=>pt(m,r))},a=t?.nodeName.toLowerCase();if(a.includes("-")&&!ws(t)){h.customElements.whenDefined(a).then(()=>{i(t,e)});return}i(t,e)},qr=(t,e,i)=>{t.forEach(a=>{if(e in a){a[e]=i;return}const s=vo(a),r=e.toLowerCase();s.includes(r)&&_c(a,r,i)})},Ac=(t,e,i)=>{pt(t,e);const a=E=>{var m;const v=(m=E?.composedPath()[0])!=null?m:E.target;e(v)},s=E=>{var m;const v=(m=E?.composedPath()[0])!=null?m:E.target;i(v)};t.addEventListener(I.REGISTER_MEDIA_STATE_RECEIVER,a),t.addEventListener(I.UNREGISTER_MEDIA_STATE_RECEIVER,s);const r=E=>{E.forEach(m=>{const{addedNodes:v=[],removedNodes:p=[],type:A,target:g,attributeName:f}=m;A==="childList"?(Array.prototype.forEach.call(v,u=>pt(u,e)),Array.prototype.forEach.call(p,u=>pt(u,i))):A==="attributes"&&f===H.MEDIA_CHROME_ATTRIBUTES&&(ws(g)?e(g):i(g))})};let n=[];const l=E=>{const m=E.target;m.name!=="media"&&(n.forEach(v=>pt(v,i)),n=[...m.assignedElements({flatten:!0})],n.forEach(v=>pt(v,e)))};t.addEventListener("slotchange",l);const c=new MutationObserver(r);return c.observe(t,{childList:!0,attributes:!0,subtree:!0}),()=>{pt(t,i),t.removeEventListener("slotchange",l),c.disconnect(),t.removeEventListener(I.REGISTER_MEDIA_STATE_RECEIVER,a),t.removeEventListener(I.UNREGISTER_MEDIA_STATE_RECEIVER,s)}};h.customElements.get("media-controller")||h.customElements.define("media-controller",po);var yc=po;const Lt={PLACEMENT:"placement",BOUNDS:"bounds"};function Tc(t){return`
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
        position: relative;
        pointer-events: none;
        display: var(--media-tooltip-display, inline-flex);
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        z-index: var(--media-tooltip-z-index, 1);
        background: var(--_tooltip-background);
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        font: var(--media-font,
          var(--media-font-weight, 400)
          var(--media-font-size, 13px) /
          var(--media-text-content-height, var(--media-control-height, 18px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        padding: var(--media-tooltip-padding, .35em .7em);
        border: var(--media-tooltip-border, none);
        border-radius: var(--media-tooltip-border-radius, 5px);
        filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
        white-space: var(--media-tooltip-white-space, nowrap);
      }

      :host([hidden]) {
        display: none;
      }

      img, svg {
        display: inline-block;
      }

      #arrow {
        position: absolute;
        width: 0px;
        height: 0px;
        border-style: solid;
        display: var(--media-tooltip-arrow-display, block);
      }

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `}class Fa extends h.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{var e;if(!Yn(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;const i=this.placement;if(i==="left"||i==="right"){this.style.removeProperty("--media-tooltip-offset-x");return}const a=getComputedStyle(this),s=(e=Ni(this,"#"+this.bounds))!=null?e:wd(this);if(!s)return;const{x:r,width:n}=s.getBoundingClientRect(),{x:l,width:c}=this.getBoundingClientRect(),_=l+c,E=r+n,m=a.getPropertyValue("--media-tooltip-offset-x"),v=m?parseFloat(m.replace("px","")):0,p=a.getPropertyValue("--media-tooltip-container-margin"),A=p?parseFloat(p.replace("px","")):0,g=l-r+v-A,f=_-E+v+A;if(g<0){this.style.setProperty("--media-tooltip-offset-x",`${g}px`);return}if(f>0){this.style.setProperty("--media-tooltip-offset-x",`${f}px`);return}this.style.removeProperty("--media-tooltip-offset-x")},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=Me(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector("#arrow"),Object.prototype.hasOwnProperty.call(this,"placement")){const e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[Lt.PLACEMENT,Lt.BOUNDS]}get placement(){return G(this,Lt.PLACEMENT)}set placement(e){q(this,Lt.PLACEMENT,e)}get bounds(){return G(this,Lt.BOUNDS)}set bounds(e){q(this,Lt.BOUNDS,e)}}Fa.shadowRootOptions={mode:"open"};Fa.getTemplateHTML=Tc;h.customElements.get("media-tooltip")||h.customElements.define("media-tooltip",Fa);var ks=Fa,sr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Z=(t,e,i)=>(sr(t,e,"read from private field"),i?i.call(t):e.get(t)),Rt=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Vi=(t,e,i,a)=>(sr(t,e,"write to private field"),e.set(t,i),i),Sc=(t,e,i)=>(sr(t,e,"access private method"),i),Ne,Zt,rt,$t,ia,Ms,Eo;const Xe={TOOLTIP_PLACEMENT:"tooltipplacement",DISABLED:"disabled",NO_TOOLTIP:"notooltip"};function Ic(t,e={}){return`
    <style>
      :host {
        position: relative;
        font: var(--media-font,
          var(--media-font-weight, bold)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        padding: var(--media-button-padding, var(--media-control-padding, 10px));
        justify-content: var(--media-button-justify-content, center);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        transition: background .15s linear;
        pointer-events: auto;
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }
      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgba(50 50 70 / .7));
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-button-icon-width);
        height: var(--media-button-icon-height, var(--media-control-height, 24px));
        transform: var(--media-button-icon-transform);
        transition: var(--media-button-icon-transition);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
      }

      media-tooltip {
        
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(t,e)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${ks.shadowRootOptions.mode}">
          ${ks.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(t)}
        </slot>
      </media-tooltip>
    </slot>
  `}function wc(t,e){return`
    <slot></slot>
  `}function kc(){return""}class re extends h.HTMLElement{constructor(){if(super(),Rt(this,Ms),Rt(this,Ne,void 0),this.preventClick=!1,this.tooltipEl=null,Rt(this,Zt,e=>{this.preventClick||this.handleClick(e),setTimeout(Z(this,rt),0)}),Rt(this,rt,()=>{var e,i;(i=(e=this.tooltipEl)==null?void 0:e.updateXOffset)==null||i.call(e)}),Rt(this,$t,e=>{const{key:i}=e;if(!this.keysUsed.includes(i)){this.removeEventListener("keyup",Z(this,$t));return}this.preventClick||this.handleClick(e)}),Rt(this,ia,e=>{const{metaKey:i,altKey:a,key:s}=e;if(i||a||!this.keysUsed.includes(s)){this.removeEventListener("keyup",Z(this,$t));return}this.addEventListener("keyup",Z(this,$t),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=Me(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",Xe.TOOLTIP_PLACEMENT,H.MEDIA_CONTROLLER,o.MEDIA_LANG]}enable(){this.addEventListener("click",Z(this,Zt)),this.addEventListener("keydown",Z(this,ia)),this.tabIndex=0}disable(){this.removeEventListener("click",Z(this,Zt)),this.removeEventListener("keydown",Z(this,ia)),this.removeEventListener("keyup",Z(this,$t)),this.tabIndex=-1}attributeChangedCallback(e,i,a){var s,r,n,l,c;e===H.MEDIA_CONTROLLER?(i&&((r=(s=Z(this,Ne))==null?void 0:s.unassociateElement)==null||r.call(s,this),Vi(this,Ne,null)),a&&this.isConnected&&(Vi(this,Ne,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(l=Z(this,Ne))==null?void 0:l.associateElement)==null||c.call(l,this))):e==="disabled"&&a!==i?a==null?this.enable():this.disable():e===Xe.TOOLTIP_PLACEMENT&&this.tooltipEl&&a!==i?this.tooltipEl.placement=a:e===o.MEDIA_LANG&&(this.shadowRoot.querySelector('slot[name="tooltip-content"]').innerHTML=this.constructor.getTooltipContentHTML()),Z(this,rt).call(this)}connectedCallback(){var e,i,a;const{style:s}=ee(this.shadowRoot,":host");s.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")?this.disable():this.enable(),this.setAttribute("role","button");const r=this.getAttribute(H.MEDIA_CONTROLLER);r&&(Vi(this,Ne,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=Z(this,Ne))==null?void 0:i.associateElement)==null||a.call(i,this)),h.customElements.whenDefined("media-tooltip").then(()=>Sc(this,Ms,Eo).call(this))}disconnectedCallback(){var e,i;this.disable(),(i=(e=Z(this,Ne))==null?void 0:e.unassociateElement)==null||i.call(e,this),Vi(this,Ne,null),this.removeEventListener("mouseenter",Z(this,rt)),this.removeEventListener("focus",Z(this,rt)),this.removeEventListener("click",Z(this,Zt))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return G(this,Xe.TOOLTIP_PLACEMENT)}set tooltipPlacement(e){q(this,Xe.TOOLTIP_PLACEMENT,e)}get mediaController(){return G(this,H.MEDIA_CONTROLLER)}set mediaController(e){q(this,H.MEDIA_CONTROLLER,e)}get disabled(){return C(this,Xe.DISABLED)}set disabled(e){D(this,Xe.DISABLED,e)}get noTooltip(){return C(this,Xe.NO_TOOLTIP)}set noTooltip(e){D(this,Xe.NO_TOOLTIP,e)}handleClick(e){}}Ne=new WeakMap;Zt=new WeakMap;rt=new WeakMap;$t=new WeakMap;ia=new WeakMap;Ms=new WeakSet;Eo=function(){this.addEventListener("mouseenter",Z(this,rt)),this.addEventListener("focus",Z(this,rt)),this.addEventListener("click",Z(this,Zt));const t=this.tooltipPlacement;t&&this.tooltipEl&&(this.tooltipEl.placement=t)};re.shadowRootOptions={mode:"open"};re.getTemplateHTML=Ic;re.getSlotTemplateHTML=wc;re.getTooltipContentHTML=kc;h.customElements.get("media-chrome-button")||h.customElements.define("media-chrome-button",re);var Mc=re;const Yr=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`;function Lc(t){return`
    <style>
      :host([${o.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${o.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Yr}</slot>
      <slot name="exit">${Yr}</slot>
    </slot>
  `}function Rc(){return`
    <slot name="tooltip-enter">${k("start airplay")}</slot>
    <slot name="tooltip-exit">${k("stop airplay")}</slot>
  `}const zr=t=>{const e=t.mediaIsAirplaying?k("stop airplay"):k("start airplay");t.setAttribute("aria-label",e)};class Ba extends re{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_AIRPLAYING,o.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),zr(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_AIRPLAYING&&zr(this)}get mediaIsAirplaying(){return C(this,o.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){D(this,o.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return G(this,o.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){q(this,o.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){const e=new h.CustomEvent(I.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}}Ba.getSlotTemplateHTML=Lc;Ba.getTooltipContentHTML=Rc;h.customElements.get("media-airplay-button")||h.customElements.define("media-airplay-button",Ba);var xc=Ba;const Cc=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,Dc=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;function Pc(t){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-checked="true"]) slot[name=tooltip-enable],
      :host(:not([aria-checked="true"])) slot[name=tooltip-disable] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${Cc}</slot>
      <slot name="off">${Dc}</slot>
    </slot>
  `}function Nc(){return`
    <slot name="tooltip-enable">${k("Enable captions")}</slot>
    <slot name="tooltip-disable">${k("Disable captions")}</slot>
  `}const Qr=t=>{t.setAttribute("aria-checked",Kd(t).toString())};class Va extends re{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_SUBTITLES_LIST,o.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","switch"),this.setAttribute("aria-label",k("closed captions")),Qr(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_SUBTITLES_SHOWING&&Qr(this)}get mediaSubtitlesList(){return Zr(this,o.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){Xr(this,o.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return Zr(this,o.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){Xr(this,o.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new h.CustomEvent(I.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}}Va.getSlotTemplateHTML=Pc;Va.getTooltipContentHTML=Nc;const Zr=(t,e)=>{const i=t.getAttribute(e);return i?so(i):[]},Xr=(t,e,i)=>{if(!i?.length){t.removeAttribute(e);return}const a=ys(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};h.customElements.get("media-captions-button")||h.customElements.define("media-captions-button",Va);var Oc=Va;const Uc='<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg>',$c='<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>';function Hc(t){return`
    <style>
      :host([${o.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${o.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Uc}</slot>
      <slot name="exit">${$c}</slot>
    </slot>
  `}function Fc(){return`
    <slot name="tooltip-enter">${k("Start casting")}</slot>
    <slot name="tooltip-exit">${k("Stop casting")}</slot>
  `}const Jr=t=>{const e=t.mediaIsCasting?k("stop casting"):k("start casting");t.setAttribute("aria-label",e)};class Wa extends re{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_CASTING,o.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),Jr(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_CASTING&&Jr(this)}get mediaIsCasting(){return C(this,o.MEDIA_IS_CASTING)}set mediaIsCasting(e){D(this,o.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return G(this,o.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){q(this,o.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){const e=this.mediaIsCasting?I.MEDIA_EXIT_CAST_REQUEST:I.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new h.CustomEvent(e,{composed:!0,bubbles:!0}))}}Wa.getSlotTemplateHTML=Hc;Wa.getTooltipContentHTML=Fc;h.customElements.get("media-cast-button")||h.customElements.define("media-cast-button",Wa);var Bc=Wa,rr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},bt=(t,e,i)=>(rr(t,e,"read from private field"),e.get(t)),Ke=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},nr=(t,e,i,a)=>(rr(t,e,"write to private field"),e.set(t,i),i),ht=(t,e,i)=>(rr(t,e,"access private method"),i),wa,Ri,yt,aa,Ls,Rs,fo,xs,go,Cs,_o,Ds,bo,Ps,Ao;function Vc(t){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        display: var(--media-dialog-display, inline-flex);
        justify-content: center;
        align-items: center;
        
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
    ${this.getSlotTemplateHTML(t)}
  `}function Wc(t){return`
    <slot id="content"></slot>
  `}const li={OPEN:"open",ANCHOR:"anchor"};class Tt extends h.HTMLElement{constructor(){super(),Ke(this,aa),Ke(this,Rs),Ke(this,xs),Ke(this,Cs),Ke(this,Ds),Ke(this,Ps),Ke(this,wa,!1),Ke(this,Ri,null),Ke(this,yt,null),this.addEventListener("invoke",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this)}static get observedAttributes(){return[li.OPEN,li.ANCHOR]}get open(){return C(this,li.OPEN)}set open(e){D(this,li.OPEN,e)}handleEvent(e){switch(e.type){case"invoke":ht(this,Cs,_o).call(this,e);break;case"focusout":ht(this,Ds,bo).call(this,e);break;case"keydown":ht(this,Ps,Ao).call(this,e);break}}connectedCallback(){ht(this,aa,Ls).call(this),this.role||(this.role="dialog")}attributeChangedCallback(e,i,a){ht(this,aa,Ls).call(this),e===li.OPEN&&a!==i&&(this.open?ht(this,Rs,fo).call(this):ht(this,xs,go).call(this))}focus(){nr(this,Ri,qn());const e=!this.dispatchEvent(new Event("focus",{composed:!0,cancelable:!0})),i=!this.dispatchEvent(new Event("focusin",{composed:!0,bubbles:!0,cancelable:!0}));if(e||i)return;const a=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');a?.focus()}get keysUsed(){return["Escape","Tab"]}}wa=new WeakMap;Ri=new WeakMap;yt=new WeakMap;aa=new WeakSet;Ls=function(){if(!bt(this,wa)&&(nr(this,wa,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);const t=Me(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(t),queueMicrotask(()=>{const{style:e}=ee(this.shadowRoot,":host");e.setProperty("transition","display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in")})}};Rs=new WeakSet;fo=function(){var t;(t=bt(this,yt))==null||t.setAttribute("aria-expanded","true"),this.dispatchEvent(new Event("open",{composed:!0,bubbles:!0})),this.addEventListener("transitionend",()=>this.focus(),{once:!0})};xs=new WeakSet;go=function(){var t;(t=bt(this,yt))==null||t.setAttribute("aria-expanded","false"),this.dispatchEvent(new Event("close",{composed:!0,bubbles:!0}))};Cs=new WeakSet;_o=function(t){nr(this,yt,t.relatedTarget),ai(this,t.relatedTarget)||(this.open=!this.open)};Ds=new WeakSet;bo=function(t){var e;ai(this,t.relatedTarget)||((e=bt(this,Ri))==null||e.focus(),bt(this,yt)&&bt(this,yt)!==t.relatedTarget&&this.open&&(this.open=!1))};Ps=new WeakSet;Ao=function(t){var e,i,a,s,r;const{key:n,ctrlKey:l,altKey:c,metaKey:_}=t;l||c||_||this.keysUsed.includes(n)&&(t.preventDefault(),t.stopPropagation(),n==="Tab"?(t.shiftKey?(i=(e=this.previousElementSibling)==null?void 0:e.focus)==null||i.call(e):(s=(a=this.nextElementSibling)==null?void 0:a.focus)==null||s.call(a),this.blur()):n==="Escape"&&((r=bt(this,Ri))==null||r.focus(),this.open=!1))};Tt.shadowRootOptions={mode:"open"};Tt.getTemplateHTML=Vc;Tt.getSlotTemplateHTML=Wc;h.customElements.get("media-chrome-dialog")||h.customElements.define("media-chrome-dialog",Tt);var jc=Tt,or=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},W=(t,e,i)=>(or(t,e,"read from private field"),i?i.call(t):e.get(t)),ne=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},tt=(t,e,i,a)=>(or(t,e,"write to private field"),e.set(t,i),i),we=(t,e,i)=>(or(t,e,"access private method"),i),Oe,ja,sa,ra,ke,ka,na,oa,la,lr,yo,da,Ns,ca,Os,Ma,dr,Us,To,$s,So,Hs,Io,Fs,wo;function Kc(t){return`
    <style>
      :host {
        --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

        box-shadow: var(--_focus-visible-box-shadow, none);
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
        display: inline-flex;
        align-items: center;
        
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        width: 100px;
        transition: background .15s linear;
        cursor: var(--media-cursor, pointer);
        pointer-events: auto;
        touch-action: none; 
      }

      
      input[type=range]:focus {
        outline: 0;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgb(50 50 70 / .7));
      }

      #leftgap {
        padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      }

      #rightgap {
        padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      }

      #startpoint,
      #endpoint {
        position: absolute;
      }

      #endpoint {
        right: 0;
      }

      #container {
        
        width: var(--media-range-track-width, 100%);
        transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 40px;
      }

      #range {
        
        display: var(--media-time-range-hover-display, block);
        bottom: var(--media-time-range-hover-bottom, -7px);
        height: var(--media-time-range-hover-height, max(100% + 7px, 25px));
        width: 100%;
        position: absolute;
        cursor: var(--media-cursor, pointer);

        -webkit-appearance: none; 
        -webkit-tap-highlight-color: transparent;
        background: transparent; 
        margin: 0;
        z-index: 1;
      }

      @media (hover: hover) {
        #range {
          bottom: var(--media-time-range-hover-bottom, -5px);
          height: var(--media-time-range-hover-height, max(100% + 5px, 20px));
        }
      }

      
      
      #range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: transparent;
        width: .1px;
        height: .1px;
      }

      
      #range::-moz-range-thumb {
        background: transparent;
        border: transparent;
        width: .1px;
        height: .1px;
      }

      #appearance {
        height: var(--media-range-track-height, 4px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: absolute;
        
        will-change: transform;
      }

      #track {
        background: var(--media-range-track-background, rgb(255 255 255 / .2));
        border-radius: var(--media-range-track-border-radius, 1px);
        border: var(--media-range-track-border, none);
        outline: var(--media-range-track-outline);
        outline-offset: var(--media-range-track-outline-offset);
        backdrop-filter: var(--media-range-track-backdrop-filter);
        -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
        box-shadow: var(--media-range-track-box-shadow, none);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #progress,
      #pointer {
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #progress {
        background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
        transition: var(--media-range-track-transition);
      }

      #pointer {
        background: var(--media-range-track-pointer-background);
        border-right: var(--media-range-track-pointer-border-right);
        transition: visibility .25s, opacity .25s;
        visibility: hidden;
        opacity: 0;
      }

      @media (hover: hover) {
        :host(:hover) #pointer {
          transition: visibility .5s, opacity .5s;
          visibility: visible;
          opacity: 1;
        }
      }

      #thumb,
      ::slotted([slot=thumb]) {
        width: var(--media-range-thumb-width, 10px);
        height: var(--media-range-thumb-height, 10px);
        transition: var(--media-range-thumb-transition);
        transform: var(--media-range-thumb-transform, none);
        opacity: var(--media-range-thumb-opacity, 1);
        translate: -50%;
        position: absolute;
        left: 0;
        cursor: var(--media-cursor, pointer);
      }

      #thumb {
        border-radius: var(--media-range-thumb-border-radius, 10px);
        background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
        box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
        border: var(--media-range-thumb-border, none);
      }

      :host([disabled]) #thumb {
        background-color: #777;
      }

      .segments #appearance {
        height: var(--media-range-segment-hover-height, 7px);
      }

      #track {
        clip-path: url(#segments-clipping);
      }

      #segments {
        --segments-gap: var(--media-range-segments-gap, 2px);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      #segments-clipping {
        transform: translateX(calc(var(--segments-gap) / 2));
      }

      #segments-clipping:empty {
        display: none;
      }

      #segments-clipping rect {
        height: var(--media-range-track-height, 4px);
        y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
        transition: var(--media-range-segment-transition, transform .1s ease-in-out);
        transform: var(--media-range-segment-transform, scaleY(1));
        transform-origin: center;
      }
    </style>
    <div id="leftgap"></div>
    <div id="container">
      <div id="startpoint"></div>
      <div id="endpoint"></div>
      <div id="appearance">
        <div id="track" part="track">
          <div id="pointer"></div>
          <div id="progress" part="progress"></div>
        </div>
        <slot name="thumb">
          <div id="thumb" part="thumb"></div>
        </slot>
        <svg id="segments"><clipPath id="segments-clipping"></clipPath></svg>
      </div>
      <input id="range" type="range" min="0" max="1" step="any" value="0">

      ${this.getContainerTemplateHTML(t)}
    </div>
    <div id="rightgap"></div>
  `}function Gc(t){return""}class St extends h.HTMLElement{constructor(){if(super(),ne(this,lr),ne(this,da),ne(this,ca),ne(this,Ma),ne(this,Us),ne(this,$s),ne(this,Hs),ne(this,Fs),ne(this,Oe,void 0),ne(this,ja,void 0),ne(this,sa,void 0),ne(this,ra,void 0),ne(this,ke,{}),ne(this,ka,[]),ne(this,na,()=>{if(this.range.matches(":focus-visible")){const{style:e}=ee(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),ne(this,oa,()=>{const{style:e}=ee(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),ne(this,la,()=>{const e=this.shadowRoot.querySelector("#segments-clipping");e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=Me(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}this.container=this.shadowRoot.querySelector("#container"),tt(this,sa,this.shadowRoot.querySelector("#startpoint")),tt(this,ra,this.shadowRoot.querySelector("#endpoint")),this.range=this.shadowRoot.querySelector("#range"),this.appearance=this.shadowRoot.querySelector("#appearance")}static get observedAttributes(){return["disabled","aria-disabled",H.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var s,r,n,l,c;e===H.MEDIA_CONTROLLER?(i&&((r=(s=W(this,Oe))==null?void 0:s.unassociateElement)==null||r.call(s,this),tt(this,Oe,null)),a&&this.isConnected&&(tt(this,Oe,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(l=W(this,Oe))==null?void 0:l.associateElement)==null||c.call(l,this))):(e==="disabled"||e==="aria-disabled"&&i!==a)&&(a==null?(this.range.removeAttribute(e),we(this,da,Ns).call(this)):(this.range.setAttribute(e,a),we(this,ca,Os).call(this)))}connectedCallback(){var e,i,a;const{style:s}=ee(this.shadowRoot,":host");s.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),W(this,ke).pointer=ee(this.shadowRoot,"#pointer"),W(this,ke).progress=ee(this.shadowRoot,"#progress"),W(this,ke).thumb=ee(this.shadowRoot,'#thumb, ::slotted([slot="thumb"])'),W(this,ke).activeSegment=ee(this.shadowRoot,"#segments-clipping rect:nth-child(0)");const r=this.getAttribute(H.MEDIA_CONTROLLER);r&&(tt(this,Oe,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=W(this,Oe))==null?void 0:i.associateElement)==null||a.call(i,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",W(this,na)),this.shadowRoot.addEventListener("focusout",W(this,oa)),we(this,da,Ns).call(this),Wn(this.container,W(this,la))}disconnectedCallback(){var e,i;we(this,ca,Os).call(this),(i=(e=W(this,Oe))==null?void 0:e.unassociateElement)==null||i.call(e,this),tt(this,Oe,null),this.shadowRoot.removeEventListener("focusin",W(this,na)),this.shadowRoot.removeEventListener("focusout",W(this,oa)),jn(this.container,W(this,la))}updatePointerBar(e){var i;(i=W(this,ke).pointer)==null||i.style.setProperty("width",`${this.getPointerRatio(e)*100}%`)}updateBar(){var e,i;const a=this.range.valueAsNumber*100;(e=W(this,ke).progress)==null||e.style.setProperty("width",`${a}%`),(i=W(this,ke).thumb)==null||i.style.setProperty("left",`${a}%`)}updateSegments(e){const i=this.shadowRoot.querySelector("#segments-clipping");if(i.textContent="",this.container.classList.toggle("segments",!!e?.length),!e?.length)return;const a=[...new Set([+this.range.min,...e.flatMap(r=>[r.start,r.end]),+this.range.max])];tt(this,ka,[...a]);const s=a.pop();for(const[r,n]of a.entries()){const[l,c]=[r===0,r===a.length-1],_=l?"calc(var(--segments-gap) / -1)":`${n*100}%`,m=`calc(${((c?s:a[r+1])-n)*100}%${l||c?"":" - var(--segments-gap)"})`,v=ce.createElementNS("http://www.w3.org/2000/svg","rect"),p=zn(this.shadowRoot,`#segments-clipping rect:nth-child(${r+1})`);p.style.setProperty("x",_),p.style.setProperty("width",m),i.append(v)}}getPointerRatio(e){return Rd(e.clientX,e.clientY,W(this,sa).getBoundingClientRect(),W(this,ra).getBoundingClientRect())}get dragging(){return this.hasAttribute("dragging")}handleEvent(e){switch(e.type){case"pointermove":we(this,Fs,wo).call(this,e);break;case"input":this.updateBar();break;case"pointerenter":we(this,Us,To).call(this,e);break;case"pointerdown":we(this,Ma,dr).call(this,e);break;case"pointerup":we(this,$s,So).call(this);break;case"pointerleave":we(this,Hs,Io).call(this);break}}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}}Oe=new WeakMap;ja=new WeakMap;sa=new WeakMap;ra=new WeakMap;ke=new WeakMap;ka=new WeakMap;na=new WeakMap;oa=new WeakMap;la=new WeakMap;lr=new WeakSet;yo=function(t){const e=W(this,ke).activeSegment;if(!e)return;const i=this.getPointerRatio(t),s=`#segments-clipping rect:nth-child(${W(this,ka).findIndex((r,n,l)=>{const c=l[n+1];return c!=null&&i>=r&&i<=c})+1})`;(e.selectorText!=s||!e.style.transform)&&(e.selectorText=s,e.style.setProperty("transform","var(--media-range-segment-hover-transform, scaleY(2))"))};da=new WeakSet;Ns=function(){this.hasAttribute("disabled")||(this.addEventListener("input",this),this.addEventListener("pointerdown",this),this.addEventListener("pointerenter",this))};ca=new WeakSet;Os=function(){var t,e;this.removeEventListener("input",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointerenter",this),(t=h.window)==null||t.removeEventListener("pointerup",this),(e=h.window)==null||e.removeEventListener("pointermove",this)};Ma=new WeakSet;dr=function(t){var e;tt(this,ja,t.composedPath().includes(this.range)),(e=h.window)==null||e.addEventListener("pointerup",this)};Us=new WeakSet;To=function(t){var e;t.pointerType!=="mouse"&&we(this,Ma,dr).call(this,t),this.addEventListener("pointerleave",this),(e=h.window)==null||e.addEventListener("pointermove",this)};$s=new WeakSet;So=function(){var t;(t=h.window)==null||t.removeEventListener("pointerup",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled")};Hs=new WeakSet;Io=function(){var t,e;this.removeEventListener("pointerleave",this),(t=h.window)==null||t.removeEventListener("pointermove",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled"),(e=W(this,ke).activeSegment)==null||e.style.removeProperty("transform")};Fs=new WeakSet;wo=function(t){t.pointerType==="pen"&&t.buttons===0||(this.toggleAttribute("dragging",t.buttons===1||t.pointerType!=="mouse"),this.updatePointerBar(t),we(this,lr,yo).call(this,t),this.dragging&&(t.pointerType!=="mouse"||!W(this,ja))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(t),this.range.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))))};St.shadowRootOptions={mode:"open"};St.getTemplateHTML=Kc;St.getContainerTemplateHTML=Gc;h.customElements.get("media-chrome-range")||h.customElements.define("media-chrome-range",St);var qc=St,ko=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Wi=(t,e,i)=>(ko(t,e,"read from private field"),i?i.call(t):e.get(t)),Yc=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ji=(t,e,i,a)=>(ko(t,e,"write to private field"),e.set(t,i),i),Ue;function zc(t){return`
    <style>
      :host {
        
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `}let Ka=class extends h.HTMLElement{constructor(){if(super(),Yc(this,Ue,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=Me(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[H.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var s,r,n,l,c;e===H.MEDIA_CONTROLLER&&(i&&((r=(s=Wi(this,Ue))==null?void 0:s.unassociateElement)==null||r.call(s,this),ji(this,Ue,null)),a&&this.isConnected&&(ji(this,Ue,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(l=Wi(this,Ue))==null?void 0:l.associateElement)==null||c.call(l,this)))}connectedCallback(){var e,i,a;const s=this.getAttribute(H.MEDIA_CONTROLLER);s&&(ji(this,Ue,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=Wi(this,Ue))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Wi(this,Ue))==null?void 0:e.unassociateElement)==null||i.call(e,this),ji(this,Ue,null)}};Ue=new WeakMap;Ka.shadowRootOptions={mode:"open"};Ka.getTemplateHTML=zc;h.customElements.get("media-control-bar")||h.customElements.define("media-control-bar",Ka);var Qc=Ka,Mo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ki=(t,e,i)=>(Mo(t,e,"read from private field"),i?i.call(t):e.get(t)),Zc=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Gi=(t,e,i,a)=>(Mo(t,e,"write to private field"),e.set(t,i),i),$e;function Xc(t,e={}){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
        padding: var(--media-control-padding, 10px);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: center;
        pointer-events: auto;
      }

      
      :host(:focus-visible) {
        box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
        outline: 0;
      }

      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }
    </style>

    ${this.getSlotTemplateHTML(t,e)}
  `}function Jc(t,e){return`
    <slot></slot>
  `}class Ye extends h.HTMLElement{constructor(){if(super(),Zc(this,$e,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=Me(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[H.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var s,r,n,l,c;e===H.MEDIA_CONTROLLER&&(i&&((r=(s=Ki(this,$e))==null?void 0:s.unassociateElement)==null||r.call(s,this),Gi(this,$e,null)),a&&this.isConnected&&(Gi(this,$e,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(l=Ki(this,$e))==null?void 0:l.associateElement)==null||c.call(l,this)))}connectedCallback(){var e,i,a;const{style:s}=ee(this.shadowRoot,":host");s.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);const r=this.getAttribute(H.MEDIA_CONTROLLER);r&&(Gi(this,$e,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=Ki(this,$e))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Ki(this,$e))==null?void 0:e.unassociateElement)==null||i.call(e,this),Gi(this,$e,null)}}$e=new WeakMap;Ye.shadowRootOptions={mode:"open"};Ye.getTemplateHTML=Xc;Ye.getSlotTemplateHTML=Jc;h.customElements.get("media-text-display")||h.customElements.define("media-text-display",Ye);var eu=Ye,Lo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},en=(t,e,i)=>(Lo(t,e,"read from private field"),i?i.call(t):e.get(t)),tu=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},iu=(t,e,i,a)=>(Lo(t,e,"write to private field"),e.set(t,i),i),fi;function au(t,e){return`
    <slot>${nt(e.mediaDuration)}</slot>
  `}class cr extends Ye{constructor(){var e;super(),tu(this,fi,void 0),iu(this,fi,this.shadowRoot.querySelector("slot")),en(this,fi).textContent=nt((e=this.mediaDuration)!=null?e:0)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_DURATION]}attributeChangedCallback(e,i,a){e===o.MEDIA_DURATION&&(en(this,fi).textContent=nt(+a)),super.attributeChangedCallback(e,i,a)}get mediaDuration(){return K(this,o.MEDIA_DURATION)}set mediaDuration(e){se(this,o.MEDIA_DURATION,e)}}fi=new WeakMap;cr.getSlotTemplateHTML=au;h.customElements.get("media-duration-display")||h.customElements.define("media-duration-display",cr);var su=cr;const ru={2:k("Network Error"),3:k("Decode Error"),4:k("Source Not Supported"),5:k("Encryption Error")},nu={2:k("A network error caused the media download to fail."),3:k("A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format."),4:k("An unsupported error occurred. The server or network failed, or your browser does not support this format."),5:k("The media is encrypted and there are no keys to decrypt it.")},Ro=t=>{var e,i;return t.code===1?null:{title:(e=ru[t.code])!=null?e:`Error ${t.code}`,message:(i=nu[t.code])!=null?i:t.message}};var xo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ou=(t,e,i)=>(xo(t,e,"read from private field"),i?i.call(t):e.get(t)),lu=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},du=(t,e,i,a)=>(xo(t,e,"write to private field"),e.set(t,i),i),ua;function cu(t){return`
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${t.mediaerrorcode}" id="content">
      ${Co({code:+t.mediaerrorcode,message:t.mediaerrormessage})}
    </slot>
  `}function uu(t){return t.code&&Ro(t)!==null}function Co(t){var e;const{title:i,message:a}=(e=Ro(t))!=null?e:{};let s="";return i&&(s+=`<slot name="error-${t.code}-title"><h3>${i}</h3></slot>`),a&&(s+=`<slot name="error-${t.code}-message"><p>${a}</p></slot>`),s}const tn=[o.MEDIA_ERROR_CODE,o.MEDIA_ERROR_MESSAGE];class Ga extends Tt{constructor(){super(...arguments),lu(this,ua,null)}static get observedAttributes(){return[...super.observedAttributes,...tn]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,i,a){var s;if(super.attributeChangedCallback(e,i,a),!tn.includes(e))return;const r=(s=this.mediaError)!=null?s:{code:this.mediaErrorCode,message:this.mediaErrorMessage};this.open=uu(r),this.open&&(this.shadowRoot.querySelector("slot").name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector("#content").innerHTML=this.formatErrorMessage(r))}get mediaError(){return ou(this,ua)}set mediaError(e){du(this,ua,e)}get mediaErrorCode(){return K(this,"mediaerrorcode")}set mediaErrorCode(e){se(this,"mediaerrorcode",e)}get mediaErrorMessage(){return G(this,"mediaerrormessage")}set mediaErrorMessage(e){q(this,"mediaerrormessage",e)}}ua=new WeakMap;Ga.getSlotTemplateHTML=cu;Ga.formatErrorMessage=Co;h.customElements.get("media-error-dialog")||h.customElements.define("media-error-dialog",Ga);var hu=Ga,mu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Je=(t,e,i)=>(mu(t,e,"read from private field"),i?i.call(t):e.get(t)),an=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ht,Ft;function pu(t){return`
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: rgb(20 20 30 / .8);
        backdrop-filter: blur(10px);
      }

      #content {
        display: block;
        width: clamp(400px, 40vw, 700px);
        max-width: 90vw;
        text-align: left;
      }

      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
      }

      .shortcuts-table {
        width: 100%;
        border-collapse: collapse;
      }

      .shortcuts-table tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .shortcuts-table tr:last-child {
        border-bottom: none;
      }

      .shortcuts-table td {
        padding: 0.75rem 0.5rem;
      }

      .shortcuts-table td:first-child {
        text-align: right;
        padding-right: 1rem;
        width: 40%;
        min-width: 120px;
      }

      .shortcuts-table td:last-child {
        padding-left: 1rem;
      }

      .key {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        min-width: 1.5rem;
        text-align: center;
        margin: 0 0.2rem;
      }

      .description {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
      }

      .key-combo {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.3rem;
      }

      .key-separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
      }
    </style>
    <slot id="content">
      ${vu()}
    </slot>
  `}function vu(){return`
    <h2>Keyboard Shortcuts</h2>
    <table class="shortcuts-table">${[{keys:["Space","k"],description:"Toggle Playback"},{keys:["m"],description:"Toggle mute"},{keys:["f"],description:"Toggle fullscreen"},{keys:["c"],description:"Toggle captions or subtitles, if available"},{keys:["p"],description:"Toggle Picture in Picture"},{keys:["←","j"],description:"Seek back 10s"},{keys:["→","l"],description:"Seek forward 10s"},{keys:["↑"],description:"Turn volume up"},{keys:["↓"],description:"Turn volume down"},{keys:["< (SHIFT+,)"],description:"Decrease playback rate"},{keys:["> (SHIFT+.)"],description:"Increase playback rate"}].map(({keys:i,description:a})=>`
      <tr>
        <td>
          <div class="key-combo">${i.map((r,n)=>n>0?`<span class="key-separator">or</span><span class="key">${r}</span>`:`<span class="key">${r}</span>`).join("")}</div>
        </td>
        <td class="description">${a}</td>
      </tr>
    `).join("")}</table>
  `}class ur extends Tt{constructor(){super(...arguments),an(this,Ht,e=>{var i;if(!this.open)return;const a=(i=this.shadowRoot)==null?void 0:i.querySelector("#content");if(!a)return;const s=e.composedPath(),r=s[0]===this||s.includes(this),n=s.includes(a);r&&!n&&(this.open=!1)}),an(this,Ft,e=>{if(!this.open)return;const i=e.shiftKey&&(e.key==="/"||e.key==="?");(e.key==="Escape"||i)&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&(this.open=!1,e.preventDefault(),e.stopPropagation())})}connectedCallback(){super.connectedCallback(),this.open&&(this.addEventListener("click",Je(this,Ht)),document.addEventListener("keydown",Je(this,Ft)))}disconnectedCallback(){this.removeEventListener("click",Je(this,Ht)),document.removeEventListener("keydown",Je(this,Ft))}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e==="open"&&(this.open?(this.addEventListener("click",Je(this,Ht)),document.addEventListener("keydown",Je(this,Ft))):(this.removeEventListener("click",Je(this,Ht)),document.removeEventListener("keydown",Je(this,Ft))))}}Ht=new WeakMap;Ft=new WeakMap;ur.getSlotTemplateHTML=pu;h.customElements.get("media-keyboard-shortcuts-dialog")||h.customElements.define("media-keyboard-shortcuts-dialog",ur);var Eu=ur,Do=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},fu=(t,e,i)=>(Do(t,e,"read from private field"),e.get(t)),gu=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},_u=(t,e,i,a)=>(Do(t,e,"write to private field"),e.set(t,i),i),ha;const bu=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,Au=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`;function yu(t){return`
    <style>
      :host([${o.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${o.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${bu}</slot>
      <slot name="exit">${Au}</slot>
    </slot>
  `}function Tu(){return`
    <slot name="tooltip-enter">${k("Enter fullscreen mode")}</slot>
    <slot name="tooltip-exit">${k("Exit fullscreen mode")}</slot>
  `}const sn=t=>{const e=t.mediaIsFullscreen?k("exit fullscreen mode"):k("enter fullscreen mode");t.setAttribute("aria-label",e)};class qa extends re{constructor(){super(...arguments),gu(this,ha,null)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_FULLSCREEN,o.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),sn(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_FULLSCREEN&&sn(this)}get mediaFullscreenUnavailable(){return G(this,o.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){q(this,o.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return C(this,o.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){D(this,o.MEDIA_IS_FULLSCREEN,e)}handleClick(e){_u(this,ha,e);const i=fu(this,ha)instanceof PointerEvent,a=this.mediaIsFullscreen?new h.CustomEvent(I.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0}):new h.CustomEvent(I.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0,detail:i});this.dispatchEvent(a)}}ha=new WeakMap;qa.getSlotTemplateHTML=yu;qa.getTooltipContentHTML=Tu;h.customElements.get("media-fullscreen-button")||h.customElements.define("media-fullscreen-button",qa);var Su=qa;const{MEDIA_TIME_IS_LIVE:ma,MEDIA_PAUSED:Si}=o,{MEDIA_SEEK_TO_LIVE_REQUEST:Iu,MEDIA_PLAY_REQUEST:wu}=I,ku='<svg viewBox="0 0 6 12"><circle cx="3" cy="6" r="2"></circle></svg>';function Mu(t){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${ma}]:not([${Si}])) slot[name=indicator] > *,
      :host([${ma}]:not([${Si}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${ma}]:not([${Si}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator">${ku}</slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${k("live")}</slot>
  `}const rn=t=>{var e;const i=t.mediaPaused||!t.mediaTimeIsLive,a=k(i?"seek to live":"playing live");t.setAttribute("aria-label",a);const s=(e=t.shadowRoot)==null?void 0:e.querySelector('slot[name="text"]');s&&(s.textContent=k("live")),i?t.removeAttribute("aria-disabled"):t.setAttribute("aria-disabled","true")};class hr extends re{static get observedAttributes(){return[...super.observedAttributes,ma,Si]}connectedCallback(){super.connectedCallback(),rn(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),rn(this)}get mediaPaused(){return C(this,o.MEDIA_PAUSED)}set mediaPaused(e){D(this,o.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return C(this,o.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){D(this,o.MEDIA_TIME_IS_LIVE,e)}handleClick(){!this.mediaPaused&&this.mediaTimeIsLive||(this.dispatchEvent(new h.CustomEvent(Iu,{composed:!0,bubbles:!0})),this.hasAttribute(Si)&&this.dispatchEvent(new h.CustomEvent(wu,{composed:!0,bubbles:!0})))}}hr.getSlotTemplateHTML=Mu;h.customElements.get("media-live-button")||h.customElements.define("media-live-button",hr);var Lu=hr,Po=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},di=(t,e,i)=>(Po(t,e,"read from private field"),i?i.call(t):e.get(t)),nn=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ci=(t,e,i,a)=>(Po(t,e,"write to private field"),e.set(t,i),i),He,pa;const qi={LOADING_DELAY:"loadingdelay",NO_AUTOHIDE:"noautohide"},No=500,Ru=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;function xu(t){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, ${No}ms);
      }

      #status {
        color: rgba(0,0,0,0);
        width: 0px;
        height: 0px;
      }

      :host slot[name=icon] > *,
      :host ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 0);
        transition: opacity 0.15s;
      }

      :host([${o.MEDIA_LOADING}]:not([${o.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${o.MEDIA_LOADING}]:not([${o.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${o.MEDIA_LOADING}]:not([${o.MEDIA_PAUSED}])) #status {
        visibility: var(--media-loading-indicator-opacity, visible);
        transition: visibility 0.15s var(--_loading-indicator-delay);
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-loading-indicator-icon-width);
        height: var(--media-loading-indicator-icon-height, 100px);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
      }
    </style>

    <slot name="icon">${Ru}</slot>
    <div id="status" role="status" aria-live="polite">${k("media loading")}</div>
  `}class Ya extends h.HTMLElement{constructor(){if(super(),nn(this,He,void 0),nn(this,pa,No),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=Me(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[H.MEDIA_CONTROLLER,o.MEDIA_PAUSED,o.MEDIA_LOADING,qi.LOADING_DELAY]}attributeChangedCallback(e,i,a){var s,r,n,l,c;e===qi.LOADING_DELAY&&i!==a?this.loadingDelay=Number(a):e===H.MEDIA_CONTROLLER&&(i&&((r=(s=di(this,He))==null?void 0:s.unassociateElement)==null||r.call(s,this),ci(this,He,null)),a&&this.isConnected&&(ci(this,He,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(l=di(this,He))==null?void 0:l.associateElement)==null||c.call(l,this)))}connectedCallback(){var e,i,a;const s=this.getAttribute(H.MEDIA_CONTROLLER);s&&(ci(this,He,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=di(this,He))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=di(this,He))==null?void 0:e.unassociateElement)==null||i.call(e,this),ci(this,He,null)}get loadingDelay(){return di(this,pa)}set loadingDelay(e){ci(this,pa,e);const{style:i}=ee(this.shadowRoot,":host");i.setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return C(this,o.MEDIA_PAUSED)}set mediaPaused(e){D(this,o.MEDIA_PAUSED,e)}get mediaLoading(){return C(this,o.MEDIA_LOADING)}set mediaLoading(e){D(this,o.MEDIA_LOADING,e)}get mediaController(){return G(this,H.MEDIA_CONTROLLER)}set mediaController(e){q(this,H.MEDIA_CONTROLLER,e)}get noAutohide(){return C(this,qi.NO_AUTOHIDE)}set noAutohide(e){D(this,qi.NO_AUTOHIDE,e)}}He=new WeakMap;pa=new WeakMap;Ya.shadowRootOptions={mode:"open"};Ya.getTemplateHTML=xu;h.customElements.get("media-loading-indicator")||h.customElements.define("media-loading-indicator",Ya);var Cu=Ya;const Du=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,on=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,Pu=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`;function Nu(t){return`
    <style>
      :host(:not([${o.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${o.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${o.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${o.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${o.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${o.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${o.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${Du}</slot>
      <slot name="low">${on}</slot>
      <slot name="medium">${on}</slot>
      <slot name="high">${Pu}</slot>
    </slot>
  `}function Ou(){return`
    <slot name="tooltip-mute">${k("Mute")}</slot>
    <slot name="tooltip-unmute">${k("Unmute")}</slot>
  `}const ln=t=>{const e=t.mediaVolumeLevel==="off",i=k(e?"unmute":"mute");t.setAttribute("aria-label",i)};let za=class extends re{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),ln(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_VOLUME_LEVEL&&ln(this)}get mediaVolumeLevel(){return G(this,o.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){q(this,o.MEDIA_VOLUME_LEVEL,e)}handleClick(){const e=this.mediaVolumeLevel==="off"?I.MEDIA_UNMUTE_REQUEST:I.MEDIA_MUTE_REQUEST;this.dispatchEvent(new h.CustomEvent(e,{composed:!0,bubbles:!0}))}};za.getSlotTemplateHTML=Nu;za.getTooltipContentHTML=Ou;h.customElements.get("media-mute-button")||h.customElements.define("media-mute-button",za);var Uu=za;const dn=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`;function $u(t){return`
    <style>
      :host([${o.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${o.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${dn}</slot>
      <slot name="exit">${dn}</slot>
    </slot>
  `}function Hu(){return`
    <slot name="tooltip-enter">${k("Enter picture in picture mode")}</slot>
    <slot name="tooltip-exit">${k("Exit picture in picture mode")}</slot>
  `}const cn=t=>{const e=t.mediaIsPip?k("exit picture in picture mode"):k("enter picture in picture mode");t.setAttribute("aria-label",e)};class Qa extends re{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_PIP,o.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),cn(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_PIP&&cn(this)}get mediaPipUnavailable(){return G(this,o.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){q(this,o.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return C(this,o.MEDIA_IS_PIP)}set mediaIsPip(e){D(this,o.MEDIA_IS_PIP,e)}handleClick(){const e=this.mediaIsPip?I.MEDIA_EXIT_PIP_REQUEST:I.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new h.CustomEvent(e,{composed:!0,bubbles:!0}))}}Qa.getSlotTemplateHTML=$u;Qa.getTooltipContentHTML=Hu;h.customElements.get("media-pip-button")||h.customElements.define("media-pip-button",Qa);var Fu=Qa,Bu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},xt=(t,e,i)=>(Bu(t,e,"read from private field"),i?i.call(t):e.get(t)),Vu=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},it;const ds={RATES:"rates"},Wu=[1,1.2,1.5,1.7,2],gi=1;function ju(t){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${t.mediaplaybackrate||gi}x</slot>
  `}function Ku(){return k("Playback rate")}class Za extends re{constructor(){var e;super(),Vu(this,it,new io(this,ds.RATES,{defaultValue:Wu})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${(e=this.mediaPlaybackRate)!=null?e:gi}x`}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PLAYBACK_RATE,ds.RATES]}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),e===ds.RATES&&(xt(this,it).value=a),e===o.MEDIA_PLAYBACK_RATE){const s=a?+a:Number.NaN,r=Number.isNaN(s)?gi:s;this.container.innerHTML=`${r}x`,this.setAttribute("aria-label",k("Playback rate {playbackRate}",{playbackRate:r}))}}get rates(){return xt(this,it)}set rates(e){e?Array.isArray(e)?xt(this,it).value=e.join(" "):typeof e=="string"&&(xt(this,it).value=e):xt(this,it).value=""}get mediaPlaybackRate(){return K(this,o.MEDIA_PLAYBACK_RATE,gi)}set mediaPlaybackRate(e){se(this,o.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,i;const a=Array.from(xt(this,it).values(),n=>+n).sort((n,l)=>n-l),s=(i=(e=a.find(n=>n>this.mediaPlaybackRate))!=null?e:a[0])!=null?i:gi,r=new h.CustomEvent(I.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:s});this.dispatchEvent(r)}}it=new WeakMap;Za.getSlotTemplateHTML=ju;Za.getTooltipContentHTML=Ku;h.customElements.get("media-playback-rate-button")||h.customElements.define("media-playback-rate-button",Za);var Gu=Za;const qu=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,Yu=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`;function zu(t){return`
    <style>
      :host([${o.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${o.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${o.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${o.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${qu}</slot>
      <slot name="pause">${Yu}</slot>
    </slot>
  `}function Qu(){return`
    <slot name="tooltip-play">${k("Play")}</slot>
    <slot name="tooltip-pause">${k("Pause")}</slot>
  `}const un=t=>{const e=t.mediaPaused?k("play"):k("pause");t.setAttribute("aria-label",e)};let Xa=class extends re{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PAUSED,o.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),un(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),(e===o.MEDIA_PAUSED||e===o.MEDIA_LANG)&&un(this)}get mediaPaused(){return C(this,o.MEDIA_PAUSED)}set mediaPaused(e){D(this,o.MEDIA_PAUSED,e)}handleClick(){const e=this.mediaPaused?I.MEDIA_PLAY_REQUEST:I.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new h.CustomEvent(e,{composed:!0,bubbles:!0}))}};Xa.getSlotTemplateHTML=zu;Xa.getTooltipContentHTML=Qu;h.customElements.get("media-play-button")||h.customElements.define("media-play-button",Xa);var Zu=Xa;const xe={PLACEHOLDER_SRC:"placeholdersrc",SRC:"src"};function Xu(t){return`
    <style>
      :host {
        pointer-events: none;
        display: var(--media-poster-image-display, inline-block);
        box-sizing: border-box;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        background-repeat: no-repeat;
        background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
        background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, center);
      }
    </style>

    <img part="poster img" aria-hidden="true" id="image"/>
  `}const Ju=t=>{t.style.removeProperty("background-image")},eh=(t,e)=>{t.style["background-image"]=`url('${e}')`};class Ja extends h.HTMLElement{static get observedAttributes(){return[xe.PLACEHOLDER_SRC,xe.SRC]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=Me(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,i,a){e===xe.SRC&&(a==null?this.image.removeAttribute(xe.SRC):this.image.setAttribute(xe.SRC,a)),e===xe.PLACEHOLDER_SRC&&(a==null?Ju(this.image):eh(this.image,a))}get placeholderSrc(){return G(this,xe.PLACEHOLDER_SRC)}set placeholderSrc(e){q(this,xe.SRC,e)}get src(){return G(this,xe.SRC)}set src(e){q(this,xe.SRC,e)}}Ja.shadowRootOptions={mode:"open"};Ja.getTemplateHTML=Xu;h.customElements.get("media-poster-image")||h.customElements.define("media-poster-image",Ja);var th=Ja,Oo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ih=(t,e,i)=>(Oo(t,e,"read from private field"),i?i.call(t):e.get(t)),ah=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},sh=(t,e,i,a)=>(Oo(t,e,"write to private field"),e.set(t,i),i),va;class Uo extends Ye{constructor(){super(),ah(this,va,void 0),sh(this,va,this.shadowRoot.querySelector("slot"))}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PREVIEW_CHAPTER,o.MEDIA_LANG]}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),(e===o.MEDIA_PREVIEW_CHAPTER||e===o.MEDIA_LANG)&&a!==i&&a!=null)if(ih(this,va).textContent=a,a!==""){const s=k("chapter: {chapterName}",{chapterName:a});this.setAttribute("aria-valuetext",s)}else this.removeAttribute("aria-valuetext")}get mediaPreviewChapter(){return G(this,o.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){q(this,o.MEDIA_PREVIEW_CHAPTER,e)}}va=new WeakMap;h.customElements.get("media-preview-chapter-display")||h.customElements.define("media-preview-chapter-display",Uo);var rh=Uo,$o=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Yi=(t,e,i)=>($o(t,e,"read from private field"),i?i.call(t):e.get(t)),nh=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},zi=(t,e,i,a)=>($o(t,e,"write to private field"),e.set(t,i),i),Fe;function oh(t){return`
    <style>
      :host {
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
        overflow: hidden;
      }

      img {
        display: none;
        position: relative;
      }
    </style>
    <img crossorigin loading="eager" decoding="async">
  `}class es extends h.HTMLElement{constructor(){if(super(),nh(this,Fe,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=Me(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[H.MEDIA_CONTROLLER,o.MEDIA_PREVIEW_IMAGE,o.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,i,a;const s=this.getAttribute(H.MEDIA_CONTROLLER);s&&(zi(this,Fe,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=Yi(this,Fe))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Yi(this,Fe))==null?void 0:e.unassociateElement)==null||i.call(e,this),zi(this,Fe,null)}attributeChangedCallback(e,i,a){var s,r,n,l,c;[o.MEDIA_PREVIEW_IMAGE,o.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===H.MEDIA_CONTROLLER&&(i&&((r=(s=Yi(this,Fe))==null?void 0:s.unassociateElement)==null||r.call(s,this),zi(this,Fe,null)),a&&this.isConnected&&(zi(this,Fe,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(c=(l=Yi(this,Fe))==null?void 0:l.associateElement)==null||c.call(l,this)))}get mediaPreviewImage(){return G(this,o.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){q(this,o.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){const e=this.getAttribute(o.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(i=>+i)}set mediaPreviewCoords(e){if(!e){this.removeAttribute(o.MEDIA_PREVIEW_COORDS);return}this.setAttribute(o.MEDIA_PREVIEW_COORDS,e.join(" "))}update(){const e=this.mediaPreviewCoords,i=this.mediaPreviewImage;if(!(e&&i))return;const[a,s,r,n]=e,l=i.split("#")[0],c=getComputedStyle(this),{maxWidth:_,maxHeight:E,minWidth:m,minHeight:v}=c,p=Math.min(parseInt(_)/r,parseInt(E)/n),A=Math.max(parseInt(m)/r,parseInt(v)/n),g=p<1,f=g?p:A>1?A:1,{style:u}=ee(this.shadowRoot,":host"),y=ee(this.shadowRoot,"img").style,T=this.shadowRoot.querySelector("img"),S=g?"min":"max";u.setProperty(`${S}-width`,"initial","important"),u.setProperty(`${S}-height`,"initial","important"),u.width=`${r*f}px`,u.height=`${n*f}px`;const x=()=>{y.width=`${this.imgWidth*f}px`,y.height=`${this.imgHeight*f}px`,y.display="block"};T.src!==l&&(T.onload=()=>{this.imgWidth=T.naturalWidth,this.imgHeight=T.naturalHeight,x()},T.src=l,x()),x(),y.transform=`translate(-${a*f}px, -${s*f}px)`}}Fe=new WeakMap;es.shadowRootOptions={mode:"open"};es.getTemplateHTML=oh;h.customElements.get("media-preview-thumbnail")||h.customElements.define("media-preview-thumbnail",es);var Bs=es,Ho=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},hn=(t,e,i)=>(Ho(t,e,"read from private field"),i?i.call(t):e.get(t)),lh=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},dh=(t,e,i,a)=>(Ho(t,e,"write to private field"),e.set(t,i),i),_i;class Fo extends Ye{constructor(){super(),lh(this,_i,void 0),dh(this,_i,this.shadowRoot.querySelector("slot")),hn(this,_i).textContent=nt(0)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_PREVIEW_TIME&&a!=null&&(hn(this,_i).textContent=nt(parseFloat(a)))}get mediaPreviewTime(){return K(this,o.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){se(this,o.MEDIA_PREVIEW_TIME,e)}}_i=new WeakMap;h.customElements.get("media-preview-time-display")||h.customElements.define("media-preview-time-display",Fo);var ch=Fo;const Ct={SEEK_OFFSET:"seekoffset"},cs=30,uh=t=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${t}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`;function hh(t,e){return`
    <slot name="icon">${uh(e.seekOffset)}</slot>
  `}function mh(){return k("Seek backward")}const ph=0;let ts=class extends re{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_CURRENT_TIME,Ct.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=K(this,Ct.SEEK_OFFSET,cs)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===Ct.SEEK_OFFSET&&(this.seekOffset=K(this,Ct.SEEK_OFFSET,cs))}get seekOffset(){return K(this,Ct.SEEK_OFFSET,cs)}set seekOffset(e){se(this,Ct.SEEK_OFFSET,e),this.setAttribute("aria-label",k("seek back {seekOffset} seconds",{seekOffset:this.seekOffset})),Kn(Gn(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return K(this,o.MEDIA_CURRENT_TIME,ph)}set mediaCurrentTime(e){se(this,o.MEDIA_CURRENT_TIME,e)}handleClick(){const e=Math.max(this.mediaCurrentTime-this.seekOffset,0),i=new h.CustomEvent(I.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}};ts.getSlotTemplateHTML=hh;ts.getTooltipContentHTML=mh;h.customElements.get("media-seek-backward-button")||h.customElements.define("media-seek-backward-button",ts);var vh=ts;const Dt={SEEK_OFFSET:"seekoffset"},us=30,Eh=t=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${t}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`;function fh(t,e){return`
    <slot name="icon">${Eh(e.seekOffset)}</slot>
  `}function gh(){return k("Seek forward")}const _h=0;let is=class extends re{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_CURRENT_TIME,Dt.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=K(this,Dt.SEEK_OFFSET,us)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===Dt.SEEK_OFFSET&&(this.seekOffset=K(this,Dt.SEEK_OFFSET,us))}get seekOffset(){return K(this,Dt.SEEK_OFFSET,us)}set seekOffset(e){se(this,Dt.SEEK_OFFSET,e),this.setAttribute("aria-label",k("seek forward {seekOffset} seconds",{seekOffset:this.seekOffset})),Kn(Gn(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return K(this,o.MEDIA_CURRENT_TIME,_h)}set mediaCurrentTime(e){se(this,o.MEDIA_CURRENT_TIME,e)}handleClick(){const e=this.mediaCurrentTime+this.seekOffset,i=new h.CustomEvent(I.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}};is.getSlotTemplateHTML=fh;is.getTooltipContentHTML=gh;h.customElements.get("media-seek-forward-button")||h.customElements.define("media-seek-forward-button",is);var bh=is,Bo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},hs=(t,e,i)=>(Bo(t,e,"read from private field"),i?i.call(t):e.get(t)),Ah=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},yh=(t,e,i,a)=>(Bo(t,e,"write to private field"),e.set(t,i),i),Bt;const vt={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},mn=[...Object.values(vt),o.MEDIA_CURRENT_TIME,o.MEDIA_DURATION,o.MEDIA_SEEKABLE],pn=["Enter"," "],Th="&nbsp;/&nbsp;",Vs=(t,{timesSep:e=Th}={})=>{var i,a;const s=(i=t.mediaCurrentTime)!=null?i:0,[,r]=(a=t.mediaSeekable)!=null?a:[];let n=0;Number.isFinite(t.mediaDuration)?n=t.mediaDuration:Number.isFinite(r)&&(n=r);const l=t.remaining?nt(0-(n-s)):nt(s);return t.showDuration?`${l}${e}${nt(n)}`:l},Sh="video not loaded, unknown time.",Ih=t=>{var e;const i=t.mediaCurrentTime,[,a]=(e=t.mediaSeekable)!=null?e:[];let s=null;if(Number.isFinite(t.mediaDuration)?s=t.mediaDuration:Number.isFinite(a)&&(s=a),i==null||s===null){t.setAttribute("aria-valuetext",Sh);return}const r=t.remaining?yi(0-(s-i)):yi(i);if(!t.showDuration){t.setAttribute("aria-valuetext",r);return}const n=yi(s),l=`${r} of ${n}`;t.setAttribute("aria-valuetext",l)};function wh(t,e){return`
    <slot>${Vs(e)}</slot>
  `}let mr=class extends Ye{constructor(){super(),Ah(this,Bt,void 0),yh(this,Bt,this.shadowRoot.querySelector("slot")),hs(this,Bt).innerHTML=`${Vs(this)}`}static get observedAttributes(){return[...super.observedAttributes,...mn,"disabled"]}connectedCallback(){const{style:e}=ee(this.shadowRoot,":host(:hover:not([notoggle]))");e.setProperty("cursor","var(--media-cursor, pointer)"),e.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))"),this.hasAttribute("disabled")||this.enable(),this.setAttribute("role","progressbar"),this.setAttribute("aria-label",k("playback time"));const i=a=>{const{key:s}=a;if(!pn.includes(s)){this.removeEventListener("keyup",i);return}this.toggleTimeDisplay()};this.addEventListener("keydown",a=>{const{metaKey:s,altKey:r,key:n}=a;if(s||r||!pn.includes(n)){this.removeEventListener("keyup",i);return}this.addEventListener("keyup",i)}),this.addEventListener("click",this.toggleTimeDisplay),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),super.disconnectedCallback()}attributeChangedCallback(e,i,a){mn.includes(e)?this.update():e==="disabled"&&a!==i&&(a==null?this.enable():this.disable()),super.attributeChangedCallback(e,i,a)}enable(){this.tabIndex=0}disable(){this.tabIndex=-1}get remaining(){return C(this,vt.REMAINING)}set remaining(e){D(this,vt.REMAINING,e)}get showDuration(){return C(this,vt.SHOW_DURATION)}set showDuration(e){D(this,vt.SHOW_DURATION,e)}get noToggle(){return C(this,vt.NO_TOGGLE)}set noToggle(e){D(this,vt.NO_TOGGLE,e)}get mediaDuration(){return K(this,o.MEDIA_DURATION)}set mediaDuration(e){se(this,o.MEDIA_DURATION,e)}get mediaCurrentTime(){return K(this,o.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){se(this,o.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){const e=this.getAttribute(o.MEDIA_SEEKABLE);if(e)return e.split(":").map(i=>+i)}set mediaSeekable(e){if(e==null){this.removeAttribute(o.MEDIA_SEEKABLE);return}this.setAttribute(o.MEDIA_SEEKABLE,e.join(":"))}update(){const e=Vs(this);Ih(this),e!==hs(this,Bt).innerHTML&&(hs(this,Bt).innerHTML=e)}};Bt=new WeakMap;mr.getSlotTemplateHTML=wh;h.customElements.get("media-time-display")||h.customElements.define("media-time-display",mr);var kh=mr,Vo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ie=(t,e,i)=>(Vo(t,e,"read from private field"),e.get(t)),Ce=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ge=(t,e,i,a)=>(Vo(t,e,"write to private field"),e.set(t,i),i),Mh=(t,e,i,a)=>({set _(s){ge(t,e,s)},get _(){return ie(t,e)}}),Vt,Ea,Wt,bi,fa,ga,_a,jt,Et,ba;class Lh{constructor(e,i,a){Ce(this,Vt,void 0),Ce(this,Ea,void 0),Ce(this,Wt,void 0),Ce(this,bi,void 0),Ce(this,fa,void 0),Ce(this,ga,void 0),Ce(this,_a,void 0),Ce(this,jt,void 0),Ce(this,Et,0),Ce(this,ba,(s=performance.now())=>{ge(this,Et,requestAnimationFrame(ie(this,ba))),ge(this,bi,performance.now()-ie(this,Wt));const r=1e3/this.fps;if(ie(this,bi)>r){ge(this,Wt,s-ie(this,bi)%r);const n=1e3/((s-ie(this,Ea))/++Mh(this,fa)._),l=(s-ie(this,ga))/1e3/this.duration;let c=ie(this,_a)+l*this.playbackRate;c-ie(this,Vt).valueAsNumber>0?ge(this,jt,this.playbackRate/this.duration/n):(ge(this,jt,.995*ie(this,jt)),c=ie(this,Vt).valueAsNumber+ie(this,jt)),this.callback(c)}}),ge(this,Vt,e),this.callback=i,this.fps=a}start(){ie(this,Et)===0&&(ge(this,Wt,performance.now()),ge(this,Ea,ie(this,Wt)),ge(this,fa,0),ie(this,ba).call(this))}stop(){ie(this,Et)!==0&&(cancelAnimationFrame(ie(this,Et)),ge(this,Et,0))}update({start:e,duration:i,playbackRate:a}){const s=e-ie(this,Vt).valueAsNumber,r=Math.abs(i-this.duration);(s>0||s<-.03||r>=.5)&&this.callback(e),ge(this,_a,e),ge(this,ga,performance.now()),this.duration=i,this.playbackRate=a}}Vt=new WeakMap;Ea=new WeakMap;Wt=new WeakMap;bi=new WeakMap;fa=new WeakMap;ga=new WeakMap;_a=new WeakMap;jt=new WeakMap;Et=new WeakMap;ba=new WeakMap;var pr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Y=(t,e,i)=>(pr(t,e,"read from private field"),i?i.call(t):e.get(t)),J=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Te=(t,e,i,a)=>(pr(t,e,"write to private field"),e.set(t,i),i),oe=(t,e,i)=>(pr(t,e,"access private method"),i),Kt,At,La,Ii,Ra,Aa,xi,Ci,Gt,qt,Yt,Ai,vr,Wo,Ws,xa,Er,Ca,fr,Da,gr,js,jo,Di,Pa,Ks,Ko;const Rh="video not loaded, unknown time.",xh=t=>{const e=t.range,i=yi(+Go(t)),a=yi(+t.mediaSeekableEnd),s=i&&a?`${i} of ${a}`:Rh;e.setAttribute("aria-valuetext",s)};function Ch(t){return`
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${o.MEDIA_PREVIEW_IMAGE}], [${o.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${o.MEDIA_PREVIEW_IMAGE}], [${o.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${o.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${o.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${o.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${o.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${o.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${o.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${o.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${o.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${o.MEDIA_PREVIEW_CHAPTER}]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${o.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${o.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${o.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${Bs.shadowRootOptions.mode}">
            ${Bs.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        
      </slot>
    </div>
  `}const Qi=(t,e=t.mediaCurrentTime)=>{const i=Number.isFinite(t.mediaSeekableStart)?t.mediaSeekableStart:0,a=Number.isFinite(t.mediaDuration)?t.mediaDuration:t.mediaSeekableEnd;if(Number.isNaN(a))return 0;const s=(e-i)/(a-i);return Math.max(0,Math.min(s,1))},Go=(t,e=t.range.valueAsNumber)=>{const i=Number.isFinite(t.mediaSeekableStart)?t.mediaSeekableStart:0,a=Number.isFinite(t.mediaDuration)?t.mediaDuration:t.mediaSeekableEnd;return Number.isNaN(a)?0:e*(a-i)+i};let as=class extends St{constructor(){super(),J(this,Yt),J(this,vr),J(this,xa),J(this,Ca),J(this,Da),J(this,js),J(this,Di),J(this,Ks),J(this,Kt,void 0),J(this,At,void 0),J(this,La,void 0),J(this,Ii,void 0),J(this,Ra,void 0),J(this,Aa,void 0),J(this,xi,void 0),J(this,Ci,void 0),J(this,Gt,void 0),J(this,qt,void 0),J(this,Ws,a=>{this.dragging||(Zs(a)&&(this.range.valueAsNumber=a),Y(this,qt)||this.updateBar())}),this.shadowRoot.querySelector("#track").insertAdjacentHTML("afterbegin",'<div id="buffered" part="buffered"></div>'),Te(this,La,this.shadowRoot.querySelectorAll('[part~="box"]')),Te(this,Ra,this.shadowRoot.querySelector('[part~="preview-box"]')),Te(this,Aa,this.shadowRoot.querySelector('[part~="current-box"]'));const i=getComputedStyle(this);Te(this,xi,parseInt(i.getPropertyValue("--media-box-padding-left"))),Te(this,Ci,parseInt(i.getPropertyValue("--media-box-padding-right"))),Te(this,At,new Lh(this.range,Y(this,Ws),60))}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PAUSED,o.MEDIA_DURATION,o.MEDIA_SEEKABLE,o.MEDIA_CURRENT_TIME,o.MEDIA_PREVIEW_IMAGE,o.MEDIA_PREVIEW_TIME,o.MEDIA_PREVIEW_CHAPTER,o.MEDIA_BUFFERED,o.MEDIA_PLAYBACK_RATE,o.MEDIA_LOADING,o.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute("aria-label",k("seek")),oe(this,Yt,Ai).call(this),Te(this,Kt,this.getRootNode()),(e=Y(this,Kt))==null||e.addEventListener("transitionstart",this)}disconnectedCallback(){var e;super.disconnectedCallback(),oe(this,Yt,Ai).call(this),(e=Y(this,Kt))==null||e.removeEventListener("transitionstart",this),Te(this,Kt,null)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),i!=a&&(e===o.MEDIA_CURRENT_TIME||e===o.MEDIA_PAUSED||e===o.MEDIA_ENDED||e===o.MEDIA_LOADING||e===o.MEDIA_DURATION||e===o.MEDIA_SEEKABLE?(Y(this,At).update({start:Qi(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),oe(this,Yt,Ai).call(this),xh(this)):e===o.MEDIA_BUFFERED&&this.updateBufferedBar(),(e===o.MEDIA_DURATION||e===o.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=Y(this,Gt),this.updateBar()))}get mediaChaptersCues(){return Y(this,Gt)}set mediaChaptersCues(e){var i;Te(this,Gt,e),this.updateSegments((i=Y(this,Gt))==null?void 0:i.map(a=>({start:Qi(this,a.startTime),end:Qi(this,a.endTime)})))}get mediaPaused(){return C(this,o.MEDIA_PAUSED)}set mediaPaused(e){D(this,o.MEDIA_PAUSED,e)}get mediaLoading(){return C(this,o.MEDIA_LOADING)}set mediaLoading(e){D(this,o.MEDIA_LOADING,e)}get mediaDuration(){return K(this,o.MEDIA_DURATION)}set mediaDuration(e){se(this,o.MEDIA_DURATION,e)}get mediaCurrentTime(){return K(this,o.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){se(this,o.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return K(this,o.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){se(this,o.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){const e=this.getAttribute(o.MEDIA_BUFFERED);return e?e.split(" ").map(i=>i.split(":").map(a=>+a)):[]}set mediaBuffered(e){if(!e){this.removeAttribute(o.MEDIA_BUFFERED);return}const i=e.map(a=>a.join(":")).join(" ");this.setAttribute(o.MEDIA_BUFFERED,i)}get mediaSeekable(){const e=this.getAttribute(o.MEDIA_SEEKABLE);if(e)return e.split(":").map(i=>+i)}set mediaSeekable(e){if(e==null){this.removeAttribute(o.MEDIA_SEEKABLE);return}this.setAttribute(o.MEDIA_SEEKABLE,e.join(":"))}get mediaSeekableEnd(){var e;const[,i=this.mediaDuration]=(e=this.mediaSeekable)!=null?e:[];return i}get mediaSeekableStart(){var e;const[i=0]=(e=this.mediaSeekable)!=null?e:[];return i}get mediaPreviewImage(){return G(this,o.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){q(this,o.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return K(this,o.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){se(this,o.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return C(this,o.MEDIA_ENDED)}set mediaEnded(e){D(this,o.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){var e;const i=this.mediaBuffered;if(!i.length)return;let a;if(this.mediaEnded)a=1;else{const r=this.mediaCurrentTime,[,n=this.mediaSeekableStart]=(e=i.find(([l,c])=>l<=r&&r<=c))!=null?e:[];a=Qi(this,n)}const{style:s}=ee(this.shadowRoot,"#buffered");s.setProperty("width",`${a*100}%`)}updateCurrentBox(){if(!this.shadowRoot.querySelector('slot[name="current"]').assignedElements().length)return;const i=ee(this.shadowRoot,"#current-rail"),a=ee(this.shadowRoot,'[part~="current-box"]'),s=oe(this,xa,Er).call(this,Y(this,Aa)),r=oe(this,Ca,fr).call(this,s,this.range.valueAsNumber),n=oe(this,Da,gr).call(this,s,this.range.valueAsNumber);i.style.transform=`translateX(${r})`,i.style.setProperty("--_range-width",`${s.range.width}`),a.style.setProperty("--_box-shift",`${n}`),a.style.setProperty("--_box-width",`${s.box.width}px`),a.style.setProperty("visibility","initial")}handleEvent(e){switch(super.handleEvent(e),e.type){case"input":oe(this,Ks,Ko).call(this);break;case"pointermove":oe(this,js,jo).call(this,e);break;case"pointerup":Y(this,qt)&&Te(this,qt,!1);break;case"pointerdown":Te(this,qt,!0);break;case"pointerleave":oe(this,Di,Pa).call(this,null);break;case"transitionstart":ai(e.target,this)&&setTimeout(()=>oe(this,Yt,Ai).call(this),0);break}}};Kt=new WeakMap;At=new WeakMap;La=new WeakMap;Ii=new WeakMap;Ra=new WeakMap;Aa=new WeakMap;xi=new WeakMap;Ci=new WeakMap;Gt=new WeakMap;qt=new WeakMap;Yt=new WeakSet;Ai=function(){oe(this,vr,Wo).call(this)?Y(this,At).start():Y(this,At).stop()};vr=new WeakSet;Wo=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&Yn(this)};Ws=new WeakMap;xa=new WeakSet;Er=function(t){var e;const a=((e=this.getAttribute("bounds")?Ni(this,`#${this.getAttribute("bounds")}`):this.parentElement)!=null?e:this).getBoundingClientRect(),s=this.range.getBoundingClientRect(),r=t.offsetWidth,n=-(s.left-a.left-r/2),l=a.right-s.left-r/2;return{box:{width:r,min:n,max:l},bounds:a,range:s}};Ca=new WeakSet;fr=function(t,e){let i=`${e*100}%`;const{width:a,min:s,max:r}=t.box;if(!a)return i;if(Number.isNaN(s)||(i=`max(${`calc(1 / var(--_range-width) * 100 * ${s}% + var(--media-box-padding-left))`}, ${i})`),!Number.isNaN(r)){const l=`calc(1 / var(--_range-width) * 100 * ${r}% - var(--media-box-padding-right))`;i=`min(${i}, ${l})`}return i};Da=new WeakSet;gr=function(t,e){const{width:i,min:a,max:s}=t.box,r=e*t.range.width;if(r<a+Y(this,xi)){const n=t.range.left-t.bounds.left-Y(this,xi);return`${r-i/2+n}px`}if(r>s-Y(this,Ci)){const n=t.bounds.right-t.range.right-Y(this,Ci);return`${r+i/2-n-t.range.width}px`}return 0};js=new WeakSet;jo=function(t){const e=[...Y(this,La)].some(E=>t.composedPath().includes(E));if(!this.dragging&&(e||!t.composedPath().includes(this))){oe(this,Di,Pa).call(this,null);return}const i=this.mediaSeekableEnd;if(!i)return;const a=ee(this.shadowRoot,"#preview-rail"),s=ee(this.shadowRoot,'[part~="preview-box"]'),r=oe(this,xa,Er).call(this,Y(this,Ra));let n=(t.clientX-r.range.left)/r.range.width;n=Math.max(0,Math.min(1,n));const l=oe(this,Ca,fr).call(this,r,n),c=oe(this,Da,gr).call(this,r,n);a.style.transform=`translateX(${l})`,a.style.setProperty("--_range-width",`${r.range.width}`),s.style.setProperty("--_box-shift",`${c}`),s.style.setProperty("--_box-width",`${r.box.width}px`);const _=Math.round(Y(this,Ii))-Math.round(n*i);Math.abs(_)<1&&n>.01&&n<.99||(Te(this,Ii,n*i),oe(this,Di,Pa).call(this,Y(this,Ii)))};Di=new WeakSet;Pa=function(t){this.dispatchEvent(new h.CustomEvent(I.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:t}))};Ks=new WeakSet;Ko=function(){Y(this,At).stop();const t=Go(this);this.dispatchEvent(new h.CustomEvent(I.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:t}))};as.shadowRootOptions={mode:"open"};as.getContainerTemplateHTML=Ch;h.customElements.get("media-time-range")||h.customElements.define("media-time-range",as);var Dh=as;const Ph=1,Nh=t=>t.mediaMuted?0:t.mediaVolume,Oh=t=>`${Math.round(t*100)}%`;let qo=class extends St{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_VOLUME,o.MEDIA_MUTED,o.MEDIA_VOLUME_UNAVAILABLE]}constructor(){super(),this.range.addEventListener("input",()=>{const e=this.range.value,i=new h.CustomEvent(I.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)})}connectedCallback(){super.connectedCallback(),this.range.setAttribute("aria-label",k("volume"))}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),(e===o.MEDIA_VOLUME||e===o.MEDIA_MUTED)&&(this.range.valueAsNumber=Nh(this),this.range.setAttribute("aria-valuetext",Oh(this.range.valueAsNumber)),this.updateBar())}get mediaVolume(){return K(this,o.MEDIA_VOLUME,Ph)}set mediaVolume(e){se(this,o.MEDIA_VOLUME,e)}get mediaMuted(){return C(this,o.MEDIA_MUTED)}set mediaMuted(e){D(this,o.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return G(this,o.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){q(this,o.MEDIA_VOLUME_UNAVAILABLE,e)}};h.customElements.get("media-volume-range")||h.customElements.define("media-volume-range",qo);var Uh=qo;function $h(t){return`
      <style>
        :host {
          min-width: 4ch;
          padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          font-weight: var(--media-button-font-weight, normal);
        }

        #checked-indicator {
          display: none;
        }

        :host([${o.MEDIA_LOOP}]) #checked-indicator {
          display: block;
        }
      </style>
      
      <span id="icon">
     </span>

      <div id="checked-indicator">
        <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
          <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
        </svg>
      </div>
    `}function Hh(){return k("Loop")}class ss extends re{constructor(){super(...arguments),this.container=null}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_LOOP]}connectedCallback(){var e;super.connectedCallback(),this.container=((e=this.shadowRoot)==null?void 0:e.querySelector("#icon"))||null,this.container&&(this.container.textContent=k("Loop"))}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_LOOP&&this.container&&this.setAttribute("aria-checked",this.mediaLoop?"true":"false")}get mediaLoop(){return C(this,o.MEDIA_LOOP)}set mediaLoop(e){D(this,o.MEDIA_LOOP,e)}handleClick(){const e=!this.mediaLoop,i=new h.CustomEvent(I.MEDIA_LOOP_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}}ss.getSlotTemplateHTML=$h;ss.getTooltipContentHTML=Hh;h.customElements.get("media-loop-button")||h.customElements.define("media-loop-button",ss);var Fh=ss;function U(t){if(typeof t=="boolean")return t?"":void 0;if(typeof t=="function")return;const e=i=>typeof i=="string"||typeof i=="number"||typeof i=="boolean";if(Array.isArray(t)&&t.every(e))return t.join(" ");if(!(typeof t=="object"&&t!==null))return t}O({tagName:"media-gesture-receiver",elementClass:gs,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-container",elementClass:Bd,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});const Bh=O({tagName:"media-controller",elementClass:yc,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-tooltip",elementClass:ks,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-chrome-button",elementClass:Mc,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-airplay-button",elementClass:xc,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-captions-button",elementClass:Oc,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-cast-button",elementClass:Bc,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-chrome-dialog",elementClass:jc,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-chrome-range",elementClass:qc,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});const Vh=O({tagName:"media-control-bar",elementClass:Qc,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-text-display",elementClass:eu,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-duration-display",elementClass:su,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-error-dialog",elementClass:hu,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-keyboard-shortcuts-dialog",elementClass:Eu,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-fullscreen-button",elementClass:Su,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-live-button",elementClass:Lu,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-loading-indicator",elementClass:Cu,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});const Wh=O({tagName:"media-mute-button",elementClass:Uu,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-pip-button",elementClass:Fu,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-playback-rate-button",elementClass:Gu,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});const jh=O({tagName:"media-play-button",elementClass:Zu,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-poster-image",elementClass:th,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-preview-chapter-display",elementClass:rh,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-preview-thumbnail",elementClass:Bs,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-preview-time-display",elementClass:ch,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});const Kh=O({tagName:"media-seek-backward-button",elementClass:vh,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}}),Gh=O({tagName:"media-seek-forward-button",elementClass:bh,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}}),qh=O({tagName:"media-time-display",elementClass:kh,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}}),Yh=O({tagName:"media-time-range",elementClass:Dh,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}}),zh=O({tagName:"media-volume-range",elementClass:Uh,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});O({tagName:"media-loop-button",elementClass:Fh,react:R,toAttributeValue:U,defaultProps:{suppressHydrationWarning:!0}});const Qh={"--media-primary-color":"var(--primary)","--media-secondary-color":"var(--background)","--media-text-color":"var(--foreground)","--media-background-color":"var(--background)","--media-control-hover-background":"var(--accent)","--media-font-family":"var(--font-sans)","--media-live-button-icon-color":"var(--muted-foreground)","--media-live-button-indicator-color":"var(--destructive)","--media-range-track-background":"var(--border)"},Zh=t=>{const e=z.c(8);let i,a;e[0]!==t?({style:a,...i}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);let s;e[3]!==a?(s={...Qh,...a},e[3]=a,e[4]=s):s=e[4];let r;return e[5]!==i||e[6]!==s?(r=d.jsx(Bh,{style:s,...i}),e[5]=i,e[6]=s,e[7]=r):r=e[7],r},Xh=t=>{const e=z.c(2);let i;return e[0]!==t?(i=d.jsx(Vh,{...t}),e[0]=t,e[1]=i):i=e[1],i},Jh=t=>{const e=z.c(8);let i,a;e[0]!==t?({className:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);let s;e[3]!==i?(s=le("p-2.5",i),e[3]=i,e[4]=s):s=e[4];let r;return e[5]!==a||e[6]!==s?(r=d.jsx(Yh,{className:s,...a}),e[5]=a,e[6]=s,e[7]=r):r=e[7],r},em=t=>{const e=z.c(8);let i,a;e[0]!==t?({className:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);let s;e[3]!==i?(s=le("p-2.5",i),e[3]=i,e[4]=s):s=e[4];let r;return e[5]!==a||e[6]!==s?(r=d.jsx(qh,{className:s,...a}),e[5]=a,e[6]=s,e[7]=r):r=e[7],r},tm=t=>{const e=z.c(8);let i,a;e[0]!==t?({className:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);let s;e[3]!==i?(s=le("p-2.5",i),e[3]=i,e[4]=s):s=e[4];let r;return e[5]!==a||e[6]!==s?(r=d.jsx(zh,{className:s,...a}),e[5]=a,e[6]=s,e[7]=r):r=e[7],r},im=t=>{const e=z.c(8);let i,a;e[0]!==t?({className:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);let s;e[3]!==i?(s=le("p-2.5",i),e[3]=i,e[4]=s):s=e[4];let r;return e[5]!==a||e[6]!==s?(r=d.jsx(jh,{className:s,...a}),e[5]=a,e[6]=s,e[7]=r):r=e[7],r},am=t=>{const e=z.c(8);let i,a;e[0]!==t?({className:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);let s;e[3]!==i?(s=le("p-2.5",i),e[3]=i,e[4]=s):s=e[4];let r;return e[5]!==a||e[6]!==s?(r=d.jsx(Kh,{className:s,...a}),e[5]=a,e[6]=s,e[7]=r):r=e[7],r},sm=t=>{const e=z.c(8);let i,a;e[0]!==t?({className:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);let s;e[3]!==i?(s=le("p-2.5",i),e[3]=i,e[4]=s):s=e[4];let r;return e[5]!==a||e[6]!==s?(r=d.jsx(Gh,{className:s,...a}),e[5]=a,e[6]=s,e[7]=r):r=e[7],r},rm=t=>{const e=z.c(8);let i,a;e[0]!==t?({className:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);let s;e[3]!==i?(s=le("p-2.5",i),e[3]=i,e[4]=s):s=e[4];let r;return e[5]!==a||e[6]!==s?(r=d.jsx(Wh,{className:s,...a}),e[5]=a,e[6]=s,e[7]=r):r=e[7],r},nm=t=>{const e=z.c(8);let i,a;e[0]!==t?({className:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);let s;e[3]!==i?(s=le("mt-0 mb-0",i),e[3]=i,e[4]=s):s=e[4];let r;return e[5]!==a||e[6]!==s?(r=d.jsx("video",{className:s,...a}),e[5]=a,e[6]=s,e[7]=r):r=e[7],r};function Yo(t){const e=Math.floor(t/3600),i=Math.floor(t%3600/60),a=Math.floor(t%60),s=i<10?`0${i}`:i,r=a<10?`0${a}`:a;return e>0?`${e}:${s}:${r}`:`${i}:${r}`}const zo=w.createContext(null);function si(){const t=w.useContext(zo);if(!t)throw new Error("useAudioPlayer cannot be called outside of AudioPlayerProvider");return t}const Qo=w.createContext(null),Zo=()=>{const t=w.useContext(Qo);if(t===null)throw new Error("useAudioPlayerTime cannot be called outside of AudioPlayerProvider");return t};function om(t){const e=z.c(25),{children:i}=t,a=w.useRef(null),s=w.useRef(null),r=w.useRef(null),[n,l]=w.useState(0),[c,_]=w.useState(0),[E,m]=w.useState(0),[v,p]=w.useState(void 0),[A,g]=w.useState(null),[f,u]=w.useState(null),[y,T]=w.useState(!0),[S,x]=w.useState(1);let $;e[0]===Symbol.for("react.memo_cache_sentinel")?($=async j=>{if(!a.current||j?.id===s.current?.id)return;s.current=j;const ut=a.current.playbackRate;a.current.pause(),a.current.currentTime=0,j===null?a.current.removeAttribute("src"):a.current.src=j.src,a.current.load(),a.current.playbackRate=ut},e[0]=$):$=e[0];const ue=$;let me;e[1]!==f?.id?(me=async j=>{if(!a.current)return;if(r.current)try{await r.current}catch(Re){console.error("Play promise error:",Re)}if(j===void 0){const Re=a.current.play();return r.current=Re,Re}if(j?.id===f?.id){const Re=a.current.play();return r.current=Re,Re}s.current=j;const ut=a.current.playbackRate;a.current.paused||a.current.pause(),a.current.currentTime=0,j===null?a.current.removeAttribute("src"):a.current.src=j.src,a.current.load(),a.current.playbackRate=ut;const ri=a.current.play();return r.current=ri,ri},e[1]=f?.id,e[2]=me):me=e[2];const be=me;let P;e[3]===Symbol.for("react.memo_cache_sentinel")?(P=async()=>{if(a.current){if(r.current)try{await r.current}catch(j){console.error(j)}a.current.pause(),r.current=null}},e[3]=P):P=e[3];const B=P;let de;e[4]===Symbol.for("react.memo_cache_sentinel")?(de=j=>{a.current&&(a.current.currentTime=j)},e[4]=de):de=e[4];const ze=de;let Le;e[5]===Symbol.for("react.memo_cache_sentinel")?(Le=j=>{a.current&&(a.current.playbackRate=j,x(j))},e[5]=Le):Le=e[5];const Qe=Le;let pe;e[6]!==f?.id?(pe=j=>f?.id===j,e[6]=f?.id,e[7]=pe):pe=e[7];const Ae=pe;let X;e[8]===Symbol.for("react.memo_cache_sentinel")?(X=()=>{a.current&&(u(s.current),l(a.current.readyState),_(a.current.networkState),m(a.current.currentTime),p(a.current.duration),T(a.current.paused),g(a.current.error),x(a.current.playbackRate))},e[8]=X):X=e[8],mm(X);const We=!y,It=n<3&&c===2;let lt;e[9]!==f||e[10]!==v||e[11]!==A||e[12]!==It||e[13]!==Ae||e[14]!==We||e[15]!==be||e[16]!==S?(lt={ref:a,duration:v,error:A,isPlaying:We,isBuffering:It,activeItem:f,playbackRate:S,isItemActive:Ae,setActiveItem:ue,play:be,pause:B,seek:ze,setPlaybackRate:Qe},e[9]=f,e[10]=v,e[11]=A,e[12]=It,e[13]=Ae,e[14]=We,e[15]=be,e[16]=S,e[17]=lt):lt=e[17];const wt=lt;let dt;e[18]===Symbol.for("react.memo_cache_sentinel")?(dt=d.jsx("audio",{ref:a,className:"hidden",crossOrigin:"anonymous"}),e[18]=dt):dt=e[18];let je;e[19]!==i||e[20]!==E?(je=d.jsxs(Qo.Provider,{value:E,children:[dt,i]}),e[19]=i,e[20]=E,e[21]=je):je=e[21];let ct;return e[22]!==je||e[23]!==wt?(ct=d.jsx(zo.Provider,{value:wt,children:je}),e[22]=je,e[23]=wt,e[24]=ct):ct=e[24],ct}const lm=t=>{const e=z.c(21),{...i}=t,a=si(),s=Zo(),r=w.useRef(!1),n=cd;let l;e[0]!==s?(l=[s],e[0]=s,e[1]=l):l=e[1];const c=S=>{a.seek(S[0]),i.onValueChange?.(S)},_=0,E=a.duration??0,m=i.step||.25,v=S=>{r.current=a.isPlaying,a.pause(),i.onPointerDown?.(S)},p=S=>{r.current&&a.play(),i.onPointerUp?.(S)},A=le("group/player relative flex h-4 touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",i.className);let g;e[2]!==i||e[3]!==a?(g=S=>{S.key===" "&&(S.preventDefault(),a.isPlaying?a.pause():a.play()),i.onKeyDown?.(S)},e[2]=i,e[3]=a,e[4]=g):g=e[4];let f;e[5]!==a.duration?(f=a.duration===void 0||!Number.isFinite(a.duration)||Number.isNaN(a.duration),e[5]=a.duration,e[6]=f):f=e[6];let u;e[7]===Symbol.for("react.memo_cache_sentinel")?(u=d.jsx(xn,{className:"bg-muted relative h-[4px] w-full grow overflow-hidden rounded-full",children:d.jsx(Cn,{className:"bg-primary absolute h-full"})}),e[7]=u):u=e[7];let y;e[8]===Symbol.for("react.memo_cache_sentinel")?(y=d.jsx(Dn,{className:"relative flex h-0 w-0 items-center justify-center opacity-0 group-hover/player:opacity-100 focus-visible:opacity-100 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50","data-slot":"slider-thumb",children:d.jsx("div",{className:"bg-foreground absolute size-3 rounded-full"})}),e[8]=y):y=e[8];let T;return e[9]!==i||e[10]!==n.Root||e[11]!==g||e[12]!==f||e[13]!==l||e[14]!==c||e[15]!==E||e[16]!==m||e[17]!==v||e[18]!==p||e[19]!==A?(T=d.jsxs(n.Root,{...i,value:l,onValueChange:c,min:_,max:E,step:m,onPointerDown:v,onPointerUp:p,className:A,onKeyDown:g,disabled:f,children:[u,y]}),e[9]=i,e[10]=n.Root,e[11]=g,e[12]=f,e[13]=l,e[14]=c,e[15]=E,e[16]=m,e[17]=v,e[18]=p,e[19]=A,e[20]=T):T=e[20],T},dm=t=>{const e=z.c(11);let i,a;e[0]!==t?({className:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);const s=Zo();let r;e[3]!==i?(r=le("text-muted-foreground text-sm tabular-nums",i),e[3]=i,e[4]=r):r=e[4];let n;e[5]!==s?(n=Yo(s),e[5]=s,e[6]=n):n=e[6];let l;return e[7]!==a||e[8]!==r||e[9]!==n?(l=d.jsx("span",{...a,className:r,children:n}),e[7]=a,e[8]=r,e[9]=n,e[10]=l):l=e[10],l},cm=t=>{const e=z.c(11);let i,a;e[0]!==t?({className:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);const s=si();let r;e[3]!==i?(r=le("text-muted-foreground text-sm tabular-nums",i),e[3]=i,e[4]=r):r=e[4];let n;e[5]!==s.duration?(n=s.duration!==null&&s.duration!==void 0&&!Number.isNaN(s.duration)?Yo(s.duration):"--:--",e[5]=s.duration,e[6]=n):n=e[6];let l;return e[7]!==a||e[8]!==r||e[9]!==n?(l=d.jsx("span",{...a,className:r,children:n}),e[7]=a,e[8]=r,e[9]=n,e[10]=l):l=e[10],l};function um(t){const e=z.c(5),{className:i}=t;let a;e[0]!==i?(a=le("border-muted border-t-foreground size-3.5 animate-spin rounded-full border-2",i),e[0]=i,e[1]=a):a=e[1];let s;e[2]===Symbol.for("react.memo_cache_sentinel")?(s=d.jsx("span",{className:"sr-only",children:"Loading..."}),e[2]=s):s=e[2];let r;return e[3]!==a?(r=d.jsx("div",{className:a,role:"status","aria-label":"Loading",children:s}),e[3]=a,e[4]=r):r=e[4],r}const vn=t=>{const e=z.c(25);let i,a,s,r,n,l;e[0]!==t?({playing:l,onPlayingChange:r,className:i,onClick:s,loading:a,...n}=t,e[0]=t,e[1]=i,e[2]=a,e[3]=s,e[4]=r,e[5]=n,e[6]=l):(i=e[1],a=e[2],s=e[3],r=e[4],n=e[5],l=e[6]);let c;e[7]!==s||e[8]!==r||e[9]!==l?(c=A=>{r(!l),s?.(A)},e[7]=s,e[8]=r,e[9]=l,e[10]=c):c=e[10];let _;e[11]!==i?(_=le("relative",i),e[11]=i,e[12]=_):_=e[12];const E=l?"Pause":"Play";let m;e[13]!==a||e[14]!==l?(m=l?d.jsx(Ml,{className:le("size-4",a&&"opacity-0"),"aria-hidden":"true"}):d.jsx(Fl,{className:le("size-4",a&&"opacity-0"),"aria-hidden":"true"}),e[13]=a,e[14]=l,e[15]=m):m=e[15];let v;e[16]!==a?(v=a&&d.jsx("div",{className:"absolute inset-0 flex items-center justify-center rounded-[inherit] backdrop-blur-xs",children:d.jsx(um,{})}),e[16]=a,e[17]=v):v=e[17];let p;return e[18]!==n||e[19]!==c||e[20]!==_||e[21]!==E||e[22]!==m||e[23]!==v?(p=d.jsxs(at,{...n,onClick:c,className:_,"aria-label":E,type:"button",children:[m,v]}),e[18]=n,e[19]=c,e[20]=_,e[21]=E,e[22]=m,e[23]=v,e[24]=p):p=e[24],p};function hm(t){const e=z.c(24);let i,a;e[0]!==t?({item:i,...a}=t,e[0]=t,e[1]=i,e[2]=a):(i=e[1],a=e[2]);const s=si();if(!i){let _;e[3]!==s?(_=v=>{v?s.play():s.pause()},e[3]=s,e[4]=_):_=e[4];const E=s.isBuffering&&s.isPlaying;let m;return e[5]!==a||e[6]!==s.isPlaying||e[7]!==_||e[8]!==E?(m=d.jsx(vn,{...a,playing:s.isPlaying,onPlayingChange:_,loading:E}),e[5]=a,e[6]=s.isPlaying,e[7]=_,e[8]=E,e[9]=m):m=e[9],m}let r;e[10]!==i.id||e[11]!==s?(r=s.isItemActive(i.id)&&s.isPlaying,e[10]=i.id,e[11]=s,e[12]=r):r=e[12];let n;e[13]!==i||e[14]!==s?(n=_=>{_?s.play(i):s.pause()},e[13]=i,e[14]=s,e[15]=n):n=e[15];let l;e[16]!==i.id||e[17]!==s?(l=s.isItemActive(i.id)&&s.isBuffering&&s.isPlaying,e[16]=i.id,e[17]=s,e[18]=l):l=e[18];let c;return e[19]!==a||e[20]!==r||e[21]!==n||e[22]!==l?(c=d.jsx(vn,{...a,playing:r,onPlayingChange:n,loading:l}),e[19]=a,e[20]=r,e[21]=n,e[22]=l,e[23]=c):c=e[23],c}function mm(t){const e=z.c(5),i=w.useRef(null),a=w.useRef(null),s=w.useRef(t);let r,n;e[0]!==t?(r=()=>{s.current=t},n=[t],e[0]=t,e[1]=r,e[2]=n):(r=e[1],n=e[2]),w.useEffect(r,n);let l,c;e[3]===Symbol.for("react.memo_cache_sentinel")?(l=()=>{const _=E=>{if(a.current!==null){const m=E-a.current;s.current(m)}a.current=E,i.current=requestAnimationFrame(_)};return i.current=requestAnimationFrame(_),()=>{i.current&&cancelAnimationFrame(i.current),a.current=null}},c=[],e[3]=l,e[4]=c):(l=e[3],c=e[4]),w.useEffect(l,c)}const pm=[.25,.5,.75,1,1.25,1.5,1.75,2];function vm(t){const e=z.c(28);let i,a,s,r,n;e[0]!==t?({speeds:s,className:i,variant:r,size:n,...a}=t,e[0]=t,e[1]=i,e[2]=a,e[3]=s,e[4]=r,e[5]=n):(i=e[1],a=e[2],s=e[3],r=e[4],n=e[5]);const l=s===void 0?pm:s,c=r===void 0?"ghost":r,_=n===void 0?"icon":n,E=si(),m=E.playbackRate;let v;e[6]!==i?(v=le(i),e[6]=i,e[7]=v):v=e[7];let p;e[8]!==a||e[9]!==_||e[10]!==v||e[11]!==c?(p=d.jsx(at,{variant:c,size:_,className:v,"aria-label":"Playback speed",...a}),e[8]=a,e[9]=_,e[10]=v,e[11]=c,e[12]=p):p=e[12];let A;e[13]===Symbol.for("react.memo_cache_sentinel")?(A=d.jsx(Tl,{className:"size-4"}),e[13]=A):A=e[13];let g;e[14]!==p?(g=d.jsx(Sl,{render:p,children:A}),e[14]=p,e[15]=g):g=e[15];let f;if(e[16]!==m||e[17]!==E||e[18]!==l){let T;e[20]!==m||e[21]!==E?(T=S=>d.jsxs(Il,{onClick:()=>E.setPlaybackRate(S),className:"flex items-center justify-between",children:[d.jsx("span",{className:S===1?"":"font-mono",children:S===1?"Normal":`${S}x`}),m===S&&d.jsx(Ll,{className:"size-4"})]},S),e[20]=m,e[21]=E,e[22]=T):T=e[22],f=l.map(T),e[16]=m,e[17]=E,e[18]=l,e[19]=f}else f=e[19];let u;e[23]!==f?(u=d.jsx(wl,{align:"end",className:"min-w-[120px]",children:f}),e[23]=f,e[24]=u):u=e[24];let y;return e[25]!==g||e[26]!==u?(y=d.jsxs(kl,{children:[g,u]}),e[25]=g,e[26]=u,e[27]=y):y=e[27],y}const En=[{value:"draft",label:"Draft"},{value:"pending_approval",label:"Pending Approval"},{value:"approved",label:"Approved"},{value:"rejected",label:"Rejected"},{value:"archived",label:"Archived"}];function ms(t,e){const i=Pt(t,e);return typeof i=="string"?i:""}function Em({barCount:t=32}){const e=si(),i=w.useRef(null),a=w.useRef(null),s=w.useRef(null),r=w.useRef(null),n=w.useRef(null),l=w.useCallback(()=>{const c=e.ref.current;if(!(!c||s.current))try{const _=new AudioContext;r.current=_;const E=_.createMediaElementSource(c);s.current=E;const m=_.createAnalyser();m.fftSize=128,m.smoothingTimeConstant=.8,a.current=m,E.connect(m),m.connect(_.destination)}catch{}},[e.ref]);return w.useEffect(()=>{e.isPlaying&&!s.current&&l(),e.isPlaying&&r.current?.state==="suspended"&&r.current.resume()},[e.isPlaying,l]),w.useEffect(()=>{const c=i.current,_=a.current;if(!c)return;const E=c.getContext("2d");if(!E)return;const m=()=>{n.current=requestAnimationFrame(m);const{width:v,height:p}=c;if(E.clearRect(0,0,v,p),!_||!e.isPlaying){const y=v/t,T=2;for(let S=0;S<t;S++){const x=4+Math.sin(S*.5)*3,$=S*y;E.fillStyle="hsl(270 60% 60% / 0.3)",E.beginPath(),E.roundRect($+T/2,p/2-x/2,y-T,x,2),E.fill()}return}const A=_.frequencyBinCount,g=new Uint8Array(A);_.getByteFrequencyData(g);const f=v/t,u=2;for(let y=0;y<t;y++){const T=Math.floor(y/t*A),S=g[T]/255,x=Math.max(4,S*p*.9),$=y*f,ue=p/2-x/2,me=270-S*30,be=50+S*15;E.fillStyle=`hsl(${me} 70% ${be}%)`,E.beginPath(),E.roundRect($+u/2,ue,f-u,x,2),E.fill()}};return m(),()=>{n.current&&cancelAnimationFrame(n.current)}},[e.isPlaying,t]),d.jsx("canvas",{ref:i,width:400,height:80,className:"w-full h-20"})}function fm(t){const e=z.c(5),{audioUrl:i,title:a}=t,s=si(),r=w.useRef(!1);let n,l;return e[0]!==i||e[1]!==s||e[2]!==a?(n=()=>{!r.current&&i&&(r.current=!0,s.setActiveItem({id:"audio-track",src:i,data:{title:a}}))},l=[i,a,s],e[0]=i,e[1]=s,e[2]=a,e[3]=n,e[4]=l):(n=e[3],l=e[4]),w.useEffect(n,l),null}function gm(t){const e=z.c(27),{audioUrl:i,title:a,artistName:s}=t;let r;e[0]!==a?(r={title:a},e[0]=a,e[1]=r):r=e[1];let n;e[2]!==i||e[3]!==r?(n={id:"audio-track",src:i,data:r},e[2]=i,e[3]=r,e[4]=n):n=e[4];const l=n;let c;e[5]!==i||e[6]!==a?(c=d.jsx(fm,{audioUrl:i,title:a}),e[5]=i,e[6]=a,e[7]=c):c=e[7];let _;e[8]!==s?(_=s&&d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx(gn,{className:"h-4 w-4 text-purple-500 shrink-0"}),d.jsx("p",{className:"text-sm text-muted-foreground",children:s})]}),e[8]=s,e[9]=_):_=e[9];let E;e[10]===Symbol.for("react.memo_cache_sentinel")?(E=d.jsx(Em,{barCount:48}),e[10]=E):E=e[10];let m;e[11]===Symbol.for("react.memo_cache_sentinel")?(m=d.jsx(lm,{className:"w-full"}),e[11]=m):m=e[11];let v;e[12]===Symbol.for("react.memo_cache_sentinel")?(v=d.jsx(dm,{className:"text-xs"}),e[12]=v):v=e[12];let p;e[13]!==l?(p=d.jsx("div",{className:"flex items-center gap-2",children:d.jsx(hm,{item:l,variant:"default",size:"icon",className:"h-10 w-10 rounded-full"})}),e[13]=l,e[14]=p):p=e[14];let A;e[15]===Symbol.for("react.memo_cache_sentinel")?(A=d.jsx(cm,{className:"text-xs"}),e[15]=A):A=e[15];let g;e[16]!==p?(g=d.jsxs("div",{className:"flex items-center justify-between",children:[v,p,A]}),e[16]=p,e[17]=g):g=e[17];let f;e[18]===Symbol.for("react.memo_cache_sentinel")?(f=d.jsx("div",{className:"flex justify-center",children:d.jsx(vm,{variant:"ghost",size:"sm"})}),e[18]=f):f=e[18];let u;e[19]!==g?(u=d.jsxs("div",{className:"space-y-2",children:[m,g,f]}),e[19]=g,e[20]=u):u=e[20];let y;e[21]!==u||e[22]!==_?(y=d.jsx("div",{className:"bg-linear-to-br from-purple-500/10 via-purple-500/5 to-transparent px-4 py-5 sm:px-6 sm:py-6",children:d.jsxs("div",{className:"max-w-2xl mx-auto space-y-4",children:[_,E,u]})}),e[21]=u,e[22]=_,e[23]=y):y=e[23];let T;return e[24]!==y||e[25]!==c?(T=d.jsxs(om,{children:[c,y]}),e[24]=y,e[25]=c,e[26]=T):T=e[26],T}function vp(){const{content:t}=wr.useLoaderData(),{locale:e}=ml(),i=rl(),{user:a}=wr.useRouteContext(),s=!!a&&Rl(a.role),[r,n]=w.useState(!1),[l,c]=w.useState(!1),[_,E]=w.useState(!1),[m,v]=w.useState(""),[p,A]=w.useState(!1),[g,f]=w.useState(!1),u=t,y=Pt(u.title,e),T=ms(u.description,e),S=u.churches?Pt(u.churches.name,e):"",x=u.creator,$=x?`${x.first_name||""} ${x.last_name||""}`.trim():"Unknown",ue=async P=>{if(P!==u.status){if(P==="rejected"){E(!0);return}f(!0);try{P==="approved"?await ol({data:{id:u.id,approved_by:u.created_by}}):await ll({data:{id:u.id,status:P}}),Mt.success(`Status changed to ${En.find(B=>B.value===P)?.label||P}`),i.invalidate()}catch(B){console.error("Failed to update status:",B),Mt.error(`Failed to update status: ${B instanceof Error?B.message:"Unknown error"}`)}finally{f(!1)}}},me=async()=>{if(m.trim()){A(!0);try{await cl({data:{id:u.id,rejected_reason:m}}),E(!1),v(""),Mt.success("Content rejected"),i.invalidate()}catch(P){console.error("Failed to reject content:",P),Mt.error(`Failed to reject content: ${P instanceof Error?P.message:"Unknown error"}`)}finally{A(!1)}}},be=async()=>{c(!0);try{await dl({data:{id:u.id}}),Mt.success("Content deleted successfully"),i.navigate({to:"/dashboard/content",search:{page:1,search:void 0}})}catch(P){console.error("Failed to delete content:",P),Mt.error(`Failed to delete content: ${P instanceof Error?P.message:"Unknown error"}`)}finally{c(!1)}};return d.jsxs(d.Fragment,{children:[d.jsx("div",{className:"flex-1 overflow-auto p-6",children:d.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[d.jsxs(at,{variant:"ghost",size:"sm",render:d.jsx(nl,{to:"/dashboard/content",search:{page:1,search:void 0}}),nativeButton:!1,children:[d.jsx(xl,{className:"h-4 w-4 mr-2"}),"Back to Content"]}),d.jsxs("div",{className:"rounded-xl border bg-card overflow-hidden",children:[u.thumbnail_url?d.jsx("div",{className:"h-64 relative",children:d.jsx("img",{src:u.thumbnail_url,alt:y,className:"h-full w-full object-cover"})}):d.jsx("div",{className:"h-48 bg-muted flex items-center justify-center",children:u.content_type==="video"?d.jsx(Cl,{className:"h-16 w-16 text-muted-foreground/30"}):u.content_type==="audio"?d.jsx(gn,{className:"h-16 w-16 text-muted-foreground/30"}):d.jsx(Dl,{className:"h-16 w-16 text-muted-foreground/30"})}),u.content_type==="video"&&u.video_content?.video_url&&d.jsxs(Zh,{className:"w-full aspect-video",children:[d.jsx(nm,{slot:"media",src:u.video_content.video_url}),d.jsxs(Xh,{children:[d.jsx(im,{}),d.jsx(am,{}),d.jsx(sm,{}),d.jsx(Jh,{}),d.jsx(em,{showDuration:!0}),d.jsx(rm,{}),d.jsx(tm,{})]})]}),u.content_type==="audio"&&d.jsx(gm,{audioUrl:u.audio_content?.audio_url||"",title:y||"Audio",artistName:u.audio_content?.artist_name?Pt(u.audio_content.artist_name,e):void 0}),d.jsx("div",{className:"p-6",children:d.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4",children:[d.jsxs("div",{children:[d.jsx("h1",{className:"text-xl font-bold tracking-tight",children:y||"Untitled Content"}),d.jsxs("div",{className:"flex flex-wrap gap-2 mt-2",children:[d.jsx(ul,{type:u.content_type}),d.jsx(hl,{status:u.status})]})]}),d.jsxs("div",{className:"flex items-center gap-2 shrink-0",children:[d.jsxs(El,{value:u.status,onValueChange:ue,disabled:g,children:[d.jsx(fl,{className:"w-[180px] h-9 text-sm",children:g?d.jsxs("span",{className:"flex items-center gap-1.5",children:[d.jsx(ns,{className:"h-3.5 w-3.5 animate-spin"}),"Updating..."]}):d.jsx(gl,{})}),d.jsx(_l,{children:En.map(P=>d.jsx(bl,{value:P.value,children:P.label},P.value))})]}),s&&d.jsx(at,{variant:"ghost",size:"icon",className:"text-destructive hover:text-destructive h-9 w-9",onClick:()=>n(!0),children:d.jsx(Pl,{className:"h-4 w-4"})})]})]})})]}),d.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[d.jsxs("div",{className:"rounded-xl border bg-card p-5",children:[d.jsx("h2",{className:"text-sm font-semibold mb-3",children:"Information"}),d.jsxs("div",{className:"divide-y divide-border space-y-0",children:[S&&d.jsxs("div",{className:"flex items-start gap-3 py-3",children:[d.jsx("div",{className:"p-2 rounded-lg bg-muted shrink-0",children:d.jsx(Nl,{className:"h-4 w-4 text-muted-foreground"})}),d.jsxs("div",{children:[d.jsx("p",{className:"text-xs text-muted-foreground",children:"Church"}),d.jsx("p",{className:"text-sm font-medium",children:S})]})]}),d.jsxs("div",{className:"flex items-start gap-3 py-3",children:[d.jsx("div",{className:"p-2 rounded-lg bg-muted shrink-0",children:d.jsx(Ol,{className:"h-4 w-4 text-muted-foreground"})}),d.jsxs("div",{children:[d.jsx("p",{className:"text-xs text-muted-foreground",children:"Created by"}),d.jsx("p",{className:"text-sm font-medium",children:$})]})]}),d.jsxs("div",{className:"flex items-start gap-3 py-3",children:[d.jsx("div",{className:"p-2 rounded-lg bg-muted shrink-0",children:d.jsx(Pr,{className:"h-4 w-4 text-muted-foreground"})}),d.jsxs("div",{children:[d.jsx("p",{className:"text-xs text-muted-foreground",children:"Created"}),d.jsx("p",{className:"text-sm font-medium",children:new Date(u.created_at).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]})]}),u.published_at&&d.jsxs("div",{className:"flex items-start gap-3 py-3",children:[d.jsx("div",{className:"p-2 rounded-lg bg-muted shrink-0",children:d.jsx(Pr,{className:"h-4 w-4 text-muted-foreground"})}),d.jsxs("div",{children:[d.jsx("p",{className:"text-xs text-muted-foreground",children:"Published"}),d.jsx("p",{className:"text-sm font-medium",children:new Date(u.published_at).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]})]})]})]}),d.jsxs("div",{className:"rounded-xl border bg-card p-5",children:[d.jsx("h2",{className:"text-sm font-semibold mb-3",children:"Engagement"}),d.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[d.jsxs("div",{className:"text-center p-3 rounded-lg bg-muted/50",children:[d.jsx(Ul,{className:"h-5 w-5 mx-auto mb-1 text-blue-500"}),d.jsx("p",{className:"text-lg font-bold",children:u.view_count||0}),d.jsx("p",{className:"text-xs text-muted-foreground",children:"Views"})]}),d.jsxs("div",{className:"text-center p-3 rounded-lg bg-muted/50",children:[d.jsx($l,{className:"h-5 w-5 mx-auto mb-1 text-red-500"}),d.jsx("p",{className:"text-lg font-bold",children:u.like_count||0}),d.jsx("p",{className:"text-xs text-muted-foreground",children:"Likes"})]}),d.jsxs("div",{className:"text-center p-3 rounded-lg bg-muted/50",children:[d.jsx(Vl,{className:"h-5 w-5 mx-auto mb-1 text-green-500"}),d.jsx("p",{className:"text-lg font-bold",children:u.share_count||0}),d.jsx("p",{className:"text-xs text-muted-foreground",children:"Shares"})]})]}),u.content_type==="video"&&u.video_content&&d.jsxs("div",{className:"mt-4 pt-4 border-t",children:[d.jsx("h3",{className:"text-xs font-semibold text-muted-foreground mb-2",children:"Video Details"}),d.jsxs("div",{className:"space-y-1 text-sm",children:[u.video_content.duration_seconds&&d.jsxs("p",{children:["Duration:"," ",Math.floor(u.video_content.duration_seconds/60),"m ",u.video_content.duration_seconds%60,"s"]}),u.video_content.resolution&&d.jsxs("p",{children:["Resolution: ",u.video_content.resolution]})]})]}),u.content_type==="audio"&&u.audio_content&&d.jsxs("div",{className:"mt-4 pt-4 border-t",children:[d.jsx("h3",{className:"text-xs font-semibold text-muted-foreground mb-2",children:"Audio Details"}),d.jsxs("div",{className:"space-y-1 text-sm",children:[u.audio_content.duration_seconds&&d.jsxs("p",{children:["Duration:"," ",Math.floor(u.audio_content.duration_seconds/60),"m ",u.audio_content.duration_seconds%60,"s"]}),u.audio_content.genre&&d.jsxs("p",{children:["Genre: ",u.audio_content.genre]}),u.audio_content.artist_name&&d.jsxs("p",{children:["Artist:"," ",Pt(u.audio_content.artist_name,e)]})]})]}),u.content_type==="article"&&u.article_content&&d.jsxs("div",{className:"mt-4 pt-4 border-t",children:[d.jsx("h3",{className:"text-xs font-semibold text-muted-foreground mb-2",children:"Article Details"}),d.jsxs("div",{className:"space-y-1 text-sm",children:[u.article_content.read_time_minutes&&d.jsxs("p",{children:["Read time: ",u.article_content.read_time_minutes," ","min"]}),u.article_content.author_name&&d.jsxs("p",{children:["Author:"," ",Pt(u.article_content.author_name,e)]})]})]})]}),T&&d.jsxs("div",{className:"rounded-xl border bg-card p-5 md:col-span-2",children:[d.jsx("h2",{className:"text-sm font-semibold mb-3",children:"Description"}),d.jsx("div",{className:"text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none",dangerouslySetInnerHTML:{__html:T}})]}),u.content_type==="article"&&u.article_content?.body&&ms(u.article_content.body,e)&&d.jsxs("div",{className:"rounded-xl border bg-card p-5 md:col-span-2",children:[d.jsx("h2",{className:"text-sm font-semibold mb-3",children:"Article Body"}),d.jsx("div",{className:"text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none",dangerouslySetInnerHTML:{__html:ms(u.article_content.body,e)}})]}),u.rejected_reason&&d.jsxs("div",{className:"rounded-xl border border-destructive/30 bg-destructive/5 p-5 md:col-span-2",children:[d.jsx("h2",{className:"text-sm font-semibold text-destructive mb-2",children:"Rejection Reason"}),d.jsx("p",{className:"text-sm text-muted-foreground",children:u.rejected_reason})]})]})]})}),d.jsx(kr,{open:r,onOpenChange:n,children:d.jsxs(Mr,{children:[d.jsxs(Lr,{children:[d.jsx(Rr,{children:"Delete Content"}),d.jsxs(xr,{children:['Are you sure you want to delete "',y,'"? This action cannot be undone.']})]}),d.jsxs(Cr,{children:[d.jsx(at,{variant:"outline",onClick:()=>n(!1),disabled:l,children:"Cancel"}),d.jsx(at,{variant:"destructive",onClick:be,disabled:l,children:l?d.jsxs(d.Fragment,{children:[d.jsx(ns,{className:"h-4 w-4 mr-2 animate-spin"}),"Deleting..."]}):"Delete"})]})]})}),d.jsx(kr,{open:_,onOpenChange:E,children:d.jsxs(Mr,{children:[d.jsxs(Lr,{children:[d.jsx(Rr,{children:"Reject Content"}),d.jsx(xr,{children:"Provide a reason for rejecting this content."})]}),d.jsxs("div",{className:"space-y-2",children:[d.jsx(vl,{children:"Reason"}),d.jsx(pl,{placeholder:"Enter rejection reason...",value:m,onChange:P=>v(P.target.value)})]}),d.jsxs(Cr,{children:[d.jsx(at,{variant:"outline",onClick:()=>E(!1),disabled:p,children:"Cancel"}),d.jsx(at,{variant:"destructive",onClick:me,disabled:p||!m.trim(),children:p?d.jsxs(d.Fragment,{children:[d.jsx(ns,{className:"h-4 w-4 mr-2 animate-spin"}),"Rejecting..."]}):"Reject"})]})]})})]})}export{vp as component};
