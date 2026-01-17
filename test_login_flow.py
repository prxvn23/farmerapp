import urllib.request
import urllib.parse
import json
import http.cookiejar

# Configuration
BASE_URL = "http://localhost:8000"
CSRF_URL = f"{BASE_URL}/utils/csrf.php"
LOGIN_URL = f"{BASE_URL}/api/login.php"

# Credentials
EMAIL = "pravin@gmail.com"
PASSWORD = "password"

def test_login():
    # Setup cookie jar to handle sessions
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    
    print(f"🔹 1. Fetching CSRF Token from {CSRF_URL}...")
    try:
        with opener.open(CSRF_URL) as response:
            data = response.read().decode("utf-8")
            print(f"   Response: {data}")
            
            try:
                json_data = json.loads(data)
                csrf_token = json_data.get("csrf_token")
            except:
                print("❌ Failed to parse CSRF JSON")
                return

            if not csrf_token:
                print("❌ No CSRF token found in response")
                return
            
            print(f"✅ Got CSRF Token: {csrf_token}")
            
    except Exception as e:
        print(f"❌ Error fetching CSRF: {e}")
        return

    print(f"\n🔹 2. Attempting Login at {LOGIN_URL}...")
    login_data = json.dumps({
        "email": EMAIL,
        "password": PASSWORD
    }).encode("utf-8")
    
    headers = {
        "X-CSRF-Token": csrf_token,
        "Content-Type": "application/json",
        "User-Agent": "Python-Test-Script"
    }
    
    req = urllib.request.Request(LOGIN_URL, data=login_data, headers=headers, method="POST")
    
    try:
        with opener.open(req) as response:
            data = response.read().decode("utf-8")
            print(f"   Response: {data}")
            
            try:
                json_data = json.loads(data)
                if json_data.get("success"):
                    print("✅ LOGIN SUCCESS!")
                else:
                    print(f"❌ LOGIN FAILED: {json_data.get('message')}")
            except:
                 print("❌ Failed to parse Login JSON response")
                 
    except urllib.request.HTTPError as e:
        print(f"❌ HTTP Error {e.code}: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"❌ Error during login request: {e}")

if __name__ == "__main__":
    test_login()
