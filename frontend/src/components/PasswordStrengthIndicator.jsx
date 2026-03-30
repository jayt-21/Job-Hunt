import React from 'react';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';

const PasswordStrengthIndicator = ({ password, strength, errors, warnings }) => {
  if (!password) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Strength Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-gray-700">Password Strength</label>
          <span className={`text-sm font-bold ${strength?.strengthColor?.replace('bg-', 'text-')}`}>
            {strength?.strength}
          </span>
        </div>
        
        <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${strength?.strengthColor || 'bg-gray-400'}`}
            style={{ width: `${strength?.strengthScore || 0}%` }}
          />
        </div>
      </div>

      {/* Errors */}
      {errors && errors.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
            <AlertCircle size={16} />
            Requirements Not Met
          </p>
          <ul className="space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-600 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Checks */}
      {strength && strength.strengthScore >= 60 && !errors?.length && (
        <div className="mb-3">
          <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
            <CheckCircle size={16} />
            Strong Password
          </p>
        </div>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-yellow-700 mb-2 flex items-center gap-2">
            <Zap size={16} />
            Tips
          </p>
          <ul className="space-y-1">
            {warnings.map((warning, idx) => (
              <li key={idx} className="text-sm text-yellow-600 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
