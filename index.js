const express = require('express');

const fs = require('fs').promises;

const bodyParser = require('body-parser');

const validationLogin = require('./validationLogin');

const app = express();

app.use(bodyParser.json());

app.use('/login', validationLogin);

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Requisito 01 - Crie o endpoint GET /talker
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

// 02 - Crie o endpoint GET /talker/:id
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const manageTalkers = await fetchTalker();
  // vou procurar o primeiro elemento do array que contém esse id
  const findTalkers = manageTalkers.find((element) => element.id === Number(id)); 
  console.log(findTalkers);
  // se tiver no array o id que estou procurando, então vai retornar o seu conteúdo
  if (findTalkers) {
    return res.json(findTalkers);
  } 
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

// Requisito 03 - Crie o endpoint POST /login
// https://www.geeksforgeeks.org/node-js-crypto-randombytes-method/
// const token = crypto.randomBytes(8).toString('hex');

// app.get('/login', (req, res) => {
//   const { email, password } = req.body;
//   if (email === 'email@email.com' && password === '123456') {
//     token.
//     return res.end();
//   }

//   res.json({ email: 'email@email.com', password: '123456' });
//   res.get({ token });
// });

app.listen(PORT, () => {
  console.log('Online');
});
