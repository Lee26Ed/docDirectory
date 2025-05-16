import classes from "@/components/Carousels/comments.module.css"
import { Center, Stack, Title } from "@mantine/core"

function Comments() {
    const comments = [
        {
            id: 1,
            name: "John D.",
            text: "This platform made finding the right doctor so easy. Highly recommended!",
        },
        {
            id: 2,
            name: "Sarah T.",
            text: "I booked an appointment within minutes. Excellent user experience!",
        },
        {
            id: 3,
            name: "Michael J.",
            text: "Great service! It helped me find a specialist in my area quickly.",
        },
        {
            id: 4,
            name: "Emily R.",
            text: "I was able to compare reviews and choose the best doctor for my needs.",
        },
        {
            id: 5,
            name: "Carlos M.",
            text: "The appointment reminders were super helpful. No more missed visits!",
        },
        {
            id: 6,
            name: "Priya S.",
            text: "Fast, easy, and reliable. I’m telling all my friends about this app.",
        },
    ]

    return (
        <Stack>
            <Center>
                <Title order={2}>What our users say</Title>
            </Center>
            <div
                className={classes.slider}
                style={
                    {
                        // @ts-ignore
                        "--width": "200px",
                        "--height": "200px",
                        "--quantity": comments.length,
                    } as React.CSSProperties
                }
            >
                <div className={classes.list}>
                    {comments.map((comment, index) => (
                        <div
                            key={comment.id}
                            className={classes.item}
                            style={
                                {
                                    // @ts-ignore
                                    "--position": index + 1,
                                } as React.CSSProperties
                            }
                        >
                            <div
                                className={classes.card}
                                style={{
                                    background:
                                        "linear-gradient(to right, #00c6ff, #0072ff)",
                                }}
                            >
                                <p>{comment.text}</p>
                                <p>{comment.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Stack>
    )
}

export default Comments
