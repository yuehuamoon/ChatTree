export const USER_STATUS = {
  ACTIVE: 1,
  MUTED: 2,
  BANNED: 3,
} as const;

export const USER_STATUS_LABELS: Record<number, string> = {
  1: 'Active',
  2: 'Muted',
  3: 'Banned',
};

export const PRIVACY_SETTING = {
  PUBLIC: 1,
  FRIENDS_ONLY: 2,
  PRIVATE: 3,
} as const;

export const PRIVACY_LABELS: Record<number, string> = {
  1: 'Public',
  2: 'Friends Only',
  3: 'Private',
};

export const CONTENT_STATUS = {
  DRAFT: 0,
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  BLOCKED: 4,
} as const;

export const CONTENT_STATUS_LABELS: Record<number, string> = {
  0: 'Draft',
  1: 'Pending Review',
  2: 'Approved',
  3: 'Rejected',
  4: 'Blocked',
};
