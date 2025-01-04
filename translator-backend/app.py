from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from PyPDF2 import PdfReader
import easyocr

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Hugging Face API details
TRANSLATE_URL = "https://sepioo-facebook-translation.hf.space/v1/translate"
HEADERS = {"Content-Type": "application/json"}

# Function to translate text using Hugging Face API
def translate_text(input_text, from_language="en", to_language="mr"):
    payload = {
        "from_language": from_language,
        "to_language": to_language,
        "input_text": input_text
    }

    response = requests.post(TRANSLATE_URL, json=payload, headers=HEADERS)

    if response.status_code == 200:
        result = response.json()
        print("API Response:", result)  # Debugging the API response
        translated_text = result.get("translate", "")
        if not translated_text:
            raise Exception("No translation available in the response.")
        return translated_text
    else:
        raise Exception(f"API Error: {response.status_code} - {response.text}")

# Function to extract text from a PDF
def extract_text_from_pdf(input_pdf):
    reader = PdfReader(input_pdf)
    content = ""
    for page in reader.pages:
        content += page.extract_text()
    if not content.strip():
        raise ValueError("The PDF appears to be empty or contains non-extractable text.")
    return content

# Function to extract text from an image using EasyOCR
def extract_text_from_image(image_file):
    reader = easyocr.Reader(['en'])  # Specify the language (English here)
    image_path = 'temp_image.png'  # Save the uploaded image temporarily
    image_file.save(image_path)
    result = reader.readtext(image_path)

    extracted_text = ' '.join([item[1] for item in result])
    if not extracted_text.strip():
        raise ValueError("No text found in the image.")
    return extracted_text

# Endpoint for text translation
@app.route('/translate-text', methods=['POST'])
def translate_text_endpoint():
    data = request.json
    text = data.get('text', '')
    from_language = data.get('from_language', 'en')
    to_language = data.get('to_language', 'mr')

    try:
        translated_text = translate_text(text, from_language, to_language)
        return jsonify({'translated_text': translated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint for document translation
@app.route('/translate-document', methods=['POST'])
def translate_document_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        content = extract_text_from_pdf(file)
        translated_text = translate_text(content)
        return jsonify({'translated_text': translated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint for image translation
@app.route('/translate-image', methods=['POST'])
def translate_image_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    image_file = request.files['file']
    if image_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        extracted_text = extract_text_from_image(image_file)
        translated_text = translate_text(extracted_text)
        return jsonify({'translated_text': translated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
