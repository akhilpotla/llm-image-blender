import os

import time

import base64
import clamd
import requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

from utils.image_prompt_generation import image_generation

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},  # Restrict origin
    supports_credentials=True  # Allow credentials
)


# Ensure the upload folder exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB max size

# Initialize ClamAV
clamav = clamd.ClamdNetworkSocket('localhost', port=3310, timeout=60)

# Function to scan uploaded files
def scan_file(file_path):
    try:
        clam_file_path = '/app/{}'.format(file_path)
        result = clamav.scan(clam_file_path)
        if result[clam_file_path] == ('OK', None):
            return {'infected': False}
        else:
            os.remove(file_path)
            return {'infected': True, 'viruses': result[clam_file_path][1]}
    except Exception as e:
        print(f"Error scanning file: {e}")
        raise e

@app.route('/api', methods=['GET', 'OPTIONS'])
def home():
    return "Hello, Flask!"

@app.route('/api/v1/images', methods=['POST'])
def upload_images():
    print("Request received")
    if 'images' not in request.files:
        return jsonify({'error': 'No images in the request'}), 400

    files = request.files.getlist('images')
    if len(files) != 2:
        return jsonify({'error': 'Please provide 2 images'}), 400

    saved_files = scan_all_files(files)
    print("Images Scanned")

    if 'error' in saved_files:
        return jsonify(saved_files), 400
    else:
        new_image_url = image_generation(saved_files[0], saved_files[1])
        print(new_image_url)

    print("New Image Generated")
    print(new_image_url)

    new_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'new_image.png')
    new_image = requests.get(new_image_url)
    with open(new_image_path, 'wb') as file:
        file.write(new_image.content)

    with open(new_image_path, 'rb') as file:
        new_image_base64 = base64.b64encode(file.read()).decode('utf-8')

    return jsonify({'message': 'New image created', 'image': new_image_base64}), 200

def scan_all_files(files):
    saved_files = []
    for file in files:
        if file and (file.filename.endswith('png') or file.filename.endswith('jpg')):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Scan the file for viruses
            scan_result = scan_file(file_path)
            if scan_result['infected']:
                return {'error': 'Virus detected in file'}

            saved_files.append(file_path)
        else:
            return {'error': 'Please provide PNG images only'}
    return saved_files

def get_juxtaposed_image_path(saved_files):
    image1_path = saved_files[0]
    image2_path = saved_files[1]
    timestamp = int(time.time())

    juxtaposed_image = juxtapose_images(image1_path, image2_path)
    juxtaposed_image_path = os.path.join(app.config['UPLOAD_FOLDER'], '{}.png'.format(timestamp))
    juxtaposed_image.save(juxtaposed_image_path)
    return juxtaposed_image_path


if __name__ == '__main__':
    app.run(debug=True)