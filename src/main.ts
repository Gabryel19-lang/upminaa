
import './style.css';

// TIPOS DE DADOS

type Produto = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
};

// ARMAZENAMENTO LOCAL

const CHAVE_PRODUTOS = 'upminaa';
const CHAVE_ORCAMENTO = 'upminaa-orcamento';

let produtos: Produto[] = [];

try {
  const dados = JSON.parse(
    localStorage.getItem(CHAVE_PRODUTOS) || '[]'
  );

  if (Array.isArray(dados)) {
    produtos = dados;
  }
} catch {
  produtos = [];
}

const valorSalvo = Number(
  localStorage.getItem(CHAVE_ORCAMENTO) ?? '100'
);

let orcamento = Number.isFinite(valorSalvo)
  ? Math.max(0, valorSalvo)
  : 100;

// INTERFACE DO UPMINAA

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="app">

    <header>
      <h1>Upminaa</h1>
      <p>アップミナ</p>
      <span>Calculadora de Compras</span>
    </header>

    <div class="torii" aria-hidden="true">
      <div class="torii-topo"></div>
      <div class="torii-meio"></div>
      <div class="torii-coluna esquerda"></div>
      <div class="torii-coluna direita"></div>
      <div class="torii-placa"></div>
    </div>

    <section>
      <h2>Adicionar produto</h2>

      <form id="form">

        <input
          id="nome"
          type="text"
          placeholder="Nome do produto"
          autocomplete="off"
          required
        >

        <div class="campos">
          <input
            id="preco"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Preço (R$)"
            required
          >

          <input
            id="quantidade"
            type="number"
            min="1"
            step="1"
            value="1"
            aria-label="Quantidade"
            required
          >
        </div>

        <button type="submit">
          + Adicionar item
        </button>

      </form>
    </section>

    <section>
      <h2>Minha lista de compras</h2>
      <ul id="lista"></ul>
    </section>

    <section class="orcamento-box">
      <h2>Meu orçamento</h2>

      <label for="orcamento">
        Limite de gastos (R$)
      </label>

      <input
        id="orcamento"
        type="number"
        min="0"
        step="0.01"
        value="${orcamento}"
      >

      <div class="orcamento-info">
        <span>Orçamento utilizado</span>
        <span id="porcentagem">0%</span>
      </div>

      <div class="barra-fundo">
        <div id="barra-progresso"></div>
      </div>

      <p id="status-orcamento"></p>
    </section>

    <footer>
      <p>Total da compra</p>

      <h2 id="total">R$ 0,00</h2>

      <button id="limpar" type="button">
        Limpar compra
      </button>
    </footer>

  </main>
`;

// ELEMENTOS DO SITE

const formulario =
  document.querySelector<HTMLFormElement>('#form')!;

const lista =
  document.querySelector<HTMLUListElement>('#lista')!;

const total =
  document.querySelector<HTMLElement>('#total')!;

const campoOrcamento =
  document.querySelector<HTMLInputElement>('#orcamento')!;

const porcentagem =
  document.querySelector<HTMLElement>('#porcentagem')!;

const barra =
  document.querySelector<HTMLElement>('#barra-progresso')!;

const statusOrcamento =
  document.querySelector<HTMLElement>('#status-orcamento')!;

// FORMATAR VALORES EM REAIS

function moeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// CALCULAR TOTAL DOS PRODUTOS

function calcularTotal(): number {
  return produtos.reduce(
    (soma, produto) =>
      soma + produto.preco * produto.quantidade,
    0
  );
}

// ATUALIZAR ORÇAMENTO

function atualizarOrcamento(valorTotal: number): void {
  if (orcamento <= 0) {
    porcentagem.textContent = 'Sem limite';
    barra.style.width = '0%';
    barra.classList.remove('estourou');

    statusOrcamento.textContent =
      'Defina um valor para seu orçamento.';

    statusOrcamento.className = '';
    return;
  }

  const percentual = (valorTotal / orcamento) * 100;

  porcentagem.textContent =
    `${Math.round(percentual)}%`;

  barra.style.width = `${Math.min(percentual, 100)}%`;

  const restante = orcamento - valorTotal;

  if (restante >= 0) {
    statusOrcamento.textContent =
      `Restam ${moeda(restante)} do orçamento.`;

    statusOrcamento.className = 'dentro-limite';
    barra.classList.remove('estourou');
  } else {
    statusOrcamento.textContent =
      `Orçamento ultrapassado em ${moeda(-restante)}!`;

    statusOrcamento.className = 'acima-limite';
    barra.classList.add('estourou');
  }
}

// ATUALIZAR LISTA E TOTAL

function atualizar(): void {
  lista.replaceChildren();

  if (produtos.length === 0) {
    const vazio = document.createElement('li');
    vazio.className = 'lista-vazia';
    vazio.textContent = 'Nenhum produto adicionado.';
    lista.appendChild(vazio);
  }

  produtos.forEach(produto => {
    const item = document.createElement('li');
    const texto = document.createElement('span');
    const botao = document.createElement('button');

    texto.textContent =
      `${produto.nome} (${produto.quantidade}x) — ` +
      moeda(produto.preco * produto.quantidade);

    botao.textContent = 'Excluir';
    botao.className = 'excluir';
    botao.type = 'button';

    botao.addEventListener('click', () => {
      produtos = produtos.filter(
        p => p.id !== produto.id
      );

      atualizar();
    });

    item.append(texto, botao);
    lista.appendChild(item);
  });

  const valorTotal = calcularTotal();

  total.textContent = moeda(valorTotal);

  atualizarOrcamento(valorTotal);

  localStorage.setItem(
    CHAVE_PRODUTOS,
    JSON.stringify(produtos)
  );
}

// ADICIONAR PRODUTO

formulario.addEventListener('submit', evento => {
  evento.preventDefault();

  const nome =
    document.querySelector<HTMLInputElement>('#nome')!
      .value.trim();

  const preco =
    document.querySelector<HTMLInputElement>('#preco')!
      .valueAsNumber;

  const quantidade =
    document.querySelector<HTMLInputElement>('#quantidade')!
      .valueAsNumber;

  if (
    !nome ||
    !Number.isFinite(preco) ||
    preco <= 0 ||
    !Number.isInteger(quantidade) ||
    quantidade < 1
  ) {
    return;
  }

  produtos.push({
    id: Date.now() + Math.random(),
    nome,
    preco,
    quantidade
  });

  atualizar();
  formulario.reset();

  document.querySelector<HTMLInputElement>('#nome')!
    .focus();
});

// ALTERAR ORÇAMENTO

campoOrcamento.addEventListener('input', () => {
  const novoValor = campoOrcamento.valueAsNumber;

  orcamento = Number.isFinite(novoValor)
    ? Math.max(0, novoValor)
    : 0;

  localStorage.setItem(
    CHAVE_ORCAMENTO,
    String(orcamento)
  );

  atualizarOrcamento(calcularTotal());
});

// LIMPAR COMPRA

document.querySelector<HTMLButtonElement>('#limpar')!
  .addEventListener('click', () => {

    if (produtos.length === 0) {
      return;
    }

    const confirmar = confirm(
      'Deseja realmente limpar toda a compra?'
    );

    if (!confirmar) {
      return;
    }

    produtos = [];
    atualizar();
  });

// INICIALIZAR

atualizar();
