import {v4 as uuidv4} from 'uuid'

export const documentHooks = {
  newDocument: {
    order: 1,
    execute: async (document:any) => {
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
