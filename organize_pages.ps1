$baseDir = "src\app\pages"
$dirs = @("Home", "Auth", "Admin", "Customer", "Cart", "Products", "Layout")

foreach ($dir in $dirs) {
    if (-not (Test-Path -Path "$baseDir\$dir")) {
        New-Item -ItemType Directory -Path "$baseDir\$dir" | Out-Null
    }
}

Move-Item -Path "$baseDir\HomePage.tsx", "$baseDir\AboutPage.tsx", "$baseDir\ContactPage.tsx" -Destination "$baseDir\Home\" -Force
Move-Item -Path "$baseDir\LoginPage.tsx", "$baseDir\SignupPage.tsx" -Destination "$baseDir\Auth\" -Force
Move-Item -Path "$baseDir\AdminLayout.tsx", "$baseDir\DashboardPage.tsx", "$baseDir\AddProductPage.tsx", "$baseDir\ApprovalManagementPage.tsx", "$baseDir\CustomerManagementPage.tsx", "$baseDir\OrderManagementPage.tsx", "$baseDir\ProductManagementPage.tsx", "$baseDir\SalesReportsPage.tsx", "$baseDir\StaffManagementPage.tsx", "$baseDir\StaffAttendancePage.tsx", "$baseDir\LeaveManagementPage.tsx" -Destination "$baseDir\Admin\" -Force
Move-Item -Path "$baseDir\BookAppointmentPage.tsx", "$baseDir\OrderTrackingPage.tsx", "$baseDir\WishlistPage.tsx" -Destination "$baseDir\Customer\" -Force
Move-Item -Path "$baseDir\CartPage.tsx", "$baseDir\CheckoutPage.tsx" -Destination "$baseDir\Cart\" -Force
Move-Item -Path "$baseDir\ProductsPage.tsx" -Destination "$baseDir\Products\" -Force
Move-Item -Path "$baseDir\RootLayout.tsx" -Destination "$baseDir\Layout\" -Force

Write-Host "Files moved successfully!"
