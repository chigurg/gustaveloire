(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[240],{K7ZU:function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));var c=n("q1tI"),s=n.n(c),o=n("ubkB"),a=n("omgv"),r=n("c2gB"),i=n("rePB"),u=n("TSYQ"),d=n.n(u),m="statusContainer__3jqF66GkzYji8iZ8PKGJHi",l="status__1xixEmSW42L9uMqrQ_8IKl",_="statusGlow__3POOMXjbvBNuOLA7I-CURf",g="statusStable__3TtBRmD-c8s3_hdgfketVZ",f="statusNeutral__L81daAg6gBzVXfW9ccgO1",O="statusError__3mZh8o43pNYu0Sp0hkfPol",C="statusSuccess__1VjXCSmQ6YHYAEfTf3ul6D",b="statusHidden__1pCJ98l74D5R6MJXsFQPGY",j=n("ODXe"),S=function WorkspaceStatus(e){var t,n=e.message,o=e.mode,a=function useModeVisibility(e){var t=Object(c.useRef)(),n=Object(c.useState)(!1),s=Object(j.a)(n,2),o=s[0],a=s[1];return Object(c.useEffect)((function(){if(a(!0),"success"===e){var n=function cancel(){null!=t&&t.current&&clearTimeout(t.current)};return n(),t.current=setTimeout((function(){a(!1)}),3e3),n}}),[e]),o}(o),r="neutral"===o,u=d()((t={},Object(i.a)(t,l,!0),Object(i.a)(t,f,r),Object(i.a)(t,O,"error"===o||"idle"===o),Object(i.a)(t,C,"success"===o),Object(i.a)(t,g,"error"!==o),Object(i.a)(t,b,!a),t));return s.a.createElement("div",{className:m},s.a.createElement("div",{className:u},s.a.createElement("span",{"aria-live":"polite","data-testid":"connection-status-message"},n),s.a.createElement("div",{className:_})))},E={connecting:{message:"Connecting to Codecademy",mode:"neutral"},connected:{message:"Connected to Codecademy",mode:"success"},disconnecting:{message:"Unable to connect to Codecademy. Refresh the page to reconnect.",mode:"error"},disconnected:{message:"Lost connection to Codecademy",mode:"error"},failed:{message:"Lost connection to Codecademy",mode:"error"},idle:{message:"Session timed out.",mode:"idle"},initializing:{message:"Connecting to Codecademy",mode:"neutral"},offline:{message:"No internet connection. Please connect to the internet and refresh the page.",mode:"error"},ready:{message:"Connected to Codecademy",mode:"success"},reconnecting:{message:"Connecting to Codecademy",mode:"neutral"}},p=function ConnectedWorkspaceStatus(){var e=Object(r.c)(),t=Object(o.useSelectorWith)(a.c,e.workspaceSlug);return t?s.a.createElement(S,E[t]):null}}}]);
//# sourceMappingURL=240.da6114ef3cc99a92976d.chunk.js.map