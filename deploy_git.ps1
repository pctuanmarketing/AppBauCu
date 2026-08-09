# PowerShell Script tự động Commit và Push dự án App Bầu Cử
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  KHỞI TẠO VÀ PUSH DỰ ÁN LÊN GITHUB" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

git add .
git commit -m "Complete App Bau Cu WebApp (MISA AMIS SaaS UI, Supabase DDL, Vercel Config)"
git branch -M main
git push -u origin main

Write-Host "==========================================" -ForegroundColor Green
Write-Host "  HOÀN THÀNH PUSH CODE LÊN GITHUB!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
