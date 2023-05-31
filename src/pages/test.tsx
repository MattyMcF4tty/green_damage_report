import React from 'react'

const test = () => {

    function handleSubmit() {
        try {
            const https = require("https")

            const data = JSON.stringify({
            "tissemand": "event",
            "fuiog": "sdgsd"
            })
        
            const options = {
            hostname: "eo9ihtbvivfqz7o.m.pipedream.net",
            port: 443,
            path: "/",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": data.length,
            },
            }
        
            const req = https.request(options)
            req.write(data)
            req.end()   
        }
        catch (error) {
            console.log("FUCK DIG")
        } 
    }
  return (
    <form onSubmit={handleSubmit}>
        
        <button type="submit">Submit</button>
    </form>
  )
}

export default test;