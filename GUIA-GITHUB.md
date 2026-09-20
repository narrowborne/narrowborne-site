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

## 6. Catálogo e próxima etapa

As quatro categorias estão vazias, conforme solicitado. `assets/js/catalogo.js` contém a lista de marcas e `CATALOG_PRODUCTS = []`. Não há fotos, roupas demonstrativas nem preços. Nenhum produto foi cadastrado automaticamente.

O painel administrativo ainda NÃO foi criado. Cadastro de produtos, upload de fotos próprias, variações, controle de estoque e publicação ficam para a próxima etapa. A estrutura do catálogo foi mantida separada do visual para facilitar essa integração. Ainda não há autenticação, banco de dados, uploads ou sincronização de estoque.

## 7. Artes e templates originais

| Arquivo | Uso |
| --- | --- |
| `assets/images/ink-hero.png` | Banner principal com gotas e splash de tinta roxa |
| `assets/images/ink-campaign.png` | Arte de campanha para o template Street |
| `assets/images/nb-emblem.png` | Monograma NB original, cabeçalho e campanha de identidade |
| `assets/css/ink-theme.css` | Identidade preta/roxa, animações, efeitos e responsividade |
| `assets/js/app.js` | Templates, páginas e navegação |
| `docs/ARTES-ORIGINAIS.json` | Prompts usados na geração original |

As três artes principais foram criadas do zero com geração de imagens. Nenhuma fotografia de terceiros permanece no pacote. As marcas são exibidas por arquivos SVG locais, sem dependência de imagens externas.

O texto dos banners fica em HTML, separado das artes, e pode ser editado sem gerar outra imagem. Para editar a home, veja a função `home()`. As funções `collection()`, `brandPage()` e `watchBlock()` controlam coleções, marcas e relógios.

## 8. Movimento

A versão inclui entrada de elementos durante a rolagem, faixa de texto em movimento, respiração lenta da arte principal, resposta ao ponteiro no computador, efeitos nos cards e uma linha de progresso de leitura. O botão de pausa no cabeçalho desativa o movimento e salva a preferência neste navegador. A preferência de movimento reduzido do sistema também é respeitada.

## 9. Publicação e revisão

Antes de substituir o site atual, abra `index.html` localmente e confira a prévia da hospedagem. As categorias vazias são intencionais. Não existe painel administrativo, checkout ou cobrança nesta etapa.

Não misture o pacote com os arquivos antigos: use o repositório de revisão ou remova as fotos e arquivos que foram substituídos antes de publicar a nova versão. Este pacote não contém as fotografias da entrega anterior.

Se faltar o visual, confira o envio de `assets/css/style.css` e `assets/css/ink-theme.css`. Se faltar uma arte, confira `assets/images/`. Mantenha o arquivo `index.html` na raiz da pasta publicada.
