const express = require('express');

// criei uma constante router e atribui a ela a função express.router que vai ser exportada e será importada no index.js (), que é o arquivo gerencia as rotas.
const router = express.Router();

const fs = require('fs').promises;

const toker = './talker.json';

// Requisitos 05
const validToken = (req, res, next) => {
const { authorization } = req.headers;
if (authorization === undefined) {
return res.status(401).json({ message: 'Token não encontrado' });
}
if (authorization.length !== 16) {
return res.status(401).json({ message: 'Token inválido' });
}

next();
};

const validationName = (req, res, next) => {
const { name } = req.body;
if (name === undefined) {
return res.status(400).json({ message: 'O campo "name" é obrigatório' });
}
if (name.length < 3) {
return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
}

next();
};

const validationAge = (req, res, next) => {
const { age } = req.body;
if (age === undefined) {
return res.status(400).json({ message: 'O campo "age" é obrigatório' });
}
if (age < 18) {
return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
}

next();
};

const validationTalk = (req, res, next) => {
const { talk } = req.body;
if (talk === undefined) {
return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
}
next();
};

const validationWatchedAt = (req, res, next) => {
const { talk } = req.body;
const regexDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
if (talk.watchedAt === undefined) {
return res.status(400)
.json({ message: 'O campo "watchedAt" é obrigatório' });
}
// O método test() executa uma busca por uma correspondência entre uma expressão regular e uma string. Retorna true ou false. A sua sintaxe é: regexObj.test(str).
if (regexDate.test(talk.watchedAt) === false) {
return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
}
next();
};

const validationRate = (req, res, next) => {
const { talk } = req.body;
if (talk.rate === undefined) {
return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
}
if (talk.rate < 1 || talk.rate > 5) {
return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
}

next();
};

router.post('/',
validToken,
validationName,
validationAge,
validationTalk,
validationWatchedAt,
validationRate,
(req, res) => {
// para ler o arquivo precisa receber uma string JSON e a transformar em um objeto JavaScript.
fs.readFile(toker, 'utf8')
.then((el) => JSON.parse(el))
.then((element) => {
const addTalker = { ...req.body, id: element.length + 1 };
element.push(addTalker);

// caso esteja tudo certo na requisição, retorne o status 201 e a pessoa cadastrada.
// para escrever o arquivo precisa receber objeto JavaScript e a transformar em uma string JSON.
fs.writeFile(toker, JSON.stringify(element));
return res.status(201).json({ ...addTalker });
})

.catch((error) => res.status(400).json(error));
});

// Requisito 7
router.delete('/:id',
validToken,
(req, res) => {
fs.readFile(toker, 'utf8')
.then((el) => JSON.parse(el))
.then((element) => {
const { id } = req.params;
const talkerFiltred = element.find((talker) => talker.id !== (id));
// vai escrever o talker que não contenha o id do endpoint.
fs.writeFile(toker, JSON.stringify(talkerFiltred));
return res.status(204).json({ message: 'Pessoa palestrante deletada com sucesso' });
})

.catch((err) => res.status(400).json(err));
});

module.exports = router;