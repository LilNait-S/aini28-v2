export interface Product {
  id: number
  urlImage: string
  title: string
  sizes: {
    id: number
    label: string
    price: number
    size: number
  }[]
}
