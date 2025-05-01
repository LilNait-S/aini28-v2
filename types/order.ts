import { ProductCart } from "@/lib/states/shopping-car"
import { CustomerContact } from "@/lib/validations/customer-contact"

export interface OrderPayload extends Record<string, unknown> {
  userDetails: CustomerContact
  cartItems: ProductCart[]
}
