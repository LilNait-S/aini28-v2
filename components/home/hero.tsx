import { getAllBanners } from "@/lib/actions/banner";
import { HeroBanners } from "./hero-banners";
export async function Hero() {
  const { banners } = await getAllBanners();
  return <HeroBanners images={banners} />;
}
