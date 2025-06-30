// Sistema de File Manager integrado com GitHub
// dev: zJ3

class GitHubFileManager {
    constructor() {
        this.repoOwner = 'bUcrV7CDetPyTAy';
        this.repoName = 'site-imagens-trend';
        this.apiBase = 'https://api.github.com';
        this.rawBase = 'https://raw.githubusercontent.com';
        this.cache = new Map();
        this.imageCache = new Map();
        this.folderSizes = new Map();
        this.inicializar();
    }
    
    inicializar() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.iniciarFileManager());
        } else {
            this.iniciarFileManager();
        }
    }
    
    async iniciarFileManager() {
        console.log('Iniciando File Manager integrado com GitHub...');
        
        // Configurar navegação
        this.configurarNavegacao();
        
        // Configurar bookmarks
        this.configurarBookmarks();
        
        // Buscar dados do repositório
        await this.carregarDadosRepositorio();
        
        // Configurar busca
        this.configurarBusca();
        
        // Inicializar gráficos
        setTimeout(() => {
            if (window.GraficosAnaliseReal) {
                const graficos = new window.GraficosAnaliseReal(this);
                
                // Atualizar gráficos quando os dados estiverem prontos
                setTimeout(() => {
                    graficos.atualizarDados(this);
                }, 5000);
            }
            
            if (window.CalculadorTamanhoReal) {
                const calculador = new window.CalculadorTamanhoReal(this);
                
                // Iniciar cálculo após os dados básicos estarem carregados
                setTimeout(() => {
                    calculador.calcularTamanhoImagens();
                }, 3000);
            }
        }, 2000);
    }
    
    async carregarDadosRepositorio() {
        try {
            console.log('Carregando dados do repositório...');
            
            // Buscar estrutura de pastas dentro da pasta img
            const contents = await this.fetchGitHubAPI(`/repos/${this.repoOwner}/${this.repoName}/contents/img`);
            
            if (contents) {
                const folders = contents.filter(item => item.type === 'dir');
                console.log(`Encontradas ${folders.length} pastas de imagens:`, folders.map(f => f.name));
                await this.processarPastas(folders);
                this.gerarFerramentas();
                this.atualizarEstatisticas();
            }
            
        } catch (error) {
            console.error('Erro ao carregar dados do repositório:', error);
            this.mostrarErro('Erro ao carregar dados do repositório');
        }
    }
    
    async fetchGitHubAPI(endpoint) {
        const url = `${this.apiBase}${endpoint}`;
        
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.cache.set(url, data);
            return data;
            
        } catch (error) {
            console.error(`Erro ao buscar ${url}:`, error);
            return null;
        }
    }
    
    async processarPastas(folders) {
        console.log(`Processando ${folders.length} pastas...`);
        
        const folderList = document.getElementById('folderList');
        if (!folderList) return;
        
        folderList.innerHTML = '<div class="loading">Carregando pastas...</div>';
        
        const folderPromises = folders.map(async (folder) => {
            const folderData = await this.analisarPasta(folder.name);
            return {
                name: folder.name,
                ...folderData
            };
        });
        
        const processedFolders = await Promise.all(folderPromises);
        this.renderizarPastas(processedFolders);
    }
    
    async analisarPasta(folderName) {
        try {
            const contents = await this.fetchGitHubAPI(`/repos/${this.repoOwner}/${this.repoName}/contents/img/${folderName}`);
            
            if (!contents) {
                return { arquivos: 0, tamanho: 0, data: new Date() };
            }
            
            const images = contents.filter(item => 
                item.type === 'file' && 
                /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.name)
            );
            
            console.log(`Pasta ${folderName}: ${images.length} imagens encontradas`);
            
            // Calcular tamanho total das imagens
            let tamanhoTotal = 0;
            const imagePromises = images.slice(0, 10).map(async (image) => {
                const size = await this.obterTamanhoImagem(image.download_url);
                return size;
            });
            
            const sizes = await Promise.all(imagePromises);
            tamanhoTotal = sizes.reduce((sum, size) => sum + size, 0);
            
            // Estimar tamanho total baseado na amostra
            if (images.length > 10) {
                const avgSize = tamanhoTotal / 10;
                tamanhoTotal = avgSize * images.length;
            }
            
            this.folderSizes.set(folderName, {
                arquivos: images.length,
                tamanho: tamanhoTotal,
                images: images
            });
            
            return {
                arquivos: images.length,
                tamanho: tamanhoTotal,
                data: new Date()
            };
            
        } catch (error) {
            console.error(`Erro ao analisar pasta ${folderName}:`, error);
            return { arquivos: 0, tamanho: 0, data: new Date() };
        }
    }
    
    async obterTamanhoImagem(imageUrl) {
        if (this.imageCache.has(imageUrl)) {
            return this.imageCache.get(imageUrl);
        }
        
        try {
            const response = await fetch(imageUrl, { method: 'HEAD' });
            const contentLength = response.headers.get('content-length');
            const size = contentLength ? parseInt(contentLength) : 0;
            
            this.imageCache.set(imageUrl, size);
            return size;
            
        } catch (error) {
            console.error(`Erro ao obter tamanho da imagem ${imageUrl}:`, error);
            return 0;
        }
    }
    
    renderizarPastas(folders) {
        const folderList = document.getElementById('folderList');
        if (!folderList) return;
        
        folderList.innerHTML = folders.map(folder => {
            const tamanhoMB = (folder.tamanho / (1024 * 1024)).toFixed(1);
            
            return `
                <div class="folder-item" data-folder="${folder.name}">
                    <div class="folder-icon">📁</div>
                    <div class="folder-info">
                        <div class="folder-name">${folder.name}</div>
                        <div class="folder-details">
                            <span>${folder.arquivos} imagens</span>
                            <span>${tamanhoMB} MB</span>
                        </div>
                    </div>
                    <div class="folder-date">${folder.data.toLocaleDateString('pt-BR')}</div>
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
    
    configurarBookmarks() {
        const addBookmark = document.getElementById('addBookmark');
        const downloadBookmark = document.getElementById('downloadBookmark');
        const webSearchBookmark = document.getElementById('webSearchBookmark');
        
        if (addBookmark) {
            addBookmark.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarModalAdicionar();
            });
        }
        
        if (downloadBookmark) {
            downloadBookmark.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarModalDownload();
            });
        }
        
        if (webSearchBookmark) {
            webSearchBookmark.addEventListener('click', (e) => {
                e.preventDefault();
                this.abrirWebSearch();
            });
        }
    }
    
    mostrarModalAdicionar() {
        this.mostrarModalFuncionalidade('Adicionar Arquivo', '➕', `
            <div class="feature-content">
                <h4>Upload de Arquivos</h4>
                <p>Adicione novos arquivos ao repositório.</p>
                <div class="upload-area">
                    <div class="upload-zone" id="uploadZone">
                        <div class="upload-icon">📁</div>
                        <p>Arraste arquivos aqui ou clique para selecionar</p>
                        <input type="file" id="fileInput" multiple style="display: none;">
                    </div>
                </div>
                <div class="upload-options">
                    <label>
                        <input type="checkbox" id="createFolder"> Criar nova pasta
                    </label>
                    <input type="text" id="folderName" placeholder="Nome da pasta" style="display: none;">
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="document.getElementById('fileInput').click()">Selecionar Arquivos</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Criar Pasta</button>
                </div>
            </div>
        `);
        
        // Configurar eventos de upload
        setTimeout(() => {
            this.configurarUpload();
        }, 100);
    }
    
    configurarUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const createFolder = document.getElementById('createFolder');
        const folderName = document.getElementById('folderName');
        
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => {
                fileInput.click();
            });
            
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('drag-over');
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('drag-over');
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                this.processarArquivos(files);
            });
            
            fileInput.addEventListener('change', (e) => {
                this.processarArquivos(e.target.files);
            });
        }
        
        if (createFolder && folderName) {
            createFolder.addEventListener('change', () => {
                folderName.style.display = createFolder.checked ? 'block' : 'none';
            });
        }
    }
    
    processarArquivos(files) {
        console.log(`Processando ${files.length} arquivo(s)`);
        
        Array.from(files).forEach(file => {
            console.log(`Arquivo: ${file.name}, Tamanho: ${file.size} bytes`);
        });
        
        alert(`${files.length} arquivo(s) selecionado(s). Funcionalidade de upload em desenvolvimento.`);
    }
    
    mostrarModalDownload() {
        this.mostrarModalFuncionalidade('Central de Downloads', '⬇️', `
            <div class="feature-content">
                <h4>Gerenciador de Downloads</h4>
                <p>Baixe arquivos e pastas do repositório.</p>
                <div class="download-options">
                    <div class="download-option">
                        <h5>📁 Baixar Pasta Completa</h5>
                        <select id="folderSelect">
                            <option value="">Selecione uma pasta...</option>
                        </select>
                        <button class="feature-btn" onclick="window.githubManager.baixarPastaSelecionada()">Baixar Pasta</button>
                    </div>
                    <div class="download-option">
                        <h5>🗜️ Baixar como ZIP</h5>
                        <p>Baixe todo o repositório compactado</p>
                        <button class="feature-btn" onclick="window.githubManager.baixarRepositorioCompleto()">Baixar Repositório</button>
                    </div>
                    <div class="download-option">
                        <h5>📊 Relatório de Arquivos</h5>
                        <p>Gere um relatório detalhado dos arquivos</p>
                        <button class="feature-btn" onclick="window.githubManager.gerarRelatorio()">Gerar Relatório</button>
                    </div>
                </div>
            </div>
        `);
        
        // Preencher lista de pastas
        setTimeout(() => {
            this.preencherListaPastas();
        }, 100);
    }
    
    preencherListaPastas() {
        const folderSelect = document.getElementById('folderSelect');
        if (!folderSelect) return;
        
        for (const [folderName] of this.folderSizes) {
            const option = document.createElement('option');
            option.value = folderName;
            option.textContent = folderName;
            folderSelect.appendChild(option);
        }
    }
    
    baixarPastaSelecionada() {
        const folderSelect = document.getElementById('folderSelect');
        if (!folderSelect || !folderSelect.value) {
            alert('Selecione uma pasta para baixar');
            return;
        }
        
        const folderName = folderSelect.value;
        const folderData = this.folderSizes.get(folderName);
        
        if (folderData) {
            this.baixarTodasImagens(folderName, folderData);
        }
    }
    
    baixarRepositorioCompleto() {
        const repoUrl = `https://github.com/${this.repoOwner}/${this.repoName}/archive/refs/heads/main.zip`;
        window.open(repoUrl, '_blank');
    }
    
    gerarRelatorio() {
        let relatorio = 'RELATÓRIO DE ARQUIVOS\\n';
        relatorio += '===================\\n\\n';
        
        let totalFiles = 0;
        let totalSize = 0;
        
        for (const [folderName, data] of this.folderSizes) {
            relatorio += `📁 ${folderName}\\n`;
            relatorio += `   Arquivos: ${data.arquivos}\\n`;
            relatorio += `   Tamanho: ${(data.tamanho / (1024 * 1024)).toFixed(2)} MB\\n\\n`;
            
            totalFiles += data.arquivos;
            totalSize += data.tamanho;
        }
        
        relatorio += '===================\\n';
        relatorio += `Total de Arquivos: ${totalFiles}\\n`;
        relatorio += `Tamanho Total: ${(totalSize / (1024 * 1024)).toFixed(2)} MB\\n`;
        relatorio += `Data do Relatório: ${new Date().toLocaleString('pt-BR')}\\n`;
        
        // Criar e baixar arquivo de relatório
        const blob = new Blob([relatorio], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'relatorio_arquivos.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }
    
    abrirWebSearch() {
        this.mostrarModalFuncionalidade('Busca na Web', '🌐', `
            <div class="feature-content">
                <h4>Pesquisa Avançada</h4>
                <p>Busque por imagens e conteúdo relacionado na web.</p>
                <div class="search-options">
                    <div class="search-option">
                        <h5>🔍 Buscar Imagens Similares</h5>
                        <input type="text" id="imageSearch" placeholder="Digite o termo de busca...">
                        <button class="feature-btn" onclick="window.githubManager.buscarImagensWeb()">Buscar</button>
                    </div>
                    <div class="search-option">
                        <h5>🎨 Buscar por Estilo</h5>
                        <select id="styleSearch">
                            <option value="">Selecione um estilo...</option>
                            <option value="minimalist">Minimalista</option>
                            <option value="vintage">Vintage</option>
                            <option value="modern">Moderno</option>
                            <option value="artistic">Artístico</option>
                        </select>
                        <button class="feature-btn" onclick="window.githubManager.buscarPorEstilo()">Buscar Estilo</button>
                    </div>
                    <div class="search-option">
                        <h5>📊 Tendências</h5>
                        <p>Veja as tendências atuais em design</p>
                        <button class="feature-btn" onclick="window.githubManager.mostrarTendencias()">Ver Tendências</button>
                    </div>
                </div>
            </div>
        `);
    }
    
    buscarImagensWeb() {
        const searchInput = document.getElementById('imageSearch');
        if (!searchInput || !searchInput.value) {
            alert('Digite um termo de busca');
            return;
        }
        
        const termo = searchInput.value;
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(termo)}&tbm=isch`;
        window.open(searchUrl, '_blank');
    }
    
    buscarPorEstilo() {
        const styleSelect = document.getElementById('styleSearch');
        if (!styleSelect || !styleSelect.value) {
            alert('Selecione um estilo');
            return;
        }
        
        const estilo = styleSelect.value;
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(estilo + ' design style')}&tbm=isch`;
        window.open(searchUrl, '_blank');
    }
    
    mostrarTendencias() {
        const trendsUrl = 'https://trends.google.com/trends/explore?cat=13';
        window.open(trendsUrl, '_blank');
    }
    
    gerarFerramentas() {
        const tools = [
            { name: 'Imagens', color: '#ef4444', icon: '🖼️', action: 'mostrarImagens' },
            { name: 'Vídeos', color: '#f97316', icon: '🎬', action: 'mostrarVideos' },
            { name: 'Música', color: '#8b5cf6', icon: '🎵', action: 'mostrarMusica' },
            { name: 'Documentos', color: '#fbbf24', icon: '📄', action: 'mostrarDocumentos' },
            { name: 'Compactados', color: '#06b6d4', icon: '🗜️', action: 'mostrarCompactados' },
            { name: 'Limpeza', color: '#10b981', icon: '🧹', action: 'executarLimpeza' },
            { name: 'Análise', color: '#f97316', icon: '📊', action: 'mostrarAnalytics' },
            { name: 'Backup', color: '#6b7280', icon: '💾', action: 'criarBackup' },
            { name: 'Rede', color: '#3b82f6', icon: '🌐', action: 'configurarRede' },
            { name: 'Segurança', color: '#dc2626', icon: '🔒', action: 'verificarSeguranca' },
            { name: 'Favoritos', color: '#fbbf24', icon: '⭐', action: 'gerenciarFavoritos' },
            { name: 'Recentes', color: '#84cc16', icon: '🕒', action: 'mostrarRecentes' }
        ];
        
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;
        
        toolsGrid.innerHTML = tools.map(tool => `
            <div class="tool-item" data-tool="${tool.action}">
                <div class="tool-icon" style="background: ${tool.color}">
                    ${tool.icon}
                </div>
                <span class="tool-name">${tool.name}</span>
            </div>
        `).join('');
        
        toolsGrid.querySelectorAll('.tool-item').forEach(item => {
            item.addEventListener('click', () => {
                const toolAction = item.dataset.tool;
                this.executarAcaoFerramenta(toolAction);
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
    
    atualizarEstatisticas() {
        const storageUsed = document.getElementById('storageUsed');
        const storagePercent = document.getElementById('storagePercent');
        const pathStoragePercent = document.getElementById('pathStoragePercent');
        
        // Calcular estatísticas reais
        let totalSize = 0;
        let totalFiles = 0;
        
        for (const [folder, data] of this.folderSizes) {
            totalSize += data.tamanho;
            totalFiles += data.arquivos;
        }
        
        const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
        const percentual = Math.min(Math.floor((totalSize / (100 * 1024 * 1024)) * 100), 100);
        
        if (storageUsed) {
            storageUsed.textContent = `${totalSizeGB} GB calculados (${totalFiles} imagens)`;
        }
        
        if (storagePercent) {
            storagePercent.textContent = `${percentual}%`;
        }
        
        if (pathStoragePercent) {
            pathStoragePercent.textContent = `${percentual}%`;
        }
    }
    
    async executarAcaoFerramenta(action) {
        console.log(`Executando ação: ${action}`);
        
        switch(action) {
            case 'mostrarImagens':
                this.mostrarImagens();
                break;
            case 'mostrarVideos':
                this.mostrarVideos();
                break;
            case 'mostrarMusica':
                this.mostrarMusica();
                break;
            case 'mostrarDocumentos':
                this.mostrarDocumentos();
                break;
            case 'mostrarCompactados':
                this.mostrarCompactados();
                break;
            case 'executarLimpeza':
                this.executarLimpeza();
                break;
            case 'mostrarAnalytics':
                this.mostrarAnalytics();
                break;
            case 'criarBackup':
                this.criarBackup();
                break;
            case 'configurarRede':
                this.configurarRede();
                break;
            case 'verificarSeguranca':
                this.verificarSeguranca();
                break;
            case 'gerenciarFavoritos':
                this.gerenciarFavoritos();
                break;
            case 'mostrarRecentes':
                this.mostrarRecentes();
                break;
            default:
                console.log(`Ação ${action} não implementada`);
        }
    }
    
    mostrarVideos() {
        this.mostrarModalFuncionalidade('Vídeos', '🎬', `
            <div class="feature-content">
                <h4>Gerenciador de Vídeos</h4>
                <p>Esta funcionalidade permite organizar e reproduzir vídeos do repositório.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>0</strong>
                        <span>Vídeos encontrados</span>
                    </div>
                    <div class="stat-item">
                        <strong>0 MB</strong>
                        <span>Espaço usado</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Buscar Vídeos</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Reproduzir Playlist</button>
                </div>
            </div>
        `);
    }
    
    mostrarMusica() {
        this.mostrarModalFuncionalidade('Música', '🎵', `
            <div class="feature-content">
                <h4>Player de Música</h4>
                <p>Organize e reproduza suas músicas favoritas.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>0</strong>
                        <span>Músicas</span>
                    </div>
                    <div class="stat-item">
                        <strong>0</strong>
                        <span>Playlists</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Criar Playlist</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Modo Aleatório</button>
                </div>
            </div>
        `);
    }
    
    mostrarDocumentos() {
        this.mostrarModalFuncionalidade('Documentos', '📄', `
            <div class="feature-content">
                <h4>Gerenciador de Documentos</h4>
                <p>Organize documentos PDF, Word, Excel e outros formatos.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>0</strong>
                        <span>Documentos</span>
                    </div>
                    <div class="stat-item">
                        <strong>0 MB</strong>
                        <span>Tamanho total</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Buscar Documentos</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Converter PDF</button>
                </div>
            </div>
        `);
    }
    
    mostrarCompactados() {
        this.mostrarModalFuncionalidade('Arquivos Compactados', '🗜️', `
            <div class="feature-content">
                <h4>Gerenciador de Arquivos Compactados</h4>
                <p>Extraia e crie arquivos ZIP, RAR e outros formatos.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>0</strong>
                        <span>Arquivos ZIP</span>
                    </div>
                    <div class="stat-item">
                        <strong>0%</strong>
                        <span>Compressão média</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Criar ZIP</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Extrair Arquivos</button>
                </div>
            </div>
        `);
    }
    
    executarLimpeza() {
        this.mostrarModalFuncionalidade('Limpeza do Sistema', '🧹', `
            <div class="feature-content">
                <h4>Otimização e Limpeza</h4>
                <p>Limpe arquivos temporários e otimize o desempenho.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>${this.cache.size}</strong>
                        <span>Itens em cache</span>
                    </div>
                    <div class="stat-item">
                        <strong>${this.imageCache.size}</strong>
                        <span>Imagens em cache</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="window.githubManager.limparCache(); alert('Cache limpo com sucesso!')">Limpar Cache</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Otimizar Sistema</button>
                </div>
            </div>
        `);
    }
    
    criarBackup() {
        this.mostrarModalFuncionalidade('Backup e Restauração', '💾', `
            <div class="feature-content">
                <h4>Sistema de Backup</h4>
                <p>Crie backups dos seus dados importantes.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>0</strong>
                        <span>Backups criados</span>
                    </div>
                    <div class="stat-item">
                        <strong>Nunca</strong>
                        <span>Último backup</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Criar Backup</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Restaurar Dados</button>
                </div>
            </div>
        `);
    }
    
    configurarRede() {
        this.mostrarModalFuncionalidade('Configurações de Rede', '🌐', `
            <div class="feature-content">
                <h4>Conectividade e Rede</h4>
                <p>Configure conexões e monitore o tráfego de rede.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>Online</strong>
                        <span>Status da conexão</span>
                    </div>
                    <div class="stat-item">
                        <strong>${navigator.onLine ? 'Conectado' : 'Desconectado'}</strong>
                        <span>Estado atual</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Testar Velocidade</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Configurar Proxy</button>
                </div>
            </div>
        `);
    }
    
    verificarSeguranca() {
        this.mostrarModalFuncionalidade('Segurança do Sistema', '🔒', `
            <div class="feature-content">
                <h4>Verificação de Segurança</h4>
                <p>Monitore a segurança e integridade dos dados.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>Seguro</strong>
                        <span>Status geral</span>
                    </div>
                    <div class="stat-item">
                        <strong>0</strong>
                        <span>Ameaças detectadas</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Verificar Sistema</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Configurar Firewall</button>
                </div>
            </div>
        `);
    }
    
    gerenciarFavoritos() {
        this.mostrarModalFuncionalidade('Favoritos', '⭐', `
            <div class="feature-content">
                <h4>Gerenciador de Favoritos</h4>
                <p>Organize seus arquivos e pastas favoritos.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>0</strong>
                        <span>Itens favoritos</span>
                    </div>
                    <div class="stat-item">
                        <strong>0</strong>
                        <span>Coleções</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Adicionar Favorito</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Criar Coleção</button>
                </div>
            </div>
        `);
    }
    
    mostrarRecentes() {
        this.mostrarModalFuncionalidade('Arquivos Recentes', '🕒', `
            <div class="feature-content">
                <h4>Histórico de Arquivos</h4>
                <p>Acesse rapidamente os arquivos utilizados recentemente.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>0</strong>
                        <span>Arquivos recentes</span>
                    </div>
                    <div class="stat-item">
                        <strong>Hoje</strong>
                        <span>Última atividade</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Ver Histórico</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Limpar Histórico</button>
                </div>
            </div>
        `);
    }
    
    mostrarModalFuncionalidade(titulo, icone, conteudo) {
        const modal = document.createElement('div');
        modal.className = 'feature-modal';
        modal.innerHTML = `
            <div class="feature-modal-content">
                <div class="feature-modal-header">
                    <h3>${icone} ${titulo}</h3>
                    <button class="feature-modal-close">&times;</button>
                </div>
                <div class="feature-modal-body">
                    ${conteudo}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Configurar eventos
        modal.querySelector('.feature-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    async abrirPasta(folderName) {
        console.log(`Abrindo pasta: ${folderName}`);
        
        const folderData = this.folderSizes.get(folderName);
        if (!folderData) {
            console.error(`Dados da pasta ${folderName} não encontrados`);
            return;
        }
        
        // Mostrar visualizador de pasta completo
        this.mostrarVisualizadorPasta(folderName, folderData);
    }
    
    mostrarVisualizadorPasta(folderName, folderData) {
        const modal = document.createElement('div');
        modal.className = 'folder-viewer-modal';
        modal.innerHTML = `
            <div class="viewer-content">
                <div class="viewer-header">
                    <div class="viewer-title">
                        <button class="back-btn" title="Voltar">←</button>
                        <h3>📁 ${folderName}</h3>
                        <div class="viewer-actions">
                            <button class="action-btn download-all" title="Baixar todas as imagens">⬇️</button>
                            <button class="action-btn refresh-folder" title="Atualizar pasta">🔄</button>
                            <button class="action-btn folder-info" title="Informações da pasta">ℹ️</button>
                        </div>
                    </div>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="viewer-toolbar">
                    <div class="view-controls">
                        <button class="view-btn active" data-view="grid" title="Visualização em grade">⊞</button>
                        <button class="view-btn" data-view="list" title="Visualização em lista">☰</button>
                        <button class="view-btn" data-view="slideshow" title="Apresentação de slides">🎞️</button>
                    </div>
                    <div class="folder-stats-mini">
                        <span>${folderData.arquivos} imagens</span>
                        <span>${(folderData.tamanho / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>
                    <div class="search-mini">
                        <input type="text" placeholder="Buscar imagens..." id="imageSearch">
                    </div>
                </div>
                <div class="viewer-body">
                    <div class="image-grid" id="imageGrid">
                        <div class="loading-images">Carregando imagens...</div>
                    </div>
                </div>
                <div class="viewer-footer">
                    <div class="selection-info">
                        <span id="selectionCount">0 selecionadas</span>
                        <button class="bulk-action" id="bulkDownload" disabled>Baixar selecionadas</button>
                        <button class="bulk-action" id="bulkDelete" disabled>Remover selecionadas</button>
                    </div>
                    <div class="pagination" id="imagePagination">
                        <!-- Paginação será gerada dinamicamente -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Configurar eventos
        this.configurarVisualizadorEventos(modal, folderName, folderData);
        
        // Carregar imagens
        this.carregarImagensVisualizador(folderName, folderData);
    }
    
    configurarVisualizadorEventos(modal, folderName, folderData) {
        // Fechar modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.back-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Controles de visualização
        modal.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.alterarVisualizacao(btn.dataset.view, modal);
            });
        });
        
        // Ações da pasta
        modal.querySelector('.download-all').addEventListener('click', () => {
            this.baixarTodasImagens(folderName, folderData);
        });
        
        modal.querySelector('.refresh-folder').addEventListener('click', () => {
            this.atualizarPasta(folderName, modal);
        });
        
        modal.querySelector('.folder-info').addEventListener('click', () => {
            this.mostrarInfoPasta(folderName, folderData);
        });
        
        // Busca de imagens
        const searchInput = modal.querySelector('#imageSearch');
        searchInput.addEventListener('input', (e) => {
            this.filtrarImagens(e.target.value, modal);
        });
        
        // Ações em lote
        modal.querySelector('#bulkDownload').addEventListener('click', () => {
            this.baixarImagensSelecionadas(modal);
        });
        
        modal.querySelector('#bulkDelete').addEventListener('click', () => {
            this.removerImagensSelecionadas(modal);
        });
    }
    
    async carregarImagensVisualizador(folderName, folderData) {
        const imageGrid = document.getElementById('imageGrid');
        if (!imageGrid || !folderData.images) return;
        
        const imagesPerPage = 24;
        const totalPages = Math.ceil(folderData.images.length / imagesPerPage);
        let currentPage = 1;
        
        this.renderizarImagens(folderData.images, imageGrid, currentPage, imagesPerPage);
        this.criarPaginacao(totalPages, currentPage, folderData.images, imageGrid, imagesPerPage);
    }
    
    renderizarImagens(images, container, page, perPage) {
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const imagesToShow = images.slice(startIndex, endIndex);
        
        container.innerHTML = imagesToShow.map((image, index) => `
            <div class="image-card" data-image-index="${startIndex + index}">
                <div class="image-container">
                    <img src="${image.download_url}" alt="${image.name}" loading="lazy">
                    <div class="image-overlay">
                        <button class="image-action view-full" title="Visualizar em tela cheia">🔍</button>
                        <button class="image-action download-single" title="Baixar imagem">⬇️</button>
                        <button class="image-action image-info" title="Informações da imagem">ℹ️</button>
                    </div>
                    <div class="image-checkbox">
                        <input type="checkbox" class="image-select" data-image-url="${image.download_url}" data-image-name="${image.name}">
                    </div>
                </div>
                <div class="image-details">
                    <div class="image-name" title="${image.name}">${image.name}</div>
                    <div class="image-size">Carregando...</div>
                </div>
            </div>
        `).join('');
        
        // Configurar eventos das imagens
        this.configurarEventosImagens(container);
        
        // Carregar tamanhos das imagens
        this.carregarTamanhosImagens(imagesToShow, container);
    }
    
    configurarEventosImagens(container) {
        // Seleção de imagens
        container.querySelectorAll('.image-select').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.atualizarSelecao();
            });
        });
        
        // Ações das imagens
        container.querySelectorAll('.view-full').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const imageCard = btn.closest('.image-card');
                const imageIndex = parseInt(imageCard.dataset.imageIndex);
                this.abrirVisualizadorCompleto(imageIndex);
            });
        });
        
        container.querySelectorAll('.download-single').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const checkbox = btn.closest('.image-card').querySelector('.image-select');
                this.baixarImagemUnica(checkbox.dataset.imageUrl, checkbox.dataset.imageName);
            });
        });
        
        container.querySelectorAll('.image-info').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const checkbox = btn.closest('.image-card').querySelector('.image-select');
                this.mostrarInfoImagem(checkbox.dataset.imageUrl, checkbox.dataset.imageName);
            });
        });
        
        // Clique duplo para visualizar
        container.querySelectorAll('.image-card').forEach(card => {
            card.addEventListener('dblclick', () => {
                const imageIndex = parseInt(card.dataset.imageIndex);
                this.abrirVisualizadorCompleto(imageIndex);
            });
        });
    }
    
    async carregarTamanhosImagens(images, container) {
        const imageCards = container.querySelectorAll('.image-card');
        
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const card = imageCards[i];
            const sizeElement = card.querySelector('.image-size');
            
            try {
                const size = await this.obterTamanhoImagem(image.download_url);
                const sizeKB = (size / 1024).toFixed(1);
                sizeElement.textContent = `${sizeKB} KB`;
            } catch (error) {
                sizeElement.textContent = 'Tamanho desconhecido';
            }
        }
    }
    
    criarPaginacao(totalPages, currentPage, allImages, container, imagesPerPage) {
        const pagination = document.getElementById('imagePagination');
        if (!pagination || totalPages <= 1) return;
        
        let paginationHTML = '';
        
        // Botão anterior
        if (currentPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="${currentPage - 1}">←</button>`;
        }
        
        // Números das páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationHTML += `<button class="page-btn active" data-page="${i}">${i}</button>`;
            } else if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
                paginationHTML += `<button class="page-btn" data-page="${i}">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                paginationHTML += `<span class="page-ellipsis">...</span>`;
            }
        }
        
        // Botão próximo
        if (currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" data-page="${currentPage + 1}">→</button>`;
        }
        
        pagination.innerHTML = paginationHTML;
        
        // Configurar eventos da paginação
        pagination.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newPage = parseInt(btn.dataset.page);
                this.renderizarImagens(allImages, container, newPage, imagesPerPage);
                this.criarPaginacao(totalPages, newPage, allImages, container, imagesPerPage);
            });
        });
    }
    
    atualizarSelecao() {
        const checkboxes = document.querySelectorAll('.image-select');
        const selected = Array.from(checkboxes).filter(cb => cb.checked);
        const selectionCount = document.getElementById('selectionCount');
        const bulkDownload = document.getElementById('bulkDownload');
        const bulkDelete = document.getElementById('bulkDelete');
        
        if (selectionCount) {
            selectionCount.textContent = `${selected.length} selecionadas`;
        }
        
        if (bulkDownload && bulkDelete) {
            bulkDownload.disabled = selected.length === 0;
            bulkDelete.disabled = selected.length === 0;
        }
    }
    
    alterarVisualizacao(viewType, modal) {
        const imageGrid = modal.querySelector('#imageGrid');
        
        imageGrid.className = `image-grid view-${viewType}`;
        
        if (viewType === 'slideshow') {
            this.iniciarApresentacao(modal);
        }
    }
    
    async baixarTodasImagens(folderName, folderData) {
        console.log(`Baixando todas as imagens da pasta ${folderName}`);
        
        if (!folderData.images || folderData.images.length === 0) {
            alert('Nenhuma imagem encontrada para download');
            return;
        }
        
        // Criar um arquivo ZIP com todas as imagens
        this.criarZipImagens(folderData.images, `${folderName}_imagens.zip`);
    }
    
    async baixarImagensSelecionadas(modal) {
        const selected = modal.querySelectorAll('.image-select:checked');
        
        if (selected.length === 0) {
            alert('Nenhuma imagem selecionada');
            return;
        }
        
        const images = Array.from(selected).map(cb => ({
            download_url: cb.dataset.imageUrl,
            name: cb.dataset.imageName
        }));
        
        this.criarZipImagens(images, 'imagens_selecionadas.zip');
    }
    
    async baixarImagemUnica(imageUrl, imageName) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = imageName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            
        } catch (error) {
            console.error('Erro ao baixar imagem:', error);
            alert('Erro ao baixar a imagem');
        }
    }
    
    async criarZipImagens(images, zipName) {
        // Implementação simplificada - em um ambiente real, usaria uma biblioteca como JSZip
        console.log(`Criando ZIP com ${images.length} imagens: ${zipName}`);
        
        // Por enquanto, baixar imagens individualmente
        for (const image of images.slice(0, 10)) { // Limitar a 10 para não sobrecarregar
            await this.baixarImagemUnica(image.download_url, image.name);
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay entre downloads
        }
        
        if (images.length > 10) {
            alert(`Baixadas as primeiras 10 imagens. Total: ${images.length} imagens.`);
        }
    }
    
    abrirVisualizadorCompleto(imageIndex) {
        console.log(`Abrindo visualizador completo para imagem ${imageIndex}`);
        // Implementar visualizador de imagem em tela cheia
        this.criarVisualizadorTelaCheia(imageIndex);
    }
    
    criarVisualizadorTelaCheia(imageIndex) {
        const viewer = document.createElement('div');
        viewer.className = 'fullscreen-viewer';
        viewer.innerHTML = `
            <div class="viewer-overlay">
                <div class="viewer-controls">
                    <button class="viewer-btn prev-btn">←</button>
                    <button class="viewer-btn close-btn">×</button>
                    <button class="viewer-btn next-btn">→</button>
                </div>
                <div class="viewer-image-container">
                    <img id="fullscreenImage" src="" alt="">
                </div>
                <div class="viewer-info">
                    <span id="imageCounter"></span>
                    <span id="imageName"></span>
                </div>
            </div>
        `;
        
        document.body.appendChild(viewer);
        
        // Configurar eventos do visualizador
        this.configurarVisualizadorTelaCheia(viewer, imageIndex);
    }
    
    configurarVisualizadorTelaCheia(viewer, startIndex) {
        const closeBtn = viewer.querySelector('.close-btn');
        const prevBtn = viewer.querySelector('.prev-btn');
        const nextBtn = viewer.querySelector('.next-btn');
        const image = viewer.querySelector('#fullscreenImage');
        const counter = viewer.querySelector('#imageCounter');
        const imageName = viewer.querySelector('#imageName');
        
        let currentIndex = startIndex;
        const images = this.getCurrentFolderImages(); // Método para obter imagens da pasta atual
        
        const updateImage = () => {
            if (images && images[currentIndex]) {
                const currentImage = images[currentIndex];
                image.src = currentImage.download_url;
                image.alt = currentImage.name;
                counter.textContent = `${currentIndex + 1} / ${images.length}`;
                imageName.textContent = currentImage.name;
            }
        };
        
        updateImage();
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(viewer);
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateImage();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < images.length - 1) {
                currentIndex++;
                updateImage();
            }
        });
        
        // Navegação por teclado
        const handleKeyPress = (e) => {
            switch(e.key) {
                case 'Escape':
                    document.body.removeChild(viewer);
                    break;
                case 'ArrowLeft':
                    prevBtn.click();
                    break;
                case 'ArrowRight':
                    nextBtn.click();
                    break;
            }
        };
        
        document.addEventListener('keydown', handleKeyPress);
        
        // Remover listener quando fechar
        const originalRemove = viewer.remove;
        viewer.remove = function() {
            document.removeEventListener('keydown', handleKeyPress);
            originalRemove.call(this);
        };
    }
    
    getCurrentFolderImages() {
        // Retorna as imagens da pasta atualmente aberta
        // Esta implementação precisa ser ajustada baseada no contexto atual
        const modal = document.querySelector('.folder-viewer-modal');
        if (modal) {
            const imageCards = modal.querySelectorAll('.image-card');
            return Array.from(imageCards).map(card => {
                const checkbox = card.querySelector('.image-select');
                const img = card.querySelector('img');
                return {
                    download_url: checkbox.dataset.imageUrl,
                    name: checkbox.dataset.imageName,
                    src: img.src
                };
            });
        }
        return [];
    }
    
    async atualizarPasta(folderName, modal) {
        console.log(`Atualizando pasta ${folderName}`);
        
        // Limpar cache da pasta
        const cacheKeys = Array.from(this.cache.keys()).filter(key => key.includes(folderName));
        cacheKeys.forEach(key => this.cache.delete(key));
        
        // Recarregar dados da pasta
        const folderData = await this.analisarPasta(folderName);
        this.folderSizes.set(folderName, folderData);
        
        // Atualizar visualizador
        this.carregarImagensVisualizador(folderName, folderData);
        
        // Atualizar estatísticas mini
        const statsElement = modal.querySelector('.folder-stats-mini');
        if (statsElement) {
            statsElement.innerHTML = `
                <span>${folderData.arquivos} imagens</span>
                <span>${(folderData.tamanho / (1024 * 1024)).toFixed(1)} MB</span>
            `;
        }
    }
    
    mostrarInfoPasta(folderName, folderData) {
        const infoModal = document.createElement('div');
        infoModal.className = 'info-modal';
        infoModal.innerHTML = `
            <div class="info-content">
                <div class="info-header">
                    <h3>Informações da Pasta</h3>
                    <button class="info-close">&times;</button>
                </div>
                <div class="info-body">
                    <div class="info-item">
                        <strong>Nome:</strong> ${folderName}
                    </div>
                    <div class="info-item">
                        <strong>Total de Imagens:</strong> ${folderData.arquivos}
                    </div>
                    <div class="info-item">
                        <strong>Tamanho Total:</strong> ${(folderData.tamanho / (1024 * 1024)).toFixed(2)} MB
                    </div>
                    <div class="info-item">
                        <strong>Tamanho Médio:</strong> ${(folderData.tamanho / folderData.arquivos / 1024).toFixed(1)} KB por imagem
                    </div>
                    <div class="info-item">
                        <strong>Última Atualização:</strong> ${new Date().toLocaleString('pt-BR')}
                    </div>
                    <div class="info-item">
                        <strong>Repositório:</strong> ${this.repoOwner}/${this.repoName}
                    </div>
                    <div class="info-item">
                        <strong>Caminho:</strong> /img/${folderName}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(infoModal);
        
        infoModal.querySelector('.info-close').addEventListener('click', () => {
            document.body.removeChild(infoModal);
        });
        
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) {
                document.body.removeChild(infoModal);
            }
        });
    }
    
    mostrarInfoImagem(imageUrl, imageName) {
        console.log(`Mostrando informações da imagem: ${imageName}`);
        // Implementar modal de informações da imagem
    }
    
    filtrarImagens(termo, modal) {
        const imageCards = modal.querySelectorAll('.image-card');
        const termoBusca = termo.toLowerCase();
        
        imageCards.forEach(card => {
            const imageName = card.querySelector('.image-name').textContent.toLowerCase();
            card.style.display = imageName.includes(termoBusca) ? 'block' : 'none';
        });
    }
    
    iniciarApresentacao(modal) {
        console.log('Iniciando apresentação de slides');
        // Implementar modo de apresentação
    }
    
    removerImagensSelecionadas(modal) {
        const selected = modal.querySelectorAll('.image-select:checked');
        
        if (selected.length === 0) {
            alert('Nenhuma imagem selecionada');
            return;
        }
        
        if (confirm(`Tem certeza que deseja remover ${selected.length} imagem(ns) da visualização?`)) {
            selected.forEach(checkbox => {
                const imageCard = checkbox.closest('.image-card');
                imageCard.remove();
            });
            
            this.atualizarSelecao();
        }
    }
    
    async carregarPreviewImagens(folderName, folderData) {
        const previewContainer = document.getElementById('imagePreview');
        if (!previewContainer || !folderData.images) return;
        
        const imagesToShow = folderData.images.slice(0, 12);
        
        previewContainer.innerHTML = imagesToShow.map(image => `
            <div class="image-item">
                <img src="${image.download_url}" alt="${image.name}" loading="lazy">
                <div class="image-name">${image.name}</div>
            </div>
        `).join('');
        
        if (folderData.images.length > 12) {
            previewContainer.innerHTML += `
                <div class="more-images">
                    +${folderData.images.length - 12} mais imagens
                </div>
            `;
        }
    }
    
    mostrarImagens() {
        const localTab = document.querySelector('[data-view="local"]');
        if (localTab) {
            localTab.click();
        }
    }
    
    mostrarAnalytics() {
        const analyticsTab = document.querySelector('[data-view="analytics"]');
        if (analyticsTab) {
            analyticsTab.click();
        }
    }
    
    mostrarEstatisticasDetalhadas() {
        console.log('Estatísticas detalhadas:');
        console.log('Cache de pastas:', this.folderSizes);
        console.log('Cache de imagens:', this.imageCache.size, 'itens');
        console.log('Cache de API:', this.cache.size, 'itens');
    }
    
    limparCache() {
        this.cache.clear();
        this.imageCache.clear();
        console.log('Cache limpo com sucesso');
    }
    
    async atualizarDados() {
        console.log('Atualizando dados...');
        this.limparCache();
        await this.carregarDadosRepositorio();
        console.log('Dados atualizados com sucesso');
    }
    
    filtrarConteudo(termo) {
        const folderItems = document.querySelectorAll('.folder-item');
        const toolItems = document.querySelectorAll('.tool-item');
        
        const termoBusca = termo.toLowerCase();
        
        folderItems.forEach(item => {
            const folderName = item.querySelector('.folder-name').textContent.toLowerCase();
            item.style.display = folderName.includes(termoBusca) ? 'flex' : 'none';
        });
        
        toolItems.forEach(item => {
            const toolName = item.querySelector('.tool-name').textContent.toLowerCase();
            item.style.display = toolName.includes(termoBusca) ? 'flex' : 'none';
        });
    }
    
    mostrarErro(mensagem) {
        console.error(mensagem);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = mensagem;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Inicializar o sistema
const githubManager = new GitHubFileManager();
window.githubManager = githubManager;

