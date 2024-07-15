-- DropForeignKey
ALTER TABLE "BillMember" DROP CONSTRAINT "BillMember_billId_fkey";

-- AddForeignKey
ALTER TABLE "BillMember" ADD CONSTRAINT "BillMember_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
