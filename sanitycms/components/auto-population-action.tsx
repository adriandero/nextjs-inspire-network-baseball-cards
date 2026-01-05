// sanity/actions/AutoPopulateAction.tsx
import {DocumentActionComponent} from 'sanity'
import {SparklesIcon} from '@sanity/icons'

export const AutoPopulateAction: DocumentActionComponent = (props) => {
  const {id, type, draft, published} = props

  return {
    label: 'Auto-Populate from PDFs',
    icon: SparklesIcon,
    onHandle: async () => {
      // Get the document ID (draft or published)
      const docId = draft?._id || published?._id || id

      try {
        // Call your NextJS API
        const response = await fetch('YOUR_NEXTJS_URL/api/sanity/auto-populate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // We'll add auth later
          },
          body: JSON.stringify({
            documentId: docId,
            documentType: type,
          }),
        })

        const result = await response.json()

        if (result.success) {
          // Show success message with what was populated
          props.onComplete()
          alert(`Success! Populated fields: ${result.populatedFields.join(', ')}`)
        } else {
          alert(`Error: ${result.error}`)
        }
      } catch (error: any) {
        alert(`Failed to auto-populate: ${error.message}`)
      }
    },
  }
}
