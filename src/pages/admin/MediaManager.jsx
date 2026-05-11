import { useState, useRef } from 'react';
import { useMediaStore } from '../../store/useMediaStore';
import Button from '../../components/ui/Button';

const ACCEPTED = 'video/*,audio/*';

export default function MediaManager() {
  const { items, uploading, uploadProgress, error, upload, removeItem, getStreamUrl, clearError } =
    useMediaStore();

  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [localErr, setLocalErr] = useState('');
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setLocalErr('Selecciona un archivo primero.');
      return;
    }
    setLocalErr('');
    clearError();
    try {
      await upload(file, title);
      setFile(null);
      setTitle('');
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      // error ya está en el store
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar este elemento de la biblioteca?')) return;
    removeItem(id);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 page-enter">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-display text-3xl font-extrabold text-white">Gestor de Medios</h2>
        </div>
        <p className="text-muted text-sm">{items.length} elementos en la biblioteca</p>
      </div>

      <div className="glass rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-white mb-4">Subir archivo</h3>
        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-muted mb-1">Archivo (video o audio)</label>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED}
              onChange={handleFileChange}
              className="w-full text-sm text-muted bg-panel border border-border rounded-md
                         px-3 py-2 file:mr-3 file:py-1 file:px-3 file:rounded-md
                         file:border-0 file:text-xs file:font-medium
                         file:bg-accent/20 file:text-accent cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-muted mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-panel border border-border rounded-md px-3 py-2
                         text-white focus:outline-none
                         focus:ring-2 focus:ring-accent/50 focus:border-accent"
            />
          </div>
          <Button type="submit" variant="amber" isLoading={uploading} className="shrink-0">
            Subir
          </Button>
        </form>

        {uploading && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>Subiendo…</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-1.5">
              <div
                className="bg-accent h-1.5 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {(localErr || error) && <p className="mt-3 text-red-400 text-sm">{localErr || error}</p>}
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-panel/50">
                {['Título', 'Tipo', 'Archivo', 'Subido', 'Acciones'].map((col) => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted">
                    Sin contenido. Sube tu primer archivo arriba.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-card/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white max-w-[200px]">
                      <span className="line-clamp-1">{item.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs bg-card px-2 py-1 rounded-full text-muted border border-border">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs font-mono max-w-[200px]">
                      <span className="line-clamp-1">{item.filename}</span>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(getStreamUrl(item.filename), '_blank')}
                        >
                          Reproducir
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
