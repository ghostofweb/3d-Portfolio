import { ToastContainer } from 'react-toastify';
import Home from './Page/Home.jsx';
import { Route, Routes } from 'react-router-dom';
import AdminLogin from './Page/AdminLogin.jsx';
import Dashboard from './Page/Dashboard.jsx';
import CreateBlog from './Page/CreateBlog.jsx';
import UpdateBlog from './Page/UpdateBlog.jsx';
import Blogs from './Page/Blogs.jsx';
import BlogDetails from './Page/BlogDetails.jsx';

const App = () => {
  return (
    <>
    <ToastContainer position="bottom-right" theme="dark" />
    <Routes>
     <Route path='/' element={<Home/>}/>
     <Route path="/blogs" element={<Blogs/>}/>
     <Route path="/blog/:slug" element={<BlogDetails/>}/>
     <Route path="/admin/login" element={<AdminLogin/>}/>
     <Route path="/admin/dashboard" element={<Dashboard />} />
     <Route path='/admin/create-blog' element={<CreateBlog/>}/>
     <Route path="/admin/edit-blog/:slug" element={<UpdateBlog />} />

    </Routes>
      </>
  )
}
export default App