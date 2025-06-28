// Sistema de gráficos para análise de espaço
// dev: zJ3

class GraficosAnalise {
    constructor() {
        this.dados = this.gerarDadosSimulados();
        this.inicializar();
    }
    
    inicializar() {
        // Aguardar o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.criarGraficos());
        } else {
            this.criarGraficos();
        }
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
            tamanho: Math.floor(Math.random() * 500) + 50, // MB
            arquivos: Math.floor(Math.random() * 100) + 10,
            cor: this.gerarCorAleatoria()
        }));
    }
    
    gerarCorAleatoria() {
        const cores = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
        ];
        return cores[Math.floor(Math.random() * cores.length)];
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
        
        // Calcular total
        const total = this.dados.reduce((sum, item) => sum + item.tamanho, 0);
        
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
            
            currentAngle += sliceAngle;
        });
        
        // Adicionar título
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Uso de Espaço por Categoria', centerX, 30);
    }
    
    criarGraficoBarras() {
        // Criar container para gráfico de barras
        const analyticsView = document.getElementById('analyticsView');
        if (!analyticsView) return;
        
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
        
        // Ordenar dados por tamanho
        const topDados = [...this.dados]
            .sort((a, b) => b.tamanho - a.tamanho)
            .slice(0, 10);
        
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
            `;
            
            const barContainer = document.createElement('div');
            barContainer.style.cssText = `
                flex: 1;
                height: 20px;
                background: #f0f0f0;
                border-radius: 10px;
                overflow: hidden;
                margin-right: 1rem;
            `;
            
            const bar = document.createElement('div');
            const percentage = (item.tamanho / maxTamanho) * 100;
            bar.style.cssText = `
                height: 100%;
                width: ${percentage}%;
                background: ${item.cor};
                transition: width 0.5s ease;
            `;
            
            const value = document.createElement('div');
            value.textContent = `${item.tamanho} MB`;
            value.style.cssText = `
                width: 80px;
                text-align: right;
                font-weight: 500;
            `;
            
            barContainer.appendChild(bar);
            barItem.appendChild(label);
            barItem.appendChild(barContainer);
            barItem.appendChild(value);
            barChartContainer.appendChild(barItem);
        });
        
        analyticsView.appendChild(barChartContainer);
    }
    
    atualizarEstatisticas() {
        const statsContainer = document.getElementById('storageStats');
        if (!statsContainer) return;
        
        const totalTamanho = this.dados.reduce((sum, item) => sum + item.tamanho, 0);
        const totalArquivos = this.dados.reduce((sum, item) => sum + item.arquivos, 0);
        const mediaArquivos = Math.round(totalArquivos / this.dados.length);
        const maiorCategoria = this.dados.reduce((max, item) => 
            item.tamanho > max.tamanho ? item : max
        );
        
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
                    <h4 style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">Total de Arquivos</h4>
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
    atualizarDados() {
        this.dados = this.gerarDadosSimulados();
        this.criarGraficos();
    }
}

// Função para calcular tamanho real de imagens (quando disponível)
class CalculadorTamanho {
    constructor() {
        this.tamanhoTotal = 0;
        this.arquivosProcessados = 0;
    }
    
    async calcularTamanhoImagens() {
        const imagens = document.querySelectorAll('img');
        const promises = Array.from(imagens).map(img => this.obterTamanhoImagem(img));
        
        try {
            const tamanhos = await Promise.all(promises);
            this.tamanhoTotal = tamanhos.reduce((sum, size) => sum + size, 0);
            this.atualizarDisplay();
        } catch (error) {
            console.log('Erro ao calcular tamanhos:', error);
        }
    }
    
    async obterTamanhoImagem(img) {
        return new Promise((resolve) => {
            if (img.complete) {
                this.calcularTamanhoElemento(img).then(resolve);
            } else {
                img.onload = () => this.calcularTamanhoElemento(img).then(resolve);
                img.onerror = () => resolve(0);
            }
        });
    }
    
    async calcularTamanhoElemento(img) {
        try {
            const response = await fetch(img.src, { method: 'HEAD' });
            const contentLength = response.headers.get('content-length');
            return contentLength ? parseInt(contentLength) : 0;
        } catch {
            // Fallback: estimar baseado nas dimensões
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            
            try {
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                return imageData.data.length; // Aproximação em bytes
            } catch {
                return 0;
            }
        }
    }
    
    atualizarDisplay() {
        const displayElements = document.querySelectorAll('#storageUsed, #pathStoragePercent');
        const tamanhoMB = (this.tamanhoTotal / (1024 * 1024)).toFixed(2);
        
        displayElements.forEach(element => {
            if (element.id === 'storageUsed') {
                element.textContent = `${tamanhoMB} MB calculados`;
            }
        });
    }
}

// Exportar para uso global
window.GraficosAnalise = GraficosAnalise;
window.CalculadorTamanho = CalculadorTamanho;

