'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    
    // O Supabase verifica o e-mail e a senha no banco automaticamente
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('❌ Erro ao logar: ' + error.message)
    } else {
      // Se deu certo, redireciona para a tela de cadastros!
      router.push('/cadastros')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl w-96">
        
        <h1 className="text-2xl font-black mb-2 text-center text-gray-800">Apprimory</h1>
        <p className="text-sm text-center text-gray-500 mb-6">Identifique-se para continuar</p>
        
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="w-full border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:border-blue-500" 
          required 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="w-full border border-gray-300 p-3 mb-6 rounded focus:outline-none focus:border-blue-500" 
          required 
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
          Entrar no Sistema
        </button>
      </form>
    </div>
  )
}