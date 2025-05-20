import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';

@UseGuards(JwtAuthGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  //   @Get(':todoAppId')
  //   list(@Param('todoAppId') appId: string, @Req() req: AuthenticatedRequest) {
  //     return this.membershipsService.listMembers(appId, req.user['userId']);
  //   }

  @Get(':todoAppId')
  list(@Param('todoAppId') appId: string, @Req() req: AuthenticatedRequest) {
    return this.membershipsService.listMembers(appId, req.user.userId);
  }

  @Post(':todoAppId')
  invite(
    @Param('todoAppId') appId: string,
    @Body() body: { email: string; role: Role },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.membershipsService.inviteMember(
      appId,
      req.user['userId'],
      body.email,
      body.role,
    );
  }

  @Patch(':todoAppId/:memberId')
  updateRole(
    @Param('todoAppId') appId: string,
    @Param('memberId') memberId: string,
    @Body() body: { role: Role },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.membershipsService.updateRole(
      appId,
      memberId,
      req.user['userId'],
      body.role,
    );
  }

  @Delete(':todoAppId/:memberId')
  remove(
    @Param('todoAppId') appId: string,
    @Param('memberId') memberId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.membershipsService.removeMember(
      appId,
      memberId,
      req.user['userId'],
    );
  }
}
