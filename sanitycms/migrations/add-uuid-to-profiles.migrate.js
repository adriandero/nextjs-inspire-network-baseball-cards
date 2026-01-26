// migrations/addUuidToProfiles.js
import {createClient} from '@sanity/client'
import {v4 as uuidv4} from 'uuid'
// import {client} from '../utils'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function fetchProfilesWithoutUuid() {
  return client.fetch(`
    *[_type == "profile" && !defined(uuid)] {
      _id,
      name
    }
  `)
}

async function addUuidToProfile(profileId) {
  const uuid = uuidv4()

  return client
    .patch(profileId)
    .set({uuid})
    .commit()
    .then((updatedProfile) => {
      console.log(`✅ Added UUID to profile: ${updatedProfile.name || profileId}`)
      return updatedProfile
    })
    .catch((err) => {
      console.error(`❌ Failed to update profile ${profileId}:`, err.message)
      return null
    })
}

async function migrateProfiles() {
  console.log('🔍 Finding profiles without UUIDs...')

  const profiles = await fetchProfilesWithoutUuid()

  if (profiles.length === 0) {
    console.log('👍 All profiles already have UUIDs. Nothing to migrate.')
    return
  }

  console.log(`🚀 Found ${profiles.length} profiles without UUIDs. Starting migration...`)

  for (const profile of profiles) {
    await addUuidToProfile(profile._id)
  }

  console.log(`✨ Migration complete! Added UUIDs to ${profiles.length} profiles.`)
}

migrateProfiles().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
