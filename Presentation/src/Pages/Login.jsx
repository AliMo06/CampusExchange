import { useState } from "react"
import "./auth.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin() {
    setError("")

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem("role", data.role)
    window.location.href = "/"
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="logo-area">
            <h1>Campus<span>Exchange</span></h1>
            <p>University of Michigan Marketplace</p>
        </div>

        <h2>Welcome back</h2>
        <p className="subtitle">Log in to your account</p>

        <input
          type="email"
          placeholder="University email"
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

        <button onClick={handleLogin}>Log In</button>

        <p className="bottom-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  )
}

export default Login