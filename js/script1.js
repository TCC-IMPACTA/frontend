class Produto {

    constructor() {
        this.id = 1;
        this.arrayProdutos = [];
        this.editId = null;
    }

    salvar() {
        let produto = this.lerDados();

        if(this.validaCampos(produto)) {
            if(this.editId == null) {
                this.adicionar(produto);
            }else {
                this.atualizar(this.editId, produto);
            }
        }
        
        this.listaTabela();
        this.cancelar();
    }

    async carregarDados() {
        await fetch('http://localhost:3302/products')
            .then(T => T.json())
            .then((produtos) => this.arrayProdutos = [...produtos]);

        this.listaTabela();
    }

    listaTabela(){
        let tbody = document.getElementById('tbody');
        tbody.innerText = '';

        for(let i = 0; i < this.arrayProdutos.length; i++) {
            let tr = tbody.insertRow();

            let td_id = tr.insertCell();
            let td_produto = tr.insertCell();
            let td_valor = tr.insertCell();
            let td_acoes = tr.insertCell();

            td_id.innerText = this.arrayProdutos[i].id;
            td_produto.innerText = this.arrayProdutos[i].produto;
            td_valor.innerText = this.arrayProdutos[i].valor;

            td_id.classList.add('center');

            let imgEdit = document.createElement('img');
            imgEdit.src = 'img/pen-to-square-regular.svg';
            imgEdit.setAttribute("onclick","produto.preparaEditacao("+ JSON.stringify(this.arrayProdutos[i]) +")")

            let imgDelete = document.createElement('img');
            imgDelete.src = 'img/trash-solid.svg';
            imgDelete.setAttribute("onclick","produto.deletar("+ this.arrayProdutos[i].id+")")

            td_acoes.appendChild(imgEdit);
            td_acoes.appendChild(imgDelete);
        }
    }

    adicionar(produto) {
        produto.valor = parseFloat(produto.valor)
        this.arrayProdutos.push(produto);
        this.id++;
    }

    atualizar(id , produto) {
        for(let i = 0; i < this.arrayProdutos.length; i++) {
            if(this.arrayProdutos[i].id == id) {
                this.arrayProdutos[i].produto = produto.produto;
                this.arrayProdutos[i].valor = produto.valor;
            }
        }
    }

    preparaEditacao(dados) {
        this.editId = dados.id;

        document.getElementById('produto').value = dados.produto;
        document.getElementById('preco').value = dados.valor;

        document.getElementById('btn1').innerText = 'Atualizar';
    }

    lerDados() {
        let produto = {}

        produto.id = this.id;
        produto.produto = document.getElementById('produto').value;
        produto.valor = document.getElementById('preco').value;

        return produto
    }

    validaCampos(produto) {
        let msg = '';

        if(produto.produto == ''){
            msg += '- Informe o nome do produto \n';
        }

        if(produto.valor == ''){
            msg += '- Informe o preço do produto \n';
        }

        if(msg != '') {
            alert(msg);
            return false
        }

        return true;
    }

    cancelar() {
       document.getElementById('produto').value = '';
       document.getElementById('preco').value = '';

       document.getElementById('btn1').innerText = 'Salvar';
       this.editId = null;
    }

    async deletar(id) {
        if(confirm('Deseja realmente deletar o produto do ID ' + id)) {
            await fetch('http://localhost:3302/products',
                {
                    method: 'DELETE',
                    body: JSON.stringify({ id }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })
            .then(T => T.json())
            .then(() => this.carregarDados());
        }
    }
}

let produto = new Produto()