import {defineField, defineType} from 'sanity'

export const deckSelectionType = defineType({
  name: 'deckSelection',
  title: 'Shared Deck Selection',
  type: 'document',
  readOnly: true,
  fields: [defineField({
    name: 'tables',
    title: 'Groups',
    type: 'array',
    of: [{type: 'object', fields: [
      {name: 'id', type: 'string'},
      {name: 'name', type: 'string'},
      {name: 'profiles', type: 'array', of: [{type: 'string'}]},
    ]}],
  })],
  preview: {select: {title: 'tables.0.name'}, prepare: ({title}) => ({title: title || 'Shared selection'})},
})
