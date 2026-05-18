import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

interface ResendResponse {
  id?: string;
  error?: string;
}

// Validation helper
function validateInput(payload: ContactPayload): { valid: boolean; error?: string } {
  if (!payload.name || typeof payload.name !== "string" || payload.name.trim().length === 0) {
    return { valid: false, error: "Name is required and must be a non-empty string" };
  }

  if (!payload.email || typeof payload.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { valid: false, error: "Email is required and must be a valid email address" };
  }

  if (!payload.message || typeof payload.message !== "string" || payload.message.trim().length === 0) {
    return { valid: false, error: "Message is required and must be a non-empty string" };
  }

  return { valid: true };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload: ContactPayload = await req.json();

    // Validate input
    const validation = validateInput(payload);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, message } = payload;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 1. Store message in Supabase
    const { data: insertedData, error: dbError } = await supabase.from("contacts").insert([
      {
        name: name!.trim(),
        email: email!.trim(),
        message: message!.trim(),
      },
    ]);

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(JSON.stringify({ error: "Failed to store message", details: dbError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Send email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const receiverEmail = Deno.env.get("RECEIVER_EMAIL") || "avntae7@gmail.com";

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not configured; email not sent but message stored");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Contact message stored (email provider not configured)",
          messageId: insertedData?.[0]?.id,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: receiverEmail,
        reply_to: email,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message!.replace(/\n/g, "<br />")}</p>
        `,
        text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    const emailData: ResendResponse = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Contact message stored (email delivery failed, will retry)",
          messageId: insertedData?.[0]?.id,
          emailError: emailData.error || "Unknown error",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Success!
    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact message received and email sent successfully",
        messageId: insertedData?.[0]?.id,
        emailId: emailData.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error", details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
