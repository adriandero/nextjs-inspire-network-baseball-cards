import {useState, useRef, useCallback} from 'react'
import {Stack, Card, Button, Flex, Text} from '@sanity/ui'
import {UploadIcon, ImageIcon} from '@sanity/icons'
import {set, ObjectInputProps, ImageOptions} from 'sanity'
import {useClient} from 'sanity'
import imageUrlBuilder from '@sanity/image-url'
import ImageCropper from './image-cropper'

type ImageCropOptions = {
  aspectRatio?: number
  freeForm?: boolean
}

export default function ImageCropField(props: ObjectInputProps) {
  const {value, onChange, schemaType} = props
  const options = (schemaType.options || {}) as ImageOptions & ImageCropOptions
  const {aspectRatio = 1, freeForm = false} = options

  const [tempImage, setTempImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const client = useClient({apiVersion: '2024-01-01'})
  const builder = imageUrlBuilder(client)

  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (r) => {
      setTempImage(r.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImageFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) processImageFile(file)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()
        if (file) {
          processImageFile(file)
          break
        }
      }
    }
  }

  const handleCropped = async (blob: Blob) => {
    setIsUploading(true)
    try {
      const asset = await client.assets.upload('image', blob, {
        filename: 'avatar.jpg',
      })

      console.log('Asset uploaded:', asset)

      onChange(
        set({
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        }),
      )

      setTempImage(null)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setTempImage(null)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Type guard to check if value has the image structure we expect
  const hasImageAsset = (val: unknown): val is {asset: {_ref: string}} => {
    return (
      typeof val === 'object' &&
      val !== null &&
      'asset' in val &&
      typeof val.asset === 'object' &&
      val.asset !== null &&
      '_ref' in val.asset
    )
  }

  // Safely get image URL
  const imageUrl = hasImageAsset(value) ? builder.image(value).width(200).height(200).url() : null

  console.log('Current value:', value)
  console.log('Image URL:', imageUrl)

  return (
    <Stack space={4}>
      {!tempImage && !isUploading && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{display: 'none'}}
          />

          <Card
            padding={4}
            radius={2}
            shadow={1}
            tone={isDragging ? 'primary' : 'default'}
            style={{
              border: isDragging ? '2px dashed var(--card-border-color)' : '2px dashed transparent',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
            tabIndex={0}
          >
            <Flex direction="column" align="center" gap={3}>
              <Text size={3}>
                <ImageIcon />
              </Text>

              <Stack space={2}>
                <Text align="center" weight="semibold">
                  Upload Avatar Image
                </Text>
                <Text align="center" size={1} muted>
                  Drag and drop, paste, or click to browse
                </Text>
              </Stack>

              <Button
                mode="ghost"
                tone="primary"
                icon={UploadIcon}
                text="Choose File"
                onClick={triggerFileInput}
              />
            </Flex>
          </Card>

          {hasImageAsset(value) && imageUrl && (
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Text size={1} weight="semibold" muted>
                  Current Avatar
                </Text>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Current avatar"
                  style={{maxWidth: 200, borderRadius: 8, display: 'block'}}
                />
              </Stack>
            </Card>
          )}
        </>
      )}

      {isUploading && (
        <Card padding={4}>
          <Text align="center">Uploading avatar...</Text>
        </Card>
      )}

      {tempImage && !isUploading && (
        <ImageCropper
          image={tempImage}
          onCropped={handleCropped}
          onCancel={handleCancel}
          aspectRatio={freeForm ? undefined : aspectRatio}
        />
      )}
    </Stack>
  )
}
