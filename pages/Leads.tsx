
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Lead, LeadStatus } from '../types';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const data = await api.leads.getAll();
    setLeads(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    await api.leads.updateStatus(id, status);
    loadLeads();
  };

  const getStatusColor = (status: LeadStatus) => {
    switch(status) {
      case LeadStatus.NEW: return 'bg-blue-100 text-blue-700';
      case LeadStatus.FOLLOW_UP: return 'bg-purple-100 text-purple-700';
      case LeadStatus.JOINED: return 'bg-green-100 text-green-700';
      case LeadStatus.LOST: return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) return <div className="text-center p-20 text-slate-500">Managing leads...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full pb-10">
      {Object.values(LeadStatus).map((status) => (
        <div key={status} className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h5 className="font-bold text-slate-800 uppercase tracking-widest text-xs">{status.replace('_', ' ')}</h5>
            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {leads.filter(l => l.status === status).length}
            </span>
          </div>
          
          <div className="flex-1 bg-slate-100/50 p-3 rounded-2xl border border-dashed border-slate-300 min-h-[400px] space-y-4">
            {leads.filter(l => l.status === status).map(lead => (
              <div key={lead.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                <div className="flex justify-between items-start mb-3">
                  <h6 className="font-bold text-slate-900">{lead.name}</h6>
                  <button className="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                  </button>
                </div>
                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span>{lead.phone}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Latest Note</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{lead.notes[0] || 'No notes yet.'}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <select 
                    className={`w-full text-[10px] font-bold uppercase py-1.5 px-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 ${getStatusColor(status)}`}
                    value={status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                  >
                    {Object.values(LeadStatus).map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            {leads.filter(l => l.status === status).length === 0 && (
              <div className="text-center py-10">
                <p className="text-xs text-slate-400">Empty column</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leads;
