#!/usr/bin/env python3
"""
Test unified search functionality across Koha and DSpace
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_unified_search():
    print("🔍 Testing Unified Search Functionality")
    print("=" * 50)
    
    # Test queries
    test_queries = [
        "python",
        "database", 
        "research",
        "technology",
        "digital",
        "government"
    ]
    
    for query in test_queries:
        print(f"\n🔎 Searching for: '{query}'")
        
        # Test unified search
        response = requests.get(f"{BASE_URL}/api/resources/search/", params={
            'q': query,
            'limit': 10
        })
        
        if response.status_code == 200:
            data = response.json()
            total = data.get('total', 0)
            results = data.get('results', [])
            grouped = data.get('grouped', {})
            
            print(f"   Total Results: {total}")
            print(f"   Koha: {len(grouped.get('koha', []))}")
            print(f"   DSpace: {len(grouped.get('dspace', []))}")
            print(f"   VuFind: {len(grouped.get('vufind', []))}")
            print(f"   Local: {len(grouped.get('local', []))}")
            
            # Show sample results
            if results:
                print("   Sample Results:")
                for i, result in enumerate(results[:3]):
                    source = result.get('source', 'unknown')
                    title = result.get('title', 'No Title')[:50]
                    external_id = result.get('external_id', 'N/A')
                    url = result.get('url', 'N/A')
                    
                    print(f"     {i+1}. [{source.upper()}] {title}...")
                    print(f"        ID: {external_id}")
                    print(f"        URL: {url}")
        else:
            print(f"   ❌ Error: {response.status_code}")
    
    # Test source filtering
    print(f"\n🎯 Testing Source Filtering")
    sources = ['koha', 'dspace', 'vufind']
    
    for source in sources:
        response = requests.get(f"{BASE_URL}/api/resources/search/", params={
            'q': 'test',
            'source': source,
            'limit': 5
        })
        
        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])
            filtered_results = [r for r in results if r.get('source') == source]
            print(f"   {source.upper()}: {len(filtered_results)} results")
        else:
            print(f"   {source.upper()}: Error {response.status_code}")
    
    print(f"\n✅ Unified Search Test Complete")
    print(f"\n📋 Direct Access URLs:")
    print(f"   • Koha OPAC: http://127.0.0.1:8085")
    print(f"   • DSpace UI: http://localhost:4000") 
    print(f"   • VuFind: http://localhost:8090")
    print(f"   • React Frontend: http://localhost:3000")

if __name__ == "__main__":
    test_unified_search()