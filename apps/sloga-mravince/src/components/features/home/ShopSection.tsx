import SectionHead from "./SectionHead";
import ShopCarousel, { type ShopProduct } from "./ShopCarousel";

// Privremeni mock — zamijeniti dohvatom iz equipment API-ja kad webshop krene.
const MOCK_PRODUCTS: ShopProduct[] = [
  { id: "dres-home", name: "Domaći dres 25/26", category: "Dresovi", price: 39.99, badge: "Novo", accent: "red", icon: "jersey" },
  { id: "dres-away", name: "Gostujući dres 25/26", category: "Dresovi", price: 39.99, accent: "blue", icon: "jersey" },
  { id: "sal", name: "Navijački šal", category: "Dodaci", price: 14.99, accent: "red", icon: "scarf" },
  { id: "kapa", name: "Zimska kapa s grbom", category: "Dodaci", price: 12.99, accent: "gold", icon: "beanie" },
  { id: "majica", name: "Pamučna majica logo", category: "Odjeća", price: 19.99, accent: "blue", icon: "shirt" },
  { id: "trenirka", name: "Trenirka komplet", category: "Odjeća", price: 54.99, badge: "Popust", accent: "red", icon: "tracksuit" },
  { id: "boca", name: "Sportska boca 750ml", category: "Dodaci", price: 8.99, accent: "gold", icon: "bottle" },
];

/** Webshop slider na naslovnici — trenutno s mock proizvodima. */
export default function ShopSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHead
        eyebrow="Nosi boje kluba"
        title="Klupski webshop"
      />
      <div className="mt-12 md:mt-16">
        <ShopCarousel products={MOCK_PRODUCTS} />
      </div>
    </section>
  );
}
