import {createClient} from '@sanity/client'

// Configure your Sanity client
const client = createClient({
  projectId: '8hl62j77',
  dataset: 'production',
  token:
    process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Type definitions
interface KolbeStrengths {
  factFinder?: number | null
  followThru?: number | null
  quickStart?: number | null
  implementer?: number | null
}

interface KolbeStrengths2 {
  factFinder?: string
  followThru?: string
  quickStart?: string
  implementer?: string
}

interface Profile {
  _id: string
  _rev: string
  name: string
  kolbeStrengths?: KolbeStrengths
  kolbeStrengths2?: KolbeStrengths2
}

const KOLBE_FIELDS = ['factFinder', 'followThru', 'quickStart', 'implementer'] as const
type KolbeField = (typeof KOLBE_FIELDS)[number]

// Check if a value is defined (not null or undefined)
function isDefined(value: any): boolean {
  return value !== null && value !== undefined
}

// Check if at least one kolbe field has a value
function hasAnyKolbeValue(kolbeStrengths?: KolbeStrengths): boolean {
  if (!kolbeStrengths) return false

  return KOLBE_FIELDS.some((field) => {
    const value = kolbeStrengths[field]
    return isDefined(value)
  })
}

// Migrate a single kolbe field value
function migrateKolbeField(
  value: number | null | undefined,
  hasAnyValue: boolean,
): string | undefined {
  // If the field has a defined value, convert to string
  if (isDefined(value)) {
    return String(value)
  }

  // If at least one field has a value but this one doesn't, set to 'inTransition'
  if (hasAnyValue) {
    return 'inTransition'
  }

  // Otherwise, leave as undefined
  return undefined
}

// Build the migrated kolbeStrengths2 object
function buildKolbeStrengths2(kolbeStrengths?: KolbeStrengths): KolbeStrengths2 | undefined {
  // If there's no kolbeStrengths object at all, create kolbeStrengths2 with all undefined
  if (!kolbeStrengths) {
    return {
      factFinder: undefined,
      followThru: undefined,
      quickStart: undefined,
      implementer: undefined,
    }
  }

  const hasAnyValue = hasAnyKolbeValue(kolbeStrengths)

  const kolbeStrengths2: KolbeStrengths2 = {}

  KOLBE_FIELDS.forEach((field) => {
    const migratedValue = migrateKolbeField(kolbeStrengths[field], hasAnyValue)
    kolbeStrengths2[field] = migratedValue
  })

  return kolbeStrengths2
}

// Pretty print the migration changes
function logMigrationPreview(profile: Profile, newKolbeStrengths2: KolbeStrengths2) {
  console.log(`\n📝 ${profile.name} (${profile._id})`)
  console.log('  Current kolbeStrengths:', JSON.stringify(profile.kolbeStrengths || 'none'))
  console.log('  Will set kolbeStrengths2:', JSON.stringify(newKolbeStrengths2))

  // Show field-by-field comparison
  KOLBE_FIELDS.forEach((field) => {
    const oldValue = profile.kolbeStrengths?.[field]
    const newValue = newKolbeStrengths2[field]
    console.log(`    ${field}: ${oldValue ?? 'undefined'} → ${newValue ?? 'undefined'}`)
  })
}

async function migrateProfiles(dryRun: boolean = true) {
  console.log('🚀 Starting Kolbe Strengths Migration')
  console.log(
    `Mode: ${dryRun ? '🔍 DRY RUN (no changes will be made)' : '✅ LIVE RUN (will update documents)'}`,
  )
  console.log('─'.repeat(80))

  try {
    // Fetch all profile documents
    const query = `*[_type == "profile"] {
      _id,
      _rev,
      name,
      kolbeStrengths,
      kolbeStrengths2
    }`

    console.log('\n📥 Fetching all profiles...')
    const profiles: Profile[] = await client.fetch(query)
    console.log(`✓ Found ${profiles.length} profiles\n`)

    let updatedCount = 0
    let skippedCount = 0
    let errorCount = 0

    // Process each profile
    for (const profile of profiles) {
      try {
        // Build the new kolbeStrengths2 object
        const newKolbeStrengths2 = buildKolbeStrengths2(profile.kolbeStrengths)

        // Check if kolbeStrengths2 already exists and matches what we'd set
        const needsUpdate =
          !profile.kolbeStrengths2 ||
          JSON.stringify(profile.kolbeStrengths2) !== JSON.stringify(newKolbeStrengths2)

        if (!needsUpdate) {
          skippedCount++
          console.log(`⏭️  ${profile.name} - Already up to date`)
          continue
        }

        // Log what will change
        logMigrationPreview(profile, newKolbeStrengths2!)

        if (!dryRun) {
          // Perform the actual update
          await client.patch(profile._id).set({kolbeStrengths2: newKolbeStrengths2}).commit()

          console.log('  ✅ Updated successfully')
        }

        updatedCount++
      } catch (error) {
        errorCount++
        console.error(`❌ Error processing ${profile.name}:`, error)
      }
    }

    // Summary
    console.log('\n' + '═'.repeat(80))
    console.log('📊 Migration Summary')
    console.log('═'.repeat(80))
    console.log(`Total profiles: ${profiles.length}`)
    console.log(`${dryRun ? 'Would update' : 'Updated'}: ${updatedCount}`)
    console.log(`Skipped (already up to date): ${skippedCount}`)
    console.log(`Errors: ${errorCount}`)

    if (dryRun) {
      console.log('\n💡 This was a dry run. To perform the actual migration, run:')
      console.log('   npm run migrate:kolbe -- --live')
    } else {
      console.log('\n✅ Migration completed successfully!')
    }
  } catch (error) {
    console.error('💥 Fatal error during migration:', error)
    process.exit(1)
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const isLiveRun = args.includes('--live') || args.includes('-l')

// Run the migration
migrateProfiles(!isLiveRun)
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error)
    process.exit(1)
  })
