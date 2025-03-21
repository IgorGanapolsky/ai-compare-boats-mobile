// This adds global error handling types for React Native
interface Global {
  ErrorUtils?: {
    getGlobalHandler: () => (error: Error, isFatal?: boolean) => void;
    setGlobalHandler: (callback: (error: Error, isFatal?: boolean) => void) => void;
  };
  
  EventEmitter?: {
    prototype: {
      addListener: (
        eventType: string,
        listener: (...args: any[]) => void,
        context?: any
      ) => { remove: () => void };
    };
  };
}
