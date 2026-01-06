// sanity/actions/AutoPopulateAction.tsx
import {DocumentActionComponent} from 'sanity'
import {SparklesIcon} from '@sanity/icons'
import {useState} from 'react'
import {useRouter} from 'sanity/router'

export const AutoPopulateAction: DocumentActionComponent = (props) => {
  const {id, type, draft, published} = props
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  return {
    label: 'Auto-Populate from PDFs',
    icon: SparklesIcon,
    disabled: isLoading,
    onHandle: async () => {
      const docId = (draft?._id || published?._id || id).replace('drafts.', '')

      setIsLoading(true)

      try {
        // process.env.NEXT_PUBLIC_APP_URL ||
        const apiUrl = 'http://localhost:3000'

        const response = await fetch(`${apiUrl}/api/cms/auto-populate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: docId,
            documentType: type,
          }),
        })

        const result = await response.json()

        if (result.success) {
          const fields = result.populatedFields.join(', ')
          const notes = result.metadata?.notes || ''
          const confidence = result.metadata?.confidence || {}

          let confidenceSummary = ''
          Object.entries(confidence).forEach(([field, level]) => {
            confidenceSummary += `  • ${field}: ${level}\n`
          })

          alert(
            `✅ Success! Data extracted from PDFs.\n\n` +
              `Populated fields:\n${fields}\n\n` +
              `${confidenceSummary ? `Confidence:\n${confidenceSummary}\n` : ''}` +
              `${notes ? `Notes: ${notes}\n\n` : ''}` +
              `Refreshing document...`,
          )

          props.onComplete()
        } else {
          alert(`❌ Error: ${result.error}`)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        alert(`❌ Failed to auto-populate: ${errorMsg}`)
      } finally {
        setIsLoading(false)
      }
    },
  }
}
