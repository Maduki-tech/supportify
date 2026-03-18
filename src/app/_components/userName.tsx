'use client'
import { useUser } from "@clerk/nextjs";


export const UserName = () => {
    const { user } = useUser();
    return (
        <div>
            {user ? (
                <p>Welcome, {user.firstName}!</p>
            ) : (
                <p>Loading user information...</p>
            )}

        </div>
    )
}
