"use client"
import { useState, useEffect } from "react"
import { useDebouncedValue } from "@mantine/hooks"
import { TextInput, Text, Loader } from "@mantine/core"
import { Doctor } from "@/types/doctor"

type Props = {
    onResults: (results: Doctor[]) => void
    onLoading?: (loading: boolean) => void
    onError?: (error: string) => void
}

const SearchInput = ({ onResults, onLoading, onError }: Props) => {
    const [value, setValue] = useState("")
    const [debounced] = useDebouncedValue(value, 200)

    useEffect(() => {
        const fetchDoctors = async () => {
            if (debounced.trim() === "") {
                onResults([])
                return
            }

            onLoading?.(true)
            onError?.("")

            try {
                const response = await fetch(
                    `http://localhost:5000/api/v1/doctors?search=${encodeURIComponent(
                        debounced
                    )}`
                )
                if (!response.ok) throw new Error("Failed to fetch doctors")

                const data = await response.json()
                onResults(data)
            } catch (err: any) {
                onError?.(err.message)
            } finally {
                onLoading?.(false)
            }
        }

        fetchDoctors()
    }, [debounced])

    return (
        <>
            <TextInput
                placeholder='Search healthcare professionals by Name, Location or Speciality...'
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
            />
        </>
    )
}

export default SearchInput
