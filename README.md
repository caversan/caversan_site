# Portfólio — Adriano Caversan

Portfólio profissional de **Adriano Caversan — Engenheiro de Computação, Desenvolvedor Fullstack e Designer Multimídia**, desenvolvido com HTML, CSS e JavaScript, com conteúdo em português e inglês.

[Visite o portfólio](https://caversan.com.br) · [LinkedIn](https://www.linkedin.com/in/adriano-caversan/) · [GitHub](https://github.com/caversan) · [Currículo Lattes](https://lattes.cnpq.br/3152582220289760)

## Sobre

Profissional generalista com mais de 25 anos de atuação em tecnologia, desenvolvimento e engenharia de software para web e multimídia. Experiência como UX/UI Designer, Motion Designer e Desenvolvedor Fullstack em desenvolvimento web, jogos, audiovisual, publicidade, sinalização digital e varejo on-line.

Atuação em aplicações web com foco em frontend, backend e microsserviços, além de sistemas para internet das coisas, cidades inteligentes e automação residencial e comercial. Engenheiro de Computação com MBA em Engenharia de Software e CREA-SP ativo, localizado em **Osasco — SP**.

Os dados profissionais deste resumo seguem o [conteúdo em português do portfólio](js/data/pt-br/data.json).

## Áreas de atuação

- **Web e software:** HTML5, CSS3, JavaScript, React, Redux, Node.js, Python, PHP, bancos SQL e NoSQL, autenticação e mensageria.
- **Infraestrutura e automação:** AWS, GCP, OCI, containers, Kubernetes, infraestrutura como código, DevOps, CI/CD e scripts para Linux e Windows.
- **Desktop e sistemas embarcados:** .NET, Electron, C, C++, C# e Python.
- **IoT:** eletrônica, firmware, sensores, atuadores e sistemas de automação e controle.
- **Multimídia e DOOH:** sinalização digital, streaming, players, processamento audiovisual e automação de mídia.
- **Design e jogos:** UX/UI, motion design, ferramentas Adobe, Figma, Blender, Spine, Godot, Unreal e Unity.
- **Perícia judicial:** atuação nas áreas de Engenharia de Computação e Engenharia de Software, conforme os cadastros informados no portfólio.

## Experiência profissional

| Empresa | Cargo | Período |
| --- | --- | --- |
| In-Haus Industrial — Grupo GPS | Especialista em Sistemas | mar/2026–out/2026 |
| Whirlpool S.A. | Analyst, Information System | dez/2025–mar/2026 |
| Eletromidia S/A — Rede Globo | Desenvolvedor Frontend Sênior | nov/2022–mar/2025 |
| Hogarth Worldwide — WPP Group | Desenvolvedor Frontend Sênior | jun/2021–out/2022 |
| IGS International Solutions — Ortiz Gaming | Designer Sênior / Líder de Artistas Técnicos | set/2015–nov/2019 |
| Atmo Mídia Digital Corporativa | Programador Flash | set/2013–set/2015 |
| Unidas Rent a Car | Analista de Marketing Digital | jun/2013–set/2013 |
| Elemidia Empresas — Grupo Abril | Programador | ago/2007–mai/2013 |

Experiências anteriores, entre 2000 e 2007, em editoras gráficas, agências de publicidade e projetos freelance de web design, multimídia e desenvolvimento frontend.

Entre os projetos recentes estão soluções de kanban, apontamento de produção e cardápio digital para restaurantes industriais no Grupo GPS, com React, Tauri (Rust), Node.js, SSE e Azure; e desenvolvimento de lojas VTEX para Consul, Brastemp, KitchenAid e Compra Certa na Whirlpool.

## Formação

| Formação | Instituição | Período / situação |
| --- | --- | --- |
| Pós-graduação — Medição, Análise, Previsão e Modelagem do Nível do Mar — Oceanografia Física e Química | USP/IOUSP | mar/2026–dez/2027, em andamento |
| MBA em Engenharia de Software | USP/ESALQ | fev/2024–dez/2025, concluído |
| Engenharia de Computação | Univesp | ago/2021–dez/2025, concluído |
| Bacharelado em Tecnologia da Informação — Internet das Coisas | Univesp | ago/2021–ago/2024, concluído |
| Tecnologia em Análise de Sistemas — ênfase em Jogos Digitais | FATEC | ago/2011–jul/2015, concluído |

O portfólio também apresenta cursos complementares em desenvolvimento, acessibilidade, dados, IA, cibersegurança, indústria, design e audiovisual, além do histórico de outras graduações não concluídas.

## Trabalhos apresentados

- **Banners publicitários:** peças estáticas e animadas produzidas entre 2020 e 2022.
- **Digital signage:** software de sinalização digital, rádio virtual e TV corporativa para Elemidia Empresas e Atmo.
- **Web:** Mantu, Porto Velho Bar, QuickSand, Bunny’s, Club B! e email marketing para Gigabyte.
- **Editoração gráfica:** manual WIDO, identidade visual Gelo Nevada, catálogo Citibank Club e revista Chora Brasil.

Os trabalhos são apresentados por meio de imagens, vídeos e PDFs.

## Currículos

- [Currículo em português — PDF](docs/adriano-caversan-engineer-ptbr.pdf)
- [Currículo em inglês — PDF](docs/adriano-caversan-engineer-en.pdf)

As versões editáveis em ODT estão na pasta `docs/`.

## O site

O portfólio usa **HTML5, CSS3 e JavaScript sem frameworks**, com dados carregados de arquivos JSON. Não há etapa de build ou instalação de dependências para servir a página principal.

Funcionalidades implementadas:

- Alternância de conteúdo entre português e inglês.
- Layout adaptado a diferentes tamanhos de tela.
- Seções de perfil, conhecimentos, formação, experiência e cursos.
- Trabalhos organizados por categoria.
- Modal para imagens e vídeos; abertura de PDFs em outra janela ou aba.
- Links para currículos e perfis profissionais.

O conteúdo principal depende de JavaScript e do carregamento dos JSONs por HTTP. Use um servidor local em vez de abrir o HTML diretamente pelo sistema de arquivos.

## Estrutura do projeto

```text
caversan_site/
├── index.html                 # Página principal
├── css/style.css              # Estilos do portfólio
├── js/
│   ├── script.js              # Conteúdo, idiomas e modal
│   └── data/
│       ├── pt-br/data.json     # Conteúdo em português
│       └── en/data.json        # Conteúdo em inglês
├── img/                       # Ícones, imagens e miniaturas
├── videos/                    # Vídeos dos trabalhos
├── pdf/                       # PDFs de trabalhos gráficos
├── docs/                      # Currículos em PDF e ODT
├── games/mines/               # Migração incompleta de jogo Flash para JS
├── .github/_BKP_workflows/     # Workflows arquivados
├── .htaccess                  # Arquivo de configuração Apache
├── _default.php               # Arquivo PHP adicional
├── validate.ps1               # Validação local em PowerShell
├── validate.sh                # Validação local em Bash
├── DEPLOY.md                   # Documentação de deploy a revisar antes do uso
└── README.md
```

O campo minado em `games/mines/` é um experimento legado de migração de Flash para JavaScript e ainda não é jogável no navegador.

## Executar localmente

Na pasta do projeto, com Python 3 instalado:

```bash
python -m http.server 8000
```

Em sistemas que usam o comando `python3`:

```bash
python3 -m http.server 8000
```

Acesse [http://localhost:8000](http://localhost:8000). Encerre o servidor com `Ctrl+C` no terminal.

## Validação local

**Windows / PowerShell:**

```powershell
.\validate.ps1
```

Se a política de execução local bloquear o script, execute com a liberação limitada ao processo:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\validate.ps1
```

**Linux, macOS ou Git Bash:**

```bash
bash validate.sh
```

Os scripts verificam arquivos obrigatórios, sintaxe dos JSONs, estrutura básica do HTML, presença de CSS e JavaScript, imagens grandes e situação local do Git. A verificação de sintaxe JavaScript usa Node.js; o script Bash também precisa de Python para validar os JSONs.

O código de saída é `0` quando não há erros e `1` quando uma verificação falha. Avisos são exibidos separadamente. As comparações com o upstream usam referências locais, sem executar `git fetch`.

Essas verificações são estáticas e não substituem testes no navegador, auditorias de acessibilidade ou medições de desempenho. O campo minado não faz parte das verificações de JavaScript do portfólio.

## Atualizar o conteúdo

1. Edite [os dados em português](js/data/pt-br/data.json) e [os dados em inglês](js/data/en/data.json), mantendo as duas versões alinhadas.
2. Para trabalhos, atualize `sections.portifolio.grid`, incluindo título, descrição, miniatura (`thumb`) e arquivo de conteúdo (`content`).
3. Coloque os arquivos correspondentes em `img/`, `videos/` ou `pdf/`.
4. Para atualizar currículos, substitua os PDFs em `docs/` e confira o campo `pdf` de cada JSON.
5. Execute o validador e confira a página, os dois idiomas e a abertura dos trabalhos no navegador.

Os estilos ficam em `css/style.css`; o carregamento dos dados e as interações ficam em `js/script.js`. Este README é um resumo manual e deve acompanhar alterações relevantes do perfil.

## Publicação

O site principal pode ser servido por uma hospedagem de arquivos estáticos, preservando a estrutura das pastas e usando `index.html` como página inicial.

Os arquivos de GitHub Actions estão arquivados em `.github/_BKP_workflows/`, portanto não ativam deploy automático nessa configuração. Antes de reativá-los, é necessário revisar os workflows, corrigir as referências antigas a `index.htm` e configurar o destino e as credenciais de publicação. O arquivo `DEPLOY.md` contém instruções anteriores que também precisam dessa revisão.

## Contato

- **Site:** [caversan.com.br](https://caversan.com.br)
- **Email:** [adriano.caversan@gmail.com](mailto:adriano.caversan@gmail.com)
- **LinkedIn:** [Adriano Caversan](https://www.linkedin.com/in/adriano-caversan/)
- **GitHub:** [caversan](https://github.com/caversan)
- **Lattes:** [Currículo Lattes](https://lattes.cnpq.br/3152582220289760)
- **Telefone / WhatsApp:** +55 11 98091-0161
- **Localização:** Osasco — SP, Brasil

## Uso

Projeto pessoal de Adriano Caversan. Este repositório não inclui uma licença de software livre.

---

Última atualização deste README: outubro de 2026.
