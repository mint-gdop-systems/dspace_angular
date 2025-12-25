#!/usr/bin/env python3
import requests
import uuid

BASE_URL = "http://localhost:8000"

# Test with unique user
unique_id = uuid.uuid4().hex[:8]
user_data = {
    'username': f'user_{unique_id}',
    'email': f'user_{unique_id}@test.com',
    'first_name': 'Test',
    'last_name': 'User',
    'password': 'password123',
    'confirm_password': 'password123'
}

print("🧪 Testing Real System (No Dummy Data)")
print("=" * 50)

# 1. Register user
print("1. Registering user...")
register_response = requests.post(f"{BASE_URL}/api/auth/register/", data=user_data)
print(f"   Status: {register_response.status_code}")

if register_response.status_code == 201:
    # 2. Login
    print("2. Logging in...")
    login_response = requests.post(f"{BASE_URL}/api/auth/login/", data={
        'email': user_data['email'],
        'password': user_data['password']
    })
    
    if login_response.status_code == 200:
        token = login_response.json()['token']
        print(f"   Token: {token[:20]}...")
        
        # 3. Upload file
        print("3. Uploading file...")
        files = {'file': ('test_document.pdf', b'PDF content here...', 'application/pdf')}
        data = {
            'title': 'Real Test Document',
            'description': 'Actual uploaded document',
            'resource_type': 'document',
            'authors': 'Test Author',
            'year': '2024'
        }
        
        upload_response = requests.post(f"{BASE_URL}/api/resources/upload/", 
                                      data=data, files=files, 
                                      headers={'Authorization': f'Token {token}'})
        
        print(f"   Upload Status: {upload_response.status_code}")
        
        if upload_response.status_code == 201:
            resource_data = upload_response.json()
            resource_id = resource_data['resource']['id']
            
            # 4. Test download
            print("4. Testing download...")
            download_response = requests.get(f"{BASE_URL}/api/resources/{resource_id}/download/")
            print(f"   Download Status: {download_response.status_code}")
            
            # 5. Test preview
            print("5. Testing preview...")
            preview_response = requests.get(f"{BASE_URL}/api/resources/{resource_id}/preview/")
            print(f"   Preview Status: {preview_response.status_code}")
            
            # 6. Search for uploaded file
            print("6. Searching for uploaded file...")
            search_response = requests.get(f"{BASE_URL}/api/resources/search/", params={
                'q': 'Real Test',
                'source': 'local'
            })
            print(f"   Search Status: {search_response.status_code}")
            if search_response.status_code == 200:
                results = search_response.json()
                print(f"   Found: {results.get('total', 0)} results")

# 7. Test external API search (real data only)
print("7. Testing external API search...")
queries = ['python', 'database', 'research']
for query in queries:
    response = requests.get(f"{BASE_URL}/api/resources/search/", params={'q': query})
    if response.status_code == 200:
        data = response.json()
        total = data.get('total', 0)
        print(f"   '{query}': {total} real results")

print("\n✅ Real system test complete!")