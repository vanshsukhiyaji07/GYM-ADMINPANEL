
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Trainer } from '../types';
import { Icons } from '../constants';

const Trainers: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', specialty: 'Bodybuilding' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    setLoading(true);
    const data = await api.trainers.getAll();
    setTrainers(data);
    setLoading(false);
  };

  const handleHire = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await api.trainers.create(formData);
    setIsModalOpen(false);
    setFormData({ name: '', specialty: 'Bodybuilding' });
    await loadTrainers();
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete trainer with ID:', id);
    console.log('Current trainers before deletion:', trainers);
    
    if (window.confirm('Terminate this coaching contract? This action is permanent.')) {
      try {
        console.log('Calling api.trainers.delete with ID:', id);
        await api.trainers.delete(id);
        console.log('API delete call completed, updating UI...');
        setTrainers(prev => {
          const updated = prev.filter(t => t.id !== id);
          console.log('Trainers after update:', updated);
          return updated;
        });
      } catch (error) {
        console.error('Failed to delete trainer:', error);
        alert('Failed to delete trainer. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Management</h2>
          <p className="text-sm text-slate-500 font-medium">Coordinate your professional training roster</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95"
        >
          <Icons.Plus /> Hire Staff
        </button>
      </div>

      {loading && trainers.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Database</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img src={trainer.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-inner bg-slate-100" alt={trainer.name} />
                  <div>
                    <h4 className="font-black text-slate-900 leading-tight">{trainer.name}</h4>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{trainer.specialty}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(trainer.id)}
                  className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Remove Trainer"
                >
                  <Icons.Trash />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Active Clients</p>
                  <p className="text-xl font-black text-slate-900">{trainer.assignedMembers}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Performance</p>
                  <p className="text-xl font-black text-green-600">{trainer.performance}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Client Load</span>
                  <span className="text-slate-900">{Math.round((trainer.assignedMembers / 25) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (trainer.assignedMembers / 25) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">New Staff Hire</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900"><Icons.Trash /></button>
            </div>
            <form onSubmit={handleHire} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 font-bold outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Specialty</label>
                <select
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 font-bold outline-none"
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                >
                  <option>Bodybuilding</option>
                  <option>Cardio & HIIT</option>
                  <option>Strength Training</option>
                  <option>Yoga & Pilates</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Syncing...' : 'Register Trainer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainers;
