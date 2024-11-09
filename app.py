from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import clamd

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

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
        print(f"Scan result: {result}")
        if result[clam_file_path] == ('OK', None):
            return {'infected': False}
        else:
            os.remove(file_path)
            return {'infected': True, 'viruses': result[clam_file_path][1]}
    except Exception as e:
        print(f"Error scanning file: {e}")
        raise e

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/v1/images', methods=['POST'])
def upload_images():
    if 'images' not in request.files:
        return jsonify({'error': 'No images in the request'}), 400

    files = request.files.getlist('images')
    if len(files) != 2:
        return jsonify({'error': 'Please provide 2 images'}), 400

    saved_files = []
    for file in files:
        if file and file.filename.endswith('png'):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Scan the file for viruses
            scan_result = scan_file(file_path)
            print(f"Scan result: {scan_result}")
            if scan_result['infected']:
                return jsonify({'error': 'Virus detected in file'}), 400

            saved_files.append(file_path)
        else:
            return jsonify({'error': 'Please provide PNG images only'}), 400

    return jsonify({'message': 'Images uploaded successfully', 'files': saved_files}), 201

if __name__ == '__main__':
    app.run(debug=True)