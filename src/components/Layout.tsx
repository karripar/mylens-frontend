import {Link, Outlet} from 'react-router';
import {House, Search, Plus, User, Save} from 'lucide-react';
import useUserContext from '../hooks/contextHooks';

const Layout = () => {
  const {user} = useUserContext();
  return (
    <>
      <header>
        <div>
          <h1 className="mb-2 text-xl font-extrabold text-white md:text-4xl lg:text-5xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-pink-600 from-sky-400">
              My
            </span>
            Lens
          </h1>
        </div>
      </header>
      <main className="container mx-auto dark:bg dark:bg-gray-900 light:bg-gray-200 text-gray-900 rounded-lg mb-4 h-full">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 fixed bottom-0 w-full py-6 z-10 inset-x-0">
        <div>
          <nav>
            <ul className="flex justify-center space-x-10 sm:space-x-14 md:space-x-20 text-lg">
              <li>
                <Link to="/">
                  <House
                    aria-label="link to home page"
                    className="hover:opacity-85 hover:scale-105 ease-in-out"
                  ></House>
                </Link>
              </li>
              <li>
                <Link to="/search" aria-label="Link to search page">
                  <Search className="hover:opacity-85 hover:scale-105 ease-in-out"></Search>
                </Link>
              </li>
              <li>
                <Link to="/post">
                  <Plus
                    aria-label="link to posting media"
                    className="hover:opacity-85 hover:scale-105 ease-in-out"
                  ></Plus>
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/saved">
                    <Save
                      aria-label="link to saved items"
                      className="hover:opacity-85 hover:scale-105 ease-in-out"
                    ></Save>
                  </Link>
                </li>
              )}
              <li>
                <Link to="/user">
                  <User
                    aria-label="link to profile and login"
                    className="hover:opacity-85 hover:scale-105 ease-in-out"
                  ></User>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </>
  );
};

export default Layout;
