
module.exports = function(helperUrl, rpcClientClassName, remoteObj){

    var express = require('express');
    var rpcRouter = new express.Router();

    rpcRouter.get('/test', function(req, res){ res.send(200, "test successful..."); });

    rpcRouter.get(helperUrl, function(req, res){

        function action(url, dataAndCallbackArguments){
            var args=[];
            for(var i=0;i<(dataAndCallbackArguments.length-1);i++){
                args.push(dataAndCallbackArguments[i]);
            }
            var callback = dataAndCallbackArguments[dataAndCallbackArguments.length-1];

            $.ajax({
                type: 'post',
                url: url,
                data: {args:args}
            }).done(function(data) {
                    if (callback) callback(null, data);
                }).fail(function() {
                    console.log("error");
                    if (callback) callback('error');
                });
        }

        var jsContent = ''+action;

        var rpcClassDec = "var {{RPCClientClassName}} = function(endPointPrefix){ this.endPointPrefix = endPointPrefix; };";
        rpcClassDec = rpcClassDec.replace('{{RPCClientClassName}}', rpcClientClassName);
        jsContent += "\n"+rpcClassDec+"\n";

        for(method in remoteObj){
            if (typeof(remoteObj[method])==='function'){
                var nargs = remoteObj[method].length;
                var funcDef = "{{RPCClientClassName}}.prototype.{{METHOD}} = function(){ action(this.endPointPrefix+'/{{METHOD}}', arguments); };";
                funcDef = funcDef.replace('{{RPCClientClassName}}', rpcClientClassName);
                funcDef = funcDef.replace('{{METHOD}}', method);
                funcDef = funcDef.replace('{{METHOD}}', method);
                jsContent += "\n"+funcDef+"\n";
            }
        }
        res.end(jsContent);
    });


    rpcRouter.post('/:method', function(req, res){
        var method = req.params.method;
        var args = req.body.args;

        if (remoteObj.hasOwnProperty(method) && typeof(remoteObj[method])==='function'){
            var fn = remoteObj[method];
            args.push(function(error,result){
                res.set('Content-Type', 'application/json');
                res.send(200, JSON.stringify(result));
            });
            fn.apply(null, args);
        }else{
            res.send(500);
        }

    });


    return rpcRouter;

};