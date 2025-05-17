"use client"
import { useEffect, useState, useCallback } from "react"
import axios, {
    AxiosRequestConfig,
    AxiosError,
    AxiosResponse,
    AxiosHeaders,
} from "axios"

interface UseFetchProps<T> {
    url: string
    config?: AxiosRequestConfig
    headers?: Record<string, string>
    enabled?: boolean
}

function useFetch<T = unknown>({
    url,
    config = {},
    headers = {},
    enabled = true,
}: UseFetchProps<T>) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<AxiosError | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response: AxiosResponse<T> = await axios.get(url, {
                ...config,
                headers: {
                    ...config.headers,
                    ...headers,
                },
            })
            setData(response.data)
        } catch (err) {
            setError(err as AxiosError)
        } finally {
            setLoading(false)
        }
    }, [url, JSON.stringify(config), JSON.stringify(headers)])

    useEffect(() => {
        if (enabled) fetchData()
    }, [fetchData, enabled])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    }
}

export default useFetch
