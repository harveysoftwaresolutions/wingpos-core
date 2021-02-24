console.log("Application start");

userport = process.env.PORT;


var express = require("express"),
    http = require("http"),
    port = ,
    server = require("express")(),
    server = http.createServer(app),
    bodyParser = require("body-parser"),
    io = require("socket.io")(server),
    liveCart

console.log("Server UP");
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false}));

server.all("/*", function(req, res, next) {
    //CORS headers.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Access-Token,X-Key");
    if (req.method == "OPTIONS") {
        res.status(200).end();
    } else {
        next();
    }
});
server.get("/", function(req, res){
    res.send("Server Up");
});
// Inventory API
server.use("/api/inventory", require("./api/inventory"));
// Transactions API
server.use("/api/transactions", require("./api/transactions"));
// Authentication API.
server.use("/api/authentication", require("./api/authentication"));
// Employees API
server.use("/api/employee", require("./api/employee"));
// Finance API
server.use("/api/finance", require("./api/finance"));

// Websocket logic for Live Cart
io.on("connection", function(socket) {
    socket.on("cart-transaction-complete", function() {
        socket.broadcast.emit("update-live-cart-display", {});
    });

    //Show current cart on page load.
    socket.on("live-cart-page-loaded", function() {
        socket.emit("update-live-cart-display", liveCart);
    });

    //Update cart on client connect
    socket.emit("update-live-cart-display", liveCart);

    //Handle cart updates
    socket.on("update-live-cart", function(cartData) {
        liveCart = cartData;
    
    //Update all clients.
        socket.broadcast.emit("update-live-cart-display", liveCart);

    });
});