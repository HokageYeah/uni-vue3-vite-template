// 图片附件
const uniToNatImageSelect = 'uniToNat-ImageSelect'; // uni吊起原生图片选择
const uniToNatImagePreview = 'uniToNat-ImagePreview'; // uni吊起原生图片预览

const natToUniImageSelected = 'natToUni-ImageSelected'; // native回传给uni已经选择的图片
const natToUniImagePreview = 'natToUni-ImagePreview'; // native回传给uni已经操作预览的图片

// 视频附件
const uniToNatVideoSelect = 'uniToNat-VideoSelect'; // uni吊起原生视频选择
const uniToNatVideoPlay = 'uniToNat-VideoPlay'; // uni吊起原生视频播放

const natToUniVideoSelected = 'natToUni-VideoSelected'; // native回传给uni已经选择的视频
const natToUniVideoPlay = 'natToUni-VideoPlay'; // native回传给uni已经操作播放视频

// 音频附件
const natToUniAudioSelected = 'natToUni-AudioSelected'; // native回传给uni已经选择的音频

// 音频录制权限隐私弹框
const uniToNatApplyPermission = 'uniToNat-ApplyPermission'; // uni吊起音频录制权限隐私弹框

// 文档附件
const uniToNatFilesSelect = 'uniToNat-FilesSelect'; // uni吊起原生文档选择
const uniToNatFilesOpen = 'uniToNat-FilesOpen'; // uni吊起原生文档打开
const uniToNatLogin = 'uniToNat-ToLogin'; // uni吊起原生登录
const natToUniSyncLoginInfo = 'natToUni-SyncLoginInfo'; // 原生登录完成后主动调用uni

const natToUniFilesSelected = 'natToUni-FilesSelected'; // native回传给uni已经选择的文件

// 附件上传
const uniToNatFilesUpload = 'uniToNat-FilesUpload'; // uni吊起原生文件上传
const natToUniFilesUpload = 'natToUni-FilesUpload'; // 原生文件上传后的回掉

// 图片编辑调用
const uniToNatImageEditing = 'uniToNat-GotoOpenImg'; // uni吊起原生图片编辑
const natToUniImageEditing = 'natToUni-ImageEditing'; // native回传给uni已经操作图片编辑的图片
const natToUniEditedImg = 'natToUni-EditedImg'; // native回传给uni已经操作图片编辑的图片

// Uni统一调启原生H5的通信方法
const uniToNatBridgeToH5 = 'uniToNat-BridgeToH5'; // Uni统一调启原生H5的通信方法

const natToUniBridgeToH5 = 'natToUni-BridgeToH5'; // ative回传给uni H5调用后的通信方法

export {
  // uni to nav 协议
  // 图片
  uniToNatImageSelect,
  uniToNatImagePreview,
  // 视频
  uniToNatVideoSelect,
  uniToNatVideoPlay,
  // 文件
  uniToNatFilesSelect,
  uniToNatFilesOpen,
  uniToNatLogin,
  // 音频录制隐私谈唇膏
  uniToNatApplyPermission,

  // nav to uni 协议
  // 图片
  natToUniImageSelected,
  natToUniImagePreview,
  // 视频
  natToUniVideoSelected,
  natToUniVideoPlay,
  // 音频
  natToUniAudioSelected,
  // 文件
  natToUniFilesSelected,
  // 附件上传
  uniToNatFilesUpload,
  natToUniFilesUpload,
  // 图片编辑
  uniToNatImageEditing,
  natToUniImageEditing,
  natToUniEditedImg,
  // 吊起原生H5统一方法
  uniToNatBridgeToH5,
  natToUniBridgeToH5,
  natToUniSyncLoginInfo
};
