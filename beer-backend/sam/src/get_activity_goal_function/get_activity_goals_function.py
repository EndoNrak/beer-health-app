import json
import boto3
import os
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME']
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    try:
        goal_id = event['pathParameters']['goal_id']
        response = table.get_item(
            Key={
                'GoalId': goal_id
            }
        )

        goal = response.get('Item', None)
        if goal:
            return {
                'statusCode': 200,
                'body': json.dumps(goal)
            }
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': f'Goal with id {goal_id} not found'})
            }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error retrieving goal: {str(e)}')
        }
