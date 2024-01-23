function formatTime(time: number) {
  if (typeof time !== 'number' || time < 0) {
    return time;
  }

  const hour = parseInt((time / 3600).toString());
  time = time % 3600;
  const minute = parseInt((time / 60).toString());
  time = time % 60;
  const second = time;

  return [hour, minute, second]
    .map(function (n: any) {
      n = n.toString();
      return n[1] ? n : `0${n}`;
    })
    .join(':');
}

function formatLocation(longitude: any, latitude: any) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude);
    latitude = parseFloat(latitude);
  }

  longitude = longitude.toFixed(2);
  latitude = latitude.toFixed(2);

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  };
}
// base64 转 file文件
function dataURLtoFile(dataurl: any, filename: any) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime
  });
}
// 将base64转换为blob
function dataURLtoBlob(dataurl: any) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}
// 将blob转换为file
function blobToFile(theBlob: any, fileName: any) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

// 必填校验
function RequiredRules(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      }
    ]
  };
}
// 必填校验
function RequiredRulesCardNo(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          const reg =
            /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
          if (!reg.test(value)) {
            callback('身份证输入不合法');
          }
          return true;
        }
      }
    ]
  };
}
// 公里数
function RequiredRulesmileage(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (!/^\d+(\.\d{0,2})?$/.test(value)) {
            callback('请输入数字且最大保留两位小数');
          }
          return true;
        }
      }
    ]
  };
}
function notRulesmileage(msg: any) {
  return {
    rules: [
      {
        required: false,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (!/^\d+(\.\d{0,2})?$/.test(value)) {
            callback('请输入数字且最大保留两位小数');
          }
          return true;
        }
      }
    ]
  };
}
// 必填校验 手机号
function RequiredRulesPhone(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (!/^1[0-9]{10,10}$/.test(value)) {
            callback('手机号格式不对');
          }
          return true;
        }
      }
    ]
  };
}
// 金额
function RequiredMoney(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          const reg =
            /(^([1-9]{1}[0-9]{0,7})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
          if (value === 0) {
            callback('金额必须大于0');
          }
          if (!reg.test(value)) {
            callback('金额最多保留两位小数');
          }
          if (value > 9999999.99) {
            callback('超出最大限额');
          }
          return true;
        }
      }
    ]
  };
}
// 固话手机号校验
function RequirelindLine(msg: any) {
  // var isTelePhone=
  const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
  const isMob = /^1[0-9]{10,10}$/;
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (isMob.test(value) || isPhone.test(value)) {
            return true;
          } else {
            callback('区号-电话号(分机号)或者11位以1开头的手机号码');
          }
        }
      }
    ]
  };
}

// 年限
function RequireYearRul(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (/^\d{1,}$/.test(value)) {
            return true;
          } else {
            callback('请输入正整数');
          }
        }
      }
    ]
  };
}
// 必填校验 姓名
function RequiredRulesName(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (
            /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/.test(
              value
            ) ||
            /^[a-zA-Z]+$/.test(value)
          ) {
            return true;
          } else {
            callback('仅支持中英文姓名');
          }
        }
      }
    ]
  };
}

