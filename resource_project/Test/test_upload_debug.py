#!/usr/bin/env python3
import requests
import uuid

BASE_URL = "http://localhost:8000"

# Create user and test upload
unique_id = uuid.uuid4().hex[:8]
user_data = {
    'username': f'debug_{unique_id}',
    'email': f'debug_{unique_id}@test.com',
    'first_name': 'Debug',
    'last_name': 'User',
    'password': 'password123',
    'confirm_password': 'password123'
}

# Register and login
register_response = requests.post(f"{BASE_URL}/api/auth/register/", data=user_data)
print(f"Register: {register_response.status_code}")

if register_response.status_code == 201:
    login_response = requests.post(f"{BASE_URL}/api/auth/login/", data={
        'email': user_data['email'],
        'password': user_data['password']
    })
    
    if login_response.status_code == 200:
        token = login_response.json()['token']
        
        # Test upload
        files = {'file': ('test.pdf', b'Test content', 'application/pdf')}
        data = {
            'title': 'Test Document',
            'description': 'Test description',
            'authors': 'Test Author',
            'resource_type': 'document',
            'year': '2024'
        }
        
        upload_response = requests.post(f"{BASE_URL}/api/resources/upload/", 
                                      data=data, files=files, 
                                      headers={'Authorization': f'Token {token}'})
        
        print(f"Upload: {upload_response.status_code}")
        print(f"Response: {upload_response.text}")
        
        # Test search
        search_response = requests.get(f"{BASE_URL}/api/resources/search/?q=Test")
        print(f"Search: {search_response.status_code}")
        if search_response.status_code == 200:
            data = search_response.json()
            print(f"Results: {data.get('total', 0)}")