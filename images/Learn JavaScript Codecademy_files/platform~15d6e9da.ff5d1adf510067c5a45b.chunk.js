(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[396],{xDdU:function(e,n,o){var r,s,c=o("4fRq"),i=o("I2ZF"),v=0,u=0;e.exports=function v1(e,n,o){var _=n&&o||0,a=n||[],d=(e=e||{}).node||r,l=void 0!==e.clockseq?e.clockseq:s;if(null==d||null==l){var t=c();null==d&&(d=r=[1|t[0],t[1],t[2],t[3],t[4],t[5]]),null==l&&(l=s=16383&(t[6]<<8|t[7]))}var D=void 0!==e.msecs?e.msecs:(new Date).getTime(),w=void 0!==e.nsecs?e.nsecs:u+1,f=D-v+(w-u)/1e4;if(f<0&&void 0===e.clockseq&&(l=l+1&16383),(f<0||D>v)&&void 0===e.nsecs&&(w=0),w>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");v=D,u=w,s=l;var A=(1e4*(268435455&(D+=122192928e5))+w)%4294967296;a[_++]=A>>>24&255,a[_++]=A>>>16&255,a[_++]=A>>>8&255,a[_++]=255&A;var L=D/4294967296*1e4&268435455;a[_++]=L>>>8&255,a[_++]=255&L,a[_++]=L>>>24&15|16,a[_++]=L>>>16&255,a[_++]=l>>>8|128,a[_++]=255&l;for(var E=0;E<6;++E)a[_+E]=d[E];return n||i(a)}}}]);
//# sourceMappingURL=platform~15d6e9da.ff5d1adf510067c5a45b.chunk.js.map