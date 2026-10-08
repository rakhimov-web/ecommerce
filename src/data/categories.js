import telefonImg from "../assets/categories/telefon.png";
import noutbukImg from "../assets/categories/noutbuk.png";
import ipadImg from "../assets/categories/ipad.png";
import watchImg from "../assets/categories/apple-watch.png";
import aksessuarlarImg from "../assets/categories/aksessuarlar.png";
import { productsData } from "./products";

export const CATEGORIES = [
  {
    id: "telefon",
    title: "Telefon",
    name: "Smartfonlar",
    subtitle: "Apple iPhone va smartfonlar",
    icon: telefonImg,
    query: "telefon",
  },
  {
    id: "noutbuk",
    title: "Noutbuk",
    name: "Noutbuklar",
    subtitle: "Apple MacBook va noutbuklar",
    icon: noutbukImg,
    query: "noutbuk",
  },
  {
    id: "ipad",
    title: "iPad",
    name: "Planshetlar",
    subtitle: "Apple iPad va planshetlar",
    icon: ipadImg,
    query: "ipad",
  },
  {
    id: "watch",
    title: "Apple Watch",
    name: "Soatlar",
    subtitle: "Apple Watch va aqlli soatlar",
    icon: watchImg,
    query: "watch",
  },
  {
    id: "aksessuarlar",
    title: "Aksessuarlar",
    name: "Aksessuarlar",
    subtitle: "AirPods va qo'shimcha jihozlar",
    icon: aksessuarlarImg,
    query: "airpods",
  },
];

/**
 * productsData asosida har bir toifaga tegishli mahsulotlar sonini ("N ta model") dinamik hisoblab qaytaradi
 */
export const getCategoriesWithCounts = () => {
  return CATEGORIES.map((cat) => {
    const matchingProducts = productsData.filter(
      (p) =>
        p.category === cat.id ||
        (cat.id === "watch" && p.category === "apple-watch") ||
        (cat.id === "apple-watch" && p.category === "watch"),
    );
    const count = matchingProducts.length;
    return {
      ...cat,
      modelCount: count,
      count: `${count} ta model`,
    };
  });
};

