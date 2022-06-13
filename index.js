const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Requisito 01 - Crie o endpoint GET /talker
const fs = require('fs').promises;

const fsTalker = ('./talker.json');

async function fetchTalker() {
  try {
    const data = await fs.readFile(fsTalker, 'utf8');
    const result = JSON.parse(data);
    return result;
  } catch (error) {
    console.log(`Erro ${error}`);
  }
}
app.get('/talker', async (_req, res) => {
  const manageTalkers = await fetchTalker();

  if (manageTalkers) {
    return res.status(HTTP_OK_STATUS).json(manageTalkers);
  } 
  return res.status(HTTP_OK_STATUS).json([]);
});

app.listen(PORT, () => {
  console.log('Online');
});
