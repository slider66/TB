import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const PasswordStrength = ({ validation }) => {
  const { length, uppercase, lowercase, specialChar, number } = validation;
  const strength = [length, uppercase, lowercase, specialChar, number].filter(Boolean).length;

  const strengthColors = [
    'bg-neutral-200', // 0
    'bg-red-500',      // 1
    'bg-orange-500',   // 2
    'bg-yellow-500',   // 3
    'bg-blue-500',     // 4
    'bg-green-500',    // 5
  ];

  const strengthLabels = ['Débil', 'Débil', 'Regular', 'Media', 'Fuerte', 'Excelente'];

  const requirements = [
    { key: 'length', label: 'Al menos 10 caracteres', valid: length },
    { key: 'uppercase', label: 'Una letra mayúscula', valid: uppercase },
    { key: 'lowercase', label: 'Una letra minúscula', valid: lowercase },
    { key: 'number', label: 'Un número', valid: number },
    { key: 'specialChar', label: 'Un carácter especial', valid: specialChar },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
    >
      <div className="flex items-center gap-2">
        <div className="w-full bg-neutral-200 rounded-full h-2.5">
          <motion.div
            className={cn("h-2.5 rounded-full transition-all duration-300", strengthColors[strength])}
            initial={{ width: '0%' }}
            animate={{ width: `${strength * 20}%` }}
          />
        </div>
        <span className="text-sm font-medium text-neutral-600 w-24 text-right">{strengthLabels[strength]}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center text-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={req.valid ? 'check' : 'x'}
            >
              {req.valid ? (
                <Check className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <X className="h-4 w-4 text-red-500 mr-2" />
              )}
            </motion.div>
            <span className={cn('transition-colors', req.valid ? 'text-neutral-700' : 'text-neutral-500')}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PasswordStrength;