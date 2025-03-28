// migrations/addIsameripriseFlagToTeams.js
import {createClient} from '@sanity/client'

// Configure your Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Fetch all teams that don't have an isameriprise field
async function fetchTeamsWithoutIsameriprise() {
  return client.fetch(`
    *[_type == "team" && !defined(isameriprise)] {
      _id,
      name
    }
  `)
}

// Update a single team with isameriprise = false
async function addIsameripriseFlagToTeam(teamId, teamName) {
  return client
    .patch(teamId)
    .set({isameriprise: false})
    .commit()
    .then((updatedTeam) => {
      console.log(`✅ Added isameriprise: false to team: ${teamName || teamId}`)
      return updatedTeam
    })
    .catch((err) => {
      console.error(`❌ Failed to update team ${teamName || teamId}:`, err.message)
      return null
    })
}

// Main migration function
async function migrateTeams() {
  console.log('🔍 Finding teams without isameriprise field...')

  const teams = await fetchTeamsWithoutIsameriprise()

  if (teams.length === 0) {
    console.log('👍 All teams already have isameriprise field. Nothing to migrate.')
    return
  }

  console.log(`🚀 Found ${teams.length} teams without isameriprise field. Starting migration...`)

  // Process each team one by one
  for (const team of teams) {
    await addIsameripriseFlagToTeam(team._id, team.name)
    // Optional: Add a small delay to avoid rate limits
    // await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`✨ Migration complete! Added isameriprise: false to ${teams.length} teams.`)
}

// Run the migration
migrateTeams().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
