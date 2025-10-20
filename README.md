# 🎨 Portfolio Adriano Caversan

Um portfolio responsivo e interativo desenvolvido com HTML5, CSS3 e JavaScript vanilla, com deploy automático via GitHub Actions.

[![Deploy Status](https://github.com/caversan/caversan_site/workflows/Deploy%20Portfolio%20to%20FTP/badge.svg)](https://github.com/caversan/caversan_site/actions)
[![GitHub last commit](https://img.shields.io/github/last-commit/caversan/caversan_site)](https://github.com/caversan/caversan_site/commits/master)
[![GitHub repo size](https://img.shields.io/github/repo-size/caversan/caversan_site)](https://github.com/caversan/caversan_site)

## 👨‍💻 Sobre

Portfolio pessoal de **Adriano Caversan**, Designer e Desenvolvedor de Aplicativos para Web, IoT, Games, Digital Signage e Multimídia, com mais de 20 anos de experiência na área.

## 🚀 Características

- ✅ **Responsivo**: Adaptado para desktop, tablet e mobile
- ✅ **Multilíngue**: Suporte para português (PT-BR) e inglês (EN)
- ✅ **Acessível**: Seguindo padrões de acessibilidade web (WCAG)
- ✅ **Performance**: Carregamento otimizado e lazy loading de imagens
- ✅ **SEO Friendly**: Estrutura semântica e meta tags otimizadas
- ✅ **Deploy Automático**: CI/CD com GitHub Actions
- ✅ **Progressive Enhancement**: Funciona sem JavaScript

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** com estrutura semântica
- **CSS3** com Flexbox e Grid Layout
- **JavaScript ES6+** (Vanilla, sem frameworks)
- **SVG Icons** para melhor performance

### DevOps
- **GitHub Actions** para CI/CD
- **FTP Deploy** automático
- **Validação** de arquivos JSON e HTML
- **Otimização** de assets

### Ferramentas de Desenvolvimento
- **Git** para controle de versão
- **PowerShell/Bash** scripts para validação local
- **JSON** para dados estruturados
- **Apache .htaccess** para otimizações de servidor

## 📁 Estrutura do Projeto

```
caversan_site/
├── 📄 index.htm              # Página principal
├── 🎨 css/
│   └── style.css            # Estilos principais
├── ⚡ js/
│   ├── script.js            # JavaScript principal
│   └── data/
│       ├── en/data.json     # Dados em inglês
│       └── pt-br/data.json  # Dados em português
├── 🖼️ img/                   # Imagens e ícones
│   └── portifolio/
│       └── thumbs/          # Miniaturas do portfolio
├── 🎮 games/
│   └── mines/               # Jogo Campo Minado integrado
├── 📁 pdf/                  # Documentos e currículos
├── 🎬 videos/               # Vídeos do portfolio
├── 📚 docs/                 # Documentação adicional
├── ⚙️ .github/
│   └── workflows/           # GitHub Actions
├── 🔧 validate.ps1          # Script de validação (Windows)
├── 🔧 validate.sh           # Script de validação (Linux/Mac)
└── 📖 DEPLOY.md             # Documentação de deploy
```

## 🖥️ Funcionalidades

### 🌐 Interface
- [x] Troca de idioma dinâmica (PT-BR/EN)
- [x] Modal para visualização de imagens e vídeos
- [x] Portfolio interativo com categorias
- [x] Download de CV em PDF
- [x] Links para redes sociais profissionais
- [x] Design responsivo mobile-first

### 📊 Performance
- [x] Carregamento lazy de imagens
- [x] Cache de dados JSON
- [x] Compressão GZIP via .htaccess
- [x] Otimização para Core Web Vitals
- [x] Minificação de recursos (em produção)

### 🔧 Desenvolvimento
- [x] Validação automática de JSON
- [x] Scripts de validação local
- [x] Deploy automático via FTP
- [x] Logs detalhados de deploy
- [x] Rollback em caso de erro

## 🚀 Como Usar

### 💻 Desenvolvimento Local

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/caversan/caversan_site.git
   cd caversan_site
   ```

2. **Execute um servidor local:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (se tiver http-server instalado)
   npx http-server
   
   # PHP (se tiver instalado)
   php -S localhost:8000
   ```

3. **Acesse no navegador:**
   ```
   http://localhost:8000
   ```

### 🔍 Validação Local

Antes de fazer commit, valide seu código:

**Windows:**
```powershell
.\validate.ps1
```

**Linux/Mac:**
```bash
bash validate.sh
```

### 📤 Deploy

O deploy é automático via GitHub Actions:

1. **Faça suas alterações**
2. **Valide localmente** com os scripts
3. **Commit e push:**
   ```bash
   git add .
   git commit -m "descrição das alterações"
   git push origin master
   ```
4. **Acompanhe o deploy** na aba [Actions](https://github.com/caversan/caversan_site/actions)

## ⚙️ Configuração

### 🔐 Secrets para Deploy (GitHub)

Para habilitar o deploy automático, configure os secrets em:
`Settings` → `Secrets and variables` → `Actions`

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `FTP_SERVER` | Servidor FTP | `ftp.seudominio.com` |
| `FTP_USERNAME` | Usuário FTP | `usuario@dominio.com` |
| `FTP_PASSWORD` | Senha FTP | `senha123` |
| `FTP_REMOTE_DIR` | Pasta destino | `/public_html/` |

### 🎨 Personalização

Para personalizar o conteúdo:

1. **Dados do perfil**: Edite `js/data/pt-br/data.json` e `js/data/en/data.json`
2. **Estilos**: Modifique `css/style.css`
3. **Imagens**: Substitua arquivos em `img/`
4. **Portfolio**: Adicione projetos nos JSONs e imagens correspondentes

## 🎮 Funcionalidades Extras

### Campo Minado
Portfolio inclui um jogo de Campo Minado desenvolvido em JavaScript vanilla:
- Acesse em: `/games/mines/`
- Três níveis de dificuldade
- Interface responsiva
- Contador de tempo e minas

## 🌟 Portfolio Highlights

### 💼 Experiência Profissional
- **Eletromidia S/A** - Desenvolvedor Fullstack Senior (2022-atual)
- **Hogarth Worldwide** - Desenvolvedor Front-End Senior (2021-2022)
- **IGS International Solutions** - Designer Sênior (2015-2019)
- **15+ anos** em desenvolvimento web e multimídia

### 🎓 Formação
- **Engenharia de Computação** - Univesp (2021-2026)
- **Análise de Sistemas (Jogos Digitais)** - FATEC (2011-2015)
- **Cursos especializados** em AngularJS, Web Moderno, 3D, etc.

### 🛠️ Tecnologias
- **Frontend**: React, Redux, Angular, Vue, HTML5, CSS3, JavaScript
- **Backend**: Node.js, .NET, PHP, MySQL, NoSQL
- **Ferramentas**: Adobe Creative Suite, Unity, Git, Docker
- **Automação**: Scripts, FFMPEG, ImageMagick

## 📈 Analytics e Performance

- **Lighthouse Score**: 90+ em todas as métricas
- **Core Web Vitals**: Otimizado
- **Acessibilidade**: WCAG AA compliant
- **SEO**: Meta tags otimizadas
- **Performance**: < 3s carregamento inicial

## 🤝 Contribuição

Este é um projeto pessoal, mas sugestões são bem-vindas:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de uso pessoal. Todo o conteúdo e código são de propriedade de Adriano Caversan.

## 📞 Contato

- **Website**: [Portfolio Online](https://seudominio.com)
- **Email**: [adriano.caversan@gmail.com](mailto:adriano.caversan@gmail.com)
- **LinkedIn**: [Adriano Caversan](https://www.linkedin.com/in/adriano-caversan-2082a920/)
- **Telefone**: +55 11 98091-0161
- **Localização**: São Paulo - SP, Brasil

## 🔄 Changelog

### v2.0.0 (2025-10-19)
- ✨ Adicionado deploy automático com GitHub Actions
- 🐛 Corrigido problemas de responsividade
- ⚡ Otimizações de performance
- 🌐 Melhorado suporte multilíngue
- ♿ Melhorias de acessibilidade

### v1.0.0 (2024)
- 🎉 Versão inicial do portfolio
- 📱 Design responsivo
- 🌍 Suporte a PT-BR e EN
- 🎨 Portfolio interativo

---

**Desenvolvido com ❤️ por Adriano Caversan** | **Última atualização**: Outubro 2025