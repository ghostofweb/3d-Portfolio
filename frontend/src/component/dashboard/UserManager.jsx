import React from 'react';
import { Plus } from 'lucide-react';

const UserManager = ({ users }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-end mb-6">
            <button className="text-xs text-zinc-400 hover:text-white flex items-center gap-2 border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-colors">
                <Plus className="w-3 h-3" /> Invite Member
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
                <div key={u._id} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-xl flex items-center gap-4 hover:border-white/20 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-white ring-2 ring-black">
                        {u.username[0].toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-white">{u.name}</h4>
                        <p className="text-xs text-zinc-500 mb-1">@{u.username}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-zinc-300">
                            {u.position || 'Member'}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default UserManager;