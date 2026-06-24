/**
 * Supabase Edge Function: Verify OTP via Afromessage
 *
 * This function verifies OTP codes sent via Afromessage API
 *
 * Usage:
 * POST /verify-otp-hook
 * Body: { "phone": "+251912345678", "code": "123456" }
 *
 * To deploy:
 * 1. Ensure AFROMESSAGE_TOKEN is set in secrets
 * 2. Deploy: supabase functions deploy verify-otp-hook
 */

// Deno.serve is built-in, no import needed

interface VerifyOtpRequest {
    phone: string;
    code: string;
}

Deno.serve(async (req: Request) => {
    try {
        // Handle CORS preflight
        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers":
                        "authorization, x-client-info, apikey, content-type",
                },
            });
        }

        // Verify this is a POST request
        if (req.method !== "POST") {
            return new Response(
                JSON.stringify({ error: "Method not allowed" }),
                {
                    status: 405,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                },
            );
        }

        // Get environment variables
        const AFROMESSAGE_TOKEN = Deno.env.get("AFROMESSAGE_TOKEN");

        if (!AFROMESSAGE_TOKEN) {
            console.error("Missing Afromessage token");
            return new Response(
                JSON.stringify({ error: "OTP service not configured" }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                },
            );
        }

        // Parse request body
        const { phone, code }: VerifyOtpRequest = await req.json();

        if (!phone || !code) {
            return new Response(
                JSON.stringify({ error: "Phone and code are required" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                },
            );
        }

        console.log(`Verifying OTP for ${phone}`);

        // Build Afromessage verify API request
        const verifyParams = new URLSearchParams({
            to: phone,
            code: code,
        });

        // Verify OTP via Afromessage
        const response = await fetch(
            `https://api.afromessage.com/api/verify?${verifyParams.toString()}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${AFROMESSAGE_TOKEN}`,
                    "Content-Type": "application/json",
                },
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Afromessage verify API error:", errorText);

            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid or expired OTP",
                    details: errorText,
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                },
            );
        }

        const result = await response.json();
        console.log("OTP verified successfully:", result);

        // Return success
        return new Response(
            JSON.stringify({
                success: true,
                verified: true,
                message: "OTP verified successfully",
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
    } catch (error) {
        console.error("Error in verify-otp-hook:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
                details: error instanceof Error
                    ? error.message
                    : "Unknown error",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
    }
});
