const Footer = () => {
  return (
    <footer className="bg-[#0C2B4E]  py-8 mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Ministry of Innovation & Technology</h3>
            <p className="text-sm">
              Advancing Ethiopia through technology and innovation
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="text-sm space-y-2">
              <p>Email: contact@mint.gov.et</p>
              <p>Phone: +251900000000</p>
              <p>Address: Addis Ababa, Ethiopia</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="text-sm space-y-2">
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
              <p>Help & Support</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Ministry of Innovation & Technology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;