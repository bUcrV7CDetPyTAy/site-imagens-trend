// Sistema de File Manager para GitHub Pages
// dev: zJ3

class FileManagerSystem {
    constructor() {
        this.inicializar();
    }
    
    inicializar() {
        // Aguardar o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.iniciarFileManager());
        } else {
            this.iniciarFileManager();
        }
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
                const targetView = document.getElementById(viewId);
                if (targetView) {
                    targetView.classList.remove('hidden');
                }
                
                // Atualizar título
                if (title) {
                    title.textContent = tab.textContent;
                }
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
        if (!toolsGrid) return;
        
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
        if (!folderList) return;
        
        folderList.innerHTML = estruturaPastas.map((pasta, index) => {
            const arquivos = Math.floor(Math.random() * 50) + 5;
            const tamanho = (Math.random() * 100 + 10).toFixed(1);
            const data = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            
            return `
                <div class="folder-item" data-folder="${pasta}">
                    <div class="folder-icon">📁</div>
                    <div class="folder-info">
                        <div class="folder-name">${pasta}</div>
                        <div class="folder-details">
                            <span>${arquivos} arquivos</span>
                            <span>${tamanho} MB</span>
                        </div>
                    </div>
                    <div class="folder-date">${data.toLocaleDateString('pt-BR')}</div>
                </div>
            `;
        }).join('');
        
        // Adicionar eventos de clique nas pastas
        folderList.querySelectorAll('.folder-item').forEach(item => {
            item.addEventListener('click', () => {
                const folderName = item.dataset.folder;
                this.abrirPasta(folderName);
            });
        });
    }
    
    configurarBusca() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            this.filtrarConteudo(e.target.value);
        });
    }
    
    calcularEspacoUsado() {
        // Simular cálculo de espaço usado
        const storageUsed = document.getElementById('storageUsed');
        const storagePercent = document.getElementById('storagePercent');
        const pathStoragePercent = document.getElementById('pathStoragePercent');
        
        const espacoUsado = (Math.random() * 50 + 10).toFixed(1);
        const percentual = Math.floor(Math.random() * 80 + 10);
        
        if (storageUsed) {
            storageUsed.textContent = `${espacoUsado} GB usados de 100 GB`;
        }
        
        if (storagePercent) {
            storagePercent.textContent = `${percentual}%`;
        }
        
        if (pathStoragePercent) {
            pathStoragePercent.textContent = `${percentual}%`;
        }
    }
    
    abrirFerramenta(toolName) {
        // Simular abertura de ferramenta
        alert(`Abrindo ferramenta: ${toolName}`);
        
        // Aqui você pode implementar funcionalidades específicas para cada ferramenta
        switch(toolName) {
            case 'imagens':
                this.mostrarImagens();
                break;
            case 'análise':
                this.mostrarAnalytics();
                break;
            default:
                console.log(`Ferramenta ${toolName} em desenvolvimento`);
        }
    }
    
    abrirPasta(folderName) {
        // Simular abertura de pasta
        alert(`Abrindo pasta: ${folderName}`);
        
        // Aqui você pode implementar a navegação dentro das pastas
        console.log(`Navegando para pasta: ${folderName}`);
    }
    
    mostrarImagens() {
        // Mudar para a aba Local para mostrar as pastas de imagens
        const localTab = document.querySelector('[data-view="local"]');
        if (localTab) {
            localTab.click();
        }
    }
    
    mostrarAnalytics() {
        // Mudar para a aba Analytics
        const analyticsTab = document.querySelector('[data-view="analytics"]');
        if (analyticsTab) {
            analyticsTab.click();
        }
    }
    
    filtrarConteudo(termo) {
        const folderItems = document.querySelectorAll('.folder-item');
        const toolItems = document.querySelectorAll('.tool-item');
        
        const termoBusca = termo.toLowerCase();
        
        // Filtrar pastas
        folderItems.forEach(item => {
            const folderName = item.querySelector('.folder-name').textContent.toLowerCase();
            if (folderName.includes(termoBusca)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Filtrar ferramentas
        toolItems.forEach(item => {
            const toolName = item.querySelector('.tool-name').textContent.toLowerCase();
            if (toolName.includes(termoBusca)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Inicializar o sistema quando a página carregar
new FileManagerSystem();

