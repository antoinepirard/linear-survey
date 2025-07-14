import { useEffect, useState } from 'react';

type NetworkQuality = 'fast' | 'medium' | 'slow';

interface NetworkConnection extends EventTarget {
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

declare global {
  interface Navigator {
    connection?: NetworkConnection;
  }
}

export function useNetworkQuality() {
  const [quality, setQuality] = useState<NetworkQuality>('medium');
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const connection = navigator.connection;
    
    if (!connection) {
      return;
    }

    const updateNetworkQuality = () => {
      const { effectiveType, downlink, saveData: dataSaver } = connection;
      
      setSaveData(dataSaver || false);
      
      if (dataSaver) {
        setQuality('slow');
        return;
      }
      
      if (effectiveType === '4g' && (downlink || 0) > 2) {
        setQuality('fast');
      } else if (effectiveType === '3g' || (effectiveType === '4g' && (downlink || 0) <= 2)) {
        setQuality('medium');
      } else {
        setQuality('slow');
      }
    };

    updateNetworkQuality();
    
    connection.addEventListener('change', updateNetworkQuality);
    
    return () => {
      connection.removeEventListener('change', updateNetworkQuality);
    };
  }, []);

  const isSlowConnection = quality === 'slow' || saveData;

  return { 
    quality, 
    saveData, 
    isSlowConnection,
    preferLowQuality: isSlowConnection
  };
}