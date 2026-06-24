/**
 * Supabase Auth Hook: Custom SMS Provider (Afromessage)
 *
 * This function integrates with Afromessage API to send OTP codes
 * for phone number verification during user signup/login.
 *
 * Based on Supabase's Twilio example, adapted for Afromessage API.
 *
 * To deploy:
 * 1. Set secrets:
 *    supabase secrets set AFROMESSAGE_TOKEN=your_token
 *    supabase secrets set AFROMESSAGE_SENDER=Mekuannent
 *    supabase secrets set AFROMESSAGE_IDENTIFIER=your_identifier
 *    supabase secrets set SEND_SMS_HOOK_SECRET=your_webhook_secret
 * 2. Deploy: supabase functions deploy send-sms-hook --no-verify-jwt
 * 3. Enable in Supabase Dashboard: Authentication > Auth Hooks > Send SMS Hook
 *    Hook URL: https://your-project.supabase.co/functions/v1/send-sms-hook
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

interface AfromessageResponse {
    success?: boolean;
    status?: string;
    result?: unknown;
    error?: boolean | string;
    http_code?: number;
    message?: string;
}

const sendSmsViaAfromessage = async (
    otpCode: string,
    afromessageToken: string | undefined,
    afromessageSender: string,
    afromessageIdentifier: string | undefined,
    toNumber: string,
): Promise<AfromessageResponse> => {
    if (!afromessageToken || !afromessageIdentifier) {
        console.log(
            "Your Afromessage credentials are missing. Please add them.",
        );
        return { error: "SMS service not configured" };
    }

    // Build Afromessage API URL with parameters
    const params = new URLSearchParams({
        from: afromessageIdentifier,
        sender: afromessageSender,
        to: toNumber,
        pr: "Your Mekuannent verification code is:", // message prefix
        ps: "Valid for 5 minutes.", // message postfix
        sb: "1", // 1 space before code
        sa: "1", // 1 space after code
        ttl: "300", // 5 minutes (300 seconds)
        len: otpCode.length.toString(), // code length
        t: "0", // 0 = numeric only
    });

    const url =
        `https://api.afromessage.com/api/challenge?${params.toString()}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${afromessageToken}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Afromessage API error:", errorText);
        return {
            error: true,
            http_code: response.status,
            message: `Failed to send SMS: ${errorText}`,
        };
    }

    const result = await response.json();
    console.log("SMS sent successfully:", result);

    return {
        success: true,
        status: "sent",
        result: result,
    };
};

Deno.serve(async (req: Request) => {
    try {
        const payload = await req.text();
        const sendSmsHookSecret = Deno.env.get("SEND_SMS_HOOK_SECRET");

        let user: SmsHookPayload["user"];
        let sms: SmsHookPayload["sms"];

        // Try to verify webhook if secret is configured
        if (sendSmsHookSecret) {
            try {
                const base64_secret = sendSmsHookSecret.replace(
                    "v1,whsec_",
                    "",
                );
                const headers = Object.fromEntries(req.headers);
                const wh = new Webhook(base64_secret);

                // Verify webhook signature
                const verified = wh.verify(payload, headers) as SmsHookPayload;
                user = verified.user;
                sms = verified.sms;
            } catch (verifyError) {
                console.error("Webhook verification failed:", verifyError);
                // If verification fails, try to parse payload directly (for testing/development)
                try {
                    const parsed = JSON.parse(payload) as SmsHookPayload;
                    user = parsed.user;
                    sms = parsed.sms;
                    console.log(
                        "Parsed payload directly (webhook verification skipped)",
                    );
                } catch (parseError) {
                    console.error("Failed to parse payload:", parseError);
                    return new Response(
                        JSON.stringify({
                            error: {
                                http_code: 401,
                                message:
                                    "Webhook verification failed and payload parsing failed",
                            },
                        }),
                        {
                            status: 401,
                            headers: {
                                "Content-Type": "application/json",
                            },
                        },
                    );
                }
            }
        } else {
            // No secret configured - parse payload directly (for development/testing)
            console.warn(
                "SEND_SMS_HOOK_SECRET is not set - parsing payload directly",
            );
            try {
                const parsed = JSON.parse(payload) as SmsHookPayload;
                user = parsed.user;
                sms = parsed.sms;
            } catch (parseError) {
                console.error("Failed to parse payload:", parseError);
                return new Response(
                    JSON.stringify({
                        error: {
                            http_code: 400,
                            message: "Invalid payload format",
                        },
                    }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
            }
        }

        // Validate required fields
        if (!user || !user.phone || !sms || !sms.otp) {
            return new Response(
                JSON.stringify({
                    error: {
                        http_code: 400,
                        message:
                            "Missing required fields: user.phone or sms.otp",
                    },
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // Get environment variables
        const AFROMESSAGE_TOKEN = Deno.env.get("AFROMESSAGE_TOKEN");
        const AFROMESSAGE_SENDER = Deno.env.get("AFROMESSAGE_SENDER") ||
            "Mekuannent";
        const AFROMESSAGE_IDENTIFIER = Deno.env.get("AFROMESSAGE_IDENTIFIER");

        console.log(`Sending OTP to ${user.phone} for user ${user.id}`);

        const response = await sendSmsViaAfromessage(
            sms.otp,
            AFROMESSAGE_TOKEN,
            AFROMESSAGE_SENDER,
            AFROMESSAGE_IDENTIFIER,
            user.phone,
        );

        if (response.error || !response.success) {
            return new Response(
                JSON.stringify({
                    error: {
                        http_code: response.http_code || 500,
                        message: response.message || "Failed to send SMS",
                    },
                }),
                {
                    status: response.http_code || 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // Return empty JSON on success (as per Supabase example)
        return new Response(
            JSON.stringify({}),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    } catch (error) {
        console.error("Error in send-sms-hook:", error);
        return new Response(
            JSON.stringify({
                error: {
                    http_code: 500,
                    message: `Failed to send sms: ${JSON.stringify(error)}`,
                },
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
