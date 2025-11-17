import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './deskStructure'

export default defineConfig({
  name: 'default',
  title: 'Inspire Network Tug Cards',

  projectId: '8hl62j77',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],
  deployment: {
    appId: 'glnajjwsnmh6162xwghk4ygi',
  },
  schema: {
    types: schemaTypes,
  },
})
