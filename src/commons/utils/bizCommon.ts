/**
 * 上传文件
 */
// const uploadFile = async (formData: any, file?: string) => {
//   // 上传文件的接口待测试
//   if (Object.prototype.toString.call(formData) === '[object Object]') {
//     // uploadFile上传文件异步转同步的解决办法
//     // https://blog.csdn.net/qq_24369959/article/details/119342513
//     uni.uploadFile({
//       url: '/zuul/task-center/task-attachment/upload-file',
//       name: 'file',
//       filePath: file,
//       formData,
//       success: () => {}
//     });
//   } else {
//     await ajax({
//       url: '/zuul/task-center/task-attachment/upload-file',
//       data: formData,
//       method: 'POST',
//       header: {
//         'Content-type': 'multipart/form-data'
//       }
//     });
//   }
//   // 文件上传
// };

/**
 * 使用 xxt-file-submit 组件，作业附件上传
 * useStore('fileUpload');
 * @param imageAryValue 文件上传 store 中的 imageAry 数据
 * @param audioAryValue
 * @param videoAryValue
 * @param fileAryValue
 * @param uploadIdentity
 */
// export async function uploadTaskFile(
//   imageAryValue: any,
//   audioAryValue: any,
//   videoAryValue: any,
//   fileAryValue: any,
//   uploadIdentity: string
// ) {
//   let tmpFileSeq = 0;
//   // 1图片
//   for (let index = 0; index < imageAryValue.length; index++) {
//     const file = imageAryValue[index].path;
//     tmpFileSeq += 1;
//     const formData = {
//       fileIdentity: uploadIdentity,
//       fileType: 1,
//       fileSeq: tmpFileSeq
//     };
//     await uploadFile(formData, file);
//   }
//   // 2语音
//   if (audioAryValue.length > 0) {
//     const file = audioAryValue[0].audioPath;
//     tmpFileSeq += 1;
//     const formData = {
//       fileIdentity: uploadIdentity,
//       fileType: 2,
//       fileSeq: tmpFileSeq
//     };
//     await uploadFile(formData, file);
//   }
//   // 3视频
//   if (videoAryValue.length > 0) {
//     const file = videoAryValue[0].videoPath;
//     tmpFileSeq += 1;
//     const formData = {
//       fileIdentity: uploadIdentity,
//       fileType: 3,
//       fileSeq: tmpFileSeq
//     };
//     await uploadFile(formData, file);
//   }
//   // 4文件
//   const realFile = fileAryValue.find((item: any) => item.fileType !== 0);
//   if (fileAryValue.length > 0 && realFile) {
//     const file = realFile.fileAddress;
//     tmpFileSeq += 1;
//     const formData = {
//       fileIdentity: uploadIdentity,
//       fileType: 4,
//       fileSeq: tmpFileSeq
//     };
//     // formData.append('file', file);
//     await uploadFile(formData, file);
//   }
//   // 5链接
//   const linkFile = fileAryValue.find((item: any) => item.fileType === 0);
//   if (fileAryValue.length > 0 && linkFile) {
//     const formData = new FormData();
//     tmpFileSeq += 1;
//     formData.append('fileIdentity', uploadIdentity);
//     formData.append('fileType', 5);
//     formData.append('fileSeq', tmpFileSeq);
//     formData.append('linkUrl', linkFile.fileAddress);
//     formData.append('linkName', linkFile.fileAddress);
//     await uploadFile(formData);
//   }
// }

/**
 * 使用 xxt-file-submit 组件，【修改状态】下的文件上传（只上传被删除且重新上传的文件）
 * @param attachList 修改时已有的附件列表
 * @param deleteAttachList 被删除的附件列表
 */
// export async function uploadTaskFileDiff(attachList: any[], uploadIdentity: string) {
//   const { imageAry, videoAry, fileAry, audioAry }: any = useStore('fileUpload');

//   // todo 判断哪些重新上传：暂定根据path不是http开头就得重新上传
//   const imageAryTemp = imageAry.value.filter((item: any) => !item.path.startsWidth('http'));
//   const audioAryTemp = audioAry.value.filter((item: any) => !item.audioPath.startsWidth('http'));
//   const videoAryTemp = videoAry.value.filter((item: any) => !item.videoPath.startsWidth('http'));
//   // 找一下原有的附件详情中是否有链接
//   const linkeAttach = attachList.find((item: any) => item.fileType === 5);
//   const fileAryTemp = fileAry.value.filter((item: any) => {
//     return (
//       // 原本就没有链接 或者 有链接但和原有的链接不一致
//       (item.fileType === 0 && (!linkeAttach || linkeAttach.filePath !== item.fileAddress)) ||
//       (item.fileType !== 0 && !item.fileAddress.startsWidth('http'))
//     );
//   });
//   await uploadTaskFile(imageAryTemp, audioAryTemp, videoAryTemp, fileAryTemp, uploadIdentity);
// }

/**
 * 使用 xxt-file-submit 组件，【修改状态】下，组件文件初始化（回显）
 * @param attachList
 */
