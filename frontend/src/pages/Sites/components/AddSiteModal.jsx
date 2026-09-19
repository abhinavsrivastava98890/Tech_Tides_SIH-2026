import { useState } from 'react';
import { X } from 'lucide-react';
import SearchableSelect from '../../../components/ui/SearchableSelect';
import { getDistricts, getBlocks, getVillages } from '../../../utils/locationData';

export default function AddSiteModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    siteId: '',
    district: '',
    block: '',
    village: '',
    sourceType: 'Borewell',
    population: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      siteId: '',
      district: '',
      block: '',
      village: '',
      sourceType: 'Borewell',
      population: ''
    });
    onClose();
  };

  const handleDistrictChange = (val) => {
    setFormData({ ...formData, district: val, block: '', village: '' });
  };

  const handleBlockChange = (val) => {
    setFormData({ ...formData, block: val, village: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Add New Site</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Site ID</label>
              <input 
                type="text" 
                required
                value={formData.siteId}
                onChange={(e) => setFormData({...formData, siteId: e.target.value})}
                placeholder="e.g. JR-UNIT-102"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                <SearchableSelect 
                  options={getDistricts()}
                  value={formData.district}
                  onChange={handleDistrictChange}
                  placeholder="Select District"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Block</label>
                <SearchableSelect 
                  options={getBlocks(formData.district)}
                  value={formData.block}
                  onChange={handleBlockChange}
                  placeholder="Select Block"
                  disabled={!formData.district}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Village</label>
                <SearchableSelect 
                  options={getVillages(formData.district, formData.block)}
                  value={formData.village}
                  onChange={(val) => setFormData({...formData, village: val})}
                  placeholder="Select Village"
                  disabled={!formData.block}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Population Served</label>
                <input 
                  type="number" 
                  required
                  value={formData.population}
                  onChange={(e) => setFormData({...formData, population: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Water Source Type</label>
              <select 
                value={formData.sourceType}
                onChange={(e) => setFormData({...formData, sourceType: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="Borewell">Borewell</option>
                <option value="Surface Water">Surface Water (River/Lake)</option>
                <option value="Groundwater">Groundwater</option>
                <option value="Municipal Supply">Municipal Supply</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Save Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
