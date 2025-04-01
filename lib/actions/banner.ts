"use server"

import { client } from "@/sanity/lib/client"
import { getAllBannersQuery } from "../queries/banner"
import { Banners } from "@/sanity/types"

/**
 * Fetches all active banners from Sanity.
 * @returns {Promise<{ banners: Banners[] }>} - A promise resolving to an object containing the banners.
 * @throws {Error} - Throws an error if the query fails.
 */
export async function getAllBanners(): Promise<{ banners: Banners[] }> {
  try {
    // Fetch active banners from Sanity
    const banners: Banners[] = await client.fetch(getAllBannersQuery)

    return { banners }
  } catch (error) {
    console.error("Error fetching banners:", error)
    throw new Error("Failed to fetch banners. Please try again later.")
  }
}
