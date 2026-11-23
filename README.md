# rodbot-pri — rod bot copiloto

Favorito (bookmarklet) que sugere a pasta certa para cada atendimento do Blip e move o ticket.

## Instalar

Abra `rodbot-pri.html` no navegador e arraste o botão **rod bot copiloto** para a barra de favoritos.

## Usar

1. No desk do Blip, clique no favorito.
2. Em **Pastas**, cadastre o nome exato de cada pasta e as palavras-chave; clique em **Conferir com o Blip**.
3. Clique em **Iniciar triagem**. `Enter` confirma, `1`–`9` escolhem outra pasta (ou clique na linha), `Esc` pula, `Espaço` pausa.

### Envio automático (opcional)

Em **Ajustes → Envio automático**, ligue a chave e escolha a confiança mínima (50–99%).
Quando a sugestão atinge esse valor, o ticket é movido sozinho após ~1,5 s, sem `Enter`.
Durante esse tempo, `Esc` pula, `1`–`9` troca a pasta e `Espaço` pausa.

- Abaixo do limite, o ticket espera sua confirmação como sempre.
- Envios automáticos aparecem no contador **Automáticos** e no CSV com `acao=automatico`.
- Envios automáticos **não** alimentam o aprendizado (só decisões suas reforçam o modelo),
  para o bot não se autoconvencer de erros.

## Ponte com o Copilot do Teams (opcional)

Userscript em `ponte/rodbot-ponte-teams.user.js`. Não precisa de Node.js.
Funciona no **Edge** ou no Chrome, desde que o Blip e o Teams estejam no **mesmo navegador e perfil**.

1. Instale o Tampermonkey (no Edge: loja Edge Add-ons). Em `edge://extensions`, ligue
   **Modo de desenvolvedor**; nos detalhes do Tampermonkey, ligue **Permitir scripts de usuário**, se aparecer.
2. No Tampermonkey: *Criar novo script* → cole o conteúdo de `ponte/rodbot-ponte-teams.user.js` → salvar.
3. Abra o Teams na web (`teams.microsoft.com` ou `teams.cloud.microsoft`), de preferência em uma
   **janela separada** do Edge, e abra o chat com o Copilot.
4. Clique no selo **rb** no canto inferior esquerdo → "Ponte ativa neste chat".
   (Precisa clicar de novo se recarregar a aba do Teams.)
5. No Blip, abra o rod bot → Ajustes → ligue **Copilot do Teams** e escolha em **Consultar o Copilot abaixo de** a confiança (%) abaixo da qual o Copilot é consultado.

Quando a confiança local é baixa, a ponte escreve a pergunta no chat do Copilot, lê o JSON da resposta
e mostra a pasta no painel. Você confirma com o botão **Mover para…**.

Se o Teams mudar o layout e a ponte parar de digitar ou enviar, ajuste `seletorCaixa` / `seletorEnviar`
no topo do script.

## Desenvolvimento

O código legível está em `src/rodbot-copiloto.js`; a página de instalação em `src/instalar.html`.

```bash
npm install
npm run build          # gera rodbot-pri.html
node test/painel.mjs   # teste no Blip falso (precisa do Playwright)
node test/ponte.mjs    # teste da ponte: Blip falso + Teams falso
```
