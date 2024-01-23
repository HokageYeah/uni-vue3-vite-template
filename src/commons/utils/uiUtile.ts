const uniShowToast = (title: string, time = 2000) => {
  uni.showToast({
    title,
    mask: true,
    duration: time,
    icon: 'none',
    fail: () => {
      uni.hideToast();
    }
  });
};
export { uniShowToast };
