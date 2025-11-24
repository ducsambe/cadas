import React from 'react';
import { Building, ArrowRight, Users, Award, Star } from 'lucide-react';
import { Division } from '../types';
import AnimatedBackground from './AnimatedBackground';
import LanguageSwitcher from './LanguageSwitcher';

interface DivisionSelectorProps {
  divisions: Division[];
  onSelect: (division: Division) => void;
  t: (key: string) => string;
  language: string;
}

const DivisionSelector: React.FC<DivisionSelectorProps> = ({ 
  divisions, 
  onSelect, 
  t,
  language 
}) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <img
                src="/logo.png"
                alt="GeoCasa Group Logo"
                className="w-24 h-24"
              />
              <div className="absolute inset-0 rounded-3xl border-2 border-blue-400 animate-ping opacity-30"></div>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              GeoCasa Group
            </span>
          </h1>
          <p className="text-blue-100 text-2xl mb-4 font-light">
            {language === 'en' ? 'Select Division' : 'Sélectionner une Division'}
          </p>
          <p className="text-blue-200 text-xl">
            {language === 'en' ? 'Choose your work division' : 'Choisissez votre division de travail'}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full mx-auto mt-6"></div>
        </div>

        {/* Division Cards */}
        <div className="space-y-12">
          {divisions.map((division, index) => (
            <div
              key={division.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-fadeIn ${
                index % 2 === 0 ? '' : 'lg:grid-flow-col-dense'
              }`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {/* Division Image */}
              <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-[3rem] transform rotate-2 scale-105"></div>
                  <div className="relative bg-white/10 backdrop-blur-2xl rounded-[3rem] p-6 border border-white/30 shadow-2xl">
                    <img
                      src={division.image}
                      alt={language === 'en' ? division.nameEn : division.nameFr}
                      className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    />
                    
                    {/* Stats Overlay */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                            <div className="text-lg font-bold text-gray-900">25+</div>
                            <div className="text-xs text-gray-600">
                              {language === 'en' ? 'Staff' : 'Personnel'}
                            </div>
                          </div>
                          <div>
                            <Award className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                            <div className="text-lg font-bold text-gray-900">10+</div>
                            <div className="text-xs text-gray-600">
                              {language === 'en' ? 'Years' : 'Années'}
                            </div>
                          </div>
                          <div>
                            <Star className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
                            <div className="text-lg font-bold text-gray-900">95%</div>
                            <div className="text-xs text-gray-600">
                              {language === 'en' ? 'Efficiency' : 'Efficacité'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Division Information */}
              <div className={`text-white space-y-6 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div>
                  <div className={`w-12 h-12 ${division.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                      {language === 'en' ? division.nameEn : division.nameFr}
                    </span>
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full mb-6"></div>
                  <p className="text-xl text-blue-100 leading-relaxed">
                    {language === 'en' ? division.descriptionEn : division.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <button
                    onClick={() => onSelect(division)}
                    className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center space-x-3 group shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <span className="text-lg">
                      {language === 'en' ? 'Select Division' : 'Sélectionner Division'}
                    </span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Information */}
        <div className="text-center mt-16 text-blue-100 text-sm space-y-3">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">
                {language === 'en' ? 'Integrated Management' : 'Gestion Intégrée'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="font-medium">
                {language === 'en' ? 'Professional Excellence' : 'Excellence Professionnelle'}
              </span>
            </div>
          </div>
          <p className="font-medium">
            {language === 'en' ? 'Yaoundé, Cameroon' : 'Yaoundé, Cameroun'}
          </p>
          <p>+237 6XX XX • contact@geocasagroup.com</p>
        </div>
      </div>
    </div>
  );
};

export default DivisionSelector;