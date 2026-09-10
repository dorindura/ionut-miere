-- Order: taxa de livrare (RON) stocată per comandă
-- comenzile existente rămân cu 0 (nu aveau taxă de livrare aplicată)
ALTER TABLE "Order" ADD COLUMN "shippingRon" INTEGER NOT NULL DEFAULT 0;
