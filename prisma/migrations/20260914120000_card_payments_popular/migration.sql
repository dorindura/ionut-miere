-- Plată cu cardul (NETOPIA), adresă structurată și produse populare

CREATE TYPE "PaymentMethod" AS ENUM ('CASH_ON_DELIVERY', 'CARD');
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');

-- comenzile existente rămân ramburs / neplătite
ALTER TABLE "Order" ADD COLUMN "city" TEXT;
ALTER TABLE "Order" ADD COLUMN "county" TEXT;
ALTER TABLE "Order" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "Order" ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH_ON_DELIVERY';
ALTER TABLE "Order" ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
ALTER TABLE "Order" ADD COLUMN "netopiaOrderId" TEXT;
ALTER TABLE "Order" ADD COLUMN "netopiaNtpId" TEXT;
ALTER TABLE "Order" ADD COLUMN "paidAt" TIMESTAMP(3);

ALTER TABLE "Product" ADD COLUMN "popular" BOOLEAN NOT NULL DEFAULT false;

-- mierea de mană (1kg și 0,5kg) = produs popular
UPDATE "Product" SET "popular" = true WHERE "slug" IN ('miere-mana-brad-1000g', 'miere-mana-brad-500g');
