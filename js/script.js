// 1. Alternar entre Cadastro e Login
const cardCadastro = document.getElementById('card-cadastro');
const cardLogin = document.getElementById('card-login');

document.getElementById('ir-para-login').addEventListener('click', (e) => {
    e.preventDefault();
    cardCadastro.style.display = 'none';
    cardLogin.style.display = 'block';
});

document.getElementById('ir-para-cadastro').addEventListener('click', (e) => {
    e.preventDefault();
    cardLogin.style.display = 'none';
    cardCadastro.style.display = 'block';
});

// 2. Mostrar / Ocultar senha (funciona nos dois formulários)
document.querySelectorAll('.btn-olho').forEach((botao) => {
    botao.addEventListener('click', () => {
        const input = document.getElementById(botao.dataset.alvo);
        if (input.type === 'password') {
            input.type = 'text';
            botao.textContent = '🙈';
        } else {
            input.type = 'password';
            botao.textContent = '👁️';
        }
    });
});

// 3. Validação de Senha em tempo real
const cadSenha = document.getElementById('cad-senha');
const reqTamanho = document.getElementById('req-tamanho');
const reqMaiuscula = document.getElementById('req-maiuscula');
const reqNumero = document.getElementById('req-numero');
const reqSimbolo = document.getElementById('req-simbolo');
const reqProibidas = document.getElementById('req-proibidas');

function validarSenha() {
    const valor = cadSenha.value;

    const temTamanho = valor.length >= 8;
    reqTamanho.classList.toggle('valido', temTamanho);

    const temMaiusculaEMinuscula = /[A-Z]/.test(valor) && /[a-z]/.test(valor);
    reqMaiuscula.classList.toggle('valido', temMaiusculaEMinuscula);

    const temNumero = /\d/.test(valor);
    reqNumero.classList.toggle('valido', temNumero);

    const temSimbolo = /[!@#$%^&*(),.?":{}|<>]/.test(valor);
    reqSimbolo.classList.toggle('valido', temSimbolo);

    const semProibidas =
        valor.length > 0 &&
        !valor.toLowerCase().includes('senha') &&
        !valor.includes('123456');
    reqProibidas.classList.toggle('valido', semProibidas);

    return temTamanho && temMaiusculaEMinuscula && temNumero && temSimbolo && semProibidas;
}

cadSenha.addEventListener('input', validarSenha);

// 4. Conexão com o Supabase
const SUPABASE_URL = 'https://xnuflmzzzcgthqwzxvbm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_h0ZACtS95GkxSgAjHOcjcQ_8XunRl9s';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 5. Função calcularIdade
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento + 'T00:00:00');
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

// 6. Cadastro
document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarSenha()) {
        alert('A senha ainda não atende a todos os requisitos.');
        return;
    }

    const nome = document.getElementById('cad-nome').value;
    const email = document.getElementById('cad-email').value;
    const data_nascimento = document.getElementById('cad-nascimento').value;
    const genero = document.getElementById('cad-genero').value;
    const password = document.getElementById('cad-senha').value;

    const { data, error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
        alert('Erro ao cadastrar: ' + error.message);
        return;
    }

    const { error: errorPerfil } = await supabaseClient
        .from('perfis')
        .insert([{ id: data.user.id, nome, data_nascimento, genero }]);

    if (errorPerfil) {
        alert('Erro ao salvar perfil: ' + errorPerfil.message);
        return;
    }

    alert('Cadastro realizado com sucesso! Agora faça login.');
    document.getElementById('form-cadastro').reset();
    validarSenha();
    cardCadastro.style.display = 'none';
    cardLogin.style.display = 'block';
});

// 7. Login
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-senha').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        alert('Erro ao entrar: ' + error.message);
        return;
    }

    await abrirPainelPorId(data.user.id);
});

// 8. Painel do Administrador (Carregar, Renderizar, Filtrar e Promover)
let todosPerfis = [];

function renderizarTabela(lista) {
    const tbody = document.getElementById('tabela-usuarios');
    tbody.innerHTML = '';

    lista.forEach((usuario) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.genero}</td>
            <td>${calcularIdade(usuario.data_nascimento)} anos</td>
            <td>
                ${usuario.role !== 'admin'
                    ? `<button onclick="promoverAdmin('${usuario.id}')" style="padding: 6px 10px; font-size: 0.8rem; margin: 0;">Tornar Admin</button>`
                    : '<span>Admin</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function carregarUsuariosAdmin() {
    const { data, error } = await supabaseClient
        .from('perfis')
        .select('*');

    if (error) {
        alert('Erro ao carregar usuários: ' + error.message);
        return;
    }

    todosPerfis = data;
    renderizarTabela(todosPerfis);
}

async function promoverAdmin(id) {
    const { error } = await supabaseClient
        .from('perfis')
        .update({ role: 'admin' })
        .eq('id', id);

    if (error) {
        alert('Erro ao promover: ' + error.message);
        return;
    }

    alert('Usuário promovido a administrador!');
    carregarUsuariosAdmin();
}

document.getElementById('filtro-genero').addEventListener('change', (e) => {
    const generoSelecionado = e.target.value;

    if (generoSelecionado === 'Todos') {
        renderizarTabela(todosPerfis);
    } else {
        const filtrados = todosPerfis.filter((usuario) => usuario.genero === generoSelecionado);
        renderizarTabela(filtrados);
    }
});

// 9. Sair (Logout)
async function fazerLogout() {
    await supabaseClient.auth.signOut();

    document.getElementById('tela-usuario').style.display = 'none';
    document.getElementById('tela-admin').style.display = 'none';
    document.getElementById('tela-auth').style.display = 'block';
    document.getElementById('form-login').reset();
}

document.getElementById('btn-sair-user').addEventListener('click', fazerLogout);
document.getElementById('btn-sair-admin').addEventListener('click', fazerLogout);

// 10. Manter sessão ativa ao recarregar a página
async function abrirPainelPorId(userId) {
    const { data: perfil, error } = await supabaseClient
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        alert('Erro ao carregar perfil: ' + error.message);
        return;
    }

    document.getElementById('tela-auth').style.display = 'none';

    if (perfil.role === 'admin') {
        document.getElementById('tela-admin').style.display = 'block';
        carregarUsuariosAdmin();
    } else {
        document.getElementById('user-nome').textContent = perfil.nome;
        document.getElementById('user-idade').textContent = calcularIdade(perfil.data_nascimento);
        document.getElementById('user-genero').textContent = perfil.genero;
        document.getElementById('tela-usuario').style.display = 'block';
    }
}

async function verificarSessaoAtual() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        abrirPainelPorId(session.user.id);
    }
}

verificarSessaoAtual();