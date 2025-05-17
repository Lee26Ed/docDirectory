import React from "react"
import DocProfile from "./DocProfile"
import { useSession } from "next-auth/react"

const ProfileSettings = () => {
    const { data: session } = useSession()
    const user = session?.user
    if (!user) {
        return <div>Loading...</div>
    }
    return <DocProfile />
}

export default ProfileSettings
