"use client";

import Link from "next/link";
import { Heart, BarChart3, Calculator, TrendingUp, Users, Shield, ChevronRight, Activity, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-8 py-24">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-gray-200">
              <Heart className="h-10 w-10 text-red-500" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CardioAnalytics
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Cardiovascular risk analysis and statistical insights dashboard
            </p>
            
            <p className="text-gray-600 max-w-4xl mx-auto">
              Explore comprehensive hypothesis testing, predictive modeling, and personalized risk assessment tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link 
                href="/risk-score"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Calculator className="h-5 w-5" />
                Calculate Risk Score
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/hypothesis1"
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 font-semibold px-8 py-4 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
              >
                <BarChart3 className="h-5 w-5" />
                Explore Research
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Cardiovascular Analysis
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our platform combines statistical rigor with clinical insights to provide actionable cardiovascular health assessments
          </p>
        </div>

        {/* Statistics Card */}
        <div className="flex justify-center">
          <div className="w-1/3 mb-17 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-lg text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Data Insights</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Sample Size:</span>
                <span className="font-bold">68,668 patients</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Statistical Tests:</span>
                <span className="font-bold">2 Hypotheses</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Models:</span>
                <span className="font-bold">Logistic Regression</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          

          {/* Risk Calculator Card */}
          <Link href="/risk-score" className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Risk Calculator</h3>
              <p className="text-gray-600 mb-4">
                Calculate personalized cardiovascular risk scores based on age, blood pressure, and cholesterol levels.
              </p>
              <div className="flex items-center text-red-600 font-medium group-hover:gap-3 transition-all">
                <span>Calculate Now</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Hypothesis 1 Card */}
          <Link href="/hypothesis1" className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gender & Cardiovascular Disease</h3>
              <p className="text-gray-600 mb-4">
                Statistical analysis examining the relationship between Systolic BP and cardiovascular disease prevalence using Welch’s t-test.
              </p>
              <div className="flex items-center text-emerald-600 font-medium group-hover:gap-3 transition-all">
                <span>View Analysis</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Hypothesis 2 Card */}
          <Link href="/hypothesis2" className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Understanding CVD</h3>
              <p className="text-gray-600 mb-4">
                Correlation analysis investigating the relationship between clinical variables and Cardiovascular Disease.
              </p>
              <div className="flex items-center text-amber-600 font-medium group-hover:gap-3 transition-all">
                <span>View Results</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Hypothesis 3 Card */}
          {/* <Link href="/hypothesis3" className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multivariate Regression</h3>
              <p className="text-gray-600 mb-4">
                Advanced linear regression analysis predicting systolic blood pressure using multiple cardiovascular risk factors.
              </p>
              <div className="flex items-center text-purple-600 font-medium group-hover:gap-3 transition-all">
                <span>Explore Model</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link> */}

          
          
        </div>
      </div>

      

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-white">CardioAnalytics</span>
          </div>
          <p className="text-gray-400 mb-4">
            Cardiovascular risk analysis and insights dashboard
          </p>
        </div>
      </div>
    </div>
  );
}