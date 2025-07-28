export async function fetchChatResponse(prompt: string): Promise<string> {
    const payload = JSON.stringify({ prompt, max_tokens: 1000, tag: 'void_general' });

    let ok = false;
    try {
        const res = await fetch("http://localhost:8000/okcheck");
        ok = res.ok && (await res.json()).ok === true;
    } catch (err) {
        console.warn("OK check failed, falling back to remote:", err);
    }

    try {
        console.log("Checking if ok");
        const res = await fetch(ok ? "http://localhost:8000/chat" : "https://void.dilloncarey.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
        });

        console.log("Tried to fetch at both places");
        const text = await res.text();
        const json = JSON.parse(text);
        return json.response || "No valid reply field.";
    } catch (err) {
        console.warn("Chat fetch error:", err);
        return "Error: Unable to reach the assistant.";
    }
}
