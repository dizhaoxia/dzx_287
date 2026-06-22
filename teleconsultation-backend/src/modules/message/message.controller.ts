import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { NotificationType } from '../../entities/notification.entity';
import { AnnouncementStatus } from '../../entities/announcement.entity';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('messages/consultation/:consultationId')
  @Roles('patient', 'doctor', 'admin')
  async getMessages(
    @Param('consultationId') consultationId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 50,
  ) {
    return this.messageService.getMessages(consultationId, page, pageSize);
  }

  @Post('messages')
  @Roles('patient', 'doctor', 'admin')
  async sendMessage(
    @CurrentUser() user: any,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    const senderId = user.role === 'doctor' ? 'doctor-1' : 'patient-1';
    const senderType = user.role;
    const senderName = user.role === 'doctor' ? '李医生' : '张三';
    return this.messageService.sendMessage(senderId, senderType, senderName, sendMessageDto);
  }

  @Put('messages/consultation/:consultationId/read')
  @Roles('patient', 'doctor', 'admin')
  async markMessagesAsRead(
    @Param('consultationId') consultationId: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.role === 'doctor' ? 'doctor-1' : 'patient-1';
    await this.messageService.markMessagesAsRead(consultationId, userId);
    return { success: true };
  }

  @Get('notifications')
  @Roles('patient', 'doctor', 'admin')
  async getNotifications(
    @CurrentUser() user: any,
    @Query() queryDto: NotificationQueryDto,
  ) {
    const userId = user.role === 'doctor' ? 'doctor-1' : 'patient-1';
    return this.messageService.getNotifications(userId, queryDto);
  }

  @Get('notifications/unread-count')
  @Roles('patient', 'doctor', 'admin')
  async getUnreadCount(@CurrentUser() user: any) {
    const userId = user.role === 'doctor' ? 'doctor-1' : 'patient-1';
    const count = await this.messageService.getUnreadCount(userId);
    return { count };
  }

  @Get('notifications/unread-count-by-type')
  @Roles('patient', 'doctor', 'admin')
  async getUnreadCountByType(@CurrentUser() user: any) {
    const userId = user.role === 'doctor' ? 'doctor-1' : 'patient-1';
    return this.messageService.getUnreadCountByType(userId);
  }

  @Get('notifications/:id')
  @Roles('patient', 'doctor', 'admin')
  async getNotificationDetail(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.role === 'doctor' ? 'doctor-1' : 'patient-1';
    return this.messageService.getNotificationById(userId, id);
  }

  @Put('notifications/:id/read')
  @Roles('patient', 'doctor', 'admin')
  async markNotificationAsRead(
    @Param('id') notificationId: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.role === 'doctor' ? 'doctor-1' : 'patient-1';
    return this.messageService.markNotificationAsRead(userId, notificationId);
  }

  @Put('notifications/read-all')
  @Roles('patient', 'doctor', 'admin')
  async markAllNotificationsAsRead(
    @CurrentUser() user: any,
    @Query('type') type?: NotificationType,
  ) {
    const userId = user.role === 'doctor' ? 'doctor-1' : 'patient-1';
    return this.messageService.markAllNotificationsAsRead(userId, type);
  }

  @Delete('notifications/:id')
  @Roles('patient', 'doctor', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(
    @Param('id') notificationId: string,
    @CurrentUser() user: any,
  ) {
    const userId = user.role === 'doctor' ? 'doctor-1' : 'patient-1';
    await this.messageService.deleteNotification(userId, notificationId);
  }

  @Public()
  @Get('announcements')
  async getAnnouncements(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.messageService.getAnnouncements(page, pageSize);
  }

  @Public()
  @Get('announcements/:id')
  async getAnnouncementDetail(@Param('id') id: string) {
    return this.messageService.getAnnouncementById(id);
  }

  @Get('admin/announcements')
  @Roles('admin')
  async getAnnouncementList(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('status') status?: AnnouncementStatus,
  ) {
    return this.messageService.getAnnouncementList(page, pageSize, status);
  }

  @Post('admin/announcements')
  @Roles('admin')
  async createAnnouncement(
    @Body() createDto: CreateAnnouncementDto,
    @CurrentUser() user: any,
  ) {
    return this.messageService.createAnnouncement(
      createDto,
      user?.userId || 'admin-1',
      user?.name || '系统管理员',
    );
  }

  @Put('admin/announcements/:id')
  @Roles('admin')
  async updateAnnouncement(
    @Param('id') id: string,
    @Body() updateDto: UpdateAnnouncementDto,
  ) {
    return this.messageService.updateAnnouncement(id, updateDto);
  }

  @Delete('admin/announcements/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAnnouncement(@Param('id') id: string) {
    await this.messageService.deleteAnnouncement(id);
  }

  @Put('admin/announcements/:id/pin')
  @Roles('admin')
  async togglePinned(@Param('id') id: string) {
    return this.messageService.togglePinned(id);
  }
}
