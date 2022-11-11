(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[329],{"8nqx":function(e,t,n){"use strict";n.r(t),n.d(t,"PersistentCodeEditorWrapper",(function(){return A}));var a=n("ODXe"),o=n("sEfC"),l=n.n(o),c=n("yrBZ"),i=n("QqFe"),r=n("ZK4f"),s=n("q1tI"),u=n.n(s),d=n("/MKj"),f=n("dIjy"),m=n("z9KF"),b=n("c2gB"),O=n("QtoC"),E=n("GwnQ"),p=n("vfkt"),h=n("akuy"),j=n("bCom"),w=n("Z9Sh"),F=n("rL5b"),v=n("wx14"),_=n("b+vN"),g=n("4Te6"),k=n("swBZ").components.code_editor,S={title:k.reset_workspace_confirmation_title,subtitle:k.reset_workspace_confirmation_content},C=function AuthorModal(e){var t=e.fileName,n=e.closeModal,a=Object(b.c)(),o=a.updateFiles,l=a.openFile;return u.a.createElement(_.a,Object(v.a)({isOpen:!0,cancel:n,action:function addFile(){var e=new g.a({path:t,content:""});o([e]),l(t),n()}},function authorContent(e){return{actionText:"Add File",title:"".concat(e," does not exist"),subtitle:"".concat(e," was set as a default file in Author but does not exist in the workspace yet.")}}(t)))},x=function LearnerModal(e){var t=e.fileName,n=e.closeModal,o=Object(s.useState)(!1),l=Object(a.a)(o,2),c=l[0],i=l[1],r=Object(b.c)().restoreInitialSavepoint,d=function cancelAndClose(){n(),i(!1)};return c?u.a.createElement(_.a,Object(v.a)({isOpen:!0,cancel:d,action:function resetFiles(){d(),r()}},S)):u.a.createElement(_.a,Object(v.a)({isOpen:!0,cancel:d,action:function action(){return i(!0)}},function initialContent(e){return{actionText:"Reset Files",cancelText:"Ok",title:"Whoa there!",subtitle:"".concat(e," has been moved. This will cause problems with this exercise, please move ").concat(e," back to its original location, or reset your files.")}}(t)))},B=function MissingFileModal(e){var t=e.defaultFiles,n=Object(d.useSelector)(O.b),o=Object(s.useState)(!1),l=Object(a.a)(o,2),c=l[0],i=l[1],r=Object(b.c)(),f=r.fileIndex,m=r.submitting;if(c||!f||!m)return null;var p=m.isSubmitting&&m.action===E.c.Reset,h=Object.fromEntries(Object.entries(f).filter((function(e){return"file"===Object(a.a)(e,2)[1]}))),j=t.find((function(e){return!h[e]}));return p||!j?null:n?u.a.createElement(C,{fileName:j,closeModal:function closeModal(){return i(!0)}}):u.a.createElement(x,{fileName:j,closeModal:function closeModal(){return i(!0)}})},M="loader__2h3yLmGmMRU1DEZmVhlSFw",y="codeEditor__1zGkuHOGsgQDqYDvB95kRZ",D=n("ytuh"),A=function PersistentCodeEditorWrapper(e){var t=e.config,n=e.shouldShowCheckWorkButton,o=void 0!==n&&n,v=e.toggleFullScreen,_=Object(b.c)(),g=_.files,k=_.currentFile,S=_.ready,C=_.openFile,x=_.openFiles,A=_.closeFile,L=_.requestFile,N=_.updateFile,T=_.fetchWorkspace,G=_.persistWorkspace,R=_.workspaceSlug,W=Object(d.useSelector)(O.b),Z=k?null==g?void 0:g[k]:null,q=k&&Boolean(Z),K=Object(s.useState)(!1),H=Object(a.a)(K,2),I=H[0],Q=H[1],z=t.no_run_button;Object(s.useEffect)((function(){I&&T()}),[I,T]),Object(s.useEffect)((function(){S&&k&&!q&&L(k)}),[k,q,S,L,R]);var P=Object(s.useMemo)((function(){return l()(G,2e3)}),[G]),U=Object(s.useCallback)((function(e){N(e),P()}),[P,N]),V=Object(w.b)(),X=Object(s.useState)(),Y=Object(a.a)(X,2),J=Y[0],$=Y[1],ee=Object(s.useCallback)((function(){Q(!I)}),[Q,I]),te=u.a.createElement(u.a.Fragment,null,u.a.createElement(F.a,null),u.a.createElement("div",{className:M},u.a.createElement(m.a,null)));if(!S)return te;var ne=u.a.createElement(c.b,{center:!0,column:!0,flexGrow:1,"data-testid":"code-editor-placeholder"},u.a.createElement(r.a,{size:48}),u.a.createElement("div",{style:{marginTop:15}},"Code Editor"),!I&&u.a.createElement(i.d,{mt:24,onClick:function onClick(){return Q(!0)},variant:"secondary"},"Open file")),ae=x.length?te:ne,oe=t.navigator_disabled&&!W,le=Boolean(!o&&k),ce=!oe&&I;return u.a.createElement(c.b,{flexDirection:"row",flexGrow:1,maxHeight:"100%"},ce&&u.a.createElement(f.a,{open:!0,toggleLayout:ee,controls:W&&u.a.createElement(h.a,{justTheSavepoints:!0})}),t.files&&u.a.createElement(B,{defaultFiles:t.files}),u.a.createElement(c.b,{flexBasis:"0%",flexDirection:"column",flexGrow:1,overflow:"hidden"},u.a.createElement(D.a,{toggleFullScreen:v,canCloseFiles:!oe,canEditFiles:!oe,currentFileName:k,openFiles:x,onOpenFile:C,onCloseFile:A,navOpen:I,onToggleNav:ee}),u.a.createElement(c.b,{column:!0,flexGrow:1},q&&k?u.a.createElement(p.a,{className:y,file:g[k],key:k,onEditorLoad:$,updateFile:z?U:N}):ae),u.a.createElement(j.a,{submitMode:E.d.RunAndTest,editor:J,showRunButton:le,showReviewButton:V===w.a.Review,showSolutionButton:V===w.a.Solution,showPrettifyButton:!0})))};t.default=A}}]);
//# sourceMappingURL=LayoutComponents-PersistentCodeEditor~dc7195f0.4808f6ea0467791908c3.chunk.js.map