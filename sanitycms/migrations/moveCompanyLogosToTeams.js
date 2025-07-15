// migrations/migrateCompanyLogosToTeams.js
import {createClient} from '@sanity/client'

// Configure your Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Fetch all companies with logos
async function fetchCompaniesWithLogos() {
  return client.fetch(`
    *[_type == "company" && defined(companyLogo)] {
      _id,
      name,
      "logoRef": companyLogo
    }
  `)
}

// Fetch teams for a specific company
async function fetchTeamsForCompany(companyId) {
  return client.fetch(
    `
    *[_type == "team" && company._ref == $companyId] {
      _id,
      name
    }
  `,
    {companyId},
  )
}

// Update a team with the company logo
async function updateTeamWithLogo(teamId, teamName, logoRef, companyName) {
  return client
    .patch(teamId)
    .set({teamLogo: logoRef})
    .commit()
    .then((updatedTeam) => {
      console.log(`✅ Added logo from "${companyName}" to team: "${teamName || teamId}"`)
      return updatedTeam
    })
    .catch((err) => {
      console.error(`❌ Failed to update team "${teamName || teamId}":`, err.message)
      return null
    })
}

// Main migration function
async function migrateLogos() {
  console.log('🔍 Finding companies with logos...')

  const companies = await fetchCompaniesWithLogos()

  if (companies.length === 0) {
    console.log('👍 No companies with logos found. Nothing to migrate.')
    return
  }

  console.log(`🚀 Found ${companies.length} companies with logos. Starting migration...`)

  let totalTeamsUpdated = 0

  // Process each company
  for (const company of companies) {
    console.log(`📋 Processing company: "${company.name}"`)

    const teams = await fetchTeamsForCompany(company._id)

    if (teams.length === 0) {
      console.log(`ℹ️ No teams found for company: "${company.name}"`)
      continue
    }

    console.log(`🔄 Found ${teams.length} teams for company: "${company.name}"`)

    // Update each team with the company logo
    for (const team of teams) {
      await updateTeamWithLogo(team._id, team.name, company.logoRef, company.name)
      totalTeamsUpdated++

      // Optional: Add a small delay to avoid rate limits
      // await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  console.log(`✨ Migration complete! Updated ${totalTeamsUpdated} teams with their company logos.`)
}

// Run the migration
migrateLogos().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
