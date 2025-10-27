import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { useCreateCollection } from '@/api/queries/useCollection'

interface CollectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CollectionModal = ({ isOpen, onClose }: CollectionModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  
  const createCollectionMutation = useCreateCollection()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Collection name is required')
      return
    }

    try {
      await createCollectionMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      })
      
      // Reset form and close modal
      setName('')
      setDescription('')
      onClose()
    } catch (error) {
      console.error('Failed to create collection:', error)
      setError('Failed to create collection. Please try again.')
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Collection"
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
        {/* Name Input */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="collection-name" className="text-[16px] font-bold text-white">
            Collection Name *
          </label>
          <input
            id="collection-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="Enter collection name..."
            className="h-[52px] bg-[var(--color-background-15)] border border-[var(--color-background-25)] rounded-[16px] px-[20px] text-white text-[16px] outline-none focus:border-[var(--color-background-21)] transition-colors"
            maxLength={100}
            required
          />
        </div>

        {/* Description Textarea */}
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="collection-description" className="text-[16px] font-bold text-white">
            Description (Optional)
          </label>
          <textarea
            id="collection-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter collection description..."
            className="min-h-[120px] bg-[var(--color-background-15)] border border-[var(--color-background-25)] rounded-[16px] px-[20px] py-[16px] text-white text-[16px] outline-none focus:border-[var(--color-background-21)] transition-colors resize-none"
            maxLength={500}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-[12px] px-[16px] py-[12px]">
            <p className="text-red-400 text-[14px]">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[12px]">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={createCollectionMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createCollectionMutation.isPending}
            disabled={!name.trim()}
          >
            Create Collection
          </Button>
        </div>
      </form>
    </Modal>
  )
}

