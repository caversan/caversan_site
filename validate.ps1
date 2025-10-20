# Script de validação para Windows PowerShell
# Execute: .\validate.ps1

Write-Host "🔍 Validando projeto antes do deploy..." -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue

$Errors = 0
$Warnings = 0

function Write-Success($message) {
    Write-Host "✅ $message" -ForegroundColor Green
}

function Write-Error($message) {
    Write-Host "❌ $message" -ForegroundColor Red
    $script:Errors++
}

function Write-Warning($message) {
    Write-Host "⚠️  $message" -ForegroundColor Yellow
    $script:Warnings++
}

function Write-Info($message) {
    Write-Host "ℹ️  $message" -ForegroundColor Cyan
}

# 1. Verificar estrutura de arquivos
Write-Host "`n1. Verificando estrutura de arquivos..." -ForegroundColor Blue

$requiredFiles = @(
    "index.htm",
    "css\style.css",
    "js\script.js",
    "js\data\pt-br\data.json",
    "js\data\en\data.json"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Success "Arquivo encontrado: $file"
    } else {
        Write-Error "Arquivo obrigatório não encontrado: $file"
    }
}

# 2. Validar arquivos JSON
Write-Host "`n2. Validando arquivos JSON..." -ForegroundColor Blue

$jsonFiles = Get-ChildItem -Path "js\data" -Recurse -Filter "*.json" -ErrorAction SilentlyContinue

foreach ($jsonFile in $jsonFiles) {
    try {
        $content = Get-Content $jsonFile.FullName -Raw | ConvertFrom-Json
        Write-Success "JSON válido: $($jsonFile.FullName)"
    }
    catch {
        Write-Error "JSON inválido: $($jsonFile.FullName) - $($_.Exception.Message)"
    }
}

# 3. Verificar HTML básico
Write-Host "`n3. Verificando estrutura HTML..." -ForegroundColor Blue

if (Test-Path "index.htm") {
    $htmlContent = Get-Content "index.htm" -Raw
    
    if ($htmlContent -match "<!DOCTYPE") {
        Write-Success "DOCTYPE encontrado"
    } else {
        Write-Error "DOCTYPE não encontrado"
    }
    
    if ($htmlContent -match "</html>") {
        Write-Success "Tag de fechamento HTML encontrada"
    } else {
        Write-Error "Tag de fechamento HTML não encontrada"
    }
    
    if ($htmlContent -match "<meta charset") {
        Write-Success "Charset definido"
    } else {
        Write-Warning "Charset não definido explicitamente"
    }
    
    if ($htmlContent -match "viewport") {
        Write-Success "Viewport configurado"
    } else {
        Write-Warning "Viewport não configurado"
    }
}

# 4. Verificar CSS
Write-Host "`n4. Verificando CSS..." -ForegroundColor Blue

if (Test-Path "css\style.css") {
    $cssFile = Get-Item "css\style.css"
    if ($cssFile.Length -gt 0) {
        Write-Success "Arquivo CSS não está vazio ($($cssFile.Length) bytes)"
    } else {
        Write-Error "Arquivo CSS está vazio"
    }
    
    $cssContent = Get-Content "css\style.css" -Raw
    if ($cssContent -match "body|html|\..*\{") {
        Write-Success "Regras CSS encontradas"
    } else {
        Write-Warning "Poucas regras CSS encontradas"
    }
}

# 5. Verificar JavaScript
Write-Host "`n5. Verificando JavaScript..." -ForegroundColor Blue

if (Test-Path "js\script.js") {
    $jsFile = Get-Item "js\script.js"
    if ($jsFile.Length -gt 0) {
        Write-Success "Arquivo JavaScript não está vazio ($($jsFile.Length) bytes)"
    } else {
        Write-Error "Arquivo JavaScript está vazio"
    }
    
    # Verificar sintaxe básica (verificação simples)
    $jsContent = Get-Content "js\script.js" -Raw
    if ($jsContent -match "function|const|let|var|\{") {
        Write-Success "Estrutura JavaScript encontrada"
    } else {
        Write-Warning "Estrutura JavaScript básica não encontrada"
    }
}

# 6. Verificar imagens
Write-Host "`n6. Verificando imagens..." -ForegroundColor Blue

