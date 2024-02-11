# Note: The openai-python library support for Azure OpenAI is in preview.
# Note: This code sample requires OpenAI Python library version 0.28.1 or lower.
import os
import json

import openai
import prompt

openai.api_type = "azure"
openai.api_base = "https://oaiiot2023red.openai.azure.com/"
openai.api_version = "2023-07-01-preview"
openai.api_key = os.getenv("OPENAI_API_KEY")

def process_message(message):
    if message["role"] == "user":
        return {"role": "user", "content": prompt.prompt_template_answer.format(user_content=message["content"])}
    else:
        return {"role": "assistant", "content": json.dumps({"system": message["content"], "user_reaction": message["user_reaction"]})}


def lambda_handler(event, context):
    request_body = json.loads(event["body"])
    # level = request_body["level"]
    prompt_ = request_body["prompt"]
    message_list = request_body["message_list"]
    user_name = request_body["user_name"]
    
    system_message = prompt.prompt_tamplate_start.format(prompt=prompt_, user_info=f'{{"name": "{user_name}"}}')
    context = list(map(process_message, message_list))
    
    p = [{"role": "user", "content": system_message}] + context
    completion = openai.ChatCompletion.create(
        engine="oai0d",
        messages=p,
        temperature=0.7,
        max_tokens=800,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
    )
    response = completion["choices"][0]["message"]["content"]
    
    return {
        "statusCode": 200,
        "body": json.dumps({"response": response, "prompt": p}),
    }
        
