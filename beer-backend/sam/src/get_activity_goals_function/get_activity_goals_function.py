import json
import os
from decimal import Decimal
import boto3
from botocore.exceptions import ClientError

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME']
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        user_id = event['pathParameters']['user_id']

        response = table.query(
            IndexName='UserGSI',
            KeyConditionExpression='UserId = :user_id',
            ExpressionAttributeValues={
                ':user_id': user_id
            },
            ProjectionExpression='GoalId, Category, TargetValue, CreatedAt'
        )

        goals = response.get('Items', [])
        return {
            'statusCode': 200,
            'body': json.dumps(goals, cls=DecimalEncoder)
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error retrieving user goals: {str(e)}')
        }
