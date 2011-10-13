define(["coweb/session/bayeux/SessionBridge","coweb/util/Promise","coweb/util/xhr","coweb/util/lang"],function(a,b,c,d){var e=function(){this._prepParams=null,this._lastPrep=null,this._debug=!1,this._bridge=null,this._listener=null,this._destroying=!1,this._unloadToks={},this._loginUrl=null,this._logoutUrl=null,this._cacheState=!1},f=e.prototype;f.init=function(b,c){this._loginUrl=b.loginUrl,this._logoutUrl=b.logoutUrl,this._debug=b.debug,this._cacheState=b.cacheState,this._listener=c,this._bridge=new a({debug:this._debug,listener:this._listener,adminUrl:b.adminUrl,baseUrl:b.baseUrl});var d=this,e=function(){d.destroy()};this._unloader=e,window.addEventListener?(window.addEventListener("beforeunload",e,!0),window.addEventListener("unload",e,!0)):window.attachEvent&&(window.attachEvent("onbeforeunload",e),window.attachEvent("onunload",e))},f.destroy=function(){this._destroying||(this._destroying=!0,this.onStatusChange=function(){},this._listener.stop(),this._bridge.destroy(),this._listener=null,this._prepParams=null,this._lastPrep=null,this._bridge=null,window.removeEventListener?(window.removeEventListener("beforeunload",this._unloader,!0),window.removeEventListener("unload",this._unloader,!0)):(window.detachEvent("onbeforeunload",this._unloader),window.detachEvent("onunload",this._unloader)),this._unloader=null)},f.isDebug=function(){return this._debug},f.getLastPrepare=function(){return this._lastPrep},f.leave=function(){var a=this._bridge.getState();a!==this._bridge.UPDATED&&this.onStatusChange("aborting"),this._prepParams=null,this._listener.stop();var c=new b;c.resolve(),this._bridge.disconnect();return c},f.login=function(a,d){if(this._bridge.getState()!==this._bridge.IDLE)throw new Error("login() not valid in current state");var e=new b,f={method:"POST",url:this._loginUrl,body:JSON.stringify({username:a,password:d}),headers:{"Content-Type":"application/json;charset=UTF-8"}};return c.send(f)},f.logout=function(){this.leave();var a=new b,d={method:"GET",url:this._logoutUrl};return c.send(d)},f.prepare=function(a){if(this._bridge.getState()!==this._bridge.IDLE)throw new Error("prepare() not valid in current state");a=a||{};var c=decodeURI(window.location.host+window.location.pathname+window.location.search),e={},f=!1,g="",h=window.location.search.substring(1),i=h.split("&");for(var j=0,k=i.length;j<k;j++){var l=i[j].split("=");e[decodeURIComponent(l[0])]=decodeURIComponent(l[1])}a.collab===undefined&&(a.collab=!0);if(a.key===undefined)if(e.cowebkey!==undefined)a.key=e.cowebkey;else{var m=this._cowebkeyFromHash();m?a.key=m:(a.key=c,f=!0)}e.sessionName!=undefined&&(g=e.sessionName),a.autoJoin===undefined&&(a.autoJoin=!0),a.autoUpdate===undefined&&(a.autoUpdate=!0),a.updaterType===undefined&&(a.updaterType="default"),this._prepParams=d.clone(a),this._prepParams.promise=new b,this._lastPrep=d.clone(a),this._bridge.prepare(a.key,a.collab,this._cacheState,f,c,g).then("_onPrepared","_onPrepareError",this),this._bridge.disconnectPromise.then("_onDisconnected",null,this),this.onStatusChange("preparing");return this._prepParams.promise},f._cowebkeyFromHash=function(){var a=window.location.hash;if(!a||a.indexOf("cowebkey")==-1)return null;var b=a.split("/");if(!b||b.length==0)return null;for(var c=0;c<b.length;c++)if(b[c]=="cowebkey")return c+1<b.length?b[c+1]:null;return null},f._onPrepared=function(a){this._prepParams.response=JSON.parse(JSON.stringify(a));var b=this._prepParams.response.generatedcowebkey;if(b){var c="/cowebkey/"+b;c=window.location.hash?window.location.hash+c:"#"+c,window.location.hash=c}this._prepParams.response.phase="prepare";if(this._prepParams.autoJoin)this.join({updaterType:this._prepParams.updaterType});else{var d=this._prepParams.promise;this._prepParams.promise=null,d.resolve(this._prepParams.response)}},f._onPrepareError=function(a){this.onStatusChange(a.message);var b=this._prepParams.promise;this._prepParams=null,b.fail(a)},f.join=function(a){if(this._bridge.getState()!==this._bridge.PREPARED)throw new Error("join() not valid in current state");a=a||{},this.onStatusChange("joining"),this._prepParams.response.phase="join",this._prepParams.promise||(this._prepParams.promise=new b),a.updaterType===undefined&&(a.updaterType="default"),this._bridge.join(a.updaterType).then("_onJoined","_onJoinError",this);return this._prepParams.promise},f._onJoined=function(){if(this._prepParams.autoUpdate)this.update();else{var a=this._prepParams.promise;this._prepParams.promise=null,a.resolve(this._prepParams.response)}},f._onJoinError=function(a){var b=this._prepParams.promise;this._prepParams=null,b.fail(a)},f.update=function(a){if(this._bridge.getState()!==this._bridge.JOINED)throw new Error("update() not valid in current state");this.onStatusChange("updating"),this._prepParams.response.phase="update",this._prepParams.promise||(this._prepParams.promise=new b),this._bridge.update().then("_onUpdated","_onUpdateError",this);return this._prepParams.promise},f._onUpdated=function(){var a=this._prepParams;this._prepParams=null;var b=a.promise,c=a.response;b.resolve(c),this.onStatusChange("ready")},f._onUpdateError=function(a){var b=this._prepParams.promise;this._prepParams=null,b.fail(a)},f._onDisconnected=function(a){var b=a.state,c=a.tag;c&&!this._destroying&&this.onStatusChange(c),this._listener.stop(!0),this._prepParams&&!this._prepParams.promise&&(this._prepParams=null)},f.onStatusChange=function(a){};return e})