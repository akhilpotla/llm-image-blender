import os
import requests

from dotenv import load_dotenv

load_dotenv()
url = "https://api.pinata.cloud/data/testAuthentication"

def check_pinata_auth():
    headers = {"Authorization": "Bearer {}".format(os.getenv("PINATA_JWT"))}
    response = requests.request("GET", url, headers=headers)
    return response.status_code == 200

check_pinata_auth()