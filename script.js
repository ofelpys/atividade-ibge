const selectEstado = document.getElementById('estado')
const selectCidade = document.getElementById('cidade')
const qtdCidades = document.getElementById('qtdCidades')
const filtroCidade = document.getElementById('filtroCidade')
const resumo = document.getElementById('resumo')
let listaCidades = []

function carregarEstados() {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(resposta => {
            if (!resposta.ok) throw new Error('Erro ao buscar estados')
            return resposta.json()
        })
        .then(estados => {
            selectEstado.innerHTML = '<option value="">Selecione o estado</option>'

            estados.forEach(estado => {
                const opcao = document.createElement('option')
                opcao.value = estado.sigla
                opcao.textContent = estado.nome
                selectEstado.appendChild(opcao)
            })

            selectEstado.disabled = false
        })
        .catch(() => {
            selectEstado.innerHTML = '<option value="">Erro ao carregar estados</option>'
        })
}

function mostrarCidades() {
    selectCidade.innerHTML = '<option value="">Selecione a cidade</option>'

    listaCidades.forEach(cidade => {
        if (cidade.nome.toLowerCase().includes(filtroCidade.value.toLowerCase())) {
            const opcao = document.createElement('option')
            opcao.value = cidade.nome
            opcao.textContent = cidade.nome
            selectCidade.appendChild(opcao)
        }
    })

    if (selectCidade.options.length === 1) {
        selectCidade.innerHTML = '<option value="">Nenhuma cidade encontrada</option>'
    }
}

selectEstado.addEventListener('change', () => {
    const uf = selectEstado.value
    listaCidades = []
    filtroCidade.value = ''
    filtroCidade.disabled = true
    selectCidade.disabled = true
    qtdCidades.textContent = ''
    resumo.textContent = ''

    if (uf === '') {
        selectCidade.innerHTML = '<option value="">Escolha um estado primeiro</option>'
        return
    }

    selectCidade.innerHTML = '<option value="">Carregando...</option>'

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(resposta => {
            if (!resposta.ok) throw new Error('Erro ao buscar cidades')
            return resposta.json()
        })
        .then(cidades => {
            if (selectEstado.value !== uf) return

            listaCidades = cidades
            mostrarCidades()
            selectCidade.disabled = false
            filtroCidade.disabled = false
            qtdCidades.textContent = `${uf} tem ${cidades.length} cidades.`
        })
        .catch(() => {
            if (selectEstado.value !== uf) return
            selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>'
        })
})

filtroCidade.addEventListener('input', mostrarCidades)

document.getElementById('formInscricao').addEventListener('submit', evento => {
    evento.preventDefault()

    if (selectCidade.disabled || selectCidade.value === '') return

    const nome = document.getElementById('nome').value
    resumo.textContent = `${nome}, de ${selectCidade.value}/${selectEstado.value}, inscrito com sucesso`
})

carregarEstados()
