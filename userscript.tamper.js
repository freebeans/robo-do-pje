// ==UserScript==
// @name         Robô do PJe
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Userscript que automatiza o download de resultados de pesquisa do https://consultaunificadapje.tse.jus.br
// @author       https://github.com/freebeans
// @match        https://consultaunificadapje.tse.jus.br/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jus.br
// @require      https://raw.githubusercontent.com/adaltas/node-csv/master/packages/csv-stringify/dist/iife/sync.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /* CONFIGURAÇÕES **********************/

    // Aplica um delay (em milissegundos) entre receber os dados na tabela e pular pra próxima página.
    const DELAY_PULAR_PROXIMA_PAGINA = 100

    /* CONFIGURAÇÕES FIM ******************/

    // Cria botão "Iniciar"
    const botaoIniciar = document.createElement("button");
    botaoIniciar.classList.add("mat-raised-button", "mat-warning");
    botaoIniciar.innerHTML = "Iniciar era das máquinas";
    botaoIniciar.style = "margin-left: 16px"
    botaoIniciar.onclick = executar

    // Quando a página carregar, inicia observador no "app-selecao". Assim que ele tiver filhos (resultados da pesquisa), insere o botão Iniciar no corpo.
    window.addEventListener('load', ()=>{
        const tabelaObserver = new MutationObserver(() => {
            tabelaObserver.disconnect()
            document.querySelector('app-selecao .mat-card.ng-star-inserted').insertBefore(botaoIniciar, document.querySelector('app-selecao .mat-card-content'))
        })
        tabelaObserver.observe(document.querySelector('app-selecao'), {childList: true})
    })

    function executar() {

        // Defensive programming
        const tabela = document.querySelector('app-selecao table')
        if(!tabela) {
            console.error("Tabela não encontrada na página. Realize uma pesquisa antes de tentar extrair os dados.")
            return
        }

        // Inicializa cabeçalho e linhas do CSV
        const cabecalho = ['Link', ...extraiCabecalhoDaTabela()]
        const linhas = []

        // Captura botão de "próxima página"
        const botaoProximaPagina = document.querySelector('.mat-paginator-navigation-next.mat-icon-button.mat-button-base')

        // Cria e inicializa observador. Sempre que a tabela for atualizada, ele executará a função "etapaExtracao()"
        const observer = new MutationObserver(etapaExtracao)
        observer.observe(tabela, {characterData: true, subtree:true})

        // Inicia a primeira extração, consequentemente pulando de página ou finalizando a operação.
        etapaExtracao()

        // Salva dados da tabela, pula para próxima página se possível, ou baixa o CSV.
        function etapaExtracao() {
            linhas.push(extrairDadosDaTabela())

            // Botão habilitado (ainda há páginas para visitar)
            if(botaoProximaPagina.disabled == false) {
                setTimeout(() => { botaoProximaPagina.click() }, DELAY_PULAR_PROXIMA_PAGINA);
            }

            // Botão desabilitado (fim dos resultados)
            else {
                const linhasFlat = linhas.flat();
                const records = [cabecalho, ...linhasFlat]
                const options = {}
                const data = csv_stringify_sync.stringify(records, options);

                download(`consulta ${linhasFlat.length} resultados.csv`, data)
                observer.disconnect()
            }

        }

    }

    function extraiCabecalhoDaTabela() {
        return Array.from(document.querySelector('app-selecao table thead').children[0].children).map(th => th.innerText)
    }

    function extrairDadosDaTabela() {
        const rows = Array.from(document.querySelector('app-selecao table tbody').children)
        return rows.map(row => {
            const link = row.children[0].children[0].href
            const campos = Array.from(row.children).map(td => td.innerText)

            return [link, ...campos];
        })
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
})();
