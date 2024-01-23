export interface imageObjType {
  path: string;
  isNetwork: boolean;
  bigImageUrl?: string; // 网络大图地址
  fileId: string;
  size?: number;
}

export interface iconType {
  name: string;
  type: number;
  icon: string;
}

export interface videoType {
  videoPath: string;
  videoSize?: number;
  videoImgPath?: string;
  videoId?: string;
  videoDuration?: number;
  isNetwork: boolean;
}
export interface audioType {
  audioPath: string;
  isNetwork: boolean;
  audioTimeNum?: number;
  audioId?: string;
  audioName?: string;
}

// filetype: 0 是链接。 1 是docx、pdf、ppt、txt
export interface fileType {
  fileID: string;
  fileAddress: string;
  fileType: number;
  fileName: string;
  fileSize?: number;
  isNetwork: boolean;
}
