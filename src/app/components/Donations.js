"use client"
import React, { useState } from 'react';
import { 
  CurrencyDollarIcon, 
  GiftIcon, 
  ChartBarIcon, 
  HeartIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const CURRENCIES = {
  USD: { symbol: '$', rate: 1 },
  RWF: { symbol: 'RWF', rate: 1200 },
  XAF: { symbol: 'XAF', rate: 655 }
};

const PAYMENT_METHODS = {
  MOBILE_MONEY: 'Mobile Money',
  CARD: 'Credit/Debit Card'
};

const PaymentModal = ({ isOpen, onClose, amount, setAmount, selectedTier, project }) => {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.MOBILE_MONEY);
  const [currency, setCurrency] = useState('USD');
  const [isProcessing, setIsProcessing] = useState(false);

  const convertedAmount = (amount * CURRENCIES[currency].rate).toFixed(2);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Complete Your Donation</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {Object.keys(CURRENCIES).map((curr) => (
              <option key={curr} value={curr}>
                {curr} ({CURRENCIES[curr].symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="text-center mb-6">
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-2"
          />
          <span className="text-2xl font-bold">
            {CURRENCIES[currency].symbol}{convertedAmount}
          </span>
          {selectedTier && (
            <p className="text-sm text-gray-500">{selectedTier} Package</p>
          )}
          {project && (
            <p className="text-sm text-gray-500">{project.title}</p>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          {Object.values(PAYMENT_METHODS).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`flex-1 p-4 rounded-lg border ${
                paymentMethod === method
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {paymentMethod === PAYMENT_METHODS.MOBILE_MONEY ? (
          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <select className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <option>MTN Mobile Money</option>
              <option>Airtel Money</option>
              <option>Tigo Cash</option>
            </select>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <input
                type="text"
                placeholder="CVC"
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setIsProcessing(true);
            // Add payment processing logic here
            setTimeout(() => {
              setIsProcessing(false);
              onClose();
            }, 2000);
          }}
          disabled={isProcessing}
          className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg
            hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Complete Donation'}
        </button>
      </div>
    </div>
  );
};

const DonationTier = ({ amount, title, perks, onClick }) => (
  <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl border 
    border-emerald-100 dark:border-emerald-800 hover:shadow-xl transition-all">
    <h3 className="text-2xl font-bold text-emerald-600 mb-2">${amount}</h3>
    <h4 className="font-semibold mb-4">{title}</h4>
    <ul className="space-y-2 mb-6">
      {perks.map((perk, index) => (
        <li key={index} className="flex items-center gap-2">
          <HeartIcon className="w-5 h-5 text-emerald-500" />
          <span>{perk}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={onClick}
      className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg
        hover:bg-emerald-700 transition-colors"
    >
      Donate Now
    </button>
  </div>
);

const ProjectCard = ({ title, goal, raised, image, onClick }) => {
  const percentageRaised = Math.round((raised/goal)*100);
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl overflow-hidden
      border border-gray-100 dark:border-gray-700
      transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500
            hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">
              RWF {raised.toLocaleString()} raised
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {percentageRaised}%
            </span>
          </div>
          
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500
                shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              style={{ width: `${percentageRaised}%` }}
            />
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Goal: RWF {goal.toLocaleString()}
          </div>
        </div>

        <button 
          onClick={onClick}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 
            text-white py-2.5 px-4 rounded-lg transition-colors duration-300
            focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
          Support This Project
        </button>
      </div>
    </div>
  );
};

export default function Donations() {
  const [customAmount, setCustomAmount] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const tiers = [
    {
      amount: 25,
      title: "Seed Planter",
      perks: ["Plant 5 trees", "Monthly newsletter", "Impact report"]
    },
    {
      amount: 50,
      title: "Earth Guardian",
      perks: ["Plant 12 trees", "Quarterly gift", "Recognition on website"]
    },
    {
      amount: 100,
      title: "Climate Champion",
      perks: ["Plant 25 trees", "Exclusive events", "Personal impact dashboard"]
    }
  ];

  const projects = [
    {
      title: "Reforestation Project",
      goal: 500000,
      raised: 352000,
      image: "/project1.jpg"
    },
    {
      title: "Clean Water Initiative",
      goal: 300000,
      raised: 150000,
      image: "/project2.jpg"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 relative">
      <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r 
        from-emerald-600 to-green-500 bg-clip-text text-transparent">
        Support Our Mission
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {tiers.map((tier, index) => (
          <DonationTier 
            key={index} 
            {...tier} 
            onClick={() => {
              setSelectedAmount(tier.amount);
              setSelectedTier(tier.title);
              setIsPaymentModalOpen(true);
            }} 
          />
        ))}
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Custom Donation</h2>
        <div className="flex gap-4">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Enter amount"
            className="flex-1 p-3 rounded-lg border border-gray-200 
              dark:border-gray-700 bg-white/50 dark:bg-gray-900/50"
          />
          <button 
            onClick={() => {
              setSelectedAmount(Number(customAmount));
              setSelectedTier('Custom');
              setIsPaymentModalOpen(true);
            }}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg
              hover:bg-emerald-700 transition-colors"
          >
            Donate
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Current Campaigns</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <ProjectCard 
            key={index} 
            {...project} 
            onClick={() => {
              setSelectedProject(project);
              setSelectedAmount(project.raised);
              setSelectedTier(null);
              setIsPaymentModalOpen(true);
            }}
          />
        ))}
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={selectedAmount}
        setAmount={setSelectedAmount}
        selectedTier={selectedTier}
        project={selectedProject}
      />
    </div>
  );
}