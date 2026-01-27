// sanity.cli.ts
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '8h77',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
    appId: 'glnajjwsnmh6162xwghk4ygi', // Add this
  },
})
