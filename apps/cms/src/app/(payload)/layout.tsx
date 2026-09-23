/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { buildFormStateHandler } from '@payloadcms/ui/utilities/buildFormState'
import React from 'react'

import { guardFormStateLocking } from '@/access/documentLock'
import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

// Lokalna izmjena generirane datoteke: `form-state` smije zaključati samo
// dokument koji korisnik smije uređivati. Vidi `@/access/documentLock`.
const serverFunctions = { 'form-state': guardFormStateLocking(buildFormStateHandler) }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'

  return handleServerFunctions({
    ...args,
    config,
    importMap,
    serverFunctions,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
