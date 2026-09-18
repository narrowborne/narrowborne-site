# NarrowBorne — do ZIP ao site

## 1. Abra e revise no seu computador

1. Baixe `NARROWBORNE-REVENDA-GITHUB.zip`.
2. Clique com o botão direito no ZIP e escolha **Extrair tudo**.
3. Entre na pasta extraída. Abra `index.html` no Chrome, Edge, Firefox ou Opera.
4. Navegue pelo catálogo e veja as categorias. Não é necessário instalar Node, npm ou outros programas para abrir o site.

Os arquivos do site ficam diretamente na raiz do pacote. Não envie o ZIP fechado ao GitHub: envie o conteúdo extraído.

## 2. O que enviar para o GitHub

Envie **todos os arquivos e a pasta `assets`**, mantendo a estrutura. No primeiro nível do repositório devem aparecer `index.html`, `README.md`, este guia e `assets/`. Dentro de `assets/`, mantenha `css/`, `js/`, `fonts/` e `images/`.

**Não envie apenas o HTML:** ele precisa das pastas para carregar fotos, fontes, estilos e navegação. Não renomeie `index.html` para `index(2).html`. Não crie uma pasta extra envolvendo todos os arquivos.

## 3. Suba uma nova versão sem perder a atual

O caminho mais simples para revisar é criar um novo repositório, por exemplo `narrowborne-revenda`. A versão antiga e o domínio permanecem disponíveis enquanto você confere o novo visual.

