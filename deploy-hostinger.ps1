# Script para Build e Preparação para Deploy na Hostinger
# Execute: .\deploy-hostinger.ps1

Write-Host "`n=== BUILD E DEPLOY - HOSTINGER ===" -ForegroundColor Cyan
Write-Host ""

# 1. Limpar build anterior
Write-Host "[1/5] Limpando build anterior..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "  ✓ Pasta dist removida" -ForegroundColor Green
}
if (Test-Path "deploy-hostinger.zip") {
    Remove-Item -Force deploy-hostinger.zip
    Write-Host "  ✓ ZIP anterior removido" -ForegroundColor Green
}

# 2. Build da aplicação
Write-Host "`n[2/5] Executando build de produção..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n✗ ERRO no build!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Build concluído com sucesso!" -ForegroundColor Green

# 3. Verificar estrutura
Write-Host "`n[3/5] Verificando estrutura de arquivos..." -ForegroundColor Yellow
$requiredFiles = @(
    "dist/index.html",
    "dist/.htaccess",
    "dist/robots.txt",
    "dist/sitemap.xml"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (não encontrado)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "`n⚠ Alguns arquivos estão faltando!" -ForegroundColor Yellow
}

# 4. Criar ZIP para upload
Write-Host "`n[4/5] Criando arquivo ZIP para upload..." -ForegroundColor Yellow
Compress-Archive -Path "dist\*" -DestinationPath "deploy-hostinger.zip" -Force
Write-Host "  ✓ Arquivo criado: deploy-hostinger.zip" -ForegroundColor Green

# 5. Estatísticas
Write-Host "`n[5/5] Estatísticas do build:" -ForegroundColor Yellow
$distSize = (Get-ChildItem -Path dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "  • Tamanho total: $([math]::Round($distSize, 2)) MB" -ForegroundColor Cyan

$fileCount = (Get-ChildItem -Path dist -Recurse -File).Count
Write-Host "  • Total de arquivos: $fileCount" -ForegroundColor Cyan

$zipSize = (Get-Item "deploy-hostinger.zip").Length / 1MB
Write-Host "  • Tamanho do ZIP: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan

# Resumo final
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "✓ BUILD CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Cyan

Write-Host "`nPRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Faça backup do site antigo na Hostinger" -ForegroundColor White
Write-Host "2. Limpe a pasta public_html/" -ForegroundColor White
Write-Host "3. Opção A - Upload manual:" -ForegroundColor White
Write-Host "   • Extraia o conteúdo de 'dist\' localmente" -ForegroundColor Gray
Write-Host "   • Faça upload via File Manager ou FTP" -ForegroundColor Gray
Write-Host "4. Opção B - Upload do ZIP:" -ForegroundColor White
Write-Host "   • Envie 'deploy-hostinger.zip' para public_html/" -ForegroundColor Gray
Write-Host "   • Extraia via File Manager da Hostinger" -ForegroundColor Gray
Write-Host "5. Teste todas as rotas do site" -ForegroundColor White
Write-Host "   • https://svicerostudio.com.br/" -ForegroundColor Gray
Write-Host "   • https://svicerostudio.com.br/agenda" -ForegroundColor Gray
Write-Host "   • https://svicerostudio.com.br/servico-front-end" -ForegroundColor Gray
Write-Host "   • https://svicerostudio.com.br/servico-ui-design" -ForegroundColor Gray
Write-Host "   • https://svicerostudio.com.br/servico-identidade-visual" -ForegroundColor Gray
Write-Host "   • https://svicerostudio.com.br/login" -ForegroundColor Gray
Write-Host "   • https://svicerostudio.com.br/admin/projetos (após login)" -ForegroundColor Gray

Write-Host "`n⚠ IMPORTANTE:" -ForegroundColor Yellow
Write-Host "  • As variáveis do .env foram incluídas no build automaticamente" -ForegroundColor White
Write-Host "  • Limpe o cache do navegador após o deploy" -ForegroundColor White
Write-Host "  • Verifique se o .htaccess está funcionando" -ForegroundColor White
Write-Host "  • Teste em modo anônimo/privado" -ForegroundColor White
Write-Host "  • Teste o sistema de projetos (Home deve mostrar projetos do banco)" -ForegroundColor White
Write-Host "  • Teste o login e acesso à área admin" -ForegroundColor White

Write-Host "`n"
