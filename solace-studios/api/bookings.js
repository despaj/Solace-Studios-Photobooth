export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, eventType, eventDate, location } = req.body || {};
  if (
    ![name, email, eventType, eventDate, location].every(
      (value) => typeof value === "string" && value.trim(),
    )
  ) {
    return res
      .status(400)
      .json({ error: "Please complete all booking fields." });
  }

  const date = new Date(eventDate);
  if (Number.isNaN(date.getTime()) || date.getTime() < Date.now()) {
    return res
      .status(400)
      .json({ error: "Please choose a valid future event date." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res
      .status(500)
      .json({ error: "Booking service is not configured yet." });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        event_type: eventType.trim(),
        event_date: date.toISOString(),
        event_location: location.trim(),
        status: "pending",
      }),
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Supabase booking insert failed:", body);
      return res.status(500).json({
        error: "Could not save your booking. Please try again.",
        detail: body.message || body.hint || body.code || null,
      });
    }

    return res
      .status(201)
      .json({ message: "Booking request saved.", booking: body[0] });
  } catch (error) {
    console.error("Booking API error:", error);
    return res
      .status(500)
      .json({ error: "Server error while saving booking." });
  }
}
