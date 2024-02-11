import json
def lambda_handler(event, context):
    response = {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello from get_today_activity_function",
        }),
        "headers": {
            "Content-Type": "application/json"
        }
    }
    return response
