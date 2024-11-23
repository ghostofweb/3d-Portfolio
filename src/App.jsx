import React from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Project from './sections/Project'
import Contact from './sections/Contact'
import { ToastContainer } from 'react-toastify';
import Footer from './sections/Footer'
const App = () => {
  return (
    <>
     <ToastContainer />
      <Navbar />
      <Hero/>
    <main className='max-w-7xl m-auto'>
      <About/>
      <Project/>
      <Contact/>
      <Footer/>
      </main>
      </>
  )
}

export default App