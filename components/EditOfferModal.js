import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const EditOfferModal = ({ isOpen, onClose, editingOffer, onSubmit, kdvRates, setEditingOffer }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 lg:hidden overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Teklif Düzenle</h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Firma
            </label>
            <input
              type="text"
              value={editingOffer.offer.firm}
              onChange={(e) => setEditingOffer({
                ...editingOffer,
                offer: { ...editingOffer.offer, firm: e.target.value }
              })}
              className="w-full py-2 px-3 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fiyat
            </label>
            <input
              type="number"
              value={editingOffer.offer.price}
              onChange={(e) => setEditingOffer({
                ...editingOffer,
                offer: { ...editingOffer.offer, price: e.target.value }
              })}
              className="w-full py-2 px-3 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KDV Oranı
            </label>
            <select
              value={editingOffer.offer.kdvRate}
              onChange={(e) => setEditingOffer({
                ...editingOffer,
                offer: { ...editingOffer.offer, kdvRate: Number(e.target.value) }
              })}
              className="w-full py-2 px-3 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {kdvRates.map(rate => (
                <option key={rate} value={rate}>KDV {rate}%</option>
              ))}
            </select>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium"
            >
              İptal
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium"
            >
              Kaydet
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditOfferModal;
