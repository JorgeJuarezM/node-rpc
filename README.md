node-rpc
========

Simple ExpresJS middleware for RPC over Http.


let's say we would like to provide add & multiply functions to browser over RPC

```javascript
    var remoteObj = {
        add: function(a,b, callback){
            // access expressjs session like this...
            //var session = this.request.session;
            callback(null,1*a+1*b);
        },
        multiply: function(a,b, callback){
            callback(null,1*a*b);
        }
    };
```

Create RPC middlware & configure in your ExpressJs application.

```javascript
    var rpcMiddleware = require('rpc-middleware.js');
    app.use('/rpc', rpcMiddleware('/helper.js', 'APIClient', remoteObj).middleware);
```

Include helper script in html file ( here /rpc/helper.js file is auto generated by node-rpc)

```javascript
    <script  src="/rpc/helper.js" type="text/javascript"></script>
```

Call the add or multiply functions as needed.
```javascript
    <script type="text/javascript">
        var rpc = new APIClient('/rpc');
        rpc.add(10,20, function(err, data){
            console.log('::'+data);
        });
    </script>
```

Note 1: All functions exposed in server needs to be async & last parameter should be a callback(err, result)




