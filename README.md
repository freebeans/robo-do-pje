# robo-do-pje
Userscript que automatiza o download de resultados de pesquisa do https://consultaunificadapje.tse.jus.br

### Requisitos
O Tampermonkey é uma extensão para Google Chrome que consegue injetar scripts em páginas Web.
Para utilizar o programa, você precisa primeiro [instalar a extensão](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).

### Instalando o programa
Após instalar o Tampermonkey, [clique aqui para instalar a última versão do script](https://github.com/freebeans/robo-do-pje/raw/main/userscript.tamper.js).

### Executando
1. [Abra o site](https://consultaunificadapje.tse.jus.br/)
2. Preencha os campos de pesquisa e clique em **Pesquisar**
3. Clique no recém criado botão laranja. O script vai pular de página em página extraindo os dados da tabela.
4. Ao finalizar o trabalho, o script vai criar um arquivo .CSV e fará o download.

### Dicas
Se desejar, você pode subir o arquivo .CSV no [Google Spreadsheets](https://docs.google.com/spreadsheets). Para importar os dados em uma planilha que já existe, vá em **Arquivo > Importar > UPLOAD > BROWSE** e escolha o arquivo baixado. Se você já tem uma planilha com filtros bonitinhos, você provavelmente vai querer selecionar a opção **Substituir página atual**.
