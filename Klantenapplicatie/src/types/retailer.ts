export type Retailer = {
  webId: string
  name: string
  demographics: {
    read: boolean
    append: boolean
    write: boolean
    control: boolean
  }
  orderHistory: {
    read: boolean
    append: boolean
    write: boolean
    control: boolean
  }
}
