import { useState, useEffect } from 'react';
import { AlertCircle, Check, X, Loader2, ChevronRight, Info, Award, Shield, Star, ShoppingBag } from 'lucide-react';

export default function App() {
  const [selectedConcerns, setSelectedConcerns] = useState({
    'Acne Fighting': false,
    'Acne Trigger': false,
    'Anti-Aging': false,
    'Brightening': false,
    'Dark Spots': false,
    'Drying': false,
    'Eczema': false,
    'Good For Oily Skin': false,
    'Hydrating': false,
    'Irritating': false,
    'Redness Reducing': false,
    'Reduces Irritation': false,
    'Reduces Large Pores': false,
    'Rosacea': false,
    'Scar Healing': false
  });

  const [recommendations, setRecommendations] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productsError, setProductsError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  const handleConcernToggle = (concern) => {
    setSelectedConcerns(prev => ({
      ...prev,
      [concern]: !prev[concern]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const features = Object.values(selectedConcerns).map(value => value ? 1 : 0);
      
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
      
      const data = await response.json();
      setRecommendations(data.ingredients);
      setActiveStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductRecommendations = async () => {
    if (!recommendations) return;
    
    setProductsLoading(true);
    setProductsError(null);
    
    try {
      // Filter for ingredients marked as 'Yes'
      const recommendedIngredients = Object.entries(recommendations)
        .filter(([_, value]) => value === 'Yes')
        .map(([key, _]) => key);
      
      const response = await fetch('http://localhost:5000/filter-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: recommendedIngredients }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get product recommendations');
      }
      
      const data = await response.json();
      setRecommendedProducts(data.products || []);
      setActiveStep(3);
    } catch (err) {
      setProductsError(err.message);
    } finally {
      setProductsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedConcerns(Object.keys(selectedConcerns).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {}));
    setRecommendations(null);
    setRecommendedProducts([]);
    setActiveStep(1);
  };

  // Group ingredients by recommendation status
  const groupedIngredients = recommendations ? {
    recommended: Object.entries(recommendations).filter(([_, value]) => value === 'Yes').map(([key]) => key),
    notRecommended: Object.entries(recommendations).filter(([_, value]) => value === 'No').map(([key]) => key)
  } : null;

  // Get count of selected concerns
  const selectedCount = Object.values(selectedConcerns).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Derma AI Formulator</h1>
              <p className="text-indigo-100 text-lg max-w-xl">Advanced algorithm for personalized skincare ingredient recommendations based on your unique skin profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <span className="font-semibold">1</span>
              </div>
              <div className={`w-16 h-1 ${activeStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <span className="font-semibold">2</span>
              </div>
              <div className={`w-16 h-1 ${activeStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <span className="font-semibold">3</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-center px-4">
              <p className={`text-sm font-medium ${activeStep === 1 ? 'text-indigo-600' : 'text-gray-500'}`}>Select Concerns</p>
            </div>
            <div className="text-center px-4">
              <p className={`text-sm font-medium ${activeStep === 2 ? 'text-indigo-600' : 'text-gray-500'}`}>View Ingredients</p>
            </div>
            <div className="text-center px-4">
              <p className={`text-sm font-medium ${activeStep === 3 ? 'text-indigo-600' : 'text-gray-500'}`}>Browse Products</p>
            </div>
          </div>
        </div>

        {/* Step 1: Concerns Selection */}
        {activeStep === 1 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Select Your Skin Concerns</h2>
              <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                {selectedCount} Selected 
                {selectedCount > 0 && <ChevronRight className="ml-1 w-4 h-4" />}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6 bg-blue-50 p-3 rounded-lg">
                <Info className="text-blue-500 w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-blue-700 text-sm">Select all skin concerns that apply to you. Our AI algorithm will analyze your unique combination to recommend the most suitable ingredients.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.keys(selectedConcerns).map((concern) => (
                  <div 
                    key={concern}
                    onClick={() => handleConcernToggle(concern)}
                    className={`p-4 border rounded-lg flex items-center gap-3 cursor-pointer transition-all ${
                      selectedConcerns[concern] 
                        ? 'bg-indigo-50 border-indigo-300 shadow-sm transform scale-102' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 flex-shrink-0 rounded-md flex items-center justify-center transition-all ${
                      selectedConcerns[concern] ? 'bg-indigo-600' : 'border-2 border-gray-300'
                    }`}>
                      {selectedConcerns[concern] && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`${selectedConcerns[concern] ? 'text-indigo-900 font-medium' : 'text-gray-700'}`}>{concern}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading || Object.values(selectedConcerns).every(v => !v)}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all ${
                    Object.values(selectedConcerns).some(v => v) 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Personalized Recommendations</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 w-full max-w-md">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800">Error</h3>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Recommendations */}
        {activeStep === 2 && recommendations && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="text-indigo-600 w-6 h-6 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Your Personalized Formula</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={resetForm}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 bg-white border border-indigo-200 rounded-lg px-3 py-1.5 shadow-sm hover:bg-indigo-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> 
                    <span>Start Over</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-6 bg-green-50 p-4 rounded-lg border border-green-100">
                  <Check className="text-green-600 w-5 h-5 mr-2 flex-shrink-0" />
                  <p className="text-green-800 text-sm">
                    <span className="font-semibold">Analysis Complete!</span> Based on your {selectedCount} selected skin concerns, our AI has identified the following ingredients for your ideal skincare formulation.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recommended Ingredients Column */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                      <div className="bg-emerald-100 p-1.5 rounded-full mr-2">
                        <Check className="w-5 h-5 text-emerald-600" />
                      </div>
                      Recommended Ingredients
                    </h3>
                    
                    {groupedIngredients.recommended.length > 0 ? (
                      <div className="space-y-2.5">
                        {groupedIngredients.recommended.map((ingredient, index) => (
                          <div 
                            key={ingredient} 
                            className="bg-white bg-opacity-80 backdrop-blur-sm border border-emerald-100 rounded-lg p-3 flex items-center gap-3 shadow-sm"
                          >
                            <div className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">{formatIngredientName(ingredient)}</span>
                              <p className="text-xs text-gray-500 mt-0.5">{getIngredientDescription(ingredient)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white bg-opacity-70 rounded-lg p-4 text-gray-500 italic">
                        No specifically recommended ingredients for your selected concerns.
                      </div>
                    )}
                  </div>

                  {/* Not Recommended Ingredients Column */}
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <div className="bg-gray-200 p-1.5 rounded-full mr-2">
                        <X className="w-5 h-5 text-gray-600" />
                      </div>
                      Not Recommended
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {groupedIngredients.notRecommended.slice(0, 8).map(ingredient => (
                        <div key={ingredient} className="bg-white bg-opacity-80 border border-gray-200 rounded-lg p-2.5 flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <span className="text-gray-700 text-sm">{formatIngredientName(ingredient)}</span>
                        </div>
                      ))}
                      
                      {groupedIngredients.notRecommended.length > 8 && (
                        <div className="bg-gray-100 bg-opacity-60 rounded-lg p-2.5 text-center text-sm text-gray-500">
                          + {groupedIngredients.notRecommended.length - 8} more ingredients
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Product Finder Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={getProductRecommendations}
                    disabled={productsLoading || groupedIngredients.recommended.length === 0}
                    className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all ${
                      !productsLoading && groupedIngredients.recommended.length > 0
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {productsLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Finding Products...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Find Matching Products</span>
                      </>
                    )}
                  </button>
                </div>
                
                {productsError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 mx-auto max-w-md">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800">Error</h3>
                      <p className="text-red-600 text-sm">{productsError}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Product Recommendations */}
        {activeStep === 3 && recommendedProducts && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="text-indigo-600 w-6 h-6 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Recommended Products</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveStep(2)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 bg-white border border-indigo-200 rounded-lg px-3 py-1.5 shadow-sm hover:bg-indigo-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 transform rotate-180" /> 
                    <span>Back to Ingredients</span>
                  </button>
                  <button 
                    onClick={resetForm}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 bg-white border border-indigo-200 rounded-lg px-3 py-1.5 shadow-sm hover:bg-indigo-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> 
                    <span>Start Over</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <Info className="text-indigo-600 w-5 h-5 mr-2 flex-shrink-0" />
                  <p className="text-indigo-800 text-sm">
                    <span className="font-semibold">Products Found!</span> We've identified {recommendedProducts.length} products containing your recommended ingredients that match your skin concerns.
                  </p>
                </div>

                {recommendedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedProducts.map((product, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        {/* Product Info */}
                        <div className="p-6">
                          <h3 className="font-semibold text-lg text-gray-800 mb-2">
                            {product.name || 'Unnamed Product'}
                          </h3>
                          <p className="text-gray-500 text-sm mb-4">
                            {product.brand || 'Premium Skincare Brand'}
                          </p>
                          
                          {/* Matching Ingredients */}
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Key Ingredients:</p>
                            <div className="flex flex-wrap gap-2">
                              {getProductIngredients(product, groupedIngredients.recommended).slice(0, 5).map(ing => (
                                <span 
                                  key={ing} 
                                  className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-100"
                                >
                                  {formatIngredientName(ing)}
                                </span>
                              ))}
                              {getProductIngredients(product, groupedIngredients.recommended).length > 5 && (
                                <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-full border border-gray-200">
                                  +{getProductIngredients(product, groupedIngredients.recommended).length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-10 text-center">
                    <div className="text-gray-400 mb-3">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <h3 className="text-gray-600 font-semibold text-lg">No Products Found</h3>
                    </div>
                    <p className="text-gray-500 mb-4">We couldn't find any products that match all your recommended ingredients.</p>
                    <button 
                      onClick={() => setActiveStep(2)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 mx-auto bg-white border border-indigo-200 rounded-lg px-4 py-2 shadow-sm hover:bg-indigo-50 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 transform rotate-180" /> 
                      <span>Modify Ingredients</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 Derma AI Formulator. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper function to format ingredient names for display
function formatIngredientName(name) {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to provide brief descriptions for ingredients
function getIngredientDescription(ingredient) {
  const descriptions = {
    'hyaluronic': 'Hydrating molecule that holds 1000x its weight in water',
    'niacinamide': 'Vitamin B3 that reduces pores and improves skin texture',
    'peptide': 'Amino acid chains that support collagen production',
    'vitamin_c': 'Potent antioxidant that brightens and protects skin',
    'ceramide': 'Lipids that strengthen the skin barrier and retain moisture',
    'retinol': 'Vitamin A derivative that accelerates cell turnover',
    'aha_bha': 'Exfoliating acids that remove dead skin cells',
    'antioxidant': 'Compounds that protect against environmental damage',
    'mineral_spf': 'Physical UV protection using minerals like zinc oxide',
    'growth_factor': 'Proteins that stimulate cell growth and repair',
    'probiotic': 'Beneficial bacteria that support skin microbiome',
    'hydrating': 'Ingredients that increase skin water content',
    'emollient': 'Softens and smooths skin by filling in gaps',
    'preservative': 'Prevents product contamination and extends shelf life',
    'texture_stabilizer': 'Maintains product consistency and feel',
    'fragrance': 'Adds scent to products but may cause irritation',
    'solvent': 'Dissolves other ingredients in the formulation',
    'ph_adjuster': 'Balances the acidity level of the product',
    'colorant': 'Adds color to the formulation',
    'skin_soothing': 'Calms irritation and reduces redness',
    '2_hexanediol': 'Moisturizer and preservative booster',
    'glyceryl_caprylate': 'Natural preservative with antimicrobial properties',
    'hydroxyacetophenone': 'Antioxidant and preservative enhancer',
    'titanium_dioxide': 'Mineral UV filter that reflects and scatters light'
  };

  return descriptions[ingredient] || 'Supporting ingredient for skin health';
}

// Helper function to calculate match percentage for a product
function getMatchPercentage(product, recommendedIngredients) {
  const productIngredients = Object.keys(product).filter(key => product[key] === 'Yes');
  const matches = productIngredients.filter(ingredient => recommendedIngredients.includes(ingredient));
  return Math.round((matches.length / recommendedIngredients.length) * 100);
}

// Helper function to calculate product's matching ingredients
function getProductIngredients(product, recommendedIngredients) {
  // Filter product keys that are in recommendedIngredients and marked as 1 or 'Yes'
  const productIngredients = Object.keys(product).filter(key => {
    return recommendedIngredients.includes(key) && (product[key] === 1 || product[key] === 'Yes');
  });
  return productIngredients;
}