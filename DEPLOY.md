# Configuração de Deploy Automático via FTP

Este repositório está configurado para fazer deploy automático via FTP sempre que houver push na branch `master`.

## 🔧 Configuração de Secrets

Para que o deploy funcione, você precisa configurar os seguintes secrets no GitHub:

### Acesse: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### Secrets Obrigatórios:

| Secret Name | Descrição | Exemplo |
|-------------|-----------|---------|
| `FTP_SERVER` | Endereço do servidor FTP | `ftp.seudominio.com` |
| `FTP_USERNAME` | Usuário do FTP | `usuario@seudominio.com` |
| `FTP_PASSWORD` | Senha do FTP | `suasenhasegura` |

### Secrets Opcionais:

| Secret Name | Descrição | Padrão | Exemplo |
|-------------|-----------|--------|---------|
| `FTP_REMOTE_DIR` | Diretório remoto de destino | `/` | `/public_html/` |
| `FTP_PORT` | Porta do servidor FTP | `21` | `21` |
| `FTP_PROTOCOL` | Protocolo (ftp, ftps, sftp) | `ftp` | `ftp` |
| `SITE_URL` | URL do site para verificação | - | `https://seusite.com` |

## 🚀 Como Funciona

### Triggers Automáticos:
- ✅ Push na branch `master` ou `main`
- ✅ Pull Request fechado (merged)
- ✅ Execução manual via GitHub Actions

### O que o deploy faz:
1. **Validação**: Verifica se arquivos JSON e HTML são válidos
2. **Otimização**: Comprime imagens e minifica CSS/JS
3. **Preparação**: Organiza arquivos para deploy
4. **Upload**: Envia arquivos via FTP
5. **Verificação**: Testa se o site está acessível
6. **Notificação**: Informa sobre sucesso ou falha

### Arquivos enviados:
- `index.htm`
- `css/` (com arquivos minificados)
- `js/` (com arquivos minificados)
- `img/`
- `games/`
- `pdf/`
- `videos/`
- `docs/`
- `.htaccess` (otimizado)

### Arquivos NÃO enviados:
- `.git/`
- `.github/`
- `README.md`
- `.gitignore`
- `node_modules/`
- Arquivos temporários

## 📋 Passo a Passo para Configurar

### 1. Configure os Secrets
```bash
# No GitHub, vá para:
# Settings → Secrets and variables → Actions → New repository secret

# Adicione cada secret listado acima
```

### 2. Teste o Deploy
```bash
# Faça qualquer alteração e push:
git add .
git commit -m "test: trigger deploy"
git push origin master

# Acompanhe o progresso em:
# Actions → Deploy Portfolio to Production
```

### 3. Verificar Logs
- Acesse a aba **Actions** do repositório
- Clique no workflow **Deploy Portfolio to Production**
- Veja logs detalhados de cada etapa

## 🛠️ Workflows Disponíveis

### 1. `deploy.yml` (Básico)
- Deploy simples e direto
- Ideal para começar rapidamente
- Menos validações

### 2. `deploy-advanced.yml` (Recomendado)
- Validações completas
- Otimização de assets
- Verificações pós-deploy
- Notificações detalhadas
- Estratégia de retry

## 🔍 Troubleshooting

### Deploy falhou?
1. Verifique se todos os secrets estão configurados
2. Confirme as credenciais FTP
3. Verifique se o diretório remoto existe
4. Veja os logs detalhados na aba Actions

### Site não carregou após deploy?
1. Aguarde alguns minutos para propagação
2. Verifique se o `.htaccess` foi aplicado
3. Teste manualmente via FTP
4. Verifique permissões de arquivos

### Secrets não funcionam?
1. Secrets são case-sensitive
2. Não use aspas nos valores
3. Evite espaços em branco extras
4. Re-digite senhas complexas

## 📞 Suporte

Para problemas específicos:
1. Verifique logs da Action
2. Teste credenciais FTP manualmente
3. Valide arquivos JSON localmente
4. Consulte documentação do GitHub Actions

## 🔄 Atualizações

Para atualizar os workflows:
1. Edite arquivos em `.github/workflows/`
2. Commit e push as alterações
3. Workflows são atualizados automaticamente

---

**Última atualização**: $(date)
**Versão**: 1.0.0