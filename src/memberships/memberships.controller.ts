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
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@ApiTags('Memberships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Get(':todoAppId')
  list(@Param('todoAppId') appId: string, @Req() req: AuthenticatedRequest) {
    return this.membershipsService.listMembers(appId, req.user.userId);
  }

  @Post(':todoAppId')
  @ApiBody({ type: InviteMemberDto })
  invite(
    @Param('todoAppId') appId: string,
    @Body() body: InviteMemberDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.membershipsService.inviteMember(
      appId,
      req.user.userId,
      body.email,
      body.role,
    );
  }

  @Patch(':todoAppId/:memberId')
  @ApiBody({ type: UpdateMemberRoleDto })
  updateRole(
    @Param('todoAppId') appId: string,
    @Param('memberId') memberId: string,
    @Body() body: UpdateMemberRoleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.membershipsService.updateRole(
      appId,
      memberId,
      req.user.userId,
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
      req.user.userId,
    );
  }
}
