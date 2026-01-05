import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto close after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-400',
          icon: <CheckCircle2 className="w-6 h-6 text-black" />,
          title: 'BERHASIL'
        };
      case 'error':
        return {
          bg: 'bg-red-400',
          icon: <XCircle className="w-6 h-6 text-black" />,
          title: 'GAGAL'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-400',
          icon: <AlertCircle className="w-6 h-6 text-black" />,
          title: 'PERHATIAN'
        };
      default:
        return {
          bg: 'bg-blue-400',
          icon: <Info className="w-6 h-6 text-black" />,
          title: 'INFO'
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed top-20 right-4 z-[100] animate-in slide-in-from-right duration-300">
      <div 
        className={`${style.bg} border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3 min-w-[300px] max-w-sm relative`}
      >
        <div className="shrink-0 pt-0.5">
          {style.icon}
        </div>
        <div className="flex-1 mr-4">
          <h4 className="font-black text-sm uppercase mb-1">{style.title}</h4>
          <p className="text-sm font-bold opacity-90 leading-tight">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;