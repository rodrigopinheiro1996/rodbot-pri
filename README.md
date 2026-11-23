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

## Desenvolvimento

O código legível está em `src/rodbot-copiloto.js`; a página de instalação em `src/instalar.html`.

```bash
npm install
npm run build          # gera rodbot-pri.html
node test/painel.mjs   # teste no Blip falso (precisa do Playwright)
```
