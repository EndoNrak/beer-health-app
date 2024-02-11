def lambda_handler(event: dict, context):
    response = {
        "statusCode": 200,
        "body": "hello from post_start_beer_server_function"
    }
    return response
