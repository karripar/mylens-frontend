import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './views/Home';
import Profile from './views/Profile';
import Post from './views/Post';
import Single from './views/Single';
import Search from './views/Search';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/user" element={<Profile />}></Route>
            <Route path="/post" element={<Post />}></Route>
            <Route path="/single" element={<Single />}></Route>
            <Route path="/search" element={<Search/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
