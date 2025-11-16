export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  format: string;
  storedLocation: string;
  encryptionIv: string;
  authTag: string;
  uploadedAt: Date;
  retentionUntil: Date;
  parsed?: any; // Optional parsed data
}