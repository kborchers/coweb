define(function(){var a=function(a){this._cometd=null,this._sessionid=a.sessionid,this._updaterType=a.updaterType};a.prototype.registered=function(a,b){this._cometd=b},a.prototype.unregistered=function(a,b){this._cometd=null},a.prototype.outgoing=function(a){var b=a.ext=a.ext||{},c=a.ext.coweb=a.ext.coweb||{};c.sessionid=this._sessionid,c.updaterType=this._updaterType;return a};return a})