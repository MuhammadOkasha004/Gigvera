import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const FaqManager = ({ faqs = [], onChange, maxFaqs = 10 }) => {
  const [error, setError] = useState('');

  const addFaq = () => {
    if (faqs.length >= maxFaqs) {
      setError(`Maximum ${maxFaqs} FAQs allowed`);
      return;
    }
    setError('');
    onChange([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index) => {
    onChange(faqs.filter((_, i) => i !== index));
    setError('');
  };

  const updateFaq = (index, field, value) => {
    const updated = faqs.map((faq, i) =>
      i === index ? { ...faq, [field]: value } : faq
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">FAQ #{i + 1}</span>
            <button type="button" onClick={() => removeFaq(i)} className="text-red-500 hover:text-red-700">
              <FaTrash size={14} />
            </button>
          </div>
          <input
            type="text"
            value={faq.question}
            onChange={(e) => updateFaq(i, 'question', e.target.value)}
            placeholder="Question"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none"
          />
          <textarea
            value={faq.answer}
            onChange={(e) => updateFaq(i, 'answer', e.target.value)}
            placeholder="Answer"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none resize-none"
          />
        </div>
      ))}

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button
        type="button"
        onClick={addFaq}
        className="flex items-center space-x-2 text-gig-teal hover:text-teal-600 text-sm font-medium"
      >
        <FaPlus size={14} />
        <span>Add FAQ</span>
      </button>
    </div>
  );
};

export default FaqManager;
