<template>
  <div class="back">
    <i class="iconfont icon-ffanhui-" @click="$router.push('/pvx')"></i>
  </div>

  <div class="lunbo">
    <div id="dg-container" class="dg-container">
      <div class="dg-wrapper">
        <!-- js插入 -->
      </div>

      <div class="lbbtn">
        <span class="dg-prev"></span>
        <span class="dg-next"></span>
      </div>
    </div>
  </div>

  <img
    class="sidebar"
    src="https://wz950116.bj.bcebos.com/jx3-pvx%2F%E6%8E%89%E8%90%BD%2Fassets%2Fxfe-layer-50-80ede9b5.png.webp"
  />
</template>

<script setup>
import { onMounted } from "vue"
onMounted(() => {
  const data = [
    "https://bj.bcebos.com/v1/wz950116/jx3-pvx/奇遇/2021-06-14_21-18-07-000.jpg",
    "https://bj.bcebos.com/v1/wz950116/jx3-pvx/奇遇/2021-05-16_21-44-40-000.jpg",
    "https://bj.bcebos.com/v1/wz950116/jx3-pvx/奇遇/2021-04-30_23-58-32-000.jpg",
    "https://bj.bcebos.com/v1/wz950116/jx3-pvx/奇遇/2020-11-05_23-22-48-000.png",
    "https://bj.bcebos.com/v1/wz950116/jx3-pvx/奇遇/2020-11-05_20-50-33-000.png",
    "https://bj.bcebos.com/v1/wz950116/jx3-pvx/奇遇/2020-09-20_22-09-59-000.png",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F2020-07-24_21-00-38-000.png",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F2020-06-22_21-23-00-000.png",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F2020-06-06_13-27-56-000.png",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F2020-05-17_16-27-53-000.png",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F2020-05-17_13-14-03-000.png",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F2020-02-23_20-30-36-000.png",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F2019-12-26_19-16-18-000.png",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F2019-08-07_18-40-42-000.jpg",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F2018-11-25_10-56-47-000.png",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F2018-06-07_22-24-14-000.png",
    "https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2F%E7%82%BC%E7%8B%B1%E5%8E%A8%E7%A5%9E.bmp"
  ]
  let num = 0,
    total = data.length,
    onOff = true

  data.forEach((url, index) => {
    let aStyle = "",
      imgStyle = ""
    switch (index) {
      case 0:
        aStyle = "opacity: 1; visibility: visible;"
        break
      case 1:
        aStyle =
          "opacity: 1; visibility: visible; transform: translateX(240px) translateZ(-200px) rotateY(-45deg);"
        break
      case 2:
        aStyle =
          "opacity: 0; visibility: hidden; transform: translateX(450px) translateZ(-300px) rotateY(-45deg);"
        break
      case total - 2:
        aStyle =
          "opacity: 0; visibility: hidden; transform: translateX(-450px) translateZ(-300px) rotateY(45deg);"
        break
      case total - 1:
        aStyle =
          "opacity: 1; visibility: visible; transform: translateX(-240px) translateZ(-200px) rotateY(45deg);"
        imgStyle = "background-position: center;"
        break
      default:
        aStyle =
          "opacity: 0; visibility: hidden; transform: translateX(-450px) translateZ(-300px) rotateY(45deg);"
        break
    }
    const content = `
        <a href="javascript:void(0);" data-url="${url}" data-index=${index} class="${
      index === 0 ? "dg-center" : ""
    }" style="${aStyle}">
            <div class="img" style="${imgStyle}background-image: url(${
      data[index].slice(0, -4) + "x1.png"
    })"></div>
            <div class="shadow"></div>
            <span class='line'></span>
        </a>
      `
    $(".dg-wrapper").append(content)
  })

  $(".dg-prev").on("click", () => {
    if (!onOff) return
    onOff = false

    // 先全部重置隐藏
    $(".dg-wrapper a").removeClass("dg-center").css({
      opacity: 0,
      visibility: "hidden"
    })

    num = num - 1 < 0 ? total - 1 : num - 1

    fn()

    setTimeout(() => {
      onOff = true
    }, 800)
  })

  $(".dg-next").on("click", () => {
    if (!onOff) return
    onOff = false

    // 先全部重置隐藏
    $(".dg-wrapper a").removeClass("dg-center").css({
      opacity: 0,
      visibility: "hidden"
    })

    num = num + 1 > total - 1 ? 0 : num + 1

    fn()

    setTimeout(() => {
      onOff = true
    }, 800)
  })

  const fn = () => {
    // 上一张
    const last = num - 1 < 0 ? total - 1 : num - 1
    // 上上张
    const lastLast =
      num - 2 < 0 ? (num - 1 < 0 ? last - 1 : total - 1) : num - 2
    // 下一章
    const next = num + 1 > total - 1 ? 0 : num + 1
    // 下下张
    const nextNext =
      num + 2 > total - 1 ? (num + 1 > total - 1 ? next + 1 : 0) : num + 2

    $(".dg-wrapper a").eq(last).css({
      transform: "translateX(-240px) translateZ(-200px) rotateY(45deg)",
      opacity: 1,
      visibility: "visible"
    })
    $(".dg-wrapper a").eq(lastLast).css({
      transform: "translateX(-450px) translateZ(-300px) rotateY(45deg)"
    })
    $(".dg-wrapper a").eq(num).addClass("dg-center").css({
      transform: "translateX(0) translateZ(0) rotateY(0)",
      opacity: 1,
      visibility: "visible"
    })
    $(".dg-wrapper a").eq(next).css({
      transform: "translateX(240px) translateZ(-200px) rotateY(-45deg)",
      opacity: 1,
      visibility: "visible"
    })
    $(".dg-wrapper a").eq(nextNext).css({
      transform: "translateX(450px) translateZ(-300px) rotateY(-45deg)"
    })
  }

  $(".dg-wrapper a").on("click", function () {
    if ($(this).attr("data-index") == num) {
      window.open($(this).attr("data-url"))
    }
  })
})
</script>

