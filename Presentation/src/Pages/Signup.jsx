import { useState } from "react"
import "./auth.css"

function Signup() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSignup() {
    setError("")

    if (!email.endsWith("@umich.edu")) {
      setError("You must use a @umich.edu email to sign up.")
      return
    }

    const res = await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    window.location.href = "/login"
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="logo-area">
            <h1>Campus<span>Exchange</span></h1>
            <p>University of Michigan Marketplace</p>
        </div>

        <h2>Create an account</h2>
        <p className="subtitle">Join your campus marketplace</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="@umich.edu email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleSignup}>Sign Up</button>

        <p className="bottom-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  )
}

export default Signup