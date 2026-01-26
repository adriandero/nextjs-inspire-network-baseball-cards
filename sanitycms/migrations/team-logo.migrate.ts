// scripts/migrate-team-logo.ts
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '8hl62j77',
  dataset: 'production',
  token:
    'skjwDDzhOoSLpVCiXW4QkOsvOgbGzGwYVRBuVyljpKQqgV4H9LvI3tNBBicwyjUORlpL7mnZ7SMKI2jlXF8OKmZKc5HXe3ECSqZiJDNzBWSiGAKTyj9dE4JYhmkO05LwV2Ch0TgFKOjbUgTKlPFAUVFlcMvp68cYYjzUNA8qLCrlWVE9QdYn',
  apiVersion: '2024-01-01',
  useCdn: false,
})

interface Team {
  _id: string
  name: string
  teamLogo?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    // Optional metadata that might exist
    crop?: unknown
    hotspot?: unknown
  }
  teamLogo2?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
  } | null
}

async function migrateTeamLogos(dryRun: boolean = true) {
  console.log(`🔍 Starting team logo migration ${dryRun ? '(DRY RUN)' : '(LIVE)'}...\n`)

  // Query teams that need migration: has teamLogo but no teamLogo2
  const query = `*[_type == "team" && defined(teamLogo) && !defined(teamLogo2)] {
    _id,
    name,
    teamLogo,
    teamLogo2
  }`

  const teams = await client.fetch<Team[]>(query)

  console.log(`Found ${teams.length} teams to migrate\n`)

  if (teams.length === 0) {
    console.log('✅ No teams need migration!')
    return
  }

  // Show what will be migrated
  teams.forEach((team, index) => {
    console.log(`${index + 1}. ${team.name} (${team._id})`)
    console.log(`   teamLogo: ${team.teamLogo?.asset._ref}`)
    console.log(`   teamLogo2: ${team.teamLogo2 || 'null'}\n`)
  })

  if (dryRun) {
    console.log('🏁 DRY RUN complete. Run with --live to execute migration.')
    return
  }

  // Execute migration
  console.log('🚀 Starting live migration...\n')

  const transaction = client.transaction()

  teams.forEach((team) => {
    if (team.teamLogo?.asset) {
      transaction.patch(team._id, {
        set: {
          teamLogo2: {
            _type: 'image',
            asset: {
              _ref: team.teamLogo.asset._ref,
              _type: 'reference',
            },
          },
        },
      })
    }
  })

  try {
    const result = await transaction.commit()
    console.log(`✅ Successfully migrated ${teams.length} teams!`)
    console.log('Transaction result:', result)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Parse command line args
const args = process.argv.slice(2)
const isLive = args.includes('--live')

migrateTeamLogos(!isLive)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
