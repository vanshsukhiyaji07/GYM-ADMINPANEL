
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plan } from '../types';
import { Icons } from '../constants';

const Payments: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: 0, durationMonths: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const data = await api.plans.getAll();
    setPlans(data);
    setLoading(false);
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await api.plans.create(formData);
    setIsModalOpen(false);
    setFormData({ name: '', price: 0, durationMonths: 1 });
    await loadPlans();
    setIsSubmitting(false);
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm('Delete this membership tier? This will not affect existing members but prevents new registrations.')) {
      setPlans(prev => prev.filter(p => p.id !== id));
      await api.plans.delete(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
          <p className="text-blue-100 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Projected MRR</p>
          <h3 className="text-4xl font-black tracking-tighter">$14,820.00</h3>
          <div className="mt-6 flex items-center gap-2 text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
            <span className="text-blue-200">↑ 12.5%</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Pending Invoices</p>
          <h3 className="text-4xl font-black tracking-tighter text-slate-900">14</h3>
          <button className="mt-4 text-blue-600 font-bold text-xs uppercase tracking-widest">Collection Sync →</button>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Subscription Tiers</p>
          <h3 className="text-4xl font-black tracking-tighter text-slate-900">{plans.length}</h3>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 text-blue-600 font-bold text-xs uppercase tracking-widest">Add New Tier →</button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h4 className="text-xl font-black text-slate-900 tracking-tight">Active Plans</h4>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg active:scale-95"
          >
            Create Plan
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Validity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && plans.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-400">Loading plans...</td></tr>
              ) : plans.map(plan => (
                <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900">{plan.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">UID: {plan.id}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-lg font-black text-slate-900">${plan.price}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      {plan.durationMonths} Month{plan.durationMonths > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 text-slate-200 hover:text-red-500 transition-all"
                      title="Delete Plan"
                    >
                      <Icons.Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">New Tier Config</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900"><Icons.Trash /></button>
            </div>
            <form onSubmit={handleAddPlan} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Tier Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-bold outline-none"
                  placeholder="e.g. VIP Elite"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Rate ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-bold outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Duration (Mo)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-bold outline-none"
                    value={formData.durationMonths}
                    onChange={(e) => setFormData({...formData, durationMonths: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Finalizing...' : 'Create Membership Tier'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
