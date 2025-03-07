import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './views/Home';
import Profile from './views/Profile';
import Search from './views/Search';
import useUserContext from './hooks/contextHooks';
import Login from './views/Login';
import UserProvider from './contexts/UserProvider';
import Upload from './views/Upload';
import Single from './views/Single';
import Logout from './views/Logout';
import VisitProfile from './views/VisitProfile';
import TagMedia from './views/TagMedia';
import NotFound from './views/NotFound';
import Saved from './views/Saved';

const ProfilePage = () => {
  const {user} = useUserContext();

  return user ? <Profile/> : <Login/>;
};

const App = () => {

  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <UserProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/user" element={<ProfilePage />}></Route>
            <Route path="/profile/:username" element={<VisitProfile />}></Route>
            <Route path="/post" element={<Upload />}></Route>
            <Route path="/single" element={<Single/>}></Route>
            <Route path="/search" element={<Search/>}></Route>
            <Route path="/logout" element={<Logout/>}></Route>
            <Route path="/tag/:tag" element={<TagMedia/>}></Route>
            <Route path="/saved" element={<Saved/>}></Route>
            <Route path="*" element={<NotFound/>}></Route>
          </Route>
        </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
