export async function fetchChatResponse(prompt: string): Promise<string> {
    const payload = JSON.stringify({ prompt, max_tokens: 1000, tag: 'webtrix_general' });

    try {
        let res = await fetch("http://localhost:8000/okcheck");
        const ok = res.ok && (await res.json()).ok === true;

        res = await fetch(ok ? "http://localhost:8000/chat" : "https://void.dilloncarey.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
        });

        const text = await res.text();
        const json = JSON.parse(text);
        return json.response || "No valid reply field.";
    } catch (err) {
        console.warn("Chat fetch error:", err);
        return "Error: Unable to reach the assistant.";
    }
}
