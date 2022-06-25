# AWS-shop-be

## API

//
[AWS-shop-BE-WP](https://07yjzeof27.execute-api.eu-west-1.amazonaws.com/dev/products/)
[AWS-shop-BE-without WP](https://7qmhjcyh44.execute-api.eu-west-1.amazonaws.com/dev/products/)
[AWS-shop-FE](https://d1zdbonze7xn8z.cloudfront.net)

## Repositori

//
[GitHub repositories AWS-shop-FE](https://github.com/battiw/AWS-shop-fe)

## Usage

    To get one product, you must specify the product id in the requested URL
    (https://7qmhjcyh44.execute-api.eu-west-1.amazonaws.com/dev/products/{productId})

Product diagram

             products:
                      id -  uuid (primary key)
                      title - text, not null
                      description - text
                      price - integer

             stocks:
                      product_id - uuid (foreign key from products.id)
                      count - integer (There are no more products than this count in stock)
