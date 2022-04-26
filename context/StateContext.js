import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export const Context = createContext()

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItem] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantities, setTotalQuantities] = useState(0)
  const [qty, setQty] = useState(1)

  let foundProduct
  let index

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(item => item._id === product._id)

    setTotalPrice(prev => prev + product.price * quantity)
    setTotalQuantities(prev => prev + quantity)

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map(cartProduct => {
        if (cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity + quantity
        }
      })

      setCartItem(updatedCartItems)
    } else {
      product.quantity = quantity
      setCartItem([...cartItems, { ...product }])
    }

    toast.success(`${qty} ${product.name} added to the cart.`)
  }

  const onRemove = (product) => {
    foundProduct = cartItems.find(item => item._id === product._id)
    const newCartItems = cartItems.filter(item => item._id !== product._id)

    setTotalPrice(prev => prev - foundProduct.price * foundProduct.quantity)
    setTotalQuantities(prev => prev - foundProduct.quantity)
    setCartItem(newCartItems)
  }

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find(item => item._id === id)
    index = cartItems.findIndex(product => product._id === id)
    const newCartItems = cartItems.filter(item => item._id !== id)

    if (value === 'inc') {
      setCartItem([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }])
      setTotalPrice(prev => prev + foundProduct.price)
      setTotalQuantities(prev => prev + 1)
    } else if (value === 'dec') {
      if (foundProduct.quantity > 1) {
        setCartItem([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }])
        setTotalPrice(prev => prev + foundProduct.price)
        setTotalQuantities(prev => prev - 1)
      }
    }
  }
  const incQty = () => {
    setQty(prev => prev + 1)
  }
  const decQty = () => {
    setQty(prev => {
      if (prev - 1 < 1) return 1;
      return prev - 1
    })
  }

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItem,
        setTotalPrice,
        setTotalQuantities
      }}
    >
      {children}
    </Context.Provider>
  )
}
export const useStateContext = () => useContext(Context)