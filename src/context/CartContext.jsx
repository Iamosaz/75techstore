// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { UserContext } from './UserContext'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext)

  // ✅ Load cart from localStorage on startup
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('75cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('75cart', JSON.stringify(cartItems))
  }, [cartItems])

  // ✅ Clear cart when user logs out
  useEffect(() => {
    if (!user) {
      setCartItems([])
      localStorage.removeItem('75cart')
    }
  }, [user])

  // ✅ Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id)
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  product.stock
                )
              }
            : item
        )
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          condition: product.condition,
          grade: product.grade,
          stock: product.stock,
          quantity
        }
      ]
    })
  }

  // ✅ Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId))
  }

  // ✅ Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    )
  }

  // ✅ Clear entire cart
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('75cart')
  }

  // ✅ Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some((item) => item._id === productId)
  }

  // ✅ Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item._id === productId)
    return item ? item.quantity : 0
  }

  // ✅ Totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  )
}