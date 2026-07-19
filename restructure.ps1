$ErrorActionPreference = 'Stop'
$src = "b:\hr-system\src"

Write-Host "Step 1: Creating features directories..." -ForegroundColor Cyan
$features = @('attendance','auth','dashboard','employees','notifications','payroll','profile','requests','settings')
foreach ($f in $features) {
    New-Item -ItemType Directory -Path "$src\features\$f" -Force | Out-Null
}

Write-Host "Step 2: Moving dashboard components to features and organizing into components/ subfolders..." -ForegroundColor Cyan
$mappings = @{
    'Attendance'   = 'attendance'
    'auth'         = 'auth'
    'DashboardPage'= 'dashboard'
    'Employees'    = 'employees'
    'notifications'= 'notifications'
    'Payroll'      = 'payroll'
    'profile'      = 'profile'
    'RequestsPage' = 'requests'
    'Settings'     = 'settings'
}
foreach ($key in $mappings.Keys) {
    $from = "$src\components\dashboard\$key"
    $to   = "$src\features\$($mappings[$key])"
    if (Test-Path $from) {
        # Create components/ subfolder
        New-Item -ItemType Directory -Path "$to\components" -Force | Out-Null
        # Move files to components/
        Get-ChildItem $from | Move-Item -Destination "$to\components\" -Force
    }
}
Remove-Item "$src\components\dashboard" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Step 2.5: Moving hooks from components to hooks/ subfolders within features..." -ForegroundColor Cyan
$hooksMappings = @{
    'Employees'    = 'employees'
    'Payroll'      = 'payroll'
}
foreach ($key in $hooksMappings.Keys) {
    $from = "$src\features\$($hooksMappings[$key])\components\hooks"
    $to   = "$src\features\$($hooksMappings[$key])\hooks"
    if (Test-Path $from) {
        Move-Item $from $to -Force
    }
}

Write-Host "Step 3: Fix HrInvitaion typo -> HrInvitation..." -ForegroundColor Cyan
$typoPath = "$src\features\auth\components\HrInvitaion"
if (Test-Path $typoPath) {
    Rename-Item $typoPath "HrInvitation"
}

Write-Host "Step 4: Merging shared/ into components/shared/..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path "$src\components\shared\forms" -Force | Out-Null
if (Test-Path "$src\shared\components") {
    Get-ChildItem "$src\shared\components" | Move-Item -Destination "$src\components\shared\" -Force
}
if (Test-Path "$src\shared\forms") {
    Get-ChildItem "$src\shared\forms" | Move-Item -Destination "$src\components\shared\forms\" -Force
}
Remove-Item "$src\shared" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Step 5: Moving useEmployeeAttendance to features/employees/hooks..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path "$src\features\employees\hooks" -Force | Out-Null
$hookSrc = "$src\hooks\useEmployeeAttendance.js"
if (Test-Path $hookSrc) {
    Move-Item $hookSrc "$src\features\employees\hooks\" -Force
}

Write-Host "Step 6: Moving layout components to layouts/..." -ForegroundColor Cyan
if (Test-Path "$src\components\layout") {
    Get-ChildItem "$src\components\layout" | Move-Item -Destination "$src\layouts\" -Force
    Remove-Item "$src\components\layout" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Step 7: Updating all import paths..." -ForegroundColor Cyan
$allFiles = Get-ChildItem -Path $src -Recurse -Include "*.jsx","*.js"

$replacements = @(
    @('@/components/dashboard/Attendance',  '@/features/attendance/components'),
    @('@/components/dashboard/auth',        '@/features/auth/components'),
    @('@/components/dashboard/DashboardPage','@/features/dashboard/components'),
    @('@/components/dashboard/Employees',   '@/features/employees/components'),
    @('@/components/dashboard/notifications','@/features/notifications/components'),
    @('@/components/dashboard/Payroll',     '@/features/payroll/components'),
    @('@/components/dashboard/profile',     '@/features/profile/components'),
    @('@/components/dashboard/RequestsPage','@/features/requests/components'),
    @('@/components/dashboard/Settings',    '@/features/settings/components'),
    @('@/shared/forms/',                    '@/components/shared/forms/'),
    @('@/shared/components/',               '@/components/shared/'),
    @('@/hooks/useEmployeeAttendance',      '@/features/employees/hooks/useEmployeeAttendance'),
    @('@/features/auth/components/HrInvitaion','@/features/auth/components/HrInvitation'),
    @('@/components/layout/',               '@/layouts/'),
    @('@/features/employees/components/hooks','@/features/employees/hooks'),
    @('@/features/payroll/components/hooks','@/features/payroll/hooks')
)

foreach ($file in $allFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $changed = $false
    foreach ($pair in $replacements) {
        if ($content.Contains($pair[0])) {
            $content = $content.Replace($pair[0], $pair[1])
            $changed = $true
        }
    }
    if ($changed) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nDone! Restructuring complete." -ForegroundColor Green
