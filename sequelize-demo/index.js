(async () => {
    const database = require("./db");
    const Produto = require("./produto");
    await database.sync();

    /*const novoProduto = await Produto.create({
        nome: "Teclado",
        preco: 50,
        descricao: "Teclado Mecânico"
    })
    console.log(novoProduto);*/

    const produtos = await Produto.findAll({
        where: {
            preco: 50
        }
    });

})();