import { handleRequest } from '@/utils/serverUtils';
import React, { useState } from 'react'


const test = () => {

    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const data = {
            firstName: firstName, 
            lastName: lastName
        }

        try {
            handleRequest(data)
        }
        catch ( error ) {
            console.error("Tried sending:\n", data, "\nERROR:\n", error)
        }
    }

    return (
        <form 
        onSubmit={(e) => handleSubmit(e)}
        >
            <input 
            type="text" 
            name='firstName'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            />
            <input 
            type="text" 
            name='lastName'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            />

            <button type='submit'>Submit</button>
        </form>
    )
}

export default test;