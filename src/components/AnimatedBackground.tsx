import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-orange-800"></div>
      
      {/* Circuit Board Pattern */}
      <div className="absolute inset-0 opacity-20">
        {/* Horizontal Circuit Lines */}
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Vertical Circuit Lines */}
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-orange-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-0 left-3/4 w-0.5 h-full bg-gradient-to-b from-transparent via-orange-300 to-transparent animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Circuit Nodes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-orange-400' : 'bg-gray-400'} animate-ping`}
            style={{
              top: `${20 + (i * 7)}%`,
              left: `${15 + (i * 6)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '3s'
            }}
          ></div>
        ))}
        
        {/* Moving Signal Dots */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`signal-${i}`}
            className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-blue-300' : 'bg-orange-300'} animate-bounce`}
            style={{
              top: `${10 + (i * 10)}%`,
              left: `${5 + (i * 12)}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + (i % 3)}s`
            }}
          ></div>
        ))}
        
        {/* Circuit Connections */}
        <div className="absolute top-1/3 left-1/3 w-32 h-32 border-2 border-blue-400 rounded-lg rotate-45 animate-spin opacity-30" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border-2 border-orange-400 rounded-full animate-pulse opacity-40" style={{ animationDuration: '4s' }}></div>
        
        {/* Data Flow Lines */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={`flow-${i}`}
              className="absolute w-1 h-20 bg-gradient-to-b from-blue-400 to-transparent animate-pulse"
              style={{
                top: `${i * 15}%`,
                left: `${10 + (i * 15)}%`,
                animationDelay: `${i * 0.6}s`,
                transform: `rotate(${i * 30}deg)`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Floating Tech Elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={`tech-${i}`}
            className="absolute w-4 h-4 border border-white transform rotate-45 animate-bounce"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
    </div>
  );
};

export default AnimatedBackground;