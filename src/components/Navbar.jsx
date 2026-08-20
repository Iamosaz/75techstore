import React, { useState, useRef, useCallback, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes,
  FaChevronDown, FaBox, FaTools, FaBlog, FaInfoCircle,
  FaPhone, FaUserPlus, FaSpinner, FaSignOutAlt, FaStore,
} from "react-icons/fa"
import { useSearch } from '../hooks/useSearch'
import { UserContext } from '../context/UserContext'
import { CartContext } from '../context/CartContext' // ✅ NEW
import logo from "../assets/75TechstoreLOGO.png"

function useDebounce(fn, delay) {
  const timer = useRef(null)
  return useCallback((...args) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false)
  const [searchActive, setSearchActive]         = useState(false)
  const [dropdownOpen, setDropdownOpen]         = useState(null)
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false)
  const [showSuggestions, setShowSuggestions]   = useState(false)
  const [mobileQuery, setMobileQuery]           = useState('')
  const [showMobileSug, setShowMobileSug]       = useState(false)

  const navigate = useNavigate()
  const { user, logout } = useContext(UserContext)
  const { cartCount } = useContext(CartContext) // ✅ NEW

  const {
    searchQuery, setSearchQuery,
    suggestions, isLoading,
    fetchSuggestions, clearSuggestions,
  } = useSearch()

  const debouncedFetch = useDebounce(fetchSuggestions, 400)

  const goToCategory = (category) => {
    setDropdownOpen(null)
    setMobileMenuOpen(false)
    navigate(category === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(category)}`)
  }

  const goToPage = (path) => {
    setDropdownOpen(null)
    setMobileMenuOpen(false)
    navigate(path)
  }

  const navLinks = [
    { label: 'Home', href: '/', icon: null },
    {
      label: 'Shop', href: '/shop', icon: <FaBox size={16} />,
      submenu: [
        { label: 'All Products',  category: 'All'         },
        { label: 'UK Used Items', page: '/shop?condition=UK Used' },
        { label: 'Brand New',     page: '/shop?condition=Brand New' },
        { label: 'Laptops',       category: 'Laptops'     },
        { label: 'Phones',        category: 'Phones'      },
        { label: 'Tablets',       category: 'Tablets'     },
        { label: 'Accessories',   category: 'Accessories' },
        { label: 'Storage',       category: 'Storage'     },
        { label: 'Gaming',        category: 'Gaming'      },
        { label: 'Audio',         category: 'Audio'       },
        { label: 'Cameras',       category: 'Cameras'     },
        { label: 'Smart Home',    category: 'Smart Home'  },
        { label: 'Consoles',      category: 'Consoles'    },
        { label: 'Other',         category: 'Other'       },
      ]
    },
    {
      label: 'Marketplace',
      href: '/marketplace',
      icon: <FaStore size={16} />,
      submenu: [
        { label: 'Browse Listings', page: '/marketplace'                },
        { label: 'Post an Ad',      page: '/marketplace/create-listing' },
        { label: 'Become a Seller', page: '/marketplace?role=seller'    },
        { label: 'Become a Buyer',  page: '/marketplace?role=buyer'     },
        { label: 'My Listings',     page: '/marketplace/dashboard'      },
        { label: 'Messages',        page: '/marketplace/messages'       },
        { label: 'Saved Items',     page: '/marketplace/saved'          },
      ]
    },
    {
      label: 'Services', href: '/services', icon: <FaTools size={16} />,
      submenu: [
        { label: 'All Services',     page: '/services'                   },
        { label: 'Device Repairs',   page: '/repairs'                    },
        { label: 'Book a Repair',    page: '/repairs?tab=book'           },
        { label: 'Track My Repair',  page: '/repairs?tab=track'          },
        { label: 'Request Engineer', page: '/requestengineer'            },
        { label: 'Digital Services', page: '/digital-services'           },
        { label: 'Get a Quote',      page: '/digital-services?tab=quote' },
      ]
    },
    { label: 'Blog',    href: '/blog',    icon: <FaBlog size={16} />       },
    { label: 'About',   href: '/about',   icon: <FaInfoCircle size={16} /> },
    { label: 'Contact', href: '/contact', icon: <FaPhone size={16} />      },
  ]

  const handleLogoClick = () => { window.location.href = '/' }

  const handleDesktopChange = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    if (val.trim().length >= 2) {
      debouncedFetch(val)
      setShowSuggestions(true)
    } else {
      clearSuggestions()
      setShowSuggestions(false)
    }
  }

  const handleDesktopSubmit = (e) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      clearSuggestions()
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false)
    setShowMobileSug(false)
    clearSuggestions()
    setSearchQuery(product.name)
    setMobileQuery(product.name)
    navigate(`/product/${product._id}`)
  }

  const handleMobileChange = (e) => {
    const val = e.target.value
    setMobileQuery(val)
    if (val.trim().length >= 2) {
      debouncedFetch(val)
      setShowMobileSug(true)
    } else {
      clearSuggestions()
      setShowMobileSug(false)
    }
  }

  const handleMobileSubmit = (e) => {
    e?.preventDefault()
    if (mobileQuery.trim()) {
      setShowMobileSug(false)
      setSearchActive(false)
      clearSuggestions()
      navigate(`/shop?keyword=${encodeURIComponent(mobileQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    setAuthDropdownOpen(false)
    setMobileMenuOpen(false)
    navigate('/')
  }

  const SuggestionDropdown = ({ onClose }) => (
    <div className='absolute top-full left-0 right-0 mt-2 bg-gray-900
      border border-yellow-500/30 rounded-xl shadow-2xl z-[999] overflow-hidden'>
      {isLoading && (
        <div className='flex items-center justify-center gap-2 px-4 py-4
          text-gray-400 text-sm'>
          <FaSpinner className='animate-spin' size={14} />
          Searching...
        </div>
      )}
      {!isLoading && suggestions.length > 0 && (
        <>
          <div className='px-4 py-2 bg-white/5 border-b border-white/10'>
            <p className='text-xs text-gray-400 font-medium'>
              {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} found
            </p>
          </div>
          {suggestions.map((product) => {
            const finalPrice = product.price - (product.discount || 0)
            return (
              <button key={product._id} type='button'
                onMouseDown={() => handleSuggestionClick(product)}
                className='w-full flex items-center gap-3 px-4 py-3
                  hover:bg-white/5 transition-all duration-200 text-left
                  border-b border-white/5 last:border-0'>
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/40'}
                  alt={product.name}
                  className='w-10 h-10 rounded-lg object-contain bg-white/10
                    flex-shrink-0 p-0.5' />
                <div className='flex-grow min-w-0'>
                  <p className='text-white text-sm font-medium truncate'>
                    {product.name}
                  </p>
                  <p className='text-gray-400 text-xs'>
                    {product.brand} • {product.category}
                  </p>
                </div>
                <div className='text-right flex-shrink-0'>
                  <p className='text-yellow-500 font-semibold text-sm'>
                    ₦{Number(finalPrice).toLocaleString()}
                  </p>
                  {product.discount > 0 && (
                    <p className='text-gray-500 text-xs line-through'>
                      ₦{Number(product.price).toLocaleString()}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
          <button type='button' onMouseDown={onClose}
            className='w-full px-4 py-3 text-yellow-500 text-sm font-semibold
              hover:bg-white/5 transition-all duration-200 flex items-center
              justify-center gap-2'>
            <FaSearch size={12} />
            See all results in Shop
          </button>
        </>
      )}
      {!isLoading && suggestions.length === 0 && (
        <div className='px-4 py-6 text-center'>
          <p className='text-gray-400 text-sm'>No products found</p>
          <p className='text-gray-500 text-xs mt-1'>Try a different keyword</p>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* STICKY TOP BAR */}
      <header className='sticky top-0 z-[100] bg-gradient-to-r from-neutral-900
        via-neutral-800 to-neutral-900 border-b border-yellow-500/20 shadow-lg
        backdrop-blur-md'>
        <div className='max-w-7xl mx-auto px-4 py-3'>
          <div className='flex items-center justify-between gap-4'>

            {/* LOGO */}
            <button onClick={handleLogoClick}
              className='flex-shrink-0 flex items-center hover:opacity-80
                transition-opacity duration-300 bg-transparent border-none
                cursor-pointer p-0'
              aria-label='Go to homepage'>
              <img src={logo} alt='75techstore Logo'
                className='h-14 w-auto object-contain' />
            </button>

            {/* DESKTOP SEARCH */}
            <form onSubmit={handleDesktopSubmit}
              className='hidden md:flex items-center flex-grow max-w-2xl relative'>
              <div className='flex items-center w-full bg-white/5 border
                border-white/10 rounded-full px-1 py-1
                hover:border-yellow-500/50 focus-within:border-yellow-500
                focus-within:shadow-lg focus-within:shadow-yellow-500/20
                transition-all duration-300'>
                <input type='text' value={searchQuery}
                  onChange={handleDesktopChange}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true)
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder='Search phones, laptops, accessories...'
                  className='flex-grow px-5 py-2.5 bg-transparent text-white
                    placeholder-gray-400 focus:outline-none text-sm' />
                <button type='submit'
                  className='bg-gradient-to-r from-yellow-500 to-yellow-600
                    hover:from-yellow-600 hover:to-yellow-700 text-gray-900
                    px-5 py-2.5 rounded-full transition-all duration-300
                    flex items-center gap-2 font-semibold shadow-lg
                    hover:shadow-yellow-500/50'>
                  {isLoading
                    ? <FaSpinner size={16} className='animate-spin' />
                    : <FaSearch size={16} />}
                  <span className='hidden lg:inline text-sm'>Search</span>
                </button>
              </div>
              {showSuggestions && (
                <SuggestionDropdown onClose={handleDesktopSubmit} />
              )}
            </form>

            {/* RIGHT ICONS */}
            <div className='flex items-center gap-2 lg:gap-4'>

              <button onClick={() => setSearchActive(!searchActive)}
                className='md:hidden p-2.5 hover:bg-white/10 rounded-full
                  transition-all duration-300 text-white hover:text-yellow-500'>
                <FaSearch size={20} />
              </button>

              {/* ✅ CART ICON WITH LIVE COUNT */}
              <Link to='/cart'
                className='p-2.5 hover:bg-white/10 rounded-full transition-all
                  duration-300 text-white hover:text-yellow-500 relative group'>
                <FaShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className='absolute -top-1 -right-1 bg-red-500
                    text-white text-xs rounded-full w-5 h-5 flex items-center
                    justify-center font-bold group-hover:scale-110
                    transition-transform duration-300'>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Marketplace Quick Button */}
              <Link to='/marketplace'
                className='hidden sm:flex items-center gap-2 px-4 py-2
                  rounded-full bg-orange-500 hover:bg-orange-600 text-white
                  font-semibold text-sm transition-all duration-300
                  hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/25'>
                <FaStore size={14} />
                <span className='hidden lg:inline'>Marketplace</span>
              </Link>

              {/* Account Dropdown */}
              <div className='relative'
                onMouseEnter={() => setAuthDropdownOpen(true)}
                onMouseLeave={() => setAuthDropdownOpen(false)}>
                <button className='hidden sm:flex items-center gap-2 px-4 py-2
                  rounded-full bg-white/10 hover:bg-white/20 text-white
                  transition-all duration-300 border border-white/20
                  hover:border-yellow-500 group'>
                  {user ? (
                    <div className='w-6 h-6 bg-yellow-500 rounded-full flex
                      items-center justify-center text-gray-900 text-xs font-bold'>
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <FaUser size={18}
                      className='group-hover:text-yellow-500 transition-colors' />
                  )}
                  <span className='hidden lg:inline text-sm font-medium'>
                    {user ? user.name?.split(' ')[0] : 'Account'}
                  </span>
                  <FaChevronDown size={12} />
                </button>

                {authDropdownOpen && (
                  <div className='absolute right-0 top-full pt-2 z-[999]'>
                    <div className='bg-gradient-to-b from-gray-800 to-gray-900
                      border border-yellow-500/20 rounded-lg shadow-2xl
                      overflow-hidden min-w-56'>

                      {user ? (
                        <>
                          <div className='px-6 py-4 border-b border-white/10
                            bg-white/5'>
                            <div className='flex items-center gap-3'>
                              <div className='w-9 h-9 bg-yellow-500 rounded-full
                                flex items-center justify-center text-gray-900
                                font-bold text-sm'>
                                {(user?.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className='text-white font-semibold text-sm'>
                                  {user.name}
                                </p>
                                <p className='text-gray-400 text-xs'>
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* ✅ Track Order Link */}
                          <Link to='/track-order'
                            className='flex items-center gap-3 px-6 py-3
                              text-gray-200 hover:text-yellow-500
                              hover:bg-white/5 transition-all duration-300
                              text-sm border-b border-white/10'>
                            <FaBox size={14} className='text-yellow-400' />
                            <span>Track My Order</span>
                          </Link>

                          <Link to='/marketplace'
                            className='flex items-center gap-3 px-6 py-3
                              text-gray-200 hover:text-orange-400
                              hover:bg-white/5 transition-all duration-300
                              text-sm border-b border-white/10'>
                            <FaStore size={14} className='text-orange-400' />
                            <span>Go to Marketplace</span>
                          </Link>

                          <Link to='/requestengineer'
                            className='flex items-center gap-3 px-6 py-3
                              text-gray-200 hover:text-yellow-500
                              hover:bg-white/5 transition-all duration-300
                              text-sm'>
                            <FaTools size={14} />
                            <span>Request Engineer</span>
                          </Link>

                          <Link to='/repairs?tab=track'
                            className='flex items-center gap-3 px-6 py-3
                              text-gray-200 hover:text-yellow-500
                              hover:bg-white/5 transition-all duration-300
                              text-sm border-b border-white/10'>
                            <FaTools size={14} />
                            <span>Track Repair</span>
                          </Link>

                          <button onClick={handleLogout}
                            className='flex items-center gap-3 px-6 py-3.5
                              text-red-400 hover:text-red-300 hover:bg-white/5
                              transition-all duration-300 text-sm w-full
                              text-left'>
                            <FaSignOutAlt size={14} />
                            <span>Log Out</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to='/login'
                            className='flex items-center gap-3 px-6 py-4
                              text-gray-200 hover:text-yellow-500
                              hover:bg-white/5 transition-all duration-300
                              border-b border-white/10 text-sm'>
                            <FaUser size={16} />
                            <div>
                              <p className='font-semibold'>Sign In</p>
                              <p className='text-xs text-gray-400'>
                                Access your account
                              </p>
                            </div>
                          </Link>

                          <Link to='/signup'
                            className='flex items-center gap-3 px-6 py-4
                              text-gray-200 hover:text-yellow-500
                              hover:bg-white/5 transition-all duration-300
                              border-b border-white/10 text-sm'>
                            <FaUserPlus size={16} />
                            <div>
                              <p className='font-semibold'>Create Account</p>
                              <p className='text-xs text-gray-400'>
                                Join 75TechStore
                              </p>
                            </div>
                          </Link>

                          <Link to='/marketplace?role=buyer'
                            className='flex items-center gap-3 px-6 py-4
                              text-gray-200 hover:text-orange-400
                              hover:bg-white/5 transition-all duration-300
                              border-b border-white/10 text-sm'>
                            <FaStore size={16} className='text-orange-400' />
                            <div>
                              <p className='font-semibold'>Become a Buyer</p>
                              <p className='text-xs text-gray-400'>
                                Shop on Marketplace
                              </p>
                            </div>
                          </Link>

                          <Link to='/marketplace?role=seller'
                            className='flex items-center gap-3 px-6 py-4
                              text-gray-200 hover:text-orange-400
                              hover:bg-white/5 transition-all duration-300
                              text-sm'>
                            <FaStore size={16} className='text-orange-400' />
                            <div>
                              <p className='font-semibold'>Become a Seller</p>
                              <p className='text-xs text-gray-400'>
                                Sell on Marketplace
                              </p>
                            </div>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='md:hidden p-2.5 hover:bg-white/10 rounded-full
                  transition-all duration-300 text-white'>
                {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH BAR */}
          {searchActive && (
            <form onSubmit={handleMobileSubmit}
              className='md:hidden mt-3 relative'>
              <div className='flex items-center gap-2'>
                <input type='text' value={mobileQuery}
                  onChange={handleMobileChange}
                  onBlur={() => setTimeout(() => setShowMobileSug(false), 200)}
                  placeholder='Search products...'
                  autoFocus
                  className='flex-grow px-4 py-2.5 bg-white/10 border
                    border-white/20 rounded-lg text-white placeholder-gray-400
                    focus:outline-none focus:border-yellow-500
                    transition-all duration-300' />
                <button type='submit'
                  className='bg-yellow-500 hover:bg-yellow-600 text-gray-900
                    p-2.5 rounded-lg transition-all duration-300 font-semibold'>
                  {isLoading
                    ? <FaSpinner size={18} className='animate-spin' />
                    : <FaSearch size={18} />}
                </button>
              </div>
              {showMobileSug && (
                <SuggestionDropdown onClose={handleMobileSubmit} />
              )}
            </form>
          )}
        </div>
      </header>

      {/* DESKTOP NAV */}
      <nav className='hidden md:block bg-gradient-to-r from-slate-800
        via-slate-800 to-slate-900 border-b border-yellow-500/20'>
        <div className='max-w-7xl mx-auto px-4'>
          <ul className='flex items-center justify-center gap-1 py-0'>
            {navLinks.map((link, index) => (
              <li key={index} className='relative group'
                onMouseEnter={() => link.submenu && setDropdownOpen(index)}
                onMouseLeave={() => setDropdownOpen(null)}>

                <Link to={link.href}
                  className={`px-4 py-4 font-medium text-sm lg:text-base
                    flex items-center gap-2 transition-colors duration-300
                    group-hover:text-yellow-500
                    ${link.label === 'Marketplace'
                      ? 'text-orange-400 hover:text-orange-300'
                      : 'text-white hover:text-yellow-500'
                    }`}>
                  {link.icon}
                  {link.label}
                  {link.submenu && (
                    <FaChevronDown size={14}
                      className='group-hover:rotate-180 transition-transform
                        duration-300' />
                  )}
                </Link>

                {link.submenu && (
                  <div className='absolute left-0 top-full opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible transition-all
                    duration-300 z-[999] min-w-56'>
                    <div className={`border rounded-lg shadow-2xl
                      overflow-hidden mt-0
                      ${link.label === 'Marketplace'
                        ? 'bg-gradient-to-b from-[#1a1a2e] to-[#16213e] border-orange-500/30'
                        : 'bg-gradient-to-b from-slate-800 to-slate-900 border-yellow-500/20'
                      }`}>
                      {link.submenu.map((item, i) => {
                        if (item.category !== undefined) {
                          return (
                            <button key={i}
                              onClick={() => goToCategory(item.category)}
                              className='w-full text-left block px-6 py-3.5
                                text-gray-200 hover:text-yellow-500
                                hover:bg-white/5 transition-all duration-300
                                text-sm font-medium'>
                              {item.label}
                            </button>
                          )
                        }
                        if (item.page !== undefined) {
                          return (
                            <button key={i}
                              onClick={() => goToPage(item.page)}
                              className={`w-full text-left block px-6 py-3.5
                                transition-all duration-300 text-sm font-medium
                                hover:bg-white/5
                                ${link.label === 'Marketplace'
                                  ? 'text-gray-200 hover:text-orange-400'
                                  : 'text-gray-200 hover:text-yellow-500'
                                }`}>
                              {item.label}
                            </button>
                          )
                        }
                        return (
                          <Link key={i} to={item.href}
                            className='block px-6 py-3.5 text-gray-200
                              hover:text-yellow-500 hover:bg-white/5
                              transition-all duration-300 text-sm font-medium'>
                            {item.label}
                          </Link>
                        )
                      })}
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
        <>
          <div className='fixed inset-0 bg-black/50 md:hidden z-40'
            onClick={() => setMobileMenuOpen(false)} />

          <nav className='fixed top-0 left-0 right-0 bottom-0 md:hidden
            z-[999] bg-gradient-to-b from-slate-800 via-slate-900
            to-neutral-900 overflow-y-auto pt-20'>
            <div className='max-w-7xl mx-auto px-4 py-4'>

              {/* Mobile Auth */}
              <div className='mb-4 pb-4 border-b border-white/10'>
                {user ? (
                  <>
                    <div className='flex items-center gap-3 px-4 py-3 mb-3'>
                      <div className='w-10 h-10 bg-yellow-500 rounded-full
                        flex items-center justify-center text-gray-900
                        font-bold'>
                        {(user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className='text-white font-semibold text-sm'>
                          {user.name}
                        </p>
                        <p className='text-gray-400 text-xs'>{user.email}</p>
                      </div>
                    </div>

                    {/* ✅ Track Order in mobile */}
                    <Link to='/track-order'
                      className='flex items-center gap-3 px-4 py-3
                        text-gray-200 hover:text-yellow-500 hover:bg-white/5
                        rounded-lg transition-all duration-300 text-sm
                        font-medium mb-2'
                      onClick={() => setMobileMenuOpen(false)}>
                      <FaBox size={16} className='text-yellow-400' />
                      <span>Track My Order</span>
                    </Link>

                    <button onClick={handleLogout}
                      className='flex items-center gap-3 px-4 py-3
                        text-red-400 hover:text-red-300 hover:bg-white/5
                        rounded-lg transition-all duration-300 text-sm
                        font-medium w-full'>
                      <FaSignOutAlt size={16} />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to='/login'
                      className='flex items-center gap-3 px-4 py-3
                        text-gray-200 hover:text-yellow-500 hover:bg-white/5
                        rounded-lg transition-all duration-300 text-sm
                        font-medium mb-2'
                      onClick={() => setMobileMenuOpen(false)}>
                      <FaUser size={16} />
                      <div>
                        <p className='font-semibold'>Sign In</p>
                        <p className='text-xs text-gray-400'>
                          Access your account
                        </p>
                      </div>
                    </Link>

                    <Link to='/signup'
                      className='flex items-center gap-3 px-4 py-3
                        text-gray-200 hover:text-yellow-500 hover:bg-white/5
                        rounded-lg transition-all duration-300 text-sm
                        font-medium mb-2'
                      onClick={() => setMobileMenuOpen(false)}>
                      <FaUserPlus size={16} />
                      <div>
                        <p className='font-semibold'>Create Account</p>
                        <p className='text-xs text-gray-400'>
                          Join 75TechStore
                        </p>
                      </div>
                    </Link>

                    <Link to='/marketplace?role=buyer'
                      className='flex items-center gap-3 px-4 py-3
                        text-gray-200 hover:text-orange-400 hover:bg-white/5
                        rounded-lg transition-all duration-300 text-sm
                        font-medium mb-2'
                      onClick={() => setMobileMenuOpen(false)}>
                      <FaStore size={16} className='text-orange-400' />
                      <div>
                        <p className='font-semibold'>Become a Buyer</p>
                        <p className='text-xs text-gray-400'>
                          Shop on Marketplace
                        </p>
                      </div>
                    </Link>

                    <Link to='/marketplace?role=seller'
                      className='flex items-center gap-3 px-4 py-3
                        text-gray-200 hover:text-orange-400 hover:bg-white/5
                        rounded-lg transition-all duration-300 text-sm
                        font-medium'
                      onClick={() => setMobileMenuOpen(false)}>
                      <FaStore size={16} className='text-orange-400' />
                      <div>
                        <p className='font-semibold'>Become a Seller</p>
                        <p className='text-xs text-gray-400'>
                          Sell on Marketplace
                        </p>
                      </div>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Marketplace */}
              <div className='mb-4 pb-4 border-b border-white/10'>
                <Link to='/marketplace'
                  onClick={() => setMobileMenuOpen(false)}
                  className='flex items-center gap-3 px-4 py-3
                    bg-orange-500/20 border border-orange-500/30 rounded-xl
                    text-orange-400 font-semibold text-sm transition-all
                    duration-300 hover:bg-orange-500/30'>
                  <FaStore size={18} />
                  <div>
                    <p className='font-bold'>75 Marketplace</p>
                    <p className='text-xs text-orange-300/70'>
                      Buy & Sell · Become a Seller · Become a Buyer
                    </p>
                  </div>
                </Link>
              </div>

              {/* Mobile Nav Links */}
              <ul className='flex flex-col gap-1 mb-8'>
                {navLinks.map((link, index) => (
                  <li key={index}>
                    {link.submenu ? (
                      <button
                        onClick={() =>
                          setDropdownOpen(dropdownOpen === index ? null : index)
                        }
                        className={`w-full text-left px-4 py-3 font-medium
                          flex items-center justify-between gap-2
                          hover:bg-white/5 rounded-lg transition-all duration-300
                          ${link.label === 'Marketplace'
                            ? 'text-orange-400 hover:text-orange-300'
                            : 'text-white hover:text-yellow-500'
                          }`}>
                        <div className='flex items-center gap-2'>
                          {link.icon}
                          {link.label}
                        </div>
                        <FaChevronDown size={14}
                          className={`transition-transform duration-300
                            ${dropdownOpen === index ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <button
                        onClick={() => goToPage(link.href)}
                        className='w-full text-left px-4 py-3 text-white
                          font-medium flex items-center gap-2
                          hover:text-yellow-500 hover:bg-white/5 rounded-lg
                          transition-all duration-300'>
                        {link.icon}
                        {link.label}
                      </button>
                    )}

                    {link.submenu && dropdownOpen === index && (
                      <div className='bg-white/5 rounded-lg mt-1 overflow-hidden'>
                        {link.submenu.map((item, i) => {
                          if (item.category !== undefined) {
                            return (
                              <button key={i}
                                onClick={() => goToCategory(item.category)}
                                className='w-full text-left block px-6 py-3
                                  text-gray-300 hover:text-yellow-500
                                  hover:bg-white/10 transition-all duration-300
                                  text-sm ml-2'>
                                {item.label}
                              </button>
                            )
                          }
                          if (item.page !== undefined) {
                            return (
                              <button key={i}
                                onClick={() => goToPage(item.page)}
                                className={`w-full text-left block px-6 py-3
                                  hover:bg-white/10 transition-all duration-300
                                  text-sm ml-2
                                  ${link.label === 'Marketplace'
                                    ? 'text-gray-300 hover:text-orange-400'
                                    : 'text-gray-300 hover:text-yellow-500'
                                  }`}>
                                {item.label}
                              </button>
                            )
                          }
                          return (
                            <Link key={i} to={item.href}
                              className='block px-6 py-3 text-gray-300
                                hover:text-yellow-500 hover:bg-white/10
                                transition-all duration-300 text-sm ml-2'
                              onClick={() => setMobileMenuOpen(false)}>
                              {item.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {/* Close Button */}
              <div className='pt-4 border-t border-white/10'>
                <button onClick={() => setMobileMenuOpen(false)}
                  className='w-full px-4 py-3 bg-red-600 hover:bg-red-700
                    text-white rounded-lg font-bold transition-all duration-300
                    flex items-center justify-center gap-2'>
                  <FaTimes size={18} />
                  Close Menu
                </button>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  )
}

export default Navbar