export function initTaskFile(attachList: any) {
  const { updateImgAry, updateVideoAry, updateFileAry, updateAudioAry }: any =
    useStore('fileUpload');

  // 向文件组件塞地址
  // 附件类型 1 图片 2语音 3视频 4文件 5链接
  const imgAry = attachList
    .filter((attach: any) => attach.fileType === 1)
    .map((attach: any) => ({
      path: attach.filePath,
      isNetwork: true,
      fileId: `${attach.attachmentId}`
    }));
  const audioAry = attachList
    .filter((attach: any) => attach.fileType === 2)
    .map((attach: any) => ({
      audioPath: attach.filePath,
      isNetwork: true,
      audioTimeNum: attach.fileParam ? Number(attach.fileParam) : null,
      audioId: `${attach.attachmentId}`,
      audioName: attach.fileName
    }));
  const videoAry = attachList
    .filter((attach: any) => attach.fileType === 3)
    .map((attach: any) => ({
      videoPath: attach.filePath,
      videoId: `${attach.attachmentId}`,
      videoDuration: attach.fileParam ? Number(attach.fileParam) : null,
      isNetwork: true
    }));
  const fileAry = attachList
    .filter((attach: any) => [4, 5].includes(attach.fileType))
    .map((attach: any) => ({
      fileID: `${attach.attachmentId}`,
      fileAddress: attach.filePath,
      fileType: attach.fileType === 5 ? 0 : 1,
      fileName: attach.fileType === 5 ? attach.filePath : attach.fileName,
      isNetwork: true
    }));
  updateImgAry(imgAry);
  updateVideoAry(videoAry);
  updateFileAry(fileAry);
  updateAudioAry(audioAry);
}

/**
 * 使用 xxt-file-submit 组件，【修改状态】下，获取被删除的附件列表——在提交时调用
 */
export function getDeleteAttachList(attachList: any[]) {
  if (!attachList || attachList.length <= 0) {
    return [];
  }
  // 根据 fileId 比对 图片预览原生那边处理有问题，使用 filePath 比对替代
  // const { imageAry, videoAry, fileAry, audioAry }: any = useStore('fileUpload');
  // const fileIds = imageAry.value
  //   .filter((item: any) => item.isNetwork)
  //   .map((item: any) => Number(item.fileId));
  // const fileIDs = fileAry.value
  //   .filter((item: any) => item.isNetwork)
  //   .map((item: any) => Number(item.fileID));
  // const videoIds = videoAry.value
  //   .filter((item: any) => item.isNetwork)
  //   .map((item: any) => Number(item.videoId));
  // const audioIds = audioAry.value
  //   .filter((item: any) => item.isNetwork)
  //   .map((item: any) => Number(item.audioId));
  // const currentFileIds = [...fileIds, ...fileIDs, ...videoIds, ...audioIds];

  // const deleteAttachIds = attachList
  //   .filter((item: any) => !currentFileIds.includes(item.attachmentId))
  //   .map((item: any) => item.attachmentId);
  // return deleteAttachIds;

  // 根据 filePath 比对
  const { imageAry, videoAry, fileAry, audioAry }: any = useStore('fileUpload');
  const imagePaths = imageAry.value.map((item: any) => item.path);
  const filePaths = fileAry.value.map((item: any) => item.fileAddress);
  const videoPaths = videoAry.value.map((item: any) => item.videoPath);
  const audioPaths = audioAry.value.map((item: any) => item.audioPath);
  const curFilePaths = [...imagePaths, ...filePaths, ...videoPaths, audioPaths];

  const deleteAttachIds = attachList
    .filter((item: any) => !curFilePaths.includes(item.filePath))
    .map((item: any) => item.attachmentId);
  return deleteAttachIds;
}

/**
 * 使用 xxt-file-submit 组件，判断是否上传有文件
 */
export function hasFile() {
  const { imageAry, videoAry, fileAry, audioAry }: any = useStore('fileUpload');
  return (
    imageAry.value.length > 0 ||
    videoAry.value.length > 0 ||
    fileAry.value.length > 0 ||
    audioAry.value.length > 0
  );
}

/**
 * 根据年级id获取相应学段
 * @param gradeId 年级id/年级编码
 */
export function getPhaseCodeByGradeId(gradeId: number) {
  let phaseCode = 0;
  switch (gradeId) {
    case 11: // 托班
    case 12: // 小班
    case 13: // 中班
    case 14: // 大班
      phaseCode = 111; // 幼儿园
      break;
    case 21: // 一年级
    case 22: // 二年级
    case 23: // 三年级
    case 24: // 四年级
    case 25: // 五年级
    case 26: // 六年级
      phaseCode = 211; // 小学
      break;
    case 31: // 七年级
    case 32: // 八年级
    case 33: // 九年级
      phaseCode = 311; // 初中
      break;
    case 41: // 高一
    case 42: // 高二
    case 43: // 高三
      phaseCode = 342; // 高中
      break;
    default:
      break;
  }
  return phaseCode;
}
