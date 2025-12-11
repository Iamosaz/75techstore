import React from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaSearch, FaBars } from "react-icons/fa";
import logo from "../assets/75logo.png";

const Navbar = () => {
  return (
    <header className='bg-neutral-900 text-white shadow-md'>
         {/* TOP BAR */}
         <div className='max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-3'>
           {/* LOGO */}
           <Link to="/" className='flex items-center gap-2'>
             <img src={logo} alt='75techstore Logo' className='w-auto h-18 object-contain'/>
           </Link>

           {/* SearchBar  */}
           <div className='flex-grow max-w-lg hidden md:flex items-center bg-white rounded-md overflow-x-hidden text-gray-700'>
              <input 
                type='text'
                placeholder='Search products, categories, services on 75techstore'
              className='flex-grow px-6 py-3 text-justify focus:outline-none'/>
              <button className='bg-accent-yellow-500 text-gray-800 px-4 py-2 font-semibold hover:bg-accent-yellow-400 transition rounded-xl'>
                 <FaSearch />
              </button>
           </div>
           {/* Icons Buttons */}
           <div className='flex items-center gap-5 text-xl'>
              <Link to='/cart' className='hover:text-accent-yellow-500 transition'>
                 <FaShoppingCart />
              </Link>
               <Link to='/login' className='hover:text-accent-yellow-500 transition'>
                 <div className='flex items-center gap-2'> <FaUser />SignIn <span>Account</span></div>
                
              </Link>
              {/* menu icon for mobile view */}
               <button className='md:hidden text-2xl hover:accent-accent-yellow-500 transition'>
                 <FaBars />
              </button>
           </div>
         </div>

         {/* Lower Navbar links (shows on wider screen) */}
         <nav className=' bg-blue-400 hidden md:block'>
           <ul className=' mx-auto flex px-8 py-3 font-light justify-center whitespace-nowrap gap-x-8 text-lg overflow-hidden'>
             <li><Link to='/' className='bg-white text-black py-1 px-3 rounded-3xl hover:text-accent-yellow-500 transition'>Home</Link></li>
             <li><Link to='/shop' className='bg-white text-black py-1 px-3 rounded-3xl hover:text-accent-yellow-500 transition'>Shop</Link></li>
            <li><Link to='/accessories' className='bg-white text-black py-1 px-3 rounded-3xl hover:text-accent-yellow-500 transition'>Accessories</Link></li>
            <li><Link to='/assistant' className='bg-white text-black py-1 px-3 rounded-3xl hover:text-accent-yellow-500 transition'>Assistant</Link></li>
             <li><Link to='/repairs' className='bg-white text-black py-1 px-3 rounded-3xl hover:text-accent-yellow-500 transition'>Repairs</Link></li>
             {/* <li><Link to='/request engineer' className='bg-white text-black py-1 px-3 rounded-3xl hover:text-accent-yellow-500 transition'>Request Engineer</Link></li> */}
             {/* <li><Link to='/digital services' className='bg-white text-black py-1 px-3 rounded-3xl hover:text-accent-yellow-500 transition'>Digital services</Link></li> */}
             <li><Link to='/blog'className='bg-white text-black py-1 px-3 rounded-3xl hover:text-accent-yellow-500 transition'>Blog</Link></li>
             <li><Link to='/about' className='bg-white text-black py-1 px-3 rounded-3xl hover:text-accent-yellow-500 transition'>About</Link></li>
             <li><Link to='/contact' className='bg-white text-black py-1 px-3 rounded-3xl hover:text-accent-yellow-500 transition'>Contact</Link></li>
           </ul>
         </nav>
    </header>
  )
}

export default Navbar
