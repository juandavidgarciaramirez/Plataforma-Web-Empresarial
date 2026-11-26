import type { Metadata } from "next"
import { SITE } from "@/config/site"
import { buildPageSeo } from "@/lib/seo/metadata"
import { HomeContent } from "./HomeContent"

export const metadata: Metadata = {
  title: { absolute: SITE.homeTitle },
  description: SITE.homeDescription,
  ...buildPageSeo({
    title: SITE.homeTitle,
    description: SITE.homeDescription,
    path: "/",
  }),
}

export default function HomePage() {
  return <HomeContent />
}
