
import { User, UserRole, Member, MemberStatus, Lead, LeadStatus, Trainer, Plan } from '../types';

const DELAY = 400;

// Seed Data
const seedMembers: Member[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex@example.com', phone: '555-0101', status: MemberStatus.ACTIVE, renewalDate: '2025-12-15', planId: 'p1', lastAttendance: '2024-05-20' },
  { id: '2', name: 'Sarah Miller', email: 'sarah@example.com', phone: '555-0102', status: MemberStatus.ACTIVE, renewalDate: '2025-11-20', planId: 'p2', lastAttendance: '2024-05-21' },
];

const seedTrainers: Trainer[] = [
  { id: 't1', name: 'Chris Hemsworth', specialty: 'Bodybuilding', assignedMembers: 12, performance: 95, avatar: 'https://ui-avatars.com/api/?name=Chris+Hemsworth&background=3b82f6&color=fff' },
  { id: 't2', name: 'Scarlett Johansson', specialty: 'Cardio & HIIT', assignedMembers: 8, performance: 92, avatar: 'https://ui-avatars.com/api/?name=Scarlett+Johansson&background=3b82f6&color=fff' },
];

const seedPlans: Plan[] = [
  { id: 'p1', name: 'Basic Access', price: 29.99, durationMonths: 1 },
  { id: 'p2', name: 'Pro Monthly', price: 49.99, durationMonths: 1 },
  { id: 'p3', name: 'Elite Annual', price: 499.99, durationMonths: 12 },
];

// Robust Storage Sync
const sync = {
  get: <T>(key: string, initial: T[]): T[] => {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  set: <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  auth: {
    login: async (email: string, password: string) => {
      await sleep(DELAY);
      const role = email.startsWith('owner') ? UserRole.OWNER : email.startsWith('manager') ? UserRole.MANAGER : UserRole.STAFF;
      return {
        user: { id: 'u1', name: email.split('@')[0], email, role },
        accessToken: 'fake-jwt', refreshToken: 'fake-refresh'
      };
    }
  },
  members: {
    getAll: async () => { await sleep(DELAY); return sync.get('gym_members', seedMembers); },
    create: async (member: any) => {
      await sleep(DELAY);
      const items = sync.get<Member>('gym_members', seedMembers);
      const newItem = { ...member, id: Math.random().toString(36).substr(2, 9) };
      sync.set('gym_members', [newItem, ...items]);
      return newItem;
    },
    update: async (id: string, updates: any) => {
      await sleep(DELAY);
      const items = sync.get<Member>('gym_members', seedMembers);
      const idx = items.findIndex(i => i.id === id);
      if (idx > -1) {
        items[idx] = { ...items[idx], ...updates };
        sync.set('gym_members', items);
        return items[idx];
      }
      throw new Error('Not found');
    },
    delete: async (id: string) => {
      await sleep(DELAY);
      const items = sync.get<Member>('gym_members', seedMembers);
      sync.set('gym_members', items.filter(i => i.id !== id));
    }
  },
  trainers: {
    getAll: async () => { await sleep(DELAY); return sync.get('gym_trainers', seedTrainers); },
    create: async (trainer: any) => {
      await sleep(DELAY);
      const items = sync.get<Trainer>('gym_trainers', seedTrainers);
      const newItem = { 
        ...trainer, 
        id: `t-${Math.random().toString(36).substr(2, 5)}`,
        assignedMembers: 0,
        performance: 100,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer.name)}&background=3b82f6&color=fff`
      };
      sync.set('gym_trainers', [newItem, ...items]);
      return newItem;
    },
    delete: async (id: string) => {
      console.log('mockApi: Deleting trainer with ID:', id);
      await sleep(DELAY);
      const items = sync.get<Trainer>('gym_trainers', seedTrainers);
      console.log('mockApi: Current trainers before deletion:', items);
      const updatedItems = items.filter(i => i.id !== id);
      console.log('mockApi: Trainers after filtering:', updatedItems);
      sync.set('gym_trainers', updatedItems);
      console.log('mockApi: Updated localStorage with new trainers list');
      return true;
    }
  },
  plans: {
    getAll: async () => { await sleep(DELAY); return sync.get('gym_plans', seedPlans); },
    create: async (plan: any) => {
      await sleep(DELAY);
      const items = sync.get<Plan>('gym_plans', seedPlans);
      const newItem = { ...plan, id: `p-${Math.random().toString(36).substr(2, 5)}` };
      sync.set('gym_plans', [...items, newItem]);
      return newItem;
    },
    delete: async (id: string) => {
      await sleep(DELAY);
      const items = sync.get<Plan>('gym_plans', seedPlans);
      sync.set('gym_plans', items.filter(i => i.id !== id));
    }
  },
  leads: {
    getAll: async () => { await sleep(DELAY); return sync.get('gym_leads', []); },
    updateStatus: async (id: string, status: LeadStatus) => {
      await sleep(DELAY);
      const items = sync.get<Lead>('gym_leads', []);
      const idx = items.findIndex(i => i.id === id);
      if (idx > -1) {
        items[idx].status = status;
        sync.set('gym_leads', items);
      }
    }
  }
};
