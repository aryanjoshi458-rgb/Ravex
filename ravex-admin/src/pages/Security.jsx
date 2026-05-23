import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Smartphone, Globe, Key, AlertTriangle } from 'lucide-react';

const Security = () => {
  const [tfaEnabled, setTfaEnabled] = useState(false);

  return (
    <div className="max-w-4xl space-y-10 font-gaming">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Security Settings</h1>
        <p className="text-gray-500 font-medium mt-1">Control your account security and authentication preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Password Section */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-tiffany/5 rounded-2xl text-tiffany">
              <Key size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
              <p className="text-xs text-gray-400 font-medium">Update your password regularly to stay safe.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-gray-400 ml-1">Current Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-12 text-sm outline-none focus:border-tiffany transition-all font-bold text-gray-700"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-gray-400 ml-1">New Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-12 text-sm outline-none focus:border-tiffany transition-all font-bold text-gray-700"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              </div>
            </div>
            <button className="w-full bg-tiffany text-white font-bold py-4 rounded-xl shadow-lg shadow-tiffany/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-2">
              Update Password
            </button>
          </div>
        </div>

        {/* 2FA Section */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Two-Factor Auth</h3>
                  <p className="text-xs text-gray-400 font-medium">Add an extra layer of security.</p>
                </div>
              </div>
              <button 
                onClick={() => setTfaEnabled(!tfaEnabled)}
                className={`w-12 h-6 rounded-full relative transition-all ${tfaEnabled ? 'bg-tiffany' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: tfaEnabled ? 26 : 4 }}
                  className="w-4 h-4 bg-white rounded-full absolute top-1"
                />
              </button>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              We will send a verification code to your registered mobile number whenever you sign in from a new device.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-2xl text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 text-red-500">Danger Zone</h3>
                <p className="text-xs text-gray-400 font-medium">Irreversible account actions.</p>
              </div>
            </div>
            <button className="w-full border-2 border-red-100 text-red-500 font-bold py-4 rounded-xl hover:bg-red-50 transition-all">
              Delete Admin Account
            </button>
          </div>
        </div>
      </div>

      {/* Login Sessions */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center gap-4">
          <Globe className="text-gray-400" />
          <h3 className="text-lg font-bold text-gray-800">Active Sessions</h3>
        </div>
        <div className="p-8 space-y-6">
          {[
            { device: 'Windows PC • Chrome', location: 'Raipur, India', status: 'Active Now', current: true },
            { device: 'iPhone 15 Pro • Safari', location: 'Delhi, India', status: '2 hours ago', current: false },
          ].map((session, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{session.device}</p>
                  <p className="text-xs text-gray-400 font-medium">{session.location} • {session.status}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-xs font-bold text-red-500 hover:underline">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Security;
