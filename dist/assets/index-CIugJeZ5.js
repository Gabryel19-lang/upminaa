(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`upminaa`,t=`upminaa-orcamento`,n=[];try{let t=JSON.parse(localStorage.getItem(e)||`[]`);Array.isArray(t)&&(n=t)}catch{n=[]}var r=Number(localStorage.getItem(t)??`100`),i=Number.isFinite(r)?Math.max(0,r):100;document.querySelector(`#app`).innerHTML=`
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
        value="${i}"
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
`;var a=document.querySelector(`#form`),o=document.querySelector(`#lista`),s=document.querySelector(`#total`),c=document.querySelector(`#orcamento`),l=document.querySelector(`#porcentagem`),u=document.querySelector(`#barra-progresso`),d=document.querySelector(`#status-orcamento`);function f(e){return e.toLocaleString(`pt-BR`,{style:`currency`,currency:`BRL`})}function p(){return n.reduce((e,t)=>e+t.preco*t.quantidade,0)}function m(e){if(i<=0){l.textContent=`Sem limite`,u.style.width=`0%`,u.classList.remove(`estourou`),d.textContent=`Defina um valor para seu orçamento.`,d.className=``;return}let t=e/i*100;l.textContent=`${Math.round(t)}%`,u.style.width=`${Math.min(t,100)}%`;let n=i-e;n>=0?(d.textContent=`Restam ${f(n)} do orçamento.`,d.className=`dentro-limite`,u.classList.remove(`estourou`)):(d.textContent=`Orçamento ultrapassado em ${f(-n)}!`,d.className=`acima-limite`,u.classList.add(`estourou`))}function h(){if(o.replaceChildren(),n.length===0){let e=document.createElement(`li`);e.className=`lista-vazia`,e.textContent=`Nenhum produto adicionado.`,o.appendChild(e)}n.forEach(e=>{let t=document.createElement(`li`),r=document.createElement(`span`),i=document.createElement(`button`);r.textContent=`${e.nome} (${e.quantidade}x) — `+f(e.preco*e.quantidade),i.textContent=`Excluir`,i.className=`excluir`,i.type=`button`,i.addEventListener(`click`,()=>{n=n.filter(t=>t.id!==e.id),h()}),t.append(r,i),o.appendChild(t)});let t=p();s.textContent=f(t),m(t),localStorage.setItem(e,JSON.stringify(n))}a.addEventListener(`submit`,e=>{e.preventDefault();let t=document.querySelector(`#nome`).value.trim(),r=document.querySelector(`#preco`).valueAsNumber,i=document.querySelector(`#quantidade`).valueAsNumber;!t||!Number.isFinite(r)||r<=0||!Number.isInteger(i)||i<1||(n.push({id:Date.now()+Math.random(),nome:t,preco:r,quantidade:i}),h(),a.reset(),document.querySelector(`#nome`).focus())}),c.addEventListener(`input`,()=>{let e=c.valueAsNumber;i=Number.isFinite(e)?Math.max(0,e):0,localStorage.setItem(t,String(i)),m(p())}),document.querySelector(`#limpar`).addEventListener(`click`,()=>{n.length!==0&&confirm(`Deseja realmente limpar toda a compra?`)&&(n=[],h())}),h();