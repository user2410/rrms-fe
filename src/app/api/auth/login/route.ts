import {NextResponse} from "next/server";

export async function POST(request: any) {
    /*
        Gọi BE's Login api sau đó trả về jwt token
     */

    return NextResponse.json({message: "Hello"})
}