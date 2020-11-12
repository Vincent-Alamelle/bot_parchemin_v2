const mysql = require('mysql');

exports.dbConnection = function () {

    let con = mysql.createConnection({
        host: "mysql-xylophone.alwaysdata.net",
        user: "xylophone",
        password: "Lepetitporo666",
        database: "xylophone_scroll_db"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    return con;
};