/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { redirectClubOwnerToOwnTenant } from '@/admin/clubOwnerRedirect'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

// Jedina izmjena u ovoj generiranoj datoteci: presretanje liste klubova prije
// nego Payload počne renderirati (vidi `admin/clubOwnerRedirect`).
const Page = async ({ params, searchParams }: Args) => {
  await redirectClubOwnerToOwnTenant((await params).segments)
  return RootPage({ config, params, searchParams, importMap })
}

export default Page
