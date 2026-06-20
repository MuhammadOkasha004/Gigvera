import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EarningsChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', earnings: 400 },
    { month: 'Feb', earnings: 800 },
    { month: 'Mar', earnings: 600 },
    { month: 'Apr', earnings: 1200 },
    { month: 'May', earnings: 900 },
    { month: 'Jun', earnings: 1500 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a232e',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value) => [`$${value}`, 'Earnings']}
          />
          <Bar dataKey="earnings" fill="#00b8a9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
