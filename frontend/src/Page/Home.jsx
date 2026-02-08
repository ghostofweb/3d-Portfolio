import Navbar from '../sections/Navbar.jsx'
import Hero from '../sections/Hero.jsx'
import About from '../sections/About.jsx'
import Project from '../sections/Project.jsx'
import { Experince } from '../sections/Experince.jsx'
import Contact from '../sections/Contact.jsx'
import Footer from '../sections/Footer.jsx'

const Home = () => {
  return (
    <div>
    <Navbar />
      <Hero/>
    <main className='max-w-7xl m-auto'>
      <About/>
      <Project/>
      <Experince/>
      <Contact/>
      <Footer/>
      </main>
    </div>
  )
}

export default Home