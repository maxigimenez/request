(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.request = factory(root);
    }
})(this, function (root) {

    'use strict';
    
    var exports = {},
        utils = {},
        xhr;

    utils.parse = function(req){
        var result;
        try {
            result = JSON.parse(req.responseText);
        } catch (e) {
            result = req.responseText;
        }
        return [result, req];
    }

    utils.toQuery = function(q){
        var key,
            params = [];
        for(key in q){
            params.push(key+'='+q[key]);
        }
        return params.join('&');
    }

    xhr = function(method, url, data, query){
        var methods = {
                success: function(){},
                error: function(){},
                always: function(){}
            },
            request = null,
            callbacks = {};

        if(window.XDomainRequest){
            request = new XDomainRequest();
        }else if(window.ActiveXObject){
            request = new ActiveXObject('Microsoft.XMLHTTP'); 
        }else if(window.XMLHttpRequest){
            request = new XMLHttpRequest();
        }

        if(request){
            if(query) url += '?' + utils.toQuery(query);
            request.open(method, url, true);
            request.onload = function(){
                methods.success.apply(methods, utils.parse(request));
                methods.always.apply();
            };
            request.onerror = function(){
                methods.error.apply(methods, utils.parse(request));
                methods.always.apply();
            };
            if(method === 'POST'){
                request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                data = utils.toQuery(data);
            }
            if(method === 'GET'){
                data = null;
            }
            setTimeout(function(){
                request.send(data);
            },0);
        }

        callbacks = {
            success: function(callback){
                methods.success = callback;
                return callbacks;
            },
            error: function(callback){
                methods.error = callback;
                return callbacks;
            },
            always: function(callback){
                methods.always = callback;
                return callbacks;
            }
        };

        return callbacks;
    }

    exports['get'] = function (url, query) {
        return xhr('GET', url, {}, query);
    };

    exports['put'] = function (url, data, query) {
        return xhr('PUT', url, data, query);
    };

    exports['post'] = function (url, data, query) {
        return xhr('POST', url, data, query);
    };

    exports['delete'] = function (url, query) {
        return xhr('DELETE', url, {}, query);
    };

    return exports;
});