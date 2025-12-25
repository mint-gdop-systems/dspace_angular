#!/usr/bin/env python3
"""
Test script for Koha, DSpace, and VuFind integration
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_search():
    """Test unified search functionality"""
    print("Testing unified search...")
    
    # Test basic search
    response = requests.get(f"{BASE_URL}/api/resources/search/", params={
        'q': 'python programming',
        'limit': 10
    })
    
    print(f"Search Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Total results: {data.get('total', 0)}")
        print(f"Koha results: {len(data.get('grouped', {}).get('koha', []))}")
        print(f"DSpace results: {len(data.get('grouped', {}).get('dspace', []))}")
        print(f"VuFind results: {len(data.get('grouped', {}).get('vufind', []))}")
        
        # Print first few results
        for i, result in enumerate(data.get('results', [])[:3]):
            print(f"\nResult {i+1}:")
            print(f"  Title: {result.get('title', 'N/A')}")
            print(f"  Source: {result.get('source_name', 'N/A')}")
            print(f"  Authors: {result.get('authors', 'N/A')}")
            print(f"  URL: {result.get('url', 'N/A')}")
    else:
        print(f"Error: {response.text}")

def test_filtered_search():
    """Test search with filters"""
    print("\nTesting filtered search...")
    
    response = requests.get(f"{BASE_URL}/api/resources/search/", params={
        'q': 'database',
        'source': 'koha',
        'type': 'book',
        'limit': 5
    })
    
    print(f"Filtered Search Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Filtered results: {data.get('total', 0)}")
        print(f"Applied filters: {data.get('filters', {})}")

def test_external_apis():
    """Test direct API connections"""
    print("\nTesting external API connections...")
    
    # Test Koha
    try:
        koha_response = requests.get("http://127.0.0.1:8085/cgi-bin/koha/svc/search", 
                                   params={'q': 'test', 'format': 'json'}, 
                                   timeout=5)
        print(f"Koha API Status: {koha_response.status_code}")
    except Exception as e:
        print(f"Koha API Error: {e}")
    
    # Test DSpace
    try:
        dspace_response = requests.get("http://localhost:8080/server/api/discover/search/objects", 
                                     params={'query': 'test'}, 
                                     timeout=5)
        print(f"DSpace API Status: {dspace_response.status_code}")
    except Exception as e:
        print(f"DSpace API Error: {e}")
    
    # Test VuFind
    try:
        vufind_response = requests.get("http://localhost:8090/api/v1/search", 
                                     params={'lookfor': 'test'}, 
                                     timeout=5)
        print(f"VuFind API Status: {vufind_response.status_code}")
    except Exception as e:
        print(f"VuFind API Error: {e}")

def test_register_and_upload():
    """Test user registration and file upload"""
    print("\nTesting user registration and upload...")
    
    # Register new user
    register_data = {
        'username': 'testuser',
        'email': 'testuser@example.com',
        'first_name': 'Test',
        'last_name': 'User',
        'password': 'password123',
        'confirm_password': 'password123'
    }
    
    register_response = requests.post(f"{BASE_URL}/api/auth/register/", data=register_data)
    print(f"Registration Status: {register_response.status_code}")
    
    if register_response.status_code in [200, 201]:
        print("User registered successfully!")
        
        # Now login
        login_response = requests.post(f"{BASE_URL}/api/auth/login/", data={
            'email': 'testuser@example.com',
            'password': 'password123'
        })
        
        if login_response.status_code == 200:
            token = login_response.json().get('token')
            headers = {'Authorization': f'Token {token}'}
            
            # Test upload
            test_content = b"This is a test document for upload"
            files = {'file': ('test_document.txt', test_content, 'text/plain')}
            
            data = {
                'title': 'Test Document Upload',
                'description': 'A test document uploaded via API',
                'resource_type': 'document',
                'authors': 'Test Author',
                'year': '2024'
            }
            
            upload_response = requests.post(f"{BASE_URL}/api/resources/upload/", 
                                          data=data, files=files, headers=headers)
            
            print(f"Upload Status: {upload_response.status_code}")
            if upload_response.status_code == 201:
                print("File uploaded successfully!")
                print(f"Response: {upload_response.json()}")
            else:
                print(f"Upload Error: {upload_response.text}")
        else:
            print(f"Login failed: {login_response.text}")
    else:
        print(f"Registration failed: {register_response.text}")

if __name__ == "__main__":
    print("=== Ministry of Innovation & Technology - Resource Integration Test ===\n")
    
    test_external_apis()
    test_search()
    test_filtered_search()
    test_register_and_upload()
    
    print("\n=== Test Complete ===")