if (Test-Path "img") {
    $images = Get-ChildItem -Path "img" -Recurse -Include "*.jpg","*.jpeg","*.png","*.gif","*.svg" -ErrorAction SilentlyContinue
    if ($images.Count -gt 0) {
        Write-Success "Encontradas $($images.Count) imagens"
        
        # Verificar tamanhos grandes
        $largeImages = $images | Where-Object { $_.Length -gt 1MB }
        if ($largeImages.Count -gt 0) {
            Write-Warning "Imagens grandes encontradas (>1MB):"
            foreach ($img in $largeImages) {
                $sizeMB = [math]::Round($img.Length / 1MB, 2)
                Write-Host "  - $($img.FullName) (${sizeMB}MB)" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Warning "Nenhuma imagem encontrada na pasta img\"
    }
} else {
    Write-Warning "Pasta img\ não encontrada"
}

# 7. Verificar arquivos de configuração
Write-Host "`n7. Verificando configurações..." -ForegroundColor Blue

if ((Test-Path ".htaccess") -or (Test-Path ".htaccess-new")) {
    Write-Success "Arquivo .htaccess encontrado"
} else {
    Write-Warning "Arquivo .htaccess não encontrado"
}

if (Test-Path ".gitignore") {
    Write-Success "Arquivo .gitignore encontrado"
} else {
    Write-Warning "Arquivo .gitignore não encontrado"
}

# 8. Verificar Git
Write-Host "`n8. Verificando status Git..." -ForegroundColor Blue

try {
    $gitStatus = git status --porcelain 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Repositório Git inicializado"
        
        if ([string]::IsNullOrEmpty($gitStatus)) {
            Write-Success "Não há mudanças não commitadas"
        } else {
            Write-Warning "Há mudanças não commitadas"
            Write-Host "  Execute: git add . && git commit -m 'suas alterações'" -ForegroundColor Yellow
        }
        
        # Verificar commits pendentes
        try {
            $ahead = git rev-list --count HEAD @{u}..HEAD 2>$null
            if ($LASTEXITCODE -eq 0 -and $ahead -eq "0") {
                Write-Info "Repositório está sincronizado com origin"
            } else {
                Write-Warning "Há commits locais não enviados para origin"
                Write-Host "  Execute: git push" -ForegroundColor Yellow
            }
        } catch {
            Write-Info "Não foi possível verificar status do remote"
        }
    } else {
        Write-Error "Não é um repositório Git"
    }
} catch {
    Write-Error "Git não está disponível ou não é um repositório Git"
}

# 9. Relatório final
Write-Host "`n📊 Relatório Final" -ForegroundColor Blue
Write-Host "==================" -ForegroundColor Blue

if ($Errors -eq 0 -and $Warnings -eq 0) {
    Write-Host "🎉 Tudo perfeito! Projeto pronto para deploy." -ForegroundColor Green
} elseif ($Errors -eq 0) {
    Write-Host "⚠️  $Warnings avisos encontrados, mas projeto pode ser deployado." -ForegroundColor Yellow
} else {
    Write-Host "❌ $Errors erros encontrados! Corrija antes do deploy." -ForegroundColor Red
    if ($Warnings -gt 0) {
        Write-Host "   Também há $Warnings avisos." -ForegroundColor Yellow
    }
}

Write-Host "`n💡 Próximos passos:" -ForegroundColor Blue
if ($Errors -eq 0) {
    Write-Host "1. Execute: git add ." -ForegroundColor Cyan
    Write-Host "2. Execute: git commit -m 'ready for deploy'" -ForegroundColor Cyan
    Write-Host "3. Execute: git push origin master" -ForegroundColor Cyan
    
    try {
        $repoUrl = git remote get-url origin 2>$null
        if ($LASTEXITCODE -eq 0) {
            $repoPath = $repoUrl -replace ".*github\.com[:/](.*)\.git", '$1'
            Write-Host "4. Acompanhe o deploy em: https://github.com/$repoPath/actions" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "4. Acompanhe o deploy na aba Actions do GitHub" -ForegroundColor Cyan
    }
} else {
    Write-Host "1. Corrija os erros listados acima" -ForegroundColor Cyan
    Write-Host "2. Execute este script novamente" -ForegroundColor Cyan
    Write-Host "3. Só então faça o commit e push" -ForegroundColor Cyan
}

# Pausar para leitura (opcional)
Write-Host "`nPressione qualquer tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

exit $Errors