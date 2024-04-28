# Twitch Chat Bot
Este é um bot de chat para Twitch que monitora mensagens em canais específicos e bane usuários que usam palavras proibidas.

## Instalação
Para instalar este projeto, siga estas etapas:
 - Certifique-se de ter o Node.js instalado em seu sistema.
 - Clone este repositório para o seu ambiente local.
 - No diretório do projeto, execute o seguinte comando para instalar as dependências:

```bash
npm install
```

## Configuração
Antes de usar o bot, é necessário configurar algumas variáveis no arquivo index.js:

 - **BOT_USERNAME**: O nome de usuário do bot.
 - **BOT_PASSWORD**: O token do bot.
 - **CHANNELS**: Uma matriz contendo os canais que o bot deve monitorar.
 - **BANNED_WORDS**: Uma matriz contendo as palavras proibidas que, se encontradas em uma mensagem, resultarão no banimento do usuário que a enviou.
Além disso, é necessário substituir 'Client-ID' e 'Acess_Token' pelos valores reais fornecidos pela Twitch para acesso à API.

Sites para pegar o oauth e o Acess Token
https://twitchapps.com/tmi/
https://twitchtokengenerator.com/

### Uso
Para iniciar o bot, execute o seguinte comando no diretório do projeto:

```JS 
node index.js
```
O bot se conectará aos servidores IRC da Twitch e monitorará as mensagens nos canais especificados. Ele banirá automaticamente qualquer usuário que enviar uma mensagem contendo uma das palavras proibidas.

### Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas ou enviar solicitações pull.

### Licença
Este projeto está licenciado sob a [Licença MIT](https://opensource.org/license/mit).
