"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaBox, FaBuilding, FaMoneyBillWave, FaPercent, FaChartLine, FaList, FaSearch } from 'react-icons/fa';

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([
    { id: 1, name: 'Ürün 1', offers: [{ firm: 'Firma A', price: 100 }, { firm: 'Firma B', price: 150 }] },
    { id: 2, name: 'Ürün 2', offers: [{ firm: 'Firma C', price: 200 }, { firm: 'Firma D', price: 250 }] },
  ]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    offers: []
  });
  const [newOffer, setNewOffer] = useState({
    firm: '',
    price: '',
    kdvRate: 1 // default KDV rate
  });
  const [searchTerm, setSearchTerm] = useState('');

  const kdvRates = [1, 10, 20];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data.products || []);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const product = {
      id: products.length + 1,
      name: newProduct.name,
      offers: []
    };
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    setNewProduct({ name: '', offers: [] });
    
    // Save to API
    await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products: updatedProducts }),
    });
  };

  const calculatePriceWithKdv = (price, kdvRate) => {
    const kdvAmount = (price * (kdvRate || 0)) / 100;
    return price + kdvAmount;
  };

  const handleAddOffer = async (productId) => {
    if (!newOffer.firm || !newOffer.price) return;

    const basePrice = Number(newOffer.price);
    const priceWithKdv = calculatePriceWithKdv(basePrice, newOffer.kdvRate);

    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        const updatedProduct = {
          ...product,
          offers: [...product.offers, {
            firm: newOffer.firm,
            price: basePrice,
            kdvRate: newOffer.kdvRate,
            priceWithKdv
          }]
        };
        setSelectedProduct(updatedProduct);
        return updatedProduct;
      }
      return product;
    });

    setProducts(updatedProducts);
    setNewOffer({ firm: '', price: '', kdvRate: 1 });

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: updatedProducts }),
      });

      if (!response.ok) {
        throw new Error('Failed to save offer');
      }

      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error('Error saving offer:', error);
    }
  };

  const calculateAveragePrice = (offers) => {
    if (!offers || offers.length === 0) return { avgWithKdv: 0, avgWithoutKdv: 0 };
    
    const sum = offers.reduce((acc, offer) => {
      const withKdv = offer.priceWithKdv || calculatePriceWithKdv(offer.price, offer.kdvRate);
      return {
        withKdv: acc.withKdv + withKdv,
        withoutKdv: acc.withoutKdv + offer.price
      };
    }, { withKdv: 0, withoutKdv: 0 });

    return {
      avgWithKdv: (sum.withKdv / offers.length).toFixed(2),
      avgWithoutKdv: (sum.withoutKdv / offers.length).toFixed(2)
    };
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between py-4 sm:h-16 sm:py-0 gap-4 sm:gap-0 items-center">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
              <div className="flex items-center gap-2">
                <FaBox className="text-blue-600 text-2xl" />
                <span className="text-xl font-semibold text-gray-900">Teklif Yönetimi</span>
              </div>
              {/* Mobile menu button could go here */}
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          {/* Make stats cards more compact on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <FaList className="text-blue-600 text-lg sm:text-xl" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Toplam Ürün</p>
                <p className="text-lg sm:text-2xl font-semibold">{products.length}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <FaMoneyBillWave className="text-green-600 text-lg sm:text-xl" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Toplam Teklif</p>
                <p className="text-lg sm:text-2xl font-semibold">
                  {products.reduce((acc, product) => acc + product.offers.length, 0)}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <FaChartLine className="text-purple-600 text-lg sm:text-xl" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Ortalama Teklif/Ürün</p>
                <p className="text-lg sm:text-2xl font-semibold">
                  {(products.reduce((acc, product) => acc + product.offers.length, 0) / products.length || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Products Grid - Make it stack on mobile */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Product List Panel */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Ürünler</h2>
                <span className="text-sm text-gray-500">{filteredProducts.length} ürün</span>
              </div>

              <div className="space-y-2 mb-4 sm:mb-6 max-h-[60vh] overflow-y-auto">
                {/* Add scroll for long lists */}
                {filteredProducts.map((product) => {
                  const averages = calculateAveragePrice(product.offers);
                  return (
                    <motion.button
                      key={product.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleProductClick(product)}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        selectedProduct?.id === product.id
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-900">{product.name}</span>
                        <span className="text-sm text-gray-500">{product.offers.length} teklif</span>
                      </div>
                      {product.offers.length > 0 && (
                        <div className="mt-2 text-sm">
                          <div className="text-gray-600">
                            Ort. KDV'siz: {averages.avgWithoutKdv} TL
                          </div>
                          <div className="text-green-600">
                            Ort. KDV'li: {averages.avgWithKdv} TL
                          </div>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <form onSubmit={handleAddProduct} className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Yeni ürün adı"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="flex-1 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Offers Panel - Show above product list on mobile */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {selectedProduct ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-600" />
                    {selectedProduct.name}
                  </h2>
                  <span className="text-sm text-gray-500">{selectedProduct.offers.length} teklif</span>
                </div>

                <div className="space-y-4 mb-6">
                  {selectedProduct.offers
                    .sort((a, b) => {
                      const bPrice = b.priceWithKdv || calculatePriceWithKdv(b.price, b.kdvRate);
                      const aPrice = a.priceWithKdv || calculatePriceWithKdv(a.price, a.kdvRate);
                      return bPrice - aPrice;
                    })
                    .map((offer, index) => {
                      const priceWithKdv = offer.priceWithKdv || 
                        calculatePriceWithKdv(offer.price, offer.kdvRate);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <FaBuilding className="text-gray-400" />
                              <span className="font-medium text-gray-900">{offer.firm}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                KDV'siz: {offer.price.toLocaleString()} TL
                              </div>
                              <div className="font-medium text-green-600">
                                KDV'li (%{offer.kdvRate}): {priceWithKdv.toLocaleString()} TL
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAddOffer(selectedProduct.id); }}>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Firma adı"
                      value={newOffer.firm}
                      onChange={(e) => setNewOffer({ ...newOffer, firm: e.target.value })}
                      className="flex-1 rounded-lg border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    />
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Fiyat"
                        value={newOffer.price}
                        onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })}
                        className="flex-1 sm:w-32 rounded-lg border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      />
                      <select
                        value={newOffer.kdvRate}
                        onChange={(e) => setNewOffer({ ...newOffer, kdvRate: Number(e.target.value) })}
                        className="flex-1 sm:w-32 rounded-lg border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      >
                        {kdvRates.map(rate => (
                          <option key={rate} value={rate}>KDV {rate}%</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <span className="sm:hidden">Teklif Ekle</span>
                      <FaPlus className="hidden sm:block" />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="h-32 sm:h-full flex items-center justify-center bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <p className="text-gray-500">Detayları görüntülemek için bir ürün seçin</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductList;