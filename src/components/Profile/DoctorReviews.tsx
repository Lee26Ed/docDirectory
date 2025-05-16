import React from "react"
import {
    Card,
    Avatar,
    Text,
    Group,
    Rating,
    Stack,
    Container,
} from "@mantine/core"

type Review = {
    reviewId: number
    rating: number
    comment: string
    status: string
    createdAt: string
    updatedAt: string
}

type UserReviewsListProps = {
    reviews: Review[]
}

const UserReviewsList: React.FC<UserReviewsListProps> = ({ reviews }) => {
    return (
        <Container>
            <Stack gap='md'>
                {reviews.length === 0 ? (
                    <Text c='dimmed' size='xl'>
                        No reviews yet.
                    </Text>
                ) : (
                    reviews.map((review) => (
                        <Card
                            key={review.reviewId}
                            shadow='sm'
                            padding='lg'
                            radius='md'
                            withBorder
                            miw={800}
                        >
                            <Group align='flex-start' gap='md'>
                                <Avatar radius='xl' size='lg' />

                                <Stack gap={4} style={{ flex: 1 }}>
                                    <Group justify='apart'>
                                        <Text fw={700}>Anonymous</Text>
                                        <Text size='xs' c='dimmed'>
                                            {new Date(
                                                review.createdAt
                                            ).toLocaleDateString()}
                                        </Text>
                                    </Group>

                                    <Rating
                                        value={review.rating}
                                        readOnly
                                        size='sm'
                                    />

                                    <Text
                                        size='sm'
                                        style={{ whiteSpace: "pre-line" }}
                                    >
                                        {review.comment}
                                    </Text>
                                </Stack>
                            </Group>
                        </Card>
                    ))
                )}
            </Stack>
        </Container>
    )
}

export default UserReviewsList
