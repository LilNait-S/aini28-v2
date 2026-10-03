"use server";
import { readBanners } from "@/lib/catalog/plush";
export async function getAllBanners() {
  return readBanners();
}
