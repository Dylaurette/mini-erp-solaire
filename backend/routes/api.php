<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SiteStockController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\PurchaseItemController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\SaleItemController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\AuditLogController;

Route::get('/test', fn() => response()->json(['ok' => true]));

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('sites', SiteController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('site-stocks', SiteStockController::class);
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('purchases', PurchaseController::class);
    Route::apiResource('purchase-items', PurchaseItemController::class);
    Route::apiResource('sales', SaleController::class);
    Route::apiResource('sale-items', SaleItemController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('alerts', AlertController::class);
    Route::apiResource('audit-logs', AuditLogController::class);
});
