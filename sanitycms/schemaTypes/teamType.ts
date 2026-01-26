import {defineField, defineType} from 'sanity'
import {CreateCompanyField} from '../components/create-company-field'
import ImageCropField from '../components/image-crop-field'

export const teamType = defineType({
  name: 'team',
  title: 'Team',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'teamLogo',
      type: 'image',
    }),
    defineField({
      name: 'teamLogo2',
      type: 'image',
      components: {
        input: ImageCropField,
      },
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'reference',
      to: [{type: 'company'}],
      components: {
        field: CreateCompanyField,
      },
    }),
    defineField({
      name: 'isameriprise',
      title: 'Ameriprise Compass Logo',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'groups',
      title: 'Groups',
      type: 'string',
      options: {
        list: [
          {title: 'Client', value: 'client'},
          {title: 'EGF', value: 'egf'},
          {title: 'Prospect', value: 'prospect'},
        ],
      },
    }),
  ],
})
