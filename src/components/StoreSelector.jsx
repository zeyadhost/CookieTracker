import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStoreItems } from '../services/api';

// Friendly display names for API types
const TYPE_LABELS = {
  'ShopItem::ThirdPartyPhysical': { label: 'Physical Goods', emoji: '📦' },
  'ShopItem::Accessory': { label: 'Accessories', emoji: '🔧' },
  'ShopItem::FreeStickers': { label: 'Free Stickers', emoji: '🎁' },
  'ShopItem::HCBGrant': { label: 'HCB Grants', emoji: '💰' },
  'ShopItem::WarehouseItem': { label: 'Warehouse', emoji: '🏭' },
  'ShopItem::ThirdPartyDigital': { label: 'Digital', emoji: '💻' },
  'ShopItem::HackClubberItem': { label: 'By Hack Clubbers', emoji: '🧑‍💻' },
  'ShopItem::PileOfStickersItem': { label: 'Sticker Piles', emoji: '📚' },
  'ShopItem::SpecialFulfillmentItem': { label: 'Local Pickup', emoji: '📍' },
  'ShopItem::HQMailItem': { label: 'HQ Mail', emoji: '✉️' },
};

const getTypeLabel = (type) => TYPE_LABELS[type]?.label || type;
const getTypeEmoji = (type) => TYPE_LABELS[type]?.emoji || '📦';

