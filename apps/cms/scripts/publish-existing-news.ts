import { getPayload } from 'payload'
import config from '@payload-config'

// Run ONCE right after enabling `versions.drafts` on News.
//
// Enabling drafts adds a `_status` column; pre-existing rows are not guaranteed
// to be `published`, and the frontend now shows only published news. This marks
// every existing news item as published. Safe to run before any AI drafts exist
// (it publishes everything); afterwards, rely on the admin Publish button.

console.log('publish-existing-news: starting')
const payloadConfig = await config
const payload = await getPayload({ config: payloadConfig })

const all = await payload.find({
  collection: 'news',
  limit: 0, // 0 = no limit (all docs)
  depth: 0,
  overrideAccess: true,
})

let published = 0
for (const doc of all.docs) {
  const status = (doc as { _status?: string })._status
  if (status === 'published') continue
  await payload.update({
    collection: 'news',
    id: doc.id,
    data: { _status: 'published' },
    overrideAccess: true,
  })
  published++
}

console.log(
  `publish-existing-news: done. published=${published} skipped=${all.docs.length - published}`,
)
