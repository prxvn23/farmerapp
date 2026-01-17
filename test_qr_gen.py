import urllib.request
import json
import sys

URL = "http://localhost:8000/api/generate_qr.php"
PAYLOAD = {
    "upi": "test@upi",
    "amount": 100
}

def test_qr():
    try:
        req = urllib.request.Request(
            URL, 
            data=json.dumps(PAYLOAD).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req) as res:
            ct = res.headers.get('Content-Type')
            print(f"Content-Type: {ct}")
            data = res.read()
            print(f"Response Size: {len(data)} bytes")
            
            if 'image/png' in ct and len(data) > 100:
                print("✅ QR Code Generated Successfully")
            else:
                print("❌ Invalid Response (Not an image)")
                print(data[:100]) # Print first 100 chars
                
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_qr()
