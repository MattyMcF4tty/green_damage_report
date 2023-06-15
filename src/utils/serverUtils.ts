
export const handleRequest = async (info:object) => {

    const https = require("https")

    const data = JSON.stringify({
        "data": info
    })
    
    const options = {
        hostname: "eoqzh1o1zcioyj9.m.pipedream.net",
        port: 443,
        path: "/",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length,
    },
    }

        const req = await https.request(options)
        await req.write(data)
        await req.end()
        console.log("Server recieved:\n", data)

}