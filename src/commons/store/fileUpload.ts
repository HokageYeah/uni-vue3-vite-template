import { v4 as uuidv4 } from 'uuid';
import { natToUniFilesUpload, uniToNatFilesUpload } from '../utils/uniToNavProtocol';
import { uploadFilePromise, uploadFilesCallBack } from '../http';
import utils from '../utils';
import { clearImageCacheMB, getScalePercentage } from '../utils/imageTools';
import { isIosMoreVersion } from '../utils/util';
import type {
  audioType,
  fileType,
  imageObjType,
  videoType
} from '@/components/xxt-components/xxt-file-submit/xxtFileType';
import bridge from '@/commons/utils/uniToNativeBridge';

interface fileUpdateType {
  imageAry?: imageObjType[]; // 图片类型
  videoAry?: videoType[]; // 视频类型
  fileAry?: fileType[]; // 文件类型
  audioAry?: audioType[]; // 音频类型
  currentIndex: number;
  shrinkRef: any; // 缩略图
}
interface uploadResType {
  code: number;
  msg: string;
  fileIdentify: string;
}
type uploadFileType = imageObjType[] | videoType[] | audioType[] | fileType[];
const fileUploadStore = defineStore({
  id: 'fileUpload',
  state: (): fileUpdateType => ({
    imageAry: [],
    videoAry: [],
    fileAry: [],
    audioAry: [],
    currentIndex: 0,
    shrinkRef: null
  }),
  // 附件上传只需要上传本地附件、网络附件需要过滤掉。
  getters: {
    localImageAry(): imageObjType[] {
      return this.imageAry!.filter((item: imageObjType) => !item.isNetwork);
    },
    localVideoAry(): videoType[] {
      return this.videoAry!.filter((item: videoType) => !item.isNetwork);
    },
    localFileAry(): fileType[] {
      return this.fileAry!.filter((item: fileType) => !item.isNetwork);
    },
    localAudioAry(): audioType[] {
      return this.audioAry!.filter((item: audioType) => !item.isNetwork);
    }
  },
  actions: {
    updateShrinkRef(ref: any) {
      this.shrinkRef = ref;
      console.log('updateShrinkRef-----', this.shrinkRef);
    },
    updateImgAry(data: imageObjType[]) {
      this.imageAry = data;
    },
    updateVideoAry(data: videoType[]) {
      this.videoAry = data;
    },
    updateFileAry(data: fileType[]) {
      this.fileAry = data;
    },
    updateAudioAry(data: audioType[]) {
      this.audioAry = data;
    },
    clearAllFilesCache() {
      this.imageAry = [];
      this.videoAry = [];
      this.fileAry = [];
      this.audioAry = [];
    },
    uploadAllFilesApp() {
      const imageAry = this.imageAry?.map((item) => item.path);
      const videoAry = this.videoAry?.map((item) => item.videoPath);
      const fileAry = this.imageAry?.map((item) => item.path);
      if (imageAry?.length || videoAry?.length || fileAry?.length) {
        bridge
          .sendNativeEvent(uniToNatFilesUpload, { imageAry, videoAry, fileAry })
          .then((res: any) => {
            const restype = res as uploadResType;
            if (restype.code === 1) {
              this.clearAllFilesCache();
            }
            uni.$emit(natToUniFilesUpload, restype);
          });
      }
    },
    // 图片压缩
    async compressImage(fileObjAry: uploadFileType) {
      console.log('updateShrinkRef--fileObjAry-compressImage--', fileObjAry);
      // 使用l-shrink这个压缩插件进行压缩
      // const imgary = [];
      // for (const item of fileObjAry) {
      //   const imgItem = item as imageObjType;
      //   console.log('updateShrinkRef--item.imgPath--', imgItem.path);
      //   console.log('updateShrinkRef--this.shrinkRef.value--', this.shrinkRef.value);
      //   console.log('updateShrinkRef--this.shrinkRef--', this.shrinkRef);
      //   console.log(
      //     'updateShrinkRef--this.shrinkRef.compressImage--',
      //     this.shrinkRef.compressImage
      //   );
      //   try {
      //     imgItem.path = await this.shrinkRef.compressImage(imgItem.path, {
      //       quality: 75
      //     });
      //     uni.saveImageToPhotosAlbum({
      //       filePath: imgItem.path,
      //       success() {
      //         utils.toast({ title: '图片保存成功' });
      //         console.log('updateShrinkRef--compressImage----图片保存成');
      //       },
      //       fail() {
      //         utils.toast({ title: '图片保存失败' });
      //         console.log('updateShrinkRef--compressImage----图片保存失败');
      //       }
      //     });
      //   } catch (error) {
      //     console.log('updateShrinkRef--error---', error);
      //   }
      //   console.log('updateShrinkRef--item.imgPath-after--', imgItem.path);

      //   imgary.push(imgItem);
      // }
      // console.log('updateShrinkRef--imgary--', imgary);
      // return imgary;

      // 自己写的压缩进行压缩
      // console.log('updateShrinkRef--fileObjAry--', fileObjAry);
      // const imgary = [];
      // for (const item of fileObjAry) {
      //   const imgItem = item as imageObjType;
      //   console.log('updateShrinkRef--item.imgPath--', imgItem.path);
      //   console.log('updateShrinkRef--this.shrinkRef.value--', this.shrinkRef.value);
      //   console.log('updateShrinkRef--this.shrinkRef--', this.shrinkRef);
      //   console.log(
      //     'updateShrinkRef--this.shrinkRef.compressImage--',
      //     this.shrinkRef.compressImage
      //   );
      //   const fileExtension = imgItem.path.split('.').pop();
      //   console.log('updateShrinkRef--this.shrinkRef-fileExtension--', fileExtension);
      //   try {
      //     console.log('updateShrinkRef--进入了---');
      //     imgItem.path = await this.shrinkRef.start(imgItem.path, {
      //       pixels: 4000000, // 最大分辨率，默认二百万
      //       quality: 0.6, // 压缩质量，默认0.8
      //       type: fileExtension, // 图片类型，默认jpg
      //       base64: false, // 是否返回base64，默认false，非H5有效
      //       width: 1080,
      //       height: 1440
      //     });
      //     uni.saveImageToPhotosAlbum({
      //       filePath: imgItem.path,
      //       success() {
      //         utils.toast({ title: '图片保存成' });
      //         console.log('updateShrinkRef-----图片保存成');
      //       }
      //     });
      //   } catch (error) {
      //     console.log('updateShrinkRef--error---', error);
      //     utils.toast({ title: '图片压缩失败' });
      //   }
      //   console.log('updateShrinkRef--item.imgPath-after--', imgItem.path);

      //   imgary.push(imgItem);
      // }
      // return imgary;

      // uni自带的压缩api uni.compressImage(OBJECT)
      const uniCompressImage = async (imagePath: string) => {
        // 将百分比转换为字符串并输出
        const percentageString = await getScalePercentage(imagePath);
        console.log('updateShrinkRef--percentageString--', percentageString);
        return new Promise<string>((resolve, reject) => {
          uni.compressImage({
            src: imagePath,
            quality: 80,
            width: percentageString,
            height: percentageString,
            success: (res) => {
              console.log('updateShrinkRef--uniCompressImage--', res.tempFilePath);
              resolve(res.tempFilePath);
            },
            fail: (res) => {
              resolve(imagePath);
              console.log('updateShrinkRef--uniCompressImage--fail--', res);
            }
          });
        });
      };
      console.log('updateShrinkRef--fileObjAry--', fileObjAry);
      const imgary = [];
      for (const item of fileObjAry) {
        const imgItem = item as imageObjType;
        console.log('updateShrinkRef--item.imgPath--', imgItem.path);
        console.log('updateShrinkRef--this.shrinkRef.value--', this.shrinkRef.value);
        console.log('updateShrinkRef--this.shrinkRef--', this.shrinkRef);
        console.log(
          'updateShrinkRef--this.shrinkRef.compressImage--',
          this.shrinkRef.compressImage
        );
        const fileExtension = imgItem.path.split('.').pop();
        console.log('updateShrinkRef--this.shrinkRef-fileExtension--', fileExtension);
        try {
          console.log('updateShrinkRef--进入了---');
          imgItem.path = await uniCompressImage(imgItem.path);
          // uni.saveImageToPhotosAlbum({
          //   filePath: imgItem.path,
          //   success() {
          //     utils.toast({ title: '图片保存成' });
          //     console.log('updateShrinkRef-----图片保存成');
          //   }
          // });
        } catch (error) {
          console.log('updateShrinkRef--error---', error);
          utils.toast({ title: '图片压缩失败' });
        }
        console.log('updateShrinkRef--item.imgPath-after--', imgItem.path);

        imgary.push(imgItem);
      }
      return imgary;
    },
    async uploadDiffFiles(
      fileTypeNum: number,
      fileObjAry: uploadFileType,
      uuid: string,
      arryIndex: number
    ) {
      // 如果fileTypeNum 是1 ，则是图片，先对图片进行压缩。
      // 已经使用imagetools工具压缩过图片了不需要在压缩
      if (fileTypeNum === 1 && isIosMoreVersion(316)) {
        // 首先压缩图片
        const fileObjAryDeepCopy: imageObjType[] = JSON.parse(JSON.stringify(fileObjAry));
        const imageUploadAry = await this.compressImage(fileObjAryDeepCopy);
        console.log('updateShrinkRef--imageUploadAry--', imageUploadAry);
        fileObjAry = imageUploadAry;
      }
      console.log('updateShrinkRef--开始上传了', fileObjAry);
      const promises = fileObjAry.map((item, index) => {
        const defultFormData = {
          fileIdentity: uuid,
          fileType: fileTypeNum,
          fileSeq: index + 1 + arryIndex
        };
        let formData = {};
        let filePaths = '';
        // 附件类型：1图片；2语音；3视频；4文件；5链接
        switch (fileTypeNum) {
          case 1:
            formData = { ...defultFormData };
            filePaths = (<imageObjType>item).path;
            break;
          case 2:
            formData = { ...defultFormData, fileParam: (<audioType>item).audioTimeNum };
            filePaths = (<audioType>item).audioPath;
            break;
          case 3:
            formData = {
              ...defultFormData,
              fileParam: (<videoType>item).videoDuration,
              'Content-Type': 'video/mp4'
            };
            filePaths = (<videoType>item).videoPath;
            break;
          case 4:
            formData = { ...defultFormData };
            filePaths = (<fileType>item).fileAddress;
            break;
          case 5:
            formData = {
              ...defultFormData,
              linkUrl: (<fileType>item).fileAddress,
              linkName: (<fileType>item).fileName
            };
            filePaths = '';
            break;

          default:
            break;
        }
        return uploadFilePromise(filePaths, fileTypeNum, 3, formData);
      });
      return Promise.all(promises);
    },
    uploadAllFilesUni() {
      const randomUUID = uuidv4();
      uni.showLoading({
        title: '上传中...',
        mask: true,
        fail: () => {
          uni.hideLoading();
        }
      });
      if (
        this.localImageAry?.length ||
        this.localVideoAry?.length ||
        this.localFileAry?.length ||
        this.localAudioAry?.length
      ) {
        this.uploadDiffFiles(1, this.localImageAry as imageObjType[], randomUUID, 0)
          .then(() => {
            return this.uploadDiffFiles(
              3,
              this.localVideoAry as videoType[],
              randomUUID,
              this.localImageAry!.length
            );
          })
          .then(() => {
            return this.uploadDiffFiles(
              2,
              this.localAudioAry as audioType[],
              randomUUID,
              this.localImageAry!.length + this.localVideoAry!.length
            );
          })
          .then(() => {
            const linkAry = this.localFileAry?.filter((item) => item.fileType === 0);
            return this.uploadDiffFiles(
              5,
              linkAry as fileType[],
              randomUUID,
              this.localImageAry!.length + this.localVideoAry!.length + this.localAudioAry!.length
            );
          })
          .then(() => {
            const linkAry = this.localFileAry?.filter((item) => item.fileType === 0);
            const filessAry = this.localFileAry?.filter((item) => item.fileType !== 0);
            return this.uploadDiffFiles(
              4,
              filessAry as fileType[],
              randomUUID,
              this.localImageAry!.length +
                this.localVideoAry!.length +
                this.localAudioAry!.length +
                linkAry!.length
            );
          })
          .then(async () => {
            uni.hideLoading();
            uni.showToast({
              title: '所有文件上传完成',
              icon: 'success',
              mask: true
            });
            // this.clearAllFilesCache();
            uni.$emit(uploadFilesCallBack, { code: 1, fileIdentity: randomUUID });
            isIosMoreVersion(316) && (await clearImageCacheMB('_doc/'));
          })
          .catch((error) => {
            console.error('上传失败：', error);
            uni.$emit(uploadFilesCallBack, { code: 2, fileIdentity: randomUUID });
            uni.showToast({
              title: error,
              duration: 2000,
              icon: 'error'
            });
            uni.hideLoading();
          });
      } else {
        uni.$emit(uploadFilesCallBack, { code: 3, fileIdentity: null });
      }
    }
  }
});

export default fileUploadStore;
