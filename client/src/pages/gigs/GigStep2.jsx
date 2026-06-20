import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../api/axios';
import StepProgress from '../../components/gigs/StepProgress';
import PricingToggle from '../../components/gigs/PricingToggle';
import toast from 'react-hot-toast';

const GigStep2 = () => {
  const { gigId } = useParams();
  const [isSingle, setIsSingle] = useState(true);
  const [form, setForm] = useState({
    price: 5,
    deliveryDays: 1,
    revisions: 1,
    packageBasicName: 'Basic Pack',
    packageBasicPrice: 5,
    packageBasicDelivery: 1,
    packageBasicDesc: 'Standard basic setup and design layout.',
    packageStandardName: 'Standard Pack',
    packageStandardPrice: 15,
    packageStandardDelivery: 3,
    packageStandardDesc: 'Complete component integration with support.',
    packagePremiumName: 'Premium Pack',
    packagePremiumPrice: 30,
    packagePremiumDelivery: 5,
    packagePremiumDesc: 'Full stack configuration with high optimizations.',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await api.get(`/gigs/${gigId}`);
        if (data) {
          setForm({
            price: data.price || 5,
            deliveryDays: data.deliveryDays || 1,
            revisions: data.revisions || 1,
            packageBasicName: data.packageBasicName || 'Basic Pack',
            packageBasicPrice: data.packageBasicPrice || data.price || 5,
            packageBasicDelivery: data.packageBasicDelivery || data.deliveryDays || 1,
            packageBasicDesc: data.packageBasicDesc || 'Standard basic setup and design layout.',
            packageStandardName: data.packageStandardName || 'Standard Pack',
            packageStandardPrice: data.packageStandardPrice || (data.price || 5) * 2,
            packageStandardDelivery: data.packageStandardDelivery || (data.deliveryDays || 1) * 2,
            packageStandardDesc: data.packageStandardDesc || 'Complete component integration with support.',
            packagePremiumName: data.packagePremiumName || 'Premium Pack',
            packagePremiumPrice: data.packagePremiumPrice || (data.price || 5) * 3,
            packagePremiumDelivery: data.packagePremiumDelivery || (data.deliveryDays || 1) * 3,
            packagePremiumDesc: data.packagePremiumDesc || 'Full stack configuration with high optimizations.',
          });
        }
      } catch (error) {
        toast.error('Failed to load gig data');
      }
    };
    if (gigId) fetchGig();
  }, [gigId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Fallback data structuring to bypass schema strict constraints
    const payload = {
      ...form,
      packageBasicDesc: form.packageBasicDesc || 'Basic entry-level features pack.',
      packageStandardDesc: form.packageStandardDesc || 'Standard enhanced performance configuration setup.',
      packagePremiumDesc: form.packagePremiumDesc || 'Premium high tier custom adjustments plan.',
    };

    try {
      await api.put(`/gigs/${gigId}/step2`, payload);
      toast.success('Pricing saved');
      navigate(`/gigs/create/step3/${gigId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'number', placeholder = '' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[name] || ''}
        onChange={(e) => setForm({ ...form, [name]: type === 'number' ? Number(e.target.value) : e.target.value })}
        placeholder={placeholder}
        min={type === 'number' ? 1 : undefined}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none text-gray-800"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gig-dark">
      <div className="bg-gig-dark border-b border-white/10 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/gigs/my" className="flex items-center space-x-2 text-gray-400 hover:text-white">
            <FaArrowLeft size={16} />
            <span>Exit</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gig-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-white font-bold">GIGVERA</span>
          </div>
          <div></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <StepProgress currentStep={2} completedSteps={[1]} />

        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pricing & Packages</h2>
          <p className="text-gray-500 text-sm mb-6">Set your pricing structure</p>

          <PricingToggle isSingle={isSingle} onChange={setIsSingle} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSingle ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField label="Price ($)" name="price" />
                <InputField label="Delivery Days" name="deliveryDays" />
                <InputField label="Revisions" name="revisions" />
              </div>
            ) : (
              <div className="space-y-6">
                {['Basic', 'Standard', 'Premium'].map((tier) => (
                  <div key={tier} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">{tier} Package</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="Package Name" name={`package${tier}Name`} type="text" />
                      <InputField label="Price ($)" name={`package${tier}Price`} />
                      <InputField label="Delivery Days" name={`package${tier}Delivery`} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={form[`package${tier}Desc`] || ''}
                          onChange={(e) => setForm({ ...form, [`package${tier}Desc`]: e.target.value })}
                          placeholder="Package description"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Link to={`/gigs/create/step1`} className="text-gray-500 hover:text-gray-700 font-medium">
                Back
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-gig-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Next: Description'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GigStep2;