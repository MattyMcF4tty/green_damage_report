import { createNewUser, getSession, verifySessionToken } from "@/utils/logic/firebaseLogic/authenticationLogic/logic";
import { AdminUser } from "@/utils/schemas/adminUserSchema";
import { ApiResponse } from "@/utils/schemas/miscSchemas/apiResponseSchema";
import { verifyMethod } from "@/utils/security/apiProtection";
import { NextApiRequest, NextApiResponse } from "next";


export default async function (req:NextApiRequest, res:NextApiResponse) {
    // Verify method
    if (!verifyMethod(req, 'POST')) {
        return res.status(405).json(new ApiResponse(
            'METHOD_NOT_ALLOWED',
            [],
            [`Api route only accepts DELETE and got ${req.method}.`],
            {}
        ))
    }

    //Verify user
    const sessionToken = getSession(req);
    if (!sessionToken) {
        return res.status(401).json(new ApiResponse(
            'UNAUTHORIZED',
            [],
            ['Missing authorization.'],
            {}
        ))
    }
    if (typeof sessionToken !== 'string') {
        return res.status(400).json(new ApiResponse(
            'BAD_REQUEST',
            [],
            ['Invalid authorization format.'],
            {}
        ));    
    }

    let user: AdminUser;
    try {
        const decodedToken = await verifySessionToken(sessionToken)
        user = {email: decodedToken.email || 'Unkown', uid: decodedToken.uid}
    } catch (error:any) {
        return res.status(403).json(new ApiResponse(
            'FORBIDDEN',
            [],
            ['You do not have permission to access this resource.'],
            {}
        ));    
    }


    const { email, password } = req.query;
    try {
        if (!email) {
            throw new Error('Missing email.')
        }
        if (typeof email !== 'string') {
            throw new Error(`Expected email to be string but got ${typeof email}.`)
        }

        if (!password) {
            throw new Error('Missing password.')
        }
        if (typeof password !== 'string') {
            throw new Error(`Expected password to be string but got ${typeof password}.`)
        }
    } catch (error:any) {
        return res.status(400).json(new ApiResponse(
            'BAD_REQUEST',
            [],
            [error.message],
            {}
        ))
    }


    try {
        const newUser = await createNewUser(email, password);

        console.log(`User ${user.uid} created user ${newUser.uid}`);
        return res.status(201).json(new ApiResponse(
            'CREATED',
            ['User successfully created'],
            [],
            {}
        ))
    } catch (error:any) {
        return res.status(500).json(new ApiResponse(
            'INTERNAL_ERROR',
            [],
            ['Something went wrong'],
            {}
        ))
    }
}