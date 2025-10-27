export enum ReportReason {
  Harassment = 'Harassment',
  Spam = 'Spam',
  InappropriateContent = 'InappropriateContent',
  Impersonation = 'Impersonation',
  Other = 'Other'
}

export interface CreateUserReportDto {
  reportedUserId: string
  reason: ReportReason
  description: string
}

export interface UserReportDto {
  id: string
  reporterId: string
  reportedUserId: string
  reason: ReportReason
  description: string
  status: ReportStatus
  createdAt: string
}

export enum ReportStatus {
  Pending = 'Pending',
  UnderReview = 'UnderReview',
  Resolved = 'Resolved',
  Dismissed = 'Dismissed'
}

