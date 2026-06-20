import { FaRocket, FaUsers, FaStar, FaShieldAlt, FaBolt, FaGlobe } from 'react-icons/fa';

const AuthLayout = ({ children, type }) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gig-dark relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-gig-dark via-gray-900 to-gig-dark"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gig-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gig-teal/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gig-teal rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
            <span className="text-white font-bold text-3xl tracking-tight">GIGVERA</span>
          </div>
          <p className="text-gig-teal text-lg font-medium">Where Skills Meet Opportunity</p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">
            {type === 'register'
              ? 'Start your journey with GIGVERA today'
              : 'Welcome back to GIGVERA'
            }
          </h2>

          <div className="space-y-4">
            {[
              { icon: FaUsers, text: 'Connect with thousands of professionals' },
              { icon: FaBolt, text: 'Get projects done quickly and efficiently' },
              { icon: FaShieldAlt, text: 'Secure payments and milestone tracking' },
              { icon: FaStar, text: 'Build your reputation with verified reviews' },
              { icon: FaRocket, text: 'Scale your business or find top talent' },
              { icon: FaGlobe, text: 'Work with people from around the world' },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gig-teal/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-gig-teal text-sm" />
                </div>
                <span className="text-gray-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} GIGVERA. All rights reserved.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
