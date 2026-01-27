import React, {useCallback, useState} from 'react'
import {useClient, useFormValue} from 'sanity'
import {Button, Card, Flex, Text} from '@sanity/ui'

export const CreateCompanyField = (props: any) => {
  const client = useClient({apiVersion: '2023-03-15'})

  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const name = useFormValue(['name']) as string | undefined
  const slug = useFormValue(['slug', 'current']) as string | undefined
  const teamLogo = useFormValue(['teamLogo']) as unknown
  const company = useFormValue(['company']) as unknown
  const documentId = useFormValue(['_id']) as string | undefined

  const handleCreateCompany = useCallback(async () => {
    if (!name || !slug) {
      setError('Please fill out the team name and slug first')
      return
    }
    if (!documentId) {
      setError('Missing document id (_id). Please save the document first.')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const companyDoc: any = {
        _type: 'company',
        name,
        slug: {_type: 'slug', current: slug},
        ...(teamLogo ? {companyLogo: teamLogo} : {}),
      }

      const newCompany = await client.create(companyDoc)

      await client
        .patch(documentId)
        .set({
          company: {_type: 'reference', _ref: newCompany._id},
        })
        .commit()

      alert('Company created successfully and linked to team!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError('Failed to create company: ' + message)
    } finally {
      setIsCreating(false)
    }
  }, [client, documentId, name, slug, teamLogo])

  return (
    <>
      {props.renderDefault(props)}
      {!company && (
        <Card padding={3} radius={2} shadow={1} tone="primary" marginTop={2}>
          <Flex direction="column" gap={3}>
            <Text>
              Create a company with the same name, slug, and logo (if available) as this team
            </Text>

            <Button
              text={isCreating ? 'Creating...' : 'Create matching company'}
              tone="primary"
              onClick={handleCreateCompany}
              disabled={isCreating || !name || !slug}
            />

            {error && (
              <Card padding={2} radius={2} tone="critical">
                <Text>{error}</Text>
              </Card>
            )}
          </Flex>
        </Card>
      )}
    </>
  )
}
