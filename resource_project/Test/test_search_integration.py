#!/usr/bin/env python3
"""
Test the integrated search functionality
"""

import requests
import json

def test_search_integration():
    print("🔍 Testing Search Integration")
    print("=" * 40)
    
    # Test DSpace search directly
    print("\n1. Testing DSpace Search API")
    try:
        response = requests.get("http://localhost:8080/server/api/discover/search/objects", 
                              params={'query': 'test', 'size': 5}, timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get('_embedded', {}).get('searchResult', {}).get('_embedded', {}).get('objects', [])
            print(f"   ✅ DSpace API: Found {len(items)} items")
            
            for item in items[:2]:
                obj = item.get('_embedded', {}).get('indexableObject', {})
                title = obj.get('name', 'No Title')[:40]
                handle = obj.get('handle', '')
                print(f"      - {title} (Handle: {handle})")
        else:
            print(f"   ❌ DSpace API failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ DSpace API error: {e}")
    
    # Test Koha search directly
    print("\n2. Testing Koha Search API")
    try:
        # Get OAuth token
        token_response = requests.post("http://127.0.0.1:8085/api/v1/oauth/token", 
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={
                "grant_type": "client_credentials",
                "client_id": "0d7136be-4bee-4086-b36a-22f1d89600a0",
                "client_secret": "d022ced0-f36f-41bd-8f47-a9a367c451ca"
            })
        
        if token_response.status_code == 200:
            token = token_response.json().get('access_token')
            
            # Search biblios
            biblios_response = requests.get("http://127.0.0.1:8085/api/v1/biblios", 
                headers={
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/json"
                },
                params={"_per_page": 5})
            
            if biblios_response.status_code == 200:
                biblios = biblios_response.json()
                print(f"   ✅ Koha API: Found {len(biblios)} items")
                
                for biblio in biblios[:2]:
                    title = biblio.get('title', 'No Title')[:40]
                    biblio_id = biblio.get('biblio_id')
                    print(f"      - {title} (ID: {biblio_id})")
            else:
                print(f"   ❌ Koha biblios failed: {biblios_response.status_code}")
        else:
            print(f"   ❌ Koha auth failed: {token_response.status_code}")
    except Exception as e:
        print(f"   ❌ Koha API error: {e}")
    
    print("\n3. Testing URLs")
    test_urls = [
        ("Koha Catalogue", "http://127.0.0.1:8085/cgi-bin/koha/catalogue/detail.pl?biblionumber=1"),
        ("DSpace Handle", "http://localhost:4000/handle/123456789/110"),
        ("DSpace UI", "http://localhost:4000"),
        ("VuFind", "http://localhost:8090")
    ]
    
    for name, url in test_urls:
        try:
            response = requests.get(url, timeout=5)
            status = "✅ Working" if response.status_code == 200 else f"⚠️ Status {response.status_code}"
            print(f"   {name}: {status}")
        except Exception as e:
            print(f"   {name}: ❌ Error - {e}")

if __name__ == "__main__":
    test_search_integration()