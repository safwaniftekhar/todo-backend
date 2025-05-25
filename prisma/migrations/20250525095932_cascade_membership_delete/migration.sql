-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_todoAppId_fkey";

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_todoAppId_fkey" FOREIGN KEY ("todoAppId") REFERENCES "TodoApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
