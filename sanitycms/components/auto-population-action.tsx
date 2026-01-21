// sanity/actions/AutoPopulateActions.tsx

import {DocumentActionComponent} from 'sanity'
import {SparklesIcon} from '@sanity/icons'
import {useState, useCallback} from 'react'
import {Button, Card, Stack, Text} from '@sanity/ui'

// Keep your AutoPopulateAllAction
export const AutoPopulateAllAction: DocumentActionComponent = (props) => {
  const {id, draft, published} = props
  const [isLoading, setIsLoading] = useState(false)

  return {
    label: 'Auto-Populate All PDFs',
    icon: SparklesIcon,
    disabled: isLoading,
    onHandle: async () => {
      const docId = (draft?._id || published?._id || id).replace('drafts.', '')
      setIsLoading(true)

      try {
        const apiUrl = 'http://localhost:3000'
        const response = await fetch(`${apiUrl}/api/cms/auto-populate`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            documentId: docId,
            documentType: props.type,
          }),
        })

        const result = await response.json()

        if (result.success) {
          let message = `✅ Successfully extracted data from all PDFs!\n\n`
          message += `Populated: ${result.populatedFields.join(', ')}\n\n`

          if (result.metadata) {
            message += `Details:\n`
            result.metadata.forEach((meta: any) => {
              message += `  • ${meta.field}: ${meta.notes}\n`
            })
          }

          alert(message)
          props.onComplete()
        } else {
          alert(`❌ Error: ${result.error}`)
        }
      } catch (error) {
        alert(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsLoading(false)
      }
    },
  }
}

// NEW: Specific extraction with compact dialog
export const AutoPopulateSpecificAction: DocumentActionComponent = (props) => {
  const {id, draft, published} = props
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingField, setLoadingField] = useState<string | null>(null)

  const assessments = [
    {field: 'principlesYouAssessmentPdf', label: 'PrinciplesYou'},
    {field: 'workingGeniusAssessmentPdf', label: 'Working Genius'},
    {field: 'kolbeAssessmentPdf', label: 'Kolbe'},
    {field: 'valuesAssessmentPdf', label: 'Values'},
  ]

  const extractPdf = useCallback(
    async (pdfField: string, label: string) => {
      const docId = (draft?._id || published?._id || id).replace('drafts.', '')
      setIsLoading(true)
      setLoadingField(pdfField)

      try {
        const apiUrl = 'http://localhost:3000'
        const response = await fetch(`${apiUrl}/api/cms/auto-populate`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            documentId: docId,
            documentType: props.type,
            pdfField,
          }),
        })

        const result = await response.json()

        if (result.success) {
          alert(
            `✅ Successfully extracted data from ${label}!\n\n` +
              `Populated: ${result.populatedFields.join(', ')}`,
          )
          setIsDialogOpen(false)
          props.onComplete()
        } else {
          alert(`❌ Error: ${result.error}`)
        }
      } catch (error) {
        alert(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsLoading(false)
        setLoadingField(null)
      }
    },
    [draft, published, id, props],
  )

  return {
    label: 'Extract Specific PDF',
    icon: SparklesIcon,
    dialog: isDialogOpen && {
      type: 'dialog',
      onClose: () => setIsDialogOpen(false),
      header: 'Choose Assessment to Extract',
      content: (
        <Card padding={4}>
          <Stack space={3}>
            <Text size={1} muted>
              Select which assessment PDF you want to extract data from:
            </Text>

            <Stack space={2}>
              {assessments.map(({field, label}) => (
                <Button
                  key={field}
                  text={label}
                  icon={SparklesIcon}
                  mode="ghost"
                  onClick={() => extractPdf(field, label)}
                  disabled={isLoading}
                  loading={loadingField === field}
                  style={{justifyContent: 'flex-start'}}
                />
              ))}
            </Stack>
          </Stack>
        </Card>
      ),
    },
    onHandle: () => {
      setIsDialogOpen(true)
    },
  }
}
