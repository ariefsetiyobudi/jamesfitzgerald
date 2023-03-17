class Detection {
  isPhone () {
    if (!this.isPhoneChecked) {
      this.isPhoneChecked = true

      this.isPhoneCheck = document.documentElement.classList.contains('phone')
    }

    return this.isPhoneCheck
  }

  isDesktop () {
    if (!this.DesktopChecked) {
      this.DesktopChecked = true

      this.DesktopCheck = document.documentElement.classList.contains('desktop')
    }

    return this.DesktopCheck
  }

  isTablet () {
    if (!this.TabletChecked) {
      this.TabletChecked = true

      this.TabletCheck = document.documentElement.classList.contains('tablet')
    }

    return this.TabletCheck
  }

  isWebPSupported () {
    if (!this.isWebPChecked) {
      this.isWebPChecked = !0
      const canvas = document.createElement('canvas')
      canvas.getContext && canvas.getContext('2d') && (this.isWebPCheck = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0)
    }
    return this.isWebPCheck
  }
}

const DetectionManager = new Detection()

export default DetectionManager
