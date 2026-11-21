import type { Config } from "@netlify/functions"

// Newsletter-Anmeldung mit Double-Opt-In über Brevo.
// Brevo schickt die Bestätigungsmail. Erst nach dem Klick auf den Link landet
// der Kontakt in der Liste, und die Brevo-Automation verschickt den Rabattcode.
//
// Umgebungsvariablen (Netlify > Project configuration > Environment variables):
//   BREVO_API_KEY          API-Schlüssel aus Brevo (geheim)
//   BREVO_LIST_ID          ID der Liste, in die bestätigte Kontakte kommen
//   BREVO_DOI_TEMPLATE_ID  ID der Double-Opt-In-Vorlage (Tag "optin")

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const REDIRECT = "https://ever8te.de/danke"

const json = (body: object, status = 200) => Response.json(body, { status })

export default async (req: Request) => {
  let email = ""
  let honeypot = ""
  const type = req.headers.get("content-type") || ""
  try {
    if (type.includes("application/json")) {
      const data = await req.json()
      email = String(data.email || "")
      honeypot = String(data.firma || "")
    } else {
      const data = new URLSearchParams(await req.text())
      email = data.get("email") || ""
      honeypot = data.get("firma") || ""
    }
  } catch {
    return json({ ok: false, error: "bad_request" }, 400)
  }

  // Bots füllen das versteckte Feld aus: so tun, als hätte es geklappt.
  if (honeypot) return json({ ok: true })

  email = email.trim().toLowerCase()
  if (!EMAIL.test(email) || email.length > 254) {
    return json({ ok: false, error: "invalid_email" }, 422)
  }

  const apiKey = Netlify.env.get("BREVO_API_KEY")
  const listId = Number(Netlify.env.get("BREVO_LIST_ID"))
  const templateId = Number(Netlify.env.get("BREVO_DOI_TEMPLATE_ID"))
  if (!apiKey || !listId || !templateId) {
    console.error("Brevo ist nicht konfiguriert (BREVO_API_KEY, BREVO_LIST_ID, BREVO_DOI_TEMPLATE_ID)")
    return json({ ok: false, error: "not_configured" }, 500)
  }

  const res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email,
      includeListIds: [listId],
      templateId,
      redirectionUrl: REDIRECT,
    }),
  })

  if (res.ok) return json({ ok: true })

  const detail = await res.text()
  // Bereits bestätigte Kontakte: Brevo meldet einen Duplikat-Fehler. Für die Person ist das kein Fehler.
  if (res.status === 400 && detail.includes("duplicate")) return json({ ok: true, existing: true })

  console.error("Brevo-Fehler", res.status, detail)
  return json({ ok: false, error: "upstream" }, 502)
}

export const config: Config = {
  path: "/api/newsletter",
  method: "POST",
}
