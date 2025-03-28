import {v4 as uuidv4} from 'uuid'

export const documentHooks = {
  newDocument: {
    order: 1,
    execute: async (document:any) => {
      // Only add UUID if it doesn't exist
      if (!document.uuid) {
        return {
          ...document,
          uuid: uuidv4(),
        }
      }
      return document
    },
  },
}
