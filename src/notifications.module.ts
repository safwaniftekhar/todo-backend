// notifications.module.ts
import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway], // 👈 make it available to other modules
})
export class NotificationsModule {}
