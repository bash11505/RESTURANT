import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, CreditCard, Box, 
  Utensils, BarChart3, Users, Megaphone, 
  UserCheck, LogOut, Menu, X, Bell, Search, Plus, Loader2, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal.tsx';

// Mock Data
const INITIAL_MENU_ITEMS = [
  { id: '1', name: 'Coffee', price: 5.0, category: 'Beverages' },
  { id: '2', name: 'Biriyani', price: 15.0, category: 'Main Course' },
  { id: '3', name: 'Fry Pieces', price: 12.0, category: 'Appetizers' },
  { id: '4', name: 'Juices', price: 6.0, category: 'Beverages' },
  { id: '5', name: 'Veg Fried Rice', price: 10.0, category: 'Main Course' }
];

const INITIAL_ORDERS = [
  { id: 'ord-101', table_number: '5', status: 'ready', total_amount: 25.50, items: [{ name: 'Coffee', price: 5 }, { name: 'Biriyani', price: 15 }], created_at: new Date() },
  { id: 'ord-102', table_number: '2', status: 'preparing', total_amount: 12.00, items: [{ name: 'Fry Pieces', price: 12 }], created_at: new Date() }
];

const INITIAL_INVENTORY = [
  { id: 'inv-1', item_name: 'Chicken', quantity: 45, threshold: 10, unit: 'kg' },
  { id: 'inv-2', item_name: 'Rice', quantity: 120, threshold: 20, unit: 'kg' },
  { id: 'inv-3', item_name: 'Milk', quantity: 5, threshold: 8, unit: 'liters' }
];

