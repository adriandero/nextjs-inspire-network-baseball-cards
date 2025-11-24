import {defineField, defineType} from 'sanity'
import {v4 as uuidv4} from 'uuid'
import ImageCropField from '../components/image-crop-field'

const toTitleCase = (str: string) => str.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())

function createWidgetField(name: string) {
  return {
    name,
    title: toTitleCase(name) + ' Level',
    type: 'string',
    options: {
      list: [
        {title: 'Green', value: 'green'},
        {title: 'Yellow', value: 'yellow'},
        {title: 'Red', value: 'red'},
      ],
    },
  }
}

const wonderObj = createWidgetField('wonder')
const discernmentObj = createWidgetField('discernment')
const inventionObj = createWidgetField('invention')
const enablementObj = createWidgetField('enablement')
const galvanizingObj = createWidgetField('galvanizing')
const tenacityObj = createWidgetField('tenacity')

const principleYouArchetypeList = [
  {title: 'Adventurer', value: 'adventurer'},
  {title: 'Artisan', value: 'artisan'},
  {title: 'Campaigner', value: 'campaigner'},
  {title: 'Coach', value: 'coach'},
  {title: 'Commander', value: 'commander'},
  {title: 'Critic', value: 'critic'},
  {title: 'Enforcer', value: 'enforcer'},
  {title: 'Entertainer', value: 'entertainer'},
  {title: 'Explorer', value: 'explorer'},
  {title: 'Growth Seeker', value: 'growthSeeker'},
  {title: 'Helper', value: 'helper'},
  {title: 'Implementer', value: 'implementer'},
  {title: 'Impresario', value: 'impresario'},
  {title: 'Individualist', value: 'individualist'},
  {title: 'Inspirer', value: 'inspirer'},
  {title: 'Inventor', value: 'inventor'},
  {title: 'Investigator', value: 'investigator'},
  {title: 'Orchestrator', value: 'orchestrator'},
  {title: 'Peacekeeper', value: 'peacekeeper'},
  {title: 'Planner', value: 'planner'},
  {title: 'Problem Solver', value: 'problemSolver'},
  {title: 'Promoter', value: 'promoter'},
  {title: 'Protector', value: 'protector'},
  {title: 'Quiet Leader', value: 'quietLeader'},
  {title: 'Shaper', value: 'shaper'},
  {title: 'Strategist', value: 'strategist'},
  {title: 'Technician', value: 'technician'},
  {title: 'Thinker', value: 'thinker'},
]

const workingGeniusList = [
  {title: 'The Adaptable Designer', value: 'theAdaptableDesigner'},
  {title: 'The Assertive Driver', value: 'theAssertiveDriver'},
  {title: 'The Careful Implementer', value: 'theCarefulImplementer'},
  {title: 'The Contemplative Counselor', value: 'theContemplativeCounselor'},
  {title: 'The Creative Dreamer', value: 'theCreativeDreamer'},
  {title: 'The Discriminating Ideator', value: 'theDiscriminatingIdeator'},
  {title: 'The Enthusiastic Encourager', value: 'theEnthusiasticEncourager'},
  {title: 'The Evangelizing Innovator', value: 'theEvangelizingInnovator'},
  {title: 'The Idealistic Supporter', value: 'theIdealisticSupporter'},
  {title: 'The Insightful Collaborator', value: 'theInsightfulCollaborator'},
  {title: 'The Intuitive Activator', value: 'theIntuitiveActivator'},
  {title: 'The Judicious Accomplisher', value: 'theJudiciousAccomplisher'},
  {title: 'The Loyal Finisher', value: 'theLoyalFinisher'},
  {title: 'The Methodical Architect', value: 'theMethodicalArchitect'},
  {title: 'The Philosophical Motivator', value: 'thePhilosophicalMotivator'},
]

function createKolbeStrengthField(name: string) {
  return {
    name,
    type: 'number',
    validation: (rule: any) => rule.min(1).max(10),
  }
}

function createKolbeStrengthField2(name: string) {
  return {
    name,
    type: 'string',
    options: {
      list: [
        {title: '1', value: '1'},
        {title: '2', value: '2'},
        {title: '3', value: '3'},
        {title: '4', value: '4'},
        {title: '5', value: '5'},
        {title: '6', value: '6'},
        {title: '7', value: '7'},
        {title: '8', value: '8'},
        {title: '9', value: '9'},
        {title: '10', value: '10'},
        {title: 'In Transition', value: 'inTransition'},
      ],
    },
  }
}

const factFinder = createKolbeStrengthField('factFinder')
const followThru = createKolbeStrengthField('followThru')
const quickStart = createKolbeStrengthField('quickStart')
const implementer = createKolbeStrengthField('implementer')

export const profileType = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'uuid',
      title: 'UUID',
      type: 'string',
      readOnly: true,
      description: 'Unique identifier for this profile',
      initialValue: () => uuidv4(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
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
      name: 'jobRole',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'values',
      type: 'array',
      of: [{type: 'string'}],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'profileImage',
      type: 'image',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image', // ← Changed from 'string' to 'image'
      components: {
        input: ImageCropField,
      },
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'team'}],
        },
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'workingGenius',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Working Genius Title',
          type: 'string',
          options: {
            list: workingGeniusList,
          },
        },
        {
          name: 'widget',
          type: 'object',
          fields: [
            wonderObj,
            inventionObj,
            discernmentObj,
            galvanizingObj,
            enablementObj,
            tenacityObj,
          ],
        },
      ],
    }),
    defineField({
      name: 'principleYouArchetype',
      title: 'Most like PrinciplesYou Archetypes',
      type: 'array',
      of: [
        {
          name: 'archetype',
          type: 'string',
          options: {
            list: principleYouArchetypeList,
          },
        },
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'principleYouArchetypeLeast',
      title: 'Least like PrinciplesYou Archetypes',
      type: 'array',
      of: [
        {
          name: 'archetype',
          type: 'string',
          options: {
            list: principleYouArchetypeList,
          },
        },
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'kolbeStrengths',
      type: 'object',
      fields: [factFinder, followThru, quickStart, implementer],
    }),
    defineField({
      name: 'kolbeStrengths2',
      type: 'object',
      fields: [
        createKolbeStrengthField2('factFinder'),
        createKolbeStrengthField2('followThru'),
        createKolbeStrengthField2('quickStart'),
        createKolbeStrengthField2('implementer'),
      ],
    }),
  ],
})
