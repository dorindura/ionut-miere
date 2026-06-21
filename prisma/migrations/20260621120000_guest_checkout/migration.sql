-- Cart: permite coș anonim (guest) identificat prin cookie
ALTER TABLE "Cart" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Cart" ADD COLUMN "sessionId" TEXT;
CREATE UNIQUE INDEX "Cart_sessionId_key" ON "Cart"("sessionId");

-- Order: permite comenzi fără cont + email de facturare obligatoriu
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;

-- adăugăm coloana email; pentru comenzile existente o populăm din userul asociat
ALTER TABLE "Order" ADD COLUMN "email" TEXT;
UPDATE "Order" o SET "email" = u."email" FROM "User" u WHERE o."userId" = u."id";
UPDATE "Order" SET "email" = '' WHERE "email" IS NULL;
ALTER TABLE "Order" ALTER COLUMN "email" SET NOT NULL;
