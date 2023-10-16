'use client'

import Modal from '@/app/components/Modal'
import Image from 'next/image'
import { FC } from 'react'

interface ImageModalProps {
  src?: string | null
  isOpen: boolean
  onClose: () => void
}

const ImageModal: FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  if (!src) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-80 h-80 ">
        <Image alt="" src={src} fill className="object-over" />
      </div>
    </Modal>
  )
}

export default ImageModal
