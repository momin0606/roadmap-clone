import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb: any) => {
  const [data, setData] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<any>(null);

  const fn = async (...args: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      console.log({ response });
      setData(response);
      setError(null);
    } catch (error: any) {
      console.log({ error });
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
