"use client";

import React, { useState, useEffect } from 'react';
import { FaHistory, FaArrowUp, FaArrowDown, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const History = ({ updateTrigger }) => {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [updateTrigger]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 mb-6"
      >
        <div className="flex items-center gap-2">
          <FaHistory className="text-blue-600" />
          <h2 className="text-lg font-semibold">Fiyat Değişim Geçmişi</h2>
          <span className="text-sm text-gray-500">({history.length} değişiklik)</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {history.map((record, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{record.productName}</h3>
                    <p className="text-sm text-gray-600">{record.firm}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(record.date).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {record.oldPrice.toLocaleString()} TL
                      </span>
                      {record.priceChange > 0 ? (
                        <FaArrowUp className="text-red-500" />
                      ) : (
                        <FaArrowDown className="text-green-500" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {record.newPrice.toLocaleString()} TL
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      KDV: %{record.kdvRate}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;