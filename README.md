# EX File Manager - Versão Web Protegida

## Descrição do Projeto

Este projeto é uma versão web avançada do EX File Manager com sistema de proteção por camadas e funcionalidades completas de gerenciamento de arquivos. O sistema simula um site em manutenção, mas na verdade funciona como um repositório privado protegido por senhas camufladas.

## Características Principais

### 🔒 Sistema de Proteção Dupla
- **Camada 1**: Tela de manutenção com trigger oculto na letra "m" de "melhorar"
- **Camada 2**: Segunda tela de proteção com trigger na letra "e" de "experiência"
- **Senhas camufladas**: As senhas estão integradas no próprio texto das mensagens
- **Acesso progressivo**: Cada camada deve ser desbloqueada sequencialmente

### 🎨 Interface Moderna
- Design inspirado em sistemas operacionais modernos
- Gradientes azuis e interface limpa
- Animações suaves e efeitos hover
- Layout responsivo para desktop e mobile
- Ícones modernos e tipografia elegante

### 📊 Análise de Dados
- Gráficos de pizza para visualização de uso de espaço
- Gráficos de barras para comparação entre categorias
- Estatísticas em tempo real
- Cálculo automático de tamanhos de arquivo
- Dashboard analítico completo

### 🔍 Funcionalidades de Busca
- Busca em tempo real no DOM local
- Destaque visual dos resultados encontrados
- Filtros por nome de pasta e ferramenta
- Interface de busca integrada

### 📁 Gerenciamento de Arquivos
- 32 categorias temáticas pré-definidas
- Estrutura de pastas organizada
- Informações detalhadas de cada pasta
- Navegação intuitiva entre diretórios
- Simulação de dados realistas

## Estrutura de Arquivos

```
ex-file-manager-web/
├── index.html          # Página principal com camadas de proteção
├── style.css           # Estilos modernos e responsivos
├── protecao.js         # Sistema de proteção e funcionalidades principais
├── chart.js            # Sistema de gráficos e análises
├── robots.txt          # Proteção contra indexação
└── README.md           # Esta documentação
```

## Como Usar

### 1. Acesso Inicial
1. Abra o arquivo `index.html` em um navegador
2. Você verá a primeira tela de "manutenção"
3. Clique na letra **"m"** da palavra "melhorar" para ativar o primeiro campo de senha
4. Digite: `melhorar` e pressione Enter

### 2. Segunda Camada
1. Após liberar a primeira camada, aparecerá a segunda tela
2. Clique na letra **"e"** da palavra "experiência"
3. Digite: `experiencia` e pressione Enter

### 3. Acesso ao Sistema
Após liberar ambas as camadas, você terá acesso ao sistema completo com:
- **Aba Home**: Cards de armazenamento, ferramentas e bookmarks
- **Aba Local**: Lista de pastas com informações detalhadas
- **Aba Analytics**: Gráficos e estatísticas de uso

## Funcionalidades Técnicas

### Proteção e Segurança
- Meta tags para evitar indexação por buscadores
- Arquivo robots.txt configurado
- Senhas camufladas no código (não expostas como variáveis óbvias)
- Sistema de triggers invisíveis
- Comentários camuflados para identificação

### Cálculo de Espaço
- Simulação realística de uso de armazenamento
- Cálculo dinâmico de porcentagens
- Atualização em tempo real dos indicadores
- Estimativas baseadas em dados simulados

### Interface Responsiva
- Grid adaptável para diferentes tamanhos de tela
- Navegação otimizada para mobile
- Elementos interativos com feedback visual
- Transições suaves entre estados

## Categorias de Pastas

O sistema inclui 32 categorias temáticas:
- artsystylecreative
- balletcore
- barbiecore
- bohochic
- casualcool
- cleangirl
- coquetteromânticomoderno
- cottagecore
- cowgirlchicwesternmodern
- darkfemininesensualmisteriosa
- ecofriendly
- glamrockstyle
- gothic
- gothicchic
- grungefemininoidie90s
- indiesleaze
- maximalistafashion
- minimalista
- outonoinverno
- preppymodernoestudantilchic
- punkfeminino
- quietluxuryluxodiscreto
- roupasdebanho
- scandistyle
- softgirlkawaii
- softgothic
- softofficesocial casual
- sportychicathleisure
- streetwearfeminino
- techwear feminino
- tomboyfeminino
- y2k

## Instalação e Hospedagem

### Hospedagem Local
```bash
# Usando Python
python3 -m http.server 8080

# Usando Node.js
npx serve .

# Usando PHP
php -S localhost:8080
```

### Hospedagem no GitHub Pages
1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos
3. Ative o GitHub Pages nas configurações
4. Acesse via URL fornecida pelo GitHub

### Hospedagem em Servidor Web
1. Faça upload dos arquivos para o diretório público do servidor
2. Certifique-se de que o arquivo robots.txt está na raiz
3. Configure HTTPS se necessário

## Personalização

### Alterando Senhas
Edite o arquivo `protecao.js` e modifique as variáveis:
```javascript
this.chaveAcesso1 = 'sua_nova_senha_1';
this.chaveAcesso2 = 'sua_nova_senha_2';
```

### Modificando Cores
Edite o arquivo `style.css` e altere as variáveis de cor nos gradientes.

### Adicionando Categorias
Modifique o array `estruturaPastas` no arquivo `protecao.js`.

## Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móveis (iOS/Android)

## Segurança e Privacidade

- Não indexado por mecanismos de busca
- Senhas não expostas em texto claro
- Sistema de acesso progressivo
- Proteção contra acesso não autorizado
- Interface camuflada como site em manutenção

## Suporte Técnico

Para problemas ou dúvidas:
1. Verifique o console do navegador para erros JavaScript
2. Certifique-se de que todos os arquivos estão no mesmo diretório
3. Teste em um servidor HTTP (não file://)
4. Verifique se o JavaScript está habilitado

## Licença

Este projeto é para uso pessoal e privado. Não redistribuir sem autorização.

---

**Nota**: Este é um sistema de proteção avançado. Mantenha as senhas em segurança e não compartilhe o acesso com terceiros não autorizados.

