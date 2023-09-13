import admin from "firebase-admin";

try {
    const privateKey = "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnufX9tUk0DTz0\\ne+P/8SJiZKTvoJs1+ppk8vzfTy7kXojyw6aN92/fjP6M4kT1gAjtG65I3Wn30awb\\nh6WJqHYR52VQZL/Oy6+Uheabd+TW/Y54X3I0IpfnJf5Ekf6BF5CndgUwnoMvCi6g\\ntZc4DEw4qbHCguLJSIPF0ErzpAjorMKX5o81vKrEoN1vBCEneKBEvgwq71USeqi6\\n1hKnNwa/1Grq0pR+JCVNJb9IOagi/JgXShTuZUMQH0HFxyPJlYxWiq4bHBQKiqVI\\n/hFT8w1lwLrcAlglS+LMtTysmqoPte3e/VheLMvb5Qja0Os6YIp4XBYVG/9rEgwe\\nIfENp30/AgMBAAECggEABDTGJfgjX1JLqofm1lbKOXRzrGy3J7nioFB1pfX645A5\\nV/kvFpVTcWQ8R/UurIdq8eNFUh93VlckPUaAEL0wRM+sO0FjjACQpSVcfJ6blwah\\nyYP/Pa52Z74Mq9SLcNpR7tknVSpMeOQE+lPDeIzaZnte8VVN8aVHZLEOCCEfdhJA\\no+6A51x6llMYClMU8fJS132p/nByUBBDBzAb52QsS7QMyAEmdCbsM4UtxZZAiXqy\\nJooW5mn+B60RhVxyMwNgQxsesG7Hc76UK1UCAKQhD312DHHYl2PaOVDfXZk3kK/4\\nII5vMXyJEvLDqJl9uSIcumeRDz77jc4dSLTEjSj++QKBgQDTNU/+4Mo16WyzN2vt\\nmilEla4vig0Iqa/oBhhipPCVDP9gO/RwzM4ZHh4t5aIAYYQkR2N60NpOE6iYN8oz\\ngG2IdfiTFy8RJkf4tOUUxFLDm1LchJYn5vsyWFi0Ibm+rDFDZ9VQ0sgxI5fwMH9M\\nZ/4cMHBavH51a0q/HPn75Hn5WQKBgQDLS/rTBTawi4Bu2CtbgFbyGp3sCHohVrYt\\ncBrmDzETPwt76nVk1VZN2PzuLgSX/MffVM8XRatJdmmMIEGzE4+2OyqhqoWF9t6b\\nxQ7jOdtepQrLvgKm5lEPmc7WMihP8zTJiV8NtaXIXJSnXgxpED+3fOm2ZA67zJVd\\nO2d4P5nAVwKBgQDNnrp5nejfIZhkxdD6KbqBfeNtfs3/oAuULNLyvjdGNLguvU/V\\nvV3skCi7cDMOgeF+3E1aFRhjKLpbLv1YtHBuiMNumASHgqhQ1fOsCxG0Q3QhIad5\\nw2LMebwp6ieGHOd9AwpmvD6PsGJMQTq9bQSz9uh7PcUzlTfY5WHuPFoPSQKBgEuQ\\nqmLVhUaKE+sfnr4cLjU/f4PEguDxgjXRfa4V53/n5zTgKVKZmcLF7P37TOnRo9l3\\nhKJ52vkrcoALXWBa3Qg3ZdlBsO/im0v7K1V6o/fCEQk6T3IKGgdafG9RpXpSRETF\\nMve9lSmsf/TWGHbU+1oQrC6HcpKLsNk+w28G9PdxAoGBAJvOap9CdRzER+cuPeor\\nT+HTxNkJRPtO0+tf0DMmMOxVrL9flXpyN+9iNOvz4mVTI5mOcJJOx+SXkZ26Ep1l\\nY3aTekGVBbC/jZErooO8QA/LiVbdpSfCCTIB0oWR5AUDQ21whmO2ZpuronKJkm4H\\ndnJldsfbvXNNbR/2+ijcY1wh\\n-----END PRIVATE KEY-----\\n";
    if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            privateKey: privateKey.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL,
    });
    }
} catch ( error ) {
    console.error("Something went wrong initializing service account:\n", error)
}

export default admin;
