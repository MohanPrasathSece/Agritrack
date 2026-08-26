import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, X, ExternalLink } from 'lucide-react';
import { t } from '../utils/translation';

export default function ContactSupport({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('phone');

  const supportOptions = {
    phone: {
      title: t('call'),
      icon: Phone,
      items: [
        { label: t('supportPhone'), value: '9025421149', type: 'phone' },
        { label: t('emergencyHotline'), value: '9025421149', type: 'phone', emergency: true }
      ]
    },
    email: {
      title: t('email'),
      icon: Mail,
      items: [
        { label: 'General Support', value: 'support@agritrack.com', type: 'email' },
        { label: 'Technical Support', value: 'tech@agritrack.com', type: 'email' },
        { label: 'Billing Support', value: 'billing@agritrack.com', type: 'email' }
      ]
    },
    chat: {
      title: 'Live Chat',
      icon: MessageCircle,
      items: [
        { label: 'Start Chat', value: 'https://wa.me/180027448357', type: 'chat' },
        { label: 'WhatsApp Business', value: 'https://wa.me/180027448357', type: 'chat' }
      ]
    }
  };

  const handleAction = (item) => {
    switch (item.type) {
      case 'phone':
        window.open(`tel:${item.value}`, '_self');
        break;
      case 'email':
        window.open(`mailto:${item.value}`, '_self');
        break;
      case 'chat':
        window.open(item.value, '_blank');
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{t('contactSupport')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {Object.entries(supportOptions).map(([key, option]) => {
            const Icon = option.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.title}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {supportOptions[activeTab].items.map((item, index) => {
            const Icon = supportOptions[activeTab].icon;
            return (
              <div
                key={index}
                onClick={() => handleAction(item)}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                  item.emergency 
                    ? 'border-red-200 bg-red-50 hover:bg-red-100' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.emergency 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-medium ${
                      item.emergency ? 'text-red-700' : 'text-slate-900'
                    }`}>
                      {item.label}
                    </p>
                    <p className={`text-sm ${
                      item.emergency ? 'text-red-600' : 'text-slate-500'
                    }`}>
                      {item.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.emergency && (
                    <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded">
                      Emergency
                    </span>
                  )}
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-600 text-center">
            {t('support')} hours: 24/7 • {t('emergencyHotline')}: Always Available
          </p>
        </div>
      </div>
    </div>
  );
}
