import { Product } from "@/sanity/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ProductCart {
  _id: string
  images: Product["images"]
  name: string
  qty: number
  price: number
  salePrice?: number
  finalPrice: number
  selectedSize: number
}

type State = {
  totalPrice: number
  cartItems: ProductCart[]
  qty: number
  showCart: boolean
  totalQuantities: number
}

type Action = {
  onAddToCart: ({
    _id,
    images,
    name,
    price,
    salePrice,
    finalPrice,
    qty,
    selectedSize,
  }: ProductCart) => void
  onRemove: (productId: string, selectedSize: number) => void
  toggleCartItemQuantity: ({
    _id,
    selectedSize,
    value,
  }: {
    _id: string
    selectedSize: number
    value: "inc" | "dec"
  }) => void
  incQty: () => void
  decQty: () => void
}

const calculateTotals = (items: ProductCart[]) => {
  const totalPrice = items.reduce((acc, item) => acc + item.finalPrice * item.qty, 0)
  const totalQuantities = items.reduce((acc, item) => acc + item.qty, 0)
  return { totalPrice, totalQuantities }
}

export const useCartState = create(
  persist<State & Action>(
    (set, get) => ({
      totalPrice: 0,
      cartItems: [],
      qty: 1,
      showCart: false,
      totalQuantities: 0,

      onAddToCart: ({
        _id,
        price,
        salePrice,
        finalPrice,
        qty,
        selectedSize,
        images,
        name,
      }) => {
        const { cartItems } = get()

        const existingProductIndex = cartItems.findIndex(
          (item) => item._id === _id && item.selectedSize === selectedSize
        )

        const existingProduct = cartItems[existingProductIndex]

        let updatedCartItems

        if (existingProduct) {
          updatedCartItems = [...cartItems]
          updatedCartItems[existingProductIndex] = {
            ...existingProduct,
            qty: existingProduct.qty + qty,
          }
        } else {
          updatedCartItems = [
            ...cartItems,
            {
              _id,
              images,
              name,
              price,
              salePrice,
              finalPrice,
              qty,
              selectedSize,
            },
          ]
        }

        const { totalPrice, totalQuantities } =
          calculateTotals(updatedCartItems)

        set({
          cartItems: updatedCartItems,
          totalPrice,
          totalQuantities,
        })
      },

      onRemove: (productId, selectedSize) => {
        const { cartItems } = get()
        const updatedCartItems = cartItems.filter(
          (item) =>
            !(item._id === productId && item.selectedSize === selectedSize)
        )

        const { totalPrice, totalQuantities } =
          calculateTotals(updatedCartItems)

        set({
          cartItems: updatedCartItems,
          totalPrice,
          totalQuantities,
        })
      },

      toggleCartItemQuantity: ({ _id, selectedSize, value }) => {
        const { cartItems } = get()
        const index = cartItems.findIndex(
          (item) => item._id === _id && item.selectedSize === selectedSize
        )
        const product = cartItems[index]
        if (!product) return

        const updatedCartItems = [...cartItems]

        if (value === "inc") {
          updatedCartItems[index] = {
            ...product,
            qty: product.qty + 1,
          }
        } else if (value === "dec" && product.qty > 1) {
          updatedCartItems[index] = {
            ...product,
            qty: product.qty - 1,
          }
        }

        const { totalPrice, totalQuantities } =
          calculateTotals(updatedCartItems)

        set({
          cartItems: updatedCartItems,
          totalPrice,
          totalQuantities,
        })
      },

      incQty: () => set((state) => ({ qty: state.qty + 1 })),

      decQty: () =>
        set((state) => ({
          qty: state.qty > 1 ? state.qty - 1 : state.qty,
        })),
    }),
    {
      name: "cart-storage",
    }
  )
)
