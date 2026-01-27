// scripts/migrate-profile-images.ts
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN, // Need write token
  apiVersion: '2024-01-01',
  useCdn: false, // Important: don't use CDN for writes
})

interface Profile {
  _id: string
  name: string
  profileImage?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  avatar?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
  } | null
}

async function migrateProfileImages(dryRun: boolean = true) {
  console.log(`🔍 Starting migration ${dryRun ? '(DRY RUN)' : '(LIVE)'}...\n`)

  // Query profiles that need migration
  const query = `*[_type == "profile" && defined(profileImage) && !defined(avatar)] {
    _id,
    name,
    profileImage,
    avatar
  }`

  const profiles = await client.fetch<Profile[]>(query)

  console.log(`Found ${profiles.length} profiles to migrate\n`)

  if (profiles.length === 0) {
    console.log('✅ No profiles need migration!')
    return
  }

  // Show what will be migrated
  profiles.forEach((profile, index) => {
    console.log(`${index + 1}. ${profile.name} (${profile._id})`)
    console.log(`   profileImage: ${profile.profileImage?.asset._ref}`)
    console.log(`   avatar: ${profile.avatar || 'null'}\n`)
  })

  if (dryRun) {
    console.log('🏁 DRY RUN complete. Run with --live to execute migration.')
    return
  }

  // Execute migration
  console.log('🚀 Starting live migration...\n')

  const transaction = client.transaction()

  profiles.forEach((profile) => {
    if (profile.profileImage?.asset) {
      transaction.patch(profile._id, {
        set: {
          avatar: {
            _type: 'image',
            asset: {
              _ref: profile.profileImage.asset._ref,
              _type: 'reference',
            },
          },
        },
      })
    }
  })

  try {
    const result = await transaction.commit()
    console.log(`✅ Successfully migrated ${profiles.length} profiles!`)
    console.log('Transaction result:', result)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Parse command line args
const args = process.argv.slice(2)
const isLive = args.includes('--live')

migrateProfileImages(!isLive)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
