# Malleable App

Esse projeto tem a intenção de demonstrar o uso de LLMs para criação de uma aplicação web maleável.

## O que é uma aplicação maleável?

Uma aplicação maleável é uma aplicação que pode ser modificada pelo usuário final para atender suas necessidades específicas, mesmo sem conhecimento técnico.

## Onde posso executar essa aplicação?

Esse projeto ainda se encontra em ALPHA, ou seja muita coisa pode quebrar. E provavelmente vai :).

Ele pode ser acessado em: https://malleable-app.web.app/

## Como executar localmente?

Para executar localmente é necessário:

- [Node 18](https://nodejs.org/en/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [OpenAI API KEY](https://platform.openai.com/)

Instale as dependencias do projeto:

Raiz

```bash
npm install
```

Cloud Functions

```bash
cd cloud-functions
npm install
```

Frontend Web

```bash
cd frontend
npm install
```

Crie um arquivo `.env` no diretório `cloud-functions` com o seguinte conteúdo:

```bash
touch cloud-functions/.env
```

```bash
echo "OPENAI_API_KEY=<openai-api-key>" >> cloud-functions/.env
```

Para executar o projeto em ambiente de desenvolvimento, é necessário executar o frontend e as cloud functions.

Em um terminal execute:

```bash
npm run serve:functions
```

Em outro:

```bash
npm run serve:frontend
```

O projeto estará disponível em: http://localhost:3000

## Saiba Mais

- [Malleable Software in the Age of LLMs](https://www.geoffreylitt.com/2023/03/25/llm-end-user-programming.html)