const INITIAL_STAFF = [
  { id: 'st-1', name: 'Rahul', role: 'Chef', attendance: 'present' },
  { id: 'st-2', name: 'Sneha', role: 'Waitstaff', attendance: 'present' },
  { id: 'st-3', name: 'Amit', role: 'Cleaner', attendance: 'absent' }
];

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'inventory', label: 'Inventory', icon: Box },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [orders, setOrders] = useState<any[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<any[]>(INITIAL_INVENTORY);
  const [staff, setStaff] = useState<any[]>(INITIAL_STAFF);
  const [menuItemsData] = useState<any[]>(INITIAL_MENU_ITEMS);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'manage'>('add');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form States
  const [inventoryForm, setInventoryForm] = useState({ item_name: '', quantity: 0, threshold: 0, unit: 'pcs' });
  const [staffForm, setStaffForm] = useState({ name: '', role: '', attendance: 'present' });
  const [orderForm, setOrderForm] = useState({ table_number: '', items: [], total_amount: 0, status: 'pending' });
  const [selectedMenuItems, setSelectedMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      setAnalyticsData({
        itemsOrdered: [],
        dailyAnalytics: [],
        weeklyAnalytics: [],
        monthlyAnalytics: []
      });
    }
  }, [activeTab]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setCurrentItem(null);
    setInventoryForm({ item_name: '', quantity: 0, threshold: 0, unit: 'pcs' });
    setStaffForm({ name: '', role: '', attendance: 'present' });
    setOrderForm({ table_number: '', items: [], total_amount: 0, status: 'pending' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setModalMode('edit');
    setCurrentItem(item);
    if (activeTab === 'inventory') setInventoryForm({ ...item });
    if (activeTab === 'staff') setStaffForm({ ...item });
    if (activeTab === 'orders' || activeTab === 'billing') {
      setModalMode('manage');
      setOrderForm({ ...item });
      setSelectedMenuItems([]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (activeTab === 'inventory') {
        if (modalMode === 'add') {
          const newItem = { ...inventoryForm, id: `inv-${Date.now()}` };
          setInventory([...inventory, newItem]);
        } else {
          setInventory(inventory.map(item => item.id === currentItem.id ? { ...item, ...inventoryForm } : item));
        }
      } else if (activeTab === 'staff') {
        if (modalMode === 'add') {
          const newItem = { ...staffForm, id: `st-${Date.now()}` };
          setStaff([...staff, newItem]);
        } else {
          setStaff(staff.map(item => item.id === currentItem.id ? { ...item, ...staffForm } : item));
        }
      } else if (activeTab === 'orders' || activeTab === 'billing') {
        if (modalMode === 'add') {
          const newItem = { 
            ...orderForm, 
            id: `ord-${Date.now()}`,
            created_at: new Date() 
          };
          setOrders([newItem, ...orders]);
        } else if (modalMode === 'manage') {
          const updatedItems = [...(orderForm.items || []), ...selectedMenuItems];
          const newTotal = (orderForm.total_amount || 0) + selectedMenuItems.reduce((sum, item) => sum + item.price, 0);
          setOrders(orders.map(order => order.id === currentItem.id ? { 
            ...order, 
            items: updatedItems, 
            total_amount: newTotal,
            status: orderForm.status
          } : order));
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    if (activeTab === 'inventory') setInventory(inventory.filter(i => i.id !== id));
    if (activeTab === 'staff') setStaff(staff.filter(i => i.id !== id));
    if (activeTab === 'orders') setOrders(orders.filter(i => i.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 h-screen bg-gray-200 border-r border-gray-300 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-4 flex-shrink-0">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex-shrink-0" />
          {isSidebarOpen && <span className="font-bold text-xl tracking-tighter text-gray-900">LUX RESTO</span>}
        </div>

        <nav className="mt-6 px-3 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-900'}`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-3 border-t border-gray-300 flex-shrink-0 bg-gray-200">
          <button
            onClick={() => setActiveTab('staff')}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === 'staff' ? 'bg-red-600/10 text-red-600 border border-red-600/20' : 'text-gray-500 hover:bg-gray-300 hover:text-gray-900'}`}
          >
            <UserCheck size={22} />
            {isSidebarOpen && <span className="font-medium">Staff Management</span>}
          </button>
          
          <div className={`p-4 rounded-2xl bg-gray-100 border border-gray-300 transition-all ${!isSidebarOpen && 'hidden'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-gray-900">{user?.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold text-red-800 hover:bg-red-50 transition-all border border-red-800/20"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
          
          {!isSidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 rounded-xl text-red-800 hover:bg-red-50 transition-all"
            >
              <LogOut size={22} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Header */}
        <header className="h-20 border-b border-gray-300 flex items-center justify-between px-8 bg-gray-100/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600">
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-gray-200 border border-gray-300 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-gray-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-gray-200 rounded-lg text-gray-600">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center font-bold text-white">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 relative min-h-[calc(100vh-80px)] bg-gray-100">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gray-100"
              >
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-red-600" size={40} />
                  <p className="text-gray-500 animate-pulse font-medium">Loading {activeTab}...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold capitalize text-gray-900">{activeTab}</h1>
                  {activeTab !== 'dashboard' && activeTab !== 'analytics' && (
                    <button 
                      onClick={handleOpenAddModal}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2 shadow-lg shadow-red-600/20"
                    >
                      <Plus size={18} /> Add New {activeTab.slice(0, -1)}
                    </button>
                  )}
                </div>

              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Revenue', value: '$24,500', change: '+12.5%', icon: CreditCard },
                    { label: 'Active Orders', value: '18', change: '+2', icon: ShoppingBag },
                    { label: 'Inventory Items', value: '142', change: 'Low Stock: 5', icon: Box },
                    { label: 'Staff Present', value: '12/15', change: '92%', icon: UserCheck },
                  ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-gray-200 border border-gray-300 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-600/10 rounded-lg">
                          <stat.icon className="text-red-600" size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-red-600 uppercase">{stat.change}</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'analytics' && analyticsData && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Items Ordered */}
                    <div className="p-6 rounded-3xl bg-gray-200 border border-gray-300">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
                        <BarChart3 className="text-red-600" size={20} />
                        Top Selling Items
                      </h3>
                      <div className="space-y-4">
                        {analyticsData.itemsOrdered.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-300 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600 font-bold text-xs">
                                {i + 1}
                              </div>
                              <span className="font-medium text-gray-800">{item.item_name}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{item.total_count} orders</p>
                              <p className="text-xs text-gray-500">${item.total_revenue.toFixed(2)} revenue</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Daily Stats */}
                    <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200">
                      <h3 className="text-lg font-bold mb-6 text-gray-900">Daily Performance</h3>
                      <div className="space-y-4">
                        {analyticsData.dailyAnalytics.map((day: any, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-gray-500">{new Date(day.date).toLocaleDateString()}</span>
                            <div className="flex items-center gap-8">
                              <span className="text-sm font-medium text-gray-700">{day.order_count} orders</span>
                              <span className="font-bold text-red-600">${day.total_amount.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Weekly Stats */}
                    <div className="p-6 rounded-3xl bg-gray-200 border border-gray-300">
                      <h3 className="text-lg font-bold mb-6 text-gray-900">Weekly Overview</h3>
                      <div className="space-y-4">
                        {analyticsData.weeklyAnalytics.map((week: any, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-gray-500">Week {week.week.split('-')[1]}</span>
                            <div className="flex items-center gap-8">
                              <span className="text-sm font-medium text-gray-700">{week.order_count} orders</span>
                              <span className="font-bold text-red-600">${week.total_amount.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Monthly Stats */}
                    <div className="p-6 rounded-3xl bg-gray-200 border border-gray-300">
                      <h3 className="text-lg font-bold mb-6 text-gray-900">Monthly Overview</h3>
                      <div className="space-y-4">
                        {analyticsData.monthlyAnalytics.map((month: any, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-gray-500">{month.month}</span>
                            <div className="flex items-center gap-8">
                              <span className="text-sm font-medium text-gray-700">{month.order_count} orders</span>
                              <span className="font-bold text-red-600">${month.total_amount.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== 'analytics' && (
                <div className="bg-gray-200 border border-gray-300 rounded-[2rem] overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-gray-300 flex items-center justify-between bg-gray-300/50">
                    <h3 className="font-bold text-gray-900">Recent {activeTab}</h3>
                    <button className="text-sm text-red-600 hover:underline font-semibold">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-gray-200 bg-gray-300/30">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Details</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {(activeTab === 'orders' || activeTab === 'billing') ? (
                          orders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-300 transition-colors">
                              <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">Table {order.table_number}</p>
                                <p className="text-xs text-gray-500">
                                  {Array.isArray(order.items) ? order.items.length : 0} items • ${order.total_amount}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 flex items-center gap-3">
                                <button onClick={() => handleOpenEditModal(order)} className="text-xs font-bold text-red-600 hover:text-red-700">Manage</button>
                                <button onClick={() => handleDeleteItem(order.id)} className="p-1 hover:bg-red-50 rounded text-red-800"><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          ))
                        ) : activeTab === 'inventory' ? (
                        inventory.map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-300 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">#{item.id}</td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900">{item.item_name}</p>
                              <p className="text-xs text-gray-500">Stock: {item.quantity} {item.unit} • Threshold: {item.threshold}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.quantity <= item.threshold ? 'bg-red-100 text-red-800' : 'bg-teal-100 text-teal-600'}`}>
                                {item.quantity <= item.threshold ? 'Low Stock' : 'In Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">-</td>
                            <td className="px-6 py-4 flex items-center gap-3">
                              <button onClick={() => handleOpenEditModal(item)} className="text-xs font-bold text-red-600 hover:text-red-700">Edit</button>
                              <button onClick={() => handleDeleteItem(item.id)} className="p-1 hover:bg-red-50 rounded text-red-800"><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))
                      ) : activeTab === 'staff' ? (
                        staff.map((s: any) => (
                          <tr key={s.id} className="hover:bg-gray-300 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">#{s.id}</td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900">{s.name}</p>
                              <p className="text-xs text-gray-500">{s.role}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${s.attendance === 'present' ? 'bg-teal-100 text-teal-600' : 'bg-red-100 text-red-800'}`}>
                                {s.attendance}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">-</td>
                            <td className="px-6 py-4 flex items-center gap-3">
                              <button onClick={() => handleOpenEditModal(s)} className="text-xs font-bold text-red-600 hover:text-red-700">Edit</button>
                              <button onClick={() => handleDeleteItem(s.id)} className="p-1 hover:bg-red-50 rounded text-red-800"><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        [1, 2, 3, 4, 5].map((i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">#00{i}</td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900">Sample Item {i}</p>
                              <p className="text-xs text-gray-500">Description for item {i}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-600 text-[10px] font-bold uppercase">Active</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">Mar 31, 2026</td>
                            <td className="px-6 py-4">
                              <button className="text-xs font-bold text-red-600 hover:text-red-700">Edit</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
      {/* Modals */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`${modalMode === 'add' ? 'Add New' : 'Edit'} ${activeTab.slice(0, -1)}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'inventory' && (
            <>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Item Name</label>
                <input 
                  type="text" 
                  disabled={modalMode === 'edit'}
                  value={inventoryForm.item_name}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, item_name: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="e.g. Tomato"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">Quantity</label>
                  <input 
                    type="number" 
                    value={inventoryForm.quantity}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: parseInt(e.target.value) })}
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">Threshold</label>
                  <input 
                    type="number" 
                    disabled={modalMode === 'edit'}
                    value={inventoryForm.threshold}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, threshold: parseInt(e.target.value) })}
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'staff' && (
            <>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Role</label>
                <input 
                  type="text" 
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="e.g. Chef"
                  required
                />
              </div>
            </>
          )}


          {(activeTab === 'orders' || activeTab === 'billing') && (
            <>
              {modalMode === 'add' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">Table Number</label>
                    <input 
                      type="text" 
                      value={orderForm.table_number}
                      onChange={(e) => setOrderForm({ ...orderForm, table_number: e.target.value })}
                      className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      placeholder="e.g. 5"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">Initial Total Amount ($)</label>
                    <input 
                      type="number" 
                      value={orderForm.total_amount}
                      onChange={(e) => setOrderForm({ ...orderForm, total_amount: parseFloat(e.target.value) })}
                      className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-gray-200 border border-gray-300">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Current Bill</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">${orderForm.total_amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Table {orderForm.table_number}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setOrderForm({ ...orderForm, status: 'paid' })}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${orderForm.status === 'paid' ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                        >
                          Mark Paid
                        </button>
                        <button 
                          type="button"
                          onClick={() => setOrderForm({ ...orderForm, status: 'pending' })}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${orderForm.status === 'pending' ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                        >
                          Pending
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-800">Add Items to Bill</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                      {menuItemsData.map((item: any) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedMenuItems([...selectedMenuItems, item])}
                          className="p-3 rounded-xl bg-gray-200 border border-gray-300 hover:border-red-500/50 text-left transition-all group"
                        >
                          <p className="text-sm font-medium group-hover:text-red-600 text-gray-800">{item.name}</p>
                          <p className="text-[10px] text-gray-500">${item.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedMenuItems.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Selected Items</p>
                      <div className="space-y-1">
                        {selectedMenuItems.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-sm group/item">
                            <span className="text-gray-700">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-gray-400">${item.price}</span>
                              <button 
                                type="button"
                                onClick={() => setSelectedMenuItems(selectedMenuItems.filter((_, index) => index !== i))}
                                className="text-red-800 opacity-0 group-hover/item:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-gray-100 space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Additional Total</span>
                            <span>${selectedMenuItems.reduce((s, i) => s + i.price, 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-red-600 text-lg">
                            <span>New Total</span>
                            <span>${(orderForm.total_amount + selectedMenuItems.reduce((s, i) => s + i.price, 0)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={formLoading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
          >
            {formLoading ? <Loader2 className="animate-spin" size={20} /> : `${modalMode === 'add' ? 'Create' : 'Update'} ${activeTab.slice(0, -1)}`}
          </button>
        </form>
      </Modal>
    </div>
  );
}
