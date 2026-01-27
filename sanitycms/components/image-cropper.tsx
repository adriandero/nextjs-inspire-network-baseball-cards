import {FC, useCallback, useState, useRef} from 'react'
import ReactCrop, {Crop, PixelCrop, centerCrop, makeAspectCrop} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {Button, Card, Flex} from '@sanity/ui'

interface ImageCropperProps {
  image: string
  onCropped: (blob: Blob) => void
  onCancel: () => void
}

const ImageCropper: FC<ImageCropperProps> = ({image, onCropped, onCancel}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isProcessing, setIsProcessing] = useState(false)

  // Initialize crop when image loads
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const {width, height} = e.currentTarget

    // Create a centered square crop (aspect ratio 1:1)
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90, // Use 90% of image width
        },
        1, // aspect ratio 1:1 for square
        width,
        height,
      ),
      width,
      height,
    )

    setCrop(crop)
  }

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return

    setIsProcessing(true)
    try {
      const image = imgRef.current
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      // Calculate the scale between natural and displayed image
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      // Set canvas size to match crop dimensions (using natural scale)
      canvas.width = completedCrop.width * scaleX
      canvas.height = completedCrop.height * scaleY

      // Draw the cropped portion using natural image coordinates
      ctx.drawImage(
        image,
        completedCrop.x * scaleX, // Scale X position
        completedCrop.y * scaleY, // Scale Y position
        completedCrop.width * scaleX, // Scale width
        completedCrop.height * scaleY, // Scale height
        0,
        0,
        canvas.width,
        canvas.height,
      )

      // Convert to Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropped(blob)
          }
        },
        'image/jpeg',
        0.95,
      )
    } catch (error) {
      console.error('Crop failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [completedCrop, onCropped])

  return (
    <Card>
      <div style={{padding: '16px'}}>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1} // Square crop
        >
          <img
            ref={imgRef}
            src={image}
            alt="Crop preview"
            onLoad={onImageLoad}
            style={{maxWidth: '100%', maxHeight: '400px'}}
          />
        </ReactCrop>
      </div>

      <Flex gap={2} justify="flex-end" padding={3}>
        <Button mode="ghost" text="Cancel" onClick={onCancel} disabled={isProcessing} />
        <Button
          mode="default"
          text={isProcessing ? 'Processing...' : 'Crop Image'}
          tone="primary"
          onClick={getCroppedImg}
          disabled={!completedCrop || isProcessing}
        />
      </Flex>
    </Card>
  )
}

export default ImageCropper
