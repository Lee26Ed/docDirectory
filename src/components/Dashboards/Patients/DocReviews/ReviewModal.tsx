"use client"
import { SubmitReview } from "@/app/api/actions/ReviewDoctors"
import { Button, Modal, Rating, Textarea } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { useSession } from "next-auth/react"
import React from "react"

interface ReviewModalProps {
    opened: boolean
    close: () => void
    doctorId: number
    appointmentId: number
    userId: number
    setReviewed?: (reviewed: boolean) => void
}

const ReviewModal = ({
    opened,
    close,
    doctorId,
    appointmentId,
    userId,
    setReviewed,
}: ReviewModalProps) => {
    const { data: session } = useSession()
    const form = useForm({
        initialValues: {
            rating: 0,
            review: "",
        },

        validate: {
            rating: (value) => (value === 0 ? "Rating is required" : null),
            review: (value) =>
                value.length < 10
                    ? "Review must be at least 10 characters"
                    : null,
        },
    })

    const handleSubmit = async (value: typeof form.values) => {
        const formData = {
            doctorId: doctorId,
            appointmentId: appointmentId,
            userId: userId,
            rating: value.rating,
            comment: value.review,
        }
        const reviewed = await SubmitReview(
            formData,
            session?.backendToken || ""
        )
        if (!reviewed) {
            notifications.show({
                title: "Error",
                message: "Failed to submit review",
                color: "red",
            })
            return
        }
        notifications.show({
            title: "Success",
            message: "Review submitted successfully",
            color: "green",
        })
        if (setReviewed) {
            setReviewed(true)
        }
        close()
    }

    return (
        <Modal opened={opened} onClose={close} title='Leave a Review'>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Rating {...form.getInputProps("rating")} />
                <Textarea
                    placeholder='Write your review here...'
                    {...form.getInputProps("review")}
                    mt={"md"}
                />
                <Button mt='md' type='submit'>
                    Submit Review
                </Button>
            </form>
        </Modal>
    )
}

export default ReviewModal
