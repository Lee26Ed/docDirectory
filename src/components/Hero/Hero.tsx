import { Flex, Stack, Text, Title } from "@mantine/core"
import Image from "next/image"
import React from "react"
import classes from "./Hero.module.css"
import SearchInput from "./SearchInput"
import { Doctor } from "@/types/doctor"

type Props = {
    onResults: (results: Doctor[]) => void
    onLoading?: (loading: boolean) => void
    onError?: (error: string) => void
}

function Hero({ onResults, onLoading, onError }: Props) {
    return (
        <Flex justify='center' align='center' gap='xl'>
            <Image src='/hero.png' alt='hero' width={300} height={300} />
            <Stack>
                <Title className={classes.title} ta='center' mt={100}>
                    Welcome to{" "}
                    <Text
                        inherit
                        variant='gradient'
                        component='span'
                        gradient={{ from: "blue", to: "cyan" }}
                    >
                        MediApp
                    </Text>
                </Title>
                <Text>
                    Quickly search and book top-rated healthcare professionals.
                </Text>
                <SearchInput
                    onResults={onResults}
                    onLoading={onLoading}
                    onError={onError}
                />
            </Stack>
        </Flex>
    )
}

export default Hero
