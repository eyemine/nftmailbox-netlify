"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8269],{7129:function(e,t,r){r.d(t,{rB:function(){return l0},rr:function(){return c3},sv:function(){return ie}});var i=r(18994),n=r(61127),a=r(56955),o=r(71941),s=r(2265),l=r(31095),c=r(68411),d=r(41379),h=r(51872),u=r(11953),p=r(64775),m=r(57437),f=r(36288),g=r(81224),w=r(14228),x=r(11490),y=r(79655),v=r(26469),b=r(54887),C=r(24969),j=r(33753),k=r(96689),E=r(34424),_=r(25587),P=r(39427),S=r(25633),T=r(52466),A=r(70432),N=r(55972),I=r(35518),O=r(42893),F=r(10887),R=r(31706),L=r(91543),M=r(19367),W=r(11226),U=r(83179),D=r.n(U),Z=r(50683),z=r(54184),$=r(57548),B=r(36108),H=r(84209),G=r(49186),q=r(49863),V=r(34729),K=r(32938),Y=r(75298),Q=r(77150),J=r(82929),X=r(20387),ee=r(3042),et=r(49149),er=r(20407),ei=r(7405),en=r(68532),ea=r(46538),eo=r(11007),es=r(3217),el=r(95705),ec=r(80700),ed=r(77227),eh=r(91183),eu=r(59372),ep=r(79900),em=r(35785),ef=r(46250),eg=r(97747),ew=r(9805),ex=r(33097),ey=r(92598),ev=r(76303),eb=r(84164),eC=r(14941),ej=r(9951),ek=r(52501),eE=r(57273),e_=r(58337),eP=r(10375),eS=(e,t,r)=>{if(!t.has(e))throw TypeError("Cannot "+r)},eT=(e,t,r)=>(eS(e,t,"read from private field"),r?r.call(e):t.get(e)),eA=(e,t,r)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,r)},eN=(e,t,r,i)=>(eS(e,t,"write to private field"),i?i.call(e,r):t.set(e,r),r),eI=(e,t,r)=>(eS(e,t,"access private method"),r),eO=class extends Error{constructor(e,t,r){super(e),t instanceof Error&&(this.cause=t),this.privyErrorCode=r}toString(){return`${this.type}${this.privyErrorCode?`-${this.privyErrorCode}`:""}: ${this.message}${this.cause?` [cause: ${this.cause}]`:""}`}},eF=class extends eO{constructor(e,t,r,i,n){super(r,i,n),this.type=e,this.status=t}},eR=class extends eO{constructor(e,t,r){super(e,t,r),this.type="client_error"}},eL=class extends eR{constructor(){super("Request timed out",void 0,"client_request_timeout")}},eM=class extends eO{constructor(e,t,r){super(e,t,r),this.type="connector_error"}},eW=e=>{if(e instanceof eO)return e;if(!(e instanceof c.F))return eU(e);if(!e.response)return new eF("api_error",null,e.message,e);let{type:t,message:r,error:i,code:n}=e.data;return new eF(t||"ApiError",e.response.status,r||i,e,n)},eU=e=>e instanceof eO?e:e instanceof Error?new eR(e.message,e):new eR(`Internal error: ${e}`),eD=class extends eR{constructor(){super("Method called before `ready`. Ensure you wait until `ready` is true before calling.")}},eZ=class extends eR{constructor(e="Embedded wallet error",t){super(e,t,"unknown_embedded_wallet_error")}},ez=class extends eR{constructor(e="User must be authenticated"){super(e,void 0,"must_be_authenticated")}},e$=()=>"/api/v1/sessions",eB=()=>"/api/v1/sessions/logout",eH=()=>"/api/v1/sessions/fork",eG=()=>"/api/v1/sessions/fork/recover",eq=()=>"/api/v1/siwe/init",eV=()=>"/api/v1/siwe/authenticate",eK=()=>"/api/v1/siwe/link",eY=()=>"/api/v1/farcaster/init",eQ=()=>"/api/v1/farcaster/authenticate",eJ=()=>"/api/v1/farcaster/link",eX=()=>"/api/v1/farcaster/status",e0=()=>"/api/v1/passwordless/init",e1=()=>"/api/v1/passwordless/authenticate",e2=()=>"/api/v1/passwordless/link",e3=()=>"/api/v1/passwordless_sms/init",e4=()=>"/api/v1/passwordless_sms/authenticate",e5=()=>"/api/v1/passwordless_sms/link",e6=()=>"/api/v1/oauth/init",e8=()=>"/api/v1/oauth/authenticate",e7=()=>"/api/v1/oauth/link",e9=()=>"/api/v1/siwe/unlink",te=()=>"/api/v1/passwordless/unlink",tt=()=>"/api/v1/passwordless_sms/unlink",tr=()=>"/api/v1/oauth/unlink",ti=()=>"/api/v1/farcaster/unlink",tn=()=>"/api/v1/analytics_events",ta=()=>"/api/v1/plugins/moonpay_on_ramp/sign",to=()=>"/api/v1/custom_jwt_account/authenticate",ts=()=>"/api/v1/mfa/passwordless_sms/init",tl=()=>"/api/v1/mfa/passwordless_sms/enroll",tc=class{constructor(e){this.meta={token:e}}async authenticate(){if(!this.api)throw new eR("Auth flow has no API instance");try{let e=to(),t=await this.api.post(e,{token:this.meta.token});return{user:t.user,token:t.token,refresh_token:t.refresh_token,is_new_user:t.is_new_user}}catch(e){throw eW(e)}}async link(){throw Error("Unimplemented")}},td=class{constructor(e,t){this.meta={email:e,captchaToken:t}}async authenticate(){if(!this.api)throw new eR("Auth flow has no API instance");if(!this.meta.email||!this.meta.emailCode)throw new eR("Email and email code must be set prior to calling authenticate.");try{let e=e1(),t=await this.api.post(e,{email:this.meta.email,code:this.meta.emailCode});return{user:t.user,token:t.token,refresh_token:t.refresh_token,is_new_user:t.is_new_user}}catch(e){throw eW(e)}}async link(){if(!this.api)throw new eR("Auth flow has no API instance");if(!this.meta.email||!this.meta.emailCode)throw new eR("Email and email code must be set prior to calling authenticate.");try{let e=e2();return await this.api.post(e,{email:this.meta.email,code:this.meta.emailCode})}catch(e){throw eW(e)}}async sendCodeEmail(e,t){if(!this.api)throw new eR("Auth flow has no API instance");if(e&&(this.meta.email=e),t&&(this.meta.captchaToken=t),!this.meta.email)throw new eR("Email must be set when initialzing authentication.");try{let e=e0();return await this.api.post(e,{email:this.meta.email,token:this.meta.captchaToken})}catch(e){throw eW(e)}}},th=class{constructor(e){this.promise=null,this.fn=e}execute(e){return null===this.promise&&(this.promise=(async()=>{try{return await this.fn(e)}finally{this.promise=null}})()),this.promise}},tu=class{constructor(e){this._meta={},this.captchaToken=e,this.startChannelOnce=new th(this._startChannelOnce.bind(this)),this.pollForReady=new th(this._pollForReady.bind(this))}get meta(){return this._meta}async authenticate(){if(!this.api)throw new eR("Auth flow has no API instance");if(!this.meta.channelToken)throw new eR("Auth flow must be initialized first");try{let e=await this.api.post(eQ(),{channel_token:this.meta.channelToken,message:this.message,signature:this.signature,farcaster_id:this.fid});if(!e)throw new eR("No response from authentication");return{user:e.user,token:e.token,refresh_token:e.refresh_token,is_new_user:e.is_new_user}}catch(e){throw eW(e)}}async link(){if(!this.api)throw new eR("Auth flow has no API instance");try{return await this.api.post(eJ(),{channel_token:this.meta.channelToken,message:this.message,signature:this.signature,farcaster_id:this.fid})}catch(e){throw eW(e)}}async _startChannelOnce(){if(!this.api)throw new eR("Auth flow has no API instance");let e=await this.api.post(eY(),{token:this.captchaToken});this._meta={connectUri:e.connect_uri,channelToken:e.channel_token}}async initializeFarcasterConnect(){if(!this.api)throw new eR("Auth flow has no API instance");await this.startChannelOnce.execute()}async _pollForReady(){if(!this.api)throw new eR("Auth flow has no API instance");if(!this.meta.channelToken)throw new eR("Auth flow must be initialized first");let e=await this.api.get(eX(),{headers:{"farcaster-channel-token":this.meta.channelToken}});return"completed"===e.state&&(this.message=e.message,this.signature=e.signature,this.fid=e.fid,!0)}},tp="4df5e2316331463a9130964bd6078dfa",tm="https://auth.privy.io",tf="privy:token",tg="privy-token",tw="privy:refresh_token",tx="privy-refresh-token",ty="privy-session",tv="privy:session_transfer_token",tb="privy:caid",tC="privy:state_code",tj="privy:code_verifier",tk=e=>`privy:wallet:${e}`,tE="privy:connectors",t_="privy:connections",tP=1,tS=["function getL1Fee(bytes memory _data) external view returns (uint256)"];async function tT(e){let t=new TextEncoder().encode(e),r=await crypto.subtle.digest("SHA-256",t);return new Uint8Array(r)}var tA=class{constructor(){this._cache={}}get(e){return this._cache[e]}put(e,t){void 0!==t?this._cache[e]=t:this.del(e)}del(e){delete this._cache[e]}getKeys(){return Object.keys(this._cache)}},tN=class{get(e){let t=localStorage.getItem(e);return null===t?void 0:JSON.parse(t)}put(e,t){void 0!==t?localStorage.setItem(e,JSON.stringify(t)):this.del(e)}del(e){localStorage.removeItem(e)}getKeys(){return Object.entries(localStorage).map(([e])=>e)}},tI=class{get(e){let t=sessionStorage.getItem(e);return null===t?void 0:JSON.parse(t)}put(e,t){void 0!==t?sessionStorage.setItem(e,JSON.stringify(t)):this.del(e)}del(e){sessionStorage.removeItem(e)}getKeys(){return Object.entries(sessionStorage).map(([e])=>e)}},tO="u">typeof window&&window.sessionStorage?new tI:new tA,tF="u">typeof window&&window.localStorage?new tN:new tA,tR="S256",tL=class{constructor(e,t,r){this.meta={provider:e},this.meta.authorizationCode=t,this.meta.stateCode=r}addCaptchaToken(e){this.meta.captchaToken=e}isActive(){return!!(this.meta.authorizationCode&&this.meta.stateCode&&this.meta.provider)}async authenticate(){if(!this.api)throw new eR("Auth flow has no API instance");if(!this.meta.authorizationCode||!this.meta.stateCode)throw new eR("[OAuth AuthFlow] Authorization and state codes code must be set prior to calling authenticate.");if("undefined"===this.meta.authorizationCode)throw new eR("User denied confirmation during OAuth flow");let e=tO.get(tj);if(!e)throw new eR("Authentication error.");try{let t=e8(),r=await this.api.post(t,{authorization_code:this.meta.authorizationCode,state_code:this.meta.stateCode,code_verifier:e});return tO.del(tj),{user:r.user,token:r.token,refresh_token:r.refresh_token,is_new_user:r.is_new_user}}catch(t){let e=eW(t);throw e.privyErrorCode?new eR(e.message||"Invalid code during OAuth flow.",void 0,e.privyErrorCode):"User denied confirmation during OAuth flow"===e.message?new eR("Invalid code during oauth flow.",void 0,"oauth_user_denied"):new eR("Invalid code during OAuth flow.",void 0,"unknown_auth_error")}}async link(){if(!this.api)throw new eR("Auth flow has no API instance");if(!this.meta.authorizationCode||!this.meta.stateCode)throw new eR("[OAuth AuthFlow] Authorization and state codes code must be set prior to calling link.");if("undefined"===this.meta.authorizationCode)throw new eR("User denied confirmation during OAuth flow");let e=tO.get(tj);if(!e)throw new eR("Authentication error.");try{let t=e7(),r=await this.api.post(t,{authorization_code:this.meta.authorizationCode,state_code:this.meta.stateCode,code_verifier:e});return tO.del(tj),r}catch(e){throw eW(e)}}createCodeVerifier(){return d.c(crypto.getRandomValues(new Uint8Array(36)))}createStateCode(){return this.createCodeVerifier()}async deriveCodeChallengeFromCodeVerifier(e,t=tR){if("S256"!=t)return e;{let t=await tT(e);return d.c(t)}}async getAuthorizationUrl(){if(!this.api)throw new eR("Auth flow has no API instance");if(!this.meta.provider)throw new eR("Provider must be set when initializing OAuth authentication.");let e=this.createCodeVerifier();tO.put(tj,e);let t=this.createStateCode();tO.put(tC,t);let r=await this.deriveCodeChallengeFromCodeVerifier(e);try{let e=e6();return await this.api.post(e,{provider:this.meta.provider,redirect_to:window.location.href,token:this.meta.captchaToken,code_challenge:r,state_code:t})}catch(e){throw eW(e)}}},tM=class{constructor(e,t){this.createSiweMessage=(e,t,r,i,n,a,o)=>`${r} wants you to sign in with your Ethereum account:
${t}

${o}

URI: ${i}
Version: 1
Chain ID: ${e}
Nonce: ${a}
Issued At: ${n}
Resources:
- https://privy.io`,this.getNonceOnce=new th(this._getNonceOnce.bind(this)),this.wallet=e,this.captchaToken=t}get meta(){return{connectorType:this.wallet.connectorType,walletClientType:this.wallet.walletClientType}}async authenticate(){if(!this.api)throw new eR("Auth flow has no API instance");try{let{message:e,signature:t}=await this.sign(),r=await this.api.post(eV(),{message:e,signature:t,chainId:this.wallet.chainId,walletClientType:this.wallet.walletClientType,connectorType:this.wallet.connectorType});return{user:r.user,token:r.token,refresh_token:r.refresh_token,is_new_user:r.is_new_user}}catch(e){throw eW(e)}}async link(){if(!this.api)throw new eR("Auth flow has no API instance");try{let{message:e,signature:t}=await this.sign();return await this.api.post(eK(),{message:e,signature:t,chainId:this.wallet.chainId,walletClientType:this.wallet.walletClientType,connectorType:this.wallet.connectorType})}catch(e){throw eW(e)}}async sign(){if(!this.api)throw new eR("Auth flow has no API instance");if(await this.buildSiweMessage(),!this.preparedMessage)throw new eR("Could not prepare SIWE message");let e=await this.wallet.sign(this.preparedMessage);return{message:this.preparedMessage,signature:e}}async _getNonceOnce(){if(!this.api)throw new eR("Auth flow has no API instance");let e=this.wallet.address;return(await this.api.post(eq(),{address:e,token:this.captchaToken})).nonce}async buildSiweMessage(){if(!this.api)throw new eR("Auth flow has no API instance");let e=this.wallet.address,t=this.wallet.chainId.replace("eip155:","");return this.nonce||(this.nonce=await this.getNonceOnce.execute()),this.preparedMessage=this.prepareMessage(t,e,this.nonce),this.preparedMessage}prepareMessage(e,t,r){let i=window.location.host,n=window.location.origin,a=new Date().toISOString();return this.createSiweMessage(e,t,i,n,a,r,"By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.")}},tW=class{constructor(e,t){this.meta={phoneNumber:e,captchaToken:t}}async authenticate(){if(!this.api)throw new eR("Auth flow has no API instance");if(!this.meta.phoneNumber||!this.meta.smsCode)throw new eR("phone number and sms code must be set prior to calling authenticate.");try{let e=e4(),t=await this.api.post(e,{phoneNumber:this.meta.phoneNumber,code:this.meta.smsCode});return{user:t.user,token:t.token,refresh_token:t.refresh_token,is_new_user:t.is_new_user}}catch(e){throw eW(e)}}async link(){if(!this.api)throw new eR("Auth flow has no API instance");if(!this.meta.phoneNumber||!this.meta.smsCode)throw new eR("phone number and sms code must be set prior to calling authenticate.");try{let e=e5();return await this.api.post(e,{phoneNumber:this.meta.phoneNumber,code:this.meta.smsCode})}catch(e){throw eW(e)}}async sendSmsCode(e,t){if(!this.api)throw new eR("Auth flow has no API instance");if(e&&(this.meta.phoneNumber=e),t&&(this.meta.captchaToken=t),!this.meta.phoneNumber)throw new eR("phone nNumber must be set when initialzing authentication.");try{let e=e3();return await this.api.post(e,{phoneNumber:this.meta.phoneNumber,token:this.meta.captchaToken})}catch(e){throw eW(e)}}};function tU(e){return new Date(1e3*e)}function tD(e,t){return e.sort((e,t)=>t.verifiedAt.getTime()-e.verifiedAt.getTime()),e.find(e=>e.type===t)}var tZ=e=>e?.linkedAccounts.find(e=>"wallet"===e.type&&"privy"===e.walletClientType)||null,tz=e=>e.linkedAccounts.filter(e=>"wallet"===e.type),t$=(e,t)=>"all-users"===t&&!tZ(e)||"users-without-wallets"===t&&!tz(e)?.length;function tB(e){if(!e)return null;let t=function(e){let t=[];for(let r of e){let e=r.type;switch(r.type){case"wallet":let i={address:r.address,type:r.type,verifiedAt:tU(r.verified_at),chainType:"ethereum",chainId:r.chain_id,walletClient:"privy"===r.wallet_client_type?"privy":"unknown",walletClientType:r.wallet_client_type,connectorType:r.connector_type,recoveryMethod:r.recovery_method};t.push(i);break;case"email":let n={address:r.address,type:r.type,verifiedAt:tU(r.verified_at)};t.push(n);break;case"phone":let a={number:r.phoneNumber,type:r.type,verifiedAt:tU(r.verified_at)};t.push(a);break;case"google_oauth":let o={subject:r.subject,email:r.email,name:r.name,type:r.type,verifiedAt:tU(r.verified_at)};t.push(o);break;case"twitter_oauth":let s={subject:r.subject,username:r.username,name:r.name,type:r.type,verifiedAt:tU(r.verified_at)};t.push(s);break;case"discord_oauth":let l={subject:r.subject,username:r.username,email:r.email,type:r.type,verifiedAt:tU(r.verified_at)};t.push(l);break;case"github_oauth":let c={subject:r.subject,username:r.username,name:r.name,email:r.email,type:r.type,verifiedAt:tU(r.verified_at)};t.push(c);break;case"tiktok_oauth":let d={subject:r.subject,username:r.username,type:r.type,verifiedAt:tU(r.verified_at)};t.push(d);break;case"linkedin_oauth":let h={subject:r.subject,name:r.name,email:r.email,type:r.type,verifiedAt:tU(r.verified_at)};t.push(h);break;case"apple_oauth":let u={subject:r.subject,email:r.email,type:r.type,verifiedAt:tU(r.verified_at)};t.push(u);break;case"custom_auth":t.push({type:r.type,customUserId:r.custom_user_id,verifiedAt:tU(r.verified_at)});break;case"farcaster":let p={type:r.type,fid:r.farcaster_id,ownerAddress:r.owner_address,displayName:r.display_name,username:r.username,bio:r.bio,pfp:r.profile_picture,url:r.url,verifiedAt:tU(r.verified_at)};t.push(p);break;default:console.warn(`Unrecognized account type: ${e}. Please consider upgrading the Privy SDK.`)}}return t}(e.linked_accounts),r=tD(t,"wallet"),i=tD(t,"email"),n=tD(t,"phone"),a=tD(t,"google_oauth"),o=tD(t,"twitter_oauth"),s=tD(t,"discord_oauth"),l=tD(t,"github_oauth"),c=tD(t,"tiktok_oauth"),d=tD(t,"linkedin_oauth"),h=tD(t,"apple_oauth"),u=e.mfa_methods.map(({type:e,verified_at:t})=>({type:e,verifiedAt:tU(t)}));return{id:e.id,createdAt:tU(e.created_at),linkedAccounts:t,email:i&&{address:i?.address},phone:n&&{number:n?.number},wallet:r&&{address:r.address,chainType:r.chainType,chainId:r.chainId,walletClient:r.walletClient,walletClientType:r.walletClientType,connectorType:r.connectorType,recoveryMethod:r.recoveryMethod},google:a&&{subject:a.subject,email:a.email,name:a.name},twitter:o&&{subject:o.subject,username:o.username,name:o.name},discord:s&&{subject:s.subject,username:s.username,email:s.email},github:l&&{subject:l.subject,username:l.username,name:l.name,email:l.email},tiktok:c&&{subject:c.subject,username:c.username},linkedin:d&&{subject:d.subject,name:d.name},apple:h&&{subject:h.subject,email:h.email},mfaMethods:u.map(e=>e.type)}}var tH=e=>e.isApexWallet?"Apex Wallet":e.isAvalanche?"Core Wallet":e.isBackpack?"Backpack":e.isBifrost?"Bifrost Wallet":e.isBitKeep?"BitKeep":e.isBitski?"Bitski":e.isBlockWallet?"BlockWallet":e.isBraveWallet?"Brave Wallet":e.isClover?"Clover":e.isCoin98?"Coin98 Wallet":e.isCoinbaseWallet?"Coinbase Wallet":e.isDawn?"Dawn Wallet":e.isDefiant?"Defiant":e.isDesig?"Desig Wallet":e.isEnkrypt?"Enkrypt":e.isExodus?"Exodus":e.isFordefi?"Fordefi":e.isFrame?"Frame":e.isFrontier?"Frontier Wallet":e.isGamestop?"GameStop Wallet":e.isHaqqWallet?"HAQQ Wallet":e.isHyperPay?"HyperPay Wallet":e.isImToken?"ImToken":e.isHaloWallet?"Halo Wallet":e.isKuCoinWallet?"KuCoin Wallet":e.isMathWallet?"MathWallet":e.isNovaWallet?"Nova Wallet":e.isOkxWallet||e.isOKExWallet?"OKX Wallet":e.isOneInchIOSWallet||e.isOneInchAndroidWallet?"1inch Wallet":e.isOneKey?"OneKey Wallet":e.isOpera?"Opera":e.isPhantom?"Phantom":e.isPortal?"Ripio Portal":e.isRabby?"Rabby Wallet":e.isRainbow?"Rainbow":e.isSafePal?"SafePal Wallet":e.isStatus?"Status":e.isSubWallet?"SubWallet":e.isTalisman?"Talisman":e.isTally||e.isTaho?"Taho":e.isTokenPocket?"TokenPocket":e.isTokenary?"Tokenary":e.isTrust||e.isTrustWallet?"Trust Wallet":e.isTTWallet?"TTWallet":e.isXDEFI?"XDEFI Wallet":e.isZeal?"Zeal":e.isZerion?"Zerion":e.isMetaMask?"MetaMask":void 0,tG=(e,t)=>{if(!e.isMetaMask)return!1;if(e.isMetaMask&&!t)return!0;if(e.isBraveWallet&&!e._events&&!e._state||"MetaMask"!==tH(e))return!1;if(e.providers){for(let t of e.providers)if(!tG(t))return!1}return!0},tq=()=>!!("phantom"in window&&window?.phantom?.ethereum?.isPhantom),tV=()=>{let e=window;if(!e.ethereum)return!1;if(e.ethereum.isCoinbaseWallet)return!0;if(e.ethereum.providers){for(let t of e.ethereum.providers)if(t&&t.isCoinbaseWallet)return!0}return!1},tK=e=>!!String(e).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),tY=(e,t)=>{let r=e.slice(0),i=[];for(;r.length;)i.push(r.splice(0,t));return i},tQ=(e,t=3,r=4)=>{if(!e)return"";if(t+r+2+3>=e.length)return e;let i=e.slice(0,2+t),n=e.slice(e.length-r,e.length);return`${i}...${n}`},tJ=e=>new Promise(t=>setTimeout(t,e)),tX=(e,t={})=>{let r=t.delayMs||150,i=t.maxAttempts||270;return new Promise(async(n,a)=>{let o=!1,s=0;for(;!o&&s<i;){if(t.abortSignal?.aborted)return;e().then(()=>{o=!0,n()},(...e)=>{o=!0,a(...e)}),s+=1,await tJ(r)}o||a(Error("Exceeded max attempts before resolving function"))})},t0=(e,t,r={})=>{let i=new URL(t,e);for(let[e,t]of Object.entries(r))i.searchParams.set(e,t);return i.href},t1=e=>e.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,""),t2=e=>"string"==typeof e?e:"0x"+e.toString(16);async function t3(e,t,r=3e3){let i=!1,n=window;return new Promise(a=>{n.ethereum?o():(window.addEventListener("ethereum#initialized",o,{once:!0}),setTimeout(()=>{o()},r));function o(){if(i)return;i=!0,window.removeEventListener("ethereum#initialized",o);let r=e.getProviders(),n=[];for(let e of r)t.includes("coinbase_wallet")&&"com.coinbase.wallet"===e.info.rdns||n.push({type:e.info.name.toLowerCase().replace(/\s/g,"_"),eip6963InjectedProvider:e});for(let e of function(){let e=window,t=e.ethereum;if(!t)return[];let r=[];if(t.providers?.length)for(let e of t.providers)e&&r.push(e);return r.push(e.ethereum),r}()){let t=tH(e);if(!r.some(e=>e.info.name===t)){if(tG(e,!0)&&!n.find(e=>"metamask"===e.type)){n.push({type:"metamask",legacyInjectedProvider:e});continue}if("Phantom"===t&&!n.find(e=>"phantom"===e.type)){n.push({type:"phantom",legacyInjectedProvider:e});continue}n.find(e=>"unknown_browser_extension"===e.type)||n.push({type:"unknown_browser_extension",legacyInjectedProvider:e})}}a(n)}})}function t4(e){return`eip155:${String(Number(e))}`}var t5,t6,t8=(e,t,r)=>{let i,n=Number(e),a=t.find(e=>e.id===n);if(!a)throw new eM(`Unsupported chainId ${e}`,4901);if(!(i=a.rpcUrls.privyWalletOverride&&a.rpcUrls.privyWalletOverride.http[0]?a.rpcUrls.privyWalletOverride.http[0]:r.rpcUrls&&r.rpcUrls[n]?r.rpcUrls[n]:a.rpcUrls.infura?.http[0]?a.rpcUrls.infura.http[0]+"/"+tp:a.rpcUrls.blast?.http[0]?a.rpcUrls.blast.http[0]+"/fe9c30fc-3bc5-4064-91e2-6ab5887f8f4d":a.rpcUrls.default?.http[0]))throw new eM(`No RPC url found for ${e}`);return i},t7=(e,t)=>{let r=Number(e),i=t.find(e=>e.id===r);if(!i)throw new eM(`Unsupported chainId ${e}`,4901);return i.blockExplorers?.default.url},t9=({style:e,...t})=>(0,m.jsxs)("svg",{width:"1024",height:"1024",viewBox:"0 0 1024 1024",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{height:"28px",width:"28px",...e},...t,children:[(0,m.jsx)("rect",{width:"1024",height:"1024",fill:"#0052FF",rx:100,ry:100}),(0,m.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z",fill:"white"})]}),re=["eth_sign","eth_populateTransactionRequest","eth_signTransaction","personal_sign","eth_signTypedData_v4"],rt=e=>re.includes(e),rr=class extends eM{constructor(){super("Wallet timeout"),this.type="wallet_error"}},ri=class extends eM{constructor(){super("User rejected connection"),this.type="wallet_error"}},rn=e=>{if(e instanceof eM)return e;if(e?.code&&e?.reason){let t=new ro(e);return e.code===f.jK.ACTION_REJECTED&&(t.details=rs.E4001_USER_REJECTED_REQUEST),t}return e?.code?new ro(e):new eM("Unknown connector error",e)},ra=class extends eO{constructor(e,t,r){super(e),this.type="provider_error",this.code=t,this.data=r}},ro=class extends ra{constructor(e){super(e.message,e.code,e.data);let t=Object.values(rs).find(t=>t.eipCode===e.code);this.details=t||rs.UNKNOWN_ERROR,-32002===e.code&&(e.message?.includes("already pending for origin")?e.message?.includes("wallet_requestPermissions")?this.details=rs.E32002_CONNECTION_ALREADY_PENDING:this.details=rs.E32002_REQUEST_ALREADY_PENDING:e.message?.includes("Already processing")&&e.message.includes("eth_requestAccounts")&&(this.details=rs.E32002_WALLET_LOCKED))}},rs={UNKNOWN_ERROR:{eipCode:0,message:"Unknown error",detail:"Unknown error",retryable:!0},E4001_DEFAULT_USER_REJECTED_REQUEST:{eipCode:4001,message:"User Rejected Request",detail:"The user rejected the request.",default:!0,retryable:!0},E4100_DEFAULT_UNAUTHORIZED:{eipCode:4100,message:"Unauthorized",detail:"The requested method and/or account has not been authorized by the user.",default:!0,retryable:!1},E4200_DEFAULT_UNSUPPORTED_METHOD:{eipCode:4200,message:"Unsupported Method",detail:"The Provider does not support the requested method.",default:!0,retryable:!1},E4900_DEFAULT_DISCONNECTED:{eipCode:4900,message:"Disconnected",detail:"The Provider is disconnected from all chains.",default:!0,retryable:!0},E4901_DEFAULT_CHAIN_DISCONNECTED:{eipCode:4901,message:"Chain Disconnected",detail:"The Provider is not connected to the requested chain.",default:!0,retryable:!0},E32700_DEFAULT_PARSE_ERROR:{eipCode:-32700,message:"Parse error",detail:"Invalid JSON",default:!0,retryable:!1},E32600_DEFAULT_INVALID_REQUEST:{eipCode:-32600,message:"Invalid request",detail:"JSON is not a valid request object",default:!0,retryable:!1},E32601_DEFAULT_METHOD_NOT_FOUND:{eipCode:-32601,message:"Method not found",detail:"Method does not exist",default:!0,retryable:!1},E32602_DEFAULT_INVALID_PARAMS:{eipCode:-32602,message:"Invalid params",detail:"Invalid method parameters",default:!0,retryable:!1},E32603_DEFAULT_INTERNAL_ERROR:{eipCode:-32603,message:"Internal error",detail:"Internal JSON-RPC error",default:!0,retryable:!0},E32000_DEFAULT_INVALID_INPUT:{eipCode:-32e3,message:"Invalid input",detail:"Missing or invalid parameters",default:!0,retryable:!1},E32001_DEFAULT_RESOURCE_NOT_FOUND:{eipCode:-32001,message:"Resource not found",detail:"Requested resource not found",default:!0,retryable:!1},E32002_DEFAULT_RESOURCE_UNAVAILABLE:{eipCode:-32002,message:"Resource unavailable",detail:"Requested resource not available",default:!0,retryable:!0},E32003_DEFAULT_TRANSACTION_REJECTED:{eipCode:-32003,message:"Transaction rejected",detail:"Transaction creation failed",default:!0,retryable:!0},E32004_DEFAULT_METHOD_NOT_SUPPORTED:{eipCode:-32004,message:"Method not supported",detail:"Method is not implemented",default:!0,retryable:!1},E32005_DEFAULT_LIMIT_EXCEEDED:{eipCode:-32005,message:"Limit exceeded",detail:"Request exceeds defined limit",default:!0,retryable:!1},E32006_DEFAULT_JSON_RPC_VERSION_NOT_SUPPORTED:{eipCode:-32006,message:"JSON-RPC version not supported",detail:"Version of JSON-RPC protocol is not supported",default:!0,retryable:!1},E32002_CONNECTION_ALREADY_PENDING:{eipCode:-32002,message:"Connection request already pending",detail:"Don’t see your wallet? Check your other browser windows.",retryable:!1},E32002_REQUEST_ALREADY_PENDING:{eipCode:-32002,message:"Resource request already pending",detail:"Don’t see your wallet? Check your other browser windows.",retryable:!1},E32002_WALLET_LOCKED:{eipCode:-32002,message:"Wallet might be locked",detail:"Don’t see your wallet? Check your other browser windows.",retryable:!1},E4001_USER_REJECTED_REQUEST:{eipCode:4001,message:"Signature rejected",detail:"Please try signing again.",retryable:!0}},rl={ERROR_USER_EXISTS:{message:"User already exists for this address",detail:"Try another address!",retryable:!1},ERROR_TIMED_OUT:{message:"Wallet request timed out",detail:"Please try connecting again.",retryable:!0},ERROR_WALLET_CONNECTION:{message:"Could not log in with wallet",detail:"Please try connecting again.",retryable:!0},ERROR_USER_REJECTED_CONNECTION:{message:"You rejected the request",detail:"Please try connecting again.",retryable:!0},...rs},rc=class{constructor(e,t){this.removeListener=(e,t)=>{if(this.walletProvider)try{return this.walletProvider.removeListener(e,t)}catch{console.warn("Unable to remove wallet provider listener")}},this.walletTimeout=(e=new rr,t=this.rpcTimeoutDuration)=>new Promise((r,i)=>setTimeout(()=>{i(e)},t)),this.setWalletProvider=e=>{this.walletProvider&&this._subscriptions.forEach(e=>{this.removeListener(e.eventName,e.listener)}),this.walletProvider=e,this._subscriptions.forEach(e=>{this.walletProvider?.on(e.eventName,e.listener)})},this.walletProvider=e,this.rpcTimeoutDuration=t||12e4,this._subscriptions=[]}on(e,t){if(this.walletProvider)return this.walletProvider.on(e,t);this._subscriptions.push({eventName:e,listener:t})}async request(e){if(!this.walletProvider)throw new eM(`A wallet request of type ${e.method} was made before setting a wallet provider.`);return Promise.race([this.walletProvider.request(e),this.walletTimeout()]).catch(e=>{throw rn(e)})}},rd=class extends Error{constructor(e,t,r){super(e),this.code=t,this.data=r}},rh=class extends u.Z{constructor(e,t,r,i,a=1){super(),this.walletProxy=e,this.address=t,this.chainId=a,this.rpcConfig=r,this.chains=i,this.provider=new n.c(t8(a,this.chains,r)),this.rpcTimeoutDuration=rH(r,"privy")}async handleSendTransaction(e){if(!e.params||!Array.isArray(e.params))throw new rd(`Invalid params for ${e.method}`,4200);let t=e.params[0];if(!await cq()||!this.address)throw new rd("Disconnected",4900);return(await c0(t)).hash}handleSwitchEthereumChain(e){let t;if(!e.params||!Array.isArray(e.params))throw new rd(`Invalid params for ${e.method}`,4200);if("string"==typeof e.params[0])t=e.params[0];else if("chainId"in e.params[0]&&"string"==typeof e.params[0].chainId)t=e.params[0].chainId;else throw new rd(`Invalid params for ${e.method}`,4200);this.chainId=Number(t),this.provider=new n.c(t8(this.chainId,this.chains,this.rpcConfig)),this.emit("chainChanged",t)}async handlePersonalSign(e){if(!e.params||!Array.isArray(e.params))throw Error("Invalid params for eth_estimateGas");let t=e.params[0];return await cX(t)}async handleEstimateGas(e){if(!e.params||!Array.isArray(e.params))throw Error("Invalid params for eth_estimateGas");delete e.params[0].gasPrice,delete e.params[0].maxFeePerGas,delete e.params[0].maxPriorityFeePerGas;let t={...e.params[0],chainId:t2(this.chainId)};try{return await this.provider.send("eth_estimateGas",[t])}catch{return delete t.from,await this.provider.send("eth_estimateGas",[t])}}async request(e){switch(console.debug("Embedded1193Provider.request() called with args",e),e.method){case"eth_accounts":case"eth_requestAccounts":return this.address?[this.address]:[];case"eth_chainId":return t2(this.chainId);case"eth_estimateGas":return this.handleEstimateGas(e);case"eth_sendTransaction":return this.handleSendTransaction(e);case"wallet_switchEthereumChain":return this.handleSwitchEthereumChain(e);case"personal_sign":return this.handlePersonalSign(e)}if(!rt(e.method))return this.provider.send(e.method,e.params);{let t=await cq();if(await c1(),!t||!this.address)throw new rd("Disconnected",4900);try{return(await this.walletProxy.rpc({address:this.address,accessToken:t,request:{method:e.method,params:e.params}})).response.data}catch(e){throw console.error(e),new rd("Disconnected",4900)}}}async connect(){let e=await cq();if(!e||!this.address)return null;try{return(await this.walletProxy.connect({address:this.address,accessToken:e})).address}catch(e){return console.error(e),null}}},ru=class extends rc{constructor(e){super(e,e.rpcTimeoutDuration)}},rp=class extends rc{constructor(e){super(e,e.rpcTimeoutDuration)}sendAsync(e,t){throw Error("sendAsync is no longer supported by EIP-1193. Use the request method instead.")}},rm=(e,t)=>"coinbase_wallet"===t?e.message.includes("addEthereumChain"):4902===e.code||e.message?.includes("4902"),rf=class extends u.Z{constructor(e,t,r,i){super(),this.onAccountsChanged=e=>{0===e.length?this.onDisconnect():this.syncAccounts(e)},this.onChainChanged=e=>{this.wallets.forEach(t=>{t.chainId=t4(e),"privy"===this.walletClientType&&tF.put(tk(t.address),e)}),this.emit("walletsUpdated")},this.onDisconnect=()=>{this.connected=!1,this.wallets=[],this.emit("walletsUpdated")},this.onConnect=()=>{this.connected=!0,this.syncAccounts()},this.wallets=[],this.walletClientType=e,this.chains=t,this.defaultChain=r,this.rpcConfig=i,this.rpcTimeoutDuration=rH(i,e),this.connected=!1,this.initialized=!1}buildConnectedWallet(e,t){let r=async()=>!!this.wallets.find(t=>(0,i.Kn)(t.address)===(0,i.Kn)(e));return{address:(0,i.Kn)(e),chainId:t,switchChain:async n=>{let a,o;if(!r)throw new eM("Wallet is not currently connected.");let s=this.wallets.find(t=>i.Kn(t.address)===i.Kn(e))?.chainId;if(!s)throw new eM("Unable to determine current chainId.");if("number"==typeof n?(a=`0x${n.toString(16)}`,o=n):(a=n,o=Number(n)),s===t4(a))return;let l=this.chains.find(e=>e.id===o);if(!l)throw new eM(`Unsupported chainId: ${n}`);let c=async()=>{await this.proxyProvider.request({method:"wallet_switchEthereumChain",params:[{chainId:a}]})};try{return await c()}catch(e){if(rm(e,this.walletClientType))return await this.proxyProvider.request({method:"wallet_addEthereumChain",params:[{chainId:a,chainName:l.name,nativeCurrency:l.nativeCurrency,rpcUrls:[l.rpcUrls.default?.http[0]??""],blockExplorerUrls:[l.blockExplorers?.default.url??""]}]}),c();throw"rainbow"===this.walletClientType&&e.message?.includes("wallet_switchEthereumChain")?new eM(`Rainbow does not support the chainId ${t}`):e}},connectedAt:Date.now(),walletClientType:this.walletClientType,connectorType:this.connectorType,isConnected:r,getEthereumProvider:async()=>{if(!await r())throw new eM("Wallet is not currently connected.");return this.proxyProvider},getEthersProvider:async()=>{if(!await r())throw new eM("Wallet is not currently connected.");return new a.Q(new ru(this.proxyProvider))},getWeb3jsProvider:async()=>{if(!await r())throw new eM("Wallet is not currently connected.");return new rp(this.proxyProvider)},sign:async e=>{if(!await r())throw new eM("Wallet is not currently connected.");return await this.sign(e)},disconnect:()=>{this.disconnect()}}}async syncAccounts(e){let t=e;try{if(void 0===t){let e=await this.proxyProvider.request({method:"eth_accounts"});Array.isArray(e)&&(t=e)}}catch{console.warn("Wallet did not respond to eth_accounts. Defaulting to prefetched accounts.")}if(!t||!Array.isArray(t)||t.length<=0||!t[0])return;let r=t[0],n=(0,i.Kn)(r),a=[],o;if("privy"===this.walletClientType){let e=tF.get(tk(n));this.chains.find(t=>t.id===Number(e))||(tF.del(tk(n)),e=null),o=e||`0x${this.defaultChain.id.toString(16)}`;try{await this.proxyProvider.request({method:"wallet_switchEthereumChain",params:[{chainId:o}]})}catch{console.warn(`Unable to switch embedded wallet to chain ID ${o} on initialization`)}}else try{let e=await this.proxyProvider.request({method:"eth_chainId"});if("string"==typeof e)o=e;else if("number"==typeof e)o=`0x${e.toString(16)}`;else throw Error("Invalid chainId returned from provider")}catch(e){console.warn("Failed to get chainId from provider, defaulting to 0x1",e),o="0x1"}let s=t4(o);a.find(e=>(0,i.Kn)(e.address)===n)||a.push(this.buildConnectedWallet((0,i.Kn)(r),s)),rq(a,this.wallets)||(this.wallets=a,this.emit("walletsUpdated"))}async getConnectedWallet(){let e=await this.proxyProvider.request({method:"eth_accounts"});return this.wallets.sort((e,t)=>t.connectedAt-e.connectedAt).find(t=>e.find(e=>(0,i.Kn)(e)===(0,i.Kn)(t.address)))||null}async isConnected(){let e=await this.proxyProvider.request({method:"eth_accounts"});return Array.isArray(e)&&e.length>0}async sign(e){return await this.connect({showPrompt:!1}),new a.Q(new ru(this.proxyProvider)).getSigner().signMessage(e)}subscribeListeners(){this.proxyProvider.on("accountsChanged",this.onAccountsChanged),this.proxyProvider.on("chainChanged",this.onChainChanged),this.proxyProvider.on("disconnect",this.onDisconnect),this.proxyProvider.on("connect",this.onConnect)}unsubscribeListeners(){this.proxyProvider.removeListener("accountsChanged",this.onAccountsChanged),this.proxyProvider.removeListener("chainChanged",this.onChainChanged),this.proxyProvider.removeListener("disconnect",this.onDisconnect),this.proxyProvider.removeListener("connect",this.onConnect)}},rg=e=>{let t=`https://mainnet.infura.io/v3/${tp}`;return e.makeWeb3Provider(t,1)},rw=class extends rf{constructor(e,t,r){super("coinbase_wallet",e,t,r),this.connectorType="coinbase_wallet",this.proxyProvider=new rc(void 0,this.rpcTimeoutDuration),this.subscribeListeners(),t5||(t5=new p.ZP({appName:"Privy",darkMode:!1,headlessMode:!1,enableMobileWalletLink:!0})),this.proxyProvider.setWalletProvider(rg(t5)),this.syncAccounts().then(()=>{this.emit("initialized"),this.initialized=!0})}async connect(e){return e.showPrompt&&await this.promptConnection(),await this.isConnected()?this.getConnectedWallet():null}disconnect(){t5.disconnect()}get walletBranding(){return{name:"Coinbase Wallet",icon:t9}}async promptConnection(){try{let e=await this.proxyProvider.request({method:"eth_requestAccounts"});if(!e||0===e.length||!e[0])throw new eM("Unable to retrieve accounts");this.connected=!0,await this.syncAccounts([e[0]])}catch(e){throw rn(e)}}},rx=({...e})=>(0,m.jsx)("svg",{width:"15",height:"15",viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,m.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M2.37126 11.0323C2.37126 12.696 3.90598 13.4421 5.40654 13.4468C8.91753 13.4468 12.8021 11.2897 12.7819 7.67984C12.7673 5.07728 10.3748 2.86167 7.54357 2.88296C4.8495 2.88296 2.21821 4.6411 2.21803 7.03628C2.21803 7.67951 2.58722 8.30178 3.55231 8.37184C2.74763 9.16826 2.37126 10.1225 2.37126 11.0323ZM7.55283 8.68012C8.11562 8.68012 8.57186 8.13217 8.57186 7.45624C8.57186 6.78032 8.11562 6.23237 7.55283 6.23237C6.99003 6.23237 6.53379 6.78032 6.53379 7.45624C6.53379 8.13217 6.99003 8.68012 7.55283 8.68012ZM10.4747 8.68012C11.0375 8.68012 11.4937 8.13217 11.4937 7.45625C11.4937 6.78032 11.0375 6.23237 10.4747 6.23237C9.91186 6.23237 9.45562 6.78032 9.45562 7.45625C9.45562 8.13217 9.91186 8.68012 10.4747 8.68012Z",fill:e.color||"var(--privy-color-foreground-3)"})}),ry=class extends rf{constructor(e,t,r,i){super("privy",t,r,i),this.connectorType="embedded",this.proxyProvider=e,this.subscribeListeners(),this.syncAccounts().then(()=>{this.emit("initialized"),this.initialized=!0})}async connect(e){return await this.isConnected()?(await this.proxyProvider.request({method:"wallet_switchEthereumChain",params:[t2(e?.chainId||"0x1")]}),this.getConnectedWallet()):null}get walletBranding(){return{name:"Privy Wallet",icon:rx}}disconnect(){this.connected=!1}async promptConnection(){}},rv=({style:e,...t})=>(0,m.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"currentColor",strokeWidth:1.5,viewBox:"0 0 24 24",style:{...e},...t,children:(0,m.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"})}),rb=({style:e,...t})=>(0,m.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",xmlSpace:"preserve",x:0,y:0,viewBox:"0 0 318.6 318.6",width:"28",height:"28",style:{height:"28px",width:"28px",...e},...t,children:[(0,m.jsx)("style",{children:".s1{stroke-linecap:round;stroke-linejoin:round}.s2{fill:#e4761b;stroke:#e4761b}.s3{fill:#f6851b;stroke:#f6851b}"}),(0,m.jsx)("path",{fill:"#e2761b",stroke:"#e2761b",className:"s1",d:"m274.1 35.5-99.5 73.9L193 65.8z"}),(0,m.jsx)("path",{d:"m44.4 35.5 98.7 74.6-17.5-44.3zm193.9 171.3-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z",className:"s1 s2"}),(0,m.jsx)("path",{d:"m103.6 138.2-15.8 23.9 56.3 2.5-2-60.5zm111.3 0-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5 33.9 16.5-4.7-39.3z",className:"s1 s2"}),(0,m.jsx)("path",{fill:"#d7c1b3",stroke:"#d7c1b3",className:"s1",d:"m211.8 247.4-33.9-16.5 2.7 22.1-.3 9.3zm-105 0 31.5 14.9-.2-9.3 2.5-22.1z"}),(0,m.jsx)("path",{fill:"#233447",stroke:"#233447",className:"s1",d:"m138.8 193.5-28.2-8.3 19.9-9.1zm40.9 0 8.3-17.4 20 9.1z"}),(0,m.jsx)("path",{fill:"#cd6116",stroke:"#cd6116",className:"s1",d:"m106.8 247.4 4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1 20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"}),(0,m.jsx)("path",{fill:"#e4751f",stroke:"#e4751f",className:"s1",d:"m87.8 162.1 23.6 46-.8-22.9zm120.3 23.1-1 22.9 23.7-46zm-64-20.6-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0-2.7 18 1.2 45 6.7-34.1z"}),(0,m.jsx)("path",{d:"m179.8 193.5-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z",className:"s3"}),(0,m.jsx)("path",{fill:"#c0ad9e",stroke:"#c0ad9e",className:"s1",d:"m180.3 262.3.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"}),(0,m.jsx)("path",{fill:"#161616",stroke:"#161616",className:"s1",d:"m177.9 230.9-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"}),(0,m.jsx)("path",{fill:"#763d16",stroke:"#763d16",className:"s1",d:"m278.3 114.2 8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"}),(0,m.jsx)("path",{d:"m267.2 153.5-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4 3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z",className:"s3"})]}),rC=({style:e,...t})=>(0,m.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"108",height:"108",viewBox:"0 0 108 108",fill:"none",style:{height:"28px",width:"28px",...e},...t,children:[(0,m.jsx)("rect",{width:"108",height:"108",rx:"23",fill:"#AB9FF2"}),(0,m.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M46.5267 69.9229C42.0054 76.8509 34.4292 85.6182 24.348 85.6182C19.5824 85.6182 15 83.6563 15 75.1342C15 53.4305 44.6326 19.8327 72.1268 19.8327C87.768 19.8327 94 30.6846 94 43.0079C94 58.8258 83.7355 76.9122 73.5321 76.9122C70.2939 76.9122 68.7053 75.1342 68.7053 72.314C68.7053 71.5783 68.8275 70.7812 69.0719 69.9229C65.5893 75.8699 58.8685 81.3878 52.5754 81.3878C47.993 81.3878 45.6713 78.5063 45.6713 74.4598C45.6713 72.9884 45.9768 71.4556 46.5267 69.9229ZM83.6761 42.5794C83.6761 46.1704 81.5575 47.9658 79.1875 47.9658C76.7816 47.9658 74.6989 46.1704 74.6989 42.5794C74.6989 38.9885 76.7816 37.1931 79.1875 37.1931C81.5575 37.1931 83.6761 38.9885 83.6761 42.5794ZM70.2103 42.5795C70.2103 46.1704 68.0916 47.9658 65.7216 47.9658C63.3157 47.9658 61.233 46.1704 61.233 42.5795C61.233 38.9885 63.3157 37.1931 65.7216 37.1931C68.0916 37.1931 70.2103 38.9885 70.2103 42.5795Z",fill:"#FFFDF8"})]}),rj=class extends rf{constructor(e,t,r,i,n){super(n||"unknown",e,t,r),this.connectorType="injected",this.proxyProvider=new rc(void 0,this.rpcTimeoutDuration),this.subscribeListeners(),this.providerDetail=i;let a=i.provider;this.proxyProvider.setWalletProvider(a),this.syncAccounts().then(()=>{this.emit("initialized"),this.initialized=!0})}async connect(e){return e.showPrompt&&await this.promptConnection(),await this.isConnected()?this.getConnectedWallet():null}get walletBranding(){return{name:this.providerDetail.info.name,icon:this.providerDetail.info.icon}}disconnect(){console.warn(`Programmatic disconnect with ${this.providerDetail.info.name} is not yet supported.`)}async promptConnection(){try{let e=await this.proxyProvider.request({method:"eth_requestAccounts"});if(!e||0===e.length||!e[0])throw new eM("Unable to retrieve accounts");await this.syncAccounts([e[0]])}catch(e){throw rn(e)}}},rk=class extends rf{constructor(e,t,r,i,n){super(n??"unknown",e,t,r),this.connectorType="injected",eA(this,t6,void 0),this.proxyProvider=new rc(void 0,this.rpcTimeoutDuration),this.subscribeListeners(),this.proxyProvider.setWalletProvider(i),this.syncAccounts().then(()=>{this.emit("initialized"),this.initialized=!0}),"metamask"===n?eN(this,t6,{name:"MetaMask",icon:rb}):"phantom"===n&&eN(this,t6,{name:"Phantom",icon:rC})}async connect(e){return e.showPrompt&&await this.promptConnection(),await this.isConnected()?this.getConnectedWallet():null}get walletBranding(){return eT(this,t6)??{name:"Browser Extension",icon:rv}}disconnect(){console.warn("Programmatic disconnect with browser wallets is not yet supported.")}async promptConnection(){try{let e=await this.proxyProvider.request({method:"eth_requestAccounts"});if(!e||0===e.length||!e[0])throw new eM("Unable to retrieve accounts");await this.syncAccounts([e[0]])}catch(e){throw rn(e)}}};t6=new WeakMap;var rE=class extends rj{disconnect(){console.warn("Metamask does not support programmatic disconnect.")}async promptConnection(){try{l.tq||await this.proxyProvider.request({method:"wallet_requestPermissions",params:[{eth_accounts:{}}]});let e=await this.proxyProvider.request({method:"eth_requestAccounts"});if(!e||0===e.length||!e[0])throw new eM("Unable to retrieve accounts");await this.syncAccounts([e[0]])}catch(e){throw rn(e)}}},r_=class extends rf{constructor(e,t){super(e,[],t,{}),this.connectorType="null",this.proxyProvider=new rc(void 0,12e4),this.connectorType=e}get walletBranding(){return{name:"Wallet"}}async connect(){throw Error("connect called for an uninstalled wallet via the NullConnector")}disconnect(){throw Error("disconnect called for an uninstalled wallet via the NullConnector")}promptConnection(e){throw Error(`promptConnection called for an uninstalled wallet via the NullConnector for ${e}`)}},rP=class extends r_{constructor(e){super("phantom",e)}get walletBranding(){return{name:"Phantom",icon:rC}}};function rS({src:e,...t}){return(0,m.jsx)("img",{src:e,...t,style:{display:"none"}})}var rT=()=>{throw Error("You need to wrap your application with the <PrivyProvider> initialized with your app id.")},rA=(0,s.createContext)({ready:!1,app:null,currentScreen:null,lastScreen:null,navigate:rT,navigateBack:rT,resetNavigation:rT,setModalData:rT,onUserCloseViaDialogOrKeybindRef:void 0}),rN=["LANDING","CONNECT_ONLY_LANDING_SCREEN",null],rI=e=>{let t=e.appConfig,r=e.authenticated,[i,n]=(0,s.useState)(e.initialScreen);(0,s.useEffect)(()=>{r||rN.includes(e.initialScreen)||e.setInitialScreen(null)},[r]);let a=(0,s.useRef)(null),o={ready:!!t?.id,app:t,data:e.data,setModalData:e.setModalData,currentScreen:e.initialScreen,lastScreen:i,navigate:(t,r=!0)=>{e.setInitialScreen(t),r&&n(e.initialScreen)},navigateBack:()=>{e.setInitialScreen(i)},resetNavigation:()=>{e.setInitialScreen(null),n(null)},onUserCloseViaDialogOrKeybindRef:a};return(0,m.jsxs)(rA.Provider,{value:o,children:[("string"==typeof t?.appearance?.logo||t?.appearance?.logo?.type==="img")&&(0,m.jsx)(rS,{src:"string"==typeof t.appearance.logo?t.appearance.logo:t.appearance.logo.props.src}),e.children]})},rO=()=>(0,s.useContext)(rA),rF=({style:e,...t})=>{let{app:r}=rO();return(0,m.jsxs)("svg",{width:"28",height:"28",viewBox:"0 0 28 28",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{height:"28px",width:"28px",...e},...t,children:[(0,m.jsx)("rect",{width:"28",height:"28",rx:"3",fill:r?.appearance.palette.colorScheme==="dark"?"#3396ff":"#141414"}),(0,m.jsx)("g",{clipPath:"url(#clip0_1765_9946)",children:(0,m.jsx)("path",{d:"M8.09448 10.3941C11.3558 7.20196 16.6442 7.20196 19.9055 10.3941L20.2982 10.7782C20.3369 10.8157 20.3677 10.8606 20.3887 10.9102C20.4097 10.9599 20.4206 11.0132 20.4206 11.0671C20.4206 11.121 20.4097 11.1744 20.3887 11.224C20.3677 11.2737 20.3369 11.3186 20.2982 11.3561L18.9554 12.6702C18.9158 12.7086 18.8628 12.7301 18.8077 12.7301C18.7526 12.7301 18.6996 12.7086 18.66 12.6702L18.1198 12.1415C15.8448 9.91503 12.1557 9.91503 9.88015 12.1415L9.30167 12.7075C9.26207 12.7459 9.20909 12.7673 9.15395 12.7673C9.0988 12.7673 9.04582 12.7459 9.00622 12.7075L7.66346 11.3934C7.62475 11.3559 7.59397 11.3109 7.57295 11.2613C7.55193 11.2117 7.5411 11.1583 7.5411 11.1044C7.5411 11.0505 7.55193 10.9971 7.57295 10.9475C7.59397 10.8979 7.62475 10.8529 7.66346 10.8154L8.09448 10.3941ZM22.6829 13.1115L23.8776 14.2814C23.9163 14.319 23.9471 14.3639 23.9681 14.4135C23.9892 14.4632 24 14.5165 24 14.5704C24 14.6243 23.9892 14.6777 23.9681 14.7273C23.9471 14.777 23.9163 14.8219 23.8776 14.8594L18.4893 20.1332C18.4102 20.2101 18.3042 20.2531 18.1938 20.2531C18.0835 20.2531 17.9775 20.2101 17.8984 20.1332L14.0743 16.3901C14.0545 16.3708 14.0279 16.36 14.0003 16.36C13.9726 16.36 13.9461 16.3708 13.9263 16.3901L10.1021 20.1332C10.023 20.2101 9.91703 20.2531 9.8067 20.2531C9.69636 20.2531 9.59038 20.2101 9.51124 20.1332L4.12236 14.8594C4.08365 14.8219 4.05287 14.777 4.03185 14.7273C4.01083 14.6777 4 14.6243 4 14.5704C4 14.5165 4.01083 14.4632 4.03185 14.4135C4.05287 14.3639 4.08365 14.319 4.12236 14.2814L5.31767 13.1115C5.39678 13.0348 5.50265 12.9919 5.61285 12.9919C5.72305 12.9919 5.82892 13.0348 5.90803 13.1115L9.73216 16.8546C9.75194 16.874 9.7785 16.8848 9.80616 16.8848C9.83381 16.8848 9.86037 16.874 9.88015 16.8546L13.7043 13.1115C13.7834 13.0346 13.8894 12.9916 13.9997 12.9916C14.1101 12.9916 14.216 13.0346 14.2952 13.1115L18.1198 16.8546C18.1396 16.874 18.1662 16.8848 18.1938 16.8848C18.2215 16.8848 18.2481 16.874 18.2678 16.8546L22.092 13.1115C22.1711 13.0346 22.2771 12.9916 22.3874 12.9916C22.4977 12.9916 22.6037 13.0346 22.6829 13.1115Z",fill:"white"})}),(0,m.jsx)("defs",{children:(0,m.jsx)("clipPath",{id:"clip0_1765_9946",children:(0,m.jsx)("rect",{width:"20",height:"12.2531",fill:"white",transform:"translate(4 8)"})})})]})},rR=e=>{let t;try{t=new URL(e).hostname}catch{return}for(let[e,r]of Object.entries(rL))if(t.includes(r.hostname))return{walletClientType:e,entry:r}},rL={metamask:{id:"c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",displayName:"MetaMask",hostname:"metamask.io",mobile:{native:"metamask://",universal:"https://metamask.app.link"}},trust:{id:"4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",displayName:"Trust",hostname:"trustwallet.com",mobile:{universal:"https://link.trustwallet.com"}},safe:{id:"225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f",displayName:"Safe",hostname:"safe.global",mobile:{universal:"https://app.safe.global/"}},rainbow:{id:"1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",displayName:"Rainbow",hostname:"rainbow.me",mobile:{native:"rainbow://",universal:"https://rnbwapp.com"}},uniswap:{id:"c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a",displayName:"Uniswap",hostname:"uniswap.org",mobile:{universal:"https://uniswap.org/app"}},zerion:{id:"ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18",displayName:"Zerion",hostname:"zerion.io",mobile:{native:"zerion://",universal:"https://wallet.zerion.io"}},argent:{id:"bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6",displayName:"Argent",hostname:"www.argent.xyz",mobile:{universal:"https://www.argent.xyz/app"}},spot:{id:"74f8092562bd79675e276d8b2062a83601a4106d30202f2d509195e30e19673d",displayName:"Spot",hostname:"www.spot-wallet.com",mobile:{universal:"https://spot.so"}},omni:{id:"afbd95522f4041c71dd4f1a065f971fd32372865b416f95a0b1db759ae33f2a7",displayName:"Omni",hostname:"omni.app",mobile:{universal:"https://links.omni.app"}},cryptocom:{id:"f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d",displayName:"Crypto.com",hostname:"crypto.com",mobile:{universal:"https://wallet.crypto.com"}},blockchain:{id:"84b43e8ddfcd18e5fcb5d21e7277733f9cccef76f7d92c836d0e481db0c70c04",displayName:"Blockchain",hostname:"www.blockchain.com",mobile:{universal:"https://www.blockchain.com"}},safepal:{id:"0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150",displayName:"SafePal",hostname:"safepal.com",mobile:{universal:"https://link.safepal.io"}},bitkeep:{id:"38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",displayName:"BitKeep",hostname:"bitkeep.com",mobile:{universal:"https://bkapp.vip"}},zengo:{id:"9414d5a85c8f4eabc1b5b15ebe0cd399e1a2a9d35643ab0ad22a6e4a32f596f0",displayName:"ZenGo",hostname:"zengo.com",mobile:{universal:"https://get.zengo.com/"}},"1inch":{id:"c286eebc742a537cd1d6818363e9dc53b21759a1e8e5d9b263d0c03ec7703576",displayName:"1inch",hostname:"wallet.1inch.io",mobile:{universal:"https://wallet.1inch.io/wc/"}},binance:{id:"8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4",displayName:"Binance",hostname:"www.binance.com",mobile:{universal:"https://app.binance.com/cedefi"}},exodus:{id:"e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4",displayName:"Exodus",hostname:"exodus.com",mobile:{universal:"https://exodus.com/m"}},mew_wallet:{id:"f5b4eeb6015d66be3f5940a895cbaa49ef3439e518cd771270e6b553b48f31d2",displayName:"MEW wallet",hostname:"mewwallet.com",mobile:{universal:"https://mewwallet.com"}},alphawallet:{id:"138f51c8d00ac7b9ac9d8dc75344d096a7dfe370a568aa167eabc0a21830ed98",displayName:"AlphaWallet",hostname:"alphawallet.com",mobile:{universal:"https://aw.app"}},keyring_pro:{id:"47bb07617af518642f3413a201ec5859faa63acb1dd175ca95085d35d38afb83",displayName:"KEYRING PRO",hostname:"keyring.app",mobile:{universal:"https://keyring.app/"}},mathwallet:{id:"7674bb4e353bf52886768a3ddc2a4562ce2f4191c80831291218ebd90f5f5e26",displayName:"MathWallet",hostname:"mathwallet.org",mobile:{universal:"https://www.mathwallet.org"}},unstoppable:{id:"8308656f4548bb81b3508afe355cfbb7f0cb6253d1cc7f998080601f838ecee3",displayName:"Unstoppable",hostname:"unstoppabledomains.com",mobile:{universal:"https://unstoppabledomains.com/mobile"}},obvious:{id:"031f0187049b7f96c6f039d1c9c8138ff7a17fd75d38b34350c7182232cc29aa",displayName:"Obvious",hostname:"obvious.technology",mobile:{universal:"https://wallet.obvious.technology"}},ambire:{id:"2c81da3add65899baeac53758a07e652eea46dbb5195b8074772c62a77bbf568",displayName:"Ambire",hostname:"www.ambire.com",mobile:{universal:"https://mobile.ambire.com"}},internet_money_wallet:{id:"dd43441a6368ec9046540c46c5fdc58f79926d17ce61a176444568ca7c970dcd",displayName:"Internet Money Wallet",hostname:"internetmoney.io",mobile:{universal:"https://internetmoney.io"}},coin98:{id:"2a3c89040ac3b723a1972a33a125b1db11e258a6975d3a61252cd64e6ea5ea01",displayName:"Coin98",hostname:"coin98.com",mobile:{universal:"https://coin98.services"}},abc_wallet:{id:"b956da9052132e3dabdcd78feb596d5194c99b7345d8c4bd7a47cabdcb69a25f",displayName:"ABC Wallet",hostname:"myabcwallet.io",mobile:{universal:"https://abcwalletconnect.page.link"}},arculus_wallet:{id:"0e4915107da5b3408b38e248f7a710f4529d54cd30e9d12ff0eb886d45c18e92",displayName:"Arculus Wallet",hostname:"www.getarculus.com",mobile:{universal:"https://gw.arculus.co/app"}},haha:{id:"719bd888109f5e8dd23419b20e749900ce4d2fc6858cf588395f19c82fd036b3",displayName:"HaHa",hostname:"www.haha.me",mobile:{universal:"https://haha.me"}},cling_wallet:{id:"942d0e22a7e6b520b0a03abcafc4dbe156a1fc151876e3c4a842f914277278ef",displayName:"Cling Wallet",hostname:"clingon.io",mobile:{universal:"https://cling.carrieverse.com/apple-app-site-association"}},broearn:{id:"8ff6eccefefa7506339201bc33346f92a43118d6ff7d6e71d499d8187a1c56a2",displayName:"Broearn",hostname:"www.broearn.com",mobile:{universal:"https://www.broearn.com/link/wallet/"}},copiosa:{id:"07f99a5d9849bb049d74830012b286f8b238e72b0337933ef22b84947409db80",displayName:"Copiosa",hostname:"copiosa.io",mobile:{universal:"https://copiosa.io/action/"}},burrito_wallet:{id:"8821748c25de9dbc4f72a691b25a6ddad9d7df12fa23333fd9c8b5fdc14cc819",displayName:"Burrito Wallet",hostname:"burritowallet.com",mobile:{universal:"https://burritowallet.com/wc?uri="}},enjin_wallet:{id:"bdc9433ffdaee55d31737d83b931caa1f17e30666f5b8e03eea794bac960eb4a",displayName:"Enjin Wallet",hostname:"enjin.io",mobile:{universal:"https://deeplink.wallet.enjin.io/"}},plasma_wallet:{id:"cbe13eb482c76f1fa401ff4c84d9acd0b8bc9af311ca0620a0b192fb28359b4e",displayName:"Plasma Wallet",hostname:"plasma-wallet.com",mobile:{universal:"https://plasma-wallet.com"}},avacus:{id:"94f785c0c8fb8c4f38cd9cd704416430bcaa2137f27e1468782d624bcd155a43",displayName:"Avacus",hostname:"avacus.cc",mobile:{universal:"https://avacus.app.link"}},bee:{id:"2cca8c1b0bea04ba37dee4017991d348cdb7b826804ab2bd31073254f345b715",displayName:"Bee",hostname:"www.beewallet.app",mobile:{universal:"https://beewallet.app/wc"}},pitaka:{id:"14e5d957c6eb62d3ee8fc6239703ac2d537d7e3552154836ca0beef775f630bc",displayName:"Pitaka",hostname:"pitaka.io",mobile:{universal:"https://app.pitaka.io"}},pltwallet:{id:"576c90ceaea34f29ff0104837cf2b2e23d201be43be1433feeb18d375430e1fd",displayName:"PLTwallet",hostname:"pltwallet.io",mobile:{universal:"https://pltwallet.io/"}},minerva:{id:"49bb9d698dbdf2c3d4627d66f99dd9fe90bba1eec84b143f56c64a51473c60bd",displayName:"Minerva",hostname:"minerva.digital",mobile:{universal:"https://minerva.digital"}},kryptogo:{id:"19418ecfd44963883e4d6abca1adeb2036f3b5ffb9bee0ec61f267a9641f878b",displayName:"KryptoGO",hostname:"kryptogo.com",mobile:{universal:"https://kryptogo.page.link"}},prema:{id:"5b8e33346dfb2a532748c247876db8d596734da8977905a27b947ba1e2cf465b",displayName:"PREMA",hostname:"premanft.com",mobile:{universal:"https://premanft.com"}},slingshot:{id:"d23de318f0f56038c5edb730a083216ff0cce00c1514e619ab32231cc9ec484b",displayName:"Slingshot",hostname:"slingshot.finance",mobile:{universal:"https://app.slingshot.finance"}},kriptonio:{id:"50df7da345f84e5a79aaf617df5167335a4b6751626df2e8a38f07029b3dde7b",displayName:"Kriptonio",hostname:"kriptonio.com",mobile:{universal:"https://app.kriptonio.com/mobile"}},timeless:{id:"9751385960bca290c13b443155288f892f62ee920337eda8c5a8874135daaea8",displayName:"Timeless",hostname:"timelesswallet.xyz",mobile:{universal:"https://timelesswallet.xyz"}},secux:{id:"6464873279d46030c0b6b005b33da6be5ed57a752be3ef1f857dc10eaf8028aa",displayName:"SecuX",hostname:"secuxtech.com",mobile:{universal:"https://wsweb.secuxtech.com"}},bitizen:{id:"41f20106359ff63cf732adf1f7dc1a157176c9b02fd266b50da6dcc1e9b86071",displayName:"Bitizen",hostname:"bitizen.org",mobile:{universal:"https://bitizen.org/wallet"}},blocto:{id:"14e7176536cb3706e221daaa3cfd7b88b7da8c7dfb64d1d241044164802c6bdd",displayName:"Blocto",hostname:"blocto.io",mobile:{universal:"https://blocto.app"}},safemoon:{id:"a0e04f1086aac204d4ebdd5f985c12ed226cd0006323fd8143715f9324da58d1",displayName:"SafeMoon",hostname:"safemoon.com",mobile:{universal:"https://safemoon.com/wc"}}},rM=e=>e in rL,rW=e=>{let t=rL[e].mobile;if("native"in t)return t.native},rU="WALLETCONNECT_DEEPLINK_CHOICE";function rD(e){return e.startsWith("http://")||e.startsWith("https://")}function rZ(e,t){if(rD(e))return rz(e,t);let r=e;r.includes("://")||(r=e.replaceAll("/","").replaceAll(":",""),r=`${r}://`),r.endsWith("/")||(r=`${r}/`);let i=encodeURIComponent(t);return{redirect:`${r}wc?uri=${i}`,href:r}}function rz(e,t){if(!rD(e))return rZ(e,t);let r=e;r.endsWith("/")||(r=`${r}/`);let i=encodeURIComponent(t);return{redirect:`${r}wc?uri=${i}`,href:r}}var r$=class extends rf{constructor(e,t,i,n,a){super(a||"unknown",i,n,t),this.connectorType="wallet_connect_v2",this.walletConnectCloudProjectId=e,this.rpcConfig=t,this.proxyProvider=new rc(void 0,this.rpcTimeoutDuration),a&&(this.walletEntry=rL[a],this.walletClientType=a),this.createProvider().then(e=>{if(this.provider=e,this.proxyProvider.setWalletProvider(e),this.subscribeListeners(),e.session){if(this.walletProvider?.session?.peer.metadata.url){let e=rR(this.walletProvider?.session?.peer.metadata.url);this.walletEntry=e?.entry,this.walletClientType=e?.walletClientType||"unknown"}this.connected=!0,this.syncAccounts().then(()=>{this.emit("initialized"),this.initialized=!0})}else this.emit("initialized"),this.initialized=!0}),r.e(8465).then(r.bind(r,78465)).then(({WalletConnectModal:e})=>{this.modal=new e({projectId:this.walletConnectCloudProjectId,themeVariables:{"--wcm-z-index":"1000000"}}),this.modal.subscribeModal(e=>{e.open||this.walletProvider?.session||!this.onQrModalClosed||this.onQrModalClosed()})})}async connect(e){return e.showPrompt&&await this.promptConnection(),this.getConnectedWallet()}async isConnected(){return!!this.walletProvider?.connected}get walletBranding(){return"metamask"===this.walletClientType?{name:"Metamask",icon:rb}:{name:t1(this.walletProvider?.session?.peer.metadata.name||"")||"WalletConnect",icon:this.walletProvider?.session?.peer.metadata.icons?.[0]||rF}}resetConnection(e){this.walletProvider&&this.walletProvider.connected&&(this.walletProvider.signer.session=void 0,this.walletEntry=rL[e],this.walletClientType=e,this.redirectUri=void 0,function(){try{localStorage.removeItem(rU)}catch{}}(),this.onDisconnect())}async promptConnection(){if(this.provider)return new Promise((e,t)=>{this.onQrModalClosed=()=>{t(new ri)},(async()=>{let t="",r=await Promise.race([this.walletProvider?.enable(),this.proxyProvider.walletTimeout()]);if(r?.length&&(t=r[0]),!t||""===t)throw new eM("Unable to retrieve address");if(this.walletProvider?.session?.peer.metadata.url){let e=rR(this.walletProvider?.session?.peer.metadata.url);this.walletEntry=e?.entry,this.walletClientType=e?.walletClientType||"unknown",this.proxyProvider.rpcTimeoutDuration=rH(this.rpcConfig,this.walletClientType)}this.connected=!0,await this.syncAccounts(r),e()})().catch(e=>{if(e){t(rn(e));return}t(new eM("Unknown error during connection"))}).finally(()=>this.modal?.closeModal())})}disconnect(){this.walletProvider?.disconnect().then(()=>this.onDisconnect()).catch(()=>console.warn("Unable to disconnect Wallet Connect provider"))}get walletProvider(){return this.proxyProvider.walletProvider}setWalletProvider(e){this.proxyProvider.setWalletProvider(e)}async createProvider(){let e={};for(let t of this.chains){let r=t8(t.id,this.chains,this.rpcConfig);r&&(e[t.id]=r)}let t=await g.Gn.init({projectId:this.walletConnectCloudProjectId,chains:[this.defaultChain.id],optionalChains:this.chains.map(e=>e.id),optionalEvents:g.gy,optionalMethods:g.lI,rpcMap:e,showQrModal:!1});return t.on("display_uri",e=>{if(t.signer.abortPairingAttempt(),l.tq&&this.walletEntry){let{redirect:t,href:r}=function(e,t){let r={name:t.displayName||"",universalLink:t.mobile.universal,deepLink:t.mobile.native};if(r.deepLink)return rZ(r.deepLink,e);if(r.universalLink)return rz(r.universalLink,e);throw new eR(`Unsupported wallet ${t.id}`)}(e,this.walletEntry);(function({href:e,name:t}){try{localStorage.setItem(rU,JSON.stringify({href:e,name:t}))}catch{}})({href:r,name:this.walletEntry.displayName}),this.redirectUri=t,window.open(t,"_self","noreferrer noopener")}else this.modal?.openModal({uri:e,chains:[this.defaultChain.id]})}),t.on("connect",()=>{if(this.modal?.closeModal(),t.session?.peer.metadata.url){let e=rR(t.session?.peer.metadata.url);this.walletEntry=e?.entry,this.walletClientType=e?.walletClientType||"unknown"}}),t}async enableProvider(){return this.walletProvider?.connected?Promise.resolve(this.walletProvider.accounts):await this.walletProvider?.enable()}},rB=e=>{let t=localStorage.getItem("-walletlink:https://www.walletlink.org:Addresses");return!!t&&!!e?.linkedAccounts.filter(e=>"wallet"==e.type&&e.address===i.Kn(t)).length},rH=(e,t)=>e.rpcTimeouts&&e.rpcTimeouts[t]||12e4,rG=class extends u.Z{constructor(e,t,r,i,n,a){super(),this.getEthereumProvider=()=>{let e=this.wallets[0],t=this.walletConnectors.find(t=>t.wallets.find(t=>t.address===e?.address));return e&&t?t.proxyProvider:new rc},this.walletConnectCloudProjectId=e,this.rpcConfig=t,this.chains=r,this.defaultChain=i,this.walletConnectors=[],this.initialized=!1,this.store=n,this.walletList=a,this.initializedWalletConnectors=0,this.walletsReady=!1,this.storedConnections=this.loadConnectionHistory()}get wallets(){let e=new Set,t=this.walletConnectors.flatMap(e=>e.wallets).sort((e,t)=>e.connectedAt&&t.connectedAt?t.connectedAt-e.connectedAt:0).filter(t=>{let r=`${t.address}${t.walletClientType}${t.connectorType}`;return!e.has(r)&&(e.add(r),!0)}),r=t.findIndex(e=>e.address===(this.activeWallet?this.activeWallet:"unknown"));return r>=0&&t.unshift(t.splice(r,1)[0]),t}async initialize(){if(this.initialized)return;tF.get(tE)&&(tF.getKeys().forEach(e=>{e.startsWith("walletconnect")&&tF.del(e)}),tF.del(tE));let e=t3(this.store,this.walletList).then(e=>{e.forEach(({type:e,eip6963InjectedProvider:t,legacyInjectedProvider:r})=>{this.createWalletConnector("injected",e,{eip6963InjectedProvider:t,legacyInjectedProvider:r})})});this.walletList.includes("coinbase_wallet")&&this.createWalletConnector("coinbase_wallet","coinbase_wallet"),!tq()&&this.walletList.includes("phantom")&&this.createWalletConnector("phantom","phantom"),this.createWalletConnector("wallet_connect_v2","unknown"),await e,this.initialized=!0}findWalletConnector(e,t){return"wallet_connect_v2"===e?this.walletConnectors.find(t=>t.connectorType===e)||null:this.walletConnectors.find(r=>r.connectorType===e&&r.walletClientType===t)||null}onInitialized(e){e.wallets.forEach(e=>{let t=this.storedConnections.find(t=>t.address===e.address&&t.connectorType===e.connectorType&&t.walletClientType===e.walletClientType);t&&(e.connectedAt=t.connectedAt)}),this.saveConnectionHistory(),this.emit("walletsUpdated"),this.initializedWalletConnectors++,this.walletsReady=this.initializedWalletConnectors===this.walletConnectors.length}onWalletsUpdated(e){e.initialized&&(this.saveConnectionHistory(),this.emit("walletsUpdated"))}addEmbeddedWalletConnector(e,t,r){let i=this.findWalletConnector("embedded","privy");if(i)i.proxyProvider.walletProxy=e;else{let i=new ry(new rh(e,t,this.rpcConfig,this.chains,r.id),this.chains,r,this.rpcConfig);this.addWalletConnector(i)}}removeEmbeddedWalletConnector(){let e=this.findWalletConnector("embedded","privy");if(e){let t=this.walletConnectors.indexOf(e);this.walletConnectors.splice(t,1),this.saveConnectionHistory(),this.storedConnections=this.loadConnectionHistory(),this.emit("walletsUpdated")}}async createWalletConnector(e,t,r){let i=this.findWalletConnector(e,t);if(i)return i instanceof r$&&i.resetConnection(t),i;let n="injected"!==e?"coinbase_wallet"===e?new rw(this.chains,this.defaultChain,this.rpcConfig):"phantom"===e?new rP(this.defaultChain):new r$(this.walletConnectCloudProjectId,this.rpcConfig,this.chains,this.defaultChain,t):"metamask"===t&&r?.eip6963InjectedProvider?new rE(this.chains,this.defaultChain,this.rpcConfig,r?.eip6963InjectedProvider,"metamask"):"metamask"===t&&r?.legacyInjectedProvider?new rk(this.chains,this.defaultChain,this.rpcConfig,r?.legacyInjectedProvider,"metamask"):"phantom"===t&&r?.legacyInjectedProvider?new rk(this.chains,this.defaultChain,this.rpcConfig,r?.legacyInjectedProvider,"phantom"):r?.legacyInjectedProvider&&"unknown_browser_extension"===t?new rk(this.chains,this.defaultChain,this.rpcConfig,r?.legacyInjectedProvider):r?.eip6963InjectedProvider?new rj(this.chains,this.defaultChain,this.rpcConfig,r?.eip6963InjectedProvider,t):void 0;return n&&this.addWalletConnector(n),n||null}addWalletConnector(e){this.walletConnectors.push(e),e.on("initialized",()=>this.onInitialized(e)),e.on("walletsUpdated",()=>this.onWalletsUpdated(e))}loadConnectionHistory(){let e=e=>e&&"string"==typeof e.address&&"string"==typeof e.connectorType&&"string"==typeof e.walletClientType&&"number"==typeof e.connectedAt,t=tF.get(t_);return t&&Array.isArray(t)&&t.map(t=>e(t)).every(Boolean)?t:[]}saveConnectionHistory(){let e=this.wallets.map(e=>({address:e.address,connectorType:e.connectorType,walletClientType:e.walletClientType,connectedAt:e.connectedAt}));tF.put(t_,e)}async activeWalletSign(e){let t=this.wallets,r=t.length>0?t[0]:null;return r?r.sign(e):null}setActiveWallet(e){this.activeWallet=(0,i.Kn)(e),this.emit("walletsUpdated")}};function rq(e,t){if(e.length!==t.length)return!1;for(let r=0;r<e.length;r++){let i=e[r],n=t[r];if(i?.address!==n?.address||i?.chainId!==n?.chainId||i?.connectorType!==n?.connectorType||i?.connectedAt!==n?.connectedAt||i?.walletClientType!==n?.walletClientType||i?.isConnected!==n?.isConnected||i?.linked!==n?.linked)return!1}return!0}var rV,rK,rY,rQ=[e$(),eG(),eB()],rJ=class{constructor(e,t,r){this.appId=e,this.clientAnalyticsId=t.clientAnalyticsId,this.sdkVersion="1.55.0",this.client=t,this.defaults=r,this.fallbackApiUrl=t.fallbackApiUrl,this.baseFetch=w.Wg.create({baseURL:this.defaults.baseURL,timeout:this.defaults.timeout,retry:3,retryDelay:500,retryStatusCodes:[408,409,425,500,502,503,504],credentials:"include",onRequest:async({request:e,options:t})=>{let r=new Headers(t.headers);r.set("privy-app-id",this.appId),r.set("privy-ca-id",this.clientAnalyticsId||""),r.set("privy-client",`react-auth:${this.sdkVersion}`);let i=!rQ.includes(e.toString());if(!r.has("authorization")&&i){let e=await this.client.getAccessToken();null!==e&&r.set("authorization",`Bearer ${e}`)}t.headers=r},onRequestError:({error:e})=>{if(e instanceof DOMException&&"AbortError"===e.name)throw new eL}})}async get(e,t){try{return await this.baseFetch(e,t)}catch(e){throw eW(e)}}async post(e,t,r){try{return await this.baseFetch(e,{method:"POST",...t?{body:t}:{},...r})}catch(e){throw eW(e)}}async delete(e,t){try{return await this.baseFetch(e,{method:"DELETE",...t})}catch(e){throw eW(e)}}},rX=class{static parse(e){try{return new rX(e)}catch{return null}}constructor(e){this.value=e,this._decoded=y.t(e)}get subject(){return this._decoded.sub}get expiration(){return this._decoded.exp}get issuer(){return this._decoded.iss}get audience(){return this._decoded.aud}isExpired(e=0){return Date.now()>=(this.expiration-e)*1e3}},r0=class{constructor(){this.authenticateOnce=new th(async e=>this._authenticate(e)),this.linkOnce=new th(async e=>this._link(e)),this.refreshOnce=new th(this._refresh.bind(this)),this.destroyOnce=new th(this._destroy.bind(this)),this.forkSessionOnce=new th(this._forkSession.bind(this))}get token(){try{let e=tF.get(tf);return"string"==typeof e?new rX(e).value:null}catch(e){return console.error(e),this.destroyLocalState(),null}}get refreshToken(){try{let e=tF.get(tw);return"string"==typeof e?e:null}catch(e){return console.error(e),this.destroyLocalState(),null}}get forkedToken(){try{let e=tF.get(tv);return"string"==typeof e?e:null}catch(e){return console.error(e),this.destroyLocalState(),null}}get mightHaveServerCookies(){try{let e=x.Z.get(ty);return void 0!==e&&e.length>0}catch(e){console.error(e)}return!1}hasRefreshCredentials(){return this.mightHaveServerCookies||"string"==typeof this.token&&"string"==typeof this.refreshToken}hasRecoveryCredentials(){return"string"==typeof this.forkedToken}hasActiveToken(){let e=rX.parse(this.token);return null!==e&&!e.isExpired(30)}authenticate(e){return this.authenticateOnce.execute(e)}link(e){return this.linkOnce.execute(e)}refresh(){return this.refreshOnce.execute()}forkSession(){return this.forkSessionOnce.execute()}destroy(){return this.destroyOnce.execute()}async _authenticate(e){try{let{token:t,refresh_token:r,user:i,is_new_user:n}=await e.authenticate();this.storeToken(t),this.storeRefreshToken(r);let a=e instanceof td?"email":e instanceof tW?"sms":e instanceof tM?"siwe":e instanceof tc?"custom_auth":e instanceof tL?e.meta.provider:null;return a&&this.client&&this.client.createAnalyticsEvent("sdk_authenticate",{method:a,isNewUser:n}),"siwe"===a&&this.client&&this.client.createAnalyticsEvent("sdk_authenticate_siwe",{connectorType:e.meta.connectorType,walletClientType:e.meta.walletClientType}),{user:tB(i),isNewUser:n}}catch(e){throw console.warn("Error authenticating session"),eU(e)}}async _link(e){try{let t=await e.link();return tB(t)}catch(e){throw console.warn("Error linking account"),eU(e)}}async _refresh(){if(!this.api)throw new eR("Session has no API instance");if(!this.client)throw new eR("Session has no PrivyClient instance");await this.client.getAccessToken({disableAutoRefresh:!0});let e=this.token,t=this.refreshToken,r=this.forkedToken;try{let i;if(e&&t||this.mightHaveServerCookies){let n={};e&&(n.authorization=`Bearer ${e}`),i=await this.api.post(e$(),t?{refresh_token:t}:{},{headers:n}),r&&this.clearForkedToken()}else{if(!r)return null;i=await this.api.post(eG(),{refresh_token:r}),this.clearForkedToken()}return this.storeToken(i.token),this.storeRefreshToken(i.refresh_token),tB(i.user)}catch(e){if(e instanceof eF&&"missing_or_invalid_token"===e.privyErrorCode)return console.warn("Unable to refresh tokens - token is missing or no longer valid"),this.destroyLocalState(),null;throw eU(e)}}async _destroy(){try{await this.api?.post(eB(),{refresh_token:this.refreshToken})}catch{console.warn("Error destroying session")}this.destroyLocalState()}async _forkSession(){if(!this.api)throw new eR("Session has no API instance");let e=this.refreshToken;try{let t=await this.api.post(eH(),{refresh_token:e});return this.storeToken(t.token),this.storeRefreshToken(t.refresh_token),t.new_session_refresh_token}catch(e){throw eU(e)}}destroyLocalState(){this.storeToken(null),this.storeRefreshToken(null),this.clearForkedToken(),this.client?.onDeleteToken?.()}storeToken(e){if("string"==typeof e){let t=tF.get(tf);if(tF.put(tf,e),t!==e&&this.client?.onStoreToken?.(e),!this.client?.useServerCookies){let t=rX.parse(e)?.expiration;x.Z.set(tg,e,{sameSite:"Strict",secure:!0,expires:t?new Date(1e3*t):void 0})}}else tF.del(tf),x.Z.remove(tg)}storeRefreshToken(e){"string"==typeof e?(tF.put(tw,e),this.client?.useServerCookies||(x.Z.set(ty,"t",{sameSite:"Strict",secure:!0,expires:30}),x.Z.set(tx,e,{sameSite:"Strict",secure:!0,expires:30}))):(tF.del(tw),x.Z.remove(tx),x.Z.remove(ty))}clearForkedToken(){tF.del(tv)}},r1=class{constructor(e){eA(this,rK),this.apiUrl=e.apiUrl||tm,this.fallbackApiUrl=this.apiUrl,this.useServerCookies=!1,this.timeout=e.timeout||2e4,this.appId=e.appId,this.clientAnalyticsId=eI(this,rK,rY).call(this),rV||(rV=new r0),this.session=rV,this.api=this.generateApi(),this.session.client=this}initializeConnectorManager(e,t,r,i,n,a){this.connectors||(this.connectors=new rG(e,t,r,i,n,a))}generateApi(){let e=new rJ(this.appId,this,{baseURL:this.apiUrl,timeout:this.timeout});return this.session.api=e,e}updateApiUrl(e){this.apiUrl=e||this.fallbackApiUrl,this.api=this.generateApi(),e&&(this.useServerCookies=!0)}authenticate(){if(!this.authFlow)throw new eR("No auth flow in progress.");return this.session.authenticate(this.authFlow)}link(){if(!this.authFlow)throw new eR("No auth flow in progress.");return this.session.link(this.authFlow)}async logout(){await this.session.destroy(),this.authFlow=void 0}startAuthFlow(e){e.api=this.api,this.authFlow=e}startMfaFlow(e){e.api=this.api,this.mfaFlow=e}async unlinkEmail(e){try{let t=await this.api.post(te(),{address:e});return tB(t)}catch(e){throw eU(e)}}async unlinkPhone(e){try{let t=await this.api.post(tt(),{phoneNumber:e});return tB(t)}catch(e){throw eU(e)}}async unlinkWallet(e){try{let t=await this.api.post(e9(),{address:e});return tB(t)}catch(e){throw eU(e)}}async unlinkOAuth(e,t){try{let r=await this.api.post(tr(),{provider:e,subject:t});return tB(r)}catch(e){throw eU(e)}}async unlinkFarcaster(e){try{let t=await this.api.post(ti(),{farcaster_id:e});return tB(t)}catch(e){throw eU(e)}}async createAnalyticsEvent(e,t,r){if(!(typeof window>"u"))try{this.clientAnalyticsId||console.warn("No client analytics id set, refusing to send analytics event"),await this.api.post(tn(),{event_name:e,client_id:this.clientAnalyticsId,payload:{...t||{},clientTimestamp:r?r.toISOString():new Date().toISOString()}})}catch{}}async signMoonpayOnRampUrl(e){try{return this.api.post(ta(),e)}catch(e){throw eU(e)}}async getAuthenticatedUser(){return this.session.hasRefreshCredentials()||this.session.hasRecoveryCredentials()?this.session.refresh():null}async getAccessToken(e){return this.session.hasActiveToken()?rX.parse(this.session.token)?.audience!==this.appId?(await this.logout(),null):this.session.token:!e?.disableAutoRefresh&&this.session.hasRefreshCredentials()?(await this.session.refresh(),this.session.token):null}async getServerConfig(){try{let e=await this.api.get(`/api/v1/apps/${this.appId}`,{baseURL:this.fallbackApiUrl});return{id:e.id,name:e.name,verificationKey:e.verification_key,logoUrl:e.logo_url||void 0,accentColor:e.accent_color||void 0,showWalletLoginFirst:e.show_wallet_login_first,allowlistConfig:{errorTitle:e.allowlist_config.error_title,errorDetail:e.allowlist_config.error_detail,errorCtaText:e.allowlist_config.cta_text,errorCtaLink:e.allowlist_config.cta_link},walletAuth:e.wallet_auth,emailAuth:e.email_auth,smsAuth:e.sms_auth,googleOAuth:e.google_oauth,twitterOAuth:e.twitter_oauth,discordOAuth:e.discord_oauth,githubOAuth:e.github_oauth,tiktokOAuth:e.tiktok_oauth,linkedinOAuth:e.linkedin_oauth,appleOAuth:e.apple_oauth,farcasterAuth:e.farcaster_auth,termsAndConditionsUrl:e.terms_and_conditions_url,embeddedWalletConfig:{createOnLogin:e.embedded_wallet_config?.create_on_login,requireUserPasswordOnCreate:e.embedded_wallet_config?.require_user_password_on_create},privacyPolicyUrl:e.privacy_policy_url,customApiUrl:e.custom_api_url,walletConnectCloudProjectId:e.wallet_connect_cloud_project_id,fiatOnRampEnabled:e.fiat_on_ramp_enabled,captchaEnabled:e.captcha_enabled,captchaSiteKey:e.captcha_site_key,twitterOAuthOnMobileEnabled:e.twitter_oauth_on_mobile_enabled,createdAt:new Date(1e3*e.created_at),updatedAt:new Date(1e3*e.updated_at),mfaMethods:e.mfa_methods}}catch(e){throw eU(e)}}async getUsdTokenPrice(e){try{return(await this.api.get(`/api/v1/token_price?chainId=${e.id}&tokenSymbol=${e.nativeCurrency.symbol}`)).usd}catch{console.error(`Unable to fetch token price for chain with id ${e.id}`);return}}async forkSession(){return await this.session.forkSession()}};rK=new WeakSet,rY=function(){if(typeof window>"u")return null;try{let e=tF.get(tb);if("string"==typeof e&&e.length>0)return e}catch{}let e=(0,h.Z)();try{return tF.put(tb,e),e}catch{return e}};var r2=(0,s.createContext)({siteKey:"",enabled:!1,appId:void 0,token:void 0,error:void 0,status:"disabled",setToken:rT,setError:rT,setExecuting:rT,waitForResult:()=>Promise.resolve(""),ref:{current:null},remove:rT,reset:rT,execute:rT}),r3=class extends eO{constructor(e,t,r){super(e||"Captcha failed"),this.type="Captcha",t instanceof Error&&(this.cause=t),this.privyErrorCode=r}},r4=({children:e,id:t,captchaSiteKey:r,captchaEnabled:i})=>{let n=(0,s.useRef)(null),[a,o]=(0,s.useState)(),[l,c]=(0,s.useState)(),[d,h]=(0,s.useState)(!1),u=(0,s.useMemo)(()=>i?d||a||l?!d||a||l?a&&!l?{status:"success",token:a}:l?{status:"error",error:l}:{status:"ready"}:{status:"loading"}:{status:"ready"}:{status:"disabled"},[i,a,l,d]);return(0,m.jsx)(r2.Provider,{value:{...u,ref:n,enabled:i,siteKey:r,appId:t,setToken:o,setError:c,setExecuting:h,remove(){i&&(n.current?.remove(),h(!1),c(void 0),o(void 0))},reset(){i&&(n.current?.reset(),h(!1),c(void 0),o(void 0))},execute(){i&&(h(!0),n.current?.execute())},async waitForResult(){if(!i)return"";try{return await function(e,{interval:t=100,timeout:r=5e3}={}){return new Promise((i,n)=>{let a=0,o,s=()=>{if(a>=r){n("Max attempts reached without result");return}if(o=e(),a+=t,null!=o){i(o);return}setTimeout(s,t)};s()})}(()=>n.current?.getResponse(),{interval:200,timeout:2e4})}catch{throw new r3("Captcha failed",null,"captcha_timeout")}}},children:e})},r5=()=>(0,s.useContext)(r2),r6=e=>{let{enabled:t,siteKey:r,appId:i,setError:n,setToken:a,setExecuting:o,ref:l}=r5(),[,c]=(0,s.useMemo)(()=>r?.split("t:")||[],[r]);if((0,s.useEffect)(()=>l.current?.remove,[]),!t)return null;if(!c)throw Error("Unsupported captcha site key");return(0,m.jsx)("div",{className:"hidden h-0 w-0",children:(0,m.jsx)(v.Nc,{...e,ref:l,siteKey:c,options:{action:i,size:"invisible",...e.delayedExecution?{appearance:"execute",execution:"execute"}:{}},onUnsupported:()=>{e.onUnsupported?.(),console.warn("Browser does not support Turnstile.")},onError:()=>{e.onError?.(),n("Captcha failed"),o(!1)},onSuccess:t=>{e.onSuccess?.(t),a(t),o(!1)},onExpire:()=>{e.onExpire?.();try{l.current?.reset(),n(void 0),a(void 0)}catch{n("expired_and_failed_reset")}}})})},r8=(0,s.createContext)({isNewUserThisSession:!1,isLinking:!1,linkingHint:null,walletConnectionStatus:null,mipdStore:null,connectors:[],rpcConfig:{rpcUrls:{}},showFiatPrices:!0,chains:[],clientAnalyticsId:null,pendingTransaction:null,nativeTokenSymbolForChainId:rT,initializeWalletProxy:rT,getAuthMeta:rT,getAuthFlow:rT,closePrivyModal:rT,openPrivyModal:rT,connectWallet:rT,initLoginWithWallet:rT,loginWithWallet:rT,initLoginWithFarcaster:rT,loginWithFarcaster:rT,loginWithCode:rT,initLoginWithEmail:rT,initLoginWithSms:rT,resendEmailCode:rT,resendSmsCode:rT,initLoginWithOAuth:rT,loginWithOAuth:rT,refreshUser:rT,walletProxy:null,createAnalyticsEvent:rT,getUsdTokenPrice:rT,recoverEmbeddedWallet:rT,getFiatOnRampConfig:rT,updateWallets:rT,setReadyToTrue:rT}),r7=()=>(0,s.useContext)(r8),r9=(0,s.createContext)({ready:!1,authenticated:!1,user:null,walletConnectors:null,connectWallet:rT,login:rT,linkEmail:rT,linkPhone:rT,linkFarcaster:rT,linkWallet:rT,linkGoogle:rT,linkTwitter:rT,linkDiscord:rT,linkGithub:rT,linkTiktok:rT,linkLinkedIn:rT,linkApple:rT,logout:rT,getAccessToken:rT,getEthereumProvider:rT,getEthersProvider:rT,getWeb3jsProvider:rT,unlinkEmail:rT,unlinkPhone:rT,unlinkWallet:rT,unlinkGoogle:rT,unlinkTwitter:rT,unlinkDiscord:rT,unlinkGithub:rT,unlinkTiktok:rT,unlinkLinkedIn:rT,unlinkApple:rT,unlinkFarcaster:rT,setActiveWallet:rT,forkSession:rT,createWallet:rT,signMessage:rT,enrollInMfa:rT,initEnrollmentWithSms:rT,initEnrollmentWithTotp:rT,promptMfa:rT,init:rT,submitEnrollmentWithSms:rT,submitEnrollmentWithTotp:rT,unenroll:rT,submit:rT,cancel:rT,sendTransaction:rT,exportWallet:rT,setWalletPassword:rT,initLoginWithEmail:rT,initLoginWithSms:rT,loginWithCode:rT,isModalOpen:!1}),ie=()=>(0,s.useContext)(r9),it=e=>{let[t,r]=(0,s.useState)("auto");return(0,s.useEffect)(()=>{let t=new ResizeObserver(e=>{r(e[0]?.contentRect.height??"auto")});return e.current&&t.observe(e.current),()=>{e.current&&t.unobserve(e.current)}},[e.current]),t},ir={login:{onComplete:[],onError:[]},logout:{onSuccess:[]},connectWallet:{onSuccess:[],onError:[]},createWallet:{onSuccess:[],onError:[]},configureMfa:{onMfaRequired:[]},accessToken:{onAccessTokenGranted:[],onAccessTokenRemoved:[]}},ii=(0,s.createContext)(void 0),ia=()=>(0,s.useContext)(ii);function io(e,t,r,...i){for(let n of e.current[t][r])n(...i)}var is=({success:e,fail:t})=>(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(il,{className:e?"success":t?"fail":""}),(0,m.jsx)(ic,{className:e?"success":t?"fail":""})]}),il=C.ZP.span`
  && {
    width: 82px;
    height: 82px;
    border-width: 4px;
    border-style: solid;
    border-color: ${e=>e.color??"var(--privy-color-accent)"};
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1.2s linear infinite;
    transition: border-color 800ms;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &&&.success {
    border-color: var(--privy-color-success);
    border-bottom-color: var(--privy-color-success);
  }

  &&&.fail {
    border-color: var(--privy-color-error);
    border-bottom-color: var(--privy-color-error);
  }
`,ic=(0,C.ZP)(il)`
  && {
    border-bottom-color: ${e=>e.color??"var(--privy-color-accent)"};
    animation: none;
    opacity: 0.5;
  }
`,id=e=>(0,m.jsx)(ih,{color:e.color||"var(--privy-color-foreground-3)"}),ih=(0,C.ZP)(il)`
  && {
    height: 0.9rem;
    width: 0.9rem;
    border-width: 1.5px;

    /* Override default Loader to match button transitions */
    transition: border-color 200ms ease;
  }
`,iu=C.ZP.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  user-select: none;

  & {
    width: 100%;
    cursor: pointer;
    border-radius: var(--privy-border-radius-md);

    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px; /* 137.5% */
    letter-spacing: -0.016px;
  }

  && {
    padding: 12px 16px;
  }

  &&:disabled {
    background-color: var(--privy-color-background-2);
    color: var(--privy-color-foreground-3);
    cursor: not-allowed;
  }
`,ip=({children:e,loading:t,disabled:r,loadingText:i="Loading...",...n})=>(0,m.jsx)(ig,{disabled:t||r,...n,children:t?(0,m.jsxs)("span",{children:[(0,m.jsx)(id,{}),i?(0,m.jsx)("span",{children:i}):null]}):e}),im=((0,C.ZP)(ip)`
  ${e=>e.hideAnimations&&C.iv`
      && {
        transition: none;
      }
    `}
`,({children:e,loading:t,disabled:r,loadingText:i="Loading...",...n})=>(0,m.jsx)(ig,{as:"a",disabled:t||r,...n,children:t?(0,m.jsxs)("span",{children:[(0,m.jsx)(id,{}),i?(0,m.jsx)("span",{children:i}):null]}):e})),ig=(0,C.ZP)(iu)`
  position: relative;

  && {
    background-color: ${e=>e.warn?"var(--privy-color-error)":"var(--privy-color-accent)"};
    color: var(--privy-color-foreground-accent);

    transition: background-color 200ms ease;
  }

  &:hover {
    background-color: ${e=>e.warn?"var(--privy-color-error)":"var(--privy-color-accent-dark)"};
  }

  &:active {
    background-color: ${e=>e.warn?"var(--privy-color-error)":"var(--privy-color-accent-dark)"};
  }

  &:hover:disabled,
  &:active:disabled {
    background-color: var(--privy-color-background-2);
    color: var(--privy-color-foreground-3);
    cursor: not-allowed;
  }

  /* If an anchor tag, :disabled isn't a thing, so manually set state */
  ${e=>e.disabled?C.iv`
          &&&,
          &&&:hover,
          &&&:active {
            background-color: var(--privy-color-background-2);
            color: var(--privy-color-foreground-3);
            cursor: not-allowed;
            pointer-events: none;
          }
        `:""}

  > span {
    display: flex;
    align-items: center;
    gap: 8px;

    opacity: 1;
    animation: fadein 200ms ease;
  }
`,iw=({children:e,loading:t,disabled:r,loadingText:i="Loading...",...n})=>(0,m.jsx)(ix,{disabled:t||r,...n,children:t?(0,m.jsxs)("span",{children:[(0,m.jsx)(id,{}),i?(0,m.jsx)("span",{children:i}):null]}):e}),ix=(0,C.ZP)(iu)`
  && {
    border-width: 1px;
    border-color: ${e=>e.warn?"var(--privy-color-error)":"var(--privy-color-foreground-4)"};
    color: var(--privy-color-foreground);

    transition: border-color 200ms ease;
  }

  &:hover,
  &:active {
    border-color: ${e=>e.warn?"var(--privy-color-error)":"var(--privy-color-foreground-3)"};
  }

  &:hover:disabled,
  &:active:disabled {
    border-color: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-3);
    cursor: not-allowed;
  }

  > span {
    display: flex;
    align-items: center;
    gap: 8px;

    opacity: 1;
    animation: fadein 200ms ease;
  }
`,iy=C.ZP.button`
  && {
    padding: 12px 16px;
    font-weight: 500;
    text-align: center;
    color: var(--privy-color-foreground-accent);
    background-color: var(--privy-color-accent);
    border-radius: var(--privy-border-radius-sm);
    min-width: 144px;
    opacity: ${e=>e.invisible?"0":"1"};
    transition: opacity 200ms ease, background-color 200ms ease, color 200ms ease;
    user-select: none;

    ${e=>e.invisible&&C.iv`
        pointer-events: none;
      `}

    &:hover {
      background-color: var(--privy-color-accent-dark);
    }
    &:active {
      background-color: var(--privy-color-accent-dark);
    }

    &:hover:disabled,
    &:active:disabled {
      background-color: var(--privy-color-background-2);
      color: var(--privy-color-foreground-3);
      cursor: not-allowed;
    }
  }
`,iv=(C.ZP.div`
  /* Set to match height of SoftCtaButton to avoid reflow if conditionally rendered */
  height: 44px;
`,({children:e,onClick:t,disabled:r,isSubmitting:i,...n})=>(0,m.jsxs)(ib,{isSubmitting:i,onClick:t,disabled:r,...n,children:[(0,m.jsx)("span",{children:e}),(0,m.jsx)("span",{children:(0,m.jsx)(id,{})})]})),ib=C.ZP.button`
  && {
    color: var(--privy-color-accent);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    cursor: pointer;
    border-radius: 0px var(--privy-border-radius-mdlg) var(--privy-border-radius-mdlg) 0px;
    border: none;
    transition: color 200ms ease;

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
    }

    :hover {
      color: var(--privy-color-accent-dark);
    }

    && > :first-child {
      opacity: ${e=>e.isSubmitting?0:1};
    }

    && > :last-child {
      position: absolute;
      display: flex;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);

      /** Will map to the opposite of first span */
      opacity: ${e=>e.isSubmitting?1:0};
    }

    :disabled,
    :hover:disabled {
      color: var(--privy-color-foreground-3);
      cursor: not-allowed;
    }
  }
`,iC=C.ZP.span`
  && {
    width: 82px;
    height: 82px;
    border-width: 4px;
    border-style: solid;
    border-color: ${e=>e.color??"var(--privy-color-accent)"};
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1.2s linear infinite;
    transition: border-color 800ms;
    border-bottom-color: ${e=>e.color??"var(--privy-color-accent)"};
  }
`,ij=()=>(0,m.jsx)("div",{}),ik=({backFn:e})=>(0,m.jsx)("div",{children:(0,m.jsx)(iP,{onClick:e,children:(0,m.jsx)(j.Z,{height:"16px",width:"16px",strokeWidth:2})})}),iE=e=>(0,m.jsx)("div",{children:(0,m.jsx)(iP,{onClick:e.onClose,children:(0,m.jsx)(k.Z,{height:"16px",width:"16px",strokeWidth:2})})}),i_=({backFn:e,onClose:t,title:r,closeable:i=!0})=>{let{closePrivyModal:n}=r7(),{app:a}=rO();return(0,m.jsxs)(iS,{children:[e?(0,m.jsx)(ik,{backFn:e}):(0,m.jsx)(ij,{}),r&&(0,m.jsx)(iT,{children:r}),a?.render.inDialog&&i?(0,m.jsx)(iE,{onClose:t||(()=>n())}):(0,m.jsx)(ij,{})]})},iP=C.ZP.button`
  && {
    cursor: pointer;
    display: flex;
    opacity: 0.6;

    background-color: var(--privy-color-background-2);
    border-radius: var(--privy-border-radius-full);
    padding: 4px;

    > svg {
      margin: auto;
      color: var(--privy-color-foreground);
    }

    :hover {
      opacity: 1;
    }
  }
`,iS=C.ZP.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: var(--privy-color-foreground);
  }

  > :first-child {
    flex: 1;
  }

  > :last-child {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
`,iT=C.ZP.div`
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  text-align: center;
  color: var(--privy-color-foreground-2);
`,iA=({style:e,...t})=>(0,m.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:"currentColor",style:{height:"1.5rem",width:"1.5rem",...e},...t,children:(0,m.jsx)("path",{fillRule:"evenodd",d:"M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z",clipRule:"evenodd"})}),iN=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
  padding-bottom: 16px;
`,iI=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,iO=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > span {
    position: absolute;
    left: -41px;
    top: -41px;
  }

  > div > svg {
    position: absolute;
    left: -19px;
    top: -19px;
  }
`,iF=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: auto;
  gap: 16px;
  flex-grow: 100;
`,iR=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
`,iL=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`,iM=(0,C.ZP)(iR)`
  padding: 20px 0;
`,iW=(0,C.ZP)(iR)`
  gap: 16px;
`,iU=C.ZP.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`,iD=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 76px;
`,iZ=(C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`,C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  padding: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  background: var(--privy-color-background-2);
  border-radius: var(--privy-border-radius-md);
  && h4 {
    color: var(--privy-color-foreground-3);
    font-size: 14px;
    text-decoration: underline;
    font-weight: medium;
  }
  && p {
    color: var(--privy-color-foreground-3);
    font-size: 14px;
  }
`),iz=C.ZP.div`
  height: 16px;
`,i$=C.ZP.div`
  height: 12px;
`,iB=C.ZP.div`
  position: relative;
`,iH=C.ZP.div`
  background-color: var(--privy-color-accent);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-color: white;
  border-width: 2px !important;
`,iG=C.ZP.div`
  margin-top: 16px;
  font-size: 13px;
  text-align: center;
  color: var(--privy-color-foreground-3);

  && > a {
    color: var(--privy-color-accent);
  }
`;function iq(e){let{legal:{privacyPolicyUrl:t,termsAndConditionsUrl:r}}=e.app,i=!!t,n=!!r,a=i&&n;return i||n?(0,m.jsxs)(iG,{children:["By logging in I agree to the"," ",n&&(0,m.jsx)("a",{href:r,target:"_blank",children:a?"Terms":"Terms of Service"}),a&&" & ",i&&(0,m.jsx)("a",{href:t,target:"_blank",children:"Privacy Policy"})]}):null}var iV=({protectedByPrivy:e})=>(0,m.jsx)(iK,{children:e?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(rx,{className:"hide-on-mobile"}),(0,m.jsx)("span",{className:"hide-on-mobile",children:(0,m.jsx)("a",{href:"https://www.privy.io/",target:"_blank",children:"Protected by Privy"})})]}):null}),iK=C.ZP.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
  padding-bottom: 12px;
  gap: 2px;

  font-size: 13px;

  && svg {
    height: 14px;
    width: 14px;
    margin-bottom: 2px;
    opacity: 0.5;
  }

  && a {
    color: var(--privy-color-foreground-3);
    &:hover {
      text-decoration: underline;
    }
  }

  @media all and (display-mode: standalone) {
    padding-bottom: 30px;
  }
`,iY=({title:e,description:t,children:r,...i})=>(0,m.jsx)(iX,{...i,children:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("h3",{children:e}),"string"==typeof t?(0,m.jsx)("p",{children:t}):t,r]})}),iQ=(0,C.ZP)(iY)`
  margin-bottom: 24px;
`,iJ=({title:e,description:t,icon:r,children:i,...n})=>(0,m.jsxs)(i0,{...n,children:[r||null,(0,m.jsx)("h3",{children:e}),"string"==typeof t?(0,m.jsx)("p",{children:t}):t,i]}),iX=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  width: 100%;
  margin-bottom: 24px;

  && h3 {
    font-size: 17px;
    color: var(--privy-color-foreground);
  }

  /* Sugar assuming children are paragraphs. Otherwise, handling styling on your own */
  && p {
    color: var(--privy-color-foreground-2);
    font-size: 14px;
  }
`,i0=(0,C.ZP)(iX)`
  align-items: center;
  text-align: center;
  gap: 16px;

  h3 {
    margin-bottom: 24px;
  }
`,i1=Array(6).fill(""),i2=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: auto;
  gap: 16px;
  flex-grow: 1;
`,i3=C.ZP.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;

  > div:last-child {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: var(--privy-border-radius-md);

    > input {
      border: 1px solid var(--privy-color-foreground-4);
      background: var(--privy-color-background);
      border-radius: var(--privy-border-radius-md);
      padding: 8px 10px;
      height: 58px;
      width: 46px;
      text-align: center;
      font-size: 18px;
    }

    > input:focus {
      border: 1px solid var(--privy-color-accent);
    }

    > input:invalid {
      border: 1px solid var(--privy-color-error);
    }

    > input.success {
      border: 1px solid var(--privy-color-success);
    }

    > input.fail {
      border: 1px solid var(--privy-color-error);
      animation: shake 180ms;
      animation-iteration-count: 2;
    }
  }

  @keyframes shake {
    0% {
      transform: translate(1px, 0px);
    }
    33% {
      transform: translate(-1px, 0px);
    }
    67% {
      transform: translate(-1px, 0px);
    }
    100% {
      transform: translate(1px, 0px);
    }
  }
`,i4=C.ZP.div`
  line-height: 20px;
  height: 20px;
  font-size: 13px;
  color: ${e=>e.success?"var(--privy-color-success)":e.fail?"var(--privy-color-error)":"var(--privy-color-foreground-3)"};
  display: flex;
  justify-content: flex-end;
  width: 100%;
`,i5=C.ZP.div`
  font-size: 13px;
  color: var(--privy-color-foreground-3);
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
  // Equal opposing size buffer to account for auto margining when the
  // success/fail text does not show up
  padding-bottom: 32px;

  > button {
    text-decoration: underline;
  }
`,i6=C.ZP.span`
  font-weight: 500;
  word-break: break-all;
`,i8=({icon:e,success:t,fail:r})=>(0,m.jsx)(m.Fragment,{children:(0,m.jsx)(i7,{children:(0,m.jsxs)("div",{children:[(0,m.jsx)(is,{success:t,fail:r}),"string"==typeof e?(0,m.jsx)("span",{style:{background:`url('${e}')`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"cover"}}):(0,m.jsx)(e,{style:{width:"38px",height:"38px"}})]})})}),i7=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > span {
    position: absolute;
    left: -41px;
    top: -41px;
  }

  > div > :last-child {
    position: absolute;
    left: -19px;
    top: -19px;
  }
`,i9=({style:e,...t})=>(0,m.jsxs)("svg",{width:"800px",height:"800px",viewBox:"0 0 64 64",xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",role:"img",preserveAspectRatio:"xMidYMid meet",style:{height:"28px",width:"28px",...e},...t,children:[(0,m.jsx)("path",{d:"M57.6 13.7c-.7-1-1.6-1.7-2.7-2.2c-3.4-1.7-11.6-1.3-12.3-5.7c-.9-5.7-5.9.1-6.8.1c-1.1 0-1.6-3.9-3.7-3.9c-2.2 0-2.7 3.9-3.7 3.9c-.9 0-5.9-5.8-6.8-.1c-.7 4.3-9 4-12.3 5.7c-1 .5-2 1.2-2.7 2.2c-.5.8.6 1.6 1.2.9c1.6-2 4.8-2.4 7.1-2.8c1.9-.4 4-.6 5.9-1.4c2.6-1 2.5-4.9 3.3-4.9c.6 0 2.7 3 4.5 3c1.6 0 2.6-3.7 3.5-3.7c.9 0 1.9 3.7 3.5 3.7c1.9 0 4-3 4.6-3c.8 0 .7 3.9 3.3 4.9c1.8.8 3.9 1 5.9 1.4c2.3.5 5.6.8 7.1 2.8c.5.7 1.6-.2 1.1-.9",fill:"#00b9f1"}),(0,m.jsx)("path",{d:"M53 57c0 2.8-2.2 5-5 5H16c-2.8 0-5-2.2-5-5V36h42v21z",fill:"#89967a"}),(0,m.jsx)("path",{d:"M32 12c-15.5 0-21 8.5-21 24v21h42V36c0-15.5-5.5-24-21-24",fill:"#b6c4a7"}),(0,m.jsxs)("g",{fill:"#89967a",children:[(0,m.jsx)("path",{d:"M11 55c-1.1 0-2-1.2-2-2.6v-6.8c0-1.4.9-2.6 2-2.6v12"}),(0,m.jsx)("path",{d:"M53 43c1.1 0 2 1.2 2 2.6v6.8c0 1.4-.9 2.6-2 2.6V43"})]}),(0,m.jsxs)("g",{fill:"#3e4347",children:[(0,m.jsx)("path",{d:"M7 20H5v30h4v-2H7z"}),(0,m.jsx)("path",{d:"M57 20v28h-2v2h4V20z"})]}),(0,m.jsx)("circle",{cx:"58",cy:"20",r:"4",fill:"#00b9f1"}),(0,m.jsx)("circle",{cx:"6",cy:"20",r:"4",fill:"#ff5263"}),(0,m.jsx)("path",{d:"M21.5 39.5c-4.4 0-8-3.6-8-8s3.6-8 8-8s8 3.6 8 8s-3.6 8-8 8",fill:"#efffd9"}),(0,m.jsx)("circle",{cx:"21.5",cy:"31.5",r:"6",fill:"#545b61"}),(0,m.jsx)("circle",{cx:"21.5",cy:"31.5",r:"2.3",fill:"#ff5263"}),(0,m.jsx)("path",{d:"M42.5 39.5c-4.4 0-8-3.6-8-8s3.6-8 8-8s8 3.6 8 8s-3.6 8-8 8",fill:"#efffd9"}),(0,m.jsx)("path",{d:"M42.5 37.5c-3.3 0-6-2.7-6-6s2.7-6 6-6s6 2.7 6 6s-2.7 6-6 6",fill:"#545b61"}),(0,m.jsx)("circle",{cx:"42.5",cy:"31.5",r:"2.3",fill:"#ff5263"}),(0,m.jsx)("path",{d:"M19.8 54.1c-7.4 0-7.4-13 0-13h24.5c7.4 0 7.4 13 0 13H19.8",fill:"#efffd9"}),(0,m.jsx)("path",{d:"M20.5 52.6c-6 0-6-10 0-10h23c6 0 6 10 0 10h-23",fill:"#89967a"}),(0,m.jsxs)("g",{opacity:".7",fill:"#3e4347",children:[(0,m.jsx)("path",{d:"M21.2 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"}),(0,m.jsx)("path",{d:"M25.9 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"}),(0,m.jsx)("path",{d:"M30.6 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"}),(0,m.jsx)("path",{d:"M35.4 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"}),(0,m.jsx)("path",{d:"M40.1 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"}),(0,m.jsx)("path",{d:"M44.8 50.7c0 1.2-2 1.2-2 0v-6.1c0-1.2 2-1.2 2 0v6.1"})]}),(0,m.jsx)("circle",{cx:"32",cy:"37",r:"2",fill:"#f5f5f5"}),(0,m.jsx)("path",{fill:"#545b61",d:"M30.316 35.862l.566-.565l2.828 2.828l-.565.566z"})]}),ne=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
`,nt=C.ZP.div`
  text-align: left;
  flex-grow: 1;
`,nr=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex-grow: 1;
`,ni=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* for Internet Explorer, Edge */
  -ms-overflow-style: none;

  /* for Firefox */
  scrollbar-width: none;

  /* for Chrome, Safari, and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
`,nn=C.ZP.button`
  && {
    width: 100%;
    font-size: 16px;
    line-height: 24px;

    /* Tablet and Up */
    @media (min-width: 440px) {
      font-size: 14px;
    }

    display: flex;
    gap: 12px;
    align-items: center;

    padding: 12px 16px;
    border: 1px solid var(--privy-color-foreground-4) !important;
    border-radius: var(--privy-border-radius-mdlg);
    background-color: var(--privy-color-background);
    transition: background-color 200ms ease;

    cursor: pointer;

    &:hover {
      background-color: var(--privy-color-background-2);
    }

    &:disabled {
      cursor: pointer;
      background-color: var(--privy-color-background-2);
    }

    svg {
      height: 24px;
      max-height: 24px;
      max-width: 24px;
    }
  }
`,na=C.ZP.div`
  width: 100%;
  ${e=>e.if?"display: none;":""}
`,no={coinbase_wallet:{logo:t9,displayName:"Coinbase Wallet",rdns:"com.coinbase.wallet"},metamask:{logo:rb,displayName:"MetaMask",rdns:"io.metamask"},phantom:{logo:rC,displayName:"Phantom"},rainbow:{logo:({style:e,...t})=>(0,m.jsxs)("svg",{width:"120",height:"120",viewBox:"0 0 120 120",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{height:24,width:24,...e},...t,children:[(0,m.jsx)("g",{clipPath:"url(#clip0_5_32)",children:(0,m.jsxs)("g",{clipPath:"url(#clip1_5_32)",children:[(0,m.jsx)("mask",{id:"mask0_5_32",style:{maskType:"alpha"},maskUnits:"userSpaceOnUse",x:"0",y:"0",width:"120",height:"120",children:(0,m.jsx)("path",{d:"M78.163 0H41.837C29.79 0 23.767 0 17.283 2.04999C10.203 4.62701 4.627 10.203 2.05 17.283C0 23.767 0 29.791 0 41.837V78.163C0 90.21 0 96.232 2.05 102.717C4.627 109.797 10.203 115.373 17.283 117.949C23.767 120 29.79 120 41.837 120H78.163C90.21 120 96.232 120 102.717 117.949C109.797 115.373 115.373 109.797 117.95 102.717C120 96.232 120 90.21 120 78.163V41.837C120 29.791 120 23.767 117.95 17.283C115.373 10.203 109.797 4.62701 102.717 2.04999C96.232 0 90.21 0 78.163 0Z",fill:"black"})}),(0,m.jsx)("g",{mask:"url(#mask0_5_32)",children:(0,m.jsx)("rect",{width:"120",height:"120",fill:"url(#paint0_linear_5_32)"})}),(0,m.jsx)("path",{d:"M20 38H26C56.9279 38 82 63.0721 82 94V100H94C97.3137 100 100 97.3137 100 94C100 53.1309 66.8691 20 26 20C22.6863 20 20 22.6863 20 26V38Z",fill:"url(#paint1_radial_5_32)"}),(0,m.jsx)("path",{d:"M84 94H100C100 97.3137 97.3137 100 94 100H84V94Z",fill:"url(#paint2_linear_5_32)"}),(0,m.jsx)("path",{d:"M26 20L26 36H20L20 26C20 22.6863 22.6863 20 26 20Z",fill:"url(#paint3_linear_5_32)"}),(0,m.jsx)("path",{d:"M20 36H26C58.0325 36 84 61.9675 84 94V100H66V94C66 71.9086 48.0914 54 26 54H20V36Z",fill:"url(#paint4_radial_5_32)"}),(0,m.jsx)("path",{d:"M68 94H84V100H68V94Z",fill:"url(#paint5_linear_5_32)"}),(0,m.jsx)("path",{d:"M20 52L20 36L26 36L26 52H20Z",fill:"url(#paint6_linear_5_32)"}),(0,m.jsx)("path",{d:"M20 62C20 65.3137 22.6863 68 26 68C40.3594 68 52 79.6406 52 94C52 97.3137 54.6863 100 58 100H68V94C68 70.804 49.196 52 26 52H20V62Z",fill:"url(#paint7_radial_5_32)"}),(0,m.jsx)("path",{d:"M52 94H68V100H58C54.6863 100 52 97.3137 52 94Z",fill:"url(#paint8_radial_5_32)"}),(0,m.jsx)("path",{d:"M26 68C22.6863 68 20 65.3137 20 62L20 52L26 52L26 68Z",fill:"url(#paint9_radial_5_32)"})]})}),(0,m.jsxs)("defs",{children:[(0,m.jsxs)("linearGradient",{id:"paint0_linear_5_32",x1:"60",y1:"0",x2:"60",y2:"120",gradientUnits:"userSpaceOnUse",children:[(0,m.jsx)("stop",{stopColor:"#174299"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#001E59"})]}),(0,m.jsxs)("radialGradient",{id:"paint1_radial_5_32",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(26 94) rotate(-90) scale(74)",children:[(0,m.jsx)("stop",{offset:"0.770277",stopColor:"#FF4000"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#8754C9"})]}),(0,m.jsxs)("linearGradient",{id:"paint2_linear_5_32",x1:"83",y1:"97",x2:"100",y2:"97",gradientUnits:"userSpaceOnUse",children:[(0,m.jsx)("stop",{stopColor:"#FF4000"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#8754C9"})]}),(0,m.jsxs)("linearGradient",{id:"paint3_linear_5_32",x1:"23",y1:"20",x2:"23",y2:"37",gradientUnits:"userSpaceOnUse",children:[(0,m.jsx)("stop",{stopColor:"#8754C9"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#FF4000"})]}),(0,m.jsxs)("radialGradient",{id:"paint4_radial_5_32",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(26 94) rotate(-90) scale(58)",children:[(0,m.jsx)("stop",{offset:"0.723929",stopColor:"#FFF700"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#FF9901"})]}),(0,m.jsxs)("linearGradient",{id:"paint5_linear_5_32",x1:"68",y1:"97",x2:"84",y2:"97",gradientUnits:"userSpaceOnUse",children:[(0,m.jsx)("stop",{stopColor:"#FFF700"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#FF9901"})]}),(0,m.jsxs)("linearGradient",{id:"paint6_linear_5_32",x1:"23",y1:"52",x2:"23",y2:"36",gradientUnits:"userSpaceOnUse",children:[(0,m.jsx)("stop",{stopColor:"#FFF700"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#FF9901"})]}),(0,m.jsxs)("radialGradient",{id:"paint7_radial_5_32",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(26 94) rotate(-90) scale(42)",children:[(0,m.jsx)("stop",{offset:"0.59513",stopColor:"#00AAFF"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#01DA40"})]}),(0,m.jsxs)("radialGradient",{id:"paint8_radial_5_32",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(51 97) scale(17 45.3333)",children:[(0,m.jsx)("stop",{stopColor:"#00AAFF"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#01DA40"})]}),(0,m.jsxs)("radialGradient",{id:"paint9_radial_5_32",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(23 69) rotate(-90) scale(17 322.37)",children:[(0,m.jsx)("stop",{stopColor:"#00AAFF"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#01DA40"})]}),(0,m.jsx)("clipPath",{id:"clip0_5_32",children:(0,m.jsx)("rect",{width:"120",height:"120",fill:"white"})}),(0,m.jsx)("clipPath",{id:"clip1_5_32",children:(0,m.jsx)("rect",{width:"120",height:"120",fill:"white"})})]})]}),displayName:"Rainbow",rdns:"me.rainbow"},wallet_connect:{logo:rF,displayName:"WalletConnect"},zerion:{logo:({style:e,...t})=>(0,m.jsxs)("svg",{width:"176",height:"176",viewBox:"0 0 176 176",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{height:24,width:24,...e},...t,children:[(0,m.jsxs)("g",{clipPath:"url(#clip0_1704_1423)",children:[(0,m.jsx)("path",{d:"M126.233 176H49.7672C22.287 176 0 153.723 0 126.233V49.7673C0 22.287 22.2769 0 49.7672 0H126.233C153.713 0 176 22.277 176 49.7673V126.233C176 153.723 153.713 176 126.233 176Z",fill:"#2461ED"}),(0,m.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M100.667 85.6591C83.4133 76.3353 62.4196 64.2443 46.6192 54.3891C41.9573 51.0306 44.3234 43.9023 49.9578 43.9023H128.138C132.499 43.9023 135.416 48.7648 133.231 52.4442C127.977 61.5174 120.308 73.0368 113.901 82.1702C110.462 87.0727 104.858 87.9149 100.667 85.6591ZM75.5031 88.6867C92.1858 97.5795 115.566 111.104 132.178 121.33C137.311 124.498 135.266 132.098 129.271 132.098C119.46 132.098 103.518 132.1 87.6592 132.103C71.9639 132.105 56.3497 132.108 46.8398 132.108C42.0476 132.108 39.5913 127.135 41.6265 123.666C48.5041 111.946 56.2338 100.116 62.6603 91.2834C65.5176 87.3433 71.3325 86.461 75.5031 88.6867Z",fill:"white"})]}),(0,m.jsx)("defs",{children:(0,m.jsx)("clipPath",{id:"clip0_1704_1423",children:(0,m.jsx)("rect",{width:"176",height:"176",fill:"white"})})})]}),displayName:"Zerion",rdns:"io.zerion.wallet"},brave_wallet:{logo:({...e})=>(0,m.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 436.49 511.97",height:"24",width:"24",...e,children:[(0,m.jsx)("defs",{children:(0,m.jsxs)("linearGradient",{id:"brave-linear-gradient",x1:"-18.79",y1:"359.73",x2:"194.32",y2:"359.73",gradientTransform:"matrix(2.05, 0, 0, -2.05, 38.49, 992.77)",gradientUnits:"userSpaceOnUse",children:[(0,m.jsx)("stop",{offset:"0",stopColor:"#f1562b"}),(0,m.jsx)("stop",{offset:"0.3",stopColor:"#f1542b"}),(0,m.jsx)("stop",{offset:"0.41",stopColor:"#f04d2a"}),(0,m.jsx)("stop",{offset:"0.49",stopColor:"#ef4229"}),(0,m.jsx)("stop",{offset:"0.5",stopColor:"#ef4029"}),(0,m.jsx)("stop",{offset:"0.56",stopColor:"#e83e28"}),(0,m.jsx)("stop",{offset:"0.67",stopColor:"#e13c26"}),(0,m.jsx)("stop",{offset:"1",stopColor:"#df3c26"})]})}),(0,m.jsx)("path",{style:{fill:"url(#brave-linear-gradient)"},d:"M436.49,165.63,420.7,122.75l11-24.6A8.47,8.47,0,0,0,430,88.78L400.11,58.6a48.16,48.16,0,0,0-50.23-11.66l-8.19,2.89L296.09.43,218.25,0,140.4.61,94.85,50.41l-8.11-2.87A48.33,48.33,0,0,0,36.19,59.3L5.62,90.05a6.73,6.73,0,0,0-1.36,7.47l11.47,25.56L0,165.92,56.47,380.64a89.7,89.7,0,0,0,34.7,50.23l111.68,75.69a24.73,24.73,0,0,0,30.89,0l111.62-75.8A88.86,88.86,0,0,0,380,380.53l46.07-176.14Z"}),(0,m.jsx)("path",{style:{fill:"#fff"},d:"M231,317.33a65.61,65.61,0,0,0-9.11-3.3h-5.49a66.08,66.08,0,0,0-9.11,3.3l-13.81,5.74-15.6,7.18-25.4,13.24a4.84,4.84,0,0,0-.62,9l22.06,15.49q7,5,13.55,10.76l6.21,5.35,13,11.37,5.89,5.2a10.15,10.15,0,0,0,12.95,0l25.39-22.18,13.6-10.77,22.06-15.79a4.8,4.8,0,0,0-.68-8.93l-25.36-12.8L244.84,323ZM387.4,175.2l.8-2.3a61.26,61.26,0,0,0-.57-9.18,73.51,73.51,0,0,0-8.19-15.44l-14.35-21.06-10.22-13.88-19.23-24a69.65,69.65,0,0,0-5.7-6.67h-.4L321,84.25l-42.27,8.14a33.49,33.49,0,0,1-12.59-1.84l-23.21-7.5-16.61-4.59a70.52,70.52,0,0,0-14.67,0L195,83.1l-23.21,7.54a33.89,33.89,0,0,1-12.59,1.84l-42.22-8-8.54-1.58h-.4a65.79,65.79,0,0,0-5.7,6.67l-19.2,24Q77.81,120.32,73,127.45L58.61,148.51l-6.78,11.31a51,51,0,0,0-1.94,13.35l.8,2.3A34.51,34.51,0,0,0,52,179.81l11.33,13,50.23,53.39a14.31,14.31,0,0,1,2.55,14.34L107.68,280a25.23,25.23,0,0,0-.39,16l1.64,4.52a43.58,43.58,0,0,0,13.39,18.76l7.89,6.43a15,15,0,0,0,14.35,1.72L172.62,314A70.38,70.38,0,0,0,187,304.52l22.46-20.27a9,9,0,0,0,3-6.36,9.08,9.08,0,0,0-2.5-6.56L159.2,237.18a9.83,9.83,0,0,1-3.09-12.45l19.66-36.95a19.21,19.21,0,0,0,1-14.67A22.37,22.37,0,0,0,165.58,163L103.94,139.8c-4.44-1.6-4.2-3.6.51-3.88l36.2-3.59a55.9,55.9,0,0,1,16.9,1.5l31.5,8.8a9.64,9.64,0,0,1,6.74,10.76L183.42,221a34.72,34.72,0,0,0-.61,11.41c.5,1.61,4.73,3.6,9.36,4.73l19.19,4a46.38,46.38,0,0,0,16.86,0l17.26-4c4.64-1,8.82-3.23,9.35-4.85a34.94,34.94,0,0,0-.63-11.4l-12.45-67.59a9.66,9.66,0,0,1,6.74-10.76l31.5-8.83a55.87,55.87,0,0,1,16.9-1.5l36.2,3.37c4.74.44,5,2.2.54,3.88L272,162.79a22.08,22.08,0,0,0-11.16,10.12,19.3,19.3,0,0,0,1,14.67l19.69,36.95A9.84,9.84,0,0,1,278.45,237l-50.66,34.23a9,9,0,0,0,.32,12.78l.15.14,22.49,20.27a71.46,71.46,0,0,0,14.35,9.47l28.06,13.35a14.89,14.89,0,0,0,14.34-1.76l7.9-6.45a43.53,43.53,0,0,0,13.38-18.8l1.65-4.52a25.27,25.27,0,0,0-.39-16l-8.26-19.49a14.4,14.4,0,0,1,2.55-14.35l50.23-53.45,11.3-13a35.8,35.8,0,0,0,1.54-4.24Z"})]}),displayName:"Brave Wallet",rdns:"com.brave.wallet"}},ns=({provider:e,displayName:t,logo:r,connectOnly:i,connector:n})=>{let{navigate:a}=rO(),{connectWallet:o}=r7(),s="wallet_connect_v2"===n.connectorType?e:n.walletClientType,c;return c="phantom"===n.connectorType?()=>{tq()?(o(n,s),a(i?"AWAITING_CONNECT_ONLY_CONNECTION":"AWAITING_CONNECTION")):a(l.tq?"PHANTOM_INTERSTITIAL_SCREEN":"INSTALL_PHANTOM_SCREEN")}:()=>{o(n,s),a(i?"AWAITING_CONNECT_ONLY_CONNECTION":"AWAITING_CONNECTION")},(0,m.jsxs)(nh,{onClick:c,children:[(0,m.jsx)(nd,{icon:nc(e,n.connectorType)??r}),(0,m.jsx)("span",{style:{textTransform:"capitalize"},children:nl(e,n.connectorType)||t||n.walletClientType}),(0,m.jsx)("span",{id:"connect-text",children:"Connect"})]})},nl=(e,t)=>no[e]?.displayName?no[e].displayName:"wallet_connect_v2"===t&&"wallet_connect"===e?"Wallet Connect":void 0,nc=(e,t)=>no[e]?.logo?no[e].logo:"wallet_connect_v2"===t&&"wallet_connect"===e?rF:void 0,nd=({icon:e})=>"string"==typeof e?(0,m.jsx)("img",{src:e,style:{height:24,width:24,borderRadius:4}}):e?(0,m.jsx)(e,{}):null,nh=(0,C.ZP)(nn)`
  /* Show "Connect" on hover */
  > #connect-text {
    font-weight: 500;
    text-align: right;
    flex: none;
    order: 2;
    flex-grow: 1;
    color: var(--privy-color-accent);
    opacity: 0;
    transition: opacity 0.1s ease-out;
  }

  :hover > #connect-text {
    opacity: 1;
  }

  @media (max-width: 440px) {
    > #connect-text {
      display: none;
    }
  }
`,nu=["coinbase_wallet"],np=["metamask","rainbow","zerion"],nm=["phantom"],nf=({connectOnly:e})=>{let{connectors:t}=r7(),{app:r}=rO(),i=ng(r?.appearance.walletList??[],t,e);return(0,m.jsxs)(m.Fragment,{children:[...i]})},ng=(e,t,r)=>{let i=[],n=[],a=[],o=t.find(e=>"wallet_connect_v2"===e.connectorType);for(let s of e)if("detected_wallets"===s)for(let a of t.filter(({connectorType:t,walletClientType:r})=>"injected"===t&&!e.includes(r))){let{walletClientType:e,walletBranding:t}=a;("unknown"===e?n:i).push((0,m.jsx)(ns,{connectOnly:r,provider:e,logo:t.icon,displayName:t.name,connector:a},`${s}-${e}`))}else if(nm.includes(s)){let e=t.find(e=>"injected"===e.connectorType&&e.walletClientType===s||e.connectorType===s);e&&i.push((0,m.jsx)(ns,{connectOnly:r,provider:s,connector:e},s))}else if(np.includes(s)){let e=t.find(e=>"injected"===e.connectorType&&e.walletClientType===s)??o;e&&i.push((0,m.jsx)(ns,{connectOnly:r,provider:s,connector:e},s))}else if(nu.includes(s)){let e=t.find(({connectorType:e})=>e===s);e&&i.push((0,m.jsx)(ns,{connectOnly:r,provider:s,connector:e},s))}else"wallet_connect"===s&&o&&a.push((0,m.jsx)(ns,{connectOnly:r,provider:s,connector:o},s));return[...n,...i,...a]},nw=()=>{let{app:e}=rO(),t=e?.appearance?.logo,r=`${e?.name} logo`,i={maxHeight:"90px",maxWidth:"180px"};return t?"string"==typeof t?(0,m.jsx)("img",{src:t,alt:r,style:i}):"svg"===t.type||"img"===t.type?s.cloneElement(t,{alt:r,style:i}):(console.warn("`config.appearance.logo` must be a string, or an SVG / IMG element. Nothing will be rendered."),null):null},nx=e=>{let{app:t}=rO();return t?.appearance.logo?(0,m.jsx)(ny,{...e,children:(0,m.jsx)(nw,{})}):null},ny=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  flex-grow: 1;
  justify-content: center;
`,nv=(0,C.ZP)(nx)`
  margin-bottom: 16px;
`,nb=e=>e?.privyErrorCode==="linked_to_another_user"?rl.ERROR_USER_EXISTS:e instanceof ro&&!e.details.default?e.details:e instanceof rr?rl.ERROR_TIMED_OUT:e instanceof ri?rl.ERROR_USER_REJECTED_CONNECTION:rl.ERROR_WALLET_CONNECTION,nC=e=>{if(!l.tq||!rM(e))return;let t=rW(e);t&&window.open(t,"_self","noopener,noreferrer")},nj=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
`,nk=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > span {
    position: absolute;
    left: -41px;
    top: -41px;
  }

  > div > :last-child {
    position: absolute;
    left: -19px;
    top: -19px;
  }
`,nE=e=>{let t=e.walletLogo;return(0,m.jsx)(m.Fragment,{children:(0,m.jsx)(nk,{children:(0,m.jsxs)("div",{children:[(0,m.jsx)(is,{success:e.success,fail:e.fail}),"string"==typeof t?(0,m.jsx)("span",{style:{background:`url('${t}')`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"cover"}}):(0,m.jsx)(t,{style:{width:"38px",height:"38px"}})]})})})},n_=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
`,nP=()=>(0,m.jsx)(nS,{children:(0,m.jsxs)(nT,{children:[(0,m.jsx)(nA,{}),(0,m.jsx)(nN,{})]})}),nS=C.ZP.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  margin: 12px;
  padding: 16px;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,nT=C.ZP.div`
  position: relative;
  height: 140px;
  width: 140px;

  opacity: 1;
  animation: fadein 200ms ease;
`,nA=C.ZP.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 140px;
  height: 140px;

  && {
    border: 4px solid var(--privy-color-accent-light);
    border-radius: 50%;
  }
`,nN=C.ZP.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 140px;
  height: 140px;
  animation: spin 1200ms linear infinite;

  && {
    border: 4px solid;
    border-color: var(--privy-color-accent) transparent transparent transparent;
    border-radius: 50%;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`,nI=["error","invalid_request_arguments","wallet_not_on_device","invalid_recovery_pin","insufficient_funds","missing_or_invalid_mfa","mfa_verification_max_attempts_reached","mfa_timeout","twilio_verification_failed"],nO=class extends Error{constructor(e,t){super(t),this.type=e}};function nF(e){let t=e.type;return"string"==typeof t&&nI.includes(t)}function nR(e){return nF(e)&&"wallet_not_on_device"===e.type}function nL(e){return!!(nF(e)&&"mfa_timeout"===e.type)}function nM(e){return!!(nF(e)&&"missing_or_invalid_mfa"===e.type)}function nW(e){return!!(nF(e)&&e.message.includes("code 429"))}function nU(e){let t;return!!("string"==typeof(t=e.type)&&"client_error"===t&&"MFA canceled"===e.message)}var nD=C.ZP.div`
  height: 44px;
`;function nZ(e){let[t,r]=(0,s.useState)(e.dimensions.width),[i,n]=(0,s.useState)(void 0),a=(0,s.useRef)(null);return(0,s.useEffect)(()=>{if(a.current&&void 0===t){let{width:e}=a.current.getBoundingClientRect();r(e)}let e=getComputedStyle(document.documentElement);n({background2:e.getPropertyValue("--privy-color-background-2"),foreground3:e.getPropertyValue("--privy-color-foreground-3"),foregroundAccent:e.getPropertyValue("--privy-color-foreground-accent"),accent:e.getPropertyValue("--privy-color-accent"),accentDark:e.getPropertyValue("--privy-color-accent-dark"),success:e.getPropertyValue("--privy-color-success")})},[]),(0,m.jsx)("div",{ref:a,children:t&&(0,m.jsxs)(nq,{children:[(0,m.jsx)("iframe",{style:{position:"absolute",zIndex:1},width:t,height:e.dimensions.height,allow:"clipboard-write self *",src:t0(e.origin,`/apps/${e.appId}/embedded-wallets/export`,{token:e.accessToken,address:e.address,width:`${t}px`,caid:e.clientAnalyticsId,...i})}),(0,m.jsx)(nV,{children:"Loading..."})]})})}function nz(e){return(0,m.jsx)("svg",{width:"16",height:"17",viewBox:"0 0 16 17",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:e.style,children:(0,m.jsx)("path",{d:"M14 8.81335C14 7.98493 13.3284 7.31335 12.5 7.31335H10C10 8.41792 9.10457 9.31335 8 9.31335C6.89543 9.31335 6 8.41792 6 7.31335H3.5C2.67157 7.31335 2 7.98493 2 8.81335M14 8.81335V12.8134C14 13.6418 13.3284 14.3134 12.5 14.3134H3.5C2.67157 14.3134 2 13.6418 2 12.8134V8.81335M14 8.81335V6.81335M2 8.81335V6.81335M14 6.81335C14 5.98493 13.3284 5.31335 12.5 5.31335H3.5C2.67157 5.31335 2 5.98493 2 6.81335M14 6.81335V4.81335C14 3.98493 13.3284 3.31335 12.5 3.31335H3.5C2.67157 3.31335 2 3.98493 2 4.81335V6.81335",stroke:"var(--privy-color-foreground-3)",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})}var n$=C.ZP.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`,nB=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 16px;
  margin-left: 11px;
  border-left: 1px solid var(--privy-color-foreground-4) !important;
`,nH=C.ZP.div`
  display: flex;
  align-items: top;
  gap: 8px;

  && a {
    color: var(--privy-color-accent);
    text-decoration: underline;
  }
`,nG=C.ZP.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -12px;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: 1px solid var(--privy-color-foreground-4) !important;
  font-size: 12px;
  font-weight: 900;
  border-radius: 100%;
  background: var(--privy-color-background);
  color: var(--privy-color-accent);
`,nq=C.ZP.div`
  overflow: visible;
  position: relative;
  height: 44px;
`,nV=C.ZP.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: 500;
  border-radius: var(--privy-border-radius-md);
  background-color: var(--privy-color-background-2);
  color: var(--privy-color-foreground-3);
`,nK=C.ZP.div`
  display: flex;
  align-items: center;
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 8px;
  padding-right: 8px;
  background-color: var(--privy-color-background-2);
  color: var(--privy-color-foreground-3);
  border-radius: var(--privy-border-radius-md);
  font-size: 12px;
  font-weight: 500;
  margin: auto;
`,nY=C.ZP.div`
  border: 1px solid var(--privy-color-background-2) !important;
  border-radius: var(--privy-border-radius-md);
  padding: 16px;
  padding-top: 24px;
  margin-top: -12px;

  && > div {
    display: inline-flex;
    align-items: center;
    gap: 2px;

    > svg {
      color: var(--privy-color-error);
      width: 14px;
      height: 14px;
    }

    > h4 {
      color: var(--privy-color-error);
    }
  }
`,nQ=C.iv`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.008px;
  text-align: left;
  transition: color 0.1s ease-in;
`,nJ=C.ZP.span`
  ${nQ}
  transition: color 0.1s ease-in;
  color: ${({error:e})=>e?"var(--privy-color-error)":"var(--privy-color-foreground-3)"};
  text-transform: ${({error:e})=>e?"":"capitalize"};

  &[aria-hidden='true'] {
    visibility: hidden;
  }
`,nX=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
`,n0=(0,C.ZP)(ip)`
  ${e=>e.hideAnimations&&C.iv`
      && {
        transition: none;
      }
    `}
`,n1=C.iv`
  && {
    width: 100%;
    border-width: 1px;
    border-radius: var(--privy-border-radius-md);
    border-color: var(--privy-color-foreground-3);
    background: var(--privy-color-background);
    color: var(--privy-color-foreground);

    padding: 12px;
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    line-height: 22px; /* 137.5% */
  }
`,n2=C.ZP.input`
  ${n1}

  &::placeholder {
    color: var(--privy-color-foreground-3);
    font-style: italic;
    font-size: 14px;
  }
`,n3=C.ZP.div`
  ${n1}
`,n4=C.ZP.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({centered:e})=>e?"center":"space-between"};
`,n5=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 32px 0;
  gap: 4px;

  & h3 {
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
  }

  & p {
    max-width: 300px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
`,n6=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 1rem;
`,n8=C.ZP.div`
  display: flex;
  text-align: left;
  align-items: center;

  gap: 8px;
  max-width: 300px;

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.008px;

  margin: 0 8px;
  color: var(--privy-color-foreground-2);

  > :first-child {
    min-width: 24px;
  }
`,n7=(C.ZP.div`
  height: var(--privy-height-modal-full);

  @media (max-width: 440px) {
    height: var(--privy-height-modal-compact);
  }
`,(0,C.ZP)(iu)`
  display: flex;
  flex: 1;
  gap: 4px;
  justify-content: center;

  && {
    background: var(--privy-color-background);
    border-radius: var(--privy-border-radius-md);
    border-color: var(--privy-color-foreground-3);
    border-width: 1px;
  }
`),n9=C.ZP.div`
  position: absolute;
  right: 0.5rem;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`,ae=(0,C.ZP)(R.Z)`
  height: 1.25rem;
  width: 1.25rem;
  stroke: var(--privy-color-accent);
  cursor: pointer;

  :active {
    stroke: var(--privy-color-accent-light);
  }
`,at=(0,C.ZP)(L.Z)`
  height: 1.25rem;
  width: 1.25rem;
  stroke: var(--privy-color-accent);
  cursor: pointer;

  :active {
    stroke: var(--privy-color-accent-light);
  }
`,ar=(0,C.ZP)(M.Z)`
  height: 1.25rem;
  width: 1.25rem;
  stroke: var(--privy-color-accent);
  cursor: pointer;

  :active {
    stroke: var(--privy-color-accent-light);
  }
`,ai=C.ZP.progress`
  height: 4px;
  width: 100%;
  margin: 8px 0;

  /* border-radius: 9999px; */
  ::-webkit-progress-bar {
    border-radius: 8px;
    background: var(--privy-color-foreground-4);
  }

  ::-webkit-progress-value {
    border-radius: 8px;
    transition: all 0.1s ease-out;
    background: ${({label:e})=>"Strong"===e&&"#78dca6"||"Medium"===e&&"var(--privy-color-warn)"||"var(--privy-color-error)"};
  }
`,an=({buttonHideAnimations:e,buttonLoading:t,password:r,onSubmit:i,onBack:n})=>{let[a,o]=(0,s.useState)(!0),[l,c]=(0,s.useState)(!1),[d,h]=(0,s.useState)(""),u=r===d;return(0,s.useEffect)(()=>{d&&!l&&c(!0)},[d]),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{title:"Confirm Password",closeable:!1,backFn:n}),(0,m.jsx)(iz,{}),(0,m.jsxs)(nX,{children:[(0,m.jsxs)(n5,{children:[(0,m.jsx)(F.Z,{height:48,width:48,stroke:"var(--privy-color-background)",fill:"var(--privy-color-accent)"}),(0,m.jsx)("h3",{style:{color:"var(--privy-color-foreground)"},children:"Confirm your password"}),(0,m.jsx)("p",{style:{color:"var(--privy-color-foreground-2)"},children:"Please re-enter your password below to continue."})]}),(0,m.jsxs)(n4,{children:[(0,m.jsx)(n2,{value:d,onChange:e=>h(e.target.value),onBlur:()=>c(!0),placeholder:"confirm your password",type:a?"password":"text"}),(0,m.jsx)(n9,{style:{right:"0.75rem"},children:a?(0,m.jsx)(at,{onClick:()=>o(!1)}):(0,m.jsx)(ar,{onClick:()=>o(!0)})})]}),(0,m.jsx)(nJ,{"aria-hidden":!l||u,error:!0,children:"Passwords do not match"})]}),(0,m.jsx)(n0,{onClick:i,loading:t,disabled:!u,hideAnimations:e,children:"Continue"}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},aa=({className:e,checked:t,color:r="var(--privy-color-accent)",...i})=>(0,m.jsx)("label",{children:(0,m.jsxs)(ao,{className:e,children:[(0,m.jsx)(al,{checked:t,...i}),(0,m.jsx)(ac,{color:r,checked:t,children:(0,m.jsx)(as,{viewBox:"0 0 24 24",children:(0,m.jsx)("polyline",{points:"20 6 9 17 4 12"})})})]})}),ao=C.ZP.div`
  display: inline-block;
  vertical-align: middle;
`,as=C.ZP.svg`
  fill: none;
  stroke: white;
  stroke-width: 3px;
`,al=C.ZP.input.attrs({type:"checkbox"})`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`,ac=C.ZP.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  transition: all 150ms;
  cursor: pointer;
  border-color: ${e=>e.color};
  border-radius: 3px;
  background: ${e=>e.checked?e.color:"var(--privy-color-background)"};

  && {
    /* This is necessary to override css reset for border width */
    border-width: 1px;
  }

  ${al}:focus + & {
    box-shadow: 0 0 0 1px ${e=>e.color};
  }

  ${as} {
    visibility: ${e=>e.checked?"visible":"hidden"};
  }
`,ad=({buttonHideAnimations:e,buttonLoading:t,onSubmit:r,onBack:i,config:n})=>{let[a,o]=(0,s.useState)(!1);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{title:"Confirm Password",closeable:!1,backFn:i}),(0,m.jsx)(iz,{}),(0,m.jsxs)(nX,{children:[(0,m.jsxs)(n5,{children:[(0,m.jsx)(F.Z,{height:48,width:48,stroke:"var(--privy-color-background)",fill:"var(--privy-color-error)"}),(0,m.jsx)("h3",{style:{color:"var(--privy-color-foreground)"},children:"Confirm you have saved"}),(0,m.jsx)("p",{style:{color:"var(--privy-color-foreground-2)"},children:"Losing access to your password means you will lose access to your account."})]}),(0,m.jsx)(n6,{children:(0,m.jsxs)(n8,{style:{color:"var(--privy-color-error)",cursor:"pointer"},onClick:e=>{e.preventDefault(),o(e=>!e)},children:[(0,m.jsx)(aa,{color:"var(--privy-color-error)",checked:a}),(0,m.jsx)(m.Fragment,{children:"I understand losing my password means losing my account."})]})})]}),(0,m.jsxs)(ah,{children:["user"===n.initiatedBy&&(0,m.jsx)(iw,{onClick:n.onCancel,disabled:t,children:"Cancel"}),(0,m.jsx)(n0,{onClick:r,loading:t,hideAnimations:e,disabled:!a,children:"Set Password"})]}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},ah=C.ZP.div`
  display: flex;
  gap: 10px;
`,au=/[a-z]/,ap=/[A-Z]/,am=/[0-9]/,af="!@#$%^&*()\\-_+.",ag=`a-zA-Z0-9${af}`,aw=RegExp(`[${af}]`),ax=RegExp(`[${ag}]`),ay=RegExp(`^[${ag}]{6,}$`),av=(e="")=>{let t=e.split("").filter(e=>!ax.test(e)).map(e=>e.replace(" ","SPACE"));return[...new Set(t)]},ab=()=>Z.OW(4,z.k),aC=({buttonHideAnimations:e,buttonLoading:t,password:r="",config:i,onSubmit:n,onClose:a,onPasswordChange:o,onPasswordGenerate:l})=>{let[c,d]=(0,s.useState)(!1),[h,u]=(0,s.useState)(!1);(0,s.useEffect)(()=>{r&&!h&&u(!0)},[r]);let p=(0,s.useMemo)(()=>h?6>(r?.length||0)?"Password must be at least 6 characters":ay.test(r||"")?null:`Invalid characters used ( ${av(r).join(" ")} )`:null,[r,h]),f=(0,s.useMemo)(()=>p?{value:0,label:"Weak"}:function(e=""){let t=function(e=""){return(.3*function(e){if(e.length<8)return 0;let t=0;return au.test(e)&&(t+=1),ap.test(e)&&(t+=1),am.test(e)&&(t+=1),aw.test(e)&&(t+=1),Math.max(0,Math.min(1,t/3))}(e)+D()(e)/95)/2}(e);return{value:t,label:t>.9?"Strong":t>.5?"Medium":"Weak"}}(r),[r,p]),g=(0,s.useMemo)(()=>!!(!r?.length||p),[p,r]);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:a,title:"Secure your account",closeable:"user"===i.initiatedBy}),(0,m.jsx)(iz,{}),(0,m.jsxs)(nX,{children:[(0,m.jsxs)(n5,{children:[(0,m.jsx)(W.Z,{height:48,width:48,stroke:"var(--privy-color-accent)"}),(0,m.jsx)("h3",{style:{color:"var(--privy-color-foreground)"},children:"Set your password"}),(0,m.jsx)("p",{style:{color:"var(--privy-color-foreground-2)"},children:"Select a strong, memorable password to secure your account."})]}),(0,m.jsxs)(n4,{children:[(0,m.jsx)(n2,{value:r,onChange:e=>o(e.target.value),placeholder:"enter or generate a strong password",type:c?"password":"text"}),(0,m.jsxs)(n9,{style:{width:"3.5rem"},children:[c?(0,m.jsx)(at,{onClick:()=>d(!1)}):(0,m.jsx)(ar,{onClick:()=>d(!0)}),(0,m.jsx)(ae,{onClick:l})]})]}),(0,m.jsx)(ai,{value:0===f.value?.01:f.value,label:f.label}),(0,m.jsx)(nJ,{error:!!p,children:p||`Password Strength: ${h?f.label:"--"}`}),(0,m.jsxs)(ak,{children:[(0,m.jsx)(aj,{children:(0,m.jsxs)(n6,{children:[(0,m.jsxs)(n8,{children:[(0,m.jsx)(A.Z,{width:24,height:24,fill:"var(--privy-color-accent)"}),"This password is used to secure your account."]}),(0,m.jsxs)(n8,{children:[(0,m.jsx)(A.Z,{width:24,height:24,fill:"var(--privy-color-accent)"}),"You will only be asked to enter it when signing on to a new device."]})]})}),(0,m.jsx)(n0,{onClick:n,loading:t,disabled:g,hideAnimations:e,children:"Continue"})]})]}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},aj=(0,C.ZP)(n6)`
  flex: 1;
  padding-top: 1rem;
`,ak=C.ZP.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`,aE=({buttonHideAnimations:e,buttonLoading:t,appName:r,password:i,onSubmit:n,onBack:a})=>{let[o,l]=(0,s.useState)(!1),c=(0,s.useCallback)(()=>{l(!0),i&&navigator.clipboard.writeText(i)},[i]),d=(0,s.useCallback)(()=>{let e=document.createElement("a"),t=r.toLowerCase().replace(/[^a-z\s]/g,"").replace(/\s/g,"-"),n=new Blob([a_(r,i)],{type:"text/plain"}),a=URL.createObjectURL(n);e.href=a,e.target="_blank",e.download=`${t}-privy-wallet-recovery.txt`,document.body.appendChild(e),e.click(),setTimeout(()=>{e.remove(),URL.revokeObjectURL(a)},5e3)},[i]);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:a,title:"Save Password",closeable:!1}),(0,m.jsx)(iz,{}),(0,m.jsxs)(nX,{children:[(0,m.jsxs)(n5,{children:[(0,m.jsx)(F.Z,{height:48,width:48,stroke:"var(--privy-color-background)",fill:"var(--privy-color-accent)"}),(0,m.jsx)("h3",{style:{color:"var(--privy-color-foreground)"},children:"Save your password"}),(0,m.jsx)("p",{style:{color:"var(--privy-color-foreground-2)"},children:"For your security, this password cannot be reset if you lose your device. Make sure to secure it to keep your assets safe."})]}),(0,m.jsx)(n4,{centered:!0,children:(0,m.jsx)(n3,{children:i})}),(0,m.jsxs)("div",{style:{display:"flex",margin:"12px 0",gap:"12px"},children:[(0,m.jsx)(n7,{onClick:c,children:o?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)($.Z,{style:{width:24,height:24},stroke:"var(--privy-color-accent)"}),"Copied"]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(B.Z,{style:{width:24,height:24},stroke:"var(--privy-color-accent)"}),"Copy"]})}),(0,m.jsxs)(n7,{onClick:d,children:[(0,m.jsx)(H.Z,{style:{width:24,height:24},stroke:"var(--privy-color-accent)"}),"Download"]})]})]}),(0,m.jsx)(n0,{onClick:n,loading:t,hideAnimations:e,children:"Continue"}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},a_=(e,t)=>`Your wallet recovery password for ${e} is

${t}

You will need this password to access your ${e} wallet on a new device. Please keep it somewhere safe.`,aP=({error:e,onClose:t})=>(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{closeable:!1}),(0,m.jsx)(iz,{}),e?(0,m.jsxs)(iW,{children:[(0,m.jsx)(O.Z,{stroke:"var(--privy-color-error)",width:"64px",height:"64px"}),(0,m.jsx)(iJ,{title:"Something went wrong",description:e})]}):(0,m.jsxs)(iW,{children:[(0,m.jsx)(G.Z,{stroke:"var(--privy-color-success)",width:"64px",height:"64px"}),(0,m.jsx)(iJ,{title:"Success"})]}),(0,m.jsx)(ip,{onClick:t,children:"Close"}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]}),aS=(e,t)=>{switch(e){case"creating":return"back"===t?e:"saving";case"saving":return"back"===t?"creating":"confirming";case"confirming":return"back"===t?"saving":"finalizing";case"finalizing":return"back"===t?"confirming":"done";default:return e}},aT=()=>{let[e,t]=(0,s.useReducer)(aS,"creating");return{send:t,state:e}},aA=({onSubmit:e,...t})=>{let{send:r,state:i}=aT(),n=(0,s.useCallback)(async()=>{"finalizing"===i&&await e(),r("next")},[i,r,e]);(0,s.useEffect)(()=>{let e;return"done"===i&&"automatic"===t.config.initiatedBy&&(e=setTimeout(()=>t.onClose?.(),1400)),()=>{e&&clearTimeout(e)}},[i,t.config.initiatedBy,t.onClose]);let a=(0,s.useCallback)(()=>{r("back")},[r]);return"creating"===i?(0,m.jsx)(aC,{...t,onSubmit:n}):"saving"===i?(0,m.jsx)(aE,{...t,onSubmit:n,onBack:a}):"confirming"===i?(0,m.jsx)(an,{...t,onSubmit:n,onBack:a}):"finalizing"===i?(0,m.jsx)(ad,{...t,onSubmit:n,onBack:a}):"done"===i?(0,m.jsx)(aP,{...t,onSubmit:n}):null},aN=C.ZP.div`
  height: 44px;
`,aI=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  gap: 4px;

  & h3 {
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
  }

  & p {
    max-width: 300px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
`,aO=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`,aF=C.ZP.div`
  line-height: 20px;
  height: 20px;
  font-size: 13px;
  color: var(--privy-color-error);
  text-align: left;
  margin-top: 0.5rem;
`,aR=(0,C.ZP)(ip)`
  ${e=>e.hideAnimations&&C.iv`
      && {
        // Remove animations because the recoverWallet task on the iframe partially
        // blocks the renderer, so the animation stutters and doesn't look good
        transition: none;
      }
    `}
`,aL=({style:e,...t})=>(0,m.jsxs)("svg",{width:"1000",height:"1000",viewBox:"0 0 1000 1000",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{height:"24px",...e},...t,children:[(0,m.jsx)("rect",{width:"1000",height:"1000",rx:"200",fill:"#855DCD"}),(0,m.jsx)("path",{d:"M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z",fill:"white"}),(0,m.jsx)("path",{d:"M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z",fill:"white"}),(0,m.jsx)("path",{d:"M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.444H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z",fill:"white"})]}),aM=e=>{let t=(0,m.jsx)(F.Z,{height:38,width:38,stroke:"var(--privy-color-error)"});if(e instanceof eR)return"client_request_timeout"===e.privyErrorCode?{title:"Timed out",detail:e.message,ctaText:"Try again",icon:t}:{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:t};if(e instanceof nO&&"twilio_verification_failed"===e.type)return{title:"Something went wrong",detail:e.message,ctaText:"Try again",icon:(0,m.jsx)(_.Z,{height:38,width:38,stroke:"var(--privy-color-error)"})};if(!(e instanceof eO))return e instanceof eF&&422===e.status?{title:"Something went wrong",detail:e.message,ctaText:"Try again",icon:t}:{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:t};switch(e.privyErrorCode){case"invalid_captcha":return{title:"Something went wrong",detail:"Please try again.",ctaText:"Try again",icon:t};case"disallowed_login_method":return{title:"Not allowed",detail:e.message,ctaText:"Try another method",icon:t};case"allowlist_rejected":return{title:"You don't have access to this app",detail:"Have you been invited?",ctaText:"Try another account",icon:(0,m.jsx)(iA,{style:{width:"38px",height:"38px",strokeWidth:"1",stroke:"var(--privy-color-accent)",fill:"var(--privy-color-accent)"}})};case"captcha_failure":return{title:"Captcha failed",detail:"Unable to verify you are a human.",ctaText:"Try again",icon:(0,m.jsx)(i9,{})};case"captcha_timeout":return{title:"Captcha failed",detail:"Something went wrong! Please try again later.",ctaText:"Try again",icon:(0,m.jsx)(i9,{})};case"linked_to_another_user":return{title:"Authentication failed",detail:"This account has already been linked to another user.",ctaText:"Try again",icon:(0,m.jsx)(aL,{style:{height:38,width:38}})};default:return{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:t}}},aW=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
  padding-bottom: 16px;
`,aU=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,aD=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > span {
    position: absolute;
    left: -41px;
    top: -41px;
  }

  > div > svg {
    position: absolute;
    left: -19px;
    top: -19px;
  }
`,aZ=({style:e,color:t,...r})=>(0,m.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"1.5",stroke:t||"currentColor",style:{height:"1.5rem",width:"1.5rem",...e},...r,children:(0,m.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4.5 12.75l6 6 9-13.5"})}),az=({color:e,...t})=>(0,m.jsx)("svg",{version:"1.1",id:"Layer_1",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",x:"0px",y:"0px",viewBox:"0 0 115.77 122.88",xmlSpace:"preserve",...t,children:(0,m.jsx)("g",{children:(0,m.jsx)("path",{fill:e||"currentColor",className:"st0",d:"M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"})})}),a$=e=>{let[t,r]=(0,s.useState)(!1);return(0,m.jsxs)(aB,{color:e.color,onClick:()=>{r(!0),navigator.clipboard.writeText(e.text),setTimeout(()=>r(!1),1500)},justCopied:t,children:[t?(0,m.jsx)(aZ,{style:{height:"14px",width:"14px"},strokeWidth:"2"}):(0,m.jsx)(az,{style:{height:"14px",width:"14px"}}),t?"Copied":"Copy"," ",e.itemName?e.itemName:"to Clipboard"]})},aB=C.ZP.button`
  display: flex;
  align-items: center;
  gap: 6px;

  && {
    margin: 8px 2px;
    font-size: 14px;
    color: ${e=>e.justCopied?"var(--privy-color-foreground)":e.color||"var(--privy-color-foreground-3)"};
    font-weight: ${e=>e.justCopied?"medium":"normal"};
    transition: color 350ms ease;

    :focus,
    :active {
      background-color: transparent;
      border: none;
      outline: none;
      box-shadow: none;
    }

    :hover {
      color: ${e=>e.justCopied?"var(--privy-color-foreground)":"var(--privy-color-foreground-2)"};
    }

    :active {
      color: 'var(--privy-color-foreground)';
      font-weight: medium;
    }

    @media (max-width: 440px) {
      margin: 12px 2px;
    }
  }

  svg {
    width: 14px;
    height: 14px;
  }
`,aH=e=>{let[t,r]=(0,s.useState)(!1);return(0,m.jsx)(aG,{color:e.color,onClick:()=>{r(!0),window.open(e.url,"_blank"),setTimeout(()=>r(!1),1500)},justOpened:t,children:e.text})},aG=C.ZP.button`
  display: flex;
  align-items: center;
  gap: 6px;

  && {
    margin: 8px 2px;
    font-size: 14px;
    color: ${e=>e.justOpened?"var(--privy-color-foreground)":e.color||"var(--privy-color-foreground-3)"};
    font-weight: ${e=>e.justOpened?"medium":"normal"};
    transition: color 350ms ease;

    :focus,
    :active {
      background-color: transparent;
      border: none;
      outline: none;
      box-shadow: none;
    }

    :hover {
      color: ${e=>e.justOpened?"var(--privy-color-foreground)":"var(--privy-color-foreground-2)"};
    }

    :active {
      color: 'var(--privy-color-foreground)';
      font-weight: medium;
    }

    @media (max-width: 440px) {
      margin: 12px 2px;
    }
  }

  svg {
    width: 14px;
    height: 14px;
  }
`,aq=()=>(0,m.jsx)("svg",{width:"200",height:"200",viewBox:"-77 -77 200 200",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{height:"28px",width:"28px"},children:(0,m.jsx)("rect",{width:"50",height:"50",fill:"black",rx:10,ry:10})}),aV=(e,t,r,i,n)=>{for(let a=t;a<t+i;a++)for(let t=r;t<r+n;t++){let r=e?.[t];r&&r[a]&&(r[a]=0)}return e},aK=e=>{let t=Y.create(e,{errorCorrectionLevel:"high"}).modules,r=tY(Array.from(t.data),t.size);return r=aV(r,0,0,7,7),r=aV(r,r.length-7,0,7,7),r=aV(r,0,r.length-7,7,7)},aY=({x:e,y:t,cellSize:r,bgColor:i,fgColor:n})=>(0,m.jsx)(m.Fragment,{children:[0,1,2].map(a=>(0,m.jsx)("circle",{r:r*(7-2*a)/2,cx:e+7*r/2,cy:t+7*r/2,fill:a%2!=0?i:n},`finder-${e}-${t}-${a}`))}),aQ=({cellSize:e,matrixSize:t,bgColor:r,fgColor:i})=>{let n=[[0,0],[(t-7)*e,0],[0,(t-7)*e]];return(0,m.jsx)(m.Fragment,{children:n.map(([t,n])=>(0,m.jsx)(aY,{x:t,y:n,cellSize:e,bgColor:r,fgColor:i},`finder-${t}-${n}`))})},aJ=({matrix:e,cellSize:t,color:r})=>(0,m.jsx)(m.Fragment,{children:e.map((e,i)=>e.map((e,n)=>e?(0,m.jsx)("circle",{r:t/2.5,cx:i*t+t/2,cy:n*t+t/2,fill:r},`circle-${i}-${n}`):(0,m.jsx)(s.Fragment,{},`circle-${i}-${n}`)))}),aX=(e,t)=>e-e%t,a0=({outputSize:e,cellSize:t,element:r,size:i,padding:n,bgColor:a})=>{if(!r)return(0,m.jsx)(m.Fragment,{});let o=i||40,s=n||4,l=e/2-o/2-s;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("rect",{x:aX(l,t),y:aX(l,t),width:o+2*s+(l%t?t+.5:.5),height:o+2*s+(l%t?t+.5:.5),fill:a}),(0,m.jsx)(r,{x:e/2-o/2,y:e/2-o/2,height:o,width:o})]})},a1=e=>{let t=e.outputSize,r=aK(e.url),i=t/r.length;return(0,m.jsxs)("svg",{height:e.outputSize,width:e.outputSize,viewBox:`0 0 ${e.outputSize} ${e.outputSize}`,style:{height:"100%",width:"100%"},children:[(0,m.jsx)(aJ,{matrix:r,cellSize:i,color:e.fgColor}),(0,m.jsx)(aQ,{cellSize:i,matrixSize:r.length,fgColor:e.fgColor,bgColor:e.bgColor}),(0,m.jsx)(a0,{outputSize:e.outputSize,cellSize:i,element:e.logo?.element,bgColor:e.bgColor})]})},a2=C.ZP.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${e=>`${e.size}px`};
  width: ${e=>`${e.size}px`};
  padding: 5px;
  margin: auto;
  background-color: ${e=>e.bgColor};

  && {
    border-width: 2px;
    border-color: ${e=>e.fgColor};
    border-radius: var(--privy-border-radius-md);
  }
`,a3=e=>{let t=e.bgColor||"#FFFFFF",r=e.fgColor||"#000000",i=e.size||160;return(0,m.jsx)(a2,{size:i,bgColor:t,fgColor:r,children:(0,m.jsx)(a1,{url:e.url,logo:{element:e.squareLogoElement??aq},outputSize:i,bgColor:t,fgColor:r})})},a4=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 0px 30px;
  @media (max-width: 440px) {
    padding: 10px 10px 20px;
  }
`,a5=C.ZP.div`
  font-size: 18px;
  line-height: 18px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
`,a6=C.ZP.div`
  font-size: 0.875rem;

  text-align: center;
`,a8=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-grow: 1;
  padding: 20px 0;
  @media (max-width: 440px) {
    padding: 10px 10px 20px;
  }
`,a7=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  padding: 1rem 0rem 0rem;
  flex-grow: 1;
  width: 100%;
`,a9=C.ZP.div`
  width: 25px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  > svg {
    z-index: 2;
    height: 25px !important;
    width: 25px !important;
    color: var(--privy-color-accent);
  }
`,oe=C.ZP.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  line-height: 1rem;
  text-align: left;
`,ot=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
`,or=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  padding: 1rem 0rem 0rem;
  flex-grow: 1;
  width: 100%;
`,oi=C.ZP.div`
  display: flex;
  gap: 5px;
  width: 100%;

  & > button:not(#remove) {
    width: 100%;
  }
`,on=C.ZP.button`
  && {
    background-color: transparent;
    color: var(--privy-color-foreground-3);
    padding: 0 10px;
    display: flex;
    align-items: center;
    width: fit-content;

    > svg {
      z-index: 2;
      height: 20px !important;
      width: 20px !important;
    }
  }

  &&:hover {
    color: var(--privy-color-error);
  }
`,oa=C.ZP.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > svg {
    z-index: 2;
    height: 20px !important;
    width: 20px !important;
  }
`,oo=C.ZP.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 400 !important;
  color: ${e=>e.isAccent?"var(--privy-color-accent)":"var(--privy-color-foreground-3)"};

  > svg {
    z-index: 2;
    height: 18px !important;
    width: 18px !important;
    display: flex !important;
    align-items: flex-end;
  }
`,os=C.ZP.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`,ol=C.ZP.p`
  text-align: left;
  width: 100%;
  color: var(--privy-color-foreground-3) !important;
`,oc=C.ZP.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  user-select: none;

  & {
    width: 100%;
    cursor: pointer;
    border-radius: var(--privy-border-radius-md);

    font-size: 0.875rem;
    line-height: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 22px; /* 137.5% */
    letter-spacing: -0.016px;
  }

  && {
    color: ${e=>"dark"===e.theme?"var(--privy-color-foreground-2)":"var(--privy-color-accent)"};
    background-color: transparent;

    padding: 0.5rem 0px;
  }

  &:hover {
    text-decoration: underline;
  }
`,od=C.ZP.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: ${({status:e})=>"success"===e?"var(--privy-color-success)":"var(--privy-color-accent)"};

  > svg {
    z-index: 2;
    height: 50px !important;
    width: auto !important;
    color: white;
  }
`,oh="#8a63d2",ou=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 27px;
  margin-right: 27px;
  gap: 24px;
`,op=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > span {
    position: absolute;
    left: -41px;
    top: -41px;
  }

  > div > svg {
    position: absolute;
    left: -19px;
    top: -19px;
  }
`,om=({size:e=61,...t})=>(0,m.jsx)("svg",{width:e,height:e,viewBox:"0 0 61 61",fill:"none",xmlns:"http://www.w3.org/2000/svg",...t,children:(0,m.jsxs)("g",{id:"moonpay_symbol_wht 2",children:[(0,m.jsx)("rect",{x:"1.3374",y:"1",width:"59",height:"59",rx:"11.5",fill:"#7715F5"}),(0,m.jsx)("path",{id:"Vector",d:"M43.8884 23.3258C45.0203 23.3258 46.1268 22.9901 47.068 22.3613C48.0091 21.7324 48.7427 20.8386 49.1759 19.7928C49.6091 18.747 49.7224 17.5962 49.5016 16.4861C49.2807 15.3759 48.7357 14.3561 47.9353 13.5557C47.1349 12.7553 46.1151 12.2102 45.0049 11.9893C43.8947 11.7685 42.7439 11.8819 41.6982 12.3151C40.6524 12.7482 39.7585 13.4818 39.1297 14.423C38.5008 15.3641 38.1651 16.4707 38.1651 17.6026C38.165 18.3542 38.3131 19.0985 38.6007 19.7929C38.8883 20.4873 39.3098 21.1182 39.8413 21.6496C40.3728 22.1811 41.0037 22.6027 41.6981 22.8903C42.3925 23.1778 43.1367 23.3259 43.8884 23.3258ZM26.3395 49.1017C23.5804 49.1017 20.8832 48.2836 18.5891 46.7507C16.295 45.2178 14.5069 43.039 13.4511 40.49C12.3952 37.9409 12.1189 35.1359 12.6572 32.4298C13.1955 29.7237 14.5241 27.238 16.4751 25.287C18.4262 23.336 20.9118 22.0074 23.6179 21.4691C26.324 20.9308 29.129 21.2071 31.6781 22.2629C34.2272 23.3189 36.406 25.1069 37.9389 27.401C39.4717 29.6952 40.2899 32.3923 40.2899 35.1514C40.2899 36.9835 39.9291 38.7975 39.2281 40.49C38.527 42.1826 37.4994 43.7205 36.204 45.0159C34.9086 46.3113 33.3707 47.3389 31.6781 48.04C29.9856 48.741 28.1715 49.1018 26.3395 49.1017Z",fill:"white"})]})}),of=({title:e,desc:t,icon:r})=>(0,m.jsxs)(oC,{children:[(0,m.jsx)(ok,{children:r}),(0,m.jsxs)(oj,{children:[(0,m.jsx)(ov,{children:e}),(0,m.jsx)(ob,{children:t})]})]}),og=({app:e,signedUrl:t,onContinue:r})=>(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(ox,{children:[(0,m.jsx)(om,{size:"3.75rem"}),(0,m.jsxs)(oy,{children:[e?.name," uses ",(0,m.jsx)("span",{style:{fontWeight:"bold"},children:"Moonpay"})," to fund your account"]}),(0,m.jsxs)(oE,{children:[(0,m.jsx)(of,{icon:(0,m.jsx)(Q.Z,{width:"1rem"}),title:"Purchase assets to fund your account",desc:(0,m.jsxs)(m.Fragment,{children:["Connect a payment method (",(0,m.jsx)("strong",{children:"debit card recommended"}),") to purchase digital assets."]})}),(0,m.jsx)(of,{icon:(0,m.jsx)(J.Z,{width:"1rem"}),title:"Compliance takes time",desc:"Funding a new account may take a few hours. You'll be good to go thereafter."}),(0,m.jsx)(of,{icon:(0,m.jsx)(L.Z,{width:"1rem"}),title:"Your data belongs to you",desc:"MoonPay does not sell your data and will only use it with your permission."})]}),(0,m.jsx)(o_,{className:"mobile-only"})]}),(0,m.jsx)(ow,{children:"By clicking continue, you will be taken to MoonPay in a new tab."}),(0,m.jsx)(im,{href:t,target:"_blank",rel:"noopener noreferrer",onClick:r,children:"Continue to Moonpay"})]}),ow=C.ZP.span`
  display: inline-block;
  color: var(--privy-color-foreground-3);
  text-align: center;
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 0.875rem */
  margin-bottom: 0.25rem;
`,ox=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
`,oy=C.ZP.span`
  color: var(--privy-color-foreground);
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.25rem; /* 111.111% */
  margin: 1.5rem 0;
  text-align: center;
  max-width: 19.5rem;
`,ov=C.ZP.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.225rem;
  width: 100%;
`,ob=C.ZP.span`
  color: var(--privy-color-foreground-2);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.225rem;
`,oC=C.ZP.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
`,oj=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
  text-align: left;
  flex: 1 0 0;
`,ok=C.ZP.div`
  padding-top: 2px;
`,oE=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 0 0.5rem;
`,o_=C.ZP.div`
  margin: 30px 0;
`,oP="moonpay",oS="sdk_fiat_on_ramp_completed_with_status";async function oT(e,t,r,i,n=!1){let a=r.currencyCode?{}:{defaultCurrencyCode:"ETH_ETHEREUM"},o=r.uiConfig||{accentColor:i.accent,theme:i.colorScheme};return e.signMoonpayOnRampUrl({address:t,useSandbox:n,config:{...r,...a,...o}})}async function oA(e,t){return(0,w.Wg)(`https://api.moonpay.com/v1/transactions/ext/${e}`,{query:{apiKey:t?"pk_test_fqWjXZMSFwloh7orvJsRfjiUHXJqFzI":"pk_live_hirbpu0cVcLHrjktC9l7fbc9ctjv0SL"}})}var oN=e=>{switch(e){case"completed":return{title:"You've funded your account!",body:"It may take a few minutes for the assets to appear.",cta:"Continue"};case"failed":return{title:"Something went wrong!",body:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)("p",{children:["It looks like there was an issue with your payment. Please contact"," ",(0,m.jsx)("a",{href:"https://support.moonpay.com/hc/en-gb",target:"_blank",rel:"noreferrer noopener",style:{textDecoration:"underline"},children:"Moonpay support"})," ","for assistance."]}),(0,m.jsx)("p",{style:{fontStyle:"italic"},children:"Note that debit cards typically work better than credit cards here."})]}),cta:"Done"};case"serviceFailure":return{title:"Something went wrong!",body:"MoonPay ran into an error when processing your transaction. Try again?",cta:"Done"};case"waitingAuthorization":return{title:"Processing payment",body:"This may take up to a few hours. You will receive an email when the purchase is complete.",cta:"Continue"};default:return{title:"In Progress",body:"Go back to MoonPay to finish funding your account.",cta:""}}},oI=({status:e,onClickCta:t})=>{let{title:r,body:i,cta:n}=(0,s.useMemo)(()=>oN(e),[e]);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(oM,{children:[(0,m.jsx)(oR,{status:e}),(0,m.jsxs)(iD,{children:[(0,m.jsx)("h3",{children:r}),(0,m.jsx)(oL,{children:i})]})]}),n&&(0,m.jsx)(ip,{onClick:t,children:n})]})},oO=e=>e?({completed:"var(--privy-color-success)",failed:"var(--privy-color-error)",serviceFailure:"var(--privy-color-error)",waitingAuthorization:"var(--privy-color-accent)",pending:"var(--privy-color-foreground-4)"})[e]:"var(--privy-color-foreground-4)",oF=e=>{switch(e){case"serviceFailure":case"failed":return T.Z;case"completed":return A.Z;case"waitingAuthorization":return()=>(0,m.jsx)(X.Z,{width:"3rem",height:"3rem",style:{backgroundColor:"var(--privy-color-foreground-4)",color:"var(--privy-color-background)",borderRadius:"100%",padding:"0.5rem",margin:"0.5rem"}});default:return}},oR=({status:e})=>{if(!e||"pending"===e){let e="var(--privy-color-foreground-4)";return(0,m.jsxs)("div",{style:{position:"relative"},children:[(0,m.jsx)(il,{color:e,style:{position:"absolute"}}),(0,m.jsx)(ic,{color:e}),(0,m.jsx)(om,{size:"3rem",style:{position:"absolute",top:"1rem",left:"1rem"}})]})}let t=oF(e),r=oO(e);return(0,m.jsx)("div",{style:{borderColor:r,display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"100%",borderWidth:2,padding:"0.5rem",marginBottom:"0.5rem"},children:t&&(0,m.jsx)(t,{width:"4rem",height:"4rem",color:r})})},oL=C.ZP.p`
  font-size: 1rem;
  color: var(--privy-color-foreground-3);
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`,oM=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 1.75rem;
  margin-right: 1.75rem;
  padding: 2rem 0;
`,oW=C.ZP.div`
  border-radius: 50%;
  height: 68px;
  width: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--privy-color-accent);
  color: white;
  margin: 0 auto 24px auto;
`,oU=({style:e,...t})=>(0,m.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",width:"17",height:"17",viewBox:"0 0 17 17",style:{height:"1.25rem",width:"1.25rem",...e},...t,children:(0,m.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",fillRule:"evenodd",clipRule:"evenodd",d:"M16.5 8.67993C16.5 9.82986 15.853 10.8287 14.9032 11.3322C15.2188 12.3599 14.97 13.5237 14.1569 14.3368C13.3437 15.1499 12.18 15.3987 11.1523 15.0831C10.6488 16.0329 9.64993 16.6799 8.5 16.6799C7.35007 16.6799 6.35126 16.0329 5.84771 15.0831C4.82003 15.3987 3.65627 15.1499 2.84314 14.3368C2.03001 13.5237 1.78124 12.3599 2.09681 11.3322C1.14699 10.8287 0.5 9.82986 0.5 8.67993C0.5 7.53 1.14699 6.53119 2.0968 6.02764C1.78125 4.99996 2.03003 3.83621 2.84315 3.02309C3.65627 2.20997 4.82002 1.96119 5.8477 2.27675C6.35125 1.32692 7.35007 0.679932 8.5 0.679932C9.64992 0.679932 10.6487 1.32691 11.1523 2.27672C12.18 1.96115 13.3437 2.20993 14.1569 3.02305C14.97 3.83618 15.2188 4.99996 14.9032 6.02764C15.853 6.53119 16.5 7.53 16.5 8.67993ZM12.2659 6.68856C12.5654 6.40238 12.5761 5.92763 12.29 5.62818C12.0038 5.32873 11.529 5.31797 11.2296 5.60416C9.73022 7.03711 8.40877 8.65489 7.3018 10.4211L5.78033 8.89963C5.48744 8.60673 5.01256 8.60673 4.71967 8.89963C4.42678 9.19252 4.42678 9.66739 4.71967 9.96029L6.92031 12.1609C7.08544 12.3261 7.31807 12.4048 7.54957 12.374C7.78106 12.3432 7.98499 12.2064 8.1012 12.0038C9.23027 10.0356 10.6362 8.24613 12.2659 6.68856Z",fill:"var(--privy-color-accent)"})}),oD=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
`,oZ=C.ZP.div`
  &&& {
    margin-left: 7px; /* TODO: This is a total hack */
    border-left: 2px solid var(--privy-color-foreground-4);
    height: 12px;
  }
`,oz=({children:e})=>(0,m.jsxs)(o$,{children:[(0,m.jsx)(oU,{style:{width:"16px",height:"16px"}}),e]}),o$=C.ZP.div`
  display: flex;
  justify-content: flex-start;
  justify-items: center;
  text-align: left;
  gap: 8px;

  && {
    a {
      text-decoration: underline;
      color: var(--privy-color-accent);
    }

    svg {
      margin-top: auto;
      margin-bottom: auto;
    }
  }
`,oB=()=>{let{navigate:e}=rO(),t="https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa?hl=en";return l.vU&&(t="https://addons.mozilla.org/en-US/firefox/addon/phantom-app/"),(0,m.jsxs)(oH,{children:[(0,m.jsx)(iY,{title:"Create a Phantom wallet",description:"Follow the instructions below to get started."}),(0,m.jsx)(iR,{children:(0,m.jsx)(rC,{style:{width:"152px",height:"152px"}})}),(0,m.jsxs)(oD,{children:[(0,m.jsx)(oz,{children:(0,m.jsxs)("div",{children:[(0,m.jsx)("span",{children:"Install the "}),(0,m.jsx)("a",{href:t,target:"_blank",children:"Phantom browser extension"})]})}),(0,m.jsx)(oZ,{}),(0,m.jsx)(oz,{children:"Set up your first wallet"}),(0,m.jsx)(oZ,{}),(0,m.jsx)(oz,{children:"Store your recovery phrase in a safe place!"})]}),(0,m.jsx)(iy,{onClick:()=>e("LANDING"),children:"Done! I have my wallet"})]})},oH=(0,C.ZP)(iR)`
  gap: 30px;

  > :first-child > svg {
    margin-top: 20px;
  }
`,oG=({...e})=>(0,m.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"25",height:"25",viewBox:"0 0 25 25",fill:"none",...e,children:[(0,m.jsxs)("g",{clipPath:"url(#clip0_2856_1743)",children:[(0,m.jsx)("path",{d:"M22.1673 8.24075V16.3642C22.1673 17.3256 21.3421 18.105 20.3241 18.105H17.0028M22.1673 8.24075C22.1673 7.27936 21.3421 6.5 20.3241 6.5H11.5302M22.1673 8.24075V8.42852C22.1673 9.03302 21.8352 9.59423 21.2901 9.91105L15.1463 13.4818C14.5539 13.8261 13.8067 13.8261 13.2143 13.4818L10.1621 11.5401",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,m.jsx)("path",{d:"M3.12913 6.64816C0.508085 12.9507 3.49251 20.1847 9.79504 22.8057L11.5068 23.5176C12.4522 23.9108 13.7783 23.2222 14.1714 22.2768L14.6054 21.2333C14.7687 20.8406 14.6438 20.3871 14.3024 20.1334L11.2872 17.8927C10.9878 17.6702 10.5843 17.6488 10.2632 17.8384L9.11575 18.5156C8.78274 18.7121 8.3597 18.6844 8.07552 18.4221C5.94293 16.4542 4.77629 13.6264 4.90096 10.7273C4.91757 10.3409 5.19796 10.023 5.57269 9.92753L6.86381 9.59869C7.22522 9.50664 7.49627 9.20696 7.55169 8.83815L8.10986 5.12321C8.17306 4.70259 7.94188 4.29293 7.54915 4.1296L6.50564 3.69564C5.56026 3.30248 4.23416 3.99103 3.84101 4.9364L3.12913 6.64816Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),(0,m.jsx)("defs",{children:(0,m.jsx)("clipPath",{id:"clip0_2856_1743",children:(0,m.jsx)("rect",{x:"0.5",y:"0.5",width:"24",height:"24",rx:"6",fill:"white"})})})]}),oq=(0,s.forwardRef)((e,t)=>{let[r,i]=(0,s.useState)(""),[n,a]=(0,s.useState)(!1),{authenticated:o}=ie(),{initLoginWithEmail:l}=r7(),{navigate:c,setModalData:d,currentScreen:h}=rO(),{enabled:u,token:p}=r5(),f=tK(r),g=n||!f,w=e=>{a(!0),l(r,e).then(()=>{c("AWAITING_PASSWORDLESS_CODE")}).catch(e=>{d({errorModalData:{error:e,previousScreen:h||"LANDING"}}),c("ERROR_SCREEN")}).finally(()=>{a(!1)})},x=()=>{!u||p||o?w(p):(d({captchaModalData:{callback:e=>l(r,e),userIntentRequired:!1,onSuccessNavigateTo:"AWAITING_PASSWORDLESS_CODE",onErrorNavigateTo:"ERROR_SCREEN"}}),c("CAPTCHA_SCREEN"))};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(oV,{children:(0,m.jsxs)(oK,{children:[(0,m.jsx)(E.Z,{}),(0,m.jsx)("input",{ref:t,id:"email-input",type:"email",placeholder:"your@email.com",onChange:e=>i(e.target.value),onKeyUp:e=>{"Enter"===e.key&&x()},value:r,autoComplete:"email"}),e.stacked?null:(0,m.jsx)(iv,{isSubmitting:n,onClick:x,disabled:g,children:"Submit"})]})}),e.stacked?(0,m.jsx)(ip,{loadingText:null,loading:n,disabled:g,onClick:x,children:"Submit"}):null]})}),oV=C.ZP.div`
  width: 100%;
`,oK=C.ZP.label`
  display: block;
  position: relative;
  width: 100%;
  background-color: var(--privy-color-background);
  transition: background-color 200ms ease;

  > svg {
    position: absolute;
    margin: 13px 17px;
    height: 24px;
    width: 24px;
    color: var(--privy-color-foreground-3);
  }

  && > input {
    font-size: 16px;
    line-height: 24px;

    padding: 12px 88px 12px 52px;
    flex-grow: 1;
    background: var(--privy-color-background);
    border: 1px solid var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-mdlg);
    width: 100%;

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      padding-right: 78px;
    }

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }

    :autofill,
    :-webkit-autofill {
      background: var(--privy-color-background);
    }
  }

  && > button {
    right: 0;
    line-height: 24px;
    position: absolute;
    padding: 13px 17px;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }
  }

  && > input::placeholder {
    color: var(--privy-color-foreground-3);
  }
`,oY=({isEditable:e,setIsEditable:t})=>{let r=(0,s.useRef)(null);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(na,{if:!e,children:(0,m.jsx)(oq,{ref:r})}),(0,m.jsx)(na,{if:e,children:(0,m.jsxs)(nn,{onClick:()=>{t(),setTimeout(()=>{r.current?.focus()},0)},children:[(0,m.jsx)(E.Z,{})," Continue with Email"]})})]})},oQ=()=>{let[e,t]=(0,s.useState)(!1),{currentScreen:r,navigate:i,setModalData:n}=rO(),{enabled:a,token:o}=r5(),{initLoginWithFarcaster:l}=r7();return(0,m.jsxs)(nn,{onClick:async()=>{t(!0);try{a&&!o?(n({captchaModalData:{callback:e=>l(e),userIntentRequired:!0,onSuccessNavigateTo:"AWAITING_FARCASTER_CONNECTION",onErrorNavigateTo:"ERROR_SCREEN"}}),i("CAPTCHA_SCREEN")):(await l(o),i("AWAITING_FARCASTER_CONNECTION"))}catch(e){n({errorModalData:{error:e,previousScreen:r||"LANDING"}}),i("ERROR_SCREEN")}finally{t(!1)}},disabled:!1,children:[(0,m.jsx)(aL,{})," Farcaster",e&&(0,m.jsx)("span",{children:(0,m.jsx)(id,{})})]})},oJ=(e,t)=>(0,er.t)(String(e),t),oX=(e,t)=>`+${(0,ei.G)(t)} ${e}`,o0=e=>`*${e.replaceAll("-","").slice(-4)}`,o1=e=>new en.R(e),o2=(0,ea.o)().map(e=>({code:e,callCode:(0,ei.G)(e)})),o3=e=>eo.L(e,et.Z)?.formatNational(),o4=({value:e,onChange:t})=>(0,m.jsx)("select",{value:e,onChange:t,children:o2.map(e=>(0,m.jsxs)("option",{value:e.code,children:[e.code," +",e.callCode]},e.code))}),o5=(0,s.forwardRef)((e,t)=>{let{app:r}=rO(),[i,n]=(0,s.useState)(""),[a,o]=(0,s.useState)(r?.intl.defaultCountry??"US"),l=oJ(i,a),c=o1(a),d=o3(a),h=(0,ei.G)(a),u=!l,[p,f]=(0,s.useState)(!1),g=h.length,w=t=>{try{let r=t.replace(/\D/g,""),o=i.replace(/\D/g,""),s=r===o?t:c.input(t);n(s),e.onChange&&e.onChange({rawPhoneNumber:s,qualifiedPhoneNumber:oX(t,a),countryCode:a,isValid:oJ(t,a)})}catch(e){console.error("Error processing phone number:",e)}},x=()=>{f(!0);let t=oX(i,a);e.onSubmit({rawPhoneNumber:i,qualifiedPhoneNumber:t,countryCode:a,isValid:oJ(i,a)}).finally(()=>f(!1))};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o6,{children:(0,m.jsxs)(o8,{callingCodeLength:g,children:[(0,m.jsx)(o4,{value:a,onChange:t=>{let r=t.target.value;o(r),n(""),e.onChange&&e.onChange({rawPhoneNumber:i,qualifiedPhoneNumber:oX(i,r),countryCode:r,isValid:oJ(i,a)})}}),(0,m.jsx)("input",{ref:t,id:"phone-number-input",type:"tel",placeholder:d,onChange:e=>{w(e.target.value)},onKeyUp:e=>{"Enter"===e.key&&x()},value:i,autoComplete:"tel"}),e.stacked||e.noIncludeSubmitButton?null:(0,m.jsx)(iv,{isSubmitting:p,onClick:x,disabled:u,children:"Submit"})]})}),e.stacked&&!e.noIncludeSubmitButton?(0,m.jsx)(ip,{loading:p,loadingText:null,onClick:x,disabled:u,children:"Submit"}):null]})}),o6=C.ZP.div`
  width: 100%;
`,o8=C.ZP.label`
  --country-code-dropdown-width: calc(54px + calc(12 * ${e=>e.callingCodeLength}px));
  --phone-input-extra-padding-left: calc(12px + calc(3 * ${e=>e.callingCodeLength}px));
  display: block;
  position: relative;
  width: 100%;
  background-color: var(--privy-color-background);
  transition: background-color 200ms ease;

  /* Tablet and Up */
  @media (min-width: 441px) {
    --country-code-dropdown-width: calc(52px + calc(10 * ${e=>e.callingCodeLength}px));
  }

  && > select {
    font-size: 16px;
    height: 24px;
    position: absolute;
    margin: 13px calc(var(--country-code-dropdown-width) / 4);
    line-height: 24px;
    width: var(--country-code-dropdown-width);
    background-color: var(--privy-color-background);
    background-size: auto;
    background-position-x: right;
    cursor: pointer;

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      width: var(--country-code-dropdown-width);
    }

    :focus {
      outline: none;
      box-shadow: none;
    }
  }

  && > input {
    font-size: 16px;
    line-height: 24px;
    verflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: calc(100% - var(--country-code-dropdown-width));

    padding: 12px 88px 12px
      calc(var(--country-code-dropdown-width) + var(--phone-input-extra-padding-left));
    flex-grow: 1;
    background: var(--privy-color-background);
    border: 1px solid var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-mdlg);
    width: 100%;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }

    :autofill,
    :-webkit-autofill {
      background: var(--privy-color-background);
    }

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      padding-right: 78px;
    }
  }

  && > button {
    right: 0;
    line-height: 24px;
    position: absolute;
    padding: 13px 17px;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }
  }

  && > input::placeholder {
    color: var(--privy-color-foreground-3);
  }
`,o7=({isEditable:e,setIsEditable:t})=>{let r=(0,s.useRef)(null),{authenticated:i}=ie(),{navigate:n,setModalData:a,currentScreen:o}=rO(),{initLoginWithSms:l}=r7(),{enabled:c,token:d}=r5();async function h({qualifiedPhoneNumber:e}){if(!c||d||i)try{await l(e,d),n("AWAITING_PASSWORDLESS_CODE")}catch(e){a({errorModalData:{error:e,previousScreen:o||"LANDING"}}),n("ERROR_SCREEN")}else a({captchaModalData:{callback:t=>l(e,t),userIntentRequired:!1,onSuccessNavigateTo:"AWAITING_PASSWORDLESS_CODE",onErrorNavigateTo:"ERROR_SCREEN"}}),n("CAPTCHA_SCREEN")}return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(na,{if:!e,children:(0,m.jsx)(o5,{ref:r,onSubmit:h})}),(0,m.jsx)(na,{if:e,children:(0,m.jsxs)(nn,{onClick:()=>{t(),setTimeout(()=>{r.current?.focus()},0)},children:[(0,m.jsx)(_.Z,{})," Continue with SMS"]})})]})},o9=({style:e,...t})=>(0,m.jsxs)("svg",{version:"1.1",xmlns:"http://www.w3.org/2000/svg",x:"0px",y:"0px",viewBox:"0 0 24 24",style:{height:"24px",...e},...t,children:[(0,m.jsx)("path",{d:"M17.0722 11.6888C17.0471 8.90571 19.3263 7.56847 19.429 7.50274C18.1466 5.60938 16.153 5.35154 15.4417 5.3212C13.7461 5.14678 12.1306 6.32982 11.269 6.32982C10.4074 6.32982 9.08004 5.34648 7.67246 5.37429C5.82158 5.40209 4.11595 6.45874 3.16171 8.13218C1.24068 11.4942 2.6708 16.4817 4.54423 19.2143C5.46091 20.549 6.55041 22.0531 7.98554 21.9975C9.36803 21.9419 9.88905 21.095 11.5571 21.095C13.2251 21.095 13.696 21.9975 15.1537 21.9697C16.6389 21.9393 17.5806 20.6046 18.4897 19.2648C19.5392 17.7153 19.9725 16.2137 19.9975 16.1354C19.965 16.1228 17.1022 15.0155 17.0722 11.6888Z",fill:"currentColor"}),(0,m.jsx)("path",{d:"M14.3295 3.51373C15.0909 2.58347 15.6043 1.28921 15.4641 0C14.3671 0.0455014 13.0396 0.738135 12.2532 1.66838C11.5494 2.48994 10.9307 3.80695 11.0986 5.07089C12.3183 5.16694 13.5681 4.44145 14.3295 3.51373Z",fill:"currentColor"})]}),se=({style:e,...t})=>(0,m.jsxs)("svg",{version:"1.1",xmlns:"http://www.w3.org/2000/svg",x:"0px",y:"0px",viewBox:"0 0 71 55",style:{height:"24px",...e},...t,children:[(0,m.jsx)("g",{clipPath:"url(#clip0)",children:(0,m.jsx)("path",{d:"M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z",fill:"#5865F2"})}),(0,m.jsx)("defs",{children:(0,m.jsx)("clipPath",{id:"clip0",children:(0,m.jsx)("rect",{width:"71",height:"55",fill:"white"})})})]}),st=({style:e,...t})=>(0,m.jsx)("svg",{version:"1.1",xmlns:"http://www.w3.org/2000/svg",x:"24",y:"24",viewBox:"0 0 98 96",style:{height:"24px",...e},...t,children:(0,m.jsx)("path",{d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"#171515"})}),sr=({style:e,...t})=>(0,m.jsxs)("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{height:"26px",width:"26px",...e},...t,children:[(0,m.jsx)("path",{d:"M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.665 15.63 16.89 16.795 15.725 17.575V20.335H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z",fill:"#4285F4"}),(0,m.jsx)("path",{d:"M12 23C14.97 23 17.46 22.015 19.28 20.335L15.725 17.575C14.74 18.235 13.48 18.625 12 18.625C9.13504 18.625 6.71004 16.69 5.84504 14.09H2.17004V16.94C3.98004 20.535 7.70004 23 12 23Z",fill:"#34A853"}),(0,m.jsx)("path",{d:"M5.845 14.09C5.625 13.43 5.5 12.725 5.5 12C5.5 11.275 5.625 10.57 5.845 9.91V7.06H2.17C1.4 8.59286 0.999321 10.2846 1 12C1 13.775 1.425 15.455 2.17 16.94L5.845 14.09Z",fill:"#FBBC05"}),(0,m.jsx)("path",{d:"M12 5.375C13.615 5.375 15.065 5.93 16.205 7.02L19.36 3.865C17.455 2.09 14.965 1 12 1C7.70004 1 3.98004 3.465 2.17004 7.06L5.84504 9.91C6.71004 7.31 9.13504 5.375 12 5.375Z",fill:"#EA4335"})]});function si({style:e,...t}){return(0,m.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",viewBox:"0,0,256,256",style:{height:"26px",width:"26px",...e},...t,children:(0,m.jsx)("g",{fill:"#0077b5",strokeWidth:"1",strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:"10",style:{mixBlendMode:"normal"},children:(0,m.jsx)("g",{transform:"scale(5.12,5.12)",children:(0,m.jsx)("path",{d:"M41,4h-32c-2.76,0 -5,2.24 -5,5v32c0,2.76 2.24,5 5,5h32c2.76,0 5,-2.24 5,-5v-32c0,-2.76 -2.24,-5 -5,-5zM17,20v19h-6v-19zM11,14.47c0,-1.4 1.2,-2.47 3,-2.47c1.8,0 2.93,1.07 3,2.47c0,1.4 -1.12,2.53 -3,2.53c-1.8,0 -3,-1.13 -3,-2.53zM39,39h-6c0,0 0,-9.26 0,-10c0,-2 -1,-4 -3.5,-4.04h-0.08c-2.42,0 -3.42,2.06 -3.42,4.04c0,0.91 0,10 0,10h-6v-19h6v2.56c0,0 1.93,-2.56 5.81,-2.56c3.97,0 7.19,2.73 7.19,8.26z"})})})})}function sn(e){return(0,m.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",clipRule:"evenodd",imageRendering:"optimizeQuality",shapeRendering:"geometricPrecision",textRendering:"geometricPrecision",viewBox:"0 0 293768 333327",width:24,height:24,...e,children:[(0,m.jsx)("path",{fill:"#26f4ee",d:"M204958 0c5369 45832 32829 78170 77253 81022v43471l-287 27V87593c-44424-2850-69965-30183-75333-76015l-47060-1v192819c6791 86790-60835 89368-86703 56462 30342 18977 79608 6642 73766-68039V0h58365zM78515 319644c-26591-5471-50770-21358-64969-44588-34496-56437-3401-148418 96651-157884v54345l-164 27v-40773C17274 145544 7961 245185 33650 286633c9906 15984 26169 27227 44864 33011z"}),(0,m.jsx)("path",{fill:"#fb2c53",d:"M218434 11587c3505 29920 15609 55386 35948 70259-27522-10602-43651-34934-47791-70262l11843 3zm63489 82463c3786 804 7734 1348 11844 1611v51530c-25770 2537-48321-5946-74600-21749l4034 88251c0 28460 106 41467-15166 67648-34260 58734-95927 63376-137628 35401 54529 22502 137077-4810 136916-103049v-96320c26279 15803 48830 24286 74600 21748V94050zm-171890 37247c5390-1122 11048-1985 16998-2548v54345c-21666 3569-35427 10222-41862 22528-20267 38754 5827 69491 35017 74111-33931 5638-73721-28750-49999-74111 6434-12304 18180-18959 39846-22528v-51797zm64479-119719h1808-1808z"}),(0,m.jsx)("path",{d:"M206590 11578c5369 45832 30910 73164 75333 76015v51528c-25770 2539-48321-5945-74600-21748v96320c206 125717-135035 135283-173673 72939-25688-41449-16376-141089 76383-155862v52323c-21666 3569-33412 10224-39846 22528-39762 76035 98926 121273 89342-1225V11577l47060 1z",fill:"#000000"})]})}var sa=({style:e,...t})=>(0,m.jsx)("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{height:"24px",width:"24px",...e},...t,children:(0,m.jsx)("path",{d:"M 14.285156 10.171875 L 23.222656 0 L 21.105469 0 L 13.34375 8.832031 L 7.148438 0 L 0 0 L 9.371094 13.355469 L 0 24.019531 L 2.117188 24.019531 L 10.308594 14.691406 L 16.851562 24.019531 L 24 24.019531 M 2.878906 1.5625 L 6.132812 1.5625 L 21.101562 22.535156 L 17.851562 22.535156",fill:"#000000"})}),so={apple:{logo:(0,m.jsx)(o9,{}),displayName:"Apple"},discord:{logo:(0,m.jsx)(se,{}),displayName:"Discord"},github:{logo:(0,m.jsx)(st,{}),displayName:"GitHub"},google:{logo:(0,m.jsx)(sr,{}),displayName:"Google"},linkedin:{logo:(0,m.jsx)(si,{}),displayName:"LinkedIn"},twitter:{logo:(0,m.jsx)(sa,{}),displayName:"Twitter"},tiktok:{logo:(0,m.jsx)(sn,{}),displayName:"TikTok"}},ss=({provider:e})=>{let{enabled:t,token:r}=r5(),{navigate:i,setModalData:n}=rO(),{initLoginWithOAuth:a}=r7(),{displayName:o,logo:s}=so[e];return(0,m.jsxs)(nn,{onClick:()=>{t&&!r?(n({captchaModalData:{callback:t=>a(e,t),userIntentRequired:!0,onSuccessNavigateTo:null,onErrorNavigateTo:"ERROR_SCREEN"}}),i("CAPTCHA_SCREEN")):a(e)},children:[s," ",o]})},sl=({onClick:e,text:t})=>(0,m.jsxs)(nn,{onClick:e,children:[(0,m.jsx)(P.Z,{}),(0,m.jsx)(nt,{children:t}),(0,m.jsx)(es.Z,{})]}),sc=({onClick:e,text:t,icon:r})=>(0,m.jsxs)(nn,{onClick:e,children:[r,(0,m.jsx)(nt,{children:t}),(0,m.jsx)(es.Z,{})]}),sd=(0,C.ZP)(nx)`
  margin-bottom: 16px;
`,sh=({priority:e,email:t,sms:r,social:i})=>"web2-first"===e?"Other socials":t&&r&&i.length>0||t&&i.length>0?"Log in with email or socials":r&&i.length>0?"Log in with sms or socials":t&&r?"Continue with email or sms":t?"Continue with email":r?"Continue with sms":"Log in with a social account",su=({priority:e,email:t,sms:r,social:i})=>"web2-first"===e||i.length>0?(0,m.jsx)(q.Z,{}):t&&r?(0,m.jsx)(oG,{}):t?(0,m.jsx)(E.Z,{}):r?(0,m.jsx)(_.Z,{}):null,sp=({priority:e})=>"web2-first"===e?"Continue with a wallet":"Other wallets",sm=({style:e,...t})=>(0,m.jsxs)("svg",{width:"164",height:"164",viewBox:"0 0 164 164",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{height:"26px",width:"26px",...e},...t,children:[(0,m.jsx)("circle",{cx:"82",cy:"82",r:"80",stroke:"#EC6351","stroke-width":"4","stroke-linecap":"round"}),(0,m.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M81.9999 100.788C93.3288 100.788 102.513 91.6043 102.513 80.2754C102.513 68.9465 93.3288 59.7626 81.9999 59.7626C70.671 59.7626 61.4871 68.9465 61.4871 80.2754C61.4871 91.6043 70.671 100.788 81.9999 100.788ZM88.3236 71.8304C88.9093 71.2446 89.8591 71.2446 90.4449 71.8304C91.0307 72.4161 91.0307 73.3659 90.4449 73.9517L84.121 80.2756L90.445 86.5996C91.0308 87.1854 91.0308 88.1351 90.445 88.7209C89.8592 89.3067 88.9095 89.3067 88.3237 88.7209L81.9997 82.3969L75.6756 88.7209C75.0899 89.3067 74.1401 89.3067 73.5543 88.7209C72.9685 88.1351 72.9685 87.1854 73.5543 86.5996L79.8783 80.2756L73.5544 73.9517C72.9686 73.3659 72.9686 72.4161 73.5544 71.8304C74.1402 71.2446 75.09 71.2446 75.6758 71.8304L81.9997 78.1543L88.3236 71.8304Z",fill:"#EC6351"})]}),sf=({children:e,open:t,onClick:r,...i})=>(0,m.jsx)(ew.u,{show:t,as:s.Fragment,children:(0,m.jsxs)(ex.V,{onClose:r,...i,as:sx,children:[(0,m.jsx)(ew.u.Child,{as:s.Fragment,enterFrom:"entering",leaveTo:"leaving",children:(0,m.jsx)(sw,{"aria-hidden":"true"})}),(0,m.jsx)(sy,{children:(0,m.jsx)(ew.u.Child,{as:s.Fragment,enterFrom:"entering",leaveTo:"leaving",children:(0,m.jsx)(ex.V.Panel,{as:sv,children:e})})})]})}),sg=C.ZP.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  width: 100%;
  background: var(--privy-color-background);
  padding: 0 16px;

  transition: height 150ms ease-out;
  overflow: hidden;

  // Ensure the modal gets pinned to the top if it ever gets too tall
  max-height: calc(100svh - 48px);

  border-radius: var(--privy-border-radius-lg) var(--privy-border-radius-lg) 0 0;
  box-shadow: 0px 0px 36px rgba(55, 65, 81, 0.15);

  @media (min-width: 441px) {
    box-shadow: 0px 8px 36px rgba(55, 65, 81, 0.15);
    border-radius: var(--privy-border-radius-lg);
  }
`,sw=C.ZP.div`
  position: fixed;
  inset: 0;

  transition: backdrop-filter 100ms ease;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);

  &.entering,
  &.leaving {
    backdrop-filter: unset;
    -webkit-backdrop-filter: unset;
  }
`,sx=C.ZP.div`
  position: relative;
  z-index: 999999;
`,sy=C.ZP.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 100vh;
`,sv=C.ZP.div`
  // reset some default dialog styles
  padding: 0;
  background: transparent;
  border: none;
  width: 100%;
  pointer-events: auto;

  outline: none;
  display: block;

  /* 
   * Normally it is bad to mix media queries like this We are doing
   * this here specifically for animations to avoid weird jank.
   */
  /* Mobile animation is a bottom drawer */
  @media (max-width: 440px) {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: transform 200ms ease-in;
    position: fixed;
    bottom: 0;

    &.entering,
    &.leaving {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
      transition: transform 150ms ease-in 0ms, opacity 0ms ease 150ms;
    }
  }

  /* Tablet/Desktop animation is a fade in */
  @media (min-width: 441px) {
    opacity: 1;
    transition: opacity 100ms ease-in;

    &.entering,
    &.leaving {
      opacity: 0;
      transition-delay: 5ms;
    }

    margin: auto;
    width: 360px;
    box-shadow: 0px 8px 36px rgba(55, 65, 81, 0.15);
    border-radius: var(--privy-border-radius-lg);
  }
`,sb=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`,sC=Array(6).fill("");function sj(e){return/^[0-9]{1}$/.test(e)}function sk(e){return 6===e.length&&e.every(sj)}var sE=({onChange:e,disabled:t,errorReasonOverride:r,success:i})=>{let[n,a]=(0,s.useState)(sC),[o,c]=(0,s.useState)(null),[d,h]=(0,s.useState)(null),u=async t=>{t.preventDefault();let r=t.currentTarget.value.replace(/\s+/g,"");if(""===r)return;let i=n.reduce((e,t)=>e+Number(sj(t)),0),o=r.split(""),s=!o.every(sj),l=o.length+i>6;if(s){c("Passcode can only be numbers"),h(1);return}if(l){c("Passcode must be exactly 6 numbers"),h(1);return}c(null),h(null);let d=Number(t.currentTarget.name?.charAt(4)),u=[...r||[""]].slice(0,6-d),p=[...n.slice(0,d),...u,...n.slice(d+u.length)];a(p);let m=Math.min(Math.max(d+u.length,0),5);if(document.querySelector(`input[name=pin-${m}]`)?.focus(),sk(p))try{await e(p.join("")),document.querySelector(`input[name=pin-${m}]`)?.blur()}catch(e){h(1),c(e.message)}else try{await e(null)}catch(e){h(1),c(e.message)}},p=t=>{1===d&&(c(null),h(null));let r=[...n.slice(0,t),"",...n.slice(t+1)];a(r),t>0&&document.querySelector(`input[name=pin-${t-1}]`)?.focus(),sk(r)?e(r.join("")):e(null)},f=i?"success":r||o?"fail":"";return(0,m.jsx)(m.Fragment,{children:(0,m.jsxs)(s_,{children:[(0,m.jsx)("div",{children:n.map((e,r)=>(0,m.jsx)("input",{name:`pin-${r}`,type:"text",value:n[r],onChange:u,onKeyUp:e=>{"Backspace"===e.key&&p(r)},inputMode:"numeric",autoFocus:0===r,pattern:"[0-9]",className:f,autoComplete:l.tq?"one-time-code":"off",disabled:t},r))}),(0,m.jsx)("div",{children:(0,m.jsx)(sP,{fail:!!r||!!o,children:r||o})})]})})},s_=C.ZP.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;

  ${sg}[data-height='medium'] & {
    margin-top: 22px;
  }

  @media (max-width: 440px) {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: var(--privy-border-radius-md);

    > input {
      border: 1px solid var(--privy-color-foreground-4);
      background: var(--privy-color-background);
      border-radius: var(--privy-border-radius-md);
      padding: 8px 10px;
      height: 58px;
      width: 46px;
      text-align: center;
      font-size: 18px;
    }

    > input:disabled {
      /* Use light-theme-bg-2 instead of disabled-bg for consistency with
      the callout bubble */
      background: var(--privy-color-background-2);
    }

    > input:focus {
      border: 1px solid var(--privy-color-accent);
    }

    > input:invalid {
      border: 1px solid var(--privy-color-error);
    }

    > input.success {
      border: 1px solid var(--privy-color-success);
    }

    > input.fail {
      border: 1px solid var(--privy-color-error);
      animation: shake 180ms;
      animation-iteration-count: 2;
    }
  }

  @keyframes shake {
    0% {
      transform: translate(1px, 0px);
    }
    33% {
      transform: translate(-1px, 0px);
    }
    67% {
      transform: translate(-1px, 0px);
    }
    100% {
      transform: translate(1px, 0px);
    }
  }
`,sP=C.ZP.div`
  line-height: 20px;
  font-size: 13px;
  display: flex;
  justify-content: flex-start;
  width: 100%;

  color: ${e=>e.fail?"var(--privy-color-error)":"var(--privy-color-foreground-3)"};
`;function sS(){let{promptMfa:e,init:t,submit:r,cancel:i}=(0,s.useContext)(r9);return{promptMfa:e,init:t,submit:r,cancel:i}}function sT(){let{initEnrollmentWithSms:e,initEnrollmentWithTotp:t,submitEnrollmentWithSms:r,submitEnrollmentWithTotp:i,unenroll:n,enrollInMfa:a}=(0,s.useContext)(r9);return{initEnrollmentWithSms:e,initEnrollmentWithTotp:t,submitEnrollmentWithSms:r,submitEnrollmentWithTotp:i,unenrollWithSms:()=>n("sms"),unenrollWithTotp:()=>n("totp"),showMfaEnrollmentModal:()=>a(!0),closeMfaEnrollmentModal:()=>a(!1)}}var sA=e=>(0,m.jsxs)(sN,{xmlns:"http://www.w3.org/2000/svg",fill:"none",width:"88",height:"89",viewBox:"0 0 88 89",...e,children:[(0,m.jsx)("rect",{y:"0.666016",width:"88",height:"88",rx:"44"}),(0,m.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M45.2463 20.9106C44.5473 20.2486 43.4527 20.2486 42.7537 20.9106C37.8798 25.5263 31.3034 28.3546 24.0625 28.3546C23.9473 28.3546 23.8323 28.3539 23.7174 28.3525C22.9263 28.3427 22.2202 28.8471 21.9731 29.5987C20.9761 32.6311 20.4375 35.8693 20.4375 39.2297C20.4375 53.5896 30.259 65.651 43.5482 69.0714C43.8446 69.1477 44.1554 69.1477 44.4518 69.0714C57.741 65.651 67.5625 53.5896 67.5625 39.2297C67.5625 35.8693 67.0239 32.6311 66.0269 29.5987C65.7798 28.8471 65.0737 28.3427 64.2826 28.3525C64.1677 28.3539 64.0527 28.3546 63.9375 28.3546C56.6966 28.3546 50.1202 25.5263 45.2463 20.9106ZM52.7249 40.2829C53.3067 39.4683 53.1181 38.3363 52.3035 37.7545C51.4889 37.1726 50.3569 37.3613 49.7751 38.1759L41.9562 49.1223L38.0316 45.1977C37.3238 44.4899 36.1762 44.4899 35.4684 45.1977C34.7605 45.9056 34.7605 47.0532 35.4684 47.761L40.9059 53.1985C41.2826 53.5752 41.806 53.7671 42.337 53.7232C42.868 53.6792 43.3527 53.4039 43.6624 52.9704L52.7249 40.2829Z"})]}),sN=C.ZP.svg`
  height: 90px;
  width: 90px;

  > rect {
    ${e=>"success"===e.color?"fill: var(--privy-color-success);":"fill: var(--privy-color-accent);"}
  }

  > path {
    fill: white;
  }
`,sI=({size:e,authUrl:t})=>(0,m.jsx)(a3,{url:t,squareLogoElement:em.Z,size:e,fgColor:"#1F1F1F"}),sO=({onComplete:e,onReset:t,onClose:r})=>{let[i,n]=(0,s.useState)(""),[a,o]=(0,s.useState)(!1),[l,c]=(0,s.useState)("enroll"),{initEnrollmentWithSms:d,submitEnrollmentWithSms:h}=sT(),{app:u,data:p,currentScreen:f,navigate:g,setModalData:w}=rO();function x(){p?.mfaEnrollmentFlow?.onSuccess(),e()}async function y({qualifiedPhoneNumber:e}){try{await d({phoneNumber:e}),n(e),c("verify")}catch(e){w({mfaEnrollmentFlow:p?.mfaEnrollmentFlow?{...p?.mfaEnrollmentFlow,selectedMfaMethod:"sms",seenIntro:!0}:void 0,errorModalData:{error:e,previousScreen:f||"MFA_ENROLLMENT_FLOW_SCREEN"}}),g("ERROR_SCREEN")}}async function v(e){try{if(!e)return;await h({phoneNumber:i,mfaCode:e}),o(!0)}catch(e){throw nW(e)?Error("You have exceeded the maximum number of attempts. Please close this window and try again in 10 seconds."):nM(e)?Error("The code you entered is not valid"):nL(e)?Error("You have exceeded the time limit for code entry. Please try again in 30 seconds."):nU(e)?Error("Verification canceled"):Error("Unknown error")}}return"enroll"===l?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:t,onClose:r},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(eu.Z,{})})}),(0,m.jsx)(a5,{children:"Set up SMS verification"}),(0,m.jsx)(a6,{children:"We'll text a verification code to this mobile device whenever you use your Privy wallet."}),(0,m.jsxs)(a8,{children:[(0,m.jsx)(o5,{onSubmit:y}),(0,m.jsxs)(ol,{children:["By providing your mobile number, you agree to receive text messages from ",u?.name,". Some carrier charges may apply"]})]}),(0,m.jsx)(iK,{})]}):a?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:x},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{status:"success",children:(0,m.jsx)(A.Z,{})})}),(0,m.jsx)(a5,{children:"SMS verification added"}),(0,m.jsx)(a6,{children:"From now on, you'll enter the verification code sent to your mobile device whenever you use your Privy wallet."}),(0,m.jsx)(ot,{children:(0,m.jsx)(ip,{onClick:x,children:"Done"})}),(0,m.jsx)(iK,{})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:function(){"verify"===l?c("enroll"):t()},onClose:r},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(eu.Z,{})})}),(0,m.jsx)(a5,{children:"Enter enrollment code"}),(0,m.jsxs)(a8,{children:[(0,m.jsx)(sE,{onChange:v}),(0,m.jsxs)(a6,{children:["To continue, enter the 6-digit code sent to ",(0,m.jsx)("strong",{children:o0(i)})]})]}),(0,m.jsx)(iK,{})]})},sF=({onComplete:e,onClose:t,onReset:r})=>{let[i,n]=(0,s.useState)("enroll"),[a,o]=(0,s.useState)(null),[l,c]=(0,s.useState)(!1),{initEnrollmentWithTotp:d,submitEnrollmentWithTotp:h}=sT(),{data:u}=rO();function p(){u?.mfaEnrollmentFlow?.onSuccess(),e()}async function f(e){try{if(!e)return;await h({mfaCode:e}),c(!0)}catch(e){throw nW(e)?Error("You have exceeded the maximum number of attempts. Please close this window and try again in 10 seconds."):nM(e)?Error("The code you entered is not valid"):nL(e)?Error("You have exceeded the time limit for code entry. Please try again in 30 seconds."):nU(e)?Error("Verification canceled"):Error("Unknown error")}}return(0,s.useEffect)(()=>{o(null),d().then(e=>{o(e)}).catch(()=>{o(null),r()})},[]),"enroll"===i?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:r,onClose:t},"header"),(0,m.jsx)(a5,{children:"Scan QR code"}),(0,m.jsx)(a6,{children:"Open your authenticator app and scan the QR code to continue."}),(0,m.jsx)(iM,{children:a?.authUrl?(0,m.jsx)(sI,{authUrl:a.authUrl,size:200}):(0,m.jsx)(il,{})}),(0,m.jsxs)(ot,{children:[(0,m.jsx)(iR,{children:a?.secret&&(0,m.jsx)(a$,{itemName:"secret",text:a.secret})}),(0,m.jsx)(ip,{onClick:function(){n("verify")},children:"Continue"})]}),(0,m.jsx)(iK,{})]}):l?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:p},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{status:"success",children:(0,m.jsx)(A.Z,{})})}),(0,m.jsx)(a5,{children:"Authenticator app verification added"}),(0,m.jsx)(a6,{children:"From now on, you'll enter the verification code generated by your authenticator app whenever you use your Privy wallet."}),(0,m.jsx)(ot,{children:(0,m.jsx)(ip,{onClick:p,children:"Done"})}),(0,m.jsx)(iK,{})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:function(){"verify"===i?n("enroll"):r()},onClose:t},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(ep.Z,{})})}),(0,m.jsx)(a5,{children:"Enter enrollment code"}),(0,m.jsx)(a8,{children:(0,m.jsx)(sE,{onChange:f})}),(0,m.jsxs)(a6,{children:["To continue, enter the 6-digit code generated from your ",(0,m.jsx)("strong",{children:"authenticator app"})]}),(0,m.jsx)(iK,{})]})},sR=({label:e,children:t,valueStyles:r})=>(0,m.jsxs)(sL,{children:[(0,m.jsx)("div",{children:e}),(0,m.jsx)(sM,{style:{...r},children:t})]}),sL=C.ZP.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  > :first-child {
    color: var(--privy-color-foreground-3);
    text-align: left;
  }

  > :last-child {
    color: var(--privy-color-foreground-2);
    text-align: right;
  }
`,sM=C.ZP.div`
  font-size: 14px;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--privy-border-radius-full);
  background-color: var(--privy-color-background-2);
  padding: 4px 8px;
`,sW=(e,t)=>{let r=(t*parseFloat((0,ev.dF)(e))).toFixed(2);return"0.00"!==r?`$${r}`:"<$0.01"},sU=(e,t,r=6,i=!1)=>{let n=parseFloat((0,ev.dF)(e)).toFixed(r).replace(/0+$/,"").replace(/\.$/,"");return i?`${n} ${t}`:`${"0"===n?"<0.001":n} ${t}`},sD=e=>e.map(sz).reduce((e,t)=>e.add(t),ey.O$.from(0)).toHexString(),sZ=(e,t)=>{let{chains:r}=r7(),i=`https://etherscan.io/address/${t}`,n=`${t7(e,r)}/address/${t}`;if(!n)return i;try{new URL(n)}catch{return i}return n},sz=e=>ey.O$.from(e),s$=({weiQuantities:e,tokenPrice:t,tokenSymbol:r})=>{let i=sD(e),n=t?sW(i,t):void 0,a=sU(i,r);return(0,m.jsx)(sH,{children:n||a})},sB=({weiQuantities:e,tokenPrice:t,tokenSymbol:r})=>{let i=sD(e),n=t?sW(i,t):void 0,a=sU(i,r);return(0,m.jsx)(sH,{children:n?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(sG,{children:"USD"}),"<$0.01"===n?(0,m.jsxs)(sV,{children:[(0,m.jsx)(sq,{children:"<"}),"$0.01"]}):n]}):a})},sH=C.ZP.span`
  font-size: 14px;
  line-height: 140%;
  display: flex;
  gap: 4px;
  align-items: center;
`,sG=C.ZP.span`
  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
`,sq=C.ZP.span`
  font-size: 10px;
`,sV=C.ZP.span`
  display: flex;
  align-items: center;
`,sK=({gas:e,tokenPrice:t,tokenSymbol:r})=>(0,m.jsxs)(iU,{style:{paddingBottom:"12px"},children:[(0,m.jsxs)(sQ,{children:[(0,m.jsx)(sX,{children:"Est. Fees"}),(0,m.jsx)("div",{children:(0,m.jsx)(sB,{weiQuantities:[e],tokenPrice:t,tokenSymbol:r})})]}),t&&(0,m.jsx)(sJ,{children:`${sU(e,r)}`})]}),sY=({transactionData:e,gas:t,tokenPrice:r,tokenSymbol:i})=>{let n=sz(e.value||0).add(sz(t)).toHexString();return(0,m.jsxs)(iU,{children:[(0,m.jsxs)(sQ,{children:[(0,m.jsx)(sX,{children:"Total (including fees)"}),(0,m.jsx)("div",{children:(0,m.jsx)(sB,{weiQuantities:[e.value||0,t],tokenPrice:r,tokenSymbol:i})})]}),r&&(0,m.jsx)(sJ,{children:sU(n,i)})]})},sQ=C.ZP.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
`,sJ=C.ZP.div`
  display: flex;
  flex-direction: row;
  height: 12px;

  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
  font-weight: 400;
`,sX=C.ZP.div`
  font-size: 14px;
  line-height: 22.4px;
  font-weight: 400;
`,s0=(0,s.createContext)(void 0),s1=(0,s.createContext)(void 0),s2=({defaultValue:e,children:t})=>{let[r,i]=(0,s.useState)(e||null);return(0,m.jsx)(s0.Provider,{value:{activePanel:r,togglePanel:e=>{i(r===e?null:e)}},children:(0,m.jsx)(s8,{children:t})})},s3=({value:e,children:t})=>{let{activePanel:r,togglePanel:i}=(0,s.useContext)(s0),n=r===e;return(0,m.jsx)(s1.Provider,{value:{onToggle:()=>i(e),value:e},children:(0,m.jsx)(lt,{isActive:n,"data-open":n,children:t})})},s4=({children:e})=>{let{activePanel:t}=(0,s.useContext)(s0),{onToggle:r,value:i}=(0,s.useContext)(s1),n=t===i;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(s7,{onClick:r,"data-open":n,children:[(0,m.jsx)(le,{children:e}),(0,m.jsx)(ln,{isactive:n,children:(0,m.jsx)(eb.Z,{height:"16px",width:"16px",strokeWidth:"2"})})]}),(0,m.jsx)(s9,{})]})},s5=({children:e})=>{let{activePanel:t}=(0,s.useContext)(s0),{value:r}=(0,s.useContext)(s1);return(0,m.jsx)(lr,{"data-open":t===r,children:(0,m.jsx)(li,{children:e})})},s6=({children:e})=>{let{activePanel:t}=(0,s.useContext)(s0),{value:r}=(0,s.useContext)(s1);return(0,m.jsx)(li,{children:"function"==typeof e?e({isActive:t===r}):e})},s8=C.ZP.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`,s7=C.ZP.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding-bottom: 8px;
`,s9=C.ZP.div`
  width: 100%;

  && {
    border-top: 1px solid;
    border-color: var(--privy-color-foreground-4);
  }
  padding-bottom: 12px;
`,le=C.ZP.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 19.6px;
  width: 100%;
  padding-right: 8px;
`,lt=C.ZP.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  padding: 12px;

  && {
    border: 1px solid;
    border-color: var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-md);
  }
`,lr=C.ZP.div`
  position: relative;
  overflow: hidden;
  transition: max-height 25ms ease-out;

  &[data-open='true'] {
    max-height: 700px;
  }

  &[data-open='false'] {
    max-height: 0;
  }
`,li=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1 1 auto;
  min-height: 1px;
`,ln=C.ZP.div`
  transform: ${e=>e.isactive?"rotate(180deg)":"rotate(0deg)"};
`,la=({walletAddress:e,chainId:t=tP})=>(0,m.jsx)(lo,{href:sZ(t,e),target:"_blank",children:tQ(e)}),lo=C.ZP.a`
  &:hover {
    text-decoration: underline;
  }
`,ls=({from:e,to:t,txn:r,transactionInfo:i,tokenPrice:n,gas:a,tokenSymbol:o})=>{let s=r?.value||0;return(0,m.jsx)(s2,{children:(0,m.jsxs)(s3,{value:"details",children:[(0,m.jsx)(s4,{children:(0,m.jsxs)(ll,{children:[(0,m.jsx)("div",{children:i?.title||i?.actionDescription||"Details"}),(0,m.jsx)(lc,{children:(0,m.jsx)(s$,{weiQuantities:[s],tokenPrice:n,tokenSymbol:o})})]})}),(0,m.jsxs)(s5,{children:[(0,m.jsx)(sR,{label:"From",children:(0,m.jsx)(la,{walletAddress:e,chainId:r.chainId||tP})}),(0,m.jsx)(sR,{label:"To",children:(0,m.jsx)(la,{walletAddress:t,chainId:r.chainId||tP})}),i&&i.action&&(0,m.jsx)(sR,{label:"Action",children:i.action}),a&&(0,m.jsx)(sK,{transactionData:r,gas:a,tokenPrice:n,tokenSymbol:o})]}),(0,m.jsx)(s6,{children:({isActive:e})=>(0,m.jsx)(sY,{transactionData:r,displayFee:e,gas:a||"0x0",tokenPrice:n,tokenSymbol:o})})]})})},ll=C.ZP.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`,lc=C.ZP.div`
  flex-shrink: 0;
  padding-left: 8px;
`,ld=({description:e,contractInfo:t})=>(0,m.jsxs)(lh,{children:[t.imgUrl&&(0,m.jsx)(lu,{size:t.imgSize||"sm",src:t.imgUrl,alt:t.imgAltText||`${t.name} image`}),t.url&&(0,m.jsx)(lp,{children:(0,m.jsx)("a",{href:t.url,target:"_blank",rel:"noopener noreferrer",children:t.url.replace(/^(https?:\/\/)(www\.)?/,"")})}),t.name&&(0,m.jsx)(lm,{children:t.name}),(0,m.jsx)(lf,{children:e||t.actionText})]}),lh=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
`,lu=C.ZP.img`
  && {
    height: ${e=>"sm"===e.size?"65px":"140px"};
    width: ${e=>"sm"===e.size?"65px":"140px"};
    border-radius: 16px;
    margin-bottom: 12px;
  }
`,lp=C.ZP.div`
  font-size: 12px;
  line-height: 12px;
  padding: 7px;

  && a {
    font-weight: 400;
    color: var(--privy-color-foreground-3);

    &:hover {
      text-decoration: underline;
    }
  }
`,lm=C.ZP.div`
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  max-width: 275px;
  text-overflow: ellipsis;
`,lf=C.ZP.div`
  font-size: 16px;
  line-height: 140%;
  font-weight: 400;
  color: var(--privy-color-foreground-1);
  overflow: hidden;
  max-width: 275px;
  text-overflow: ellipsis;
`,lg=({address:e,txn:t,balance:r,hasFunds:i})=>{let{nativeTokenSymbolForChainId:n}=r7(),a=n(t.chainId)||"ETH";return(0,m.jsxs)(lw,{children:[(0,m.jsxs)(lx,{children:[(0,m.jsx)(P.Z,{strokeWidth:"2",width:"16px",height:"16px"}),(0,m.jsx)("div",{children:tQ(e)})]}),(0,m.jsxs)(ly,{displayBalanceColor:!!r,hasFunds:i,children:[r?sU(r,a,6,!0):0," available"]})]})},lw=C.ZP.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 9px 12px;
  height: 40px;
  color: var(--privy-color-foreground-3);

  && {
    border: 1px solid var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-md);
  }
`,lx=C.ZP.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`,ly=C.ZP.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 100%;
  border-radius: 16px;
  background-color: var(--privy-color-background-2);
  padding: 5px 8px;
  color: ${e=>e.displayBalanceColor?e.hasFunds?"var(--privy-color-success-dark)":"var(--privy-color-error)":"inherit"};
`,lv=({description:e,txn:t,tokenSymbol:r,tokenPrice:i})=>{let n=t.value||0,a=i?sW(n,i):void 0,o=sU(n,r);return(0,m.jsxs)(lb,{children:[a?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(lC,{children:a}),(0,m.jsx)(lj,{children:o})]}):(0,m.jsx)(m.Fragment,{children:(0,m.jsx)(lC,{children:o})}),(0,m.jsx)(lk,{children:e})]})},lb=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`,lC=C.ZP.h2`
  && {
    font-size: 48px;
    line-height: 48px;
    margin: 8px auto;
  }
`,lj=C.ZP.p`
  margin-bottom: 12px;
  && {
    font-size: 17px;
    line-height: 17px;
    color: var(--privy-color-foreground-3);
  }
`,lk=C.ZP.div`
  font-size: 16px;
  line-height: 22.4px;
  font-weight: 400;
  overflow: hidden;
  max-width: 275px;
  text-overflow: ellipsis;
`,lE={id:42161,name:"Arbitrum One",network:"arbitrum",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:{alchemy:{http:["https://arb-mainnet.g.alchemy.com/v2"],webSocket:["wss://arb-mainnet.g.alchemy.com/v2"]},infura:{http:["https://arbitrum-mainnet.infura.io/v3"],webSocket:["wss://arbitrum-mainnet.infura.io/ws/v3"]},default:{http:["https://arb1.arbitrum.io/rpc"]},public:{http:["https://arb1.arbitrum.io/rpc"]}},blockExplorers:{etherscan:{name:"Arbiscan",url:"https://arbiscan.io"},default:{name:"Arbiscan",url:"https://arbiscan.io"}}},l_={id:421613,name:"Arbitrum Goerli",network:"arbitrum-goerli",nativeCurrency:{name:"Goerli Ether",symbol:"AGOR",decimals:18},rpcUrls:{alchemy:{http:["https://arb-goerli.g.alchemy.com/v2"],webSocket:["wss://arb-goerli.g.alchemy.com/v2"]},infura:{http:["https://arbitrum-goerli.infura.io/v3"],webSocket:["wss://arbitrum-goerli.infura.io/ws/v3"]},default:{http:["https://goerli-rollup.arbitrum.io/rpc"]},public:{http:["https://goerli-rollup.arbitrum.io/rpc"]}},blockExplorers:{etherscan:{name:"Arbiscan",url:"https://goerli.arbiscan.io/"},default:{name:"Arbiscan",url:"https://goerli.arbiscan.io/"}},testnet:!0},lP={id:421614,name:"Arbitrum Sepolia",network:"arbitrum-sepolia",nativeCurrency:{name:"Arbitrum Sepolia Ether",symbol:"ETH",decimals:18},rpcUrls:{default:{http:["https://sepolia-rollup.arbitrum.io/rpc"]},public:{http:["https://sepolia-rollup.arbitrum.io/rpc"]}},blockExplorers:{default:{name:"Blockscout",url:"https://sepolia-explorer.arbitrum.io"}},testnet:!0},lS={id:8453,network:"base",name:"Base",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:{blast:{http:["https://base-mainnet.blastapi.io"],webSocket:["wss://base-mainnet.blastapi.io"]},default:{http:["https://mainnet.base.org"]},public:{http:["https://mainnet.base.org"]}},blockExplorers:{etherscan:{name:"Basescan",url:"https://basescan.org"},default:{name:"Basescan",url:"https://basescan.org"}},testnet:!0},lT={id:84531,network:"base-goerli",name:"Base Goerli Testnet",nativeCurrency:{name:"Goerli Ether",symbol:"ETH",decimals:18},rpcUrls:{blast:{http:["https://base-goerli.blastapi.io"],webSocket:["wss://base-goerli.blastapi.io"]},default:{http:["https://goerli.base.org"]},public:{http:["https://goerli.base.org"]}},blockExplorers:{etherscan:{name:"Basescan",url:"https://goerli.basescan.org"},default:{name:"Basescan",url:"https://goerli.basescan.org"}},testnet:!0},lA={id:84532,network:"base-sepolia",name:"Base Sepolia",nativeCurrency:{name:"Sepolia Ether",symbol:"ETH",decimals:18},rpcUrls:{default:{http:["https://sepolia.base.org"]},public:{http:["https://sepolia.base.org"]}},blockExplorers:{default:{name:"Blockscout",url:"https://base-sepolia.blockscout.com"}},testnet:!0},lN={id:10,name:"OP Mainnet",network:"optimism",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:{alchemy:{http:["https://opt-mainnet.g.alchemy.com/v2"],webSocket:["wss://opt-mainnet.g.alchemy.com/v2"]},infura:{http:["https://optimism-mainnet.infura.io/v3"],webSocket:["wss://optimism-mainnet.infura.io/ws/v3"]},default:{http:["https://mainnet.optimism.io"]},public:{http:["https://mainnet.optimism.io"]}},blockExplorers:{etherscan:{name:"Etherscan",url:"https://optimistic.etherscan.io"},default:{name:"Optimism Explorer",url:"https://explorer.optimism.io"}}},lI={id:420,name:"Optimism Goerli Testnet",network:"optimism-goerli",nativeCurrency:{name:"Goerli Ether",symbol:"ETH",decimals:18},rpcUrls:{alchemy:{http:["https://opt-goerli.g.alchemy.com/v2"],webSocket:["wss://opt-goerli.g.alchemy.com/v2"]},infura:{http:["https://optimism-goerli.infura.io/v3"],webSocket:["wss://optimism-goerli.infura.io/ws/v3"]},default:{http:["https://goerli.optimism.io"]},public:{http:["https://goerli.optimism.io"]}},blockExplorers:{etherscan:{name:"Etherscan",url:"https://goerli-optimism.etherscan.io"},default:{name:"Etherscan",url:"https://goerli-optimism.etherscan.io"}},testnet:!0},lO={id:11155420,name:"Optimism Sepolia",network:"optimism-sepolia",nativeCurrency:{name:"Sepolia Ether",symbol:"ETH",decimals:18},rpcUrls:{default:{http:["https://sepolia.optimism.io"]},public:{http:["https://sepolia.optimism.io"]},infura:{http:["https://optimism-sepolia.infura.io/v3"]}},blockExplorers:{default:{name:"Blockscout",url:"https://optimism-sepolia.blockscout.com"}},testnet:!0},lF={id:7777777,name:"Zora",network:"zora",nativeCurrency:{decimals:18,name:"Ether",symbol:"ETH"},rpcUrls:{default:{http:["https://rpc.zora.energy"],webSocket:["wss://rpc.zora.energy"]},public:{http:["https://rpc.zora.energy"],webSocket:["wss://rpc.zora.energy"]}},blockExplorers:{default:{name:"Explorer",url:"https://explorer.zora.energy"}}},lR={id:999999999,name:"Zora Sepolia",network:"zora-sepolia",nativeCurrency:{decimals:18,name:"Zora Sepolia",symbol:"ETH"},rpcUrls:{default:{http:["https://sepolia.rpc.zora.energy"],webSocket:["wss://sepolia.rpc.zora.energy"]},public:{http:["https://sepolia.rpc.zora.energy"],webSocket:["wss://sepolia.rpc.zora.energy"]}},blockExplorers:{default:{name:"Zora Sepolia Explorer",url:"https://sepolia.explorer.zora.energy/"}},testnet:!0},lL={id:999,name:"Zora Goerli Testnet",network:"zora-testnet",nativeCurrency:{decimals:18,name:"Zora Goerli",symbol:"ETH"},rpcUrls:{default:{http:["https://testnet.rpc.zora.energy"],webSocket:["wss://testnet.rpc.zora.energy"]},public:{http:["https://testnet.rpc.zora.energy"],webSocket:["wss://testnet.rpc.zora.energy"]}},blockExplorers:{default:{name:"Explorer",url:"https://testnet.explorer.zora.energy"}},testnet:!0},lM={id:137,name:"Polygon Mainnet",network:"matic",nativeCurrency:{name:"MATIC",symbol:"MATIC",decimals:18},rpcUrls:{alchemy:{http:["https://polygon-mainnet.g.alchemy.com/v2"],webSocket:["wss://polygon-mainnet.g.alchemy.com/v2"]},infura:{http:["https://polygon-mainnet.infura.io/v3"],webSocket:["wss://polygon-mainnet.infura.io/ws/v3"]},default:{http:["https://polygon-rpc.com"]},public:{http:["https://polygon-rpc.com"]}},blockExplorers:{etherscan:{name:"PolygonScan",url:"https://polygonscan.com"},default:{name:"PolygonScan",url:"https://polygonscan.com"}}},lW={id:80001,name:"Mumbai",network:"maticmum",nativeCurrency:{name:"MATIC",symbol:"MATIC",decimals:18},rpcUrls:{alchemy:{http:["https://polygon-mumbai.g.alchemy.com/v2"],webSocket:["wss://polygon-mumbai.g.alchemy.com/v2"]},infura:{http:["https://polygon-mumbai.infura.io/v3"],webSocket:["wss://polygon-mumbai.infura.io/ws/v3"]},default:{http:["https://matic-mumbai.chainstacklabs.com"]},public:{http:["https://matic-mumbai.chainstacklabs.com"]}},blockExplorers:{etherscan:{name:"PolygonScan",url:"https://mumbai.polygonscan.com"},default:{name:"PolygonScan",url:"https://mumbai.polygonscan.com"}},testnet:!0},lU=[lM.id,lW.id],lD=e=>({maxPriorityFee:(0,ev.vz)(e.maxPriorityFee.toFixed(9),"gwei").toHexString(),maxFee:(0,ev.vz)(e.maxFee.toFixed(9),"gwei").toHexString()}),lZ=e=>({safeLow:lD(e.safeLow),standard:lD(e.standard),fast:lD(e.fast)}),lz=async e=>{let t="";switch(e){case lM.id:t="https://gasstation.polygon.technology/v2";break;case lW.id:t="https://gasstation-testnet.polygon.technology/v2";break;default:throw Error(`chainId ${e} does not support polygon gas stations`)}return lZ(await (0,w.Wg)(t))};function l$(e){if("number"==typeof e||"bigint"==typeof e||"string"==typeof e)return e;if("function"==typeof e.toHexString)return e.toHexString();throw Error(`Expected numeric value but received ${e}`)}async function lB(e,t,r){var i,n;let a;t.chainId=Number(t.chainId),lY(t);let o=new eC.b(e,r);if(t.gas&&(t.gasLimit=t.gas,delete t.gas),lU.includes(t.chainId)&&(!t.maxPriorityFeePerGas||!t.maxFeePerGas))try{let{standard:e}=await lz(t.chainId);t.maxPriorityFeePerGas||(t.maxPriorityFeePerGas=e.maxPriorityFee),t.maxFeePerGas||(t.maxFeePerGas=e.maxFee)}catch(e){throw Error(`Failed to set gas prices from Polygon gas station with error: ${e}.`)}if(n=t.chainId,[lE.id,l_.id,lP.id].includes(n)&&!t.maxFeePerGas)try{let{lastBaseFeePerGas:e}=await o.getFeeData();if(e){let r=e.mul(ey.O$.from(120)).div(ey.O$.from(100));t.maxFeePerGas=l$(r),t.maxPriorityFeePerGas=l$(ey.O$.from(0))}}catch(e){throw Error(`Failed to set gas price for Arbitrum transaction: ${e}.`)}if(lq(t.chainId)&&(!t.maxPriorityFeePerGas||!t.maxFeePerGas)&&!t.gasPrice)try{if(t.type=2,!t.maxPriorityFeePerGas){let e=await r.send("eth_maxPriorityFeePerGas",[]);t.maxPriorityFeePerGas=e}if(t.maxFeePerGas&&(console.warn("maxFeePerGas is specified without maxPriorityFeePerGas - this can result in hung transactions."),t.maxPriorityFeePerGas>=t.maxFeePerGas))throw Error("Overridden maxFeePerGas is less than or equal to the calculated maxPriorityFeePerGas. Please set both values or maxPriorityFeePerGas alone for correct gas estimation.");if(!t.maxFeePerGas){let{lastBaseFeePerGas:e}=await o.getFeeData();if(!e)throw Error("Unable to fetch baseFee for last block.");let r=ey.O$.from(e).mul(ey.O$.from(126)).div(ey.O$.from(100)).add(ey.O$.from(t.maxPriorityFeePerGas));t.maxFeePerGas=l$(r)}}catch(e){throw Error(`Failed to set gas price for OP stack transaction: ${e}.`)}return[56,97].includes(t.chainId)&&0!=t.type&&((1==t.type||2==t.type)&&console.warn("Transaction request type specified is incompatible for chain and will result in undefined behavior.  Please use transaction type 0."),void 0===t.type&&(t.type=0)),a={},void 0!==(i=await o.populateTransaction({to:t.to,from:t.from,nonce:t.nonce,gasLimit:t.gasLimit,gasPrice:t.gasPrice,data:t.data,value:t.value,chainId:t.chainId,type:t.type,accessList:t.accessList,maxFeePerGas:t.maxFeePerGas,maxPriorityFeePerGas:t.maxPriorityFeePerGas})).to&&(a.to=i.to),void 0!==i.data&&(a.data=i.data),void 0!==i.chainId&&(a.chainId=i.chainId),void 0!==i.type&&(a.type=i.type),void 0!==i.accessList&&(a.accessList=i.accessList),void 0!==i.nonce&&(a.nonce=l$(i.nonce)),void 0!==i.gasLimit&&(a.gasLimit=l$(i.gasLimit)),void 0!==i.gasPrice&&(a.gasPrice=l$(i.gasPrice)),void 0!==i.value&&(a.value=l$(i.value)),void 0!==i.maxFeePerGas&&(a.maxFeePerGas=l$(i.maxFeePerGas)),void 0!==i.maxPriorityFeePerGas&&(a.maxPriorityFeePerGas=l$(i.maxPriorityFeePerGas)),a}async function lH(e,t,r,i,n){lY(i=Object.assign({chainId:tP},i));let a=(await r.rpc({address:t,accessToken:e,request:{method:"eth_signTransaction",params:[i]}})).response.data;return await n.sendTransaction(a)}async function lG(e,t,r){let i=await r.getBalance(e),n=t.value||0,a=i.sub(sz(n));return{balance:i,hasSufficientFunds:!a.isNegative()&&!a.isZero()}}function lq(e){return[lS.id,lT.id,lA.id,lN.id,lI.id,lO.id,lF.id,lL.id,lR.id].includes(e)}async function lV(e,t){if(!e.chainId||e.chainId&&!lq(e.chainId))return ey.O$.from(0);let r=ey.O$.from(0);try{let i;let n=new ej.CH("0x420000000000000000000000000000000000000F",tS,t),a=(i={},void 0!==e.to&&(i.to=e.to),void 0!==e.data&&(i.data=e.data),void 0!==e.chainId&&(i.chainId=e.chainId),void 0!==e.type&&(i.type=e.type),void 0!==e.accessList&&(i.accessList=e.accessList),void 0!==e.nonce&&(i.nonce=sz(e.nonce).toNumber()),void 0!==e.gasLimit&&(i.gasLimit=sz(e.gasLimit)),void 0!==e.gasPrice&&(i.gasPrice=sz(e.gasPrice)),void 0!==e.value&&(i.value=sz(e.value)),void 0!==e.maxFeePerGas&&(i.maxFeePerGas=sz(e.maxFeePerGas)),void 0!==e.maxPriorityFeePerGas&&(i.maxPriorityFeePerGas=sz(e.maxPriorityFeePerGas)),i),o=(0,ek.qC)(a);r=await n.getL1Fee(o)}catch{}return r}async function lK(e,t){delete e.from;let r=ey.O$.from(0),i=ey.O$.from(0);if(r=e.gasLimit?sz(e.gasLimit):await t.estimateGas(e),2==e.type){if(e.maxFeePerGas)i=sz(e.maxFeePerGas);else{let e=await t.getFeeData();e.maxFeePerGas&&(i=e.maxFeePerGas)}}else if(0==e.type||1==e.type){if(e.gasPrice)i=sz(e.gasPrice);else{let e=await t.getFeeData();e.gasPrice&&(i=e.gasPrice)}}else if(e.gasPrice)i=sz(e.gasPrice);else{let e=await t.getFeeData();e.gasPrice&&(i=e.gasPrice)}let n=r.mul(i);if(e.chainId&&lq(e.chainId))try{let r=await lV(e,t);n=n.add(r)}catch{}return n}function lY(e){for(let t of["gasLimit","gasPrice","value","maxPriorityFeePerGas","maxFeePerGas"]){let r=e[t];if(!(typeof r>"u")&&!function(e){let t="number"==typeof e,r="bigint"==typeof e,i="string"==typeof e&&/^-?0x[a-f0-9]+$/i.test(e);return t||r||i}(r))throw Error(`Transaction request property '${t}' must be a valid number, bigint, or hex string representing a quantity`)}if("number"!=typeof e.chainId)throw Error("Transaction request property 'chainId' must be a number")}function lQ(e){return{to:e.to,from:e.from,contractAddress:e.contractAddress,transactionIndex:e.transactionIndex,root:e.root,logsBloom:e.logsBloom,blockHash:e.blockHash,transactionHash:e.transactionHash,logs:e.logs,blockNumber:e.blockNumber,confirmations:e.confirmations,byzantium:e.byzantium,type:e.type,status:e.status,gasUsed:e.gasUsed.toHexString(),cumulativeGasUsed:e.cumulativeGasUsed.toHexString(),effectiveGasPrice:e.effectiveGasPrice?e.effectiveGasPrice.toHexString():void 0}}var lJ=e=>{let{showFiatPrices:t,getUsdTokenPrice:r,chains:i}=r7(),[n,a]=(0,s.useState)(!0),[o,l]=(0,s.useState)(void 0),[c,d]=(0,s.useState)(void 0);return(0,s.useEffect)(()=>{let n=e.chainId||tP,o=i.find(e=>e.id===Number(n));if(!o)throw new eM(`Unsupported chain: ${n}`);(async()=>{if(!t){a(!1);return}try{a(!0);let e=await r(o);e?d(e):l(Error(`Unable to fetch token price on chain id ${o.id}`))}catch(e){l(e)}finally{a(!1)}})()},[e.chainId]),{tokenPrice:c,isTokenPriceLoading:n,tokenPriceError:o}},lX=(0,s.createContext)(null);function l0(){let e=(0,s.useContext)(lX);if(null===e)throw Error("`useWallets` was called outside the PrivyProvider component");return e}var l1=({pendingTransaction:e})=>{let{getAccessToken:t}=ie(),{wallets:r}=l0(),{walletProxy:i,rpcConfig:a,chains:o,nativeTokenSymbolForChainId:l}=r7(),[c,d]=(0,s.useState)(e),{tokenPrice:h}=lJ(c),[u,p]=(0,s.useState)(null),f=l(e.chainId)||"ETH",g=(0,s.useMemo)(()=>r.find(e=>"privy"===e.walletClientType),[r]);return(0,s.useEffect)(()=>{(async function(){if(!await t()||!i||!g)return c;let e=new n.c(t8(c.chainId,o,a));return p(sz((await lK(c,e)).toBigInt()).toHexString()),lB(g.address,c,e)})().then(e=>{d(e)})},[i]),g?(0,m.jsx)(l2,{children:(0,m.jsx)(ls,{from:g.address,to:c.to,txn:c,gas:u??void 0,tokenPrice:h,tokenSymbol:f})}):null},l2=C.ZP.div`
  width: 100%;
  padding: 1rem 0;
`,l3=({open:e,onClose:t})=>{let{user:r}=ie(),[i,n]=(0,s.useState)(null),{init:a,cancel:o}=sS();async function l(e){try{n(e),await a(e)}catch(e){console.error(e)}}(0,s.useEffect)(()=>{e&&r?.mfaMethods&&r.mfaMethods.length>0?l(r.mfaMethods[0]):n(null)},[r?.mfaMethods,e]);let c=()=>{n(null),o(),t()};return e&&r?i?(0,m.jsx)(l4,{selectedMethod:i,onClose:c,onBack:r.mfaMethods.length>1?()=>n(null):void 0}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:c},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(em.Z,{})})}),(0,m.jsx)(a5,{children:"Verify your identity"}),(0,m.jsx)(a6,{children:"Choose a verification method"}),(0,m.jsxs)(or,{children:[r.mfaMethods.includes("totp")&&(0,m.jsxs)(nn,{onClick:()=>l("totp"),children:[(0,m.jsx)(ec.Z,{}),"Authenticator App"]},"totp"),r.mfaMethods.includes("sms")&&(0,m.jsxs)(nn,{onClick:()=>l("sms"),children:[(0,m.jsx)(_.Z,{}),"SMS"]},"sms")]}),(0,m.jsx)(iK,{})]}):null},l4=({selectedMethod:e,onClose:t,onBack:r})=>{let{app:i}=rO(),{pendingTransaction:n}=r7(),[a,o]=(0,s.useState)(!1),[l,c]=(0,s.useState)(!1),{submit:d}=sS();async function h(r){try{if(!r)return;await d(e,r),c(!0),o(!1),t()}catch(e){throw nF(e)&&"mfa_verification_max_attempts_reached"===e.type?(o(!0),Error("You have exceeded the maximum number of attempts. Please close this window and try again in 10 seconds.")):nM(e)?(o(!1),Error("The code you entered is not valid")):nL(e)?(o(!0),Error("You have exceeded the time limit for code entry. Please try again in 30 seconds.")):(o(!1),Error("Unknown error"))}}switch(e){case"sms":return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:t},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(eu.Z,{})})}),(0,m.jsx)(a5,{children:"Enter verification code"}),(0,m.jsxs)(a8,{children:[(0,m.jsx)(sE,{success:l,disabled:a,onChange:h}),(0,m.jsxs)(a6,{children:["To continue, please enter the 6-digit code sent to your ",(0,m.jsx)("strong",{children:"mobile device"})]}),n&&(0,m.jsx)(l1,{pendingTransaction:n})]}),r&&(0,m.jsx)(oc,{theme:i?.appearance.palette.colorScheme,onClick:r,children:"Choose another method"}),(0,m.jsx)(iw,{onClick:t,children:"Not now"}),(0,m.jsx)(iK,{})]});case"totp":return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:t},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(ep.Z,{})})}),(0,m.jsx)(a5,{children:"Enter verification code"}),(0,m.jsxs)(a8,{children:[(0,m.jsx)(sE,{success:l,disabled:a,onChange:h}),(0,m.jsxs)(a6,{children:["To continue, please enter the 6-digit code generated from your"," ",(0,m.jsx)("strong",{children:"authenticator app"})]}),n&&(0,m.jsx)(l1,{pendingTransaction:n})]}),r&&(0,m.jsx)(oc,{theme:i?.appearance.palette.colorScheme,onClick:r,children:"Choose another method"}),(0,m.jsx)(iw,{onClick:t,children:"Not now"}),(0,m.jsx)(iK,{})]});default:return null}},l5={google:{name:"Google",component:sr},discord:{name:"Discord",component:se},github:{name:"Github",component:st},linkedin:{name:"LinkedIn",component:si},twitter:{name:"Twitter",component:sa},tiktok:{name:"Tiktok",component:sn},apple:{name:"Apple",component:o9}},l6=()=>{let e=new URL(window.location.href);e.searchParams.delete("privy_oauth_code"),e.searchParams.delete("privy_oauth_provider"),e.searchParams.delete("privy_oauth_state"),tO.del(tC),window.history.pushState({},"",e)},l8=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 27px;
  margin-right: 27px;
  gap: 24px;
`,l7=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > span {
    position: absolute;
    left: -41px;
    top: -41px;
  }

  > div > svg {
    position: absolute;
    left: -19px;
    top: -19px;
  }
`,l9=(e,t)=>{let r=encodeURIComponent(new URL(window.location.href).href.replace(/\/$/g,"")+`?privy_token=${e}&privy_connector=injected&privy_wallet_client=phantom`);if(!tq()&&l.tq)return`${t?"phantom://":"https://phantom.app/ul/"}browse/${r}?ref=${r}`},ce=(0,C.ZP)(iR)`
  margin: 16px auto;
`,ct=(e,t)=>{if(e.gasUsed&&e.effectiveGasPrice)try{let r=ey.O$.from(e.gasUsed),i=ey.O$.from(e.effectiveGasPrice),n=r.mul(i);if(t){let e=ey.O$.from(t);n=n.add(e)}return n.toString()}catch{return}},cr=({txn:e,receipt:t,transactionInfo:r,onClose:i,tokenPrice:n,tokenSymbol:a,l1GasEstimate:o})=>(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:i}),(0,m.jsx)(iY,{title:"Transaction complete!",description:"You're all set."}),(0,m.jsx)(ls,{tokenPrice:n,from:t.from,to:t.to,gas:ct(t,o),txn:e,transactionInfo:r,tokenSymbol:a}),(0,m.jsx)(ci,{loading:!1,onClick:i,children:"All Done"}),(0,m.jsx)(iK,{})]}),ci=(0,C.ZP)(ip)`
  && {
    margin-top: 24px;
  }
  transition: color 350ms ease, background-color 350ms ease;
`,cn=({txn:e,txnFamily:t,uiOptions:r,tokenSymbol:i,tokenPrice:n})=>{if("CONTRACT_CALL"===t){if(r.transactionInfo?.contractInfo)return(0,m.jsx)(ld,{contractInfo:r.transactionInfo.contractInfo,description:r.description});if(r.senderInfo)return(0,m.jsx)(ld,{contractInfo:r.senderInfo,description:r.description||r.senderInfo.actionText})}return(0,m.jsx)(m.Fragment,{children:(0,m.jsx)(lv,{description:r.description||r.transactionInfo?.description||"",txn:e,tokenSymbol:i,tokenPrice:n})})},ca=C.ZP.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  padding-bottom: 16px;
`,co=C.ZP.div`
  font-size: 13px;
  color: var(--privy-color-error);
  width: 100%;
  margin-top: 16px;
`,cs=C.ZP.div`
  display: flex;
  direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`,cl=(0,C.ZP)(ip)`
  transition: color 350ms ease, background-color 350ms ease;
`,cc=C.ZP.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex-grow: 1;
`,cd=C.ZP.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,ch=e=>{if(!(0,eE.A7)(e))return e;try{return(0,e_.ZN)(e)}catch{return e}},cu=C.ZP.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`,cp=C.ZP.span`
  color: var(--privy-color-foreground);
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.25rem; /* 111.111% */
  text-align: center;
`,cm=C.ZP.span`
  margin-top: 4px;
  color: var(--privy-color-foreground);
  text-align: center;

  font-size: 0.825rem;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.008px;
`,cf=C.ZP.div`
  margin-top: 1.5rem;
  background-color: var(--privy-color-background-2);
  border-radius: var(--privy-border-radius-md);
  padding: 12px;
  text-align: left;
  max-height: 310px;
  overflow: scroll;
  white-space: pre-wrap;
  width: 100%;

  // hide the scrollbars
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`,cg=C.ZP.div`
  line-height: 20px;
  height: 20px;
  font-size: 13px;
  color: ${e=>e.fail?"var(--privy-color-error)":"var(--privy-color-foreground-3)"};
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-top: 16px;
  margin-bottom: 4px;
`,cw=C.ZP.span`
  display: flex;
  align-items: center;
  gap: 8px;
`,cx=(0,C.ZP)(ip)`
  transition: color 350ms ease, background-color 350ms ease;

  ${e=>e.success&&C.iv`
      &&&& {
        background-color: var(--privy-color-success);
        color: #ffffff;
      }
    `}
`,cy=`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
  }

  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  font-feature-settings: normal;

  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji';

  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }

  abbr:where([title]) {
    text-decoration: underline dotted;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji';
    display: inline;
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  b,
  strong {
    font-weight: bolder;
  }

  code,
  kbd,
  samp,
  pre {
    font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 1em;
  }

  small {
    font-size: 80%;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }

  button,
  select {
    text-transform: none;
  }

  button,
  [type='button'],
  [type='reset'],
  [type='submit'] {
    -webkit-appearance: button;
    background-color: transparent;
    background-image: none;
  }

  ::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  :-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  :-moz-ui-invalid {
    box-shadow: none;
  }

  legend {
    padding: 0;
  }

  progress {
    vertical-align: baseline;
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    height: auto;
  }

  [type='search'] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }

  summary {
    display: list-item;
  }

  blockquote,
  dl,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  figure,
  p,
  pre {
    margin: 0;
  }

  fieldset {
    margin: 0;
    padding: 0;
  }

  legend {
    padding: 0;
  }

  ol,
  ul,
  menu {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  textarea {
    resize: vertical;
  }

  input::placeholder,
  textarea::placeholder {
    opacity: 1;
    color: #9ca3af;
  }

  button,
  [role='button'] {
    cursor: pointer;
  }

  :disabled {
    cursor: default;
  }

  img,
  svg,
  video,
  canvas,
  audio,
  iframe,
  embed,
  object {
    display: block;
  }

  img,
  video {
    max-width: 100%;
    height: auto;
  }

  [hidden] {
    display: none;
  }
`,cv=C.vJ`
  :root {
     // Borders 
     --privy-border-radius-sm: 6px;
     --privy-border-radius-md: 12px;
     --privy-border-radius-mdlg: 16px;
     --privy-border-radius-lg: 24px;
     --privy-border-radius-full: 9999px;

     // Colors
     --privy-color-background: ${e=>e.theme.background};
     --privy-color-background-2: ${e=>e.theme.background2};

     --privy-color-foreground: ${e=>e.theme.foreground};
     --privy-color-foreground-2: ${e=>e.theme.foreground2};
     --privy-color-foreground-3: ${e=>e.theme.foreground3};
     --privy-color-foreground-4: ${e=>e.theme.foreground4};
     --privy-color-foreground-accent: ${e=>e.theme.foregroundAccent};

     --privy-color-accent: ${e=>e.theme.accent};
     --privy-color-accent-light: ${e=>e.theme.accentLight};
     --privy-color-accent-dark: ${e=>e.theme.accentDark};

     --privy-color-success: ${e=>e.theme.success};
     --privy-color-success-dark: ${e=>e.theme.successDark};
     --privy-color-error: ${e=>e.theme.error};
     --privy-color-warn: ${e=>e.theme.warn};

     // Space
     --privy-height-modal-full: 620px;
     --privy-height-modal-compact: 480px;
  };
`,cb=C.ZP.div`
  // css normalize only the privy application to avoid conflicts
  // with consuming application
  ${cy}

  // Privy styles
  color: var(--privy-color-foreground-2);

  h3 {
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    color: var(--privy-color-foreground-2);
  }

  h4 {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--privy-color-foreground);
  }

  p {
    font-size: 13px;
    line-height: 20px;
    color: var(--privy-color-foreground-2);
  }

  button:focus,
  input:focus,
  optgroup:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--privy-color-accent-light);
    box-shadow: 0 0 0 1px var(--privy-color-accent-light);
  }

  /* Utilities when you can't add an additional span tag for mobile formatting */

  .hide-on-mobile {
    @media (max-width: 440px) {
      display: none;
    }
  }

  .mobile-only {
    @media (min-width: 441px) {
      display: none;
    }
  }

  /* Animations */

  @keyframes fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`,cC={LANDING:()=>{let{closePrivyModal:e,connectors:t}=r7(),{app:r,onUserCloseViaDialogOrKeybindRef:i}=rO(),{email:n,sms:a,google:o,twitter:l,discord:c,github:d,tiktok:h,linkedin:u,apple:p,wallet:f,farcaster:g}=r?.loginMethods??{},w=r?.appearance.loginGroupPriority||"web2-first",x=r?.appearance.hideDirectWeb2Inputs,[y,v]=(0,s.useState)("default"),[b,C]=(0,s.useState)(n?"email":"sms");(0,s.useEffect)(()=>{C(n?"email":"sms")},[n]);let j=()=>{e({shouldCallAuthOnSuccess:!0}),setTimeout(()=>{v("default")},150)};i.current=j;let k=[n&&(0,m.jsx)(oY,{isEditable:"email"===b,setIsEditable:()=>{C("email")}}),a&&(0,m.jsx)(o7,{isEditable:"sms"===b,setIsEditable:()=>{C("sms")}})].filter(Boolean),E=[o&&(0,m.jsx)(ss,{provider:"google"}),l&&(0,m.jsx)(ss,{provider:"twitter"}),c&&(0,m.jsx)(ss,{provider:"discord"}),d&&(0,m.jsx)(ss,{provider:"github"}),h&&(0,m.jsx)(ss,{provider:"tiktok"}),u&&(0,m.jsx)(ss,{provider:"linkedin"}),p&&(0,m.jsx)(ss,{provider:"apple"}),g&&(0,m.jsx)(oQ,{})].filter(Boolean),_=ng(r?.appearance.walletList??[],t,!1),P=sh({priority:w,email:n,sms:a,social:E}),S=su({priority:w,email:n,sms:a,social:E}),T=sp({priority:w,email:n,sms:a,social:E}),A=(0,m.jsx)(sl,{text:T,onClick:()=>v("web3-overflow")}),N=(0,m.jsx)(sc,{text:P,icon:S,onClick:()=>v("web2-overflow")}),I=x?0:1;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{title:"Log in or Sign Up",onClose:j,backFn:"default"===y?void 0:()=>{v("default")}}),"default"===y&&(0,m.jsx)(sd,{}),(0,m.jsx)(nr,{style:{overflow:"hidden",padding:2},children:(0,m.jsxs)(ni,{children:["default"===y&&"web2-first"===w&&(0,m.jsxs)(m.Fragment,{children:[...k,...E.length+k.length>4?E.slice(0,3-k.length):E,k.length+E.length>4&&N,f&&A]}),"default"===y&&"web3-first"===w&&(0,m.jsxs)(m.Fragment,{children:[f&&(0,m.jsxs)(m.Fragment,{children:[..._.length>4?_.slice(0,3):_,_.length>4&&A]}),k.length+E.length>I&&N,k.length+E.length===I&&k.length?k[0]:null,k.length+E.length===I&&E.length?E[0]:null]}),"web2-overflow"===y&&(0,m.jsxs)(m.Fragment,{children:[..."web3-first"===w?k:[],...E]}),..."web3-overflow"===y?_:[]]})}),r&&(0,m.jsx)(iq,{app:r}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},AWAITING_PASSWORDLESS_CODE:()=>{let{app:e,navigate:t,navigateBack:r,setModalData:i}=rO(),{closePrivyModal:n,resendEmailCode:a,resendSmsCode:o,getAuthMeta:c,loginWithCode:d,updateWallets:h}=r7(),{authenticated:u,user:p}=ie(),[f,g]=(0,s.useState)(i1),[w,x]=(0,s.useState)(!1),[y,v]=(0,s.useState)(null),[b,C]=(0,s.useState)(null),j=c()?.email?0:1,k=e?.render.inDialog?1400:0,P=e?.render.inDialog?k-500:0;(0,s.useEffect)(()=>{if(u&&w&&p){if(t$(p,e?.embeddedWallets?.createOnLogin)){let e=setTimeout(()=>{i({createWallet:{onSuccess:()=>{},onFailure:e=>console.error(e),callAuthOnSuccessOnClose:!0}}),t("EMBEDDED_WALLET_ON_ACCOUNT_CREATE_SCREEN")},P);return()=>clearTimeout(e)}{h();let e=setTimeout(n,k);return()=>clearTimeout(e)}}},[u,w,p]),(0,s.useEffect)(()=>{if(y&&0===b){let e=setTimeout(()=>{g(i1),v(null),document.querySelector("input[name=code-0]")?.focus()},1400);return()=>clearTimeout(e)}},[y]);let S=e=>{e.preventDefault();let t=e.currentTarget.value.replace(" ","");if(""===t)return;if(isNaN(Number(t))){v("Code should be numeric"),C(1);return}v(null),C(null);let r=Number(e.currentTarget.name?.charAt(5)),i=[...t||[""]].slice(0,6-r),n=[...f.slice(0,r),...i,...f.slice(r+i.length)];g(n);let a=Math.min(Math.max(r+i.length,0),5);isNaN(Number(e.currentTarget.value))||document.querySelector(`input[name=code-${a}]`)?.focus(),n.every(e=>e&&!isNaN(+e))&&(document.querySelector(`input[name=code-${a}]`)?.blur(),d(n.join("")).then(()=>x(!0)).catch(e=>{e?.status===422?v("Invalid or expired verification code"):e instanceof eF&&"cannot_link_more_of_type"===e.privyErrorCode?v(e.message):v("Issue verifying code"),C(0)}))},T=e=>{1===b&&(v(null),C(null)),g([...f.slice(0,e),"",...f.slice(e+1)]),e>0&&document.querySelector(`input[name=code-${e-1}]`)?.focus()},A=0==j?(0,m.jsx)(E.Z,{color:"var(--privy-color-accent)",strokeWidth:2,height:"48px",width:"48px"}):(0,m.jsx)(_.Z,{color:"var(--privy-color-accent)",strokeWidth:2,height:"40px",width:"40px"}),N=0==j?(0,m.jsxs)("p",{children:["Please check ",(0,m.jsx)(i6,{children:c()?.email})," for an email from privy.io and enter your code below."]}):(0,m.jsxs)("p",{children:["Please check ",(0,m.jsx)(i6,{children:c()?.phoneNumber})," for a message from ",e?.name||"Privy"," and enter your code below."]});return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:()=>r()},"header"),(0,m.jsxs)(i2,{children:[(0,m.jsx)(iJ,{title:"Enter confirmation code",description:N,icon:A}),(0,m.jsxs)(iL,{children:[(0,m.jsxs)(i3,{children:[(0,m.jsx)(i4,{fail:!!y,success:w,children:(0,m.jsx)("span",{children:y||(w?"Success!":"")})}),(0,m.jsx)("div",{children:f.map((e,t)=>(0,m.jsx)("input",{name:`code-${t}`,type:"text",value:f[t],onChange:S,onKeyUp:e=>{"Backspace"===e.key&&T(t)},inputMode:"numeric",autoFocus:0===t,pattern:"[0-9]",className:`${w?"success":""} ${y?"fail":""}`,autoComplete:l.tq?"one-time-code":"off"},t))})]}),(0,m.jsx)(i5,{children:0==j?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("span",{children:"Didn't get an email?"}),(0,m.jsx)("button",{onClick:a,children:"Resend Code"})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("span",{children:"Didn't get a message?"}),(0,m.jsx)("button",{onClick:o,children:"Resend Code"})]})})]})]}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},AWAITING_CONNECTION:()=>{let[e,t]=(0,s.useState)(!1),[r,i]=(0,s.useState)(!1),[n,a]=(0,s.useState)(void 0),{authenticated:o}=ie(),{app:c,navigate:d,navigateBack:h,lastScreen:u,currentScreen:p,setModalData:f}=rO(),{getAuthFlow:g,walletConnectionStatus:w,closePrivyModal:x,initLoginWithWallet:y,loginWithWallet:v,updateWallets:b}=r7(),{walletConnectors:C}=ie(),[j,k]=(0,s.useState)(0),{user:E}=ie(),[_]=(0,s.useState)(E?.linkedAccounts.length||0),[P,T]=(0,s.useState)(""),[A,N]=(0,s.useState)(!1),{hasTabbedAway:I}=function(){let[e,t]=(0,s.useState)(!1),r=(0,s.useCallback)(()=>{document.hidden&&t(!0)},[]);return(0,s.useEffect)(()=>(document.addEventListener("visibilitychange",r),()=>document.removeEventListener("visibilitychange",r)),[r]),{hasTabbedAway:e,reset:()=>t(!1)}}(),{enabled:O,token:F}=r5(),R=l.tq&&w?.connector?.connectorType==="wallet_connect_v2"||l.tq&&w?.connector?.connectorType==="coinbase_wallet"||l.tq&&w?.connector?.connectorType==="injected"&&w?.connector?.walletClientType==="phantom",L=w?.status==="connected",M=w?.status==="switching_to_supported_chain";(0,s.useEffect)(()=>{let e=g();if(L&&!e&&(!O||F||o?y(w.connectedWallet,F).then(()=>{N(!0)}):(f({captchaModalData:{callback:e=>y(w.connectedWallet,e).then(()=>{N(!0)}),userIntentRequired:!1,onSuccessNavigateTo:"AWAITING_CONNECTION",onErrorNavigateTo:"ERROR_SCREEN"}}),d("CAPTCHA_SCREEN",!1))),e&&R&&L&&!e.preparedMessage){e.buildSiweMessage();return}!e||R||!L||r||(async()=>{i(!0),a(void 0);try{w?.connector?.connectorType==="wallet_connect_v2"&&w?.connector?.walletClientType==="metamask"&&await tJ(2500),await U()}catch(e){console.warn("Auto-prompted signature failed",e)}finally{i(!1)}})()},[j,L,A]),(0,s.useEffect)(()=>{if(E&&e){let e;if(t$(E,c?.embeddedWallets?.createOnLogin)){let t=c?.render.inDialog?1400:0;e=setTimeout(()=>{f({createWallet:{onSuccess:()=>{},onFailure:e=>console.error(e),callAuthOnSuccessOnClose:!0}}),d("EMBEDDED_WALLET_ON_ACCOUNT_CREATE_SCREEN")},c?.render.inDialog?t-500:0)}else b(),e=setTimeout(x,1400);return()=>clearTimeout(e)}},[E,e]);let W=e=>{if(e?.privyErrorCode==="allowlist_rejected"){d("ALLOWLIST_REJECTION_SCREEN");return}a(nb(e))};async function U(){try{if(await v(),!c?.render.inDialog)return x();t(!0)}catch(e){W(e)}finally{i(!1)}}(0,s.useEffect)(()=>{w?.connectError&&W(w?.connectError)},[w]),(0,S.Z)(()=>{let e="wallet_connect_v2"===D&&w?.connector instanceof r$?w.connector.redirectUri:void 0;e&&T(e)},w?.connector instanceof r$&&!P?500:null);let D=w?.connector?.connectorType||"injected",Z=w?.connector?.walletClientType||"unknown",z=no[Z]?.displayName||w?.connector?.walletBranding.name||"Browser Extension",$=no[Z]?.logo||w?.connector?.walletBranding.icon||(e=>(0,m.jsx)(rv,{...e})),B="Browser Extension"===z?z.toLowerCase():z,H;H=e?`Successfully connected with ${B}`:n?n.message:M?"Switching networks":L?r&&R?"Signing":"Sign to verify":`Waiting for ${B}`;let G="Don’t see your wallet? Check your other browser windows.";e?G=_===(E?.linkedAccounts.length||0)?"Wallet was already linked.":"You’re good to go!":j>=2&&n?G="Unable to connect wallet":n?G=n.detail:M?G="Switch your wallet to the requested network.":L&&R?G="Sign the message in your wallet to verify it belongs to you.":"metamask"===Z&&l.tq?G="Click continue to open and connect Metamask.":"metamask"===Z?G="For the best experience, connect only one wallet at a time.":"wallet_connect"===D?G="Open your mobile wallet app to continue":"coinbase_wallet"===D&&(tV()||(G=rB(E)?"Continue with the Coinbase app. Not the right wallet? Reset your connection below.":"Open the Coinbase app on your phone to continue."));let q=C?.walletConnectors?.find(e=>"coinbase_wallet"===e.walletClientType),V="coinbase_wallet"===Z&&(rB(E)||n===rl.ERROR_USER_EXISTS);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:u&&p!==u?h:void 0}),(0,m.jsxs)(nj,{children:[(0,m.jsx)(nE,{walletLogo:$,success:e,fail:!!n}),(0,m.jsxs)(iD,{children:[(0,m.jsx)("h3",{children:H}),(0,m.jsx)("p",{children:G}),L||!P||I?null:(0,m.jsxs)("p",{children:["Still here?"," ",(0,m.jsx)("a",{href:P,target:"_blank",style:{textDecoration:"underline"},children:"Try again"})]})]}),V?(0,m.jsx)(ip,{onClick:()=>q&&q?.disconnect(),disabled:e,children:"Use a different wallet"}):n==rl.ERROR_USER_EXISTS&&p!==u?(0,m.jsx)(ip,{onClick:h,children:"Use a different wallet"}):L&&!e&&R?(0,m.jsx)(ip,{onClick:()=>{i(!0),U(),nC(Z)},disabled:r,children:r?"Signing":"Sign with your wallet"}):!e&&n?.retryable&&j<2?(0,m.jsx)(ip,{onClick:()=>{k(j+1),a(void 0),L?(i(!0),U()):w?.connectRetry()},disabled:!e&&(!n?.retryable||j>=2),children:"Retry"}):e||n?null:(0,m.jsx)(ip,{onClick:()=>{},disabled:!0,children:"Connecting"})]}),(0,m.jsx)(iK,{})]})},AWAITING_CONNECT_ONLY_CONNECTION:()=>{let{navigateBack:e,lastScreen:t,currentScreen:r}=rO(),{walletConnectionStatus:i,closePrivyModal:n}=r7(),[a,o]=(0,s.useState)(void 0),[c,d]=(0,s.useState)(0),h=i?.status==="connected",u=i?.status==="switching_to_supported_chain";(0,s.useEffect)(()=>{if(h){let e=setTimeout(n,1400);return()=>clearTimeout(e)}},[h]);let p=e=>{o(nb(e))};(0,s.useEffect)(()=>{i?.connectError&&p(i?.connectError)},[i]);let f=i?.connector?.connectorType||"injected",g=i?.connector?.walletClientType||"unknown",w=no[g]?.displayName||i?.connector?.walletBranding.name||"Browser Extension",x=no[g]?.logo||i?.connector?.walletBranding.icon||(e=>(0,m.jsx)(rv,{...e})),y="Browser Extension"===w?w.toLowerCase():w,v;v=h?`Successfully connected with ${y}`:a?a.message:u?"Switching networks":`Waiting for ${y}`;let b="Don’t see your wallet? Check your other browser windows.";return h?b="You’re good to go!":c>=2&&a?b="Unable to connect wallet":a?b=a.detail:u?b="Switch your wallet to the requested network.":"metamask"===g&&l.tq?b="Click to continue to open and connect Metamask.":"metamask"===g?b="For the best experience, connect only one wallet at a time.":"wallet_connect_v2"===f?b="Open your mobile wallet app to continue":"coinbase_wallet"===f&&(b="Open the Coinbase app on your phone to continue."),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:r===t?void 0:e}),(0,m.jsxs)(n_,{children:[(0,m.jsx)(nE,{walletLogo:x,success:h,fail:!!a}),(0,m.jsxs)(iD,{children:[(0,m.jsx)("h3",{children:v}),(0,m.jsx)("p",{children:b})]}),a==rl.ERROR_USER_EXISTS?(0,m.jsx)(ip,{onClick:e,children:"Use a different wallet"}):!h&&a?.retryable&&c<2?(0,m.jsx)(ip,{onClick:()=>{d(c+1),o(void 0),i?.connectRetry()},disabled:!h&&(!a?.retryable||c>=2),children:"Retry"}):!h&&a&&c>=2?(0,m.jsx)(ip,{onClick:e,children:"Use a different wallet"}):null]}),(0,m.jsx)(iK,{})]})},AWAITING_FARCASTER_CONNECTION:()=>{let{lastScreen:e,navigate:t,navigateBack:r,setModalData:i}=rO(),{getAuthFlow:n,loginWithFarcaster:a,closePrivyModal:o}=r7(),[c,d]=(0,s.useState)(!1),[h,u]=(0,s.useState)(!1),p=(0,s.useRef)([]),f=n(),g=f?.meta.connectUri;return(0,s.useEffect)(()=>{let r=Date.now(),n=setInterval(async()=>{let o=await f.pollForReady.execute(),s=Date.now()-r;if(o){clearInterval(n),d(!0);try{await a(),u(!0)}catch(e){i({errorModalData:{error:e,previousScreen:"LANDING"}}),t("ERROR_SCREEN",!1)}}else s>12e4&&(clearInterval(n),i({errorModalData:{error:new eR("Timed out waiting for response from Farcaster app.",void 0,"client_request_timeout"),previousScreen:e||"LANDING"}}),t("ERROR_SCREEN"))},2e3);return()=>{clearInterval(n),p.current.forEach(e=>clearTimeout(e))}},[]),(0,s.useEffect)(()=>{h&&p.current.push(setTimeout(o,1e3))},[h]),l.tq||c?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:e?r:void 0,onClose:o},"header"),(0,m.jsx)(iz,{}),(0,m.jsxs)(ou,{children:[(0,m.jsx)(op,{children:(0,m.jsxs)("div",{children:[(0,m.jsx)(is,{success:h,fail:!1}),(0,m.jsx)(aL,{style:{width:"38px",height:"38px"}})]})}),(0,m.jsxs)(iD,{children:[(0,m.jsx)(a5,{children:"Signing in with Farcaster"}),(0,m.jsx)(a6,{children:"This should only take a moment."}),(0,m.jsx)(iR,{children:g&&(l.tq?(0,m.jsx)(aH,{text:"Taking a while? Open in Farcaster app.",url:g,color:oh}):(0,m.jsx)(a$,{text:g,itemName:"link",color:oh}))})]})]}),(0,m.jsx)(iK,{})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:e?r:void 0,onClose:o},"header"),(0,m.jsx)(iz,{}),(0,m.jsx)(ou,{children:(0,m.jsxs)("div",{children:[(0,m.jsx)(a5,{children:"Sign in with Farcaster"}),(0,m.jsx)(a6,{children:"Scan with your phone's camera to continue."}),(0,m.jsx)(iM,{children:g?(0,m.jsx)(a3,{url:g,size:275,squareLogoElement:aL}):(0,m.jsx)(il,{})}),(0,m.jsxs)(iR,{children:[(0,m.jsx)(a6,{children:"Or copy this link and paste it into a phone browser to open the Warpcast app."}),g&&(0,m.jsx)(a$,{text:g,itemName:"link",color:oh})]})]})}),(0,m.jsx)(iK,{})]})},PHANTOM_INTERSTITIAL_SCREEN:()=>{let{forkSession:e,ready:t,authenticated:r}=ie(),[i,n]=(0,s.useState)(""),[a,o]=(0,s.useState)(!1);(0,s.useEffect)(()=>{t&&r&&e().then(n)},[t,r]);let l=l9(i,!a),c={title:"Redirecting to Phantom Mobile Wallet",description:"We'll take you to the Phantom Mobile Wallet app to continue your login experience.",footnote:""};return t&&(c.description="For the best experience, we'll automatically log you into the Phantom Mobile Wallet in-app browser.",c.footnote="Once you're done, you can always return here and refresh to view your updated account."),a&&(c.title="Still here?",c.description="You may need to install the Phantom mobile app.",c.footnote="Once you're done, you can return here or connect via Phantom's in-app browser."),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{},"header"),(0,m.jsx)(iz,{}),(0,m.jsx)(iQ,{title:c.title,description:c.description}),(0,m.jsxs)(iF,{children:[(0,m.jsx)(ce,{children:(0,m.jsx)(rC,{style:{width:"72px",height:"72px"}})}),(0,m.jsx)(im,{href:l,onClick:()=>{setTimeout(()=>o(!0),1e3)},loading:t&&!l,children:a?"Go to App Store":"Continue"}),c.footnote?(0,m.jsx)("p",{children:c.footnote}):null]}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},LOGIN_FAILED_SCREEN:()=>{let{closePrivyModal:e}=r7(),{navigate:t}=rO();return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{},"header"),(0,m.jsx)(iz,{}),(0,m.jsx)(sm,{style:{width:"160px",height:"160px",margin:"0 auto 20px"}}),(0,m.jsx)(iQ,{title:"Could not connect with wallet",description:"Please check that Phantom multichain is enabled and try again.",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}),(0,m.jsxs)(iF,{children:[(0,m.jsx)(ip,{onClick:()=>t("LANDING"),children:"Try again"}),(0,m.jsx)(iw,{onClick:()=>e(),children:"Cancel"})]}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},AWAITING_OAUTH_SCREEN:()=>{let{ready:e,user:t,authenticated:r}=ie(),{app:i,setModalData:n,navigate:a,resetNavigation:o}=rO(),{getAuthMeta:l,initLoginWithOAuth:c,loginWithOAuth:d,updateWallets:h,setReadyToTrue:u,closePrivyModal:p}=r7(),[f,g]=(0,s.useState)(!1),[w,x]=(0,s.useState)(void 0),y=l()?.provider||"google",v=l5[y].name,b=l5[y].component,C=i?.render.inDialog?1400:0;(0,s.useEffect)(()=>{d(y).then(()=>{l6(),g(!0)}).catch(e=>{let t={retryable:!1,message:"Authentication failed"};if(e?.privyErrorCode==="allowlist_rejected"){x(void 0),o(),a("ALLOWLIST_REJECTION_SCREEN"),l6();return}e?.privyErrorCode==="linked_to_another_user"?t.detail="This account has already been linked to another user.":e?.privyErrorCode==="invalid_credentials"?(t.retryable=!0,t.detail="Something went wrong. Try again."):"oauth_user_denied"===e.privyErrorCode?(t.detail=`Retry and check ${y.charAt(0).toUpperCase()+y.slice(1)} to finish connecting your account.`,t.retryable=!0):e?.privyErrorCode==="too_many_requests"&&(t.detail="Too many requests. Please wait before trying again."),l6(),x(t)}).finally(()=>{u()})},[]),(0,s.useEffect)(()=>{if(e&&r&&f&&t){if(t$(t,i?.embeddedWallets?.createOnLogin)){let e=setTimeout(()=>{n({createWallet:{onSuccess:()=>{},onFailure:e=>console.error(e),callAuthOnSuccessOnClose:!0}}),a("EMBEDDED_WALLET_ON_ACCOUNT_CREATE_SCREEN")},C);return()=>clearTimeout(e)}{let e=setTimeout(p,C);return h(),()=>clearTimeout(e)}}},[e,r,f,t]);let j=f?`Successfully connected with ${v}`:w?w.message:`Verifying connection to ${v}`,k="";return k=f?"You’re good to go!":w?w.detail:"Just a few moments more",(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{}),(0,m.jsx)(iz,{}),(0,m.jsxs)(l8,{children:[(0,m.jsx)(l7,{children:(0,m.jsxs)("div",{children:[(0,m.jsx)(is,{success:f,fail:!!w}),(0,m.jsx)(b,{style:{width:"38px",height:"38px"}})]})}),(0,m.jsxs)(iD,{children:[(0,m.jsx)("h3",{children:j}),(0,m.jsx)("p",{children:k})]}),w&&w?.retryable?(0,m.jsx)(iy,{onClick:()=>{l6(),c(y),x(void 0)},disabled:!f&&!w?.retryable,children:"Retry"}):null]}),(0,m.jsx)(iK,{})]})},ALLOWLIST_REJECTION_SCREEN:()=>{let{navigate:e,app:t}=rO(),r=t?.allowlistConfig.errorTitle||"You don't have access to this app",i=t?.allowlistConfig.errorDetail||"Have you been invited?",n=t?.allowlistConfig.errorCtaText||"Try another account";return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{}),(0,m.jsxs)(iN,{children:[(0,m.jsx)(iO,{children:(0,m.jsxs)("div",{children:[(0,m.jsx)(iC,{}),(0,m.jsx)(iA,{style:{width:"38px",height:"38px",strokeWidth:"1",stroke:"var(--privy-color-accent)",fill:"var(--privy-color-accent)"}})]})}),(0,m.jsxs)(iI,{children:["string"==typeof r?(0,m.jsx)("h3",{children:r}):(0,m.jsx)(m.Fragment,{children:r}),"string"==typeof i?(0,m.jsx)("p",{children:i}):(0,m.jsx)(m.Fragment,{children:i})]}),t?.allowlistConfig.errorCtaLink?(0,m.jsx)(ip,{as:"a",href:t.allowlistConfig.errorCtaLink,children:n}):(0,m.jsx)(ip,{onClick:()=>{e("LANDING")},children:n})]})]})},INSTALL_PHANTOM_SCREEN:()=>{let{navigateBack:e}=rO();return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:e},"header"),(0,m.jsx)(iz,{}),(0,m.jsx)(oB,{}),(0,m.jsx)(i$,{}),(0,m.jsxs)(iK,{children:[(0,m.jsx)("span",{children:"Still not sure? "}),(0,m.jsx)("a",{target:"_blank",href:"https://ethereum.org/en/wallets/",children:"Learn more"})]})]})},LINK_EMAIL_SCREEN:()=>{let{app:e}=rO();return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{},"header"),(0,m.jsx)(iz,{}),(0,m.jsx)(iJ,{title:"Connect your email",description:`Add your email to your ${e?.name} account`,icon:(0,m.jsx)(E.Z,{color:"var(--privy-color-accent)",strokeWidth:2,height:"48px",width:"48px"})}),(0,m.jsx)(iF,{children:(0,m.jsx)(oq,{stacked:!0})}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},LINK_PHONE_SCREEN:()=>{let{app:e,currentScreen:t,data:r,navigate:i,setModalData:n}=rO(),{initLoginWithSms:a}=r7();async function o({qualifiedPhoneNumber:e}){try{await a(e),i("AWAITING_PASSWORDLESS_CODE")}catch(e){n({errorModalData:{error:e,previousScreen:r?.errorModalData?.previousScreen||t||"LINK_PHONE_SCREEN"}}),i("ERROR_SCREEN")}}return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{},"header"),(0,m.jsx)(iz,{}),(0,m.jsx)(iJ,{title:"Connect your phone",description:`Add your number to your ${e?.name} account`,icon:(0,m.jsx)(_.Z,{color:"var(--privy-color-accent)",strokeWidth:2,height:"40px",width:"40px"})}),(0,m.jsx)(iF,{children:(0,m.jsx)(o5,{stacked:!0,onSubmit:o})}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},LINK_WALLET_SCREEN:()=>{let{linkingHint:e}=r7(),{app:t}=rO(),r=e?`Select the wallet with ${tQ(e)} and follow the instructions to reconnect your wallet${t?.name?` to ${t.name}.`:"."}`:`Link a wallet to your ${t?.name} account`;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{},"header"),(0,m.jsx)(iQ,{title:`${e?"Reconnect":"Connect"} your wallet`,description:r}),(0,m.jsx)(ni,{children:(0,m.jsx)(nf,{connectOnly:!1})}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},CONNECT_ONLY_LANDING_SCREEN:()=>{let{app:e}=rO();return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{},"header"),(0,m.jsx)(nv,{}),(0,m.jsx)(ni,{children:(0,m.jsx)(nf,{connectOnly:!0})}),e&&(0,m.jsx)(iq,{app:e}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},CONNECT_ONLY_AUTHENTICATED_SCREEN:()=>{let{app:e}=rO(),t=`Connect a wallet to ${e?.name}`;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{},"header"),(0,m.jsx)(iQ,{title:"Connect your wallet",description:t}),(0,m.jsx)(ni,{children:(0,m.jsx)(nf,{connectOnly:!0})}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},EMBEDDED_WALLET_ON_ACCOUNT_CREATE_SCREEN:()=>{let{app:e,navigate:t,data:r,onUserCloseViaDialogOrKeybindRef:i}=rO(),[n,a]=(0,s.useState)(""),[o,l]=(0,s.useState)(!1),[c,d]=(0,s.useState)(),[h,u]=(0,s.useState)(null),[p,f]=(0,s.useState)(null),g=(0,s.useRef)(!1),{authenticated:w,getAccessToken:x}=ie(),{refreshUser:y,closePrivyModal:v,createAnalyticsEvent:b,isNewUserThisSession:C,initializeWalletProxy:j}=r7(),{onSuccess:k,onFailure:E,callAuthOnSuccessOnClose:_}=r.createWallet,P=e?.embeddedWallets.requireUserPasswordOnCreate===!0,S=!!(!n||g.current)&&!P,T=new th(async()=>N());(0,s.useEffect)(()=>{h||j(3e4).then(e=>u(e))},[h]),(0,s.useEffect)(()=>{if(!w){t("LANDING"),E(Error("User must be authenticated before creating a Privy wallet"));return}P||o||g.current||(l(!0),T.execute().finally(()=>l(!1)))},[P,w]);let A=()=>{P&&p&&p?.recoveryMethod!=="user-passcode"?E(new eZ("User created a wallet but failed to set a password for it")):p?k(p):E(new eZ("User wallet creation failed")),v({shouldCallAuthOnSuccess:_})};i.current=()=>null;let N=async function(){let e=await x();if(e)try{if(b("embedded_wallet_creation_started"),!await (await j(3e4))?.create({accessToken:e,recoveryPassword:c}))throw b("embedded_wallet_creation_failed",{error:"walletProxy did not send a response."}),Error("Unable to create wallet");let r=await y(),i=tZ(r);if(!i)throw b("embedded_wallet_creation_failed",{error:"Updated user is missing embedded wallet."}),Error("Unable to create wallet");f(i),b("embedded_wallet_creation_completed",{walletAddress:i.address}),a(""),g.current=!0,P?t("EMBEDDED_WALLET_CREATED_SCREEN"):C?t("EMBEDDED_WALLET_CREATED_SCREEN"):i&&(k(i),v({shouldCallAuthOnSuccess:_}))}catch(e){if(g.current)return;a("An error has occurred, please try again."),console.warn(e)}else a("An error has occured, please login again."),b("embedded_wallet_creation_failed",{error:"Missing access token for user."})},I=async()=>P?(l(!0),T.execute().then(()=>new Promise(e=>setTimeout(e,250))).finally(()=>l(!1))):v({shouldCallAuthOnSuccess:_});return!P&&n?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{closeable:!1}),(0,m.jsxs)(iW,{children:[(0,m.jsx)(O.Z,{fill:"var(--privy-color-error)",width:"64px",height:"64px"}),(0,m.jsx)(iJ,{title:"Something went wrong",description:n})]}),(0,m.jsx)(ip,{onClick:A,children:"Close"}),(0,m.jsx)(aN,{})]}):S?(0,m.jsx)(nP,{}):(0,m.jsx)(aA,{config:{initiatedBy:"automatic"},appName:e?.name||"privy",loading:S||!h,buttonLoading:o,buttonHideAnimations:!p&&o,error:n,password:c||"",onClose:A,onPasswordChange:d,onPasswordGenerate:()=>d(ab()),onSubmit:I})},EMBEDDED_WALLET_CREATED_SCREEN:()=>{let{user:e}=ie(),{closePrivyModal:t,isNewUserThisSession:r,updateWallets:i}=r7(),{app:n,data:a,onUserCloseViaDialogOrKeybindRef:o}=rO(),{onSuccess:l,onFailure:c,callAuthOnSuccessOnClose:d}=a.createWallet,h=()=>{let r=tZ(e);r?(i(),l(r)):c(Error("Failed to create wallet")),t({shouldCallAuthOnSuccess:d})};return(0,s.useEffect)(()=>{let e=setTimeout(h,2500);return()=>clearTimeout(e)},[]),o.current=h,(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:h}),(0,m.jsx)(iz,{}),(0,m.jsxs)(iW,{children:[(0,m.jsx)(A.Z,{fill:"var(--privy-color-accent)",width:"64px",height:"64px"}),(0,m.jsx)(iJ,{title:r?`Welcome${n?.name?` to ${n?.name}`:""}`:"All set!",description:r?"You’ve successfully created an account.":"Your account is secured."})]}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},EMBEDDED_WALLET_CONNECTING_SCREEN:()=>{let{authenticated:e,user:t,getAccessToken:r}=ie(),{closePrivyModal:i,createAnalyticsEvent:n,walletProxy:a}=r7(),{navigate:o,data:l,setModalData:c,onUserCloseViaDialogOrKeybindRef:d}=rO(),h=(0,s.useMemo)(()=>Date.now(),[]),[u,p]=(0,s.useState)(!1),{onCompleteNavigateTo:f,onFailure:g}=l?.connectWallet,w=e=>{u||(p(!0),g("string"==typeof e?Error(e):e))};(0,s.useEffect)(()=>{let s=tZ(t),d;return e&&s?a?((async()=>{let e=await r();if(!e)return w("User must be authenticated and have a Privy wallet before it can be connected");try{await a.connect({accessToken:e,address:s.address});let t=(Date.now()-h)/1e3;"EMBEDDED_WALLET_KEY_EXPORT_SCREEN"===f&&t<1?d=setTimeout(()=>{o(f)},(1-t)*1e3):o(f)}catch(e){if(nR(e)&&"privy"===s.recoveryMethod){let e=await r();if(!e)return w("User must be authenticated and have a Privy wallet before it can be recovered");try{n("embedded_wallet_pinless_recovery_started",{walletAddress:s.address}),(await a?.recover({address:s.address,accessToken:e}))?.address||w(Error("Unable to recover wallet")),f?o(f):i({shouldCallAuthOnSuccess:!1}),n("embedded_wallet_recovery_completed",{walletAddress:s.address}),o(f)}catch{w("An error has occurred, please try again.")}}else nR(e)?(c({...l,recoverWallet:{privyWallet:s,onCompleteNavigateTo:f,onFailure:g}}),o("EMBEDDED_WALLET_RECOVERY_SCREEN")):w(e)}})(),()=>clearTimeout(d)):void 0:w("User must be authenticated and have a Privy wallet before it can be connected")},[e,t,a]);let x=()=>{w("User exited before wallet could be connected"),i({shouldCallAuthOnSuccess:!1})};return d.current=x,(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:x}),u?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(iW,{children:[(0,m.jsx)(T.Z,{fill:"var(--privy-color-error)",width:"64px",height:"64px"}),(0,m.jsx)(iJ,{title:"Something went wrong",description:"We’re on it. Please try again later."})]}),(0,m.jsx)(ip,{onClick:()=>i({shouldCallAuthOnSuccess:!1}),children:"Close"})]}):(0,m.jsx)(nP,{}),(0,m.jsx)(nD,{})]})},EMBEDDED_WALLET_RECOVERY_SCREEN:()=>{let[e,t]=(0,s.useState)(!0),{authenticated:r,getAccessToken:i}=ie(),{walletProxy:n,closePrivyModal:a,createAnalyticsEvent:o}=r7(),{navigate:l,data:c,onUserCloseViaDialogOrKeybindRef:d}=rO(),[h,u]=(0,s.useState)(void 0),[p,f]=(0,s.useState)(""),[g,w]=(0,s.useState)(!1),{privyWallet:x,onCompleteNavigateTo:y,onSuccess:v,onFailure:b}=c.recoverWallet,C=(e="User exited before their wallet could be recovered")=>{a({shouldCallAuthOnSuccess:!1}),b("string"==typeof e?new eZ(e):e)};d.current=C,(0,s.useEffect)(()=>{if(!r||!x)return C("User must be authenticated and have a Privy wallet before it can be recovered")},[r]);let j=e=>{e&&u(e)};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:C}),(0,m.jsx)(iz,{}),(0,m.jsxs)(aO,{children:[(0,m.jsxs)(aI,{children:[(0,m.jsx)(K.Z,{height:48,width:48,stroke:"var(--privy-color-accent)"}),(0,m.jsx)("h3",{style:{color:"var(--privy-color-foreground)"},children:"Load your account"}),(0,m.jsx)("p",{style:{color:"var(--privy-color-foreground-2)"},children:"Please provision your account on this new device. To continue, enter your recovery password."})]}),(0,m.jsxs)("div",{children:[(0,m.jsxs)(n4,{children:[(0,m.jsx)(n2,{type:e?"password":"text",onChange:e=>j(e.target.value),disabled:g}),(0,m.jsx)(n9,{style:{right:"0.75rem"},children:e?(0,m.jsx)(at,{onClick:()=>t(!1)}):(0,m.jsx)(ar,{onClick:()=>t(!0)})})]}),!!p&&(0,m.jsx)(aF,{children:p})]}),(0,m.jsxs)("div",{children:[(0,m.jsxs)(iZ,{children:[(0,m.jsx)("h4",{children:"Why is this necessary?"}),(0,m.jsx)("p",{children:"You previously set a password for this wallet. This helps ensure only you can access it"})]}),(0,m.jsx)(aR,{loading:g||!n,disabled:!h,onClick:async()=>{w(!0);let e=await i();if(!e||!x||null===h)return C("User must be authenticated and have a Privy wallet before it can be recovered");try{o("embedded_wallet_recovery_started",{walletAddress:x.address}),await n?.recover({address:x.address,accessToken:e,recoveryPin:h}),f(""),y?l(y):a({shouldCallAuthOnSuccess:!1}),v?.(x),o("embedded_wallet_recovery_completed",{walletAddress:x.address})}catch(e){nF(e)&&("invalid_recovery_pin"===e.type||"invalid_request_arguments"===e.type)?f("Invalid recovery password, please try again."):f("An error has occurred, please try again.")}finally{w(!1)}},warn:!1,hideAnimations:!x&&g,children:"Recover your account"})]})]}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},EMBEDDED_WALLET_KEY_EXPORT_SCREEN:()=>{let[e,t]=(0,s.useState)(null),{authenticated:r,user:i,getAccessToken:n}=ie(),{closePrivyModal:a,createAnalyticsEvent:o,clientAnalyticsId:l}=r7(),{data:c,onUserCloseViaDialogOrKeybindRef:d}=rO(),h=tZ(i)?.address,{onFailure:u,onSuccess:p,origin:f,appId:g}=c.keyExport,w=e=>{a({shouldCallAuthOnSuccess:!1}),u("string"==typeof e?Error(e):e)},x=()=>{a({shouldCallAuthOnSuccess:!1}),p(),o("embedded_wallet_key_export_completed",{walletAddress:h})};return(0,s.useEffect)(()=>{let e=tZ(i);if(!r||!e)return w("User must be authenticated before exporting their wallet");n().then(t,w)},[r,i]),d.current=x,(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:x}),(0,m.jsxs)(n$,{children:[(0,m.jsxs)(iJ,{icon:(0,m.jsx)(I.Z,{color:"var(--privy-color-accent)",strokeWidth:2,height:"40px",width:"40px"}),title:"Transfer Wallet",children:[(0,m.jsxs)(nK,{children:[(0,m.jsx)(nz,{style:{marginRight:6}}),tQ(h)]}),(0,m.jsx)("p",{children:"You can bring your account with you to another site using an external wallet."})]}),(0,m.jsxs)(nB,{children:[(0,m.jsxs)(nH,{children:[(0,m.jsx)(nG,{children:"1"}),(0,m.jsxs)("span",{children:[(0,m.jsx)("a",{href:"https://privy-io.notion.site/Transferring-your-account-9dab9e16c6034a7ab1ff7fa479b02828",target:"blank",rel:"noopener noreferrer",children:"Follow the guide"})," ","to transfer your account to your wallet of choice."]})]}),(0,m.jsxs)(nH,{children:[(0,m.jsx)(nG,{children:"2"}),(0,m.jsx)("span",{children:"Copy this key into your other wallet"})]})]}),(0,m.jsx)("div",{style:{width:"100%"},children:e&&(0,m.jsx)(nZ,{origin:f,appId:g,accessToken:e,clientAnalyticsId:l,address:h,dimensions:{height:"44px"}})}),(0,m.jsxs)(nY,{children:[(0,m.jsxs)("div",{children:[(0,m.jsx)(N.Z,{viewBox:"0 0 20 18"}),(0,m.jsx)("h4",{children:"Warning"})]}),(0,m.jsx)("p",{children:"Never share your private key with anyone! It controls your account."})]})]}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},EMBEDDED_WALLET_SIGN_REQUEST_SCREEN:()=>{let{authenticated:e}=ie(),{initializeWalletProxy:t,closePrivyModal:r}=r7(),{navigate:i,data:n,onUserCloseViaDialogOrKeybindRef:a}=rO(),[o,l]=(0,s.useState)(!0),[c,d]=(0,s.useState)(""),[h,u]=(0,s.useState)(),[p,f]=(0,s.useState)(null),g=null!==p;(0,s.useEffect)(()=>{e||i("LANDING")},[e]),(0,s.useEffect)(()=>{t(3e4).then(e=>{l(!1),e||(d("An error has occurred, please try again."),u(new ro(new ra(c,rs.E32603_DEFAULT_INTERNAL_ERROR.eipCode))))})},[]);let{message:w,confirmAndSignMessage:x,onSuccess:y,onFailure:v,uiOptions:b}=n.signMessage,C={title:b.title||"Sign message",description:b.description||"Signing this message will not cost you any fees.",buttonText:b.buttonText||"Sign and continue"},j=e=>{e?y(e):v(h||new ro(new ra("The user rejected the request.",rs.E4001_USER_REJECTED_REQUEST.eipCode))),r({shouldCallAuthOnSuccess:!1}),f(null),d(""),u(void 0)};return a.current=()=>{j(p)},(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:()=>j(p)}),(0,m.jsx)(iz,{}),(0,m.jsxs)(cu,{children:[(0,m.jsx)(cp,{children:C.title}),(0,m.jsx)(cm,{children:C.description}),(0,m.jsx)(cf,{children:ch(w)}),(0,m.jsx)(cg,{fail:!0,children:c}),(0,m.jsx)(cx,{success:g,loading:o,disabled:g,onClick:async()=>{try{let e=await x();f(e),d(""),setTimeout(()=>{j(e)},1400)}catch{d("An error has occurred, please try again."),u(new ro(new ra(c,rs.E32603_DEFAULT_INTERNAL_ERROR.eipCode)))}},children:g?(0,m.jsxs)(cw,{children:[(0,m.jsx)(aZ,{style:{height:"0.9rem",width:"0.9rem"},strokeWidth:2})," ",(0,m.jsx)("span",{children:"Success"})]}):C.buttonText})]}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},EMBEDDED_WALLET_SEND_TRANSACTION_SCREEN:()=>{let{authenticated:e,getAccessToken:t}=ie(),{wallets:r}=l0(),{walletProxy:i,closePrivyModal:a,getFiatOnRampConfig:o,rpcConfig:l,chains:c,nativeTokenSymbolForChainId:d}=r7(),{app:h,navigate:u,data:p,onUserCloseViaDialogOrKeybindRef:f,setModalData:g}=rO(),{transactionRequest:w,onSuccess:x,onFailure:y,uiOptions:v,fundWalletConfig:b}=p.sendTransaction,[C,j]=(0,s.useState)(null),[k,E]=(0,s.useState)(null),[_,P]=(0,s.useState)(""),[S,T]=(0,s.useState)(),[A,N]=(0,s.useState)(!1),I=()=>{P(""),T(void 0)},O=(e,t,r)=>{P(e),T(new ro(new ra(t??e,r??rs.E32603_DEFAULT_INTERNAL_ERROR.eipCode)))},[F,R]=(0,s.useState)(!1),[L,M]=(0,s.useState)(!0),[W,U]=(0,s.useState)(null),[D,Z]=(0,s.useState)(w),{tokenPrice:z,isTokenPriceLoading:$}=lJ(D),B=d(w.chainId)||"ETH",[H,G]=(0,s.useState)(null),[q,V]=(0,s.useState)(null),[K,Y]=(0,s.useState)(!0);(0,s.useEffect)(()=>{e||(u("LANDING"),y(Error("User must be authenticated before transacting with a Privy wallet")))},[e]);let Q=(0,s.useMemo)(()=>r.find(e=>"privy"===e.walletClientType),[r]),J=async()=>{if(!Q)return console.warn("No privy wallet found, cannot fund wallet.");let{signedUrl:e,externalTransactionId:t}=await o(Q.address,{config:b?.config||{}});g({fiatOnRampPrompt:{signedUrl:e},fiatOnRampStatus:{externalTransactionId:t}}),u("FIAT_ON_RAMP_PROMPT_SCREEN")},X=(0,s.useMemo)(()=>new n.c(t8(D.chainId,c,l)),[D.chainId,l]);(0,s.useEffect)(()=>{let e=()=>{M(!1),O("Wallet has insufficient funds for this transaction."),h?.fiatOnRamp.enabled&&N(!0)};!async function(){let r=D;if(!(!await t()||!i||!Q)){try{r=await lB(Q.address,D,X),Z(r)}catch(t){nF(t)&&"insufficient_funds"===t.type||"INSUFFICIENT_FUNDS"===t.code?e():O("There was an error preparing your transaction. Please try again.",t.reason)}try{let e=await lK(r,X);G(sz(e.toBigInt()).toHexString());let t=await lV(D,X);V(sz(t.toBigInt()).toHexString())}catch{G(null)}try{let{balance:t,hasSufficientFunds:i}=await lG(Q.address,r,X);U(t.toHexString()),i||e()}catch(e){console.warn(`Failed to fetch wallet balance with error: ${e}`)}Y(!1)}}()},[i]);let ee=D.to&&D.data?"CONTRACT_CALL":D.to&&D.value?"SEND":"UNKNOWN",et="SEND"===ee?`Send ${B}`:"Review transaction",er={modalTitle:v.header||v.modalTitle||et,buttonText:v.buttonText||"Submit"},ei=()=>{F||(k?x(k):y(S||new ro(new ra("The user rejected the request",rs.E4001_USER_REJECTED_REQUEST.eipCode))),a({shouldCallAuthOnSuccess:!1}))};return f.current=ei,void 0===z&&$||K?(0,m.jsxs)(m.Fragment,{children:[v.transactionInfo?.contractInfo?.imgUrl&&(0,m.jsx)(rS,{src:v.transactionInfo?.contractInfo?.imgUrl}),(0,m.jsx)(i_,{title:er.modalTitle,onClose:ei}),(0,m.jsx)(ca,{children:(0,m.jsx)(nP,{})})]}):null!==C?(0,m.jsx)(cr,{txn:D,onClose:ei,receipt:C,transactionInfo:v.transactionInfo,tokenPrice:z,tokenSymbol:B,l1GasEstimate:q}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{title:er.modalTitle,onClose:ei}),(0,m.jsxs)(ca,{children:[(0,m.jsxs)(cc,{children:[(0,m.jsx)(cn,{txn:D,txnFamily:ee,uiOptions:v,tokenSymbol:B,tokenPrice:z}),Q?(0,m.jsx)(ls,{from:Q.address,to:D.to,txn:D,transactionInfo:v.transactionInfo,gas:H||void 0,tokenPrice:z,tokenSymbol:B}):null]}),(0,m.jsxs)(cd,{children:[(0,m.jsx)(co,{children:_}),(0,m.jsx)(lg,{txn:D,address:Q?.address??"",hasFunds:L,balance:W}),(0,m.jsxs)(cs,{children:[A&&(0,m.jsx)(ip,{onClick:J,children:"Add Funds"}),(0,m.jsx)(cl,{disabled:F||!L,loading:!i||F,loadingText:F?"Submitting (may take a few minutes)...":"Loading...",onClick:async()=>{R(!0);let e=await t();if(e&&!F&&Q)try{let t=await lH(e,Q.address,i,D,X);E(t);let r=await t.wait();j(lQ(r)),I()}catch(e){console.warn({transaction:D,error:e}),O("There was an error processing your transaction. Please contact support.",e.reason)}finally{R(!1)}},children:er.buttonText})]})]})]})]})},FIAT_ON_RAMP_PROMPT_SCREEN:()=>{let{app:e,data:t,navigate:r}=rO(),{createAnalyticsEvent:i}=r7(),{signedUrl:n}=t.fiatOnRampPrompt;return e&&n?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{title:"Fund account"},"header"),(0,m.jsx)(og,{app:e,signedUrl:n,onContinue:()=>{i("sdk_fiat_on_ramp_started",{provider:oP}),r("FIAT_ON_RAMP_STATUS_SCREEN")}}),(0,m.jsx)(iV,{protectedByPrivy:!0})]}):null},FIAT_ON_RAMP_STATUS_SCREEN:()=>{let{app:e,data:t}=rO(),{closePrivyModal:r}=r7(),{externalTransactionId:i}=t?.fiatOnRampStatus,n=function(e,t=!1){let[r,i]=(0,s.useState)(null),{createAnalyticsEvent:n}=r7(),a=(0,s.useRef)(0);return(0,s.useEffect)(()=>{let r=setInterval(async()=>{if(e)try{let[a]=await oA(e,t),o="waitingAuthorization"===a.status&&"credit_debit_card"===a.paymentMethod?"pending":a.status;i(o),["failed","completed","awaitingAuthorization"].includes(o)&&(n(oS,{status:o,provider:oP,paymentMethod:a.paymentMethod,cardPaymentType:a.cardPaymentType,currency:a.currency?.code,baseCurrencyAmount:a.baseCurrencyAmount,quoteCurrencyAmount:a.quoteCurrencyAmount,feeAmount:a.feeAmount,extraFeeAmount:a.extraFeeAmount,networkFeeAmount:a.networkFeeAmount}),clearInterval(r))}catch(e){e.response?.status!==404&&(a.current+=1),a.current>=3&&(i("serviceFailure"),n(oS,{status:"serviceFailure",provider:oP}),clearInterval(r))}},3e3);return()=>clearInterval(r)},[e,a]),r}(i||null,e.fiatOnRamp.useSandbox);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{title:"Fund account"},"header"),(0,m.jsx)(oI,{status:n,onClickCta:r}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},EMBEDDED_WALLET_PASSWORD_UPDATE_SPLASH_SCREEN:()=>{let{user:e}=ie(),{closePrivyModal:t,createAnalyticsEvent:r}=r7(),{data:i,setModalData:n,navigate:a,onUserCloseViaDialogOrKeybindRef:o}=rO(),{onSuccess:s,onFailure:l}=i.setWalletPassword,c=()=>{l(new eZ("Exited before password was added to wallet")),t({shouldCallAuthOnSuccess:!1})};return o.current=c,(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:c}),(0,m.jsx)(iz,{}),(0,m.jsxs)(iW,{children:[(0,m.jsxs)(iB,{children:[(0,m.jsx)(q.Z,{stroke:"var(--privy-color-accent)",width:"64px",height:"64px"}),(0,m.jsx)(iH,{style:{width:24,height:24,position:"absolute",bottom:0,right:0},children:(0,m.jsx)(V.Z,{width:"12px",height:"12px",fill:"white"})})]}),(0,m.jsxs)(iJ,{title:"Secure Your Account",children:["Please set a password to secure your account.",(0,m.jsx)("p",{children:"Losing this password will make your account inaccessible on new devices. You will only be asked for it when you log on to a new device."})]})]}),(0,m.jsx)(ip,{onClick:()=>{let t=tZ(e);r("embedded_wallet_set_password_started",{walletAddress:t?.address}),n({createWallet:{onFailure:l,onSuccess:s,callAuthOnSuccessOnClose:!1,addPasswordToExistingWallet:!0}}),a("EMBEDDED_WALLET_PASSWORD_UPDATE_SCREEN")},children:"Add password"}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})},EMBEDDED_WALLET_PASSWORD_UPDATE_SCREEN:()=>{let[e,t]=(0,s.useState)(null),[r,i]=(0,s.useState)(!1),[n,a]=(0,s.useState)(null),[o,l]=(0,s.useState)(""),{authenticated:c,getAccessToken:d,user:h}=ie(),{walletProxy:u,refreshUser:p,closePrivyModal:f,createAnalyticsEvent:g}=r7(),{app:w,navigate:x,data:y,onUserCloseViaDialogOrKeybindRef:v}=rO(),{onSuccess:b,onFailure:C}=y.createWallet,j=tZ(h),k=e?.recoveryMethod==="user-passcode";(0,s.useEffect)(()=>{c||(x("LANDING"),C(new ez("User must be authenticated before setting a password on a Privy wallet")))},[c]);let E=()=>{if(n){C(n),f({shouldCallAuthOnSuccess:!1});return}if(!k){C(new eZ("Exited before password was added to wallet")),f({shouldCallAuthOnSuccess:!1});return}b(e),f({shouldCallAuthOnSuccess:!1})};v.current=E;let _=async()=>{let e=await d();if(e&&j?.address&&o&&u)try{if(g("embedded_wallet_set_password_started",{walletAddress:j.address}),!(await u.setRecoveryPassword({accessToken:e,address:j.address,recoveryPassword:o})).address){a(new eZ("Error setting password on privy wallet")),g("embedded_wallet_set_password_failed",{walletAddress:j.address,reason:"error setting password"});return}let r=await p(),i=tZ(r);if(!i){a(new eZ("Error setting password on privy wallet")),g("embedded_wallet_set_password_failed",{walletAddress:j.address,reason:"wallet disconnected"});return}t(i),g("embedded_wallet_set_password_completed",{walletAddress:j.address})}catch(e){console.warn(e),a(e instanceof Error?e:Error("Error setting password on privy wallet")),g("embedded_wallet_set_password_failed",{walletAddress:j.address,reason:e})}},P=async()=>{k?(b(e),f({shouldCallAuthOnSuccess:!1})):(i(!0),a(null),await _(),i(!1))};return(0,m.jsx)(aA,{appName:w?.name||"privy",config:{initiatedBy:"user",onCancel:E},error:n?"An error has occurred, please try again.":void 0,buttonLoading:r,buttonHideAnimations:!1,password:o,onPasswordGenerate:()=>l(ab()),onPasswordChange:l,onSubmit:P,onClose:E})},MFA_ENROLLMENT_FLOW_SCREEN:()=>{let{user:e,enrollInMfa:t}=ie(),[r,i]=(0,s.useState)(null),{unenrollWithSms:n,unenrollWithTotp:a}=sT(),{app:o,ready:l,data:c,onUserCloseViaDialogOrKeybindRef:d}=rO(),{closePrivyModal:h}=r7(),{promptMfa:u}=sS(),[p,f]=(0,s.useState)(c?.mfaEnrollmentFlow?.seenIntro||!1),[g,w]=(0,s.useState)(c?.mfaEnrollmentFlow?.selectedMfaMethod||null),x=()=>{h({shouldCallAuthOnSuccess:!0}),t(!1),setTimeout(()=>{i(null),w(null)},500)};d.current=x;let y=e?.mfaMethods.includes("sms"),v=!!e?.phone,b=e?.mfaMethods.includes("totp"),C=y||b;function j(){i(null),w(null)}async function k(e){await u(),w(e)}if((0,s.useEffect)(()=>{C&&f(!0)},[C]),!l||!e||!o)return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:x},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(sA,{})}),(0,m.jsx)(a8,{children:(0,m.jsx)(il,{})}),(0,m.jsx)(iK,{})]});async function E(){i(null);try{await n()}catch{i(null)}}async function P(){i(null);try{await a()}catch{i(null)}}if("sms"===r)return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:j,onClose:x},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(eu.Z,{})})}),(0,m.jsx)(a5,{children:"Remove SMS verification?"}),(0,m.jsxs)(a6,{children:["MFA adds an extra layer of security to your ",o?.name," account. Make sure you have other methods to secure your account."]}),(0,m.jsx)(ot,{children:(0,m.jsx)(ip,{warn:!0,onClick:E,children:"Remove SMS for MFA"})}),(0,m.jsx)(iK,{})]});if("totp"===r)return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:j,onClose:x},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(ep.Z,{})})}),(0,m.jsx)(a5,{children:"Remove Authenticator App verification?"}),(0,m.jsxs)(a6,{children:["MFA adds an extra layer of security to your ",o?.name," account. Make sure you have other methods to secure your account."]}),(0,m.jsx)(ot,{children:(0,m.jsx)(ip,{warn:!0,onClick:P,children:"Remove Authenticator App for MFA"})}),(0,m.jsx)(iK,{})]});if(0===c.mfaEnrollmentFlow.mfaMethods.length&&!C)return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:x},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(em.Z,{})})}),(0,m.jsx)(a5,{children:"Add more security"}),(0,m.jsxs)(a6,{children:[o?.name," does not have any verification methods enabled."]}),(0,m.jsx)(ot,{children:(0,m.jsx)(ip,{onClick:x,children:"Close"})}),(0,m.jsx)(iK,{})]});let S=!C&&!p;if(S)return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{onClose:x},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(em.Z,{})})}),(0,m.jsx)(a5,{children:"Transaction Protection"}),(0,m.jsx)(a6,{children:"Set up transaction protection to add an extra layer of security to your account"}),(0,m.jsxs)(a7,{children:[(0,m.jsxs)(oe,{children:[(0,m.jsx)(a9,{children:(0,m.jsx)(ef.Z,{})}),"Enable 2-Step verification for your ",o?.name," wallet."]}),(0,m.jsxs)(oe,{children:[(0,m.jsx)(a9,{children:(0,m.jsx)(eg.Z,{})}),"You'll be prompted to authenticate to complete transactions."]})]}),(0,m.jsxs)(ot,{children:[(0,m.jsx)(ip,{onClick:()=>f(!0),children:"Continue"}),(0,m.jsx)(iw,{onClick:x,children:"Not now"})]}),(0,m.jsx)(iK,{})]});switch(g){case"sms":return(0,m.jsx)(sO,{onComplete:x,onReset:j,onClose:x});case"totp":return(0,m.jsx)(sF,{onComplete:x,onClose:x,onReset:j});default:return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:S?function(){f(!1)}:void 0,onClose:x},"header"),(0,m.jsx)(a4,{children:(0,m.jsx)(od,{children:(0,m.jsx)(em.Z,{})})}),(0,m.jsx)(a5,{children:"Choose a verification method"}),C?(0,m.jsx)(a6,{children:"To add or delete verification methods, verification is required."}):(0,m.jsx)(a6,{children:"How would you like to verify your identity? You can change this later."}),(0,m.jsxs)(or,{children:[(c.mfaEnrollmentFlow.mfaMethods.includes("totp")||b)&&(0,m.jsxs)(oi,{children:[(0,m.jsx)(nn,{disabled:b,onClick:()=>k("totp"),children:(0,m.jsxs)(os,{children:[(0,m.jsxs)(oa,{children:[(0,m.jsx)(ec.Z,{}),"Authenticator App"]}),b?(0,m.jsxs)(oo,{children:[(0,m.jsx)(el.Z,{}),"Added"]}):(0,m.jsx)(oo,{children:"Recommended"})]})}),b&&(0,m.jsx)(on,{id:"remove",onClick:()=>i("totp"),children:(0,m.jsx)(ed.Z,{})})]},"totp"),(c.mfaEnrollmentFlow.mfaMethods.includes("sms")||y)&&(0,m.jsxs)(oi,{children:[(0,m.jsx)(nn,{disabled:y||v,onClick:()=>k("sms"),children:(0,m.jsxs)(os,{children:[(0,m.jsxs)(oa,{children:[(0,m.jsx)(_.Z,{}),"SMS"]}),y&&(0,m.jsxs)(oo,{children:[(0,m.jsx)(el.Z,{}),"Added"]}),v&&(0,m.jsx)(oo,{children:"Disabled"})]})}),y&&(0,m.jsx)(on,{id:"remove",onClick:()=>i("sms"),children:(0,m.jsx)(ed.Z,{})})]},"sms"),(0,m.jsx)(oi,{children:(0,m.jsx)(nn,{disabled:!0,children:(0,m.jsxs)(os,{children:[(0,m.jsxs)(oa,{children:[(0,m.jsx)(eh.Z,{}),"Passkey"]}),(0,m.jsx)(oo,{isAccent:!0,children:"Coming soon"})]})})},"passkey")]}),(0,m.jsx)(iK,{})]})}},CAPTCHA_SCREEN:()=>{let{lastScreen:e,currentScreen:t,data:r,navigateBack:i,navigate:n,setModalData:a}=rO(),{status:o,token:l,waitForResult:c,reset:d,execute:h}=r5(),u=(0,s.useRef)([]),p=e=>{u.current=[e,...u.current]},[f,g]=(0,s.useState)(!0);(0,s.useEffect)(()=>(p(setTimeout(g,2e3,!1)),()=>{u.current.forEach(e=>clearTimeout(e)),u.current=[]}),[]);let[w,x]=(0,s.useState)("Verifying you are a human."),[y,v]=(0,s.useState)("This should only take a moment."),[b,C]=(0,s.useState)((0,m.jsx)(ip,{onClick:()=>{},disabled:!0,children:"CAPTCHA in progress"})),[j,k]=(0,s.useState)(!1),[E,_]=(0,s.useState)(3),P=r?.captchaModalData,S=async t=>{try{await P?.callback(t),P?.onSuccessNavigateTo&&n(P?.onSuccessNavigateTo,!1)}catch(t){if(t instanceof r3)return;a({errorModalData:{error:t,previousScreen:e||"LANDING"}}),n(P?.onErrorNavigateTo||"ERROR_SCREEN",!1)}};(0,s.useEffect)(()=>{"success"===o?p(setTimeout(async()=>{let e=await c();!e||P?.userIntentRequired||S(e)},1e3)):"ready"===o&&p(setTimeout(()=>{"ready"===o&&h()},500))},[o]),(0,s.useEffect)(()=>{if(!f)switch(o){case"success":x("You are a human!"),v("You have successfully completed the CAPTCHA."),C((0,m.jsx)(ip,{onClick:()=>{k(!0),S(l)},disabled:!P?.userIntentRequired,loading:j,children:P?.userIntentRequired?"Continue":"CAPTCHA completed"}));break;case"loading":x("Verifying you are a human."),v("This should only take a moment."),C((0,m.jsx)(ip,{onClick:()=>{},disabled:!0,children:"CAPTCHA in progress"}));break;case"error":x("Issue verifying you are a human."),E<=0?(v("If you use an adblocker or VPN, try disabling and re-attempting."),C(null)):(v("Please try again."),C((0,m.jsx)(ip,{onClick:T,children:"Retry"})))}},[o,f,j]);let T=async()=>{if(E<=0)return;_(e=>e-1),d(),h();let e=await c();!e||P?.userIntentRequired||S(e)};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:e&&t!==e?i:void 0}),(0,m.jsxs)(ne,{children:[(0,m.jsx)(i8,{icon:i9,success:!f&&"success"===o,fail:!f&&"error"===o}),(0,m.jsxs)(iD,{children:[(0,m.jsx)("h3",{children:w}),(0,m.jsx)("p",{children:y})]}),b]}),(0,m.jsx)(iK,{})]})},ERROR_SCREEN:()=>{let{navigate:e,navigateBack:t,data:r,lastScreen:i,currentScreen:n}=rO(),{reset:a}=r5(),o=r?.errorModalData,s=aM(o?.error||Error()),l=e=>e instanceof eO&&"invalid_captcha"===e.privyErrorCode?()=>a():()=>{};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{backFn:i&&n!==i?t:void 0}),(0,m.jsxs)(aW,{children:[(0,m.jsx)(aD,{children:(0,m.jsxs)("div",{children:[(0,m.jsx)(iC,{color:"var(--privy-color-error)"}),s.icon]})}),(0,m.jsxs)(aU,{children:[(0,m.jsx)("h3",{children:s.title}),(0,m.jsx)("p",{children:s.detail})]}),(0,m.jsx)(ip,{color:"var(--privy-color-error)",onClick:()=>{l(o?.error||Error())(),e(i||"LANDING")},children:s.ctaText})]})]})},IN_APP_BROWSER_LOGIN_NOT_POSSIBLE:()=>{let{closePrivyModal:e}=r7();return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i_,{},"header"),(0,m.jsx)(oW,{children:(0,m.jsx)(ee.Z,{style:{width:32,height:32}})}),(0,m.jsx)(iQ,{title:"Could not log in with provider",description:"It looks like you're using an in-app browser.  To log in, please try again using an external browser.",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}),(0,m.jsx)(iF,{children:(0,m.jsx)(ip,{onClick:()=>e(),children:"Close"})}),(0,m.jsx)(i$,{}),(0,m.jsx)(iV,{protectedByPrivy:!0})]})}},cj=["LANDING","AWAITING_CONNECTION"],ck=({isMfaVerifying:e,onMfaVerificationComplete:t})=>{let{ready:r,isModalOpen:i}=ie(),{headless:n}=r7(),{ready:a,currentScreen:o}=rO(),{status:l,execute:c,reset:d,enabled:h}=r5(),u=(0,s.useRef)(null),p=it(u),f=i&&o&&cj.includes(o)&&!n&&"ready"===l;if((0,s.useEffect)(()=>{f&&c()},[f]),(0,s.useEffect)(()=>{!i&&h&&d()},[i,h]),(!r||!a)&&"AWAITING_OAUTH_SCREEN"!==o)return(0,m.jsxs)(sg,{children:[(0,m.jsx)(i_,{}),(0,m.jsx)(iz,{}),(0,m.jsx)(sb,{children:(0,m.jsx)(il,{})}),(0,m.jsx)(i$,{}),(0,m.jsx)(iK,{})]});if(!o&&e)return(0,m.jsx)(sg,{style:{height:p},children:(0,m.jsx)("div",{ref:u,children:(0,m.jsx)(l3,{open:e,onClose:t})})});if(!o)return null;let g=cC[o];return(0,m.jsx)(sg,{style:{height:p},children:(0,m.jsxs)("div",{ref:u,children:[(0,m.jsx)(na,{if:!!e,children:(0,m.jsx)(g,{})}),(0,m.jsx)(na,{if:!e,children:(0,m.jsx)(l3,{open:e,onClose:t})})]})})},cE=()=>{let{closePrivyModal:e}=r7(),{onUserCloseViaDialogOrKeybindRef:t}=rO();return{gracefulClosePrivyModal:(0,s.useCallback)(()=>{if(!t?.current)return e({shouldCallAuthOnSuccess:!1});t.current(),t.current=null},[e])}},c_=({open:e})=>{let{app:t}=rO(),{gracefulClosePrivyModal:r}=cE(),[i,n]=(0,s.useState)(!1);!function(e,t){if(!t)return;let r=ia().current[e];(0,s.useEffect)(()=>{for(let[i,n]of Object.entries(t))r.hasOwnProperty(i)||console.warn(`Invalid event type "${i}" for action "${e}"`),r[i]?.push(n);return()=>{for(let[i,n]of Object.entries(t))r.hasOwnProperty(i)||console.warn(`Invalid event type "${i}" for action "${e}"`),r[i]=r[i]?.filter(e=>e!==n)}},[t])}("configureMfa",{onMfaRequired:()=>{t?.mfa.noPromptOnMfaRequired||n(!0)}});let a=(0,m.jsx)(cb,{children:(0,m.jsx)(ck,{isMfaVerifying:i,onMfaVerificationComplete:()=>n(!1)})}),o=t?.render.inDialog?(0,m.jsx)(sf,{open:e||i,id:"privy-dialog",onClick:()=>r(),children:a}):a;if("u">typeof window&&t?.render.inParentNodeId){let e=document.getElementById(t.render.inParentNodeId);if(e)return b.createPortal(o,e)}return o},cP={appearance:{theme:"light",accentColor:"#676FFF",walletList:["detected_wallets","metamask","coinbase_wallet","rainbow","wallet_connect"]},walletConnectCloudProjectId:"34357d3c125c2bcf2ce2bc3309d98715",rpcConfig:{rpcUrls:{},rpcTimeouts:{}},captchaEnabled:!1,_render:{inDialog:!0,inParentNodeId:null},fiatOnRamp:{useSandbox:!1}},cS=new Set(["metamask","coinbase_wallet","rainbow","zerion","phantom","wallet_connect","detected_wallets"]),cT=e=>cS.has(e),cA=(e,t,r)=>r.indexOf(e)===t,cN=({input:e})=>e?e.filter(cT).filter(cA):cP.appearance.walletList,cI={id:1,network:"homestead",name:"Ethereum",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:{alchemy:{http:["https://eth-mainnet.g.alchemy.com/v2"],webSocket:["wss://eth-mainnet.g.alchemy.com/v2"]},infura:{http:["https://mainnet.infura.io/v3"],webSocket:["wss://mainnet.infura.io/ws/v3"]},default:{http:["https://cloudflare-eth.com"]},public:{http:["https://cloudflare-eth.com"]}},blockExplorers:{etherscan:{name:"Etherscan",url:"https://etherscan.io"},default:{name:"Etherscan",url:"https://etherscan.io"}}},cO=[lE,l_,lP,{id:5,network:"goerli",name:"Goerli",nativeCurrency:{name:"Goerli Ether",symbol:"ETH",decimals:18},rpcUrls:{alchemy:{http:["https://eth-goerli.g.alchemy.com/v2"],webSocket:["wss://eth-goerli.g.alchemy.com/v2"]},infura:{http:["https://goerli.infura.io/v3"],webSocket:["wss://goerli.infura.io/ws/v3"]},default:{http:["https://rpc.ankr.com/eth_goerli"]},public:{http:["https://rpc.ankr.com/eth_goerli"]}},blockExplorers:{etherscan:{name:"Etherscan",url:"https://goerli.etherscan.io"},default:{name:"Etherscan",url:"https://goerli.etherscan.io"}},testnet:!0},{id:11155111,network:"sepolia",name:"Sepolia",nativeCurrency:{name:"Sepolia Ether",symbol:"SEP",decimals:18},rpcUrls:{alchemy:{http:["https://eth-sepolia.g.alchemy.com/v2"],webSocket:["wss://eth-sepolia.g.alchemy.com/v2"]},infura:{http:["https://sepolia.infura.io/v3"],webSocket:["wss://sepolia.infura.io/ws/v3"]},default:{http:["https://rpc.sepolia.org"]},public:{http:["https://rpc.sepolia.org"]}},blockExplorers:{etherscan:{name:"Etherscan",url:"https://sepolia.etherscan.io"},default:{name:"Etherscan",url:"https://sepolia.etherscan.io"}},testnet:!0},cI,lN,lI,lO,lM,lW,{id:42220,name:"Celo Mainnet",network:"celo",nativeCurrency:{decimals:18,name:"CELO",symbol:"CELO"},rpcUrls:{default:{http:["https://forno.celo.org"]},infura:{http:["https://celo-mainnet.infura.io/v3"]},public:{http:["https://forno.celo.org"]}},blockExplorers:{default:{name:"Celo Explorer",url:"https://explorer.celo.org/mainnet"},etherscan:{name:"CeloScan",url:"https://celoscan.io"}},testnet:!1},{id:44787,name:"Celo Alfajores Testnet",network:"celo-alfajores",nativeCurrency:{decimals:18,name:"CELO",symbol:"CELO"},rpcUrls:{default:{http:["https://alfajores-forno.celo-testnet.org"]},infura:{http:["https://celo-alfajores.infura.io/v3"]},public:{http:["https://alfajores-forno.celo-testnet.org"]}},blockExplorers:{default:{name:"Celo Explorer",url:"https://explorer.celo.org/alfajores"},etherscan:{name:"CeloScan",url:"https://alfajores.celoscan.io/"}},testnet:!0},{id:314,name:"Filecoin - Mainnet",network:"filecoin-mainnet",nativeCurrency:{decimals:18,name:"filecoin",symbol:"FIL"},rpcUrls:{default:{http:["https://api.node.glif.io/rpc/v1"]},public:{http:["https://api.node.glif.io/rpc/v1"]}},blockExplorers:{default:{name:"Filfox",url:"https://filfox.info/en"},filscan:{name:"Filscan",url:"https://filscan.io"},filscout:{name:"Filscout",url:"https://filscout.io/en"},glif:{name:"Glif",url:"https://explorer.glif.io"}}},{id:314159,name:"Filecoin - Calibration testnet",network:"filecoin-calibration",nativeCurrency:{decimals:18,name:"testnet filecoin",symbol:"tFIL"},rpcUrls:{default:{http:["https://api.calibration.node.glif.io/rpc/v1"]},public:{http:["https://api.calibration.node.glif.io/rpc/v1"]}},blockExplorers:{default:{name:"Filscan",url:"https://calibration.filscan.io"}}},lS,lT,lA,{id:59144,network:"linea-mainnet",name:"Linea Mainnet",nativeCurrency:{name:"Linea Ether",symbol:"ETH",decimals:18},rpcUrls:{infura:{http:["https://linea-mainnet.infura.io/v3"],webSocket:["wss://linea-mainnet.infura.io/ws/v3"]},default:{http:["https://rpc.linea.build"],webSocket:["wss://rpc.linea.build"]},public:{http:["https://rpc.linea.build"],webSocket:["wss://rpc.linea.build"]}},blockExplorers:{default:{name:"Etherscan",url:"https://lineascan.build"},etherscan:{name:"Etherscan",url:"https://lineascan.build"}},testnet:!1},{id:59140,network:"linea-testnet",name:"Linea Goerli Testnet",nativeCurrency:{name:"Linea Ether",symbol:"ETH",decimals:18},rpcUrls:{infura:{http:["https://linea-goerli.infura.io/v3"],webSocket:["wss://linea-goerli.infura.io/ws/v3"]},default:{http:["https://rpc.goerli.linea.build"],webSocket:["wss://rpc.goerli.linea.build"]},public:{http:["https://rpc.goerli.linea.build"],webSocket:["wss://rpc.goerli.linea.build"]}},blockExplorers:{default:{name:"Etherscan",url:"https://goerli.lineascan.build"},etherscan:{name:"Etherscan",url:"https://goerli.lineascan.build"}},testnet:!0},{id:43114,name:"Avalanche",network:"avalanche",nativeCurrency:{decimals:18,name:"Avalanche",symbol:"AVAX"},rpcUrls:{default:{http:["https://api.avax.network/ext/bc/C/rpc"]},public:{http:["https://api.avax.network/ext/bc/C/rpc"]}},blockExplorers:{etherscan:{name:"SnowTrace",url:"https://snowtrace.io"},default:{name:"SnowTrace",url:"https://snowtrace.io"}}},{id:43113,name:"Avalanche Fuji",network:"avalanche-fuji",nativeCurrency:{decimals:18,name:"Avalanche Fuji",symbol:"AVAX"},rpcUrls:{default:{http:["https://api.avax-test.network/ext/bc/C/rpc"]},public:{http:["https://api.avax-test.network/ext/bc/C/rpc"]}},blockExplorers:{etherscan:{name:"SnowTrace",url:"https://testnet.snowtrace.io"},default:{name:"SnowTrace",url:"https://testnet.snowtrace.io"}},testnet:!0},lF,lL,lR,{id:17e3,name:"Holesky",network:"holesky",nativeCurrency:{name:"ETH",symbol:"ETH",decimals:18},rpcUrls:{default:{http:["https://ethereum-holesky.publicnode.com"]},public:{http:["https://ethereum-holesky.publicnode.com"]}},blockExplorers:{etherscan:{name:"EtherScan",url:"https://holesky.etherscan.io"},default:{name:"EtherScan",url:"https://holesky.etherscan.io"}}},{id:17001,name:"Redstone Holesky",network:"redstone-holesky",nativeCurrency:{name:"ETH",symbol:"ETH",decimals:18},rpcUrls:{default:{http:["https://rpc.holesky.redstone.xyz"]},public:{http:["https://rpc.holesky.redstone.xyz"]}},blockExplorers:{etherscan:{name:"EtherScan",url:"https://explorer.holesky.redstone.xyz"},default:{name:"EtherScan",url:"https://explorer.holesky.redstone.xyz"}}}];cO.map(e=>e.id);var cF="#FFFFFF";function cR(e,t){let r=Math.max(0,Math.min(1,e.toHsl().l+t));return(0,eP.Z)({...e.toHsl(),l:r})}function cL(e,t){let r=["google","twitter","discord","tiktok","linkedin","github","apple","farcaster"],i=t?.loginMethods?.filter(e=>r.includes(e)),n,a,o,s,l,c,d,h,u,p,m;t?.loginMethods?(n=t.loginMethods.includes("email"),a=t.loginMethods.includes("sms"),o=t.loginMethods.includes("wallet"),s=i?.includes("google"),l=i?.includes("twitter"),c=i?.includes("discord"),d=i?.includes("tiktok"),u=i?.includes("github"),h=i?.includes("linkedin"),p=i?.includes("apple"),m=i?.includes("farcaster")):(n=e.emailAuth,a=e.smsAuth,o=e.walletAuth,s=e.googleOAuth,l=e.twitterOAuth,c=e.discordOAuth,u=e.githubOAuth,d=e.tiktokOAuth,h=e.linkedinOAuth,p=e.appleOAuth,m=e.farcasterAuth);let f=[n,a].filter(Boolean),g=[s,l,c,u,d,h,p,m].filter(Boolean),w=[o].filter(Boolean);if(f.length+g.length+w.length===0)throw Error("You must enable at least one login method");let x=t?.appearance?.showWalletLoginFirst!==void 0?t?.appearance?.showWalletLoginFirst:e.showWalletLoginFirst;x&&0===w.length?(console.warn("You should only enable `showWalletLoginFirst` when `wallet` logins are also enabled. `showWalletLoginFirst` has been set to false"),x=!1):x||g.length+f.length!==0||(console.warn("You should only disable `showWalletLoginFirst` when `email`, `sms`, or social logins are also enabled. `showWalletLoginFirst` has been set to true"),x=!0);let y=cN({isWalletLoginEnabled:o,input:t?.appearance?.walletList});if(t?.embeddedWallets?.waitForTransactionConfirmation===!1&&!0!==t.embeddedWallets.noPromptOnSignature)throw Error("Overriding `config.embeddedWallets.waitForTransactionConfirmation` requires that you also enable `config.embeddedWallets.noPromptOnSignature`");let v=t?.intl?.defaultCountry??"US",{chains:b,defaultChain:C}=function({additionalChains:e,supportedChains:t,defaultChainFromConfig:r,hasRpcConfigDefined:i}){let n;if(e&&t&&console.warn("You should only specify one of `additionalChains` or `supportedChains`. Using `supportedChains`."),t){if(0===t.length)throw Error("`supportedChains` must contain at least one chain");t.filter(e=>e.rpcUrls.privyWalletOverride).length>0&&i&&console.warn("You have specified at least one `supportedChain` with `privyWalletOverride` but also have `rpcConfig` defined. The `rpcConfig` will be ignored. `rpcConfig` is deprecated and you should use `privyWalletOverride` in a `supportedChain`."),n=t.map(e=>e.rpcUrls.privyWalletOverride?e:cO.find(t=>t.id===e.id)??e)}else n=cO.concat(e??[]);let a=t?n[0]:cI,o=r??a;if(!n.find(e=>e.id===o.id))throw Error("`defaultChain` must be included in `supportedChains`");return{chains:n,defaultChain:o}}({additionalChains:t?.additionalChains,supportedChains:t?.supportedChains,defaultChainFromConfig:t?.defaultChain,hasRpcConfigDefined:Object.keys(t?.rpcConfig?.rpcUrls??{}).length>0}),j=!!t?.defaultChain||!!t?.supportedChains,k=t?.customAuth?.getCustomAccessToken&&t?.customAuth?.enabled!==!1;return{id:e.id,name:e.name,allowlistConfig:e.allowlistConfig,appearance:{logo:t?.appearance?.logo??e.logoUrl,palette:function({backgroundTheme:e,accentHex:t,successHex:r="#51BA81",warnHex:i="#FFB74D",errorHex:n="#EC6351",whiteHex:a=cF,blackHex:o="#000000"}){var s;let l;switch(e){case"light":l=cF;break;case"dark":l="#1E1E1D";break;default:l=e}let c=(0,eP.Z)(l),d=(0,eP.Z)(t),h=(0,eP.Z)(r),u=(0,eP.Z)(i),p=(0,eP.Z)(n),m=((s=c.getLuminance())<.8&&s>.2&&console.warn("Background color is not light or dark enough, which could lead to accessibility issues."),s>.5?"light":"dark"),f=cR(c,"light"===m?-.04:.11),g=cR(c,"light"===m?-.88:.87),w=cR(c,"light"===m?-.77:.75),x=cR(c,"light"===m?-.43:.45).desaturate("light"===m?60:20),y=cR(c,"light"===m?-.08:.25).desaturate("light"===m?60:20),v=cR(d,.15),b=cR(d,-.06),C=(0,eP.Z)(d.getLuminance()>.5?o:a),j=cR(h,-.16);return{colorScheme:m,background:c.toHslString(),background2:f.toHslString(),foreground:g.toHslString(),foreground2:w.toHslString(),foreground3:x.toHslString(),foreground4:y.toHslString(),accent:d.toHslString(),accentLight:v.toHslString(),accentDark:b.toHslString(),foregroundAccent:C.toHslString(),success:h.toHslString(),successDark:j.toHslString(),error:p.toHslString(),warn:u.toHslString()}}({backgroundTheme:t?.appearance?.theme??cP.appearance.theme,accentHex:t?.appearance?.accentColor??e.accentColor??cP.appearance.accentColor}),loginGroupPriority:x?"web3-first":"web2-first",hideDirectWeb2Inputs:!!t?.appearance?.hideDirectWeb2Inputs,walletList:y},loginMethods:{wallet:o,email:n,sms:a,google:s,twitter:l,discord:c,github:u,tiktok:d,linkedin:h,apple:p,farcaster:m},legal:{termsAndConditionsUrl:t?.legal?.termsAndConditionsUrl??e.termsAndConditionsUrl,privacyPolicyUrl:t?.legal?.privacyPolicyUrl??e.privacyPolicyUrl},walletConnectCloudProjectId:t?.walletConnectCloudProjectId??e.walletConnectCloudProjectId??cP.walletConnectCloudProjectId,rpcConfig:{rpcUrls:t?.rpcConfig?.rpcUrls??cP.rpcConfig.rpcUrls,rpcTimeouts:t?.rpcConfig?.rpcTimeouts??cP.rpcConfig.rpcTimeouts},chains:b,defaultChain:C,intl:{defaultCountry:v},shouldSwitchChainOnConnect:j,captchaEnabled:e.captchaEnabled??cP.captchaEnabled,captchaSiteKey:e.captchaSiteKey,embeddedWallets:{...e.embeddedWalletConfig,...k?{createOnLogin:"all-users",requireUserPasswordOnCreate:!1,noPromptOnSignature:!0}:{},waitForTransactionConfirmation:!0,priceDisplay:{primary:"fiat-currency",secondary:"native-token"},...t?.embeddedWallets},mfa:{methods:e.mfaMethods??[],noPromptOnMfaRequired:t?.mfa?.noPromptOnMfaRequired??!1},customAuth:k?{enabled:!0,...t.customAuth}:void 0,fiatOnRamp:{enabled:e.fiatOnRampEnabled,useSandbox:t?.fiatOnRamp?.useSandbox??cP.fiatOnRamp.useSandbox},loginConfig:{twitterOAuthOnMobileEnabled:e.twitterOAuthOnMobileEnabled??!1},render:{inDialog:t?._render?.inDialog??cP._render.inDialog,inParentNodeId:t?._render?.inParentNodeId??cP._render.inParentNodeId}}}async function cM(e,t,r,i,n,a=!1){let o=a,s=async s=>{if(o&&t&&t.length>0){s===(a?0:1)?n("configureMfa","onMfaRequired",t):i.current?.reject(new nO("missing_or_invalid_mfa","MFA verification failed, retry."));let o=await new Promise((e,t)=>{r.current={resolve:e,reject:t},setTimeout(()=>{let e=new nO("mfa_timeout","Timed out waiting for MFA code");i.current?.reject(e),t(e)},3e5)});return await e(o)}return await e()},l=null;for(let e=0;e<4;e++)try{l=await s(e),i.current?.resolve(void 0);break}catch(e){if("missing_or_invalid_mfa"===e.type)o=!0;else throw i.current?.resolve(void 0),e}if(null===l){let e=new nO("mfa_verification_max_attempts_reached","Max MFA verification attempts reached");throw i.current?.reject(e),e}return l}var cW=(cV=0,()=>`id-${cV++}`);function cU(e){return void 0!==e.error}var cD=new class{constructor(){this.callbacks={}}enqueue(e,t){this.callbacks[e]=t}dequeue(e,t){let r=this.callbacks[t];if(!r)throw Error(`cannot dequeue ${e} event: no event found for id ${t}`);switch(delete this.callbacks[t],e){case"privy:iframe:ready":case"privy:wallet:create":case"privy:wallet:connect":case"privy:wallet:recover":case"privy:wallet:rpc":case"privy:wallet:set-recovery-password":case"privy:mfa:verify":case"privy:mfa:init-enrollment":case"privy:mfa:submit-enrollment":case"privy:mfa:unenroll":return r;default:throw Error(`invalid wallet event type ${e}`)}}},cZ=new Map,cz=(e,t)=>"bigint"==typeof t?t.toString():t,c$=(e,t)=>`${e}${JSON.stringify(t,cz)}`;function cB(e,t,r){let i=r.contentWindow;if(!i)throw Error("iframe not initialized");let n=c$(e,t);if("privy:wallet:create"===e){let e=cZ.get(n);if(e)return e}let a=new Promise((r,n)=>{let a=cW();cD.enqueue(a,{resolve:r,reject:n}),i.postMessage({id:a,event:e,data:t},"*")}).finally(()=>{cZ.delete(n)});return cZ.set(n,a),a}function cH(e){let t;let r=(0,s.useRef)(null),i=(t=ia(),(e,r,...i)=>io(t,e,r,...i));return(0,s.useEffect)(()=>{let t=r.current;if(!t)return;function n(t){var r;t&&t.origin===e.origin&&"string"==typeof(r=t.data).event&&/^privy:.+/.test(r.event)&&function(e){switch(e.event){case"privy:iframe:ready":let t=cD.dequeue(e.event,e.id);return cU(e)?t.reject(new nO(e.error.type,e.error.message)):t.resolve(e.data);case"privy:wallet:create":let r=cD.dequeue(e.event,e.id);return cU(e)?r.reject(new nO(e.error.type,e.error.message)):r.resolve(e.data);case"privy:wallet:connect":let i=cD.dequeue(e.event,e.id);return cU(e)?i.reject(new nO(e.error.type,e.error.message)):i.resolve(e.data);case"privy:wallet:recover":let n=cD.dequeue(e.event,e.id);return cU(e)?n.reject(new nO(e.error.type,e.error.message)):n.resolve(e.data);case"privy:wallet:rpc":let a=cD.dequeue(e.event,e.id);return cU(e)?a.reject(new nO(e.error.type,e.error.message)):a.resolve(e.data);case"privy:wallet:set-recovery-password":let o=cD.dequeue(e.event,e.id);return cU(e)?o.reject(new nO(e.error.type,e.error.message)):o.resolve(e.data);case"privy:mfa:verify":let s=cD.dequeue(e.event,e.id);return cU(e)?s.reject(new nO(e.error.type,e.error.message)):s.resolve(e.data);case"privy:mfa:init-enrollment":{let t=cD.dequeue(e.event,e.id);return cU(e)?t.reject(new nO(e.error.type,e.error.message)):t.resolve(e.data)}case"privy:mfa:submit-enrollment":{let t=cD.dequeue(e.event,e.id);return cU(e)?t.reject(new nO(e.error.type,e.error.message)):t.resolve(e.data)}case"privy:mfa:unenroll":{let t=cD.dequeue(e.event,e.id);return cU(e)?t.reject(new nO(e.error.type,e.error.message)):t.resolve(e.data)}default:console.warn("Unsupported wallet proxy method:",e)}}(t.data)}let a={create:e=>cB("privy:wallet:create",e,t),connect:e=>cB("privy:wallet:connect",e,t),recover:r=>cM(e=>cB("privy:wallet:recover",{...r,...e},t),e.mfaMethods,e.mfaPromise,e.mfaSubmitPromise,i,!0),rpc:r=>cM(e=>cB("privy:wallet:rpc",{...r,...e},t),e.mfaMethods,e.mfaPromise,e.mfaSubmitPromise,i),setRecoveryPassword:r=>cM(e=>cB("privy:wallet:set-recovery-password",{...r,...e},t),e.mfaMethods,e.mfaPromise,e.mfaSubmitPromise,i),verifyMfa:r=>cM(e=>cB("privy:mfa:verify",{...r,...e},t),e.mfaMethods,e.mfaPromise,e.mfaSubmitPromise,i,!0),initEnrollMfa:r=>cM(e=>cB("privy:mfa:init-enrollment",{...r,...e},t),e.mfaMethods,e.mfaPromise,e.mfaSubmitPromise,i),submitEnrollMfa:e=>cB("privy:mfa:submit-enrollment",e,t),unenrollMfa:r=>cM(e=>cB("privy:mfa:unenroll",{...r,...e},t),e.mfaMethods,e.mfaPromise,e.mfaSubmitPromise,i,!0)};window.addEventListener("message",n);let o=new AbortController;return tX(()=>cB("privy:iframe:ready",{},t),{abortSignal:o.signal}).then(()=>e.onLoad(a),(...t)=>{console.warn("Privy iframe failed to load: ",...t),e.onLoadFailed()}),()=>{window.removeEventListener("message",n),o.abort()}},[r.current,e.mfaMethods]),(0,m.jsx)("iframe",{ref:r,width:"0",height:"0",style:{display:"none",height:"0px",width:"0px"},src:t0(e.origin,`/apps/${e.appId}/embedded-wallets`,{caid:e.clientAnalyticsId})})}var cG=class{constructor(e,t){this.meta={action:e,phoneNumber:t}}async init(){if(!this.meta.action)throw new eR("action required");if(!this.api)throw new eR("Auth flow has no API instance");if("enroll"===this.meta.action&&!this.meta.phoneNumber)throw new eR("phone number must be set when initialzing authentication.");try{let e=ts();await this.api.post(e,{action:this.meta.action,phoneNumber:this.meta.phoneNumber})}catch(e){throw eW(e)}}async authenticate(){if(!this.meta.action)throw new eR("action required");if(!this.api)throw new eR("Mfa flow has no API instance");if(!this.meta.smsCode)throw new eR("sms code must be set prior to calling authenticate.");if("enroll"===this.meta.action&&!this.meta.phoneNumber)throw new eR("phone number must be set prior to calling authenticate.");try{let e=tl(),t=await this.api.post(e,{phoneNumber:this.meta.phoneNumber,code:this.meta.smsCode});return tB(t)}catch(e){throw eW(e)}}};function cq(){return cK?cK.getAccessToken():Promise.resolve(tF.get(tf)||null)}var cV,cK,cY,cQ,cJ,cX=(e,t)=>cY(e,t),c0=(e,t)=>cQ(e,t),c1=()=>cJ(),c2=()=>{let e=new URLSearchParams(window.location.search).get("privy_token");if(!e)return;tF.put(tv,e);let t=new URL(window.location.href);t.searchParams.delete("privy_token"),window.history.pushState({},"",t)},c3=({config:e,...t})=>{var r;if(!("string"==typeof(r=t.appId)&&25===r.length))throw new eR("Cannot initialize the Privy provider with an invalid Privy app ID");cK||(cK=new r1({appId:t.appId,apiUrl:t.apiUrl||tm}));let i=Object.assign({},e);return void 0!==t.createPrivyWalletOnLogin&&i.embeddedWallets?.createOnLogin===void 0&&(i.embeddedWallets||(i.embeddedWallets={}),i.embeddedWallets.createOnLogin=t.createPrivyWalletOnLogin?"users-without-wallets":"off"),void 0!==t.createPrivyWalletOnLogin&&e?.embeddedWallets?.createOnLogin&&console.warn("Both `createPrivyWalletOnLogin` and `config.embeddedWallets.createOnLogin` are set. `createPrivyWalletOnLogin` is deprecated and should be removed."),(0,m.jsx)(c4,{...t,config:i,client:cK})},c4=e=>{let t=e.client,[r,c]=(0,s.useState)(!1),[d,h]=(0,s.useState)(!1),[u,p]=(0,s.useState)(!1),[f,g]=(0,s.useState)(null),[w,x]=(0,s.useState)(!1),[y,v]=(0,s.useState)([]),b=(0,s.useRef)(y),[C,j]=(0,s.useState)(!1),[k,E]=(0,s.useState)(null),[_,P]=(0,s.useState)(!1),[S,T]=(0,s.useState)({status:"disconnected",connectedWallet:null,connectError:null,connector:null,connectRetry:rT}),[A,N]=(0,s.useState)(null),[I,O]=(0,s.useState)(null),[F,R]=(0,s.useState)(null),[L,M]=(0,s.useState)({showWalletLoginFirst:!0,allowlistConfig:{errorTitle:null,errorDetail:null,errorCtaText:null,errorCtaLink:null},walletAuth:!0,emailAuth:!0,smsAuth:!1,googleOAuth:!1,twitterOAuth:!1,discordOAuth:!1,githubOAuth:!1,linkedinOAuth:!1,appleOAuth:!1,termsAndConditionsUrl:null,privacyPolicyUrl:null,embeddedWalletConfig:{createOnLogin:"off",requireUserPasswordOnCreate:!1},fiatOnRampEnabled:!1,captchaEnabled:!1,captchaSiteKey:""}),[W,U]=(0,s.useState)(()=>{let r=function(e,t){if(!e)return{legacyCreateEmbeddedWalletFlag:t};let{appearance:r,additionalChains:i,supportedChains:n,defaultChain:a,...o}=e;return{...o,...i?{additionalChains:i.map(e=>e.id)}:void 0,...n?{supportedChains:n.map(e=>e.id)}:void 0,...a?{defaultChain:a.id}:void 0,...r?{...r,...r.logo&&(r.logo,1)?{logo:"component"}:void 0}:void 0,legacyCreateEmbeddedWalletFlag:t}}(e.config,e.createPrivyWalletOnLogin);return t.createAnalyticsEvent("sdk_initialize",r),cL(L,e.config)}),[D,Z]=(0,s.useState)(!0),[z,$]=(0,s.useState)({}),[B,H]=(0,s.useState)(null),[G,q]=(0,s.useState)(null),[V,K]=(0,s.useState)(!1),[Y,Q]=(0,s.useState)(!1),J=(0,s.useRef)(null),X=(0,s.useRef)(null),ee=(0,s.useRef)(ir);t.onStoreToken=e=>{e&&io(ee,"accessToken","onAccessTokenGranted",e)},t.onDeleteToken=()=>{io(ee,"accessToken","onAccessTokenRemoved")};let et=(0,s.useRef)(),er=(0,s.useCallback)(e=>{let r=t.connectors?.walletsReady||!1;return u&&f?.linkedAccounts?.some(e=>"wallet"===e.type&&"privy"===e.walletClientType)?r&&e?.some(e=>e?.walletClientType==="privy"):r},[u,f?.linkedAccounts,t?.connectors?.walletsReady]),ei=e=>{E(e),setTimeout(()=>{c(!0)},15),t.createAnalyticsEvent("modal_open",{initialScreen:e})},en=e=>{"off"!==W.embeddedWallets.createOnLogin&&Z(!0),ei(e)};(0,s.useEffect)(()=>{if(!F||!f){t.connectors?.removeEmbeddedWalletConnector();return}let e=f?.linkedAccounts.filter(e=>"wallet"===e.type&&"privy"===e.walletClient);if(e&&e.length>0){let r=e[0].address;t.connectors?.addEmbeddedWalletConnector(F,r,W.defaultChain)}},[F,f]),(0,s.useEffect)(()=>{F&&G?.(F)},[F]),(0,s.useEffect)(()=>{(async()=>{if(!W.customAuth?.enabled)return;Z(!0);let{getCustomAccessToken:e,isLoading:r}=W.customAuth;if(!(!d||r))try{let r=await e();if(!r){await ey.logout();return}if(u)return;t.startAuthFlow(new tc(r));let{user:i,isNewUser:n}=await t.authenticate();i||await ey.logout(),g(i||null),j(n||!1),p(!0),Q(!0)}catch(e){console.warn(e),u&&await ey.logout()}})()},[W.customAuth?.enabled,W.customAuth?.getCustomAccessToken,W.customAuth?.isLoading,d,u]),(0,s.useEffect)(()=>{Y&&F&&f&&t$(f,e.config?.embeddedWallets?.createOnLogin)&&(Q(!1),ef(f,3e4).catch(console.error))},[Y&&F&&f]),(0,s.useEffect)(()=>{async function r(){let r=await t.getServerConfig();M(r);let i=cL(r,e.config);U(i),r.customApiUrl&&t.updateApiUrl(r.customApiUrl);let n=ea();c2();let a=(0,o.M)();N(a),t.initializeConnectorManager(i.walletConnectCloudProjectId,i.rpcConfig,i.chains,i.defaultChain,a,i.appearance.walletList),await t.connectors?.initialize();let s=await t.getAuthenticatedUser();e.config?.customAuth?.enabled||(p(!!s),s&&io(ee,"login","onComplete",s,!1,!0,null),g(s)),n||eb.setReadyToTrue(),n&&s&&x(!0),ec()}d||r()},[t,B,d]),(0,s.useEffect)(()=>{U(cL(L,e.config))},[e.config,L]);let ea=()=>{let e=new URLSearchParams(window.location.search),r=e.get("privy_oauth_code"),i=e.get("privy_oauth_state"),n=e.get("privy_oauth_provider");return!!r&&!!i&&!!n&&(t.startAuthFlow(new tL(n,r,i)),en("AWAITING_OAUTH_SCREEN"),!0)},eo=async(e,r,i,n)=>{es(await t.connectors?.createWalletConnector(e,r)||null,r,i,n)};async function es(e,t,r,i){if(!e)return T({status:"disconnected",connectedWallet:null,connectError:new eM("Unable to connect to wallet."),connector:null,connectRetry:rT}),i?.(null,r);e instanceof r$&&t&&e.resetConnection(t),T({connector:e,status:"connecting",connectedWallet:null,connectError:null,connectRetry:()=>es(e,t,r,i)});try{let t=await e.connect({showPrompt:!0});if(W.shouldSwitchChainOnConnect&&!W.chains.find(e=>e.id===Number(t?.chainId))&&!(t?.connectorType==="wallet_connect_v2"&&t?.walletClientType==="metamask")){T(t=>({...t,connector:e,status:"switching_to_supported_chain",connectedWallet:null,connectError:null,connectRetry:rT}));try{await t?.switchChain(W.defaultChain.id),t&&(t.chainId=t4(t2(W.defaultChain.id)))}catch{console.warn(`Unable to switch to default chain: ${W.defaultChain.id}`)}}return T(e=>({...e,status:"connected",connectedWallet:t,connectError:null,connectRetry:rT})),t&&!_&&io(ee,"connectWallet","onSuccess",t),i?.(t,r)}catch(e){return e instanceof eO?(console.warn(e.cause?e.cause:e.message),_||io(ee,"connectWallet","onError",e.privyErrorCode||"generic_connect_wallet_error")):(console.warn(e),_||io(ee,"connectWallet","onError","unknown_connect_wallet_error")),T(t=>({...t,status:"disconnected",connectedWallet:null,connectError:e})),i?.(null,r)}}let el=async(e,r)=>{if(null===e)return;let i=new tM(e,r);t.startAuthFlow(i)},ec=()=>{let e=new URLSearchParams(window.location.search),r=e.get("privy_connector"),i=e.get("privy_wallet_client");if(!r||!i)return;if("phantom"!==i||tq()||en("LOGIN_FAILED_SCREEN"),!t.connectors)throw new eR("Connector not initialized");ei("AWAITING_CONNECTION");let n=new URL(window.location.href);n.searchParams.delete("privy_connector"),n.searchParams.delete("privy_wallet_client"),window.history.pushState({},"",n),eo(r,i,void 0,el)};(0,s.useEffect)(()=>{d&&u&&null===f&&t.getAuthenticatedUser().then(g)},[d,u,f,t]);let ed=()=>{if(!u)throw new eR("User must be authenticated before linking a wallet.");x(!0),ei("LINK_WALLET_SCREEN")},eh=e=>{if(!u||!f)return!1;for(let t of f.linkedAccounts)if("wallet"===t.type&&t.address===e.address)return!0;return!1},eu=async e=>{if(!t.connectors)throw new eR("Connector not initialized");let r=t.connectors.findWalletConnector(e.connectorType,e.walletClientType)||null;(T(t=>({...t,connector:r,status:"connected",connectedWallet:e,connectError:null,connectRetry:rT})),W.captchaEnabled&&!u)?($({captchaModalData:{callback:t=>el(e,t),userIntentRequired:!1,onSuccessNavigateTo:"AWAITING_CONNECTION",onErrorNavigateTo:"ERROR_SCREEN"}}),en("CAPTCHA_SCREEN")):(await el(e),en("AWAITING_CONNECTION"))},ep=async(e,r)=>{if(!W.fiatOnRamp.enabled)throw new eR("Fiat on-ramp is not enabled");if(r&&r.provider&&"moonpay"!==r.provider)throw new eR("Unsupported fund provider. Currently supported option is `moonpay`.");{let{signedUrl:i,externalTransactionId:n}=await oT(t,e,r?.config??{},W.appearance.palette,W.fiatOnRamp.useSandbox);return{signedUrl:i,externalTransactionId:n}}},em=()=>{v(e=>{let r=t.connectors?.wallets.map(e=>({...e,linked:eh(e),loginOrLink:async()=>{if(!await e.isConnected())throw new eR("Wallet is not connected");if("embedded"===e.connectorType&&"privy"===e.walletClientType)throw new eR("Cannot link or login with embedded wallet");eu(e)},fund:async t=>{let{signedUrl:r,externalTransactionId:i}=await ep(e.address,t);$({fiatOnRampPrompt:{signedUrl:r},fiatOnRampStatus:{externalTransactionId:i}}),ei("FIAT_ON_RAMP_PROMPT_SCREEN")},unlink:async()=>{if(!u)throw new eR("User is not authenticated.");if("embedded"===e.connectorType&&"privy"===e.walletClientType)throw new eR("Cannot unlink an embedded wallet");g(await t.unlinkWallet(e.address))}}))||[];return K(er(r)),rq(e,r)?e:r})};(0,s.useEffect)(()=>{em()},[f?.linkedAccounts,u,d]),(0,s.useEffect)(()=>{if(d){if(!t.connectors)throw new eR("Connector not initialized");em(),t.connectors.on("walletsUpdated",em)}},[d]),(0,s.useEffect)(()=>{if(!y[0])return;let e=y[0],t=b.current.find(t=>t.address===e.address),r=f?.linkedAccounts.find(t=>"wallet"===t.type&&t.address===e.address);if(!t&&r){let e=Object.assign({},f);e.wallet=r&&{address:r.address,chainType:r.chainType,chainId:r.chainId,walletClient:r.walletClient,walletClientType:r.walletClientType,connectorType:r.connectorType},g(e)}b.current=y},[y]);let ef=async(t,r)=>{if(tZ(t))throw io(ee,"createWallet","onError","embedded_wallet_already_exists"),Error("Only one Privy wallet per user is currently allowed");let[i,n]=await Promise.all([eb.initializeWalletProxy(r),cq()]);if(!i&&e.config?.customAuth?.enabled)throw io(ee,"createWallet","onError","unknown_embedded_wallet_error"),Error("Failed to connect to wallet proxy");if(!i||!n||e.config?.embeddedWallets?.requireUserPasswordOnCreate)return new Promise((e,t)=>{Z(!0),$({createWallet:{onSuccess:t=>{io(ee,"createWallet","onSuccess",t),e(t)},onFailure:e=>{io(ee,"createWallet","onError","unknown_embedded_wallet_error"),t(e)},callAuthOnSuccessOnClose:!1}}),ei("EMBEDDED_WALLET_ON_ACCOUNT_CREATE_SCREEN")});{await i.create({accessToken:n});let e=tZ(await eb.refreshUser());if(!e)throw io(ee,"createWallet","onError","unknown_embedded_wallet_error"),Error("Failed to create wallet");return io(ee,"createWallet","onSuccess",e),e}},eg=e=>{if(!W.chains.map(e=>e.id).includes(e))throw new eM(`Chain ID ${e} is not supported. It must be added to the config.supportedChains property of the PrivyProvider.`,"unsupported_chain_id")},ew=(e,r,i)=>new Promise(async(a,o)=>{if(!u||!f){o(Error("User must be authenticated before signing with a Privy wallet"));return}let s=tZ(f);if(!s){o(Error("Must have a Privy wallet before signing"));return}Z(!0);let l=t.connectors?.findWalletConnector("embedded","privy")?.proxyProvider,c=e.chainId?Number(e.chainId):l.chainId;eg(c);let d=Object.assign({},e,{chainId:c}),h=async()=>{let e=await cq();if(!e||!F){o(Error("Must have valid access token and Privy wallet to send transaction"));return}try{if(!await eb.recoverEmbeddedWallet()){o(Error("Unable to connect to wallet"));return}let t=new n.c(t8(d.chainId,W.chains,W.rpcConfig)),r=await lB(s.address,d,t),i=await lH(e,s.address,F,r,t);a(i)}catch(e){o(e)}};W.embeddedWallets.noPromptOnSignature?(r&&console.warn("uiOptions defined with `noPromptOnSignature` set to true in app config"),h()):($({connectWallet:{onCompleteNavigateTo:"EMBEDDED_WALLET_SEND_TRANSACTION_SCREEN",onFailure:o},sendTransaction:{transactionRequest:d,onSuccess:a,onFailure:o,uiOptions:r||{},fundWalletConfig:i}}),ei("EMBEDDED_WALLET_CONNECTING_SCREEN"))});function ex(){return new Promise(async(e,t)=>{let r=await cq();if(!r||!F)throw Error("Must have valid access token to enroll in MFA");try{await F.verifyMfa({accessToken:r}),e()}catch(e){t(e)}})}let ey={ready:d,authenticated:u,user:f,walletConnectors:t.connectors||null,connectWallet:()=>{ei(u?"CONNECT_ONLY_AUTHENTICATED_SCREEN":"CONNECT_ONLY_LANDING_SCREEN")},linkWallet:ed,linkEmail:()=>{if(!u)throw new eR("User must be authenticated before linking an email address.");if(f?.email)throw new eR("User already has an email linked to their account.");x(!0),ei("LINK_EMAIL_SCREEN")},linkPhone:()=>{if(!u)throw new eR("User must be authenticated before linking a phone number.");if(f?.phone)throw new eR("User already has a phone number linked to their account.");x(!0),ei("LINK_PHONE_SCREEN")},linkGoogle:async()=>{if(!u)throw new eR("User must be authenticated before linking a Google account.");if(f?.google)throw new eR("User already has a Google account linked to their account.");await eb.initLoginWithOAuth("google")},linkTwitter:async()=>{if(!u)throw new eR("User must be authenticated before linking a Twitter account.");if(f?.twitter)throw new eR("User already has a Twitter account linked to their account.");await eb.initLoginWithOAuth("twitter")},linkDiscord:async()=>{if(!u)throw new eR("User must be authenticated before linking a Discord account.");if(f?.discord)throw new eR("User already has a Discord account linked to their account.");await eb.initLoginWithOAuth("discord")},linkGithub:async()=>{if(!u)throw new eR("User must be authenticated before linking a GitHub account.");if(f?.github)throw new eR("User already has a Github account linked to their account.");await eb.initLoginWithOAuth("github")},linkTiktok:async()=>{if(!u)throw new eR("User must be authenticated before linking a TikTok account.");if(f?.tiktok)throw new eR("User already has a Tiktok account linked to their account.");await eb.initLoginWithOAuth("tiktok")},linkLinkedIn:async()=>{if(!u)throw new eR("User must be authenticated before linking a LinkedIn account.");if(f?.linkedin)throw new eR("User already has a LinkedIn account linked to their account.");await eb.initLoginWithOAuth("linkedin")},linkApple:async()=>{if(!u)throw new eR("User must be authenticated before linking an Apple account.");await eb.initLoginWithOAuth("apple")},linkFarcaster:async()=>{if(!u)throw new eR("User must be authenticated before linking a Farcaster account.");await eb.initLoginWithFarcaster(),x(!0),ei("AWAITING_FARCASTER_CONNECTION")},login:async()=>{if(d||(await new Promise(e=>{H(()=>e)}),H(null)),u){console.warn("Attempted to log in, but user is already logged in. Use a `link` helper instead.");return}P(!0),en("LANDING")},logout:async()=>{await t.logout(),g(null),p(!1),E(null),io(ee,"logout","onSuccess"),x(!1),c(!1),tF.del(tb)},getAccessToken:()=>t.getAccessToken(),getEthereumProvider:()=>{if(!f||!f.wallet)return new rc;let e=y.find(e=>f.wallet&&e.address===f.wallet.address),r=t.connectors?.walletConnectors.find(t=>t.wallets.find(t=>t.address===e?.address));return e&&r?r.proxyProvider:new rc},getEthersProvider:()=>{if(!f||!f.wallet)return new a.Q(new ru(new rc));let e=y.find(e=>f.wallet&&e.address===f.wallet.address),r=t.connectors?.walletConnectors.find(t=>t.wallets.find(t=>t.address===e?.address));return new a.Q(new ru(e&&r?r.proxyProvider:new rc))},getWeb3jsProvider:()=>{if(!f||!f.wallet)return new rp(new rc);let e=y.find(e=>f.wallet&&e.address===f.wallet.address),r=t.connectors?.walletConnectors.find(t=>t.wallets.find(t=>t.address===e?.address));return new rp(e&&r?r.proxyProvider:new rc)},unlinkWallet:async e=>{let r=await t.unlinkWallet(e);return g(r),r},unlinkEmail:async e=>{let r=await t.unlinkEmail(e);return g(r),r},unlinkPhone:async e=>{let r=await t.unlinkPhone(e);return g(r),r},unlinkGoogle:async e=>{let r=await t.unlinkOAuth("google",e);return g(r),r},unlinkTwitter:async e=>{let r=await t.unlinkOAuth("twitter",e);return g(r),r},unlinkDiscord:async e=>{let r=await t.unlinkOAuth("discord",e);return g(r),r},unlinkGithub:async e=>{let r=await t.unlinkOAuth("github",e);return g(r),r},unlinkTiktok:async e=>{let r=await t.unlinkOAuth("tiktok",e);return g(r),r},unlinkLinkedIn:async e=>{let r=await t.unlinkOAuth("linkedin",e);return g(r),r},unlinkApple:async e=>{let r=await t.unlinkOAuth("apple",e);return g(r),r},unlinkFarcaster:async e=>{let r=await t.unlinkFarcaster(e);return g(r),r},setActiveWallet:async e=>{let t=y.find(t=>(0,i.Kn)(t.address)===(0,i.Kn)(e)),r=f?.linkedAccounts.find(t=>"wallet"===t.type&&i.Kn(t.address)===i.Kn(e));if(t&&await t.isConnected()){if(t.linked){let e=Object.assign({},f);e.wallet=r&&{address:r.address,chainType:r.chainType,chainId:r.chainId,walletClient:r.walletClient,walletClientType:r.walletClientType,connectorType:r.connectorType},g(e)}else t.loginOrLink()}else O(e),ed()},forkSession:()=>t.forkSession(),createWallet:async()=>{if(!u||!f)throw io(ee,"createWallet","onError","must_be_authenticated"),Error("User must be authenticated before creating a Privy wallet");return ef(f,15e3)},setWalletPassword:()=>new Promise(async(e,t)=>{if(!u||!f){t(Error("User must be authenticated before adding password to Privy wallet"));return}let r=tZ(f);if(!r||!F){t(Error("Must have a Privy wallet to add a password"));return}if("user-passcode"===r.recoveryMethod){t(Error("Cannot set password. Embedded wallet already has a password."));return}await ex(),Z(!0),$({setWalletPassword:{onSuccess:e,onFailure:t,callAuthOnSuccessOnClose:!1},connectWallet:{onCompleteNavigateTo:"EMBEDDED_WALLET_PASSWORD_UPDATE_SPLASH_SCREEN",onFailure:t}}),ei("EMBEDDED_WALLET_CONNECTING_SCREEN")}),signMessage:(e,r)=>new Promise(async(i,n)=>{if(!u||!f){n(Error("User must be authenticated before signing with a Privy wallet"));return}let a=tZ(f);if(!a){n(Error("Must have a Privy wallet before signing"));return}if("string"!=typeof e||e.length<1){n(Error("Message must be a non-empty string"));return}Z(!0);let o=async()=>{if(!u)throw Error("User must be authenticated before signing with a Privy wallet");let r=await cq();if(!F||!r||!await eb.recoverEmbeddedWallet())throw Error("Unable to connect to wallet");t.createAnalyticsEvent("embedded_wallet_sign_message_started",{walletAddress:a.address});let{response:i}=await F.rpc({accessToken:r,address:a.address,request:{method:"personal_sign",params:[e,a.address]}}),n=i.data;return t.createAnalyticsEvent("embedded_wallet_sign_message_completed",{walletAddress:a.address}),n};if(W.embeddedWallets.noPromptOnSignature){r&&console.warn("uiOptions defined with `noPromptOnSignature` set to true in app config");try{let e=await o();i(e)}catch(e){n(e??new ro("Unable to sign message"))}}else $({signMessage:{message:e,confirmAndSignMessage:o,onSuccess:e=>{i(e)},onFailure:e=>{n(e)},uiOptions:r||{}},connectWallet:{onCompleteNavigateTo:"EMBEDDED_WALLET_SIGN_REQUEST_SCREEN",onFailure:n}}),ei("EMBEDDED_WALLET_CONNECTING_SCREEN")}),sendTransaction:async(e,t,r)=>lQ(await (await ew(e,t,r)).wait()),exportWallet:()=>new Promise(async(r,i)=>{if(!u||!f){i(Error("User must be authenticated before exporting their Privy wallet"));return}let n=tZ(f);if(!n){i(Error("Must have a Privy wallet before exporting"));return}Z(!0);let a=await cq();if(!a||!F){i(Error("Must have valid access token to enroll in MFA"));return}if(!F){i(Error("Must have a Privy wallet before exporting"));return}try{try{await F.connect({accessToken:a,address:n.address}),await F.verifyMfa({accessToken:a})}catch(e){if(nR(e)&&"privy"===n.recoveryMethod)await F.recover({accessToken:a,address:n.address});else throw e}}catch(e){i(e);return}$({keyExport:{appId:e.appId,origin:t.apiUrl,onSuccess:r,onFailure:i},connectWallet:{onCompleteNavigateTo:"EMBEDDED_WALLET_KEY_EXPORT_SCREEN",onFailure:i}}),ei("EMBEDDED_WALLET_CONNECTING_SCREEN")}),promptMfa:ex,async init(e){let r;switch(e){case"sms":r=new cG("verify");break;case"totp":return;default:throw Error(`Unsupported MFA method: ${e}`)}t.startMfaFlow(r),await r.init()},async submit(e,t){switch(e){case"totp":case"sms":J.current?.resolve({mfaMethod:e,mfaCode:t}),await new Promise((e,t)=>{X.current={resolve:e,reject:t}});break;default:throw J.current?.reject(new eR("Unsupported MFA method")),new eR(`Unsupported MFA method: ${e}`)}},cancel(){J.current?.reject(new eR("MFA canceled"))},async initEnrollmentWithSms(e){let t=await cq();if(!t||!F)throw Error("Must have valid access token to enroll in MFA");await F.initEnrollMfa({method:"sms",accessToken:t,phoneNumber:e.phoneNumber})},enrollInMfa:e=>new Promise((t,r)=>{if(!e){eb.closePrivyModal(),t();return}W.mfa.noPromptOnMfaRequired&&console.warn("[Privy Warning] Triggering the 'showMfaEnrollmentModal' function when 'noPromptOnMfaRequired' is set to true is unexpected. If this is intentional, ensure that you are building custom UIs for MFA verification."),$({mfaEnrollmentFlow:{mfaMethods:W.mfa.methods,onSuccess:t,onFailure:r}}),ei("MFA_ENROLLMENT_FLOW_SCREEN")}),async initEnrollmentWithTotp(){let e=await cq();if(!e||!F)throw Error("Must have valid access token to enroll in MFA");let t=await F.initEnrollMfa({method:"totp",accessToken:e});return{secret:t.secret,authUrl:t.authUrl}},async submitEnrollmentWithSms(e){let r=await cq();if(!r||!F)throw Error("Must have valid access token to enroll in MFA");await F.submitEnrollMfa({method:"sms",accessToken:r,phoneNumber:e.phoneNumber,code:e.mfaCode}),g(await t.getAuthenticatedUser())},async submitEnrollmentWithTotp(e){let r=await cq();if(!r||!F)throw Error("Must have valid access token to enroll in MFA");await F.submitEnrollMfa({method:"totp",accessToken:r,code:e.mfaCode}),g(await t.getAuthenticatedUser())},async unenroll(e){let r=await cq();if(!r||!F)throw Error("Must have valid access token to remove MFA");await F.unenrollMfa({method:e,accessToken:r}),g(await t.getAuthenticatedUser())},loginWithCode:e=>eb.loginWithCode(e),initLoginWithEmail:e=>eb.initLoginWithEmail(e),initLoginWithSms:e=>eb.initLoginWithSms(e),isModalOpen:r};cY=ey.signMessage,cQ=async(...e)=>{let t=await ew(...e);return W.embeddedWallets.waitForTransactionConfirmation&&await t.wait(),t};let ev=!!e.config?.headless,eb={headless:ev,isNewUserThisSession:C,isLinking:w,linkingHint:I,pendingTransaction:null,walletConnectionStatus:S,mipdStore:A,connectors:t.connectors?.walletConnectors??[],rpcConfig:W.rpcConfig,chains:W.chains,showFiatPrices:"native-token"!==W.embeddedWallets.priceDisplay.primary,clientAnalyticsId:t.clientAnalyticsId,nativeTokenSymbolForChainId:e=>W.chains.find(t=>t.id===Number(e))?.nativeCurrency.symbol,initializeWalletProxy:async e=>{if(F)return F;let t=new Promise(e=>{q(()=>t=>e(t))}),r=new Promise(t=>setTimeout(()=>t(null),e)),i=await Promise.race([t,r]);return q(null),i},getAuthFlow:()=>t.authFlow,getAuthMeta:()=>t.authFlow?.meta,closePrivyModal:(r={shouldCallAuthOnSuccess:!0})=>{let i=d&&u&&f;r.shouldCallAuthOnSuccess&&i?(io(ee,"login","onComplete",f,C,!1,et.current??null),e.onSuccess?.(f,C)):_&&io(ee,"login","onError","exited_auth_flow"),O(null),P(!1),x(!1),j(!1),c(!1),setTimeout(()=>{t.authFlow=void 0},200),t.createAnalyticsEvent("modal_closed")},openPrivyModal:ei,connectWallet:es,initLoginWithWallet:async(e,t)=>{et.current="siwe",el(e,t)},loginWithWallet:async()=>{let e,r;if(!d)throw new eD;if(!(t.authFlow instanceof tM))throw new eR("Must initialize SIWE flow first.");if(u)e=await t.link();else try{({user:e,isNewUser:r}=await t.authenticate())}catch(e){throw io(ee,"login","onError",e.privyErrorCode||"generic_connect_wallet_error"),e}g(e||f||null),j(r||!1),p(!0)},initLoginWithFarcaster:async e=>{let r=new tu(e);t.startAuthFlow(r);try{et.current="farcaster",await r.initializeFarcasterConnect(),l.tq&&r.meta.connectUri&&window.open(r.meta.connectUri,"_blank","noopener noreferrer")}catch(e){throw io(ee,"login","onError",e.privyErrorCode||"unknown_auth_error"),e}},loginWithFarcaster:async()=>{let e,r;if(!d)throw new eD;if(!(t.authFlow instanceof tu))throw new eR("Must initialize Farcaster flow first.");if(u)e=await t.link();else try{({user:e,isNewUser:r}=await t.authenticate())}catch(e){throw io(ee,"login","onError",e.privyErrorCode||"generic_connect_wallet_error"),e}g(e||null),j(r||!1),p(!0)},initLoginWithOAuth:async(e,r)=>{if(!function(){try{let e="privy:__session_storage__test";return window.sessionStorage.setItem(e,"blobby"),window.sessionStorage.removeItem(e),!0}catch{return!1}}()){en("IN_APP_BROWSER_LOGIN_NOT_POSSIBLE");return}let i=new tL(e);r&&i.addCaptchaToken(r),t.startAuthFlow(i);let n=await t.authFlow.getAuthorizationUrl();n&&n.url&&window.location.assign(n.url)},loginWithOAuth:async e=>{let r,i;if(!(t.authFlow instanceof tL))throw new eR("Must initialize OAuth flow before calling loginWithOAuth");let n=tO.get(tC),a=t.authFlow.meta.stateCode;if(n!==a)throw t.createAnalyticsEvent("possible_phishing_attempt",{provider:e,storedStateCode:n??"",returnedStateCode:a??""}),new eR("Unexpected auth flow. This may be a phishing attempt.");if(u)r=await t.link();else try{({user:r,isNewUser:i}=await t.authenticate()),et.current=e}catch(e){throw io(ee,"login","onError",e.privyErrorCode||"unknown_auth_error"),e}g(r),j(i||!1),p(!0)},initLoginWithEmail:async(e,r)=>{let i=new td(e,r);t.startAuthFlow(i);try{et.current="email",await i.sendCodeEmail()}catch(e){throw io(ee,"login","onError",e.privyErrorCode||"unknown_auth_error"),e}},initLoginWithSms:async(e,r)=>{let i=new tW(e,r);t.startAuthFlow(i);try{et.current="sms",await i.sendSmsCode()}catch(e){throw io(ee,"login","onError",e.privyErrorCode||"unknown_auth_error"),e}},resendEmailCode:async()=>{await t.authFlow?.sendCodeEmail()},resendSmsCode:async()=>{await t.authFlow?.sendSmsCode()},loginWithCode:async e=>{let r,i;if(!d)throw new eD;if(t.authFlow instanceof td)t.authFlow.meta.emailCode=e.trim();else if(t.authFlow instanceof tW)t.authFlow.meta.smsCode=e.trim();else throw new eR("Must initialize a passwordless code flow first");u?r=await t.link():{user:r,isNewUser:i}=await t.authenticate(),g(r||f||null),j(i||!1),p(!0)},refreshUser:async()=>{let e=await t.getAuthenticatedUser();return g(e),e},walletProxy:F,createAnalyticsEvent:(e,r,i)=>t.createAnalyticsEvent(e,r,i),getUsdTokenPrice:e=>t.getUsdTokenPrice(e),recoverEmbeddedWallet:async()=>new Promise(async(e,r)=>{let i=f?.linkedAccounts.find(e=>"wallet"===e.type&&"privy"===e.walletClientType),n=await cq();if(!n||!F||!i){r(Error("Must have valid access token and Privy wallet to recover wallet"));return}Z(!0);try{await F.connect({accessToken:n,address:i.address}),e(!0)}catch(a){nR(a)&&"privy"===i.recoveryMethod?(t.createAnalyticsEvent("embedded_wallet_pinless_recovery_started",{walletAddress:i.address}),(await F.recover({address:i.address,accessToken:n})).address||r(Error("Unable to recover wallet")),t.createAnalyticsEvent("embedded_wallet_recovery_completed",{walletAddress:i.address}),e(!0)):nR(a)?($({recoverWallet:{privyWallet:i,onFailure:r,onSuccess:()=>e(!0)}}),ei("EMBEDDED_WALLET_RECOVERY_SCREEN")):r(a)}}),getFiatOnRampConfig:ep,setReadyToTrue:()=>{h(!0),B?.()},updateWallets:()=>em()};cJ=eb.recoverEmbeddedWallet;let eC=(0,s.useMemo)(()=>({wallets:y,ready:V}),[y,V]);return(0,m.jsx)(r9.Provider,{value:ey,children:(0,m.jsx)(ii.Provider,{value:ee,children:(0,m.jsx)(lX.Provider,{value:eC,children:(0,m.jsxs)(r4,{...W,children:[e.children,(0,m.jsxs)(r8.Provider,{value:eb,children:[!ev&&W.captchaEnabled&&(0,m.jsx)(r6,{delayedExecution:!0}),(0,m.jsx)(cv,{theme:{...W.appearance.palette||{}}}),(0,m.jsx)(rI,{appConfig:W,data:z,setModalData:$,setInitialScreen:E,initialScreen:k,authenticated:u,children:(0,m.jsx)(c_,{open:r})}),D&&L.id?(0,m.jsx)(cH,{appId:e.appId,clientAnalyticsId:t.clientAnalyticsId,origin:t.apiUrl,mfaMethods:f?.mfaMethods,mfaPromise:J,mfaSubmitPromise:X,onLoad:R,onLoadFailed:()=>null}):null]})]})})})})}}}]);