import os
import requests

from dotenv import load_dotenv

load_dotenv()
url = "https://uploads.pinata.cloud/v3/files"

def upload_file_pinata(file_path):
    boundary = "-----011000010111000001101001"
    headers = {
        "Authorization": "Bearer {}".format(os.getenv("PINATA_JWT")),
        # "Content-Type": f"multipart/form-data; boundary={boundary}"
        "Content-Type": "application/offset+octet-stream"
    }

    # Read the file content
    with open(file_path, 'rb') as file:
        file_content = file.read()
    
    # Determine the MIME type of the file
    mime_type = "image/png" if file_path.lower().endswith(".png") else "image/jpeg"
    
    # Construct the payload
    payload = (
        f"{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"file\"; filename=\"{os.path.basename(file_path)}\"\r\n"
        f"Content-Type: {mime_type}\r\n\r\n"
        f"{file_content.decode('latin1')}\r\n"
        f"{boundary}--\r\n"
    )
    
    # Calculate the length of the payload
    upload_length = len(payload.encode('utf-8'))
    headers["Upload-Length"] = str(upload_length)

    response = requests.post(url, data=payload, headers=headers)

    if response.status_code == 200 or response.status_code == 201:
        print("File uploaded successfully")
    else:
        print("Failed to upload file")
        print(response.status_code)
        print(response.text)
        print(response)

# Example usage
upload_file_pinata("./uploads/new_image.png")