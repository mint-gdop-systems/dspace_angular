#!/usr/bin/env python3
import requests

# Test search with real data
print("Testing search with real data...")
response = requests.get("http://localhost:8000/api/resources/search/?q=python")
print(f"Status: {response.status_code}")

if response.status_code == 200:
    data = response.json()
    print(f"Results: {data.get('total', 0)}")
    for result in data.get('results', [])[:2]:
        print(f"- {result.get('title')} ({result.get('source')})")
else:
    print(f"Error: {response.text[:200]}")

# Test upload
print("\nTesting upload...")
register_data = {
    'username': 'testuser123',
    'email': 'test123@example.com', 
    'first_name': 'Test',
    'last_name': 'User',
    'password': 'password123',
    'confirm_password': 'password123'
}

register_response = requests.post("http://localhost:8000/api/auth/register/", data=register_data)
print(f"Register: {register_response.status_code}")

if register_response.status_code == 201:
    login_response = requests.post("http://localhost:8000/api/auth/login/", data={
        'email': 'test123@example.com',
        'password': 'password123'
    })
    
    if login_response.status_code == 200:
        token = login_response.json()['token']
        
        # Test file upload
        files = {'file': ('test.txt', b'Test file content', 'text/plain')}
        data = {
            'title': 'Test File',
            'description': 'Test upload',
            'resource_type': 'document',
            'authors': 'Test Author',
            'year': '2024'
        }
        
        upload_response = requests.post("http://localhost:8000/api/resources/upload/", 
                                      data=data, files=files, 
                                      headers={'Authorization': f'Token {token}'})
        
        print(f"Upload: {upload_response.status_code}")
        if upload_response.status_code == 201:
            resource_id = upload_response.json()['resource']['id']
            
            # Test download
            download_response = requests.get(f"http://localhost:8000/api/resources/{resource_id}/download/")
            print(f"Download: {download_response.status_code}")