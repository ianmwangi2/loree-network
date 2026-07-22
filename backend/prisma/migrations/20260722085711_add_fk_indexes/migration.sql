-- CreateIndex
CREATE INDEX "ContactSubmission_serviceId_idx" ON "ContactSubmission"("serviceId");

-- CreateIndex
CREATE INDEX "ContactSubmission_userId_idx" ON "ContactSubmission"("userId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Service_categoryId_idx" ON "Service"("categoryId");
