const express = require('express');

// criei uma constante router e atribui a ela a função express.router que vai ser exportada e será importada no index.js (), que é o arquivo gerencia as rotas.
const router = express.Router();

// Requisitos 03 e 04
// https://www.geeksforgeeks.org/node-js-crypto-randombytes-method/
const crypto = require('crypto');

const token = crypto.randomBytes(8).toString('hex');
console.log(token);

const validationEmail = (req, res, next) => {
  // https://stackoverflow.com/questions/6646613/please-explain-this-e-mail-validation-regular-expression
  const regex = /^\w+[\\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i;
// O método test() executa uma busca por uma correspondência entre  uma expressão regular e uma string. Retorna true ou false. A sua sintaxe é: regexObj.test(str).
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
  const { email } = req.body;
  if (email === undefined) {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  }
  if (regex.test(email) === false) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  
  next();
};

const validationPassword = (req, res, next) => {
  const { password } = req.body;
  if (password === undefined) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
};

// essa rota vai exportar as duas funções de validação. A chave token tem como valor a constante token criada nesse arquivo.
router.post('/', validationEmail, validationPassword, (req, res) => {
  res.status(200).json({ token });
});

// só preciso  colocar http POST :3000/login email='juliana@hotmail.com' password='123456', que vai gerar o token
module.exports = router;