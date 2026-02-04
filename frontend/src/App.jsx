import { ToastContainer } from 'react-toastify';
import Home from './Page/Home.jsx';
import { Route, Routes } from 'react-router-dom';
import AllBlogs from './Page/AllBlogs.jsx';
import BlogDetails from './Page/BlogDetails.jsx';
import AdminLogin from './Page/AdminLogin.jsx';
import Dashboard from './Page/Dashboard.jsx';
import CreateBlog from './Page/CreateBlog.jsx';
import UpdateBlog from './Page/UpdateBlog.jsx';
const App = () => {
  return (
    <>
    <ToastContainer position="bottom-right" theme="dark" />
    <Routes>
     <Route path='/' element={<Home/>}/>
     <Route path="/blogs" element={<AllBlogs/>}/>
     <Route path="/blog/:slug" element={<BlogDetails/>}/>
     <Route path="/cyberpunk2077/arasaka/jhonny-silverhand/login" element={<AdminLogin/>}/>
     <Route path="/admin/dashboard" element={<Dashboard />} />
     <Route path='/admin/create-blog' element={<CreateBlog/>}/>
     <Route path="/admin/edit-blog/:slug" element={<UpdateBlog />} />

    </Routes>
      </>
  )
}
export default App