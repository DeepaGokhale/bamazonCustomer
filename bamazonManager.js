var config = require("./dbConnection");
var mysql = require("mysql");
var inquirer = require("inquirer");
var Product = require("./products");


whatDoYouWantToDo();

function whatDoYouWantToDo(){
    //ask the customer what they want to purchase
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "choice"
        }
    ]).then(function(response){
        if (response.choice == "View Products for Sale")
        {
            //function to do this
            var strFilter = " Where stock_quantity > 0"
            getDataProducts(strFilter, true);
        }
        if (response.choice == "View Low Inventory")
        {
            //function to do this
            var strFilter = " Where stock_quantity < 5"
            getDataProducts(strFilter, true);
        }
        //for the last two choiices you need more data 
        if (response.choice == "Add to Inventory")
        {
            //function to do this
            var strFilter = " Where stock_quantity < 5"
            getDataProducts(strFilter, true);
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter itemID for the item you want to add to inventory",
                    name: "itemID"
                },
                {
                    type: "input",
                    message: "How many items(quantity) you want to add?",
                    name: "quantity"
                }
            ]).then(function(res){
                //update the qty for given itemID
                var strFilter = "Update Products set stock_quantity = stock_quantity + " + res.quantity + " Where item_id = " + res.itemID
                getDataProducts(strFilter, false);
            });
        }
        if (response.choice == "Add New Product")
        {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter name of the Product",
                    name: "name"
                },
                {
                    type: "input",
                    message: "Enter name of the department for the Product",
                    name: "department"
                },
                {
                    type: "input",
                    message: "Enter price of the Product",
                    name: "price"
                },
                {
                    type: "input",
                    message: "How much quantity you want to add for this product?",
                    name: "quantity"
                }
            ]).then(function(res){
                //update the qty for given itemID
                var strFilter = "Insert into Products (product_name, department_name, price, stock_quantity) VALUES ( '" + res.name + "','" +  res.department + "'," + res.price + "," + res.quantity + ")";
                console.log(strFilter);
                getDataProducts(strFilter, false);
            });
        }
    });
}

function getDataProducts(strFilter , isSelect)
{
    var connection = mysql.createConnection(config);
    var data = [];
    //for the select querries 
    if (isSelect)
    {
        var strQry = "SELECT * FROM products " + strFilter;
        console.log(strQry);
        connection.query(strQry, function(err, res) {
            if (err) throw err;
            res.forEach(item => {
                    var myProduct = new Product(item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity);
                    data.push(myProduct);                          
                }); 
            //product data can be displayed here for low inventory or avail products 
            displayProductData(data);   
            connection.end();            
        });
    }
    else //UpdateQry
    {
        //Update or insert qry
        connection.query(strFilter, function(err, res) {
            if (err) throw err;
            console.log("The data is updated!");
        });
        connection.end();
    }
 }

function displayProductData(prodArr)
{
    prodArr.forEach(item => {
        console.log(`
        ============================ ItemID: ${item.itemID} ============================
        Product: ${item.name}
        Price: ${item.price}
        Quantity: ${item.quantity}
        `)        
    });    
}