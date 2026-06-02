import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaBox,
  FaTools,
  FaBlog,
  FaInfoCircle,
  FaPhone,
  FaUserPlus,
} from "react-icons/fa"
import logo from "../assets/75logo.png"

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false)

  // Navigation links
  const navLinks = [
    { label: 'Home', href: '/', icon: null },
    {
      label: 'Shop',
      href: '/shop',
      icon: <FaBox size={16} />,
      submenu: [
        { label: 'Smartphones', href: '/shop/smartphones' },
        { label: 'Laptops & Computers', href: '/shop/laptops' },
        { label: 'Tablets', href: '/shop/tablets' },
        { label: 'Accessories', href: '/shop/accessories' },
        { label: 'Wearables', href: '/shop/wearables' },
      ]
    },
    {
      label: 'Services',
      href: '/services',
      icon: <FaTools size={16} />,
      submenu: [
        { label: 'Device Repairs', href: '/services/repairs' },
        { label: 'Tech Support', href: '/services/support' },
        { label: 'Trade-In Program', href: '/services/trade-in' },
        { label: 'Installation Service', href: '/services/installation' },
      ]
    },
    { label: 'Blog', href: '/blog', icon: <FaBlog size={16} /> },
    { label: 'About', href: '/about', icon: <FaInfoCircle size={16} /> },
    { label: 'Contact', href: '/contact', icon: <FaPhone size={16} /> },
  ]

  return (
    <>
      {/* STICKY TOP BAR (LOGO, SEARCH, ICONS) */}

      <header className='sticky top-0 z-50 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 
        border-b border-yellow-500/20 shadow-lg backdrop-blur-md'>

        <div className='max-w-7xl mx-auto px-4 py-3'>

          {/* FLEX CONTAINER */}
          <div className='flex items-center justify-between gap-4'>

            {/* ─── LEFT: LOGO ONLY ─── */}
            <Link
              to="/"
              className='flex-shrink-0 flex items-center gap-2 group hover:opacity-80 
                transition-opacity duration-300'
            >
              <div className='relative'>
                <img
                  src={logo}
                  alt='75techstore Logo'
                  className='h-18 w-auto object-contain'
                />
                <div className='absolute -bottom-1 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300' />
              </div>
            </Link>

            {/* ─── CENTER: SEARCH BAR ─── */}
            <div className={`hidden md:flex items-center flex-grow max-w-2xl 
              bg-white/5 border border-white/10 rounded-full px-1 py-1
              hover:border-yellow-500/50 focus-within:border-yellow-500 focus-within:shadow-lg
              focus-within:shadow-yellow-500/20 transition-all duration-300
            `}>
              <input
                type='text'
                placeholder='Search smartphones, laptops, accessories...'
                className='flex-grow px-5 py-2.5 bg-transparent text-white 
                  placeholder-gray-400 focus:outline-none text-sm'
              />
              <button className='bg-gradient-to-r from-yellow-500 to-yellow-600 
                hover:from-yellow-600 hover:to-yellow-700 text-gray-900 px-5 py-2.5 
                rounded-full transition-all duration-300 flex items-center gap-2
                font-semibold shadow-lg hover:shadow-yellow-500/50'>
                <FaSearch size={16} />
                <span className='hidden lg:inline text-sm'>Search</span>
              </button>
            </div>

            {/* ─── RIGHT: ICONS ─── */}
            <div className='flex items-center gap-2 lg:gap-4'>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setSearchActive(!searchActive)}
                className='md:hidden p-2.5 hover:bg-white/10 rounded-full 
                  transition-all duration-300 text-white hover:text-yellow-500'
                title='Search'
              >
                <FaSearch size={20} />
              </button>

              {/* Cart Icon */}
              <Link
                to='/cart'
                className='p-2.5 hover:bg-white/10 rounded-full transition-all 
                  duration-300 text-white hover:text-yellow-500 relative group'
                title='Shopping Cart'
              >
                <FaShoppingCart size={22} />
                <span className='absolute -top-1 -right-1 bg-red-500 text-white 
                  text-xs rounded-full w-5 h-5 flex items-center justify-center 
                  font-bold group-hover:scale-110 transition-transform duration-300'>
                  0
                </span>
              </Link>

              {/* Account Dropdown */}
              <div 
                className='relative group'
                onMouseEnter={() => setAuthDropdownOpen(true)}
                onMouseLeave={() => setAuthDropdownOpen(false)}
              >
                <button
                  className='hidden sm:flex items-center gap-2 px-4 py-2 rounded-full 
                    bg-white/10 hover:bg-white/20 text-white transition-all duration-300 
                    border border-white/20 hover:border-yellow-500 group'
                  title='Account'
                >
                  <FaUser size={18} className='group-hover:text-yellow-500 transition-colors' />
                  <span className='hidden lg:inline text-sm font-medium'>Account</span>
                  <FaChevronDown 
                    size={12} 
                    className='group-hover:text-yellow-500 transition-colors'
                  />
                </button>

                {/* Account Dropdown Menu */}
                {authDropdownOpen && (
                  <div className='absolute right-0 top-full pt-2 opacity-100 visible z-50'>
                    <div className='bg-gradient-to-b from-gray-800 to-gray-900 
                      border border-yellow-500/20 rounded-lg shadow-2xl backdrop-blur-md 
                      overflow-hidden min-w-56'>
                      
                      {/* Sign In Option */}
                      <Link
                        to='/login'
                        className='flex items-center gap-3 px-6 py-4 text-gray-200 
                          hover:text-yellow-500 hover:bg-white/5 transition-all 
                          duration-300 border-b border-white/10 text-sm font-medium'
                      >
                        <FaUser size={16} />
                        <div>
                          <p className='font-semibold'>Sign In</p>
                          <p className='text-xs text-gray-400'>Buy products</p>
                        </div>
                      </Link>

                      {/* Create Account Option */}
                      <Link
                        to='/signup'
                        className='flex items-center gap-3 px-6 py-4 text-gray-200 
                          hover:text-yellow-500 hover:bg-white/5 transition-all 
                          duration-300 border-b border-white/10 text-sm font-medium'
                      >
                        <FaUserPlus size={16} />
                        <div>
                          <p className='font-semibold'>Create Account</p>
                          <p className='text-xs text-gray-400'>Join as buyer or seller</p>
                        </div>
                      </Link>

                      {/* Seller Center Option */}
                      <Link
                        to='/seller'
                        className='flex items-center gap-3 px-6 py-4 text-gray-200 
                          hover:text-yellow-500 hover:bg-white/5 transition-all 
                          duration-300 text-sm font-medium'
                      >
                        <FaBox size={16} />
                        <div>
                          <p className='font-semibold'>Seller Center</p>
                          <p className='text-xs text-gray-400'>Sell on 75TechStore</p>
                        </div>
                      </Link>

                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='md:hidden p-2.5 hover:bg-white/10 rounded-full 
                  transition-all duration-300 text-white'
                title='Menu'
              >
                {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>

            </div>

          </div>

          {/* ─── MOBILE SEARCH BAR ─── */}
          {searchActive && (
            <div className='md:hidden mt-3 flex items-center gap-2'>
              <input
                type='text'
                placeholder='Search products...'
                className='flex-grow px-4 py-2.5 bg-white/10 border border-white/20 
                  rounded-lg text-white placeholder-gray-400 focus:outline-none 
                  focus:border-yellow-500 transition-all duration-300'
              />
              <button className='bg-yellow-500 hover:bg-yellow-600 text-gray-900 p-2.5 
                rounded-lg transition-all duration-300 font-semibold'>
                <FaSearch size={18} />
              </button>
            </div>
          )}

        </div>
      </header>

      
      {/* NAVIGATION MENU (DESKTOP) */}
      <nav className='hidden md:block bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 
        border-b border-yellow-500/20'>
        <div className='max-w-7xl mx-auto px-4'>
          <ul className='flex items-center justify-center gap-1 py-0'>
            {navLinks.map((link, index) => (
              <li
                key={index}
                className='relative group'
                onMouseEnter={() => link.submenu && setDropdownOpen(index)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <Link
                  to={link.href}
                  className='px-4 py-4 text-white font-medium text-sm lg:text-base 
                    flex items-center gap-2 hover:text-yellow-500 transition-colors 
                    duration-300 group-hover:text-yellow-500 relative'
                >
                  {link.icon}
                  {link.label}
                  {link.submenu && (
                    <FaChevronDown
                      size={14}
                      className='group-hover:rotate-180 transition-transform duration-300'
                    />
                  )}
                </Link>

                {/* ─── DROPDOWN MENU ─── */}
                {link.submenu && (
                  <div className='absolute left-0 top-full pt-0 opacity-0 invisible 
                    group-hover:opacity-100 group-hover:visible transition-all 
                    duration-300 z-50'>
                    <div className='bg-gradient-to-b from-slate-800 to-slate-900 
                      border border-yellow-500/20 rounded-lg shadow-2xl backdrop-blur-md 
                      overflow-hidden min-w-56 mt-0'>
                      {link.submenu.map((item, i) => (
                        <Link
                          key={i}
                          to={item.href}
                          className='block px-6 py-3.5 text-gray-200 hover:text-yellow-500 
                            hover:bg-white/5 transition-all duration-300 text-sm 
                            font-medium border-l-3 border-transparent 
                            hover:border-yellow-500'
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

    
      {/* MOBILE MENU */}
     
      {mobileMenuOpen && (
        <nav className='md:hidden bg-gradient-to-b from-slate-800 via-slate-900 
          to-neutral-900 border-b border-yellow-500/20 animate-in fade-in slide-in-from-top-2 
          duration-300'>
          <div className='max-w-7xl mx-auto px-4 py-4'>
            
            {/* Mobile Auth Links */}
            <div className='mb-4 pb-4 border-b border-white/10'>
              <Link
                to='/login'
                className='flex items-center gap-3 px-4 py-3 text-gray-200 
                  hover:text-yellow-500 hover:bg-white/5 rounded-lg transition-all 
                  duration-300 text-sm font-medium mb-2'
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUser size={16} />
                Sign In
              </Link>
              <Link
                to='/signup'
                className='flex items-center gap-3 px-4 py-3 text-gray-200 
                  hover:text-yellow-500 hover:bg-white/5 rounded-lg transition-all 
                  duration-300 text-sm font-medium mb-2'
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUserPlus size={16} />
                Create Account
              </Link>
              <Link
                to='/seller'
                className='flex items-center gap-3 px-4 py-3 text-gray-200 
                  hover:text-yellow-500 hover:bg-white/5 rounded-lg transition-all 
                  duration-300 text-sm font-medium'
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaBox size={16} />
                Become a Seller
              </Link>
            </div>

            {/* Navigation Links */}
            <ul className='flex flex-col gap-1'>
              {navLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === index ? null : index)}
                    className='w-full text-left px-4 py-3 text-white font-medium 
                      flex items-center justify-between gap-2 hover:text-yellow-500 
                      hover:bg-white/5 rounded-lg transition-all duration-300'
                  >
                    <div className='flex items-center gap-2'>
                      {link.icon}
                      {link.label}
                    </div>
                    {link.submenu && (
                      <FaChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          dropdownOpen === index ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Mobile Dropdown */}
                  {link.submenu && dropdownOpen === index && (
                    <div className='bg-white/5 rounded-lg mt-1 overflow-hidden'>
                      {link.submenu.map((item, i) => (
                        <Link
                          key={i}
                          to={item.href}
                          className='block px-6 py-3 text-gray-300 hover:text-yellow-500 
                            hover:bg-white/10 transition-all duration-300 text-sm 
                            border-l-3 border-transparent hover:border-yellow-500 
                            ml-2'
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </>
  )
}

export default Navbar