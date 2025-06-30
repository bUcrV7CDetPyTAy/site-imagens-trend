// Sistema de gráficos integrado com dados reais do GitHub
// dev: zJ3

class GraficosAnaliseReal {
    constructor(githubManager) {
        this.githubManager = githubManager;
        this.dados = [];
        this.inicializar();
    }
    
    inicializar() {
        // Aguardar dados do GitHub estarem disponíveis
        setTimeout(() => {
            this.processarDadosReais();
            this.criarGraficos();
        }, 3000);
    }
    
    processarDadosReais() {
        if (!this.githubManager || !this.githubManager.folderSizes) {
            console.log('Dados do GitHub ainda não disponíveis, usando dados simulados');
            this.dados = this.gerarDadosSimulados();
            return;
        }
        
        this.dados = [];
        for (const [nome, info] of this.githubManager.folderSizes) {
            this.dados.push({
                nome: nome,
                tamanho: Math.round(info.tamanho / (1024 * 1024)), // MB
                arquivos: info.arquivos,
                cor: this.gerarCorPorNome(nome)
            });
        }
        
        // Ordenar por tamanho
        this.dados.sort((a, b) => b.tamanho - a.tamanho);
        
        console.log('Dados reais processados:', this.dados);
    }
    
    gerarCorPorNome(nome) {
        // Gerar cor baseada no hash do nome para consistência
        let hash = 0;
        for (let i = 0; i < nome.length; i++) {
            hash = nome.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const cores = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
            '#AED6F1', '#A9DFBF', '#F9E79F', '#F5B7B1', '#D2B4DE'
        ];
        
        return cores[Math.abs(hash) % cores.length];
    }
    
    gerarDadosSimulados() {
        const categorias = [
            'artsystylecreative', 'balletcore', 'barbiecore', 'bohochic', 'casualcool',
            'cleangirl', 'coquetteromânticomoderno', 'cottagecore', 'cowgirlchicwesternmodern',
            'darkfemininesensualmisteriosa', 'ecofriendly', 'glamrockstyle', 'gothic',
            'gothicchic', 'grungefemininoidie90s', 'indiesleaze', 'maximalistafashion',
            'minimalista', 'outonoinverno', 'preppymodernoestudantilchic'
        ];
        
        return categorias.map(categoria => ({
            nome: categoria,
            tamanho: Math.floor(Math.random() * 500) + 50,
            arquivos: Math.floor(Math.random() * 100) + 10,
            cor: this.gerarCorPorNome(categoria)
        }));
    }
    
    criarGraficos() {
        this.criarGraficoPizza();
        this.criarGraficoBarras();
        this.atualizarEstatisticas();
    }
    
    criarGraficoPizza() {
        const canvas = document.getElementById('storageChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (this.dados.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Carregando dados...', centerX, centerY);
            return;
        }
        
        // Calcular total
        const total = this.dados.reduce((sum, item) => sum + item.tamanho, 0);
        
        if (total === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Nenhum dado disponível', centerX, centerY);
            return;
        }
        
        // Desenhar gráfico de pizza
        let currentAngle = 0;
        
