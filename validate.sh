#!/bin/bash

# Script para validação local antes do deploy
# Execute: bash validate.sh

echo "🔍 Validando projeto antes do deploy..."
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
ERRORS=0
WARNINGS=0

# Função para imprimir status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ((ERRORS++))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. Verificar estrutura de arquivos
echo -e "\n${BLUE}1. Verificando estrutura de arquivos...${NC}"

required_files=(
    "index.htm"
    "css/style.css"
    "js/script.js"
    "js/data/pt-br/data.json"
    "js/data/en/data.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "Arquivo encontrado: $file"
    else
        print_status 1 "Arquivo obrigatório não encontrado: $file"
    fi
done

# 2. Validar arquivos JSON
echo -e "\n${BLUE}2. Validando arquivos JSON...${NC}"

for json_file in js/data/*/*.json; do
    if [ -f "$json_file" ]; then
        if python3 -m json.tool "$json_file" > /dev/null 2>&1; then
            print_status 0 "JSON válido: $json_file"
        else
            print_status 1 "JSON inválido: $json_file"
        fi
    fi
done

# 3. Verificar HTML básico
echo -e "\n${BLUE}3. Verificando estrutura HTML...${NC}"

if [ -f "index.htm" ]; then
    if grep -q "<!DOCTYPE" index.htm; then
        print_status 0 "DOCTYPE encontrado"
    else
        print_status 1 "DOCTYPE não encontrado"
    fi
    
    if grep -q "</html>" index.htm; then
        print_status 0 "Tag de fechamento HTML encontrada"
    else
        print_status 1 "Tag de fechamento HTML não encontrada"
    fi
    
    if grep -q "<meta charset" index.htm; then
        print_status 0 "Charset definido"
    else
        print_warning "Charset não definido explicitamente"
    fi
    
    if grep -q "viewport" index.htm; then
        print_status 0 "Viewport configurado"
    else
        print_warning "Viewport não configurado"
    fi
fi

# 4. Verificar CSS
echo -e "\n${BLUE}4. Verificando CSS...${NC}"

if [ -f "css/style.css" ]; then
    css_size=$(stat -f%z "css/style.css" 2>/dev/null || stat -c%s "css/style.css" 2>/dev/null)
    if [ "$css_size" -gt 0 ]; then
        print_status 0 "Arquivo CSS não está vazio (${css_size} bytes)"
    else
        print_status 1 "Arquivo CSS está vazio"
    fi
    
    # Verificar se há regras CSS básicas
    if grep -q "body\|html\|\..*{" css/style.css; then
        print_status 0 "Regras CSS encontradas"
    else
        print_warning "Poucas regras CSS encontradas"
    fi
fi

# 5. Verificar JavaScript
echo -e "\n${BLUE}5. Verificando JavaScript...${NC}"

if [ -f "js/script.js" ]; then
    js_size=$(stat -f%z "js/script.js" 2>/dev/null || stat -c%s "js/script.js" 2>/dev/null)
    if [ "$js_size" -gt 0 ]; then
        print_status 0 "Arquivo JavaScript não está vazio (${js_size} bytes)"
    else
        print_status 1 "Arquivo JavaScript está vazio"
    fi
    
    # Verificar sintaxe básica
    if command -v node >/dev/null 2>&1; then
        if node -c js/script.js 2>/dev/null; then
            print_status 0 "Sintaxe JavaScript válida"
        else
            print_status 1 "Erro de sintaxe JavaScript"
        fi
    else
        print_warning "Node.js não instalado - não foi possível verificar sintaxe JS"
    fi
fi

# 6. Verificar imagens
echo -e "\n${BLUE}6. Verificando imagens...${NC}"

img_count=$(find img -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.svg" \) 2>/dev/null | wc -l)
if [ "$img_count" -gt 0 ]; then
    print_status 0 "Encontradas $img_count imagens"
    
    # Verificar tamanhos grandes
    large_images=$(find img -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -size +1M 2>/dev/null)
    if [ -n "$large_images" ]; then
        print_warning "Imagens grandes encontradas (>1MB):"
        echo "$large_images" | while read -r img; do
            size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
            size_mb=$((size / 1024 / 1024))
            echo "  - $img (${size_mb}MB)"
        done
    fi
else
    print_warning "Nenhuma imagem encontrada na pasta img/"
fi

# 7. Verificar arquivos de configuração
echo -e "\n${BLUE}7. Verificando configurações...${NC}"

if [ -f ".htaccess" ] || [ -f ".htaccess-new" ]; then
    print_status 0 "Arquivo .htaccess encontrado"
else
    print_warning "Arquivo .htaccess não encontrado"
fi

if [ -f ".gitignore" ]; then
    print_status 0 "Arquivo .gitignore encontrado"
else
    print_warning "Arquivo .gitignore não encontrado"
fi

# 8. Verificar Git
echo -e "\n${BLUE}8. Verificando status Git...${NC}"

if git rev-parse --git-dir > /dev/null 2>&1; then
    print_status 0 "Repositório Git inicializado"
    
    # Verificar se há mudanças não commitadas
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        print_status 0 "Não há mudanças não commitadas"
    else
        print_warning "Há mudanças não commitadas"
        echo "  Execute: git add . && git commit -m 'suas alterações'"
    fi
    
    # Verificar se há commits para push
    if git diff --quiet HEAD @{u} 2>/dev/null; then
        print_info "Repositório está sincronizado com origin"
    else
        print_warning "Há commits locais não enviados para origin"
        echo "  Execute: git push"
    fi
else
    print_status 1 "Não é um repositório Git"
fi

# 9. Relatório final
echo -e "\n${BLUE}📊 Relatório Final${NC}"
echo "=================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Tudo perfeito! Projeto pronto para deploy.${NC}"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS avisos encontrados, mas projeto pode ser deployado.${NC}"
else
    echo -e "${RED}❌ $ERRORS erros encontrados! Corrija antes do deploy.${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}   Também há $WARNINGS avisos.${NC}"
    fi
fi

echo -e "\n${BLUE}💡 Próximos passos:${NC}"
if [ $ERRORS -eq 0 ]; then
    echo "1. Execute: git add ."
    echo "2. Execute: git commit -m 'ready for deploy'"
    echo "3. Execute: git push origin master"
    echo "4. Acompanhe o deploy em: https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
else
    echo "1. Corrija os erros listados acima"
    echo "2. Execute este script novamente"
    echo "3. Só então faça o commit e push"
fi

# Código de saída
exit $ERRORS