import {Link, Outlet} from 'react-router-dom';
import { House, Search, Plus, User} from 'lucide-react';


const Layout = () => {
  return (
    <>
    <header>
      <div>
      <h1 className="mb-2 text-xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-pink-600 from-sky-400">Wild</span>Lens</h1>
        <div>
        </div>
      </div>
    </header>
    <main className="container mx-auto bg-gray-900 rounded-lg  mb-4 h-full">
      <Outlet />
    </main>
    <footer className="bg-gray-800 text-white text-center p-4 fixed bottom-0 w-full z-10 inset-x-0">
      <div>
        <nav>
          <ul className="flex justify-center space-x-20 text-lg">
            <li>
              <Link to="/"><House className="hover:opacity-85 hover:scale-105 ease-in-out"></House></Link>
            </li>
            <li>
              <Link to="/search" aria-label="Link to search page"><Search className="hover:opacity-85 hover:scale-105 ease-in-out"></Search></Link>
            </li>
            <li>
              <Link to="/post"><Plus className="hover:opacity-85 hover:scale-105 ease-in-out"></Plus></Link>
            </li>
            <li>
              <Link to="/user"><User className="hover:opacity-85 hover:scale-105 ease-in-out"></User></Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
    </>
  );
};

export default Layout
