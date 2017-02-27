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
    };

    utils.toQuery = function(q){
        var key,
            params = [];
        for(key in q){
            params.push(key+'='+q[key]);
        }
        return params.join('&');
    };

    utils.verifyQuery = function(url,query){
        var result = {},
            parameter = null;
        for(parameter in query){
            if(!(new RegExp('[?|&]'+parameter+'=')).test(url)){
                result[parameter] = query[parameter];
            }
        }
        return result;
    };

    utils.validateHTTPStatus = function(code){
        var result = false;
        code = parseInt(code);
        /*
        200 OK
        201 Created
        202 Accepted
        203 Non-Authoritative Information (since HTTP/1.1)
        204 No Content
        205 Reset Content
        206 Partial Content
        207 Multi-Status (WebDAV; RFC 4918)
        208 Already Reported (WebDAV; RFC 5842)
        226 IM Used (RFC 3229)
         */
        if(code >= 200 && code <230){
            result = true;
        }
        return result;
    };

    xhr = function(method, url, data, query, headers){
        var methods = {
                success: function(){},
                error: function(){},
                always: function(){}
            },
            request = null,
            callbacks = {},
            protocol = (window.location.protocol === 'file:') ? 'https:' : window.location.protocol,
            supportHeaders = false;

        if(method === 'GET'){
            query = utils.verifyQuery(url,query);
        }

        if(window.XDomainRequest){
            request = new XDomainRequest();
            request.onprogress = function(){ };
            request.ontimeout = function(){ };
        }else if(window.XMLHttpRequest){
            request = new XMLHttpRequest();
            supportHeaders = true;
        }else if(window.ActiveXObject){
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }

        if(request){
            if(query) url += ((url.indexOf('?') > -1) ? '&' : '?') + utils.toQuery(query);
            request.open(method, (url.indexOf('http') > -1) ? url : protocol+url, true);
            request.onload = function(){
                if(utils.validateHTTPStatus(request.status) || request.statusText === 'OK' || typeof request.statusText === 'undefined'){
                    methods.success.apply(request, utils.parse(request));
                } else {
                    methods.error.apply(request, utils.parse(request));
                }
                methods.always.apply(request, []);
            };
            request.onerror = function(e){
                methods.error.apply(request, [e]);
                methods.always.apply(request, []);
            };
            if(headers && supportHeaders){
                for(var header in headers){
                    request.setRequestHeader(header, headers[header]);
                }
            }
            if(method === 'POST'){
                if(supportHeaders){
                    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                }
                if(typeof data !== 'string'){
                  data = utils.toQuery(data);
                }
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
    };

    /*jshint -W069 */
    exports['get'] = function (url, query, headers) {
        return xhr('GET', url, {}, query, headers);
    };

    exports['put'] = function (url, data, query, headers) {
        return xhr('PUT', url, data, query, headers);
    };

    exports['post'] = function (url, data, query, headers) {
        return xhr('POST', url, data, query, headers);
    };
    /*jshint +W069 */

    exports['delete'] = function (url, query, headers) {
        return xhr('DELETE', url, {}, query, headers);
    };

    return exports;
});
