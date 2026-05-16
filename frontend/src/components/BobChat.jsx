import { useState, useRef, useEffect } from "react";
import { s } from "../styles/index.js";

// ─── Code Block Renderer ──────────────────────────────────────────────────────

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: "#0a0a0a",
      border: "1px solid #222",
      marginTop: "12px",
      marginBottom: "12px",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 12px",
        borderBottom: "1px solid #1a1a1a",
      }}>
        <span style={{ fontSize: "10px", color: "#444", letterSpacing: "2px" }}>
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: "transparent",
            border: "none",
            color: copied ? "#00ff88" : "#444",
            fontSize: "10px",
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "1px",
          }}
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre style={{
        margin: 0,
        padding: "16px",
        fontSize: "12px",
        color: "#e0e0e0",
        overflowX: "auto",
        lineHeight: 1.6,
        fontFamily: "'Courier New', monospace",
      }}>
        {code}
      </pre>
    </div>
  );
}

// ─── Message Renderer ─────────────────────────────────────────────────────────

function BobMessage({ text }) {
  // Parse EXPLANATION and FIX blocks
  const parts = [];
  const explanationMatch = text.match(/EXPLANATION:\s*([\s\S]*?)(?=FIX:|$)/);
  const fixMatch = text.match(/FIX:\s*```(\w*)\n([\s\S]*?)```/);

  if (explanationMatch) {
    parts.push(
      <p key="explanation" style={{
        fontSize: "13px",
        color: "#aaa",
        lineHeight: 1.7,
        margin: "0 0 8px 0",
      }}>
        {explanationMatch[1].trim()}
      </p>
    );
  }

  if (fixMatch) {
    parts.push(
      <CodeBlock key="fix" language={fixMatch[1]} code={fixMatch[2].trim()} />
    );
  }

  // If no structured format, just render as plain text
  if (parts.length === 0) {
    parts.push(
      <p key="plain" style={{
        fontSize: "13px",
        color: "#aaa",
        lineHeight: 1.7,
        margin: 0,
      }}>
        {text}
      </p>
    );
  }

  return <div>{parts}</div>;
}

// ─── Main BobChat Component ───────────────────────────────────────────────────

