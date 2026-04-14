import { useState } from "react"

function Signup() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSignup() {
    setError("")

    // only allow umich emails
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

    setSuccess(true)
    // redirect to login after signup
    window.location.href = "/login"
  }

  return (
    <div className="page">
      <h2>Sign Up</h2>

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

      <p>Already have an account? <a href="/login">Log in</a></p>
    </div>
  )
}

export default Signup