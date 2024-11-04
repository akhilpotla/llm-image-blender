from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/data', methods=['POST'])
def get_data():
    data = request.json
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)