var Product = function(itemID, name, department, price, quantity)
{
    this.itemID = itemID;
    this.name = name;
    this.department = department;
    this.price = price;
    this.quantity = quantity;    
}

module.exports = Product;