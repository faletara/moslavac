import { getPayload } from 'payload'
import config from '@payload-config'

const EMAIL = process.env.RESET_EMAIL ?? 'adrianofaletar@gmail.com'
const NEW_PASSWORD = process.env.RESET_PASSWORD

if (!NEW_PASSWORD) {
  console.error('RESET_PASSWORD env var is required')
  process.exit(1)
}

// Top-level await: `payload run` calls process.exit(0) once module evaluation
// finishes, so async work must block module evaluation.
const payloadConfig = await config
const payload = await getPayload({ config: payloadConfig })

const found = await payload.find({
  collection: 'users',
  where: { email: { equals: EMAIL } },
  limit: 1,
})

const user = found.docs[0]
if (!user) {
  console.error(`User with email "${EMAIL}" not found`)
  process.exit(1)
}

await payload.update({
  collection: 'users',
  id: user.id,
  data: { password: NEW_PASSWORD },
})

await payload.unlock({
  collection: 'users',
  data: { email: EMAIL },
  overrideAccess: true,
})

console.log(`Password reset and account unlocked for ${EMAIL} (id=${user.id})`)
