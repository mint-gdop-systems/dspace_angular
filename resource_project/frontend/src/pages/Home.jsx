import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Download, 
  Book, 
  FileText, 
  Image, 
  File, 
  Users, 
  Calendar, 
  Heart, 
  UserPlus, 
  BarChart3, 
  Globe, 
  Filter,
  RefreshCw,
  MapPin
} from 'lucide-react';
import axios from 'axios';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalResources: 0,
    monthlyDownloads: 0,
    activeUsers: 0,
    communities: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllResources();
    fetchSystemStats();
  }, []);

  const fetchAllResources = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/resources/search/?q=&limit=50');
      setAllResources(response.data.results || []);
    } catch (error) {
      console.error('Error fetching all resources:', error);
      setAllResources([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      // Mock stats - replace with actual API call
      setStats({
        totalResources: 12457,
        monthlyDownloads: 5678,
        activeUsers: 890,
        communities: 12
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const vitalEvents = [
    { name: 'Birth Registrations', icon: UserPlus, color: 'bg-gray-50', count: '4,231' },
    { name: 'Death Records', icon: Heart, color: 'bg-gray-50', count: '2,867' },
    { name: 'Marriage Certificates', icon: Users, color: 'bg-gray-50', count: '1,542' },
    { name: 'Divorce Records', icon: Users, color: 'bg-gray-50', count: '893' },
    { name: 'Annual Reports', icon: FileText, color: 'bg-gray-50', count: '156' }
  ];

  const regions = [
    'Addis Ababa', 'Oromia', 'Amhara', 'SNNPR', 'Tigray', 'Somali', 
    'Afar', 'Dire Dawa', 'Gambela', 'Benishangul-Gumuz', 'Harari', 'Sidama'
  ];

  const quickSearches = [
    'Birth registration trends 2023',
    'Mortality rates by region',
    'Marriage statistics Ethiopia',
    'Vital registration laws',
    'Digital birth certificates'
  ];

  const formatSearchResult = (resource) => {
    const sourceMap = {
      koha: 'Koha Library Catalog',
      dspace: 'DSpace Repository',
      vufind: 'VuFind Discovery'
    };

    const displayUrl = resource.source === 'koha' 
      ? `koha.ethiopia.gov.et/catalogue/${resource.external_id}`
      : resource.source === 'dspace'
      ? `dspace.ethiopia.gov.et/handle/${resource.external_id}`
      : `vufind.ethiopia.gov.et/record/${resource.external_id}`;

    return (
      <div 
        key={resource.id}
        className="border-b border-gray-200 pb-6 mb-6 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
        onClick={() => {
          if (resource.source === 'koha') {
            window.open(`http://127.0.0.1:8085/cgi-bin/koha/catalogue/detail.pl?biblionumber=${resource.external_id}`, '_blank');
          } else if (resource.source === 'dspace') {
            window.open(`http://localhost:4000/handle/${resource.external_id}`, '_blank');
          } else if (resource.source === 'vufind') {
            window.open(`http://localhost:8090/Record/${resource.external_id}`, '_blank');
          } else {
            navigate(`/resource/${resource.id}`);
          }
        }}
      >
        <div className="flex items-start space-x-2 mb-1">
          <Globe className="w-4 h-4 text-gray-800 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-600 truncate">{displayUrl}</span>
          </div>
        </div>
        
        <h3 className="text-xl text-blue-600 hover:text-blue-800 mb-2 line-clamp-1 font-medium">
          {resource.title}
        </h3>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-800" />
            {resource.year || 'N/A'}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{resource.resource_type}</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{sourceMap[resource.source] || resource.source}</span>
        </div>
        
        <p className="text-gray-700 text-sm line-clamp-2">
          {resource.description || 'No description available for this resource.'}
        </p>
        
        {resource.external_id && (
          <div className="mt-2 text-xs text-gray-500 flex items-center space-x-4">
            <span>Document ID: {resource.external_id}</span>
            <span className="flex items-center">
              <Download className="w-3 h-3 mr-1 text-gray-800" />
              PDF • 2.3 MB
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#1A3D64] py-16 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">
              Ethiopian Vital Registrations
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Access comprehensive vital event records including births, deaths, marriages, and divorces across all regions of Ethiopia
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vital records, reports, and statistics..."
                className="w-full pl-12 pr-32 py-4 text-lg bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1A3D64] hover:bg-[#2A4D74] text-white px-8 py-2 rounded-lg font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="max-w-3xl mx-auto mt-6">
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-blue-100 text-sm">Quick searches:</span>
              {quickSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(search)}
                  className="text-blue-100 hover:text-white text-sm bg-blue-900/30 hover:bg-blue-900/50 px-3 py-1 rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section - Moved right below hero */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Resources 
              <span className="text-gray-500 text-lg ml-2">({allResources.length} results)</span>
            </h2>
            <div className="flex space-x-4">
              <button 
                onClick={fetchAllResources}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button 
                onClick={() => navigate('/advanced-search')}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Filter className="w-4 h-4 mr-2 text-gray-800" />
                Advanced Search
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading vital records...</p>
            </div>
          ) : allResources.length === 0 ? (
            <Card className="text-center py-12 border border-gray-200">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse by category</p>
              <button 
                onClick={fetchAllResources}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium"
              >
                Load Sample Records
              </button>
            </Card>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ethiopian Vital Registration Community</h3>
                <p className="text-gray-600">
                  Civil registration and vital statistics data from the Federal Democratic Republic of Ethiopia
                </p>
              </div>
              
              <div className="space-y-1">
                {allResources.map(formatSearchResult)}
              </div>

              <div className="text-center mt-8">
                <button 
                  onClick={() => navigate('/search')}
                  className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Show More Results
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* System Overview */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              National Vital Events Registry
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Ethiopia's centralized platform for civil registration and vital statistics. 
              Supporting evidence-based policy making and demographic research since 2016.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
              <BarChart3 className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.totalResources.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Vital Records</p>
            </Card>
            <Card className="text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
              <Download className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.monthlyDownloads.toLocaleString()}+</h3>
              <p className="text-gray-600 font-medium">Monthly Access</p>
            </Card>
            <Card className="text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
              <Users className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.activeUsers.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Registered Users</p>
            </Card>
            <Card className="text-center bg-white hover:shadow-lg transition-shadow border border-gray-200">
              <MapPin className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.communities}</h3>
              <p className="text-gray-600 font-medium">Regional Offices</p>
            </Card>
          </div>
        </section>

        {/* Vital Events Categories */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Vital Events Collections</h2>
            <button 
              onClick={() => navigate('/categories')}
              className="text-gray-700 hover:text-gray-900 font-medium flex items-center"
            >
              <Filter className="w-4 h-4 mr-2 text-gray-800" />
              View All Categories
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {vitalEvents.map((event) => (
              <Card 
                key={event.name}
                className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border border-gray-200"
                onClick={() => navigate(`/search?type=${event.name.toLowerCase().replace(' ', '-')}`)}
              >
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center ${event.color}`}>
                  <event.icon className="w-10 h-10 text-gray-800" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{event.name}</h3>
                <p className="text-2xl font-bold text-gray-800">{event.count}</p>
                <p className="text-sm text-gray-500 mt-1">records</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Regional Coverage */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Regional Coverage
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {regions.map((region) => (
              <Card 
                key={region}
                className="text-center hover:shadow-md transition-shadow cursor-pointer p-4 bg-white border border-gray-200"
                onClick={() => navigate(`/search?region=${region.toLowerCase().replace(' ', '-')}`)}
              >
                <MapPin className="w-8 h-8 text-gray-800 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm">{region}</h3>
                <p className="text-xs text-gray-500 mt-1">Regional data</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        {/* <section className="bg-[#1A3D64] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Contribute to National Statistics
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Help improve Ethiopia's civil registration system by submitting vital event data or accessing records for research and policy development.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => navigate('/contribute')}
              className="bg-white text-[#1A3D64] hover:bg-blue-50 px-8 py-3 rounded-lg font-bold transition-colors"
            >
              Submit Records
            </button>
            <button 
              onClick={() => navigate('/api-access')}
              className="border-2 border-white text-white hover:bg-white hover:text-[#1A3D64] px-8 py-3 rounded-lg font-bold transition-colors"
            >
              API Access
            </button>
            <button 
              onClick={() => navigate('/documentation')}
              className="border-2 border-white text-white hover:bg-white hover:text-[#1A3D64] px-8 py-3 rounded-lg font-bold transition-colors"
            >
              Documentation
            </button>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default Home;