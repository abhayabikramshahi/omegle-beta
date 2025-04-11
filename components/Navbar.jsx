import { Link } from 'react-router-dom';
import logo from '../src/assets/logo.png';
import '../src/App.css';

function Navbar() {
  return (
    <nav className="bg-white py-2 px-6 border-b border-gray-300 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center max-w-screen-lg">
        {/* Logo and Text */}
       
          <span className="text-2xl font-bold text-blue-600">TalksYou</span> {/* Text next to the logo */}
    

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-lg font-medium">
          <li>
            <Link className="text-gray-800 hover:text-gray-500 transition duration-200" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="text-gray-800 hover:text-gray-500 transition duration-200" to="/ConnectWorldWide">
              ConnectWorldWides
            </Link>
          </li>
        
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
