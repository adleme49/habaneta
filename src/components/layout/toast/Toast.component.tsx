import React, { useEffect, useState } from 'react';

const Toast: React.FC<{
  showToast?: boolean;
  message?: string;
  duration?: number;
}> = ({ showToast = false, message = 'Default Message', duration = 2000 }) => {
  const [visible, setVisible] = useState(showToast);

  useEffect(() => {
    if (showToast) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [showToast, duration]);

  return visible ? (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow z-50">
      {message}
    </div>
  ) : null;
};

export default Toast;
