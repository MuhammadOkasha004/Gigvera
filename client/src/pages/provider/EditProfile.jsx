import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaPlus, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { user, fetchMe } = useAuth();
  const [form, setForm] = useState({
    bio: '',
    skills: [],
    experience: [],
    hourlyRate: 0,
    city: '',
    country: '',
    website: '',
  });
  const [portfolio, setPortfolio] = useState([]);
  const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', projectUrl: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/provider/profile');
        setForm({
          bio: data.profile.bio || '',
          skills: data.profile.skills || [],
          experience: data.profile.experience || [],
          hourlyRate: data.profile.hourlyRate || 0,
          city: data.profile.city || '',
          country: data.profile.country || '',
          website: data.profile.website || '',
        });
        setPortfolio(data.portfolio || []);
        if (user?.profileImageUrl) {
          setProfileImagePreview(user.profileImageUrl);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (profileImage) {
        const formData = new FormData();
        formData.append('image', profileImage);
        await api.post('/provider/profile/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await fetchMe();
      }

      await api.put('/provider/profile', form);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== index) });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experience: [...form.experience, { company: '', role: '', from: '', to: '', description: '' }],
    });
  };

  const removeExperience = (index) => {
    setForm({ ...form, experience: form.experience.filter((_, i) => i !== index) });
  };

  const updateExperience = (index, field, value) => {
    const updated = form.experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setForm({ ...form, experience: updated });
  };

  const addPortfolioItem = async () => {
    if (!newPortfolio.title) {
      toast.error('Portfolio title is required');
      return;
    }
    try {
      const { data } = await api.post('/provider/portfolio', newPortfolio);
      setPortfolio([...portfolio, data]);
      setNewPortfolio({ title: '', description: '', projectUrl: '' });
      toast.success('Portfolio item added');
    } catch (error) {
      toast.error('Failed to add portfolio item');
    }
  };

  const deletePortfolioItem = async (id) => {
    try {
      await api.delete(`/provider/portfolio/${id}`);
      setPortfolio(portfolio.filter((p) => p._id !== id));
      toast.success('Portfolio item deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gig-light">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Edit Profile</h1>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Profile Image */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Image</h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-gig-teal bg-teal-50' : 'border-gray-300 hover:border-gig-teal'
              }`}
            >
              <input {...getInputProps()} />
              {profileImagePreview ? (
                <img src={profileImagePreview} alt="Profile" className="w-24 h-24 rounded-full mx-auto object-cover" />
              ) : (
                <div>
                  <FaCloudUploadAlt className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500 text-sm">Click or drag to upload</p>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">About</h2>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center space-x-1 bg-teal-50 text-gig-teal px-3 py-1 rounded-full text-sm">
                  <span>{skill}</span>
                  <button type="button" onClick={() => removeSkill(i)} className="hover:text-red-500">
                    <FaTrash size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none"
              />
              <button type="button" onClick={addSkill} className="px-4 py-2 bg-gig-teal text-white rounded-lg hover:bg-teal-600">
                <FaPlus size={14} />
              </button>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Experience</h2>
              <button type="button" onClick={addExperience} className="text-gig-teal text-sm font-medium hover:underline flex items-center space-x-1">
                <FaPlus size={12} />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-4">
              {form.experience.map((exp, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 relative">
                  <button type="button" onClick={() => removeExperience(i)} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                    <FaTrash size={12} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(i, 'company', e.target.value)}
                      placeholder="Company"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal outline-none"
                    />
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(i, 'role', e.target.value)}
                      placeholder="Role"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal outline-none"
                    />
                    <input
                      type="date"
                      value={exp.from ? new Date(exp.from).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateExperience(i, 'from', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal outline-none"
                    />
                    <input
                      type="date"
                      value={exp.to ? new Date(exp.to).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateExperience(i, 'to', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal outline-none"
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(i, 'description', e.target.value)}
                    placeholder="Description"
                    rows={2}
                    className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal outline-none"
                />
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Portfolio</h2>
            <div className="space-y-3 mb-4">
              {portfolio.map((item) => (
                <div key={item._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                    {item.description && <p className="text-gray-500 text-xs">{item.description}</p>}
                  </div>
                  <button type="button" onClick={() => deletePortfolioItem(item._id)} className="text-red-500 hover:text-red-700">
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={newPortfolio.title}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                  placeholder="Project title"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal outline-none"
                />
                <input
                  type="url"
                  value={newPortfolio.projectUrl}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, projectUrl: e.target.value })}
                  placeholder="Project URL"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal outline-none"
                />
              </div>
              <input
                type="text"
                value={newPortfolio.description}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                placeholder="Description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-gig-teal outline-none"
              />
              <button type="button" onClick={addPortfolioItem} className="text-gig-teal text-sm font-medium hover:underline flex items-center space-x-1">
                <FaPlus size={12} />
                <span>Add Portfolio Item</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gig-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
