
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
const PORT = 3000;


//CONEXAO COM BANCO DE DADOS 
connection
    .authenticate()
    .then(()=>{
        console.log("Conexao Ok!")
    }).catch((msgErro)=>{
        console.log(msgErro);
    })

//ENVIO DE DADOS ENVIADOS PELO FORMULARIO E CAPTURADOS NO BACKEND
app.use(bodyParser.urlencoded({extended: false}));
//LEITURA DE DADOS EM FORMATO JSAON ENVIADOS FRONT END
app.use(bodyParser.json());

//CONFIGURAÇÃO PARA USO DA VIEW ENGINE  'EJS' - TELAS HTML 
app.set('view engine', 'ejs');

//ADICIONANDO ARQUIVOS ESTATICOS NO PROJETO POR MEIO DA PASTA  'PUBLIC'
app.use(express.static('public'));


//ROTA PRINCIPAL
app.get("/", (req, res) => {
    //LISTANDO TODAS AS PERGUNTAS DO BANCO DE DADOS apenas C titulo e pergunta ATRAVES => ({raw: true}) emm ordem DESCRESCENTE
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas => {
        res.render("index",{
            perguntas: perguntas 
        });
    });
  
});

app.get("/questionme", (req, res) => {
    res.render("questionme");
});

app.post("/backend", (req, res) => {
    const titulo = req.body.titulo;
    const mensagem = req.body.mensagem;  
    //INSERT 
    Pergunta.create({
        titulo: titulo,
        mensagem: mensagem
    }).then(() => {
        res.redirect("/");
    });
});

app.post("/questionme", (req,res) => {
    const corpo = req.body.corpo;
    const perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/questionme/"+perguntaId);
    });
});


//BUSCANDO AS PERTGUNTAS DO BANCO DE DADOS PELO 'ID' atraves de CONDIÇÕES
app.get("/questionme/:id", (req,res)=> {
    const id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render("questions", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            })      
        }else{
            res.redirect("/");
        }
    });
});




//SERVIDOR
app.listen(8080,( )=>{
    console.log("Servidor rodando na porta " + PORT);
});