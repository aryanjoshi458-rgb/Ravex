import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Mail, Shield, Save } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@ravex.com',
    role: 'Store Manager',
    bio: 'Managing the premium RAVEX tech inventory and operations.'
  });

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="max-w-4xl space-y-10 font-gaming">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">My Profile</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your personal information and preferences.</p>
        </div>
        <button className="bg-tiffany text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-tiffany/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Save size={20} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 text-center shadow-sm">
            <div className="relative inline-block group">
              <div className="w-32 h-32 rounded-full border-4 border-tiffany/10 overflow-hidden bg-gray-50 flex items-center justify-center">
                {image ? (
                  <img src={image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl font-bold text-tiffany font-brand">A</div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2.5 bg-tiffany text-white rounded-full cursor-pointer shadow-lg hover:scale-110 active:scale-90 transition-all border-4 border-white">
                <Camera size={16} />
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800">{profile.name}</h3>
              <p className="text-sm text-tiffany font-bold tracking-wider mt-1">{profile.role}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
            <h4 className="text-xs font-black tracking-widest text-gray-400 mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400">Products Managed</span>
                <span className="text-gray-800">124</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400">Total Orders</span>
                <span className="text-gray-800">1,205</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-gray-400 ml-1">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-12 text-sm outline-none focus:border-tiffany transition-all font-bold text-gray-700"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-gray-400 ml-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-12 text-sm outline-none focus:border-tiffany transition-all font-bold text-gray-700"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">About Bio</label>
              <textarea 
                rows="4"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 text-sm outline-none focus:border-tiffany transition-all font-bold text-gray-700 resize-none"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center gap-4">
              <div className="p-3 bg-tiffany/5 rounded-xl text-tiffany">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Admin Permissions</p>
                <p className="text-xs text-gray-400 font-medium">Your account has full store management access.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
