#!/usr/bin/env python3
"""
Sample API requests for Ministry of Innovation & Technology Resource Management System
Demonstrates unified search, filtering, file upload, and integration with Koha, DSpace, VuFind
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def demo_unified_search():
    """Demonstrate unified search across all systems"""
    print("🔍 UNIFIED SEARCH DEMO")
    print("=" * 50)
    
    queries = ['python', 'database', 'machine learning', 'research']
    
    for query in queries:
        print(f"\nSearching for: '{query}'")
        response = requests.get(f"{BASE_URL}/api/resources/search/", params={
            'q': query,
            'limit': 15
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f"📊 Total Results: {data['total']}")
            print(f"📚 Koha (Library): {len(data['grouped']['koha'])}")
            print(f"🗄️  DSpace (Repository): {len(data['grouped']['dspace'])}")
            print(f"🧭 VuFind (Discovery): {len(data['grouped']['vufind'])}")
            
            # Show sample results
            for i, result in enumerate(data['results'][:2]):
                print(f"  {i+1}. {result['title']} ({result['source_name']})")

def demo_filtered_search():
    """Demonstrate advanced filtering"""
    print("\n\n🎯 ADVANCED FILTERING DEMO")
    print("=" * 50)
    
    filters = [
        {'source': 'koha', 'type': 'book'},
        {'source': 'dspace', 'type': 'document'},
        {'year': '2024'},
        {'source': 'vufind'}
    ]
    
    for filter_set in filters:
        params = {'q': 'technology', **filter_set, 'limit': 10}
        response = requests.get(f"{BASE_URL}/api/resources/search/", params=params)
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nFilter: {filter_set}")
            print(f"Results: {data['total']}")

def demo_file_upload():
    """Demonstrate file upload functionality"""
    print("\n\n📤 FILE UPLOAD DEMO")
    print("=" * 50)
    
    # Register user
    user_data = {
        'username': f'demo_user_{requests.get("http://httpbin.org/uuid").json()["uuid"][:8]}',
        'email': 'demo@ministry.gov',
        'first_name': 'Demo',
        'last_name': 'User',
        'password': 'demo123',
        'confirm_password': 'demo123'
    }
    
    register_response = requests.post(f"{BASE_URL}/api/auth/register/", data=user_data)
    print(f"Registration: {register_response.status_code}")
    
    if register_response.status_code == 201:
        # Login
        login_response = requests.post(f"{BASE_URL}/api/auth/login/", data={
            'email': user_data['email'],
            'password': user_data['password']
        })
        
        if login_response.status_code == 200:
            token = login_response.json()['token']
            headers = {'Authorization': f'Token {token}'}
            
            # Upload multiple files
            files_to_upload = [
                {
                    'title': 'Ministry Innovation Report 2024',
                    'content': b'This is a comprehensive report on innovation initiatives...',
                    'filename': 'innovation_report_2024.pdf',
                    'type': 'report'
                },
                {
                    'title': 'Technology Research Paper',
                    'content': b'Research findings on emerging technologies...',
                    'filename': 'tech_research.docx',
                    'type': 'research'
                }
            ]
            
            for file_info in files_to_upload:
                files = {'file': (file_info['filename'], file_info['content'], 'application/octet-stream')}
                data = {
                    'title': file_info['title'],
                    'description': f"Uploaded document: {file_info['title']}",
                    'resource_type': file_info['type'],
                    'authors': 'Ministry Staff',
                    'year': '2024'
                }
                
                upload_response = requests.post(f"{BASE_URL}/api/resources/upload/", 
                                              data=data, files=files, headers=headers)
                
                if upload_response.status_code == 201:
                    print(f"✅ Uploaded: {file_info['title']}")
                else:
                    print(f"❌ Failed: {file_info['title']}")

def demo_system_integration():
    """Demonstrate integration with external systems"""
    print("\n\n🔗 SYSTEM INTEGRATION DEMO")
    print("=" * 50)
    
    systems = {
        'Koha Library System': 'http://127.0.0.1:8085',
        'DSpace Repository': 'http://localhost:4000',
        'DSpace API': 'http://localhost:8080/server',
        'VuFind Discovery': 'http://localhost:8090'
    }
    
    print("External System Status:")
    for name, url in systems.items():
        try:
            response = requests.get(url, timeout=3)
            status = "🟢 Online" if response.status_code < 400 else "🟡 Issues"
        except:
            status = "🔴 Offline"
        print(f"  {name}: {status}")

def demo_analytics_data():
    """Show sample analytics data"""
    print("\n\n📈 ANALYTICS DEMO")
    print("=" * 50)
    
    # Get recent resources
    response = requests.get(f"{BASE_URL}/api/resources/recent/")
    if response.status_code == 200:
        resources = response.json()
        print(f"Recent Resources: {len(resources)}")
        for resource in resources[:3]:
            print(f"  - {resource['title']} ({resource['source']})")

def main():
    """Run all demos"""
    print("🏛️  MINISTRY OF INNOVATION & TECHNOLOGY")
    print("📚 Resource Management System - API Demo")
    print("🔗 Koha + DSpace + VuFind Integration")
    print("=" * 60)
    
    try:
        demo_system_integration()
        demo_unified_search()
        demo_filtered_search()
        demo_file_upload()
        demo_analytics_data()
        
        print("\n\n✅ DEMO COMPLETE")
        print("=" * 50)
        print("🌐 Access Points:")
        print("  • Frontend: http://localhost:3000")
        print("  • API: http://localhost:8000")
        print("  • Koha: http://127.0.0.1:8085")
        print("  • DSpace: http://localhost:4000")
        print("  • VuFind: http://localhost:8090")
        
    except Exception as e:
        print(f"❌ Demo Error: {e}")

if __name__ == "__main__":
    main()