import { redirect } from 'next/navigation'

export default function Home() {
  // Redireciona qualquer um que entrar na página raiz direto para o login
  redirect('/login')
}