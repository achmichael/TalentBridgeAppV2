import { useState, useEffect } from "react";

const useFetch = (url: string, options?: object) => {
    const [data, setData] = useState<unknown[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                if (!response.ok){
                    setLoading(false);
                    throw new Error(`${result.message}`);
                }
                setData(result.data);
                setLoading(false);

            }catch(error: unknown){
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { data, loading, error }; 
}

export default useFetch;