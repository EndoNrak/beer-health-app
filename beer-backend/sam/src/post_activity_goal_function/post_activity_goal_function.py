import json
import boto3
import uuid
import time
import os
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME']
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        user_id = event['pathParameters']['user_id']

        # Extracting category and value from the request body
        try:
            request_body = json.loads(event['body'])
            category = request_body['category']
            target_value = request_body['targetValue']
        except KeyError as e:
            return {
                'statusCode': 400,
                'body': json.dumps(f'Bad Request: Missing required field - {e.args[0]}'),
            }

        goal_id = str(uuid.uuid4())  # Generate a new UUID
        created_at = int(time.time())  # Current timestamp in seconds

        response = table.put_item(
            Item={
                'GoalId': goal_id,
                'UserId': user_id,
                'Category': category,
                'TargetValue': target_value,
                'CreatedAt': created_at,
                'Status': 'unachieved'
                # Add other attributes as needed
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps('successfully posted goal')
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error inserting data: {str(e)}')
        }
