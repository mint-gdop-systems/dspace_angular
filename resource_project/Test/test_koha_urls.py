#!/usr/bin/env python3
"""
Test Koha URLs and find existing biblio IDs
"""

import requests

class SimpleKohaAPI:
    def __init__(self):
        self.base_url = "http://127.0.0.1:8085/api/v1"
        self.client_id = '0d7136be-4bee-4086-b36a-22f1d89600a0'
        self.client_secret = 'd022ced0-f36f-41bd-8f47-a9a367c451ca'
        self.token = None
    
    def authenticate(self):
        try:
            response = requests.post(f"{self.base_url}/oauth/token", 
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret
                })
            
            if response.status_code == 200:
                self.token = response.json().get('access_token')
                return True
            return False
        except:
            return False
    
    def search_biblios(self, query, limit=20):
        if not self.token and not self.authenticate():
            return []
        
        try:
            params = {"_per_page": limit}
            response = requests.get(f"{self.base_url}/biblios", 
                                  headers={
                                      "Authorization": f"Bearer {self.token}",
                                      "Content-Type": "application/json",
                                      "Accept": "application/json"
                                  },
                                  params=params)
            
            if response.status_code == 200:
                return response.json()
            return []
        except:
            return []

def test_koha_urls():
    print("🔍 Testing Koha URLs and Biblio IDs")
    print("=" * 50)
    
    # Test Koha API
    koha_api = SimpleKohaAPI()
    
    if koha_api.authenticate():
        print("✅ Koha API authenticated")
        
        # Get existing biblios
        biblios = koha_api.search_biblios('', 10)
        print(f"📚 Found {len(biblios)} biblios")
        
        for biblio in biblios:
            biblio_id = biblio.get('biblio_id')
            title = biblio.get('title', 'No Title')[:50]
            
            print(f"\n📖 Biblio ID: {biblio_id}")
            print(f"   Title: {title}")
            
            # Test different URL formats
            urls_to_test = [
                f"http://127.0.0.1:8085/cgi-bin/koha/opac-detail.pl?biblionumber={biblio_id}",
                f"http://127.0.0.1:8085/cgi-bin/koha/catalogue/detail.pl?biblionumber={biblio_id}",
                f"http://127.0.0.1:8085/opac-detail.pl?biblionumber={biblio_id}",
                f"http://127.0.0.1:8085/catalogue/detail.pl?biblionumber={biblio_id}"
            ]
            
            for url in urls_to_test:
                try:
                    response = requests.get(url, timeout=5)
                    if response.status_code == 200 and 'koha' in response.text.lower():
                        print(f"   ✅ Working URL: {url}")
                        break
                    else:
                        print(f"   ❌ Failed URL: {url} (Status: {response.status_code})")
                except Exception as e:
                    print(f"   ❌ Error URL: {url} ({e})")
            
            # Only test first few
            if biblio_id and int(biblio_id) > 5:
                break
    else:
        print("❌ Koha API authentication failed")
    
    # Test DSpace search
    print(f"\n🔍 Testing DSpace Search")
    try:
        response = requests.get("http://localhost:8080/server/api/discover/search/objects", 
                              params={'query': 'test', 'size': 5}, timeout=10)
        if response.status_code == 200:
            data = response.json()
            items = data.get('_embedded', {}).get('searchResult', {}).get('_embedded', {}).get('objects', [])
            print(f"✅ DSpace search found {len(items)} items")
            
            for item in items[:3]:
                obj = item.get('_embedded', {}).get('indexableObject', {})
                title = obj.get('name', 'No Title')[:50]
                handle = obj.get('handle', '')
                uuid = obj.get('uuid', '')
                
                print(f"   📄 Title: {title}")
                print(f"      Handle: {handle}")
                print(f"      UUID: {uuid}")
                
                if handle:
                    print(f"      URL: http://localhost:4000/handle/{handle}")
        else:
            print(f"❌ DSpace search failed: {response.status_code}")
    except Exception as e:
        print(f"❌ DSpace search error: {e}")

if __name__ == "__main__":
    test_koha_urls()