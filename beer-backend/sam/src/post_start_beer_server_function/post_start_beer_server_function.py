import json
import boto3

iot = boto3.client('iot-data')

def lambda_handler(event, context):
    device_id = event['pathParameters']['device_id']
    
    payload = {
        "message": {
            "power": "on"
        }
    }
    try:
        iot.publish(
            topic = f"beer-server/{device_id}/control",
            qos   = 0, # 届こうが届くまいが１回だけ送信
            payload=json.dumps(payload)
        )
        return {
            'statusCode': 200,
            'body': json.dumps('Suceeded.')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error retrieving start beer-server: {str(e)}')
        }
