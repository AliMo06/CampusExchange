import { useState } from "react"

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

    // save the token so other pages can use it
    localStorage.setItem("token", data.token)
    localStorage.setItem("role", data.role)

    // redirect to home after login
    window.location.href = "/home"
  }

  return (
    <div className="page">
      <h2>Log In</h2>

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

      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  )
}

export default Login