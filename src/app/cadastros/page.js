// src/app/cadastros/page.js
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function CadastroProdutos() {
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [produtos, setProdutos] = useState([])

  // Simula o emp_id do seu sistema original
  const empresaId = 1 

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    let { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('tipo', 'P')
      .order('nome')
    if (data) setProdutos(data)
  }

  async function salvarProduto(e) {
    e.preventDefault()
    const { error } = await supabase.from('produtos').insert([
      {
        nome,
        valor: parseFloat(valor),
        quantidade: parseInt(quantidade),
        empresa_id: empresaId,
        tipo: 'P',
        classe: 'Venda',
        categoria: 'Geral'
      }
    ])

    if (!error) {
      alert('Produto cadastrado com sucesso!')
      setNome(''); setValor(''); setQuantidade('')
      carregarProdutos() // Atualiza a tabela na mesma hora sem piscar a tela
    } else {
      alert('Erro ao salvar: ' + error.message)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📦 Novo Produto</h1>
      
      <form onSubmit={salvarProduto} className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Nome do Produto</label>
          <input required type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valor (R$)</label>
          <input required type="number" step="0.01" value={valor} onChange={e => setValor(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estoque</label>
          <input required type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Salvar</button>
      </form>

      <h2 className="text-xl font-bold mb-4">📋 Produtos Cadastrados</h2>
      <ul className="bg-white rounded-lg shadow-md divide-y">
        {produtos.map(p => (
          <li key={p.id} className="p-4 flex justify-between">
            <span>{p.nome}</span>
            <span className="font-bold">R$ {p.valor} | Qtd: {p.quantidade}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}