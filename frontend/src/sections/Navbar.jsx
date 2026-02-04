import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { id: 1, name: 'Home', href: '#home' },
    { id: 2, name: 'About', href: '#about' },
    { id: 3, name: 'Work', href: '#work' },
    { id: 4, name: 'Contact', href: '#contact' },
  ];

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-5 mx-auto c-space">
          <a
            href="/"
            className="text-neutral-400 font-bold text-xl hover:text-white transition-colors"
          >
            GhostofWeb
          </a>

          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="text-neutral-400 hover:text-white focus:outline-none sm:hidden flex"
            aria-label="Toggle menu"
          >
            <img
              src={isOpen ? 'assets/close.svg' : 'assets/menu.svg'}
              alt="toggle"
              className="w-6 h-6"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="sm:flex hidden">
            <ul className="nav-ul">
              {navLinks.map(({ id, href, name }) => (
                <li key={id} className="nav-li">
                  <a href={href} className="nav-li_a">
                    {name}
                  </a>
                </li>
              ))}
              <li className="nav-li">
                <a
                  href="/resume.pdf"
                  download="Sahiljeet_Resume.pdf"
                  className="nav-li_a"
                >
                  Resume
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="nav-sidebar">
            <nav className="p-5">
              <ul className="nav-ul">
                {navLinks.map(({ id, href, name }) => (
                  <li key={id} className="nav-li">
                    <a href={href} className="nav-li_a">
                      {name}
                    </a>
                  </li>
                ))}
                <li className="nav-li">
                  <a
                    href="/resume.pdf"
                    download="Sahiljeet_Resume.pdf"
                    className="nav-li_a"
                  >
                    Resume
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
