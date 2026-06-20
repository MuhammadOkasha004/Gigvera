const StatCard = ({ icon: Icon, label, value, trend, color = 'gig-teal' }) => {
  const colors = {
    'gig-teal': 'border-l-gig-teal',
    'gig-yellow': 'border-l-gig-yellow',
    'gig-green': 'border-l-gig-green',
    'gig-red': 'border-l-gig-red',
    'purple': 'border-l-purple-500',
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${colors[color] || colors['gig-teal']}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-1 font-medium ${trend >= 0 ? 'text-gig-green' : 'text-gig-red'}`}>
              {trend >= 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-opacity-10 flex items-center justify-center`}
               style={{ backgroundColor: `${color === 'gig-teal' ? '#00b8a9' : color === 'gig-yellow' ? '#f59e0b' : color === 'gig-green' ? '#10b981' : color === 'gig-red' ? '#ef4444' : '#a855f7'}15` }}>
            <Icon size={22} style={{ color: color === 'gig-teal' ? '#00b8a9' : color === 'gig-yellow' ? '#f59e0b' : color === 'gig-green' ? '#10b981' : color === 'gig-red' ? '#ef4444' : '#a855f7' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
