# AWS-shop-be

## API

//
[AWS-shop-BE-WP](https://46uhhn9ob6.execute-api.eu-west-1.amazonaws.com/dev/products)
[AWS-shop-BE-without WP](https://532hjluq2m.execute-api.eu-west-1.amazonaws.com/dev/products)
[AWS-shop-FE](https://d1zdbonze7xn8z.cloudfront.net)

## Repositori

//
[GitHub repositories AWS-shop-FE](https://github.com/battiw/AWS-shop-fe)

## Usage

-
-     To get one product, you must specify the product id in the requested URL
-     (https://7qmhjcyh44.execute-api.eu-west-1.amazonaws.com/dev/products/{productId})

Product diagram

             products:
                      id -  uuid (primary key)
                      title - text, not null
                      description - text
                      price - integer

             stocks:
                      product_id - uuid (foreign key from products.id)
                      count - integer (There are no more products than this count in stock)

=======

## Script SQL

//

create database dbshoptest;

create table products(
id uuid primary key default uuid_generate_v4(),
title text,
description text,
price integer
)

create table stocks(
product_id uuid,
count integer,
foreign key ("product_id") references "products" ("id")
)

?\delete table
drop table products;
drop table stocks;

insert into products ( title, description, price) values
( 'Voucher 001 - Czech Republic', 'Czech Republic', 350 ),
( 'Voucher 001 - Mexico', 'Mexico', 1680),
( 'Voucher 001 - United Arab Emirates', 'United Arab Emirates', 1490),
( 'Voucher 001 - United States', 'United States', 1900),
( 'Voucher 005 - Montenegro', 'Montenegro', 270)

insert into stocks (product_id, count) values
( '55be13c5-7647-4b58-9d6d-1918b0fda4f2', 12 ),
( 'f4eba480-ddba-4b6b-9182-b75aa7ed0dea', 9 ),
( 'cfe5a167-2ab7-49cf-95ee-e2983404a249', 19 ),
( 'c17b0114-4c91-4d96-bcfd-120826894f5c', 3 ),
( 'b6794a49-134a-4919-8893-dcee22117338', 27 )

create extension if not exists "uuid-ossp";
