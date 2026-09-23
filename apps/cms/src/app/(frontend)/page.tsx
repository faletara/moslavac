import { BRAND, LEGAL, PRICING } from '@/marketing/config'
import { FAQ } from '@/marketing/data/faq'
import { Clubs } from '@/marketing/sections/Clubs'
import { CtaBand } from '@/marketing/sections/CtaBand'
import { Faq } from '@/marketing/sections/Faq'
import { Features } from '@/marketing/sections/Features'
import { Hero } from '@/marketing/sections/Hero'
import { HowItWorks } from '@/marketing/sections/HowItWorks'
import { Included } from '@/marketing/sections/Included'
import { serializeJsonLd } from '@/lib/helpers/jsonLd'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BRAND.url}/#organizacija`,
      name: BRAND.name,
      url: BRAND.url,
      email: LEGAL.email,
      description: `${BRAND.tagline} — izrada i održavanje web stranica za sportske klubove.`,
      areaServed: 'HR',
    },
    {
      '@type': 'Service',
      name: `${BRAND.name} — web stranica za sportski klub`,
      provider: { '@id': `${BRAND.url}/#organizacija` },
      serviceType: 'Izrada i održavanje web stranice',
      areaServed: 'HR',
      // Iznos se ne objavljuje; navodi se samo valuta naplate.
      offers: {
        '@type': 'Offer',
        url: `${BRAND.url}/#ukljuceno`,
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: PRICING.currency,
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Hero />
      <Features />
      <HowItWorks />
      <Clubs />
      <Included />
      <Faq />
      <CtaBand />
    </>
  )
}