function StoreSelector({ onSelect, onClose }) {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [step, setStep] = useState('main'); // 'main' or 'accessories'

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        const data = await fetchStoreItems();
        setAllItems(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  // Main items (not accessories)
  const mainItems = allItems.filter(item => item.type !== 'ShopItem::Accessory');
  
  // Get accessories for selected item
  const availableAccessories = selectedItem 
    ? allItems.filter(item => 
        item.type === 'ShopItem::Accessory' && 
        item.attached_shop_item_ids?.includes(selectedItem.id)
      )
    : [];

  // Group accessories by their tag (ram, storage, etc.)
  const accessoryGroups = availableAccessories.reduce((groups, acc) => {
    const tag = acc.accessory_tag || 'other';
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(acc);
    return groups;
  }, {});

  // Sort groups and items by cost
  Object.keys(accessoryGroups).forEach(tag => {
    accessoryGroups[tag].sort((a, b) => (a.ticket_cost?.base_cost || 0) - (b.ticket_cost?.base_cost || 0));
  });

  const itemTypes = ['all', ...new Set(mainItems.map(item => item.type).filter(Boolean))];

  const filteredItems = filter === 'all' 
    ? mainItems 
    : mainItems.filter(item => item.type === filter);

  // Select accessory - only one per tag group
  const selectAccessory = (accessory) => {
    const tag = accessory.accessory_tag || 'other';
    setSelectedAccessories(prev => {
      // Check if this exact accessory is already selected
      const exists = prev.find(a => a.id === accessory.id);
      if (exists) {
        // Deselect it
        return prev.filter(a => a.id !== accessory.id);
      }
      // Remove any other accessory with the same tag and add this one
      return [...prev.filter(a => (a.accessory_tag || 'other') !== tag), accessory];
    });
  };

  const totalCost = (selectedItem?.ticket_cost?.base_cost || 0) + 
    selectedAccessories.reduce((sum, acc) => sum + (acc.ticket_cost?.base_cost || 0), 0);

  const handleSelectMainItem = (item) => {
    setSelectedItem(item);
    setSelectedAccessories([]);
  };

  const handleContinue = () => {
    if (availableAccessories.length > 0) {
      setStep('accessories');
    } else {
      handleConfirm();
    }
  };

  const handleBack = () => {
    setStep('main');
    setSelectedAccessories([]);
  };

  const handleConfirm = () => {
    if (selectedItem) {
      const targetData = {
        ...selectedItem,
        accessories: selectedAccessories,
        totalCost,
      };
      localStorage.setItem('flavortown_target_item', JSON.stringify(targetData));
      onSelect(targetData);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      <motion.div
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--color-bg)' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div 
          className="p-6 border-b"
          style={{ backgroundColor: 'var(--color-bg-2)', borderColor: 'var(--color-brown-400)' }}
        >
          <h2 
            className="text-3xl text-center"
            style={{ fontFamily: 'Jua, cursive', color: 'var(--color-text-header)' }}
          >
            {step === 'main' ? '🛒 Choose Your Target' : '🔧 Add Upgrades'}
          </h2>
          <p 
            className="text-center mt-2"
            style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}
          >
            {step === 'main' 
              ? 'Select the item you\'re saving up for' 
              : `Customize your ${selectedItem?.name}`
            }
          </p>

          {step === 'main' && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {itemTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className="px-3 py-1.5 rounded-full text-sm font-bold transition-all hover:scale-105"
                  style={{
                    fontFamily: 'Sour Gummy, sans-serif',
                    backgroundColor: filter === type ? 'var(--color-brown-500)' : 'var(--color-bg)',
                    color: filter === type ? 'white' : 'var(--color-text-body)',
                    border: `2px solid ${filter === type ? 'var(--color-brown-500)' : 'var(--color-brown-300)'}`,
                  }}
                >
                  {type === 'all' ? '🛒 All Items' : `${getTypeEmoji(type)} ${getTypeLabel(type)}`}
                </button>
              ))}
            </div>
          )}

          {step === 'accessories' && selectedItem && (
            <div className="flex items-center justify-center gap-4 mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
              {selectedItem.image_url && (
                <img src={selectedItem.image_url} alt={selectedItem.name} className="w-12 h-12 object-contain" />
              )}
              <div>
                <p style={{ fontFamily: 'Jua, cursive', color: 'var(--color-text-header)' }}>{selectedItem.name}</p>
                <p className="text-sm" style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
                  🍪 {(selectedItem.ticket_cost?.base_cost || 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-brown-400)',
                      animation: `bounce 1.4s infinite ease-in-out both`,
                      animationDelay: `${i * 0.16}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div 
              className="text-center py-12"
              style={{ fontFamily: 'Jua, cursive', color: 'var(--color-red-500)' }}
            >
              {error}
            </div>
          )}

          {/* Main Items Grid */}
          {!loading && !error && step === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  className="rounded-xl p-4 cursor-pointer transition-all"
                  style={{
                    backgroundColor: 'var(--color-bg-2)',
                    border: selectedItem?.id === item.id 
                      ? '3px solid var(--color-green-500)' 
                      : '3px solid transparent',
                  }}
                  onClick={() => handleSelectMainItem(item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.image_url && (
                    <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-white/50">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  <h3 
                    className="text-lg font-bold mb-1"
                    style={{ fontFamily: 'Jua, cursive', color: 'var(--color-text-header)' }}
                  >
                    {item.name}
                  </h3>
                  
                  <p 
                    className="text-sm mb-2 line-clamp-2"
                    style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}
                  >
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-xl font-bold"
                      style={{ fontFamily: 'Jua, cursive', color: 'var(--color-brown-500)' }}
                    >
                      🍪 {(item.ticket_cost?.base_cost || 0).toLocaleString()}
                    </span>
                    
                    {item.type && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          fontFamily: 'Sour Gummy, sans-serif',
                          backgroundColor: 'var(--color-brown-300)',
                          color: 'var(--color-brown-600)',
                        }}
                      >
                        {getTypeLabel(item.type)}
                      </span>
                    )}
                  </div>

                  {item.limited && (
                    <div 
                      className="mt-2 text-xs font-bold"
                      style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-red-500)' }}
                    >
                      Limited Edition • {item.stock} left
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Accessories - Grouped by tag */}
          {!loading && !error && step === 'accessories' && (
            <div className="space-y-6">
              {Object.entries(accessoryGroups).map(([tag, accessories]) => (
                <div key={tag} className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-2)' }}>
                  <h3 
                    className="text-xl font-bold mb-3 text-center capitalize"
                    style={{ fontFamily: 'Jua, cursive', color: 'var(--color-text-header)' }}
                  >
                    {tag === 'other' ? 'Accessories' : tag}
                  </h3>
                  
                  <div className="space-y-2">
                    {accessories.map(acc => {
                      const isSelected = selectedAccessories.some(a => a.id === acc.id);
                      return (
                        <motion.div
                          key={acc.id}
                          className="rounded-lg px-4 py-3 cursor-pointer flex items-center justify-between"
                          style={{
                            backgroundColor: isSelected ? 'var(--color-brown-300)' : 'var(--color-bg)',
                            border: isSelected 
                              ? '2px solid var(--color-brown-500)' 
                              : '2px solid transparent',
                          }}
                          onClick={() => selectAccessory(acc)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center gap-3">
                            {/* Radio-style indicator */}
                            <div 
                              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                              style={{ 
                                borderColor: isSelected ? 'var(--color-brown-600)' : 'var(--color-brown-400)',
                                backgroundColor: isSelected ? 'var(--color-brown-500)' : 'transparent',
                              }}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            
                            <span 
                              className="font-medium"
                              style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-body)' }}
                            >
                              {acc.name}
                            </span>
                          </div>
                          
                          <span 
                            className="font-bold flex items-center gap-1"
                            style={{ fontFamily: 'Jua, cursive', color: 'var(--color-brown-500)' }}
                          >
                            🍪 {(acc.ticket_cost?.base_cost || 0).toLocaleString()}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {Object.keys(accessoryGroups).length === 0 && (
                <div className="text-center py-8">
                  <p style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
                    No upgrades available for this item
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="p-4 border-t flex items-center gap-3"
          style={{ backgroundColor: 'var(--color-bg-2)', borderColor: 'var(--color-brown-400)' }}
        >
          {step === 'accessories' && (
            <button
              onClick={handleBack}
              className="px-4 py-3 rounded-lg font-bold"
              style={{
                fontFamily: 'Jua, cursive',
                backgroundColor: 'var(--color-brown-400)',
                color: 'white',
              }}
            >
              ← Back
            </button>
          )}

          {step === 'main' && (
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-bold"
              style={{
                fontFamily: 'Jua, cursive',
                backgroundColor: 'var(--color-brown-400)',
                color: 'white',
              }}
            >
              Cancel
            </button>
          )}

          {selectedItem && (
            <div className="flex-1 text-right mr-4">
              <p className="text-sm" style={{ fontFamily: 'Sour Gummy, sans-serif', color: 'var(--color-text-muted)' }}>
                Total Target
              </p>
              <p className="text-xl font-bold" style={{ fontFamily: 'Jua, cursive', color: 'var(--color-brown-500)' }}>
                🍪 {totalCost.toLocaleString()}
              </p>
            </div>
          )}
          
          <motion.button
            onClick={step === 'main' ? handleContinue : handleConfirm}
            disabled={!selectedItem}
            className="px-6 py-3 rounded-lg font-bold transition-opacity disabled:opacity-50"
            style={{
              fontFamily: 'Jua, cursive',
              backgroundColor: 'var(--color-green-500)',
              color: 'white',
            }}
            whileHover={{ scale: selectedItem ? 1.02 : 1 }}
            whileTap={{ scale: selectedItem ? 0.98 : 1 }}
          >
            {!selectedItem 
              ? 'Select an item' 
              : step === 'main' && availableAccessories.length > 0
                ? `Next: Add Upgrades →`
                : `Confirm Target`
            }
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StoreSelector;