        this.dados.forEach((item, index) => {
            const sliceAngle = (item.tamanho / total) * 2 * Math.PI;
            
            // Desenhar fatia
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = item.cor;
            ctx.fill();
            
            // Desenhar borda
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Adicionar label se a fatia for grande o suficiente
            if (sliceAngle > 0.2) {
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
                const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${Math.round((item.tamanho / total) * 100)}%`, labelX, labelY);
            }
            
            currentAngle += sliceAngle;
        });
        
        // Adicionar título
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Uso de Espaço por Categoria', centerX, 30);
    }
    
    criarGraficoBarras() {
        const analyticsView = document.getElementById('analyticsView');
        if (!analyticsView) return;
        
        // Remover gráfico anterior se existir
        const existingChart = analyticsView.querySelector('.bar-chart-container');
        if (existingChart) {
            existingChart.remove();
        }
        
        const barChartContainer = document.createElement('div');
        barChartContainer.className = 'bar-chart-container';
        barChartContainer.style.cssText = `
            margin-top: 2rem;
            background: white;
            padding: 1.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        `;
        
        const title = document.createElement('h3');
        title.textContent = 'Top 10 Categorias por Tamanho';
        title.style.cssText = `
            margin-bottom: 1rem;
            color: #333;
            font-size: 1.2rem;
        `;
        
        barChartContainer.appendChild(title);
        
        if (this.dados.length === 0) {
            const loading = document.createElement('div');
            loading.textContent = 'Carregando dados do repositório...';
            loading.style.cssText = `
                text-align: center;
                padding: 2rem;
                color: #666;
                font-style: italic;
            `;
            barChartContainer.appendChild(loading);
            analyticsView.appendChild(barChartContainer);
            return;
        }
        
        // Pegar top 10
        const topDados = this.dados.slice(0, 10);
        const maxTamanho = Math.max(...topDados.map(item => item.tamanho));
        
        topDados.forEach(item => {
            const barItem = document.createElement('div');
            barItem.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            `;
            
            const label = document.createElement('div');
            label.textContent = item.nome;
            label.style.cssText = `
                width: 200px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                margin-right: 1rem;
                font-weight: 500;
            `;
            
            const barContainer = document.createElement('div');
            barContainer.style.cssText = `
                flex: 1;
                height: 20px;
                background: #f0f0f0;
                border-radius: 10px;
                overflow: hidden;
                margin-right: 1rem;
                position: relative;
            `;
            
            const bar = document.createElement('div');
            const percentage = maxTamanho > 0 ? (item.tamanho / maxTamanho) * 100 : 0;
            bar.style.cssText = `
                height: 100%;
                width: ${percentage}%;
                background: ${item.cor};
                transition: width 0.8s ease;
                border-radius: 10px;
            `;
            
            const value = document.createElement('div');
            value.textContent = `${item.tamanho} MB`;
            value.style.cssText = `
                width: 80px;
                text-align: right;
                font-weight: 500;
                color: #4facfe;
            `;
            
            const fileCount = document.createElement('div');
            fileCount.textContent = `${item.arquivos} imgs`;
            fileCount.style.cssText = `
                width: 60px;
                text-align: right;
                font-size: 0.8rem;
                color: #666;
                margin-left: 0.5rem;
            `;
            
            barContainer.appendChild(bar);
            barItem.appendChild(label);
            barItem.appendChild(barContainer);
            barItem.appendChild(value);
            barItem.appendChild(fileCount);
            barChartContainer.appendChild(barItem);
        });
        
        analyticsView.appendChild(barChartContainer);
    }
    
