import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { id: 1, name: 'Home', href: '#home' },
    { id: 2, name: 'About', href: '#about' },
    { id: 3, name: 'Work', href: '#work' },
    { id: 4, name: 'Contact', href: '#contact' },
    { id: 5, name: 'Blogs', href: '/blogs' } 
  ];

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20 mx-auto">
          
          <a
            href="/"
            className="text-white font-bold text-2xl tracking-tight hover:text-neutral-300 transition-colors"
          >
            GhostofWeb
          </a>

          {/* --- HAMBURGER MENU (Mobile) --- */}
          <button
            onClick={toggleMenu}
            className="text-neutral-400 hover:text-white focus:outline-none sm:hidden flex"
            aria-label="Toggle menu"
          >
            <img
              src={isOpen ? 'assets/close.svg' : 'assets/menu.svg'}
              alt="toggle"
              className="w-8 h-8"
            />
          </button>

          <nav className="sm:flex hidden items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map(({ id, href, name }) => {
                const isBlog = name === 'Blogs';
                return (
                  <li key={id}>
                    <a
                      href={href}
                      className={
                        isBlog
                          ? "bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:bg-neutral-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]" // Increased shadow for pop
                          : "text-neutral-300 text-sm font-medium hover:text-white transition-colors relative group"
                      }
                    >
                      {name}
                      {/* Underline animation for standard links */}
                      {!isBlog && (
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                      )}
                    </a>
                  </li>
                );
              })}

              {/* Resume Link */}
              <li>
                <a
                  href="/resume.pdf"
                  download="Sahiljeet_Resume.pdf"
                  className="text-neutral-300 text-sm font-medium hover:text-white transition-colors"
                >
                  Resume
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={`absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl overflow-hidden transition-[max-height] duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <nav className="p-8 flex flex-col gap-6 items-center">
            {navLinks.map(({ id, href, name }) => {
               const isBlog = name === 'Blogs';
               return (
                <a 
                  key={id} 
                  href={href} 
                  className={
                    isBlog
                    ? "w-full max-w-xs text-center bg-white text-black py-3 rounded-xl font-bold text-lg hover:bg-neutral-200 transition-colors"
                    : "text-neutral-300 font-medium text-lg hover:text-white transition-colors"
                  }
                  onClick={toggleMenu}
                >
                  {name}
                </a>
               )
            })}
    <a
  href="/resume.pdf"
  download="Sahiljeet_Resume.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="text-neutral-300 text-sm font-medium hover:text-white transition-colors"
>
  Resume
</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;