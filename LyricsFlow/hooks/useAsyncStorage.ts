import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          const parsedValue = JSON.parse(item);
          // Convert date strings back to Date objects
          if (Array.isArray(parsedValue)) {
            const processedValue = parsedValue.map(item => ({
              ...item,
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
              updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date()
            }));
            setStoredValue(processedValue);
          } else {
            setStoredValue(parsedValue);
          }
        }
      } catch (error) {
        console.error(`Error reading AsyncStorage key "${key}":`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting AsyncStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isLoading] as const;
}