class LunarCalendar {
  constructor() {
    this.currentDate = new Date();
  }

  renderCalendar(year, month) {
    // 更新標題
    const headerTitle = document.querySelector(".calendar-header h2");
    headerTitle.textContent = `${year}年${month + 1}月`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = "";

    // 填充月初空白
    for (let i = 0; i < firstDay.getDay(); i++) {
      calendarBody.appendChild(this.createEmptyCell());
    }

    // 填充日期
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const lunar = Solar.fromYmd(year, month + 1, day).getLunar();
      calendarBody.appendChild(this.createDateCell(day, lunar));
    }

    // 填充月末空白，確保填滿最後一行
    const totalCells = firstDay.getDay() + lastDay.getDate();
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        calendarBody.appendChild(this.createEmptyCell());
      }
    }
  }

  createDateCell(day, lunar) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";

    cell.innerHTML = `
            <div class="solar-date">${day}</div>
            <div class="lunar-date">${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}</div>
            <div class="jianzhu">【${lunar.getZhiXing()}】</div>
            <div class="almanac">
                <div class="suitable">宜：${lunar.getTimeYi().join("、")}</div>
                <div class="unsuitable">忌：${lunar
                  .getTimeJi()
                  .join("、")}</div>
            </div>
        `;

    return cell;
  }

  createEmptyCell() {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    return cell;
  }
}

// 初始化日曆
const calendar = new LunarCalendar();
calendar.renderCalendar(new Date().getFullYear(), new Date().getMonth());

// 切換月份的功能
function prevMonth() {
  calendar.currentDate.setMonth(calendar.currentDate.getMonth() - 1);
  calendar.renderCalendar(
    calendar.currentDate.getFullYear(),
    calendar.currentDate.getMonth()
  );
}

function nextMonth() {
  calendar.currentDate.setMonth(calendar.currentDate.getMonth() + 1);
  calendar.renderCalendar(
    calendar.currentDate.getFullYear(),
    calendar.currentDate.getMonth()
  );
}
