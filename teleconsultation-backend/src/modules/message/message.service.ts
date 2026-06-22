import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Message, MessageType } from '../../entities/message.entity';
import { Notification, NotificationType } from '../../entities/notification.entity';
import { Announcement, AnnouncementStatus } from '../../entities/announcement.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class MessageService {
  private mockMessages: Message[] = [
    {
      id: 'msg-1',
      consultationId: 'consultation-1',
      senderId: 'patient-1',
      senderType: 'patient',
      senderName: '张三',
      receiverId: 'doctor-1',
      type: MessageType.TEXT,
      content: '医生您好，我最近头痛得厉害',
      fileUrl: null,
      fileName: null,
      isRead: true,
      readAt: new Date(),
      createdAt: new Date('2024-01-20T10:05:00'),
    },
    {
      id: 'msg-2',
      consultationId: 'consultation-1',
      senderId: 'doctor-1',
      senderType: 'doctor',
      senderName: '李医生',
      receiverId: 'patient-1',
      type: MessageType.TEXT,
      content: '您好，请问头痛有多久了？有没有其他症状？',
      fileUrl: null,
      fileName: null,
      isRead: true,
      readAt: new Date(),
      createdAt: new Date('2024-01-20T10:06:00'),
    },
  ];

  private mockNotifications: Notification[] = [
    {
      id: 'notif-1',
      userId: 'patient-1',
      type: NotificationType.CONSULTATION_ACCEPTED,
      title: '会诊已接受',
      content: '李医生已接受您的会诊申请，请准时参加会诊。',
      relatedId: 'consultation-2',
      relatedType: 'consultation',
      senderId: 'doctor-1',
      senderName: '李医生',
      isRead: false,
      readAt: null,
      isDeleted: false,
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
    },
    {
      id: 'notif-2',
      userId: 'patient-1',
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      title: '系统公告：系统升级维护通知',
      content: '尊敬的用户，系统将于本周六凌晨2:00-4:00进行升级维护，期间可能会影响您的使用，给您带来不便敬请谅解。',
      relatedId: null,
      relatedType: null,
      senderId: 'system',
      senderName: '系统管理员',
      isRead: true,
      readAt: new Date(Date.now() - 86400000),
      isDeleted: false,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: 'notif-3',
      userId: 'patient-1',
      type: NotificationType.MESSAGE_RECEIVED,
      title: '新消息提醒',
      content: '王医生给您发送了一条新消息，请及时查看。',
      relatedId: 'consultation-3',
      relatedType: 'consultation',
      senderId: 'doctor-2',
      senderName: '王医生',
      isRead: false,
      readAt: null,
      isDeleted: false,
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7200000),
    },
    {
      id: 'notif-4',
      userId: 'patient-1',
      type: NotificationType.CONSULTATION_COMPLETED,
      title: '会诊已完成',
      content: '您与李医生的会诊已完成，请注意查看诊断结果和处方。',
      relatedId: 'consultation-1',
      relatedType: 'consultation',
      senderId: 'doctor-1',
      senderName: '李医生',
      isRead: true,
      readAt: new Date(Date.now() - 172800000),
      isDeleted: false,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
    },
    {
      id: 'notif-5',
      userId: 'patient-1',
      type: NotificationType.SYSTEM_NOTIFICATION,
      title: '账户安全提醒',
      content: '检测到您的账户在新设备上登录，如非本人操作请及时修改密码。',
      relatedId: null,
      relatedType: null,
      senderId: 'system',
      senderName: '系统安全',
      isRead: false,
      readAt: null,
      isDeleted: false,
      createdAt: new Date(Date.now() - 10800000),
      updatedAt: new Date(Date.now() - 10800000),
    },
    {
      id: 'notif-6',
      userId: 'doctor-1',
      type: NotificationType.CONSULTATION_REQUEST,
      title: '新的会诊申请',
      content: '患者张三提交了一份新的会诊申请，请及时处理。',
      relatedId: 'consultation-2',
      relatedType: 'consultation',
      senderId: 'patient-1',
      senderName: '张三',
      isRead: false,
      readAt: null,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1800000),
    },
  ];

  private mockAnnouncements: Announcement[] = [
    {
      id: 'ann-1',
      title: '欢迎使用远程会诊系统',
      content: '欢迎使用远程会诊系统！本系统为您提供便捷的在线医疗咨询服务，支持图文、语音、视频多种会诊方式。如有问题请联系客服。',
      authorId: 'admin-1',
      authorName: '系统管理员',
      status: AnnouncementStatus.PUBLISHED,
      isPinned: true,
      sortOrder: 100,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      publishedAt: new Date('2024-01-01'),
    },
    {
      id: 'ann-2',
      title: '系统升级维护通知',
      content: '尊敬的用户：为提升系统服务质量，我们计划于本周六（1月27日）凌晨02:00-04:00进行系统升级维护。维护期间系统将暂停服务，请您合理安排使用时间。给您带来的不便，敬请谅解！',
      authorId: 'admin-1',
      authorName: '系统管理员',
      status: AnnouncementStatus.PUBLISHED,
      isPinned: true,
      sortOrder: 99,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-22'),
      publishedAt: new Date('2024-01-20'),
    },
    {
      id: 'ann-3',
      title: '新功能上线：电子处方服务',
      content: '为了给您提供更便捷的医疗服务，系统现已上线电子处方功能。医生可以在线开具处方，患者可以直接在线购药，药品配送到家。欢迎体验！',
      authorId: 'admin-1',
      authorName: '系统管理员',
      status: AnnouncementStatus.PUBLISHED,
      isPinned: false,
      sortOrder: 0,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      publishedAt: new Date('2024-01-15'),
    },
    {
      id: 'ann-4',
      title: '春节期间服务安排',
      content: '春节假期（2月10日-2月17日）期间，系统正常运行，值班医生将为您提供在线会诊服务。祝您新春快乐，身体健康！',
      authorId: 'admin-1',
      authorName: '系统管理员',
      status: AnnouncementStatus.PUBLISHED,
      isPinned: false,
      sortOrder: 0,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      publishedAt: new Date('2024-02-01'),
    },
    {
      id: 'ann-5',
      title: '用户隐私政策更新',
      content: '为更好地保障您的个人信息权益，我们更新了《用户隐私政策》。请您仔细阅读更新后的政策内容，继续使用我们的服务即表示您同意更新后的政策。',
      authorId: 'admin-1',
      authorName: '系统管理员',
      status: AnnouncementStatus.PUBLISHED,
      isPinned: false,
      sortOrder: 0,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      publishedAt: new Date('2024-01-10'),
    },
  ];

  constructor() {}

  async getMessages(consultationId: string, page: any = 1, pageSize: any = 50) {
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 50;

    const filtered = this.mockMessages
      .filter(m => m.consultationId === consultationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const total = filtered.length;
    const start = Math.max(0, total - pageNum * pageSizeNum);
    const list = filtered.slice(start, start + pageSizeNum);

    return { list, total, page: pageNum, pageSize: pageSizeNum };
  }

  async sendMessage(
    senderId: string,
    senderType: string,
    senderName: string,
    sendMessageDto: SendMessageDto,
  ): Promise<Message> {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      consultationId: sendMessageDto.consultationId,
      senderId,
      senderType,
      senderName,
      receiverId: sendMessageDto.receiverId,
      type: sendMessageDto.type || MessageType.TEXT,
      content: sendMessageDto.content || '',
      fileUrl: sendMessageDto.fileUrl || null,
      fileName: sendMessageDto.fileName || null,
      isRead: false,
      readAt: null,
      createdAt: new Date(),
    };

    this.mockMessages.push(newMessage);

    await this.createNotification(
      sendMessageDto.receiverId,
      NotificationType.MESSAGE_RECEIVED,
      '新消息',
      `${senderName}发来一条消息`,
      sendMessageDto.consultationId,
      'consultation',
      senderId,
      senderName,
    );

    return newMessage;
  }

  async markMessagesAsRead(consultationId: string, userId: string): Promise<void> {
    this.mockMessages.forEach(msg => {
      if (msg.consultationId === consultationId && msg.receiverId === userId && !msg.isRead) {
        msg.isRead = true;
        msg.readAt = new Date();
      }
    });
  }

  async getNotifications(
    userId: string,
    queryDto: NotificationQueryDto,
  ): Promise<{ list: Notification[]; total: number; page: number; pageSize: number; unreadCount: number }> {
    const { page = 1, pageSize = 20, type, isRead } = queryDto;
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 20;

    let filtered = this.mockNotifications.filter(
      n => n.userId === userId && !n.isDeleted,
    );

    if (type) {
      filtered = filtered.filter(n => n.type === type);
    }

    if (isRead !== undefined) {
      filtered = filtered.filter(n => n.isRead === isRead);
    }

    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filtered.length;
    const unreadCount = filtered.filter(n => !n.isRead).length;
    const start = (pageNum - 1) * pageSizeNum;
    const list = filtered.slice(start, start + pageSizeNum);

    return { list, total, page: pageNum, pageSize: pageSizeNum, unreadCount };
  }

  async getNotificationById(userId: string, notificationId: string): Promise<Notification> {
    const notification = this.mockNotifications.find(
      n => n.id === notificationId && n.userId === userId && !n.isDeleted,
    );

    if (!notification) {
      throw new NotFoundException('通知不存在');
    }

    return notification;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.mockNotifications.filter(n => n.userId === userId && !n.isRead && !n.isDeleted).length;
  }

  async getUnreadCountByType(userId: string): Promise<Record<string, number>> {
    const result: Record<string, number> = {
      total: 0,
    };

    Object.values(NotificationType).forEach(type => {
      result[type] = 0;
    });

    this.mockNotifications
      .filter(n => n.userId === userId && !n.isRead && !n.isDeleted)
      .forEach(n => {
        result.total++;
        result[n.type] = (result[n.type] || 0) + 1;
      });

    return result;
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<Notification> {
    const notification = this.mockNotifications.find(
      n => n.id === notificationId && n.userId === userId && !n.isDeleted,
    );

    if (!notification) {
      throw new NotFoundException('通知不存在');
    }

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      notification.updatedAt = new Date();
    }

    return notification;
  }

  async markAllNotificationsAsRead(userId: string, type?: NotificationType): Promise<{ count: number }> {
    let count = 0;

    this.mockNotifications.forEach(n => {
      if (n.userId === userId && !n.isRead && !n.isDeleted) {
        if (type && n.type !== type) return;
        n.isRead = true;
        n.readAt = new Date();
        n.updatedAt = new Date();
        count++;
      }
    });

    return { count };
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    const notification = this.mockNotifications.find(
      n => n.id === notificationId && n.userId === userId && !n.isDeleted,
    );

    if (!notification) {
      throw new NotFoundException('通知不存在');
    }

    notification.isDeleted = true;
    notification.updatedAt = new Date();
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    content: string,
    relatedId?: string,
    relatedType?: string,
    senderId?: string,
    senderName?: string,
  ): Promise<Notification> {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      type,
      title,
      content,
      relatedId: relatedId || null,
      relatedType: relatedType || null,
      senderId: senderId || null,
      senderName: senderName || null,
      isRead: false,
      readAt: null,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockNotifications.unshift(notification);
    return notification;
  }

  async getAnnouncements(
    page: any = 1,
    pageSize: any = 20,
  ): Promise<{ list: Announcement[]; total: number; page: number; pageSize: number }> {
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 20;

    const filtered = this.mockAnnouncements
      .filter(a => a.status === AnnouncementStatus.PUBLISHED)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        if (a.sortOrder !== b.sortOrder) {
          return b.sortOrder - a.sortOrder;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

    const total = filtered.length;
    const start = (pageNum - 1) * pageSizeNum;
    const list = filtered.slice(start, start + pageSizeNum);

    return { list, total, page: pageNum, pageSize: pageSizeNum };
  }

  async getAnnouncementById(id: string): Promise<Announcement> {
    const announcement = this.mockAnnouncements.find(a => a.id === id);

    if (!announcement) {
      throw new NotFoundException('公告不存在');
    }

    return announcement;
  }

  async getAnnouncementList(
    page: any = 1,
    pageSize: any = 20,
    status?: AnnouncementStatus,
  ): Promise<{ list: Announcement[]; total: number; page: number; pageSize: number }> {
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 20;

    let filtered = [...this.mockAnnouncements];

    if (status) {
      filtered = filtered.filter(a => a.status === status);
    }

    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      if (a.sortOrder !== b.sortOrder) {
        return b.sortOrder - a.sortOrder;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const total = filtered.length;
    const start = (pageNum - 1) * pageSizeNum;
    const list = filtered.slice(start, start + pageSizeNum);

    return { list, total, page: pageNum, pageSize: pageSizeNum };
  }

  async createAnnouncement(
    createDto: CreateAnnouncementDto,
    authorId?: string,
    authorName?: string,
  ): Promise<Announcement> {
    const now = new Date();
    const announcement: Announcement = {
      id: `ann-${Date.now()}`,
      title: createDto.title,
      content: createDto.content,
      authorId: authorId || 'admin-1',
      authorName: authorName || '系统管理员',
      status: createDto.status || AnnouncementStatus.DRAFT,
      isPinned: createDto.isPinned || false,
      sortOrder: createDto.sortOrder || 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: createDto.status === AnnouncementStatus.PUBLISHED ? now : null,
    };

    this.mockAnnouncements.unshift(announcement);
    return announcement;
  }

  async updateAnnouncement(id: string, updateDto: UpdateAnnouncementDto): Promise<Announcement> {
    const index = this.mockAnnouncements.findIndex(a => a.id === id);

    if (index === -1) {
      throw new NotFoundException('公告不存在');
    }

    const announcement = this.mockAnnouncements[index];

    if (updateDto.title !== undefined) {
      announcement.title = updateDto.title;
    }
    if (updateDto.content !== undefined) {
      announcement.content = updateDto.content;
    }
    if (updateDto.status !== undefined) {
      if (announcement.status !== AnnouncementStatus.PUBLISHED && updateDto.status === AnnouncementStatus.PUBLISHED) {
        announcement.publishedAt = new Date();
      }
      announcement.status = updateDto.status;
    }
    if (updateDto.isPinned !== undefined) {
      announcement.isPinned = updateDto.isPinned;
    }
    if (updateDto.sortOrder !== undefined) {
      announcement.sortOrder = updateDto.sortOrder;
    }

    announcement.updatedAt = new Date();
    return announcement;
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const index = this.mockAnnouncements.findIndex(a => a.id === id);

    if (index === -1) {
      throw new NotFoundException('公告不存在');
    }

    this.mockAnnouncements.splice(index, 1);
  }

  async togglePinned(id: string): Promise<Announcement> {
    const announcement = this.mockAnnouncements.find(a => a.id === id);

    if (!announcement) {
      throw new NotFoundException('公告不存在');
    }

    announcement.isPinned = !announcement.isPinned;
    announcement.updatedAt = new Date();

    return announcement;
  }
}
