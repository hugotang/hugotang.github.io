// ==UserScript==
// @name         Calendar411 Floating Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在 Calendar411 網站添加浮動按鈕和建除十二神
// @author       Your name
// @match        https://calendar411.com/hk/huangli/*
// @grant        GM_addStyle
// @require      http://html2canvas.hertzen.com/dist/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lunar-javascript/1.6.12/lunar.min.js
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  // 常量配置
  const CONFIG = {
    BUTTON: {
      ICON: "📷",
      COLORS: {
        DEFAULT: "#4CAF50",
        HOVER: "#45a049",
      },
      STYLES: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 20px",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        zIndex: "9999",
        fontSize: "16px",
        transition: "opacity 0.3s",
      },
    },
    SCREENSHOT: {
      QUALITY: 1.0,
      FORMAT: "image/png",
      SCALE: 2.0, // 添加縮放參數
    },
  };

  GM_addStyle(`
.clHl_bg{width: 180px;padding:5px 4px 6px 4px;min-height:130px}
.clHl_bggray{width:180px; padding:5px 4px 6px 4px; min-height:130px}
.clHl_bgtoday{width:180px; padding:5px 4px 6px 4px; min-height:130px}
.cl_hl{font-size:12px;line-height:13px;}
.cl_hlgray{font-size: 11px;line-height: 13px;color:#ddd}
.cl_top{ font-size:14px; float:left; line-height:16px; padding-top:6px;  vertical-align:baseline;}
.cl_topred{ font-size:14px; float:left; line-height:16px; padding-top:6px; vertical-align:baseline;}
.cl_topgreen{ font-size:14px; float:left;  line-height:16px;padding-top:6px; vertical-align:bottom;}
.cl_topgray{ font-size:14px; float:left; color:#ccc; line-height:16px;padding-top:6px;}
.cl_Hlnum{
    font-size:40px;
    font-family:Arial;
    font-weight:bold;
    text-align:center;
    line-height:38px;
    position: relative;
    left: -12px;
}
.cl_Hlnumred{
    font-size:40px;
    font-family:Arial;
    font-weight:bold;
    color:Red;
    text-align:center;
    line-height:36px;
    position: relative;
    left: -12px;
}
.cl_Hlnumgreen{
    font-size:40px;
    font-family:Arial;
    font-weight:bold;
    color:Green;
    text-align:center;
    line-height:36px;
    position: relative;
    left: -12px;
}
.cl_Hlnumgray{
    font-size:40px;
    font-family:Arial;
    font-weight:bold;
    color:#ddd;
    text-align:center;
    line-height:36px;
    position: relative;
    left: -12px;
}
.cl2_Title{width: 1304px;background-color:#dee3ef;text-align:center;font-weight:bold;font-size:24px;padding:8px;border-top: 2px solid #004973;border-left:2px solid #004973;border-right:2px solid #004973;}
.mt_4 {MARGIN-TOP: 5px;}
.cc_bgtoday{background-color:#fff;}
.cl_st, .cl_main{ font-size:13px;text-align:center;line-height:14px;color:Green; }
.cl_maingray{ font-size:13px;text-align:center;line-height:14px;color:#ccc; }
.cl_mainred{ font-size:13px;text-align:center;line-height:14px;color:Red; }
.cl_maintoday{ font-size:13px;text-align:center;line-height:14px;color:Green; }
.cl_maingreen{ font-size:13px;text-align:center;line-height:14px;color:Green; }
.cl_stp{ font-size:13px;text-align:left;line-height:14px;}
`);

  // DOM 元素選擇器
  const SELECTORS = {
    TITLE: "ctl00_cphContent_ltH2",
    CALENDAR: "ctl00_cphContent_dlLR_ctl00_divPr",
  };

  class FloatingButton {
    constructor() {
      this.button = this.createButton();
      this.setupEventListeners();
    }

    createButton() {
      const button = document.createElement("button");
      button.innerHTML = CONFIG.BUTTON.ICON;
      Object.assign(button.style, CONFIG.BUTTON.STYLES);
      button.style.backgroundColor = CONFIG.BUTTON.COLORS.DEFAULT;
      return button;
    }

    setupEventListeners() {
      this.button.onmouseover = () => {
        this.button.style.backgroundColor = CONFIG.BUTTON.COLORS.HOVER;
      };
      this.button.onmouseout = () => {
        this.button.style.backgroundColor = CONFIG.BUTTON.COLORS.DEFAULT;
      };
      this.button.onclick = () => this.takeScreenshot();
      window.onscroll = this.handleScroll.bind(this);
    }

    handleScroll() {
      const scrolled =
        document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
      this.button.style.opacity = scrolled ? "1" : "0";
    }

    async takeScreenshot() {
      try {
        const fileName = this.getFileName();
        const calendar = document.getElementById(SELECTORS.CALENDAR);
        const canvas = await html2canvas(calendar, {
          scale: CONFIG.SCREENSHOT.SCALE, // 使用縮放參數
          useCORS: true, // 允許跨域圖片
          logging: false, // 關閉日誌
        });
        this.downloadImage(canvas, fileName);
      } catch (error) {
        console.error("截圖失敗:", error);
      }
    }

    getFileName() {
      const titleElement = document.getElementById(SELECTORS.TITLE);
      const { year, month } = this.extractYearMonth(titleElement?.innerText);
      return `${year}-${month}.png`;
    }

    extractYearMonth(inputString) {
      if (!inputString)
        return {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        };

      const match = inputString.match(/公曆(\d{4})年(\d{1,2})月/);
      if (!match)
        return {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        };

      return {
        year: parseInt(match[1], 10),
        month: parseInt(match[2], 10),
      };
    }

    downloadImage(canvas, fileName) {
      const link = document.createElement("a");
      link.href = canvas
        .toDataURL(CONFIG.SCREENSHOT.FORMAT, CONFIG.SCREENSHOT.QUALITY)
        .replace(CONFIG.SCREENSHOT.FORMAT, "image/octet-stream");
      link.download = fileName;
      link.click();
    }

    mount() {
      document.body.appendChild(this.button);
    }
  }

  class CalendarEnhancer {
    constructor() {
      console.log("CalendarEnhancer 初始化開始");
      this.yearMonth = this.getYearMonth();
      console.log("獲取到年月信息:", this.yearMonth);
      this.init();
    }

    getYearMonth() {
      const titleElement = document.getElementById(SELECTORS.TITLE);
      console.log("標題元素:", titleElement?.innerText);
      const match = titleElement?.innerText.match(/公曆(\d{4})年(\d{1,2})月/);
      if (!match) {
        console.warn("無法從標題中匹配年月");
        return null;
      }

      return {
        year: parseInt(match[1], 10),
        month: parseInt(match[2], 10),
      };
    }

    async init() {
      if (!this.yearMonth) {
        console.error("無法獲取年月信息");
        return;
      }

      const calendar = document.getElementById(SELECTORS.CALENDAR);
      if (!calendar) {
        console.error("無法找到日曆元素");
        return;
      }

      console.log("開始處理日曆單元格");
      const cells = calendar.querySelectorAll("td.cl_over");
      console.log("找到的單元格數量:", cells.length);

      for (let i = 0; i < cells.length; i++) {
        const dateText = formatDate(
          cells[i].querySelector("div").id.replace("dt", "")
        );

        if (dateText) {
          console.log(`找到日期: ${dateText}`);
          this.enhanceCell(cells[i], dateText);
        }
      }
    }

    async enhanceCell(cell, dateText) {
      console.log(`處理日期 ${dateText} 的單元格`);
      I18n.setMessages("chs", {
        "zx.jian": "建",
        "zx.chu": "除",
        "zx.man": "滿",
        "zx.ping": "平",
        "zx.ding": "定",
        "zx.zhi": "執",
        "zx.po": "破",
        "zx.wei": "危",
        "zx.cheng": "成",
        "zx.shou": "收",
        "zx.kai": "開",
        "zx.bi": "閉",
      });
      I18n.setLanguage("cht");
      // 檢查是否已經添加過建除十二神信息
      const existingJchu = cell.querySelector(".jchu-info");
      if (existingJchu) {
        console.log(`日期 ${dateText} 已有執位信息，跳過`);
        return;
      }
      const lunar = Solar.fromYmd(
        dateText.year,
        dateText.month,
        dateText.day
      ).getLunar();
      const jchuDiv = document.createElement("div");
      jchuDiv.className = "mt_4";
      if (cell.querySelectorAll("div")[0].className == "clHl_bggray") {
        jchuDiv.innerHTML = `<b><font color="lightgray">【${lunar.getZhiXing()}日】</font></b>`;
      } else {
        jchuDiv.innerHTML = `<b><font color="#1e88e5">【${lunar.getZhiXing()}日】</font></b>`;
      }
      cell.querySelectorAll("div")[3].appendChild(jchuDiv);
      const targetDiv = cell.querySelectorAll("div.mt_4")[4];
      if (targetDiv) {
        const originalText = targetDiv.innerText; // 獲取原始文本
        const modifiedText = originalText.replace(/ /g, "、"); // 替換所有空格為頓號
        const modifiedHTML = targetDiv.innerHTML.replace(
          originalText,
          modifiedText
        );
        cell.querySelector("cl_hl").removeChild(targetDiv);
        const yiDiv = document.createElement("div");
        yiDiv.className = "mt_4";
        yiDiv.innerHTML = modifiedHTML;
        cell.querySelector("cl_hl").appendChild(yiDiv); // 保留HTML結構，替換文本// 添加 100 毫秒的延遲
      }
    }
  }

  function formatDate(dateString) {
    if (!dateString) {
      return null; // Return null if input is null or undefined
    }

    const regex = /^(\d{4})(\d{1,2})(\d{1,2})$/;
    const match = dateString.match(regex);

    if (match) {
      const year = match[1];
      const month = parseInt(match[2], 10); // Parse month as integer to remove leading zero
      const day = parseInt(match[3], 10); // Parse day as integer to remove leading zero
      return { year, month, day };
    } else {
      return null; // Return null if the input string doesn't match the expected format
    }
  }

  // 主要初始化函數
  function initialize() {
    console.log("開始初始化腳本...");

    // 初始化浮動按鈕
    const floatingButton = new FloatingButton();
    floatingButton.mount();
    console.log("浮動按鈕已創建");

    // 初始化日曆增強
    function tryInitCalendarEnhancer() {
      const calendar = document.getElementById(SELECTORS.CALENDAR);
      const title = document.getElementById(SELECTORS.TITLE);

      if (calendar && title) {
        console.log("找到所需元素，初始化 CalendarEnhancer");
        new CalendarEnhancer();
      } else {
        console.log("等待元素載入...");
        setTimeout(tryInitCalendarEnhancer, 500);
      }
    }

    tryInitCalendarEnhancer();
  }

  // 確保頁面完全加載後執行
  if (document.readyState === "complete") {
    console.log("頁面已完全加載，直接初始化");
    initialize();
  } else {
    console.log("等待頁面加載完成...");
    window.addEventListener("load", initialize);
  }
})();
