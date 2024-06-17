"use server"; // This will only run on server ( server actions )

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const user = await currentUser();

    if(!user) throw new Error("User is not logged in");
    if(!apiKey) throw new Error("No API key");
    if(!apiSecret) throw new Error("No API secret");

    const client = new StreamClient(apiKey, apiSecret);
    // Token will be valid for one hour
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
    // Time at which token issued
    const issued = Math.floor(Date.now() / 1000) - 60;
    // Creating token
    const token = client.createToken(user.id, exp, issued);
    return token;

}