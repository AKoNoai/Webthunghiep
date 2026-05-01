export default function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-extrabold mb-4 text-emerald-300">eCommerce</h3>
            <p className="text-slate-300 leading-relaxed">Your one-stop shop for quality products and effortless checkout.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-100">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-emerald-300">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-300">Contact</a></li>
              <li><a href="#" className="hover:text-emerald-300">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-100">Support</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-emerald-300">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-300">Track Order</a></li>
              <li><a href="#" className="hover:text-emerald-300">Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-100">Contact Info</h4>
            <p className="text-slate-300">Email: support@ecommerce.com</p>
            <p className="text-slate-300">Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-slate-700/70 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 eCommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
