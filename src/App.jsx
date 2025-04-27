import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, Info, Droplet, Sun } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState('');
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [skinHistoryAnswers, setSkinHistoryAnswers] = useState({});
  const [ingredients, setIngredients] = useState([]);

  const skinConcerns = [
    { id: 'anti-aging', label: 'Anti-Aging', icon: 'CheckCircle' },
    { id: 'brightening', label: 'Brightening', icon: 'CheckCircle' },
    { id: 'dark-spots', label: 'Dark Spots', icon: 'CheckCircle' },
    { id: 'drying', label: 'Drying', icon: 'CheckCircle' },
    { id: 'good-for-oily-skin', label: 'Good For Oily Skin', icon: 'CheckCircle' },
    { id: 'hydrating', label: 'Hydrating', icon: 'CheckCircle' },
    { id: 'may-worsen-oily-skin', label: 'May Worsen Oily Skin', icon: 'CheckCircle' },
    { id: 'redness-reducing', label: 'Redness Reducing', icon: 'CheckCircle' },
    { id: 'reduces-irritation', label: 'Reduces Irritation', icon: 'CheckCircle' },
    { id: 'reduces-large-pores', label: 'Reduces Large Pores', icon: 'CheckCircle' },
    { id: 'scar-healing', label: 'Scar Healing', icon: 'CheckCircle' },
    { id: 'skin-texture', label: 'Skin Texture', icon: 'CheckCircle' },
  ];

  const skinHistory = [
    { id: 'acne', label: 'Acne or acne-triggered breakouts' },
    { id: 'dryness', label: 'Persistent dryness' },
    { id: 'irritation', label: 'Irritation or sensitivity' },
    { id: 'oiliness', label: 'Excess oiliness' },
    { id: 'eczema', label: 'Eczema flare-ups' },
    { id: 'rosacea', label: 'Rosacea symptoms' },
  ];

  const toggleConcern = (id) => {
    setSelectedConcerns(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handlePredict = async () => {
    const allowedConcerns = new Set([
      'anti-aging',
      'brightening',
      'dark-spots',
      'drying',
      'good-for-oily-skin',
      'hydrating',
      'may-worsen-oily-skin',
      'redness-reducing',
      'reduces-irritation',
      'reduces-large-pores',
      'scar-healing',
      'skin-texture'
    ]);
    const filteredConcerns = selectedConcerns.filter(id => allowedConcerns.has(id));
    const payload = {
      after_use: filteredConcerns,
      product_type: "serum"
    };
  
    try {
      const response = await fetch("https://skincareprod.pythonanywhere.com//predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      setIngredients(result.ingredients);
    } catch (error) {
      console.error("Error calling prediction API:", error);
      alert("Prediction failed.");
    }
  };

  const getStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Select Your Skin Type</h2>
            <div className="flex justify-center gap-4">
              <button
                className={`flex-1 p-6 rounded-xl border-2 ${skinType === 'oily' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setSkinType('oily')}
              >
                <Droplet size={48} className="mb-2 text-blue-400" />
                <h3 className="text-lg font-medium">Oily Skin</h3>
                <p className="text-sm text-gray-500">Shiny, excess sebum</p>
              </button>
              <button
                className={`flex-1 p-6 rounded-xl border-2 ${skinType === 'dry' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setSkinType('dry')}
              >
                <Sun size={48} className="mb-2 text-yellow-400" />
                <h3 className="text-lg font-medium">Dry Skin</h3>
                <p className="text-sm text-gray-500">Flaky, tight feeling</p>
              </button>
            </div>

            <div className="flex justify-center">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-full flex items-center gap-2 disabled:bg-gray-300"
                onClick={nextStep}
                disabled={!skinType}
              >
                Next Step <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Select Your Skin Concerns</h2>
            <p className="text-center text-gray-500">Choose all that apply:</p>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Goals & Concerns</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skinConcerns.map(concern => (
                  <button
                    key={concern.id}
                    className={`p-3 rounded-lg border flex items-center gap-2 ${
                      selectedConcerns.includes(concern.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => toggleConcern(concern.id)}
                  >
                    <CheckCircle 
                      size={18} 
                      className={selectedConcerns.includes(concern.id) ? 'text-blue-500' : 'text-gray-400'} 
                    />
                    <span>{concern.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                className="px-6 py-2 border border-gray-300 rounded-full flex items-center gap-2"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-full flex items-center gap-2 disabled:bg-gray-300"
                onClick={nextStep}
                disabled={selectedConcerns.length === 0}
              >
                Next Step <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Skin History & Preferences</h2>
            <p className="text-center text-gray-500">This helps us tailor recommendations.</p>
            <p className="font-medium text-lg">
              Have you ever experienced any of the following skin concerns?
            </p>
            {skinHistory.map(item => (
              <div key={item.id} className="space-y-2">
                <p className="font-medium text-lg">{item.label}?</p>
                <div className="flex gap-4 justify-center">
                  <button
                    className={`flex-1 p-4 rounded-xl border-2 ${skinHistoryAnswers[item.id] === true ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setSkinHistoryAnswers(prev => ({...prev, [item.id]: true}))}
                  >
                    Yes
                  </button>
                  <button
                    className={`flex-1 p-4 rounded-xl border-2 ${skinHistoryAnswers[item.id] === false ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setSkinHistoryAnswers(prev => ({...prev, [item.id]: false}))}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between">
              <button
                className="px-6 py-2 border border-gray-300 rounded-full flex items-center gap-2"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-full flex items-center gap-2 disabled:bg-gray-300"
                onClick={nextStep}
              >
                Next Step <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Your Personalized Ingredients</h2>
            {ingredients.length > 0 ? (
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="text-center mb-6">
                  <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
                    <CheckCircle className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-xl font-medium">Recommendation Ready!</h3>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium">Recommended Ingredients</h4>
                  <ul className="mt-2 space-y-2">
                    {ingredients.map(ing => (
                      <li key={ing} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between">
                  <button
                    className="px-6 py-2 border border-gray-300 rounded-full flex items-center gap-2"
                    onClick={() => window.location.reload()}
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-6 bg-blue-50 rounded-xl">
                  <div className="text-center mb-6">
                    <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
                      <CheckCircle className="text-blue-600" size={28} />
                    </div>
                    <h3 className="text-xl font-medium">Recommendation Ready!</h3>
                    <p className="text-gray-500">Based on your {skinType} skin type and selected concerns</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    className="px-6 py-2 border border-gray-300 rounded-full flex items-center gap-2"
                    onClick={() => window.location.reload()}
                  >
                    Back
                  </button>
                  <button
                    className="px-6 py-2 bg-green-600 text-white rounded-full flex items-center gap-2 disabled:bg-gray-300"
                    onClick={handlePredict}
                  >
                    Show me Recommendations
                  </button>
                </div>
              </>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold text-center">SkinCare Ingredient Finder</h1>
          <p className="text-center text-blue-100 mt-1">Find ingredients that work for your unique skin</p>
          
          <div className="flex justify-between items-center mt-6">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
                }`}>
                  {step > stepNumber ? <CheckCircle size={18} /> : stepNumber}
                </div>
                <span className="text-xs mt-1">
                  {stepNumber === 1 && "Skin Type"}
                  {stepNumber === 2 && "Concerns"}
                  {stepNumber === 3 && "History"}
                  {stepNumber === 4 && "Results"}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {getStepContent()}
        </div>
      </div>
    </div>
  );
}