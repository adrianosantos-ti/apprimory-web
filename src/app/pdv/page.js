// src/app/pdv/page.js
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function PDV() {
  const [produtos, setProdutos] = useState([])
  const [carrinho, setCarrinho] = useState([])
  const [produtoSelecionado, setProdutoSelecionado] = useState('')
  const [quantidade, setQuantidade] = useState(1)

  const empresaId = 1
  const clienteIdPadrao = 1 // Para a PoC, usar um ID válido de cliente

  useEffect(() => {
    async function fetchProdutos() {
      let { data } = await supabase.from('produtos').select('*').eq('empresa_id', empresaId).eq('tipo', 'P').gt('quantidade', 0)
      if (data) setProdutos(data)
    }
    fetchProdutos()
  }, [])

  function adicionarAoCarrinho(e) {
    e.preventDefault()
    if (!produtoSelecionado) return

    const prod = produtos.find(p => p.id == produtoSelecionado)
    const subtotal = prod.valor * quantidade

    setCarrinho([...carrinho, { ...prod, qtdVenda: quantidade, subtotal }])
    setQuantidade(1)
    setProdutoSelecionado('')
  }

  async function finalizarVenda() {
    if (carrinho.length === 0) return alert('Carrinho vazio!')

    const codigoVenda = Math.floor(Math.random() * 100000) // Gera um código provisório
    const totalVenda = carrinho.reduce((acc, item) => acc + item.subtotal, 0)
    const dataVenda = new Date().toLocaleDateString('pt-BR') // Formato DD/MM/YYYY do seu banco

    // Prepara o array para inserir todos os itens da venda de uma só vez
    const insercoes = carrinho.map(item => ({
      codigo_venda: codigoVenda,
      cliente_id: clienteIdPadrao,
      produto_id: item.id,
      quantidade: item.qtdVenda,
      valor_unitario: item.valor,
      valor_total: item.subtotal,
      data_venda: dataVenda,
      empresa_id: empresaId,
      forma_pagamento: 'Pix', // Fixo para a PoC
      qtd_parcelas: 1
    }))

    const { error } = await supabase.from('vendas').insert(insercoes)

    if (!error) {
      alert(`Venda ${codigoVenda} finalizada com sucesso!`)
      setCarrinho([])
    } else {
      alert('Erro na venda: ' + error.message)
    }
  }

  const totalCarrinho = carrinho.reduce((acc, item) => acc + item.subtotal, 0)

  return (
    <div className="p-8 max-w-4xl mx-auto flex gap-8">
      {/* Coluna Esquerda: Pesquisa */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">🛒 Frente de Caixa</h1>
        <form onSubmit={adicionarAoCarrinho} className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
          <select required value={produtoSelecionado} onChange={e => setProdutoSelecionado(e.target.value)} className="border p-2 rounded">
            <option value="">Selecione o produto...</option>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} - R$ {p.valor} (Estoque: {p.quantidade})</option>)}
          </select>
          <div className="flex gap-4">
            <input type="number" min="1" value={quantidade} onChange={e => setQuantidade(parseInt(e.target.value))} className="border p-2 rounded w-24" />
            <button type="submit" className="bg-green-600 text-white flex-1 rounded font-bold hover:bg-green-700">Adicionar ao Carrinho</button>
          </div>
        </form>
      </div>

      {/* Coluna Direita: Carrinho */}
      <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-4">🛍️ Itens no Carrinho</h2>
        <ul className="divide-y mb-4">
          {carrinho.map((item, idx) => (
            <li key={idx} className="py-2 flex justify-between">
              <span>{item.qtdVenda}x {item.nome}</span>
              <span>R$ {item.subtotal.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-4">
          <h3 className="text-2xl font-bold text-right text-green-700">Total: R$ {totalCarrinho.toFixed(2)}</h3>
          <button onClick={finalizarVenda} className="w-full mt-4 bg-black text-white py-3 rounded font-bold hover:bg-gray-800">Finalizar Venda</button>
        </div>
      </div>
    </div>
  )
}