import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/apiClient';

export const Navbar = () => {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    api.get('/services').then(setAllServices).catch(err => {
      console.warn('Failed to load services for search:', err);
      setAllServices([]);
    });
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = allServices.filter(
      s => s.title.toLowerCase().includes(query) || s.shortDesc.toLowerCase().includes(query)
    ).slice(0, 5);
    setSearchResults(filtered);
  }, [searchQuery, allServices]);

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <img src="/loree-logo.png" alt="Loree Network Solutions" className="navbar-logo-img" />
        </Link>
        <nav className="navbar-nav">
          <NavLink to="/services" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Services
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Company Profile
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Contact
          </NavLink>
        </nav>
        <div className="navbar-actions">
          <div className={`search-container ${searchOpen ? 'open' : ''}`}>
            {searchOpen ? (
              <div className="search-box">
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  className="search-input"
                  onKeyDown={e => {
                    if (e.key === 'Escape') {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="icon-btn"
                >
                  <X size={18} />
                </button>
                {searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map(result => (
                      <Link
                        key={result.id}
                        to={`/services/${result.slug}`}
                        className="search-result-item"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                      >
                        <span className="search-result-icon">🔧</span>
                        <div>
                          <div className="search-result-name">{result.title}</div>
                          <div className="search-result-price">{result.shortDesc.slice(0, 55)}…</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search size={20} strokeWidth={1.8} />
              </button>
            )}
          </div>
          <Link to="/profile" className="icon-btn profile-btn" aria-label="Account">
            <User size={20} strokeWidth={1.8} />
            {user && <span className="profile-dot" />}
          </Link>
          <button
            className="icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav className="mobile-nav">
          <NavLink to="/services" onClick={() => setMobileMenuOpen(false)}>
            Services
          </NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
            Company Profile
          </NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </NavLink>
        </nav>
      )}
    </header>
  );
};
