import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useMediaStore } from '../../store/useMediaStore'

const EMPTY_FORM = {
  title:       '',
  description: '',
  type:        'video',
  url:         '',
  thumbnail:   '',
  duration:    '',
  genre:       '',
}

export default function MediaFormModal({ isOpen, onClose, item = null }) {
  const { addItem, updateItem } = useMediaStore()
  const [form, setForm]       = useState(EMPTY_FORM)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const isEditing = !!item

  useEffect(() => {
    if (item) {
      setForm({
        title:       item.title,
        description: item.description,
        type:        item.type,
        url:         item.url,
        thumbnail:   item.thumbnail,
        duration:    item.duration ?? '',
        genre:       item.genre,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
    setApiError('')
  }, [item, isOpen])

  const validate = () => {
    const e = {}
    if (!form.title.trim())     e.title     = 'Title is required.'
    if (!form.url.trim())       e.url       = 'Media URL is required.'
    if (!form.thumbnail.trim()) e.thumbnail = 'Thumbnail URL is required.'
    if (!form.genre.trim())     e.genre     = 'Genre is required.'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setLoading(true)
    setApiError('')
    try {
      const payload = { ...form, duration: form.duration || null }
      if (isEditing) {
        await updateItem(item.id, payload)
      } else {
        await addItem(payload)
      }
      onClose()
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const field = (name) => ({
    id:       name,
    value:    form[name],
    error:    errors[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Media Item' : 'Add New Media'}
    >
      <div className="space-y-4">
        <Input label="Title" placeholder="Enter title" {...field('title')} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="text-sm font-medium text-gray-300">
            Type
          </label>
          <select
            id="type"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-md bg-panel border border-border text-white
                       text-sm focus:outline-none focus:ring-2 focus:ring-accent/50
                       focus:border-accent transition-all"
          >
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="image">Image</option>
          </select>
        </div>

        <Input label="Media URL"      placeholder="https://..." {...field('url')} />
        <Input label="Thumbnail URL"  placeholder="https://..." {...field('thumbnail')} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Duration (optional)" placeholder="1:24:00"   {...field('duration')} />
          <Input label="Genre"               placeholder="e.g. Sci-Fi" {...field('genre')} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Short description…"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-md bg-panel border border-border text-white
                       text-sm placeholder:text-muted focus:outline-none focus:ring-2
                       focus:ring-accent/50 focus:border-accent transition-all resize-none"
          />
        </div>

        {apiError && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20
                        rounded-md px-3 py-2">
            {apiError}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="amber" onClick={handleSubmit} isLoading={loading}>
            {isEditing ? 'Save Changes' : 'Add Media'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