<style type="text/css">
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  position: relative;
  background: url(https://wz950116.bj.bcebos.com/jx3-pvx%2F%E6%8E%89%E8%90%BD%2Fassets%2Fxfe-layer-31-b80156dd.jpg.webp)
    no-repeat;
  background-size: cover;
}

.icon-ffanhui- {
  position: fixed;
  left: 20px;
  top: 10px;
  font-size: 48px;
  cursor: pointer;
}

.lunbo {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -465px;
  margin-top: -265px;
  width: 930px;
  height: 530px;
  overflow: hidden;
}

.dg-container {
  width: 100%;
  height: 470px;
  position: absolute;
  top: 0;
  padding-top: 4px;
}

.dg-wrapper {
  position: relative;
  width: 598px;
  height: 470px;
  margin: 0 auto;
  transform-style: preserve-3d;
  perspective: 1000px;
}
.dg-wrapper a {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  background: #000000;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.5s;
  overflow: hidden;
}

.dg-wrapper a.dg-center {
  z-index: 99999;
  cursor: pointer;
}

.dg-wrapper a .img {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
}

.dg-wrapper a .shadow {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #000000
    url("https://wz950116.bj.bcebos.com/jx3-sl%2Fpublic%2Fcheck.png") no-repeat
    center;
  display: block;
  opacity: 0.5;
}

.dg-wrapper a .line {
  position: absolute;
  top: 8px;
  left: 8px;
  bottom: 8px;
  right: 8px;
  display: block;
  border: 1px solid #fff;
  opacity: 0.3;
}

.dg-wrapper .dg-center .shadow {
  opacity: 0;
}

.dg-wrapper .dg-center:hover .shadow {
  opacity: 0.5;
}

.dg-wrapper .dg-center:hover .line {
  opacity: 1;
}

.dg-container .lbbtn {
  z-index: 1000;
}

.dg-container .lbbtn span {
  position: absolute;
  display: block;
  cursor: pointer;
  top: 200px;
  width: 52px;
  height: 104px;
  opacity: 0.8;
  transition: 0.2s linear;
}

.dg-container .lbbtn span.dg-prev {
  background: url("https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2Fassets%2Farrow_left.png")
    no-repeat center;
  left: 40px;
}

.dg-container .lbbtn span.dg-prev:hover {
  left: 30px;
}

.dg-container .lbbtn span.dg-next {
  background: url("https://wz950116.bj.bcebos.com/jx3-pvx%2F%E5%A5%87%E9%81%87%2Fassets%2Farrow_right.png")
    no-repeat center;
  right: 40px;
}

.dg-container .lbbtn span.dg-next:hover {
  right: 30px;
}

.sidebar {
  position: absolute;
  top: -24px;
  right: -7px;
}
</style>
