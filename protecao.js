// Sistema de proteção com senhas camufladas
// dev: zJ3

class SistemaProtecao {
    constructor() {
        // Senhas camufladas - não usar nomes óbvios
        this.chaveAcesso1 = 'melhorar'; // palavra da primeira camada
        this.chaveAcesso2 = 'experiencia'; // palavra da segunda camada
        
        this.camada1 = document.getElementById('camada1');
        this.camada2 = document.getElementById('camada2');
        this.conteudoReal = document.getElementById('conteudoReal');
        
        this.inicializar();
    }
    
    inicializar() {
        this.configurarCamada1();
        this.configurarCamada2();
        this.criarConteudoReal();
    }
    
    configurarCamada1() {
        // Adicionar conteúdo à primeira camada
        this.camada1.innerHTML = `
            <div class="corner-button top-left" id="corner1-tl"></div>
            <div class="corner-button top-right" id="corner1-tr"></div>
            <div class="corner-button bottom-left" id="corner1-bl"></div>
            <div class="corner-button bottom-right" id="corner1-br"></div>
            <h1>Estamos trabalhando para melhorar sua experiência. Volte em breve.</h1>
            <p class="subtitle">Nossos serviços estarão disponíveis em breve</p>
            <input type="password" class="senha-input" id="senhaInput1" placeholder="Digite o código de acesso..." style="display: none;">
        `;
        
        // Configurar triggers dos cantos
        const senhaInput1 = document.getElementById('senhaInput1');
        
        document.getElementById('corner1-tl').addEventListener('click', () => {
            senhaInput1.style.display = 'block';
            senhaInput1.classList.add('visible');
            senhaInput1.focus();
        });
        document.getElementById('corner1-tr').addEventListener('click', () => {
            senhaInput1.style.display = 'block';
            senhaInput1.classList.add('visible');
            senhaInput1.focus();
        });
        document.getElementById('corner1-bl').addEventListener('click', () => {
            senhaInput1.style.display = 'block';
            senhaInput1.classList.add('visible');
            senhaInput1.focus();
        });
        document.getElementById('corner1-br').addEventListener('click', () => {
            senhaInput1.style.display = 'block';
            senhaInput1.classList.add('visible');
            senhaInput1.focus();
        });
        
        senhaInput1.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verificarSenha1(senhaInput1.value);
            }
        });
    }
    
    configurarCamada2() {
        // Adicionar conteúdo à segunda camada
        this.camada2.innerHTML = `
            <div class="corner-button top-left" id="corner2-tl"></div>
            <div class="corner-button top-right" id="corner2-tr"></div>
            <div class="corner-button bottom-left" id="corner2-bl"></div>
            <div class="corner-button bottom-right" id="corner2-br"></div>
            <h1>Sistema em atualização</h1>
            <p class="subtitle">Aguarde enquanto preparamos uma nova experiência para você</p>
            <input type="password" class="senha-input" id="senhaInput2" placeholder="Código de verificação..." style="display: none;">
        `;
        
        // Configurar triggers dos cantos
        const senhaInput2 = document.getElementById('senhaInput2');
        
        document.getElementById('corner2-tl').addEventListener('click', () => {
            senhaInput2.style.display = 'block';
            senhaInput2.classList.add('visible');
            senhaInput2.focus();
        });
        document.getElementById('corner2-tr').addEventListener('click', () => {
            senhaInput2.style.display = 'block';
            senhaInput2.classList.add('visible');
            senhaInput2.focus();
        });
        document.getElementById('corner2-bl').addEventListener('click', () => {
            senhaInput2.style.display = 'block';
            senhaInput2.classList.add('visible');
            senhaInput2.focus();
        });
        document.getElementById('corner2-br').addEventListener('click', () => {
            senhaInput2.style.display = 'block';
            senhaInput2.classList.add('visible');
            senhaInput2.focus();
        });
        
        senhaInput2.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verificarSenha2(senhaInput2.value);
            }
        });
    }
    
    verificarSenha1(senha) {
        if (senha.toLowerCase() === this.chaveAcesso1) {
            this.camada1.classList.add('fade-out');
            setTimeout(() => {
                this.camada1.style.display = 'none';
            }, 500);
        } else {
            this.mostrarErro('senhaInput1');
        }
    }
    
    verificarSenha2(senha) {
        if (senha.toLowerCase() === this.chaveAcesso2) {
            this.camada2.classList.add('fade-out');
            setTimeout(() => {
                this.camada2.style.display = 'none';
                this.conteudoReal.style.display = 'block';
                this.iniciarFileManager();
            }, 500);
        } else {
            this.mostrarErro('senhaInput2');
        }
    }
    
    mostrarErro(inputId) {
        const input = document.getElementById(inputId);
        input.style.borderColor = '#ef4444';
        input.value = '';
        input.placeholder = 'Código incorreto. Tente novamente...';
        
        setTimeout(() => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            input.placeholder = inputId === 'senhaInput1' ? 'Digite o código de acesso...' : 'Código de verificação...';
        }, 2000);
    }
    
    criarConteudoReal() {
        // Estrutura de pastas baseada nas instruções
        const estruturaPastas = [
            'artsystylecreative', 'balletcore', 'barbiecore', 'bohochic', 'casualcool',
            'cleangirl', 'coquetteromânticomoderno', 'cottagecore', 'cowgirlchicwesternmodern',
            'darkfemininesensualmisteriosa', 'ecofriendly', 'glamrockstyle', 'gothic',
            'gothicchic', 'grungefemininoidie90s', 'indiesleaze', 'maximalistafashion',
            'minimalista', 'outonoinverno', 'preppymodernoestudantilchic', 'punkfeminino',
            'quietluxuryluxodiscreto', 'roupasdebanho', 'scandistyle', 'softgirlkawaii',
            'softgothic', 'softofficesocial casual', 'sportychicathleisure', 'streetwearfeminino',
            'techwear feminino', 'tomboyfeminino', 'y2k'
        ];
        
        this.conteudoReal.innerHTML = `
            <!-- Header -->
            <div class="header">
                <div class="header-content">
                    <div class="header-left">
                        <svg class="header-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
                        <div class="header-title">
                            <svg class="header-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                            </svg>
                            <span id="currentViewTitle">Home</span>
                        </div>
                    </div>
                    <div class="header-right">
                        <svg class="header-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <svg class="header-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                        <svg class="header-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Navegação por abas -->
            <div class="nav-tabs">
                <div class="nav-tabs-content">
                    <button class="nav-tab active" data-view="home">Home</button>
                    <button class="nav-tab" data-view="local">Local</button>
                    <button class="nav-tab" data-view="analytics">Analytics</button>
                </div>
            </div>

            <!-- Container principal -->
            <div class="main-container">
                <!-- Busca -->
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Buscar arquivos e pastas..." id="searchInput">
                </div>

                <!-- Conteúdo das abas -->
                <div id="homeView" class="view-content">
                    <!-- Cards de armazenamento -->
                    <div class="storage-cards">
                        <div class="storage-card">
                            <div class="storage-info">
                                <h3>Armazenamento Interno</h3>
                                <p id="storageUsed">Calculando...</p>
                            </div>
                            <div class="storage-circle">
                                <span id="storagePercent">--</span>
                            </div>
                        </div>
                        <div class="storage-card">
                            <div class="storage-info">
                                <h3>Analisador de Arquivos</h3>
                                <p>Mais arquivos para organizar</p>
                            </div>
                            <div class="storage-circle">📊</div>
                        </div>
                    </div>

                    <!-- Grid de ferramentas -->
                    <div class="tools-section">
                        <div class="tools-grid" id="toolsGrid">
                            <!-- Ferramentas serão geradas dinamicamente -->
                        </div>
                    </div>

                    <!-- Bookmarks -->
                    <div class="bookmarks">
                        <h3>Bookmarks</h3>
                        <div class="bookmark-buttons">
                            <a href="#" class="bookmark-btn">
                                <span>➕</span>
                                <span>Adicionar</span>
                            </a>
                            <a href="#" class="bookmark-btn">
                                <span>⬇️</span>
                                <span>Download</span>
                            </a>
                            <a href="#" class="bookmark-btn">
                                <span>🌐</span>
                                <span>Web Search</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div id="localView" class="view-content hidden">
                    <!-- Barra de caminho -->
                    <div class="path-bar">
                        <span>/</span>
                        <span>&gt;img&gt;</span>
                        <span>categorias</span>
                        <div class="storage-indicator">
                            <div class="storage-dot"></div>
                            <span id="pathStoragePercent">--</span>
                        </div>
                    </div>

                    <!-- Lista de pastas -->
                    <div class="folder-list" id="folderList">
                        <!-- Pastas serão geradas dinamicamente -->
                    </div>
                </div>

                <div id="analyticsView" class="view-content hidden">
                    <div class="analytics-container">
                        <h2>Análise de Uso de Espaço</h2>
                        <canvas id="storageChart" width="400" height="200"></canvas>
                        <div id="storageStats"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    iniciarFileManager() {
        // Inicializar funcionalidades do file manager
        this.configurarNavegacao();
        this.gerarFerramentas();
        this.gerarPastas();
        this.configurarBusca();
        this.calcularEspacoUsado();
        
        // Inicializar gráficos após um pequeno delay
        setTimeout(() => {
            if (window.GraficosAnalise) {
                new window.GraficosAnalise();
            }
            if (window.CalculadorTamanho) {
                const calculador = new window.CalculadorTamanho();
                calculador.calcularTamanhoImagens();
            }
        }, 1000);
    }
    
    configurarNavegacao() {
        const tabs = document.querySelectorAll('.nav-tab');
        const views = document.querySelectorAll('.view-content');
        const title = document.getElementById('currentViewTitle');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remover classe active de todas as abas
                tabs.forEach(t => t.classList.remove('active'));
                views.forEach(v => v.classList.add('hidden'));
                
                // Ativar aba clicada
                tab.classList.add('active');
                const viewId = tab.dataset.view + 'View';
                document.getElementById(viewId).classList.remove('hidden');
                
                // Atualizar título
                title.textContent = tab.textContent;
            });
        });
    }
    
    gerarFerramentas() {
        const tools = [
            { name: 'Imagens', color: '#ef4444', icon: '🖼️' },
            { name: 'Vídeos', color: '#3b82f6', icon: '🎬' },
            { name: 'Música', color: '#8b5cf6', icon: '🎵' },
            { name: 'Documentos', color: '#eab308', icon: '📄' },
            { name: 'Compactados', color: '#06b6d4', icon: '📦' },
            { name: 'Limpeza', color: '#10b981', icon: '🧹' },
            { name: 'Análise', color: '#f97316', icon: '📊' },
            { name: 'Backup', color: '#6b7280', icon: '💾' },
            { name: 'Rede', color: '#3b82f6', icon: '🌐' },
            { name: 'Segurança', color: '#dc2626', icon: '🔒' },
            { name: 'Favoritos', color: '#fbbf24', icon: '⭐' },
            { name: 'Recentes', color: '#84cc16', icon: '🕒' }
        ];
        
        const toolsGrid = document.getElementById('toolsGrid');
        toolsGrid.innerHTML = tools.map(tool => `
            <div class="tool-item" data-tool="${tool.name.toLowerCase()}">
                <div class="tool-icon" style="background: ${tool.color}">
                    ${tool.icon}
                </div>
                <span class="tool-name">${tool.name}</span>
            </div>
        `).join('');
        
        // Adicionar eventos de clique
        toolsGrid.querySelectorAll('.tool-item').forEach(item => {
            item.addEventListener('click', () => {
                const toolName = item.dataset.tool;
                this.abrirFerramenta(toolName);
            });
        });
    }
    
    gerarPastas() {
        const estruturaPastas = [
            'artsystylecreative', 'balletcore', 'barbiecore', 'bohochic', 'casualcool',
            'cleangirl', 'coquetteromânticomoderno', 'cottagecore', 'cowgirlchicwesternmodern',
            'darkfemininesensualmisteriosa', 'ecofriendly', 'glamrockstyle', 'gothic',
            'gothicchic', 'grungefemininoidie90s', 'indiesleaze', 'maximalistafashion',
            'minimalista', 'outonoinverno', 'preppymodernoestudantilchic', 'punkfeminino',
            'quietluxuryluxodiscreto', 'roupasdebanho', 'scandistyle', 'softgirlkawaii',
            'softgothic', 'softofficesocial casual', 'sportychicathleisure', 'streetwearfeminino',
            'techwear feminino', 'tomboyfeminino', 'y2k'
        ];
        
        const folderList = document.getElementById('folderList');
        folderList.innerHTML = estruturaPastas.map((pasta, index) => {
            const itemCount = Math.floor(Math.random() * 50) + 1;
            const lastModified = this.gerarDataAleatoria();
            
            return `
                <div class="folder-item" data-folder="${pasta}">
                    <div class="folder-icon">📁</div>
                    <div class="folder-info">
                        <div class="folder-name">${pasta}</div>
                        <div class="folder-details">
                            <span>${itemCount} itens</span>
                            <span>pasta</span>
                        </div>
                    </div>
                    <div class="folder-date">${lastModified}</div>
                </div>
            `;
        }).join('');
        
        // Adicionar eventos de clique
        folderList.querySelectorAll('.folder-item').forEach(item => {
            item.addEventListener('click', () => {
                const folderName = item.dataset.folder;
                this.abrirPasta(folderName);
            });
        });
    }
    
    configurarBusca() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const folderItems = document.querySelectorAll('.folder-item');
            
            folderItems.forEach(item => {
                const folderName = item.dataset.folder.toLowerCase();
                if (folderName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    abrirFerramenta(toolName) {
        console.log(`Abrir ferramenta: ${toolName}`);
        // Implementar lógica para abrir a ferramenta
    }
    
    abrirPasta(folderName) {
        console.log(`Abrir pasta: ${folderName}`);
        // Implementar lógica para abrir a pasta
    }
    
    calcularEspacoUsado() {
        const totalSpace = 256; // GB
        const usedSpace = Math.floor(Math.random() * totalSpace);
        const percentUsed = ((usedSpace / totalSpace) * 100).toFixed(2);
        
        document.getElementById('storageUsed').textContent = `${usedSpace}GB de ${totalSpace}GB usados`;
        document.getElementById('storagePercent').textContent = `${percentUsed}%`;
        document.getElementById('pathStoragePercent').textContent = `${percentUsed}%`;
    }
    
    gerarDataAleatoria() {
        const start = new Date(2023, 0, 1);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        
        const day = String(randomDate.getDate()).padStart(2, '0');
        const month = String(randomDate.getMonth() + 1).padStart(2, '0'); // Meses são de 0 a 11
        const year = randomDate.getFullYear();
        
        return `${day}/${month}/${year}`;
    }
}

// Inicializar o sistema de proteção quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    new SistemaProtecao();
});