function firstBl(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          if (Number(value) > 100) {
            callback('首付比例不可大于100%');
          }
          return true;
        }
      }
    ]
  };
}
// 车牌号校验
function RequiredPlateNo(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: msg
      },
      {
        validateFunction(rule: any, value: any, data: any, callback: any) {
          const reg =
            /[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9]{5,6}/;
          if (reg.test(value)) {
            return true;
          } else {
            callback('请输入正确的车牌号');
          }
        }
      }
    ]
  };
}
// 车架号校验
function vinRules(msg: any) {
  return {
    rules: [
      {
        required: true,
        errorMessage: '请输入车架号',
        validateFunction(rule: any, value: any, data: any, callback: any) {
          const onblurjs = function (vin: any) {
            if (vin.length > 0 && vin.length !== 17) {
              return false;
            }
            const vinVal = vin.toUpperCase();
            const charToNum: any = {
              A: 1,
              B: 2,
              C: 3,
              D: 4,
              E: 5,
              F: 6,
              G: 7,
              H: 8,
              J: 1,
              K: 2,
              L: 3,
              M: 4,
              N: 5,
              P: 7,
              R: 9,
              S: 2,
              T: 3,
              U: 4,
              V: 5,
              W: 6,
              X: 7,
              Y: 8,
              Z: 9
            };
            let obj = 0;
            const arr = [];
            for (let i = 0; i < vinVal.length; i++) {
              const temp = vinVal.charAt(i);
              if (charToNum[temp]) {
                arr[i] = charToNum[temp];
              } else {
                arr[i] = Number(temp);
              }
              if (i === 8) {
                arr[i] = vinVal.charAt(i);
              }
            }
            let a1 = 8;
            for (let i = 0; i < 7; i++) {
              obj += Number(arr[i]) * a1;
              a1--;
            }
            obj += Number(arr[7]) * 10;
            let a2 = 9;
            for (let i = 9; i < 17; i++) {
              obj += Number(arr[i]) * a2;
              a2--;
            }
            let result: any = Number(obj) % 11;
            if (parseInt(result) === 10) {
              result = 'X';
            }
            if (result === arr[8]) {
              // 成功
              return true;
            } else {
              // 失败
              return false;
            }
          };
          if (!onblurjs(value)) {
            callback('请输入正确车架号');
          }
          return true;
        }
      }
    ]
  };
}

const dateUtils = {
  UNITS: {
    年: 31557600000,
    月: 2629800000,
    天: 86400000,
    小时: 3600000,
    分钟: 60000,
    秒: 1000
  },
  humanize(milliseconds: any) {
    let humanize = '';
    const newUNITS = this.UNITS as any;
    for (const key in this.UNITS) {
      if (milliseconds >= newUNITS[key]) {
        humanize = `${Math.floor(milliseconds / newUNITS[key]) + key}前`;
        break;
      }
    }
    return humanize || '刚刚';
  },
  format(dateStr: any) {
    const date = this.parse(dateStr);
    const diff = Date.now() - date.getTime();
    if (diff < this.UNITS['天']) {
      return this.humanize(diff);
    }
    const _format = function (number: any) {
      return number < 10 ? `0${number}` : number;
    };
    return `${date.getFullYear()}/${_format(date.getMonth() + 1)}/${_format(
      date.getDate()
    )}-${_format(date.getHours())}:${_format(date.getMinutes())}`;
  },
  parse(str: any) {
    // 将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    const a = str.split(/[^0-9]/);
    return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
  }
};

const isNetworkUrl = (url: string) => {
  const regexPattern = /^(https?|ftp):\/\//i;
  return regexPattern.test(url);
};
// 判断当前是ios的是否大于指定版本
const isIosMoreVersion = (version: number): boolean => {
  const { clientInfo } = useStore('user');
  console.log('查看用户的clientInfo-value--', clientInfo.value);
  console.log('查看用户的clientInfo---getSystemInfoSync---', uni.getSystemInfoSync().platform);
  if (uni.getSystemInfoSync().platform === 'ios') {
    const cbv = parseInt(clientInfo.value.cbv || '0');
    console.log('查看用户的clientInfo-cbv--version--', cbv > version);
    return cbv > version;
  }
  return true;
};

export {
  formatTime,
  formatLocation,
  dateUtils,
  dataURLtoFile,
  dataURLtoBlob,
  blobToFile,
  RequiredRules,
  RequiredRulesPhone,
  vinRules,
  firstBl,
  RequiredRulesCardNo,
  RequiredRulesmileage,
  RequiredRulesName,
  RequirelindLine,
  RequireYearRul,
  notRulesmileage,
  RequiredPlateNo,
  RequiredMoney,
  isNetworkUrl,
  isIosMoreVersion
};