1. Entre em [github.com](https://github.com/).
2. Clique em **+ → New repository**.
3. Digite `narrowborne-revenda` no nome. Você pode usar um repositório privado, se a hospedagem conectada permitir.
4. Crie o repositório.
5. Na tela inicial, clique em **uploading an existing file**. Se ele já tem arquivos, use **Add file → Upload files**.
6. Abra a pasta extraída no computador. Selecione os arquivos e a pasta `assets` e arraste tudo para a área de upload do GitHub.
7. Espere o envio terminar. Escreva `Novo catálogo NarrowBorne` no campo de descrição.
8. Clique em **Commit changes**.
9. Confira que `index.html` está na primeira tela do repositório e que `assets` continua sendo uma pasta. É normal clicar em uma pasta e o GitHub mostrar os arquivos que estão dentro dela.

Se preferir atualizar um repositório existente, primeiro use **Code → Download ZIP** para guardar uma cópia da versão atual. Suba os novos arquivos nos mesmos caminhos, substituindo os correspondentes. Não apague configurações de domínio ou hospedagem sem saber sua função. Arquivos antigos podem permanecer publicados; revise-os depois da migração.

## 4. Colocar no ar a partir do GitHub

O GitHub guarda e versiona o código. Para esta loja, use uma hospedagem estática conectada ao repositório. O GitHub Pages não é indicado como hospedagem comercial: suas regras restringem sites voltados a negócios e transações. [Regra oficial do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

### Se você já tem uma hospedagem conectada ao GitHub

Se ela já publica HTML estático a partir da raiz, o commit deve gerar uma nova publicação. Se estiver configurada para outro sistema, selecione projeto estático, sem comando de instalação ou compilação, e a raiz como pasta publicada. Confira a prévia antes de vincular o domínio principal.

### Opção com Cloudflare Pages

1. Acesse [o painel Cloudflare](https://dash.cloudflare.com/).
2. Entre em **Workers & Pages → Create application → Pages**.
3. Escolha **Import an existing Git repository** e conecte o GitHub.
4. Selecione somente o repositório `narrowborne-revenda` e inicie a configuração.
5. Use estas opções:

| Campo | Valor |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `.` |
| Root directory | Deixe vazio, porque o HTML está na raiz |

6. Clique em **Save and Deploy**.
7. Abra o endereço `pages.dev` gerado para conferir o site.
8. Cada novo commit no GitHub poderá publicar a atualização automaticamente.

Essas opções correspondem a este pacote estático, sem framework. Os nomes de alguns botões podem variar. [Guia oficial de HTML estático](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) e [integração com GitHub](https://developers.cloudflare.com/pages/get-started/git-integration/).

### Domínio narrowborne.com.br

Depois de revisar a nova versão, abra o projeto na hospedagem e use **Custom domains** para adicionar seu domínio. Siga os registros DNS que o painel apresentar para aquele projeto; não copie um IP genérico. Preserve os registros de e-mail existentes. Para Cloudflare Pages, o domínio raiz precisa ser uma zona na conta Cloudflare; subdomínios podem usar CNAME conforme a configuração. [Orientação oficial de domínio personalizado](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## 5. Ativar seu WhatsApp

No GitHub, abra `assets/js/config.js`, clique no lápis e preencha `whatsapp` com **55 + DDD + seu número**, só com números. O exemplo abaixo é fictício; substitua pelo seu contato:

```js
window.STORE_CONFIG = {
  name: 'NarrowBorne',
  whatsapp: '5511999999999',
  instagram: 'https://www.instagram.com/SEU_PERFIL/',
  email: ''
};
```

Confirme o commit. O botão “Continuar no WhatsApp” passará a aparecer em Atendimento. A mensagem já inclui a peça e o tamanho de interesse quando a consulta começa em um produto. O campo `email` fica reservado e não cria um formulário ou serviço de e-mail.

Se o WhatsApp ficar vazio, o site informa que o atendimento está em preparação e permite copiar a consulta. Não existe envio escondido nem número inventado.

## 6. Trocar peças e fotos

As fotos atuais são **referências reais de terceiros**. Elas não confirmam o seu estoque e não vêm com autorização comercial para revenda das fotografias. Antes do lançamento da loja, substitua por fotos próprias ou fornecidas com autorização pelo seu fornecedor. Consulte `FONTES-IMAGENS.json` para a procedência.

1. Coloque a foto em `assets/images/`. Prefira nomes sem espaços e sem acentos, por exemplo `camiseta-nike-preta.webp`.
2. Abra `assets/js/catalogo.js`.
3. Encontre a peça correspondente e altere `name`, `brand`, `category`, `image`, `color` e `description`.
4. Confirme que o arquivo em `image` existe exatamente com aquele nome, inclusive letras maiúsculas e extensão.
5. Para adicionar uma peça, copie um objeto inteiro dentro de `CATALOG_PRODUCTS`, mantenha as vírgulas e use um `id` exclusivo.

Exemplo de peça; substitua nome, foto, tamanhos e descrição pelos dados reais:

```js
{
  "id": "nb-011",
  "name": "Nome da sua peça",
  "brand": "Nike",
  "category": "camisetas",
  "image": "camiseta-nike-preta.webp",
  "color": "Preto",
  "description": "Descrição da peça conferida com seu fornecedor.",
  "sizes": ["P", "M", "G", "GG"],
  "collections": ["street", "essenciais"],
  "featured": true,
  "source": ""
}
```

| Campo | Valores e comportamento |
| --- | --- |
| `category` | `camisetas`, `moletons`, `calcas`, `bones` |
| `brand` | Deve corresponder a um nome em `CATALOG_BRANDS` |
| `collections` | `street`, `essenciais`, `minimal`; pode participar de mais de uma |
| `featured` | `true` coloca a peça entre as candidatas aos quatro destaques da home |
| `sizes` | Tamanhos de interesse; o site não controla disponibilidade |

Mantenha pelo menos uma referência em cada uma das quatro categorias da home, pois a primeira foto de cada categoria é usada no respectivo cartão. A referência de calça Adidas foi identificada como juvenil; a cargo Zara é feminina. Confirme público e tamanhos ao substituir as peças.

Os avisos de “referência” estão nos templates e textos do site. Quando cadastrar estoque real, ajuste esses avisos em `app.js`, `index.html` e nos textos institucionais. Não remova os avisos enquanto ainda estiver usando produtos demonstrativos.

## 7. Ajustar os templates e a identidade

- **Cores:** no começo de `assets/css/style.css`, edite `--ink`, `--paper`, `--purple` e `--lilac`.
- **Banner principal e blocos de campanhas:** função `home()` em `assets/js/app.js`.
- **Página de produto:** função `product()`.
- **Coleções Street / Essenciais / Minimal:** função `collection()`; a composição de peças vem de `collections` em cada produto.
- **Cabeçalho e rodapé:** `index.html`.
- **Fotos editoriais:** `editorial-man.webp` e `editorial-woman.webp`; mantenha esses nomes ou atualize os caminhos.
- **Relógios:** função `watchBlock()`. A seção foi entregue sem fotos nem produtos, com “Em breve”.

Não é preciso mudar o código da navegação para cada produto novo: as páginas são montadas com os dados do catálogo. Os endereços com `#/` permitem abrir links de peças e atualizar a página sem erro de rota em hospedagens estáticas.

## 8. Antes de divulgar

Confira as fotos e as peças reais, preencha o WhatsApp, confirme textos de entrega/troca com sua operação e teste a consulta no celular. Não publique senhas, chaves privadas ou dados de clientes: os arquivos do site são acessíveis a quem navega.

Esta entrega não inclui pagamentos, checkout, controle de estoque, conta do cliente nem painel administrativo. O site não cobra, não reserva produto e não confirma pedidos. Foi preparado como o catálogo sem preços que você solicitou.

## 9. Resolver os problemas mais comuns

| O que aconteceu | Como resolver |
| --- | --- |
| Apareceu só texto, sem o visual | A pasta `assets/css` está faltando ou foi enviada em outro nível |
| Fotos não aparecem | Confira a pasta `assets/images` e os nomes, incluindo maiúsculas e extensões |
| A página ficou em branco | Confira se `config.js`, `catalogo.js` e `app.js` estão em `assets/js`; revise vírgulas e aspas se editou o catálogo |
| A hospedagem mostra 404 | `index.html` precisa estar na pasta definida como saída; neste guia é a raiz `.` |
| O visual antigo continua | Aguarde a publicação terminar e recarregue com Ctrl+F5 |
| WhatsApp não aparece | Insira o número completo, com país e DDD, somente dígitos |
| Uma marca não mostra peças | O catálogo daquela marca ainda não foi preenchido; o site mostra “em preparação” |
| Não achei login ou carrinho | Não há cadastro nem checkout nesta versão de catálogo sem preços |
