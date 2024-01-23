import { clone } from 'lodash';
import utils from '../utils';
import { formatTokenObj, getCookie } from '../utils/caches';
import ajax from '@/commons/http';

interface UserInfo {
  ima?: string; // 是否多身份账号
  wid?: number; // 账号ID
  uid?: string; // 博客ID
  avatorUrl?: string; // 头像
  nickname?: string; // 昵称
  provinceId?: number; // 省分id
  areaCode?: number; // 地区id
  jut?: number; // 角色 // jxlx身份类型 -1, "网站注册账号" 0, "教师" 1, "学生" 2, "家长" 3, "管理员"  99, "访客（未登录）"
  userId?: number; // jxlx userId
  schoolName?: string; // 学校名称'
  schoolId?: string; // 学校id
  orgId?: number; // 组织id'
  jpmu?: boolean; // 是否有jxlx班级资料管理权限
  name?: string; //  jxlx姓名
  info?: string; // 身份描述
  gradeId?: number; // 学科年级
  zxjx?: number; // 是否众享家校，返回值 "1" "0"
  bookVersion?: number; // 学科教材版本
  username?: string; // 用户名
  mobile?: string; // 手机号'
  provinceName?: string; // 省分名称
  xxtGradeName?: string; // 学科年级名称
  xxtBookVersionName?: string; // 学科教材版本名称
  useXinzxData?: string; // 是否使用新众享家校数据
  phaseCode?: number; // 学段编码
}
interface clientInfoType {
  cv?: string;
  chv?: string;
  ch?: string;
  jv?: string;
  cbv?: string;
  [key: string]: any;
}

// 获取客户端传递过来的userAgent
interface userAgentType {
  hostId?: string;
  appversion?: string;
  appversioncode?: string;
  [key: string]: any;
}
// 默认用户信息
const defaultUserInfo: UserInfo = {
  ima: '', // 是否多身份账号
  wid: 0, // 账号ID
  uid: '', // 博客ID
  avatorUrl: '', // 头像
  nickname: '', // 昵称
  provinceId: 0, // 省分id
  areaCode: 0, // 地区id
  jut: 0, // 角色 // jxlx身份类型 -1, "网站注册账号" 0, "教师" 1, "学生" 2, "家长" 3, "管理员"   99, "访客（未登录）"
  userId: -1, // jxlx userId
  schoolName: '', // 学校名称'
  schoolId: '', // 学校id
  orgId: 0, // 组织id'
  jpmu: false, // 是否有jxlx班级资料管理权限
  name: '', //  jxlx姓名
  info: '', // 身份描述
  gradeId: 0, // 学科年级
  zxjx: 0, // 是否众享家校，返回值 "1" "0"
  bookVersion: 0, // 学科教材版本
  username: '', // 用户名
  mobile: '', // 手机号'
  provinceName: '', // 省分名称
  xxtGradeName: '', // 学科年级名称
  xxtBookVersionName: '', // 学科教材版本名称
  useXinzxData: '', // 是否使用新众享家校数据
  phaseCode: 0 // 学段编码
};

// 用户默认 clientInfo
const defaultClientInfo: clientInfoType = {
  cv: '', // 客户端版本号
  chv: '', // 客户端渠道版本号
  ch: '', // 客户端渠道号
  jv: '', // 客户端版本号
  cbv: '' // 客户端build版本号
};

const defaultUserAgent: userAgentType = {
  hostId: '', // 客户端版本号
  appversion: '', // 客户端渠道版本号
  appversioncode: '' // 客户端渠道号
};

