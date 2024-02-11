import json
import os
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # S3 bucket name
    s3_bucket_name = os.environ['S3_BUCKET_NAME']

    # S3 key for instructors.json
    s3_key = 'instructors/instructors.json'

    # Initialize S3 client
    s3_client = boto3.client('s3')

    try:
        # Get the content of instructors.json from S3
        response = s3_client.get_object(Bucket=s3_bucket_name, Key=s3_key)
        instructors_json = response['Body'].read().decode('utf-8')

        # Parse JSON content
        instructors_data = json.loads(instructors_json)

        return {
            'statusCode': 200,
            'body': json.dumps(instructors_data)
        }

    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
