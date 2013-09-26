set PORT=3434

node .\nodemon.js --delay 1 --watch app.js --watch .\..\rpc-middleware.js app.js

pause