const user = defineStore({
  id: 'user',
  state: () => ({
    userInfo: clone(defaultUserInfo), // 用户信息,
    isLogin: !!uni.getStorageSync('token'), // 登录状态
    lastUpdateTime: 0, // 上次更新时间
    useToken: uni.getStorageSync('token'),
    userAgent: clone(defaultUserAgent), // 用户设备信息'
    clientInfo: clone(defaultClientInfo) // 客户端信息 {}
  }),
  actions: {
    // 设置token
    setToken(token = '', userMessage: any = {}, userAgent = '', clientInfo: any = {}) {
      this.useToken = token;
      if (token === '') {
        this.isLogin = false;
        uni.removeStorageSync('token');
      } else {
        this.isLogin = true;
        uni.setStorageSync('token', token);
        this.loginAfter(userMessage, userAgent, clientInfo);
      }
      return this.isLogin;
    },
    // 重置用户默认数据
    resetUserData() {
      this.setToken();
      this.userInfo = clone(defaultUserInfo);
      this.clientInfo = clone(defaultClientInfo);
      this.userAgent = clone(defaultUserAgent);
    },
    getClientInfo(clientInfo: any) {
      try {
        if (typeof clientInfo === 'object') {
          clientInfo = JSON.stringify(clientInfo);
        }
        const resParse = JSON.parse(clientInfo);
        return resParse;
      } catch (error) {}
    },
    // 设置客户端信息
    setClientInfo(clientInfo: any) {
      this.clientInfo = this.getClientInfo(clientInfo);
    },
    // 格式化 UA
    formatUserAgent(userAgent: string) {
      try {
        const userary = userAgent.split(';');
        const userAgenObj = userary.reduce((result: any, token: any) => {
          const [key, value] = token.split(':');
          result[key || 'device'] = value || 'device';
          return result;
        }, {});
        return userAgenObj;
      } catch (error) {}
    },
    setUserAgent(userAgent: string) {
      this.userAgent = this.formatUserAgent(userAgent);
    },
    // 获取个人信息
    async getInfo(userMessage: any, entry: String = 'unknown') {
      // 如果登录传入用户信息走这个
      const getV = (k: any, _int?: any) => {
        if (userMessage[k] || (k === 'jxlxUserType' && userMessage[k] === 0)) {
          return _int ? parseInt(userMessage[k], 10) : userMessage[k];
        }
        return null;
      };
      if (Object.keys(userMessage).length > 0) {
        const unitCount = getV('unitCount', true);
        const uid = getV('uid', true);
        const userinfo = {
          ima: userMessage.accountList && userMessage.accountList.length > 0, // 是否多身份账号
          wid: getV('webId', true), // 账号ID
          uid, // 博客ID
          avatorUrl: utils.getAvatorUrl(getV('uid', true)), // 头像
          nickname: getV('nickname'), // 昵称
          provinceId: getV('province', true), // 省分id
          areaCode: userMessage.cityCode ? parseInt(userMessage.cityCode, 10) : 371, // 地区id
          jut: getV('jxlxUserType', true), // 角色 // jxlx身份类型 -1, "网站注册账号" 0, "教师" 1, "学生" 2, "家长" 3, "管理员"   99, "访客（未登录）"
          userId: getV('userId', true), // jxlx userId
          schoolName: userMessage.schoolName, // 学校名称'
          schoolId: userMessage.schoolId, // 学校id
          orgId: getV('orgId', true), // 组织id'
          jpmu: unitCount > 0, // 是否有jxlx班级资料管理权限
          name: getV('personName'), // jxlx姓名
          info: getV('info'), // 身份描述
          gradeId: getV('xxtGradeId', true), // 学科年级
          zxjx: getV('zxjx'), // 是否众享家校，返回值 "1" "0"
          bookVersion: getV('xxtBookVersion', true), // 学科教材版本
          username: getV('username'),
          mobile: getV('mobile'),
          provinceName: getV('provinceName'),
          xxtGradeName: getV('xxtGradeName'),
          xxtBookVersionName: getV('xxtBookVersionName'),
          phaseCode: getV('phaseCode', true), // 学段编码
          useXinzxData: userMessage.useXinzxData
        };
        this.userInfo = userinfo;
        return Promise.resolve();
      }
      // 如果登录没有传入用户信息走请求
      // XXX：待改为接口返回 webId。引来 Cookie 可能会由于浏览器政策收紧导致获取不到
      let ckWid = null;
      if (entry === 'H5') {
        ckWid = getCookie('XXT_ID');
        if (ckWid != null) {
          ckWid = parseInt(ckWid);
        }
      }

      const result: any = await ajax({
        url: '/user-data-v2/user/get-user-info-by-login',
        method: 'GET'
      });
      if (result && !result.message) {
        const userinfo = {
          avatorUrl: utils.getAvatorUrl(result.blogId), // 头像
          nickname: result.nickName, // 昵称
          provinceId: result.provinceId, // 省分id
          areaCode: result.cityCode ? parseInt(result.cityCode, 10) : 371, // 地区id
          jut: result.userType, // 角色
          schoolName: result.schoolName, // 学校名称'
          schoolId: result.schoolId, // 学校id
          orgId: result.orgId, // 组织id'
          useXinzxData: result.useXinzxData, // 是否使用新平台
          wid: formatTokenObj(this.useToken).XXT_ID || ckWid // webId
        };
        this.userInfo = userinfo;
        this.isLogin = true; // 重置登录状态
        return Promise.resolve(result);
      }
      const errorMessage = '请求异常异常';
      uni.showToast({
        title: result.message || errorMessage,
        icon: 'error',
        mask: true
      });
      // 登录失败， 重置登录信息。
      this.resetUserData();
    },
    // 设置用户信息属性
    setUserInfoAttr(k: string, v: any) {
      // @ts-expect-error
      this.userInfo[k] = v;
    },
    // 更新用户相关信息 (手动限流 5秒之内不刷新)
    async updateUserData(userMessage: any) {
      if (!this.isLogin) {
        this.resetUserData();
        return;
      }
      const nowTime = new Date().getTime();

      if (this.lastUpdateTime + 5000 > nowTime) return;
      try {
        await this.getInfo(userMessage);
      } catch (error) {}
      this.lastUpdateTime = nowTime;
      return this.userInfo;
    },
    // 登录后获取用户信息 userAgent clientInfo
    async loginAfter(userMessage: any, userAgent: string, clientInfo: any) {
      this.clientInfo = this.getClientInfo(clientInfo);
      this.userAgent = this.formatUserAgent(userAgent);
      await this.updateUserData(userMessage);
    }
  },
  persist: {
    enabled: true
  }
});

export default user;
