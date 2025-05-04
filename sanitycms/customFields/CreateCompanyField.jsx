// CreateCompanyField.jsx - MODIFIED VERSION
import React from 'react'
import {useClient, useFormValue} from 'sanity'
import {Button, Card, Flex, Text} from '@sanity/ui'

export const CreateCompanyField = (props) => {
  const client = useClient({apiVersion: '2023-03-15'})
  const [isCreating, setIsCreating] = React.useState(false)
  const [error, setError] = React.useState(null)

  // Get current values from the form
  const name = useFormValue(['name'])
  const slug = useFormValue(['slug', 'current'])
  const teamLogo = useFormValue(['teamLogo']) // Get the teamLogo value
  const company = useFormValue(['company'])
  const documentId = useFormValue(['_id'])

  const handleCreateCompany = async () => {
    if (!name || !slug) {
      setError('Please fill out the team name and slug first')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      // Create new company document with optional logo
      const companyDoc = {
        _type: 'company',
        name,
        slug: {
          _type: 'slug',
          current: slug,
        },
      }

      // Add the logo if it exists
      if (teamLogo) {
        companyDoc.companyLogo = teamLogo
      }

      // Create the company document
      const newCompany = await client.create(companyDoc)

      // Update the document directly with the client
      await client
        .patch(documentId)
        .set({
          company: {
            _type: 'reference',
            _ref: newCompany._id,
          },
        })
        .commit()

      alert('Company created successfully and linked to team!')
    } catch (err) {
      console.error('Error creating company:', err)
      setError('Failed to create company: ' + err.message)
    } finally {
      setIsCreating(false)
    }
  }

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
            {error && <Text tone="critical">{error}</Text>}
          </Flex>
        </Card>
      )}
    </>
  )
}
 