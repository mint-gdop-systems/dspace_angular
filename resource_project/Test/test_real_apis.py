#!/usr/bin/env python3
"""
Test real API connections to DSpace, Koha, and VuFind
"""

import sys
import os
sys.path.append('/home/biruk/Documents/resource_project/backend')

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from resources.real_dspace_api import RealDSpaceAPI
from resources.real_koha_api import RealKohaAPI
from resources.real_vufind_api import RealVuFindAPI

def test_dspace():
    print("🗄️ Testing DSpace API...")
    dspace = RealDSpaceAPI()
    
    if dspace.authenticate():
        print("✅ DSpace authentication successful")
        
        collections = dspace.get_collections()
        if collections:
            print(f"✅ DSpace collections available: {collections.get('name', 'Unknown')}")
        
        # Test search
        results = dspace.search_items("test", 5)
        print(f"✅ DSpace search returned {len(results)} items")
        
        return True
    else:
        print("❌ DSpace authentication failed")
        return False

def test_koha():
    print("\n📚 Testing Koha API...")
    koha = RealKohaAPI()
    
    if koha.authenticate():
        print("✅ Koha authentication successful")
        
        # Test search
        results = koha.search_biblios("test", 5)
        print(f"✅ Koha search returned {len(results)} records")
        
        return True
    else:
        print("❌ Koha authentication failed")
        return False

def test_vufind():
    print("\n🧭 Testing VuFind API...")
    vufind = RealVuFindAPI()
    
    if vufind.test_connection():
        print("✅ VuFind connection successful")
        
        # Test search
        results = vufind.search_records("test", 5)
        print(f"✅ VuFind search returned {len(results)} records")
        
        return True
    else:
        print("❌ VuFind connection failed")
        return False

def main():
    print("🏛️ MINISTRY OF INNOVATION & TECHNOLOGY")
    print("🔗 Real API Integration Test")
    print("=" * 60)
    
    dspace_ok = test_dspace()
    koha_ok = test_koha()
    vufind_ok = test_vufind()
    
    print("\n📊 INTEGRATION STATUS:")
    print(f"   DSpace: {'✅ Connected' if dspace_ok else '❌ Not Available'}")
    print(f"   Koha: {'✅ Connected' if koha_ok else '❌ Not Available'}")
    print(f"   VuFind: {'✅ Connected' if vufind_ok else '❌ Not Available'}")
    
    if dspace_ok or koha_ok or vufind_ok:
        print("\n🎉 REAL API INTEGRATION WORKING!")
        print("   No dummy data - only real API responses")
    else:
        print("\n⚠️ APIs not available - check if services are running:")
        print("   • DSpace: http://localhost:4000")
        print("   • Koha: http://127.0.0.1:8085")
        print("   • VuFind: http://localhost:8090")

if __name__ == "__main__":
    main()