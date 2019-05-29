var config = require("./dbConnection");
var mysql = require("mysql");
var inquirer = require("inquirer");

whatDoYouWantToDo();

function whatDoYouWantToDo(){
    //ask the customer what they want to purchase
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "choice"
        }
    ]).then(function(response){
        if (response.choice == "Create New Department")
        {
            //ask more questions to get the data for new department
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter the name of the new department",
                    name: "name"
                },
                {
                    type: "input",
                    message: "What is the overhead cost?",
                    name: "cost"
                }
            ]).then(function(res){
                //build qry to add new department
                var qry = "Insert into departments (department_name, over_head_costs) Values ('" + res.name +  "' , " + res.cost + ")";
                getData(qry, false);
            })
        }

        if (response.choice == "View Product Sales by Department")
        {
            var qry = "Select d.department_id as id, CONCAT(d.department_name , Space(24 - LENGTH(d.department_name))) as name, d.over_head_costs as costs, Sum(p.product_sales) as sales, (sum(p.product_sales) - d.over_head_costs) as profit ";
            qry = qry + " from departments d inner join products p ";
            qry = qry + " on d.department_name = p.department_name"
            qry = qry + " Group by d.department_id, d.department_name, d.over_head_costs";
            qry = qry + " order by department_id";
            getData(qry, true);
        }
    });
}

    
function getData(strQry , isSelect)
{
    var connection = mysql.createConnection(config);
    var data = [];
    //for the select querries 
    if (isSelect)
    {
        connection.query(strQry, function(err, res) {
            if (err) throw err;
            //set the header
            console.log( "| department_id | department_name          | over_head_costs | product_sales | total_profit |");
            console.log( "| ------------- | ------------------------ | --------------- | ------------- | ------------ |");            
            res.forEach(item => {
                    console.log("| " + item.id + "             | " + item.name + " | " + item.costs + "             | " + parseFloat(item.sales).toFixed(2) + "      | " + parseFloat(item.profit).toFixed(2) + "     | " );
                });    
            connection.end();            
        });
    }
    else //UpdateQry
    {
        //Update or insert qry
        connection.query(strQry, function(err, res) {
            if (err) throw err;
            console.log("The data is updated!");
        });
        connection.end();
    }
 }