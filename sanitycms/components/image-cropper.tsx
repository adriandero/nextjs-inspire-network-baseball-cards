// image-cropper.tsx
'use client'
import {FC, useCallback, useState} from 'react'
import Cropper, {Area} from 'react-easy-crop'
import {Button, Card, Flex} from '@sanity/ui'

interface ImageCropperProps {
  image: string
  onCropped: (blob: Blob) => void // Changed: now returns Blob instead of base64
  onCancel: () => void
}

const ImageCropper: FC<ImageCropperProps> = ({image, onCropped, onCancel}) => {
  const [crop, setCrop] = useState<{x: number; y: number}>({x: 0, y: 0})
  const [zoom, setZoom] = useState<number>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = (err) => reject(err)
      img.crossOrigin = 'anonymous'
      img.src = url
    })

  const getCroppedImg = useCallback(async () => {
    if (!croppedAreaPixels) return

    setIsProcessing(true)
    try {
      const img = await createImage(image)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      )

      // Convert canvas to Blob instead of base64
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropped(blob)
          }
        },
        'image/jpeg',
        0.95, // Quality: 0.95 = 95% (good balance of quality/size)
      )
    } finally {
      setIsProcessing(false)
    }
  }, [image, croppedAreaPixels, onCropped])

  return (
    <Card>
      <div style={{position: 'relative', width: '100%', height: 300}}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <Flex gap={2} justify="flex-end" padding={3}>
        <Button mode="ghost" text="Cancel" onClick={onCancel} disabled={isProcessing} />
        <Button
          mode="default"
          text={isProcessing ? 'Processing...' : 'Crop Image'}
          tone="primary"
          onClick={getCroppedImg}
          disabled={!croppedAreaPixels || isProcessing}
        />
      </Flex>
    </Card>
  )
}

export default ImageCropper
