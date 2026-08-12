# PowerShell Script tự động Commit và Push dự án App Bầu Cử
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  KHỞI TẠO VÀ PUSH DỰ ÁN LÊN GITHUB" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

git add .
git commit -m "Update Auth (Login, Register, Forgot Password) & Admin User CRUD (Add, Edit, Delete with Supabase Sync)"
git branch -M main
git push -u origin main

Write-Host "==========================================" -ForegroundColor Green
Write-Host "  HOÀN THÀNH PUSH CODE LÊN GITHUB!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
