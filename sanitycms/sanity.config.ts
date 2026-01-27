import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './deskStructure'
import {
  AutoPopulateAllAction,
  AutoPopulateSpecificAction,
} from './components/auto-population-action'

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
  unstable_autoUpdate: false,

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'profile') {
        return [
          ...prev, // Publish stays first
          AutoPopulateAllAction,
          AutoPopulateSpecificAction,
        ]
      }
      return prev
    },
  },
})
