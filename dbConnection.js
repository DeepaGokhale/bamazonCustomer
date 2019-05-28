var mysql = require("mysql");

var Connection = function(qry){
    mysql.createConnection({
      host: "localhost",
    
      // Your port; if not 3306
      port: 3306,
    
      // Your username
      user: "root",
    
      // Your password
      password: "root1234",
      database: "bamazon"
  });
}
  module.exports = Connection;

