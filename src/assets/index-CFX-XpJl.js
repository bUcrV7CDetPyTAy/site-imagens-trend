(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(o){if(o.ep)return;o.ep=!0;const s=a(o);fetch(o.href,s)}})();class f{constructor(){this.repoOwner="bUcrV7CDetPyTAy",this.repoName="site-imagens-trend",this.apiBase="https://api.github.com",this.rawBase="https://raw.githubusercontent.com",this.cache=new Map,this.imageCache=new Map,this.folderSizes=new Map,this.inicializar()}inicializar(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>this.iniciarFileManager()):this.iniciarFileManager()}async iniciarFileManager(){console.log("Iniciando File Manager integrado com GitHub..."),this.configurarNavegacao(),this.configurarBookmarks(),await this.carregarDadosRepositorio(),this.configurarBusca(),setTimeout(()=>{if(window.GraficosAnaliseReal){const e=new window.GraficosAnaliseReal(this);setTimeout(()=>{e.atualizarDados(this)},5e3)}if(window.CalculadorTamanhoReal){const e=new window.CalculadorTamanhoReal(this);setTimeout(()=>{e.calcularTamanhoImagens()},3e3)}},2e3)}async carregarDadosRepositorio(){try{console.log("Carregando dados do repositório...");const e=await this.fetchGitHubAPI(`/repos/${this.repoOwner}/${this.repoName}/contents/img`);if(e){const a=e.filter(t=>t.type==="dir");console.log(`Encontradas ${a.length} pastas de imagens:`,a.map(t=>t.name)),await this.processarPastas(a),this.gerarFerramentas(),this.atualizarEstatisticas()}}catch(e){console.error("Erro ao carregar dados do repositório:",e),this.mostrarErro("Erro ao carregar dados do repositório")}}async fetchGitHubAPI(e){const a=`${this.apiBase}${e}`;if(this.cache.has(a))return this.cache.get(a);try{const t=await fetch(a);if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);const o=await t.json();return this.cache.set(a,o),o}catch(t){return console.error(`Erro ao buscar ${a}:`,t),null}}async processarPastas(e){console.log(`Processando ${e.length} pastas...`);const a=document.getElementById("folderList");if(!a)return;a.innerHTML='<div class="loading">Carregando pastas...</div>';const t=e.map(async s=>{const i=await this.analisarPasta(s.name);return{name:s.name,...i}}),o=await Promise.all(t);this.renderizarPastas(o)}async analisarPasta(e){try{const a=await this.fetchGitHubAPI(`/repos/${this.repoOwner}/${this.repoName}/contents/img/${e}`);if(!a)return{arquivos:0,tamanho:0,data:new Date};const t=a.filter(n=>n.type==="file"&&/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(n.name));console.log(`Pasta ${e}: ${t.length} imagens encontradas`);let o=0;const s=t.slice(0,10).map(async n=>await this.obterTamanhoImagem(n.download_url));return o=(await Promise.all(s)).reduce((n,r)=>n+r,0),t.length>10&&(o=o/10*t.length),this.folderSizes.set(e,{arquivos:t.length,tamanho:o,images:t}),{arquivos:t.length,tamanho:o,data:new Date}}catch(a){return console.error(`Erro ao analisar pasta ${e}:`,a),{arquivos:0,tamanho:0,data:new Date}}}async obterTamanhoImagem(e){if(this.imageCache.has(e))return this.imageCache.get(e);try{const t=(await fetch(e,{method:"HEAD"})).headers.get("content-length"),o=t?parseInt(t):0;return this.imageCache.set(e,o),o}catch(a){return console.error(`Erro ao obter tamanho da imagem ${e}:`,a),0}}renderizarPastas(e){const a=document.getElementById("folderList");a&&(a.innerHTML=e.map(t=>{const o=(t.tamanho/1048576).toFixed(1);return`
                <div class="folder-item" data-folder="${t.name}">
                    <div class="folder-icon">📁</div>
                    <div class="folder-info">
                        <div class="folder-name">${t.name}</div>
                        <div class="folder-details">
                            <span>${t.arquivos} imagens</span>
                            <span>${o} MB</span>
                        </div>
                    </div>
                    <div class="folder-date">${t.data.toLocaleDateString("pt-BR")}</div>
                </div>
            `}).join(""),a.querySelectorAll(".folder-item").forEach(t=>{t.addEventListener("click",()=>{const o=t.dataset.folder;this.abrirPasta(o)})}))}configurarBookmarks(){const e=document.getElementById("addBookmark"),a=document.getElementById("downloadBookmark"),t=document.getElementById("webSearchBookmark");e&&e.addEventListener("click",o=>{o.preventDefault(),this.mostrarModalAdicionar()}),a&&a.addEventListener("click",o=>{o.preventDefault(),this.mostrarModalDownload()}),t&&t.addEventListener("click",o=>{o.preventDefault(),this.abrirWebSearch()})}mostrarModalAdicionar(){this.mostrarModalFuncionalidade("Adicionar Arquivo","➕",`
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
        `),setTimeout(()=>{this.configurarUpload()},100)}configurarUpload(){const e=document.getElementById("uploadZone"),a=document.getElementById("fileInput"),t=document.getElementById("createFolder"),o=document.getElementById("folderName");e&&a&&(e.addEventListener("click",()=>{a.click()}),e.addEventListener("dragover",s=>{s.preventDefault(),e.classList.add("drag-over")}),e.addEventListener("dragleave",()=>{e.classList.remove("drag-over")}),e.addEventListener("drop",s=>{s.preventDefault(),e.classList.remove("drag-over");const i=s.dataTransfer.files;this.processarArquivos(i)}),a.addEventListener("change",s=>{this.processarArquivos(s.target.files)})),t&&o&&t.addEventListener("change",()=>{o.style.display=t.checked?"block":"none"})}processarArquivos(e){console.log(`Processando ${e.length} arquivo(s)`),Array.from(e).forEach(a=>{console.log(`Arquivo: ${a.name}, Tamanho: ${a.size} bytes`)}),alert(`${e.length} arquivo(s) selecionado(s). Funcionalidade de upload em desenvolvimento.`)}mostrarModalDownload(){this.mostrarModalFuncionalidade("Central de Downloads","⬇️",`
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
        `),setTimeout(()=>{this.preencherListaPastas()},100)}preencherListaPastas(){const e=document.getElementById("folderSelect");if(e)for(const[a]of this.folderSizes){const t=document.createElement("option");t.value=a,t.textContent=a,e.appendChild(t)}}baixarPastaSelecionada(){const e=document.getElementById("folderSelect");if(!e||!e.value){alert("Selecione uma pasta para baixar");return}const a=e.value,t=this.folderSizes.get(a);t&&this.baixarTodasImagens(a,t)}baixarRepositorioCompleto(){const e=`https://github.com/${this.repoOwner}/${this.repoName}/archive/refs/heads/main.zip`;window.open(e,"_blank")}gerarRelatorio(){let e="RELATÓRIO DE ARQUIVOS\\n";e+="===================\\n\\n";let a=0,t=0;for(const[i,n]of this.folderSizes)e+=`📁 ${i}\\n`,e+=`   Arquivos: ${n.arquivos}\\n`,e+=`   Tamanho: ${(n.tamanho/(1024*1024)).toFixed(2)} MB\\n\\n`,a+=n.arquivos,t+=n.tamanho;e+="===================\\n",e+=`Total de Arquivos: ${a}\\n`,e+=`Tamanho Total: ${(t/(1024*1024)).toFixed(2)} MB\\n`,e+=`Data do Relatório: ${new Date().toLocaleString("pt-BR")}\\n`;const o=new Blob([e],{type:"text/plain"}),s=document.createElement("a");s.href=URL.createObjectURL(o),s.download="relatorio_arquivos.txt",document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(s.href)}abrirWebSearch(){this.mostrarModalFuncionalidade("Busca na Web","🌐",`
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
        `)}buscarImagensWeb(){const e=document.getElementById("imageSearch");if(!e||!e.value){alert("Digite um termo de busca");return}const a=e.value,t=`https://www.google.com/search?q=${encodeURIComponent(a)}&tbm=isch`;window.open(t,"_blank")}buscarPorEstilo(){const e=document.getElementById("styleSearch");if(!e||!e.value){alert("Selecione um estilo");return}const a=e.value,t=`https://www.google.com/search?q=${encodeURIComponent(a+" design style")}&tbm=isch`;window.open(t,"_blank")}mostrarTendencias(){window.open("https://trends.google.com/trends/explore?cat=13","_blank")}gerarFerramentas(){const e=[{name:"Imagens",color:"#ef4444",icon:"🖼️",action:"mostrarImagens"},{name:"Vídeos",color:"#f97316",icon:"🎬",action:"mostrarVideos"},{name:"Música",color:"#8b5cf6",icon:"🎵",action:"mostrarMusica"},{name:"Documentos",color:"#fbbf24",icon:"📄",action:"mostrarDocumentos"},{name:"Compactados",color:"#06b6d4",icon:"🗜️",action:"mostrarCompactados"},{name:"Limpeza",color:"#10b981",icon:"🧹",action:"executarLimpeza"},{name:"Análise",color:"#f97316",icon:"📊",action:"mostrarAnalytics"},{name:"Backup",color:"#6b7280",icon:"💾",action:"criarBackup"},{name:"Rede",color:"#3b82f6",icon:"🌐",action:"configurarRede"},{name:"Segurança",color:"#dc2626",icon:"🔒",action:"verificarSeguranca"},{name:"Favoritos",color:"#fbbf24",icon:"⭐",action:"gerenciarFavoritos"},{name:"Recentes",color:"#84cc16",icon:"🕒",action:"mostrarRecentes"}],a=document.getElementById("toolsGrid");a&&(a.innerHTML=e.map(t=>`
            <div class="tool-item" data-tool="${t.action}">
                <div class="tool-icon" style="background: ${t.color}">
                    ${t.icon}
                </div>
                <span class="tool-name">${t.name}</span>
            </div>
        `).join(""),a.querySelectorAll(".tool-item").forEach(t=>{t.addEventListener("click",()=>{const o=t.dataset.tool;this.executarAcaoFerramenta(o)})}))}configurarBusca(){const e=document.getElementById("searchInput");e&&e.addEventListener("input",a=>{this.filtrarConteudo(a.target.value)})}atualizarEstatisticas(){const e=document.getElementById("storageUsed"),a=document.getElementById("storagePercent"),t=document.getElementById("pathStoragePercent");let o=0,s=0;for(const[r,c]of this.folderSizes)o+=c.tamanho,s+=c.arquivos;const i=(o/(1024*1024*1024)).toFixed(2),n=Math.min(Math.floor(o/(100*1024*1024)*100),100);e&&(e.textContent=`${i} GB calculados (${s} imagens)`),a&&(a.textContent=`${n}%`),t&&(t.textContent=`${n}%`)}async executarAcaoFerramenta(e){switch(console.log(`Executando ação: ${e}`),e){case"mostrarImagens":this.mostrarImagens();break;case"mostrarVideos":this.mostrarVideos();break;case"mostrarMusica":this.mostrarMusica();break;case"mostrarDocumentos":this.mostrarDocumentos();break;case"mostrarCompactados":this.mostrarCompactados();break;case"executarLimpeza":this.executarLimpeza();break;case"mostrarAnalytics":this.mostrarAnalytics();break;case"criarBackup":this.criarBackup();break;case"configurarRede":this.configurarRede();break;case"verificarSeguranca":this.verificarSeguranca();break;case"gerenciarFavoritos":this.gerenciarFavoritos();break;case"mostrarRecentes":this.mostrarRecentes();break;default:console.log(`Ação ${e} não implementada`)}}mostrarVideos(){this.mostrarModalFuncionalidade("Vídeos","🎬",`
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
        `)}mostrarMusica(){this.mostrarModalFuncionalidade("Música","🎵",`
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
        `)}mostrarDocumentos(){this.mostrarModalFuncionalidade("Documentos","📄",`
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
        `)}mostrarCompactados(){this.mostrarModalFuncionalidade("Arquivos Compactados","🗜️",`
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
        `)}executarLimpeza(){this.mostrarModalFuncionalidade("Limpeza do Sistema","🧹",`
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
        `)}criarBackup(){this.mostrarModalFuncionalidade("Backup e Restauração","💾",`
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
        `)}configurarRede(){this.mostrarModalFuncionalidade("Configurações de Rede","🌐",`
            <div class="feature-content">
                <h4>Conectividade e Rede</h4>
                <p>Configure conexões e monitore o tráfego de rede.</p>
                <div class="feature-stats">
                    <div class="stat-item">
                        <strong>Online</strong>
                        <span>Status da conexão</span>
                    </div>
                    <div class="stat-item">
                        <strong>${navigator.onLine?"Conectado":"Desconectado"}</strong>
                        <span>Estado atual</span>
                    </div>
                </div>
                <div class="feature-actions">
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Testar Velocidade</button>
                    <button class="feature-btn" onclick="alert('Funcionalidade em desenvolvimento')">Configurar Proxy</button>
                </div>
            </div>
        `)}verificarSeguranca(){this.mostrarModalFuncionalidade("Segurança do Sistema","🔒",`
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
        `)}gerenciarFavoritos(){this.mostrarModalFuncionalidade("Favoritos","⭐",`
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
        `)}mostrarRecentes(){this.mostrarModalFuncionalidade("Arquivos Recentes","🕒",`
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
        `)}mostrarModalFuncionalidade(e,a,t){const o=document.createElement("div");o.className="feature-modal",o.innerHTML=`
            <div class="feature-modal-content">
                <div class="feature-modal-header">
                    <h3>${a} ${e}</h3>
                    <button class="feature-modal-close">&times;</button>
                </div>
                <div class="feature-modal-body">
                    ${t}
                </div>
            </div>
        `,document.body.appendChild(o),o.querySelector(".feature-modal-close").addEventListener("click",()=>{document.body.removeChild(o)}),o.addEventListener("click",s=>{s.target===o&&document.body.removeChild(o)})}async abrirPasta(e){console.log(`Abrindo pasta: ${e}`);const a=this.folderSizes.get(e);if(!a){console.error(`Dados da pasta ${e} não encontrados`);return}this.mostrarVisualizadorPasta(e,a)}mostrarVisualizadorPasta(e,a){const t=document.createElement("div");t.className="folder-viewer-modal",t.innerHTML=`
            <div class="viewer-content">
                <div class="viewer-header">
                    <div class="viewer-title">
                        <button class="back-btn" title="Voltar">←</button>
                        <h3>📁 ${e}</h3>
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
                        <span>${a.arquivos} imagens</span>
                        <span>${(a.tamanho/(1024*1024)).toFixed(1)} MB</span>
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
        `,document.body.appendChild(t),this.configurarVisualizadorEventos(t,e,a),this.carregarImagensVisualizador(e,a)}configurarVisualizadorEventos(e,a,t){e.querySelector(".modal-close").addEventListener("click",()=>{document.body.removeChild(e)}),e.querySelector(".back-btn").addEventListener("click",()=>{document.body.removeChild(e)}),e.addEventListener("click",s=>{s.target===e&&document.body.removeChild(e)}),e.querySelectorAll(".view-btn").forEach(s=>{s.addEventListener("click",()=>{e.querySelectorAll(".view-btn").forEach(i=>i.classList.remove("active")),s.classList.add("active"),this.alterarVisualizacao(s.dataset.view,e)})}),e.querySelector(".download-all").addEventListener("click",()=>{this.baixarTodasImagens(a,t)}),e.querySelector(".refresh-folder").addEventListener("click",()=>{this.atualizarPasta(a,e)}),e.querySelector(".folder-info").addEventListener("click",()=>{this.mostrarInfoPasta(a,t)}),e.querySelector("#imageSearch").addEventListener("input",s=>{this.filtrarImagens(s.target.value,e)}),e.querySelector("#bulkDownload").addEventListener("click",()=>{this.baixarImagensSelecionadas(e)}),e.querySelector("#bulkDelete").addEventListener("click",()=>{this.removerImagensSelecionadas(e)})}async carregarImagensVisualizador(e,a){const t=document.getElementById("imageGrid");if(!t||!a.images)return;const o=24,s=Math.ceil(a.images.length/o);let i=1;this.renderizarImagens(a.images,t,i,o),this.criarPaginacao(s,i,a.images,t,o)}renderizarImagens(e,a,t,o){const s=(t-1)*o,i=s+o,n=e.slice(s,i);a.innerHTML=n.map((r,c)=>`
            <div class="image-card" data-image-index="${s+c}">
                <div class="image-container">
                    <img src="${r.download_url}" alt="${r.name}" loading="lazy">
                    <div class="image-overlay">
                        <button class="image-action view-full" title="Visualizar em tela cheia">🔍</button>
                        <button class="image-action download-single" title="Baixar imagem">⬇️</button>
                        <button class="image-action image-info" title="Informações da imagem">ℹ️</button>
                    </div>
                    <div class="image-checkbox">
                        <input type="checkbox" class="image-select" data-image-url="${r.download_url}" data-image-name="${r.name}">
                    </div>
                </div>
                <div class="image-details">
                    <div class="image-name" title="${r.name}">${r.name}</div>
                    <div class="image-size">Carregando...</div>
                </div>
            </div>
        `).join(""),this.configurarEventosImagens(a),this.carregarTamanhosImagens(n,a)}configurarEventosImagens(e){e.querySelectorAll(".image-select").forEach(a=>{a.addEventListener("change",()=>{this.atualizarSelecao()})}),e.querySelectorAll(".view-full").forEach((a,t)=>{a.addEventListener("click",o=>{o.stopPropagation();const s=a.closest(".image-card"),i=parseInt(s.dataset.imageIndex);this.abrirVisualizadorCompleto(i)})}),e.querySelectorAll(".download-single").forEach(a=>{a.addEventListener("click",t=>{t.stopPropagation();const o=a.closest(".image-card").querySelector(".image-select");this.baixarImagemUnica(o.dataset.imageUrl,o.dataset.imageName)})}),e.querySelectorAll(".image-info").forEach(a=>{a.addEventListener("click",t=>{t.stopPropagation();const o=a.closest(".image-card").querySelector(".image-select");this.mostrarInfoImagem(o.dataset.imageUrl,o.dataset.imageName)})}),e.querySelectorAll(".image-card").forEach(a=>{a.addEventListener("dblclick",()=>{const t=parseInt(a.dataset.imageIndex);this.abrirVisualizadorCompleto(t)})})}async carregarTamanhosImagens(e,a){const t=a.querySelectorAll(".image-card");for(let o=0;o<e.length;o++){const s=e[o],n=t[o].querySelector(".image-size");try{const c=(await this.obterTamanhoImagem(s.download_url)/1024).toFixed(1);n.textContent=`${c} KB`}catch{n.textContent="Tamanho desconhecido"}}}criarPaginacao(e,a,t,o,s){const i=document.getElementById("imagePagination");if(!i||e<=1)return;let n="";a>1&&(n+=`<button class="page-btn" data-page="${a-1}">←</button>`);for(let r=1;r<=e;r++)r===a?n+=`<button class="page-btn active" data-page="${r}">${r}</button>`:r===1||r===e||Math.abs(r-a)<=2?n+=`<button class="page-btn" data-page="${r}">${r}</button>`:(r===a-3||r===a+3)&&(n+='<span class="page-ellipsis">...</span>');a<e&&(n+=`<button class="page-btn" data-page="${a+1}">→</button>`),i.innerHTML=n,i.querySelectorAll(".page-btn").forEach(r=>{r.addEventListener("click",()=>{const c=parseInt(r.dataset.page);this.renderizarImagens(t,o,c,s),this.criarPaginacao(e,c,t,o,s)})})}atualizarSelecao(){const e=document.querySelectorAll(".image-select"),a=Array.from(e).filter(i=>i.checked),t=document.getElementById("selectionCount"),o=document.getElementById("bulkDownload"),s=document.getElementById("bulkDelete");t&&(t.textContent=`${a.length} selecionadas`),o&&s&&(o.disabled=a.length===0,s.disabled=a.length===0)}alterarVisualizacao(e,a){const t=a.querySelector("#imageGrid");t.className=`image-grid view-${e}`,e==="slideshow"&&this.iniciarApresentacao(a)}async baixarTodasImagens(e,a){if(console.log(`Baixando todas as imagens da pasta ${e}`),!a.images||a.images.length===0){alert("Nenhuma imagem encontrada para download");return}this.criarZipImagens(a.images,`${e}_imagens.zip`)}async baixarImagensSelecionadas(e){const a=e.querySelectorAll(".image-select:checked");if(a.length===0){alert("Nenhuma imagem selecionada");return}const t=Array.from(a).map(o=>({download_url:o.dataset.imageUrl,name:o.dataset.imageName}));this.criarZipImagens(t,"imagens_selecionadas.zip")}async baixarImagemUnica(e,a){try{const o=await(await fetch(e)).blob(),s=document.createElement("a");s.href=URL.createObjectURL(o),s.download=a,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(s.href)}catch(t){console.error("Erro ao baixar imagem:",t),alert("Erro ao baixar a imagem")}}async criarZipImagens(e,a){console.log(`Criando ZIP com ${e.length} imagens: ${a}`);for(const t of e.slice(0,10))await this.baixarImagemUnica(t.download_url,t.name),await new Promise(o=>setTimeout(o,500));e.length>10&&alert(`Baixadas as primeiras 10 imagens. Total: ${e.length} imagens.`)}abrirVisualizadorCompleto(e){console.log(`Abrindo visualizador completo para imagem ${e}`),this.criarVisualizadorTelaCheia(e)}criarVisualizadorTelaCheia(e){const a=document.createElement("div");a.className="fullscreen-viewer",a.innerHTML=`
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
        `,document.body.appendChild(a),this.configurarVisualizadorTelaCheia(a,e)}configurarVisualizadorTelaCheia(e,a){const t=e.querySelector(".close-btn"),o=e.querySelector(".prev-btn"),s=e.querySelector(".next-btn"),i=e.querySelector("#fullscreenImage"),n=e.querySelector("#imageCounter"),r=e.querySelector("#imageName");let c=a;const l=this.getCurrentFolderImages(),d=()=>{if(l&&l[c]){const m=l[c];i.src=m.download_url,i.alt=m.name,n.textContent=`${c+1} / ${l.length}`,r.textContent=m.name}};d(),t.addEventListener("click",()=>{document.body.removeChild(e)}),o.addEventListener("click",()=>{c>0&&(c--,d())}),s.addEventListener("click",()=>{c<l.length-1&&(c++,d())});const g=m=>{switch(m.key){case"Escape":document.body.removeChild(e);break;case"ArrowLeft":o.click();break;case"ArrowRight":s.click();break}};document.addEventListener("keydown",g);const u=e.remove;e.remove=function(){document.removeEventListener("keydown",g),u.call(this)}}getCurrentFolderImages(){const e=document.querySelector(".folder-viewer-modal");if(e){const a=e.querySelectorAll(".image-card");return Array.from(a).map(t=>{const o=t.querySelector(".image-select"),s=t.querySelector("img");return{download_url:o.dataset.imageUrl,name:o.dataset.imageName,src:s.src}})}return[]}async atualizarPasta(e,a){console.log(`Atualizando pasta ${e}`),Array.from(this.cache.keys()).filter(i=>i.includes(e)).forEach(i=>this.cache.delete(i));const o=await this.analisarPasta(e);this.folderSizes.set(e,o),this.carregarImagensVisualizador(e,o);const s=a.querySelector(".folder-stats-mini");s&&(s.innerHTML=`
                <span>${o.arquivos} imagens</span>
                <span>${(o.tamanho/(1024*1024)).toFixed(1)} MB</span>
            `)}mostrarInfoPasta(e,a){const t=document.createElement("div");t.className="info-modal",t.innerHTML=`
            <div class="info-content">
                <div class="info-header">
                    <h3>Informações da Pasta</h3>
                    <button class="info-close">&times;</button>
                </div>
                <div class="info-body">
                    <div class="info-item">
                        <strong>Nome:</strong> ${e}
                    </div>
                    <div class="info-item">
                        <strong>Total de Imagens:</strong> ${a.arquivos}
                    </div>
                    <div class="info-item">
                        <strong>Tamanho Total:</strong> ${(a.tamanho/(1024*1024)).toFixed(2)} MB
                    </div>
                    <div class="info-item">
                        <strong>Tamanho Médio:</strong> ${(a.tamanho/a.arquivos/1024).toFixed(1)} KB por imagem
                    </div>
                    <div class="info-item">
                        <strong>Última Atualização:</strong> ${new Date().toLocaleString("pt-BR")}
                    </div>
                    <div class="info-item">
                        <strong>Repositório:</strong> ${this.repoOwner}/${this.repoName}
                    </div>
                    <div class="info-item">
                        <strong>Caminho:</strong> /img/${e}
                    </div>
                </div>
            </div>
        `,document.body.appendChild(t),t.querySelector(".info-close").addEventListener("click",()=>{document.body.removeChild(t)}),t.addEventListener("click",o=>{o.target===t&&document.body.removeChild(t)})}mostrarInfoImagem(e,a){console.log(`Mostrando informações da imagem: ${a}`)}filtrarImagens(e,a){const t=a.querySelectorAll(".image-card"),o=e.toLowerCase();t.forEach(s=>{const i=s.querySelector(".image-name").textContent.toLowerCase();s.style.display=i.includes(o)?"block":"none"})}iniciarApresentacao(e){console.log("Iniciando apresentação de slides")}removerImagensSelecionadas(e){const a=e.querySelectorAll(".image-select:checked");if(a.length===0){alert("Nenhuma imagem selecionada");return}confirm(`Tem certeza que deseja remover ${a.length} imagem(ns) da visualização?`)&&(a.forEach(t=>{t.closest(".image-card").remove()}),this.atualizarSelecao())}async carregarPreviewImagens(e,a){const t=document.getElementById("imagePreview");if(!t||!a.images)return;const o=a.images.slice(0,12);t.innerHTML=o.map(s=>`
            <div class="image-item">
                <img src="${s.download_url}" alt="${s.name}" loading="lazy">
                <div class="image-name">${s.name}</div>
            </div>
        `).join(""),a.images.length>12&&(t.innerHTML+=`
                <div class="more-images">
                    +${a.images.length-12} mais imagens
                </div>
            `)}mostrarImagens(){const e=document.querySelector('[data-view="local"]');e&&e.click()}mostrarAnalytics(){const e=document.querySelector('[data-view="analytics"]');e&&e.click()}mostrarEstatisticasDetalhadas(){console.log("Estatísticas detalhadas:"),console.log("Cache de pastas:",this.folderSizes),console.log("Cache de imagens:",this.imageCache.size,"itens"),console.log("Cache de API:",this.cache.size,"itens")}limparCache(){this.cache.clear(),this.imageCache.clear(),console.log("Cache limpo com sucesso")}async atualizarDados(){console.log("Atualizando dados..."),this.limparCache(),await this.carregarDadosRepositorio(),console.log("Dados atualizados com sucesso")}filtrarConteudo(e){const a=document.querySelectorAll(".folder-item"),t=document.querySelectorAll(".tool-item"),o=e.toLowerCase();a.forEach(s=>{const i=s.querySelector(".folder-name").textContent.toLowerCase();s.style.display=i.includes(o)?"flex":"none"}),t.forEach(s=>{const i=s.querySelector(".tool-name").textContent.toLowerCase();s.style.display=i.includes(o)?"flex":"none"})}mostrarErro(e){console.error(e);const a=document.createElement("div");a.className="error-message",a.textContent=e,a.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
        `,document.body.appendChild(a),setTimeout(()=>{document.body.contains(a)&&document.body.removeChild(a)},5e3)}}const b=new f;window.githubManager=b;class v{constructor(e){this.githubManager=e,this.dados=[],this.inicializar()}inicializar(){setTimeout(()=>{this.processarDadosReais(),this.criarGraficos()},3e3)}processarDadosReais(){if(!this.githubManager||!this.githubManager.folderSizes){console.log("Dados do GitHub ainda não disponíveis, usando dados simulados"),this.dados=this.gerarDadosSimulados();return}this.dados=[];for(const[e,a]of this.githubManager.folderSizes)this.dados.push({nome:e,tamanho:Math.round(a.tamanho/(1024*1024)),arquivos:a.arquivos,cor:this.gerarCorPorNome(e)});this.dados.sort((e,a)=>a.tamanho-e.tamanho),console.log("Dados reais processados:",this.dados)}gerarCorPorNome(e){let a=0;for(let o=0;o<e.length;o++)a=e.charCodeAt(o)+((a<<5)-a);const t=["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98D8C8","#F7DC6F","#BB8FCE","#85C1E9","#F8C471","#82E0AA","#F1948A","#85C1E9","#D7BDE2","#AED6F1","#A9DFBF","#F9E79F","#F5B7B1","#D2B4DE"];return t[Math.abs(a)%t.length]}gerarDadosSimulados(){return["artsystylecreative","balletcore","barbiecore","bohochic","casualcool","cleangirl","coquetteromânticomoderno","cottagecore","cowgirlchicwesternmodern","darkfemininesensualmisteriosa","ecofriendly","glamrockstyle","gothic","gothicchic","grungefemininoidie90s","indiesleaze","maximalistafashion","minimalista","outonoinverno","preppymodernoestudantilchic"].map(a=>({nome:a,tamanho:Math.floor(Math.random()*500)+50,arquivos:Math.floor(Math.random()*100)+10,cor:this.gerarCorPorNome(a)}))}criarGraficos(){this.criarGraficoPizza(),this.criarGraficoBarras(),this.atualizarEstatisticas()}criarGraficoPizza(){const e=document.getElementById("storageChart");if(!e)return;const a=e.getContext("2d"),t=e.width/2,o=e.height/2,s=Math.min(t,o)-20;if(a.clearRect(0,0,e.width,e.height),this.dados.length===0){a.fillStyle="#666",a.font="16px Arial",a.textAlign="center",a.fillText("Carregando dados...",t,o);return}const i=this.dados.reduce((r,c)=>r+c.tamanho,0);if(i===0){a.fillStyle="#666",a.font="16px Arial",a.textAlign="center",a.fillText("Nenhum dado disponível",t,o);return}let n=0;this.dados.forEach((r,c)=>{const l=r.tamanho/i*2*Math.PI;if(a.beginPath(),a.moveTo(t,o),a.arc(t,o,s,n,n+l),a.closePath(),a.fillStyle=r.cor,a.fill(),a.strokeStyle="#fff",a.lineWidth=2,a.stroke(),l>.2){const d=n+l/2,g=t+Math.cos(d)*(s*.7),u=o+Math.sin(d)*(s*.7);a.fillStyle="#fff",a.font="bold 12px Arial",a.textAlign="center",a.fillText(`${Math.round(r.tamanho/i*100)}%`,g,u)}n+=l}),a.fillStyle="#333",a.font="bold 16px Arial",a.textAlign="center",a.fillText("Uso de Espaço por Categoria",t,30)}criarGraficoBarras(){const e=document.getElementById("analyticsView");if(!e)return;const a=e.querySelector(".bar-chart-container");a&&a.remove();const t=document.createElement("div");t.className="bar-chart-container",t.style.cssText=`
            margin-top: 2rem;
            background: white;
            padding: 1.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        `;const o=document.createElement("h3");if(o.textContent="Top 10 Categorias por Tamanho",o.style.cssText=`
            margin-bottom: 1rem;
            color: #333;
            font-size: 1.2rem;
        `,t.appendChild(o),this.dados.length===0){const n=document.createElement("div");n.textContent="Carregando dados do repositório...",n.style.cssText=`
                text-align: center;
                padding: 2rem;
                color: #666;
                font-style: italic;
            `,t.appendChild(n),e.appendChild(t);return}const s=this.dados.slice(0,10),i=Math.max(...s.map(n=>n.tamanho));s.forEach(n=>{const r=document.createElement("div");r.style.cssText=`
                display: flex;
                align-items: center;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            `;const c=document.createElement("div");c.textContent=n.nome,c.style.cssText=`
                width: 200px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                margin-right: 1rem;
                font-weight: 500;
            `;const l=document.createElement("div");l.style.cssText=`
                flex: 1;
                height: 20px;
                background: #f0f0f0;
                border-radius: 10px;
                overflow: hidden;
                margin-right: 1rem;
                position: relative;
            `;const d=document.createElement("div"),g=i>0?n.tamanho/i*100:0;d.style.cssText=`
                height: 100%;
                width: ${g}%;
                background: ${n.cor};
                transition: width 0.8s ease;
                border-radius: 10px;
            `;const u=document.createElement("div");u.textContent=`${n.tamanho} MB`,u.style.cssText=`
                width: 80px;
                text-align: right;
                font-weight: 500;
                color: #4facfe;
            `;const m=document.createElement("div");m.textContent=`${n.arquivos} imgs`,m.style.cssText=`
                width: 60px;
                text-align: right;
                font-size: 0.8rem;
                color: #666;
                margin-left: 0.5rem;
            `,l.appendChild(d),r.appendChild(c),r.appendChild(l),r.appendChild(u),r.appendChild(m),t.appendChild(r)}),e.appendChild(t)}atualizarEstatisticas(){const e=document.getElementById("storageStats");if(!e)return;if(this.dados.length===0){e.innerHTML=`
                <div style="text-align: center; padding: 2rem; color: #666;">
                    Carregando estatísticas do repositório...
                </div>
            `;return}const a=this.dados.reduce((i,n)=>i+n.tamanho,0),t=this.dados.reduce((i,n)=>i+n.arquivos,0),o=t>0?Math.round(t/this.dados.length):0,s=this.dados.length>0?this.dados[0]:{nome:"N/A",tamanho:0};e.innerHTML=`
            <div class="stats-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-top: 2rem;
            ">
                <div class="stat-card" style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    text-align: center;
                ">
                    <h4 style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">Total de Espaço</h4>
                    <p style="font-size: 2rem; font-weight: bold; color: #4FACFE; margin: 0;">${(a/1024).toFixed(1)} GB</p>
                </div>
                
                <div class="stat-card" style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    text-align: center;
                ">
                    <h4 style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">Total de Imagens</h4>
                    <p style="font-size: 2rem; font-weight: bold; color: #10B981; margin: 0;">${t.toLocaleString()}</p>
                </div>
                
                <div class="stat-card" style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    text-align: center;
                ">
                    <h4 style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">Média por Categoria</h4>
                    <p style="font-size: 2rem; font-weight: bold; color: #F59E0B; margin: 0;">${o}</p>
                </div>
                
                <div class="stat-card" style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    text-align: center;
                ">
                    <h4 style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">Maior Categoria</h4>
                    <p style="font-size: 1.2rem; font-weight: bold; color: #8B5CF6; margin: 0;">${s.nome}</p>
                    <p style="font-size: 0.9rem; color: #666; margin: 0;">${s.tamanho} MB</p>
                </div>
            </div>
        `}atualizarDados(e){this.githubManager=e,this.processarDadosReais(),this.criarGraficos()}}class p{constructor(e){this.githubManager=e,this.tamanhoTotal=0,this.arquivosProcessados=0}async calcularTamanhoImagens(){if(!this.githubManager||!this.githubManager.folderSizes){console.log("GitHub manager não disponível para cálculo de imagens");return}console.log("Iniciando cálculo de tamanho das imagens...");for(const[e,a]of this.githubManager.folderSizes)if(a.images&&a.images.length>0){console.log(`Calculando tamanho da pasta ${e}...`);const t=5;for(let o=0;o<a.images.length;o+=t){const s=a.images.slice(o,o+t);await this.processarLoteImagens(s),await new Promise(i=>setTimeout(i,100))}}this.atualizarDisplay(),console.log(`Cálculo concluído. Total: ${this.tamanhoTotal} bytes`)}async processarLoteImagens(e){const a=e.map(o=>this.obterTamanhoImagem(o.download_url));(await Promise.all(a)).forEach(o=>{this.tamanhoTotal+=o,this.arquivosProcessados++})}async obterTamanhoImagem(e){if(this.githubManager.imageCache.has(e))return this.githubManager.imageCache.get(e);try{const t=(await fetch(e,{method:"HEAD"})).headers.get("content-length"),o=t?parseInt(t):0;return this.githubManager.imageCache.set(e,o),o}catch(a){return console.error(`Erro ao obter tamanho da imagem ${e}:`,a),0}}atualizarDisplay(){const e=document.querySelectorAll("#storageUsed, #pathStoragePercent");(this.tamanhoTotal/(1024*1024)).toFixed(2);const a=(this.tamanhoTotal/(1024*1024*1024)).toFixed(2);e.forEach(t=>{t.id==="storageUsed"&&(t.textContent=`${a} GB calculados (${this.arquivosProcessados} imagens)`)}),console.log(`Display atualizado: ${a} GB, ${this.arquivosProcessados} imagens`)}}window.GraficosAnaliseReal=v;window.CalculadorTamanhoReal=p;window.GraficosAnalise=v;window.CalculadorTamanho=p;
