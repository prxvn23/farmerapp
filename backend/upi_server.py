from flask import Flask, request, send_file
from flask_cors import CORS  
import qrcode
import io

app = Flask(__name__)
CORS(app)  

@app.route('/generate_qr', methods=['POST'])
def generate_qr():
    data = request.json
    upi = data.get('upi')
    amount = data.get('amount')

    if not upi or not amount:
        return {'error': 'Missing UPI or amount'}, 400

    upi_link = f"upi://pay?pa={upi}&pn=Farmer&am={amount}&cu=INR"

    img = qrcode.make(upi_link)
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)

    return send_file(buf, mimetype='image/png')

if __name__ == '__main__':
    app.run(port=7000)
