import {Rule} from 'sanity'

export const user = {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'auth0UserID',
      title: 'Auth0UserID',
      type: 'string',
    },
    {
      name: 'permission',
      title: 'Permission',
      type: 'string',
      options: {
        list: [
          {title: 'User', value: 'User'},
          {title: 'Admin', value: 'Admin'},
        ],
      },
      validation: (Rule: Rule) => Rule.required().error('Permission is required'),
    },
    {
      name: 'profile',
      title: 'Profile',
      type: 'reference',
      to: [{type: 'profile'}],
    },
    {
      name: 'team',
      title: 'Team',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'team'}],
        },
      ],
    },
  ],
  initialValue: {
    permission: 'User',
  },
}
