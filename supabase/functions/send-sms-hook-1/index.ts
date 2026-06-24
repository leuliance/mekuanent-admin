/**
 * Supabase Auth Hook: Simulated SMS Provider (for testing)
 *
 * This function simulates sending OTP codes for testing purposes.
 * It doesn't actually send SMS - it just logs and returns success.
 *
 * To deploy:
 * 1. Set secret: supabase secrets set SEND_SMS_HOOK_SECRET=your_webhook_secret
 * 2. Deploy: supabase functions deploy send-sms-hook-1 --no-verify-jwt
 * 3. Enable in Supabase Dashboard: Authentication > Auth Hooks > Send SMS Hook
 *    Hook URL: https://your-project.supabase.co/functions/v1/send-sms-hook-1
 */

import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

interface SmsHookPayload {
    user: {
        id: string;
        phone: string;
        email?: string;
    };
    sms: {
        otp: string;
    };
}

interface SimulatedResponse {
    status: string;
    message: string;
    to: string;
    body: string;
}

const sendSmsSimulated = async (
    messageBody: string,
    toNumber: string,
): Promise<SimulatedResponse> => {
    // Simulate SMS sending - just log it
    console.log(`[SIMULATED] Sending SMS to ${toNumber}`);
    console.log(`[SIMULATED] Message: ${messageBody}`);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Always return success for testing
    return {
        status: "queued",
        message: "SMS simulated successfully",
        to: toNumber,
        body: messageBody,
    };
};

Deno.serve(async (req) => {
    const payload = await req.text();
    const base64_secret = Deno.env.get("SEND_SMS_HOOK_SECRET")?.replace(
        "v1,whsec_",
        "",
    );
    const headers = Object.fromEntries(req.headers);
    const wh = new Webhook(base64_secret || "");

    try {
        const { user, sms } = wh.verify(payload, headers) as SmsHookPayload;

        // Use OTP 123456 for testing (override the actual OTP)
        const testOtp = "123456";
        const messageBody = `Your OTP is: ${testOtp}`;

        console.log(`[TEST] User: ${user.id}`);
        console.log(`[TEST] Phone: ${user.phone}`);
        console.log(`[TEST] Original OTP: ${sms.otp}`);
        console.log(`[TEST] Using test OTP: ${testOtp}`);

        const response = await sendSmsSimulated(
            messageBody,
            user.phone,
        );

        if (response.status !== "queued") {
            return new Response(
                JSON.stringify({
                    error: `Failed to send message: ${
                        response.message || "Unknown error"
                    }`,
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        return new Response(
            JSON.stringify({
                message: "Message sent successfully (simulated).",
                testOtp: testOtp,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    } catch (error) {
        console.error("Error in send-sms-hook-1:", error);
        return new Response(
            JSON.stringify({
                error: `Failed to process the request: ${error}`,
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
});