export function BobChat({ result, repoContext }) {
  const isOnboard = result.mode === "onboard";

  // Build the fix queue from the report
  const fixQueue = isOnboard
    ? [
        {
          title: "Understand the mental model",
          where: "entire codebase",
          detail: result.mentalModel,
        },
        ...(result.topFiles?.map((f) => ({
          title: `Read and understand ${f.path}`,
          where: f.path,
          detail: f.why,
        })) || []),
        {
          title: "Complete your first task",
          where: "see report",
          detail: result.firstTask,
        },
      ]
    : [
        result.biggestProblem && {
          title: result.biggestProblem.title,
          where: result.biggestProblem.where,
          detail: result.biggestProblem.detail,
          severity: "HIGH",
        },
        ...(result.issues?.map((i) => ({
          title: i.title,
          where: i.where,
          detail: i.fix,
          severity: i.severity,
        })) || []),
      ].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const currentIssue = fixQueue[currentIndex];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load the first issue automatically
  useEffect(() => {
    if (fixQueue.length > 0) {
      askBobAboutIssue(fixQueue[0], []);
    }
  }, []);

 const askBobAboutIssue = async (issue, existingMessages) => {
    setLoading(true);

    const userMsg = {
      role: "user",
      content: isOnboard
        ? `Help me understand this: "${issue.title}" in ${issue.where}. Context: ${issue.detail}`
        : `Fix this issue for me: "${issue.title}" in ${issue.where}. Details: ${issue.detail}`,
    };

    const newMessages = [...existingMessages, userMsg];

    console.log("repoContext exists?", !!repoContext);
    console.log("repoContext length:", repoContext?.length);
    console.log("messages being sent:", newMessages);

    setMessages((prev) => [
      ...prev,
      {
        type: "issue",
        issue,
        index: currentIndex,
      },
    ]);

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          repoContext,
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Chat failed");

      setMessages((prev) => [
        ...prev,
        { type: "bob", text: data.text },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bob", text: `Error: ${err.message}` },
      ]);
    }

    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    const userMsg = { role: "user", content: userText };

    setMessages((prev) => [...prev, { type: "user", text: userText }]);

    setLoading(true);

    // Build full history for context
    const history = messages
      .filter((m) => m.type === "user" || m.type === "bob")
      .map((m) => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.text,
      }));

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, userMsg],
          repoContext,
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Chat failed");

      setMessages((prev) => [...prev, { type: "bob", text: data.text }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bob", text: `Error: ${err.message}` },
      ]);
    }

    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleNext = () => {
    if (currentIndex >= fixQueue.length - 1) {
      setDone(true);
      return;
    }
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    // Build history so Bob has context
    const history = messages
      .filter((m) => m.type === "user" || m.type === "bob")
      .map((m) => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.text,
      }));

    askBobAboutIssue(fixQueue[nextIndex], history);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (done) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        gap: "16px",
      }}>
        <div style={{ fontSize: "32px" }}>✓</div>
        <div style={{ fontSize: "16px", color: "#fff", letterSpacing: "2px" }}>
          ALL ISSUES ADDRESSED
        </div>
        <div style={{ fontSize: "13px", color: "#555" }}>
          Bob walked you through {fixQueue.length} {isOnboard ? "topics" : "fixes"}.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 120px)",
    }}>
      {/* Progress bar */}
      <div style={{
        padding: "12px 0",
        marginBottom: "8px",
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}>
          <span style={{ fontSize: "10px", color: "#444", letterSpacing: "2px" }}>
            {isOnboard ? "LEARNING PROGRESS" : "FIX PROGRESS"}
          </span>
          <span style={{ fontSize: "10px", color: "#444" }}>
            {currentIndex + 1} / {fixQueue.length}
          </span>
        </div>
        <div style={{ height: "2px", background: "#1a1a1a" }}>
          <div style={{
            height: "100%",
            width: `${((currentIndex + 1) / fixQueue.length) * 100}%`,
            background: "#fff",
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        paddingRight: "4px",
      }}>
        {messages.map((msg, i) => {
          if (msg.type === "issue") {
            return (
              <div key={i} style={{
                margin: "16px 0 8px 0",
                padding: "12px 16px",
                background: "#111",
                border: "1px solid #222",
                borderLeft: "2px solid #fff",
              }}>
                <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px", marginBottom: "4px" }}>
                  {isOnboard ? "TOPIC" : `ISSUE · ${msg.issue.severity || ""}`}
                </div>
                <div style={{ fontSize: "13px", color: "#fff" }}>{msg.issue.title}</div>
                <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{msg.issue.where}</div>
              </div>
            );
          }

          if (msg.type === "bob") {
            return (
              <div key={i} style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px", marginBottom: "8px" }}>
                  IBM BOB
                </div>
                <BobMessage text={msg.text} />
              </div>
            );
          }

          if (msg.type === "user") {
            return (
              <div key={i} style={{ marginBottom: "16px", textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px", marginBottom: "8px" }}>
                  YOU
                </div>
                <div style={{
                  display: "inline-block",
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  padding: "10px 14px",
                  fontSize: "13px",
                  color: "#e0e0e0",
                  maxWidth: "80%",
                  textAlign: "left",
                  lineHeight: 1.6,
                }}>
                  {msg.text}
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* Loading indicator */}
        {loading && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px", marginBottom: "8px" }}>
              IBM BOB
            </div>
            <div style={{ fontSize: "13px", color: "#444" }}>
              thinking<span style={{ animation: "blink 1s infinite" }}>...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input + Next button */}
      <div style={{
        borderTop: "1px solid #1a1a1a",
        paddingTop: "16px",
        marginTop: "8px",
      }}>
        {/* Chat input */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "12px",
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ask Bob anything about this issue..."
            disabled={loading}
            style={{
              flex: 1,
              background: "#111",
              border: "1px solid #333",
              color: "#e0e0e0",
              padding: "10px 14px",
              fontSize: "13px",
              fontFamily: "inherit",
              outline: "none",
              opacity: loading ? 0.5 : 1,
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              background: "transparent",
              border: "1px solid #333",
              color: "#555",
              padding: "10px 16px",
              fontSize: "13px",
              fontFamily: "inherit",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.4 : 1,
            }}
          >
            send →
          </button>
        </div>

        {/* Next issue button */}
        <button
          onClick={handleNext}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "transparent" : "#fff",
            color: loading ? "#444" : "#000",
            border: "1px solid #333",
            padding: "12px",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: "bold",
            letterSpacing: "2px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {currentIndex >= fixQueue.length - 1
            ? "✓ MARK ALL DONE"
            : `NEXT ${isOnboard ? "TOPIC" : "ISSUE"} →`}
        </button>
      </div>
    </div>
  );
}