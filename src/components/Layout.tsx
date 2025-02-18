import {Link, Outlet} from 'react-router-dom';



const Layout = () => {
  return (
    <>
    <header>
      <div>
        <h1>WildLens</h1>
        <div>
        </div>
      </div>
    </header>
    <main className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-lg mt-4">
      <Outlet />
    </main>
    <footer className="bg-gray-800 text-white text-center p-4 fixed bottom-0 w-full z-10 inset-x-0">
      <div>
        <nav>
          <ul className="flex justify-center space-x-15 text-lg">
            <li>
              <Link to="/"><i aria-label="Link to home page" className="fa-solid fa-house hover:opacity-80 transition-opacity duration-200"></i></Link>
            </li>
            <li>
              <Link to="/search" aria-label="Link to search page"><i className="fa-solid fa-search hover:opacity-80 transition-opacity duration-200"></i></Link>
            </li>
            <li>
              <Link to="/post"><i aria-label="link to upload" className="fa-solid fa-plus hover:opacity-80 transition-opacity duration-200"></i></Link>
            </li>
            <li>
              <Link to="/user"><i aria-label="link to user page" className="fa-regular fa-user hover:opacity-80 transition-opacity duration-200"></i></Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
    </>
  );
};

export default Layout
