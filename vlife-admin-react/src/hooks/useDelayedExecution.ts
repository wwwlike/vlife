import { useState, useEffect } from 'react';
/**
 * 防抖(目前一个页面只能支持一个)
 */
function useDelayedExecution() {
  const [isCallPending, setIsCallPending] = useState(false);
  let callTimer:any;

  function delayedExecution(callback: () => void, delay:number) {
    if (callTimer) {
      clearTimeout(callTimer);
    }

    setIsCallPending(true);

    callTimer = setTimeout(() => {
      callback();
      setIsCallPending(false);
    }, delay);
  }

  useEffect(() => {
    return () => {
      if (callTimer) {
        clearTimeout(callTimer);
      }
    };
  }, []);

  return [delayedExecution, isCallPending];
}

export default useDelayedExecution;