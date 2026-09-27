import { useRef, useState } from 'react';
import { Image, Save, Trash2, Upload } from 'lucide-react';
import { useBusinessProfile } from '../hooks/useBusinessProfile';
import { useToast } from '../hooks/useToast';

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export default function ConfigProfile() {
  const { profile, updateProfile } = useBusinessProfile();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    legalName: profile.legalName || '',
    logo: profile.logo || null
  });

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Il file selezionato non è un\'immagine valida.', 'error');
      return;
    }

    if (file.size > MAX_LOGO_SIZE_BYTES) {
      showToast('Il logo supera la dimensione massima di 2MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name.trim(),
      legalName: formData.legalName.trim(),
      logo: formData.logo
    });
    showToast('Profilo aggiornato con successo.', 'success');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Profilo Attività</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome attività</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="es. Bar Roma"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ragione sociale</label>
            <input
              type="text"
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
              placeholder="es. Bar Roma S.r.l."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo attività" className="h-full w-full object-cover" />
              ) : (
                <Image className="h-8 w-8 text-gray-300" />
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Carica logo
              </button>
              {formData.logo && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="flex items-center justify-center px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Rimuovi logo
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Salva
        </button>
      </form>
    </div>
  );
}
