import { ArrowLeftIcon, CameraIcon, CheckIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

function MyAccountSettings() {
  const navigate = useNavigate();
  const { authUser, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    fullName: authUser.fullName,
    email: authUser.email,
    bio: authUser.bio || "",
    username: authUser.username || authUser.email.split('@')[0],
  });
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
        toast.success("Profile picture updated!");
      } catch (error) {
        toast.error("Failed to update profile picture");
      }
    };
  };

  const handleSave = async (field) => {
    try {
      await updateProfile({ [field]: formData[field] });
      toast.success(`${field === 'fullName' ? 'Name' : field.charAt(0).toUpperCase() + field.slice(1)} updated!`);
      setIsEditing(null);
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleCancel = (field) => {
    setFormData({
      ...formData,
      [field]: authUser[field] || (field === 'username' ? authUser.email.split('@')[0] : ""),
    });
    setIsEditing(null);
  };

  return (
    <div className="h-screen bg-[#ECE5DD] flex flex-col">
      {/* Header */}
      <div className="bg-[#F0F2F5] border-b border-gray-200 p-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/settings")}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">My Account</h1>
      </div>

      {/* Profile Photo Section */}
      <div className="bg-slate-800/30 border-b border-slate-700/50 p-6 flex flex-col items-center">
        <div className="relative group">
          <img
            src={selectedImg || authUser.profilePic || "/avatar.png"}
            alt={authUser.fullName}
            className="w-32 h-32 rounded-full object-cover"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full"
          >
            <CameraIcon className="w-8 h-8 text-white" />
          </button>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
        <p className="text-slate-400 text-sm mt-3">Click to change photo</p>
      </div>

      {/* Account Info */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Full Name */}
        <div className="p-4 border-b border-slate-700/30">
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-400 text-xs uppercase">Name</label>
            {isEditing === "fullName" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave("fullName")}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleCancel("fullName")}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing("fullName")}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Edit
              </button>
            )}
          </div>
          {isEditing === "fullName" ? (
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              autoFocus
            />
          ) : (
            <p className="text-slate-200">{authUser.fullName}</p>
          )}
        </div>

        {/* Username */}
        <div className="p-4 border-b border-slate-700/30">
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-400 text-xs uppercase">Username</label>
            {isEditing === "username" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave("username")}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleCancel("username")}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing("username")}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Edit
              </button>
            )}
          </div>
          {isEditing === "username" ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">@</span>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="username"
                autoFocus
              />
            </div>
          ) : (
            <p className="text-slate-200">@{authUser.username || authUser.email.split('@')[0]}</p>
          )}
          <p className="text-slate-400 text-xs mt-1">
            You can choose a username. If you do, people will be able to find you by this username.
          </p>
        </div>

        {/* Bio */}
        <div className="p-4 border-b border-slate-700/30">
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-400 text-xs uppercase">Bio</label>
            {isEditing === "bio" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave("bio")}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleCancel("bio")}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing("bio")}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Edit
              </button>
            )}
          </div>
          {isEditing === "bio" ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              rows="3"
              placeholder="Add a few words about yourself"
              maxLength={70}
              autoFocus
            />
          ) : (
            <p className="text-slate-200">{authUser.bio || "Add a few words about yourself"}</p>
          )}
          <p className="text-slate-400 text-xs mt-1">
            Any details such as age, occupation or city.
          </p>
        </div>

        {/* Email (Read-only) */}
        <div className="p-4 border-b border-slate-700/30">
          <label className="text-slate-400 text-xs uppercase block mb-2">Email</label>
          <p className="text-slate-200">{authUser.email}</p>
          <p className="text-slate-400 text-xs mt-1">
            Email cannot be changed
          </p>
        </div>
      </div>
    </div>
  );
}

export default MyAccountSettings;
