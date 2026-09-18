# NarrowBorne Store

Nova identidade de catálogo multimarcas: branco, preto e roxo, tipografia editorial e navegação direta.

**Comece pelo [GUIA-GITHUB.md](GUIA-GITHUB.md).**

## O que está pronto

- Página inicial com duas campanhas editoriais, categorias, seleções e seção de relógios.
- Catálogo pesquisável; filtros por categoria e marca; ordenação.
- Dez peças de referência com fotografias reais e páginas individuais.
- Quinze marcas; marcas sem peças têm estado de seleção em preparação.
- Três templates de coleção: Street, Essenciais e Minimal.
- Favoritos salvos no navegador, sem cadastro.
- Consulta de interesse com tamanho; copiar texto; WhatsApp quando configurado.
- Relógios sem imagens, marcados como “Em breve”.
- Acessórios, Sobre, Ajuda e Privacidade.
- Responsividade, navegação por teclado e respeito à preferência de movimento reduzido.
- Fontes e imagens locais: o site não depende de imagens carregadas de outras lojas.

## Abrir no computador

Extraia tudo e abra `index.html` no navegador. Não abra o HTML dentro do ZIP. A função de copiar consulta pode pedir seleção manual em alguns navegadores locais. Para testar em servidor local com Python: `python -m http.server 8080`, depois acesse `http://localhost:8080`.

## Editar

| Arquivo | Função |
| --- | --- |
| `index.html` | Estrutura, cabeçalho, navegação, rodapé e metadados |
| `assets/js/config.js` | WhatsApp e Instagram da loja |
| `assets/js/catalogo.js` | Marcas, peças, cores, imagens e coleções |
| `assets/js/app.js` | Templates das páginas e interações |
| `assets/css/style.css` | Paleta, tipografia, layout, responsividade e movimento |
| `assets/images/` | Fotografias otimizadas em WebP |
| `assets/fonts/` | Fontes locais e licenças OFL |
| `FONTES-IMAGENS.json` | Procedência das fotos de referência |

## Escopo desta entrega

Catálogo de apresentação sem preços, checkout, pagamento, cadastro, servidor, painel administrativo ou estoque sincronizado. Nenhum pedido é criado. O WhatsApp está vazio porque o número comercial não foi informado. A consulta continua utilizável com a opção de copiar mensagem.

As fotos de produtos são referências de terceiros, não fotografias de um estoque confirmado. Substitua por fotos próprias ou autorizadas antes do lançamento comercial; os links de procedência estão no arquivo de fontes. A marca apresentada na foto não estabelece parceria oficial ou autenticidade de um produto que venha a ser vendido.

Os nomes Oakley, Louis Vuitton e Trapstar foram padronizados. Harmany e Cortes foram mantidos como informados; confirme a grafia ao cadastrar o estoque.

## Hospedagem

HTML, CSS e JavaScript estáticos, sem etapa de compilação ou dependências npm. As rotas usam `#/`, funcionam em subpastas e não exigem regras de servidor. O projeto foi preparado para armazenamento no GitHub e publicação em hospedagem estática conectada ao repositório. Consulte o guia para o procedimento e para não substituir seu domínio antes da revisão.