    atualizarEstatisticas() {
        const statsContainer = document.getElementById('storageStats');
        if (!statsContainer) return;
        
        if (this.dados.length === 0) {
            statsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    Carregando estatísticas do repositório...
                </div>
            `;
            return;
        }
        
        const totalTamanho = this.dados.reduce((sum, item) => sum + item.tamanho, 0);
        const totalArquivos = this.dados.reduce((sum, item) => sum + item.arquivos, 0);
        const mediaArquivos = totalArquivos > 0 ? Math.round(totalArquivos / this.dados.length) : 0;
        const maiorCategoria = this.dados.length > 0 ? this.dados[0] : { nome: 'N/A', tamanho: 0 };
        
        statsContainer.innerHTML = `
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
                    <p style="font-size: 2rem; font-weight: bold; color: #4FACFE; margin: 0;">${(totalTamanho / 1024).toFixed(1)} GB</p>
                </div>
                
                <div class="stat-card" style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    text-align: center;
                ">
                    <h4 style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">Total de Imagens</h4>
                    <p style="font-size: 2rem; font-weight: bold; color: #10B981; margin: 0;">${totalArquivos.toLocaleString()}</p>
                </div>
                
                <div class="stat-card" style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    text-align: center;
                ">
                    <h4 style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">Média por Categoria</h4>
                    <p style="font-size: 2rem; font-weight: bold; color: #F59E0B; margin: 0;">${mediaArquivos}</p>
                </div>
                
                <div class="stat-card" style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    text-align: center;
                ">
                    <h4 style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">Maior Categoria</h4>
                    <p style="font-size: 1.2rem; font-weight: bold; color: #8B5CF6; margin: 0;">${maiorCategoria.nome}</p>
                    <p style="font-size: 0.9rem; color: #666; margin: 0;">${maiorCategoria.tamanho} MB</p>
                </div>
            </div>
        `;
    }
    
    // Método para atualizar dados em tempo real
    atualizarDados(githubManager) {
        this.githubManager = githubManager;
        this.processarDadosReais();
        this.criarGraficos();
    }
}

// Função para calcular tamanho real de imagens no navegador
class CalculadorTamanhoReal {
    constructor(githubManager) {
        this.githubManager = githubManager;
        this.tamanhoTotal = 0;
        this.arquivosProcessados = 0;
    }
    
    async calcularTamanhoImagens() {
        if (!this.githubManager || !this.githubManager.folderSizes) {
            console.log('GitHub manager não disponível para cálculo de imagens');
            return;
        }
        
        console.log('Iniciando cálculo de tamanho das imagens...');
        
        for (const [folderName, folderData] of this.githubManager.folderSizes) {
            if (folderData.images && folderData.images.length > 0) {
                console.log(`Calculando tamanho da pasta ${folderName}...`);
                
                // Processar em lotes para não sobrecarregar
                const batchSize = 5;
                for (let i = 0; i < folderData.images.length; i += batchSize) {
                    const batch = folderData.images.slice(i, i + batchSize);
                    await this.processarLoteImagens(batch);
                    
                    // Pequena pausa entre lotes
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        }
        
        this.atualizarDisplay();
        console.log(`Cálculo concluído. Total: ${this.tamanhoTotal} bytes`);
    }
    
    async processarLoteImagens(images) {
        const promises = images.map(image => this.obterTamanhoImagem(image.download_url));
        const sizes = await Promise.all(promises);
        
        sizes.forEach(size => {
            this.tamanhoTotal += size;
            this.arquivosProcessados++;
        });
    }
    
    async obterTamanhoImagem(imageUrl) {
        // Verificar cache primeiro
        if (this.githubManager.imageCache.has(imageUrl)) {
            return this.githubManager.imageCache.get(imageUrl);
        }
        
        try {
            const response = await fetch(imageUrl, { method: 'HEAD' });
            const contentLength = response.headers.get('content-length');
            const size = contentLength ? parseInt(contentLength) : 0;
            
            // Salvar no cache
            this.githubManager.imageCache.set(imageUrl, size);
            return size;
            
        } catch (error) {
            console.error(`Erro ao obter tamanho da imagem ${imageUrl}:`, error);
            return 0;
        }
    }
    
    atualizarDisplay() {
        const displayElements = document.querySelectorAll('#storageUsed, #pathStoragePercent');
        const tamanhoMB = (this.tamanhoTotal / (1024 * 1024)).toFixed(2);
        const tamanhoGB = (this.tamanhoTotal / (1024 * 1024 * 1024)).toFixed(2);
        
        displayElements.forEach(element => {
            if (element.id === 'storageUsed') {
                element.textContent = `${tamanhoGB} GB calculados (${this.arquivosProcessados} imagens)`;
            }
        });
        
        console.log(`Display atualizado: ${tamanhoGB} GB, ${this.arquivosProcessados} imagens`);
    }
}

// Exportar para uso global
window.GraficosAnaliseReal = GraficosAnaliseReal;
window.CalculadorTamanhoReal = CalculadorTamanhoReal;

// Manter compatibilidade com versão anterior
window.GraficosAnalise = GraficosAnaliseReal;
window.CalculadorTamanho = CalculadorTamanhoReal;

