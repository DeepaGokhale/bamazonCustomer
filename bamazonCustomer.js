//var Connection = require("./dbConnection");
var mysql = require("mysql");
var inquirer = require("inquirer");
var Product = require("./products");

const config = {
  host: "localhost",
  
  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root1234",
  database: "bamazon"
}

var results = [];
var selectedItem = [];

// var connection = function(qry){
//     mysql.createConnection({
//       host: "localhost",
    
//       // Your port; if not 3306
//       port: 3306,
    
//       // Your username
//       user: "root",
    
//       // Your password
//       password: "root1234",
//       database: "bamazon"
//   });
// }

//show the products
getProductsForSale();
//sale prompt

function SellProducts(){
    //ask the customer what they want to purchase
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ItemID of the product you want to purchase?",
            name: "itemID"
        },
        {
            type: "input",
            message: "How many do you want to purchase?",
            name: "quantity"
        }
    ]).then(function(response){
        if (response.itemID != "" && parseInt(response.quantity) > 0)
        {            
            console.log("item: " + response.itemID + " qty: " +  response.quantity);
            var sellYN = canWeSell(response.itemID, response.quantity);
            if(sellYN)
            {
                var strQry = "Update Products Set stock_quantity = " + selectedItem[0].quantity + " Where item_id = " + selectedItem[0].itemID;
                //console.log(strQry);
                var totalCost = parseFloat(selectedItem[0].price) * parseInt(response.quantity);              
                console.log("Total cost of your purchase: " + totalCost);
                getDataProducts(strQry, selectedItem[0].quantity);
            }
            else
            {
                console.log("sorry! That quantity is not available!");
            }
        }        
        else
        {
            console.log("Something went wrong! That was incoorect ItemID or the quantity")
            //ask the customer again what they want to purchase - second chance!
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the ItemID of the product you want to purchase?",
                    name: "itemID"
                },
                {
                    type: "input",
                    message: "How many do you want to purchase?",
                    name: "quantity"
                }
            ]).then(function(response){
                if (response.itemID != "" && parseInt(response.quantity) > 0)
                {
                    var sellYN = canWeSell(response.itemID, response.quantity);
                    if(sellYN)
                    {
                        console.log("the qty is good");
                        var strQry = "Update Products Set stock_quantity = " + selectedItem[0].quantity + " Where item_id = " + selectedItem[0].itemID;
                        var totalCost = parseFloat(selectedItem[0].price) * parseInt(response.quantity);              
                        console.log("Total cost of your purchase: " + totalCost);
                        getDataProducts(selectedItem[0].itemID, selectedItem[0].quantity);          
                    }
                }
                else
                {
                    console.log("Something went wrong! That was incoorect ItemID or the quantity. Try again!")
                }
            });
        }
    });
}

// check if the desired qty available  
function canWeSell(itemId, qty){
    for(var i=0; i < results.length; i++)
    {
        //console.log("checking the qty");
        if(results[i].itemID == itemId)
        {
            var availableQty = results[i].quantity;
            if (availableQty > qty)
            {
                selectedItem.push(results[i]);
                selectedItem[0].quantity = availableQty - qty;
                return true;
            }
            else
            {
                return false;
            }
        }
    }
} 

function getProductsForSale()
{
    var productArr = [];    
    var strQry = "SELECT * FROM products where stock_quantity > 0";
    getDataProducts(strQry, 0);  
}

function getDataSales(itemID, quantity)
{
    //insert into sales table
    // var connection = mysql.createConnection(config);
    // var data = [];
        
    // if(quantity == 0)
    // {
    //     connection.query(strQry, function(err, res) {
    //         if (err) throw err;
    //         res.forEach(item => {
    //                 var myProduct = new Product(item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity);
    //                 data.push(myProduct);                          
    //             }); 
    //         displayProductData(data);   
    //         connection.end();            
    //     });
    // }
    // else
    // {            
    //     //Update the qty - the sale went through
    //     connection.query(strQry, function(err, res) {
    //         if (err) throw err;
    //         Console.log("The sale went through! Updated the inventory!");
    //     });
    // }
 }


function getDataProducts(strQry, quantity)
{
    var connection = mysql.createConnection(config);
    //var strQry = "SELECT * FROM products where stock_quantity > 0";
    var data = [];
        
    if(quantity == 0)
    {
        connection.query(strQry, function(err, res) {
            if (err) throw err;
            res.forEach(item => {
                    var myProduct = new Product(item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity);
                    data.push(myProduct);                          
                }); 
            displayProductData(data);   
            connection.end();            
        });
    }
    else
    {            
        //Update the qty - the sale went through
        connection.query(strQry, function(err, res) {
            if (err) throw err;
            console.log("The sale went through! Updated the inventory!");
        });
        connection.end();
    }
 }

function displayProductData(prodArr)
{
    prodArr.forEach(item => {
        console.log(`
        ============ ItemID: ${item.itemID} ============
        Product: ${item.name},
        Price: ${item.price}
        `)        
        results.push(item);
    });    
    SellProducts(); 
}

