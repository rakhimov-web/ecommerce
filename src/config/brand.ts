export const brand = {
  name: "Texno Demo",
  logo: "/brand/logo-demo.svg",
  placeholder: "/placeholders/image-placeholder.svg",
  phone: "DEMO: +998 XX XXX XX XX",
  address: "DEMO: manzil hali belgilanmagan",
  hours: "DEMO: ish vaqti hali belgilanmagan",
  delivery: { fee: 30000, freeFrom: 2000000, minOrder: 100000 },
  features: {
    installment: false,
    onlinePayments: false,
    reviews: true,
    compare: false,
    telegramNotifications: false,
    pwa: false,
  },
} as const;
