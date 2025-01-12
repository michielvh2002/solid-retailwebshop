import type { Product } from '@/types/product'

export const products: Array<Product> = [
  {
    name: "Chips Salt 'n Pepper - Lays",
    category: 'Food',
    price: 3.99,
    currency: 'EUR',
    image:
      'https://cdn.webshopapp.com/shops/70983/files/412435960/800x1024x2/lays-salt-n-pepper-40g-x-20st.jpg',
    brand: ' Lays',
  },
  {
    name: 'Vranken | Champagne | Premier Cru | Brut 75 cl',
    category: 'Champagne',
    price: 45.98,
    currency: 'EUR',
    image:
      'https://static.delhaize.be/medias/sys_master/h4f/h5c/11150744027166.jpg?buildNumber=7bc843440e2d22bfe6673f0b08c7a4393a2360c53e3b917915391836ebe59221&imwidth=320',
    brand: 'Vranken',
  },
]

// name: string
// category: string
// price: number
// currency: string
// image: string
// brand: string
