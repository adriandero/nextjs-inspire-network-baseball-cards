import {useState, useRef, useCallback} from 'react'
import {Stack, Card, Button, Flex, Text, Box} from '@sanity/ui'
import {UploadIcon, ImageIcon} from '@sanity/icons'
import {set, unset, StringInputProps} from 'sanity'
import ImageCropper from './image-cropper'

export default function ImageCropField(props: StringInputProps) {
  const {value, onChange} = props
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleCropped = (base64: string) => {
    onChange(set(base64))
    setTempImage(null)
  }

  const handleCancel = () => {
    setTempImage(null)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Stack space={4}>
      {!tempImage && (
        <>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{display: 'none'}}
          />

          {/* Drop zone */}
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

          {value && (
            <Card padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Text size={1} weight="semibold" muted>
                  Current Avatar
                </Text>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt="Current avatar"
                  style={{maxWidth: 200, borderRadius: 8, display: 'block'}}
                />
              </Stack>
            </Card>
          )}
        </>
      )}

      {tempImage && (
        <ImageCropper image={tempImage} onCropped={handleCropped} onCancel={handleCancel} />
      )}
    </Stack>
  )
}
