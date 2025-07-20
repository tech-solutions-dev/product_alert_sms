@echo off
setlocal enabledelayedexpansion

:: Create root directory
@REM if not exist "product-expiry\" mkdir "product-expiry"
@REM cd "product-expiry"

:: Create public directory and files
if not exist "public\" mkdir "public"
cd "public"
if not exist "index.html" type nul > "index.html"
@REM if not exist "favicon.ico" type nul > "favicon.ico"
cd ..

:: Create src directory and subdirectories
if not exist "src\" mkdir "src"
cd "src"

:: Create components directory structure
if not exist "components\" mkdir "components"
cd "components"

:: common components
if not exist "common\" mkdir "common"
cd "common"
for %%f in ("Layout.jsx" "Header.jsx" "Sidebar.jsx" "LoadingSpinner.jsx" "Modal.jsx" "ConfirmDialog.jsx") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: auth components
if not exist "auth\" mkdir "auth"
cd "auth"
for %%f in ("LoginForm.jsx" "RegisterForm.jsx" "ProtectedRoute.jsx") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: dashboard components
if not exist "dashboard\" mkdir "dashboard"
cd "dashboard"
for %%f in ("DashboardStats.jsx" "ExpiryChart.jsx" "RecentProducts.jsx") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: products components
if not exist "products\" mkdir "products"
cd "products"
for %%f in ("ProductList.jsx" "ProductCard.jsx" "ProductForm.jsx" "ProductFilters.jsx" "BarcodeScanner.jsx") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: categories components
if not exist "categories\" mkdir "categories"
cd "categories"
for %%f in ("CategoryList.jsx" "CategoryForm.jsx" "CategoryModal.jsx") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: users components
if not exist "users\" mkdir "users"
cd "users"
for %%f in ("UserList.jsx" "UserForm.jsx" "UserProfile.jsx") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: reports components
if not exist "reports\" mkdir "reports"
cd "reports"
for %%f in ("ReportList.jsx" "ReportGenerator.jsx" "ReportViewer.jsx") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: backups components
if not exist "backups\" mkdir "backups"
cd "backups"
for %%f in ("BackupList.jsx" "BackupManager.jsx") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: Back to src directory
cd ..

:: Create pages directory
if not exist "pages\" mkdir "pages"
cd "pages"
for %%f in ("Login.jsx" "Register.jsx" "Dashboard.jsx" "Products.jsx" "Categories.jsx" "Users.jsx" "Reports.jsx" "Backups.jsx" "Profile.jsx") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: Create services directory
if not exist "services\" mkdir "services"
cd "services"
for %%f in ("api.js" "auth.js" "products.js" "categories.js" "users.js" "reports.js" "backups.js" "uploads.js") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: Create hooks directory
if not exist "hooks\" mkdir "hooks"
cd "hooks"
for %%f in ("useAuth.js" "useProducts.js" "useCategories.js" "useUsers.js" "useReports.js" "useLocalStorage.js") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: Create context directory
if not exist "context\" mkdir "context"
cd "context"
for %%f in ("AuthContext.jsx" "AppContext.jsx") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: Create utils directory
if not exist "utils\" mkdir "utils"
cd "utils"
for %%f in ("constants.js" "formatters.js" "validators.js" "helpers.js") do (
    if not exist %%~f type nul > %%~f
)
cd ..

:: Create styles directory
if not exist "styles\" mkdir "styles"
cd "styles"
if not exist "globals.css" type nul > "globals.css"
cd ..

:: Create root files in src
for %%f in ("App.jsx" "main.jsx") do (
    if not exist %%~f type nul > %%~f
)

:: Back to product-expiry directory
cd ..

:: Create root files
for %%f in ("package.json" "vite.config.js" "tailwind.config.js" "postcss.config.js" ".env") do (
    if not exist %%~f type nul > %%~f
)

echo Directory structure created successfully!
endlocal