--drop db if exists to start clean
DROP DATABASE IF EXISTS bamazon;
-- create DB
CREATE DATABASE bamazon;
-- all the scripts run for the following db 
USE bamazon;
--create the first table for getting the list of products
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255),
  department_name VARCHAR(255),
  price decimal(10,2),
  stock_quantity int,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(255),
  over_head_costs decimal(10,2)
  PRIMARY KEY (department_id)
);

-- Insert mock data for departments
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('electronics', 1000.00),
('sports & fitness', 750.00),
('home & garden', 500.00),
('home & kitchen', 300.00),
('electronics', 100.00),
('cell phone & accessories', 300.00),
('art supplies',68.00)


--insert some mock data - using just one time to insert all
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Anker blue tooth speaker', 'electronics', 49.99, 5),
('Chinese lanterns', 'home & garden', 14.99, 15),
('Medium density Foam Roller', 'sports & fitness', 16.99, 2),
('Resistance Band Set', 'sports & fitness', 30.99, 6),
('Netgear Orbi Wi-Fi System RBK43', 'electronics', 49.99, 5),
('Wusthof Classic 7-piece Slim Knife Block Set', 'home & kitchen', 49.99, 5),
('JEYPOD IMDEN Remote Control Car', 'toys & games', 24.99, 15),
('Biulotter 20Pcs Kids Beach Sand Toys Set', 'toys & games', 12.99, 6),
('Hand-Crafted Ultrasonic Essential Oil Diffuser', 'home & garden', 45.25, 3),
('USB Type C Cable,4 Pack', 'cell phone & accessories', 12.69, 8),
('ARTEZA Kids Premium Watercolor Paint Set', 'art supplies', 8.18, 12)
-- test to see if the data was inserted
select * from products
