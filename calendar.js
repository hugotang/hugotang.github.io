class LunarCalendar {
  constructor() {
    this.currentDate = new Date();
    this.initI18n();
    this.cache = new Map(); // 添加緩存
    //this.initScreenshot();
    this.initYearSelect();
    this.initMonthSelect();
    this.initTodayButton();
    this.holidays = this.initHolidays();

    // 添加視窗大小改變的監聽器
    window.addEventListener("resize", () => {
      this.renderCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth()
      );
    });

    // 添加手勢支持
    if (window.innerWidth <= 768) {
      this.initTouchGestures();
    }

    // 添加滾動監聽
    this.initScrollBehavior();
  }

  // 將 i18n 初始化移到單獨的方法
  initI18n() {
    I18n.setMessages("cht", {
      "tg.jia": "甲",
      "tg.yi": "乙",
      "tg.bing": "丙",
      "tg.ding": "丁",
      "tg.wu": "戊",
      "tg.ji": "己",
      "tg.geng": "庚",
      "tg.xin": "辛",
      "tg.ren": "壬",
      "tg.gui": "癸",
      "dz.zi": "子",
      "dz.chou": "醜",
      "dz.yin": "寅",
      "dz.mao": "卯",
      "dz.chen": "辰",
      "dz.si": "巳",
      "dz.wu": "午",
      "dz.wei": "未",
      "dz.shen": "申",
      "dz.you": "酉",
      "dz.xu": "戌",
      "dz.hai": "亥",
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
      "jz.jiaZi": "甲子",
      "jz.yiChou": "乙醜",
      "jz.bingYin": "丙寅",
      "jz.dingMao": "丁卯",
      "jz.wuChen": "戊辰",
      "jz.jiSi": "己巳",
      "jz.gengWu": "庚午",
      "jz.xinWei": "辛未",
      "jz.renShen": "壬申",
      "jz.guiYou": "癸酉",
      "jz.jiaXu": "甲戌",
      "jz.yiHai": "乙亥",
      "jz.bingZi": "丙子",
      "jz.dingChou": "丁醜",
      "jz.wuYin": "戊寅",
      "jz.jiMao": "己卯",
      "jz.gengChen": "庚辰",
      "jz.xinSi": "辛巳",
      "jz.renWu": "壬午",
      "jz.guiWei": "癸未",
      "jz.jiaShen": "甲申",
      "jz.yiYou": "乙酉",
      "jz.bingXu": "丙戌",
      "jz.dingHai": "丁亥",
      "jz.wuZi": "戊子",
      "jz.jiChou": "己醜",
      "jz.gengYin": "庚寅",
      "jz.xinMao": "辛卯",
      "jz.renChen": "壬辰",
      "jz.guiSi": "癸巳",
      "jz.jiaWu": "甲午",
      "jz.yiWei": "乙未",
      "jz.bingShen": "丙申",
      "jz.dingYou": "丁酉",
      "jz.wuXu": "戊戌",
      "jz.jiHai": "己亥",
      "jz.gengZi": "庚子",
      "jz.xinChou": "辛醜",
      "jz.renYin": "壬寅",
      "jz.guiMao": "癸卯",
      "jz.jiaChen": "甲辰",
      "jz.yiSi": "乙巳",
      "jz.bingWu": "丙午",
      "jz.dingWei": "丁未",
      "jz.wuShen": "戊申",
      "jz.jiYou": "己酉",
      "jz.gengXu": "庚戌",
      "jz.xinHai": "辛亥",
      "jz.renZi": "壬子",
      "jz.guiChou": "癸醜",
      "jz.jiaYin": "甲寅",
      "jz.yiMao": "乙卯",
      "jz.bingChen": "丙辰",
      "jz.dingSi": "丁巳",
      "jz.wuWu": "戊午",
      "jz.jiWei": "己未",
      "jz.gengShen": "庚申",
      "jz.xinYou": "辛酉",
      "jz.renXu": "壬戌",
      "jz.guiHai": "癸亥",
      "sx.rat": "鼠",
      "sx.ox": "牛",
      "sx.tiger": "虎",
      "sx.rabbit": "兔",
      "sx.dragon": "龍",
      "sx.snake": "蛇",
      "sx.horse": "馬",
      "sx.goat": "羊",
      "sx.monkey": "猴",
      "sx.rooster": "雞",
      "sx.dog": "狗",
      "sx.pig": "豬",
      "dw.long": "龍",
      "dw.niu": "牛",
      "dw.gou": "狗",
      "dw.yang": "羊",
      "dw.tu": "兔",
      "dw.shu": "鼠",
      "dw.ji": "雞",
      "dw.ma": "馬",
      "dw.hu": "虎",
      "dw.zhu": "豬",
      "dw.hou": "猴",
      "dw.she": "蛇",
      "dw.huLi": "狐",
      "dw.yan": "燕",
      "dw.bao": "豹",
      "dw.yuan": "猿",
      "dw.yin": "蚓",
      "dw.lu": "鹿",
      "dw.wu": "烏",
      "dw.jiao": "蛟",
      "dw.lang": "狼",
      "dw.fu": "蝠",
      "dw.zhang": "獐",
      "dw.xu": "獝",
      "dw.xie": "獬",
      "dw.han": "犴",
      "dw.he": "貉",
      "dw.zhi": "彘",
      "wx.jin": "金",
      "wx.mu": "木",
      "wx.shui": "水",
      "wx.huo": "火",
      "wx.tu": "土",
      "wx.ri": "日",
      "wx.yue": "月",
      "n.zero": "〇",
      "n.one": "一",
      "n.two": "二",
      "n.three": "三",
      "n.four": "四",
      "n.five": "五",
      "n.six": "六",
      "n.seven": "七",
      "n.eight": "八",
      "n.nine": "九",
      "n.ten": "十",
      "n.eleven": "十一",
      "n.twelve": "十二",
      "d.one": "初一",
      "d.two": "初二",
      "d.three": "初三",
      "d.four": "初四",
      "d.five": "初五",
      "d.six": "初六",
      "d.seven": "初七",
      "d.eight": "初八",
      "d.nine": "初九",
      "d.ten": "初十",
      "d.eleven": "十一",
      "d.twelve": "十二",
      "d.thirteen": "十三",
      "d.fourteen": "十四",
      "d.fifteen": "十五",
      "d.sixteen": "十六",
      "d.seventeen": "十七",
      "d.eighteen": "十八",
      "d.nighteen": "十九",
      "d.twenty": "二十",
      "d.twentyOne": "廿一",
      "d.twentyTwo": "廿二",
      "d.twentyThree": "廿三",
      "d.twentyFour": "廿四",
      "d.twentyFive": "廿五",
      "d.twentySix": "廿六",
      "d.twentySeven": "廿七",
      "d.twentyEight": "廿八",
      "d.twentyNine": "廿九",
      "d.thirty": "三十",
      "m.one": "正",
      "m.two": "二",
      "m.three": "三",
      "m.four": "四",
      "m.five": "五",
      "m.six": "六",
      "m.seven": "七",
      "m.eight": "八",
      "m.nine": "九",
      "m.ten": "十",
      "m.eleven": "冬",
      "m.twelve": "臘",
      "w.sun": "日",
      "w.mon": "一",
      "w.tues": "二",
      "w.wed": "三",
      "w.thur": "四",
      "w.fri": "五",
      "w.sat": "六",
      "xz.aries": "白羊",
      "xz.taurus": "金牛",
      "xz.gemini": "雙子",
      "xz.cancer": "巨蟹",
      "xz.leo": "獅子",
      "xz.virgo": "處女",
      "xz.libra": "天秤",
      "xz.scorpio": "天蠍",
      "xz.sagittarius": "射手",
      "xz.capricornus": "摩羯",
      "xz.aquarius": "水瓶",
      "xz.pisces": "雙魚",
      "bg.qian": "乾",
      "bg.kun": "坤",
      "bg.zhen": "震",
      "bg.xun": "巽",
      "bg.kan": "坎",
      "bg.li": "離",
      "bg.gen": "艮",
      "bg.dui": "兌",
      "ps.center": "中",
      "ps.dong": "東",
      "ps.nan": "南",
      "ps.xi": "西",
      "ps.bei": "北",
      "ps.zhong": "中宮",
      "ps.zhengDong": "正東",
      "ps.zhengNan": "正南",
      "ps.zhengXi": "正西",
      "ps.zhengBei": "正北",
      "ps.dongBei": "東北",
      "ps.dongNan": "東南",
      "ps.xiBei": "西北",
      "ps.xiNan": "西南",
      "ps.wai": "外",
      "ps.fangNei": "房內",
      "jq.dongZhi": "冬至",
      "jq.xiaoHan": "小寒",
      "jq.daHan": "大寒",
      "jq.liChun": "立春",
      "jq.yuShui": "雨水",
      "jq.jingZhe": "驚蟄",
      "jq.chunFen": "春分",
      "jq.qingMing": "清明",
      "jq.guYu": "谷雨",
      "jq.liXia": "立夏",
      "jq.xiaoMan": "小滿",
      "jq.mangZhong": "芒種",
      "jq.xiaZhi": "夏至",
      "jq.xiaoShu": "小暑",
      "jq.daShu": "大暑",
      "jq.liQiu": "立秋",
      "jq.chuShu": "處暑",
      "jq.baiLu": "白露",
      "jq.qiuFen": "秋分",
      "jq.hanLu": "寒露",
      "jq.shuangJiang": "霜降",
      "jq.liDong": "立冬",
      "jq.xiaoXue": "小雪",
      "jq.daXue": "大雪",
      "sn.qingLong": "青龍",
      "sn.baiHu": "白虎",
      "sn.zhuQue": "朱雀",
      "sn.xuanWu": "玄武",
      "sn.mingTang": "明堂",
      "sn.tianXing": "天刑",
      "sn.tianDe": "天德",
      "sn.jinKui": "金匱",
      "sn.yuTang": "玉堂",
      "sn.siMing": "司命",
      "sn.tianLao": "天牢",
      "sn.gouChen": "勾陳",
      "sn.tianEn": "天恩",
      "sn.muCang": "母倉",
      "sn.shiYang": "時陽",
      "sn.shengQi": "生氣",
      "sn.yiHou": "益後",
      "sn.zaiSha": "災煞",
      "sn.tianHuo": "天火",
      "sn.siJi": "四忌",
      "sn.baLong": "八龍",
      "sn.fuRi": "覆日",
      "sn.xuShi": "續世",
      "sn.yueSha": "月煞",
      "sn.yueXu": "月虛",
      "sn.xueZhi": "血支",
      "sn.tianZei": "天賊",
      "sn.wuXu": "五虛",
      "sn.tuFu": "土符",
      "sn.guiJi": "歸忌",
      "sn.xueJi": "血忌",
      "sn.yueDe": "月德",
      "sn.yueEn": "月恩",
      "sn.siXiang": "四相",
      "sn.wangRi": "王日",
      "sn.tianCang": "天倉",
      "sn.buJiang": "不將",
      "sn.wuHe": "五合",
      "sn.mingFeiDui": "鳴吠對",
      "sn.yueJian": "月建",
      "sn.xiaoShi": "小時",
      "sn.tuHu": "土府",
      "sn.wangWang": "往亡",
      "sn.yaoAn": "要安",
      "sn.siShen": "死神",
      "sn.tianMa": "天馬",
      "sn.jiuHu": "九虎",
      "sn.qiNiao": "七鳥",
      "sn.liuShe": "六蛇",
      "sn.guanRi": "官日",
      "sn.jiQi": "吉期",
      "sn.yuYu": "玉宇",
      "sn.daShi": "大時",
      "sn.daBai": "大敗",
      "sn.xianChi": "鹹池",
      "sn.shouRi": "守日",
      "sn.tianWu": "天巫",
      "sn.fuDe": "福德",
      "sn.liuYi": "六儀",
      "sn.jinTang": "金堂",
      "sn.yanDui": "厭對",
      "sn.zhaoYao": "招搖",
      "sn.jiuKong": "九空",
      "sn.jiuKan": "九坎",
      "sn.jiuJiao": "九焦",
      "sn.xiangRi": "相日",
      "sn.baoGuang": "寶光",
      "sn.tianGang": "天罡",
      "sn.yueXing": "月刑",
      "sn.yueHai": "月害",
      "sn.youHuo": "遊禍",
      "sn.chongRi": "重日",
      "sn.shiDe": "時德",
      "sn.minRi": "民日",
      "sn.sanHe": "三合",
      "sn.linRi": "臨日",
      "sn.shiYin": "時陰",
      "sn.mingFei": "鳴吠",
      "sn.siQi": "死氣",
      "sn.diNang": "地囊",
      "sn.yueDeHe": "月德合",
      "sn.jingAn": "敬安",
      "sn.puHu": "普護",
      "sn.jieShen": "解神",
      "sn.xiaoHao": "小耗",
      "sn.tianDeHe": "天德合",
      "sn.yueKong": "月空",
      "sn.yiMa": "驛馬",
      "sn.tianHou": "天後",
      "sn.chuShen": "除神",
      "sn.yuePo": "月破",
      "sn.daHao": "大耗",
      "sn.wuLi": "五離",
      "sn.yinDe": "陰德",
      "sn.fuSheng": "福生",
      "sn.tianLi": "天吏",
      "sn.zhiSi": "致死",
      "sn.yuanWu": "元武",
      "sn.yangDe": "陽德",
      "sn.tianXi": "天喜",
      "sn.tianYi": "天醫",
      "sn.yueYan": "月厭",
      "sn.diHuo": "地火",
      "sn.fourHit": "四擊",
      "sn.daSha": "大煞",
      "sn.daHui": "大會",
      "sn.tianYuan": "天願",
      "sn.liuHe": "六合",
      "sn.wuFu": "五富",
      "sn.shengXin": "聖心",
      "sn.heKui": "河魁",
      "sn.jieSha": "劫煞",
      "sn.siQiong": "四窮",
      "sn.chuShuiLong": "觸水龍",
      "sn.baFeng": "八風",
      "sn.tianShe": "天赦",
      "sn.wuMu": "五墓",
      "sn.baZhuan": "八專",
      "sn.yinCuo": "陰錯",
      "sn.siHao": "四耗",
      "sn.yangCuo": "陽錯",
      "sn.siFei": "四廢",
      "sn.sanYin": "三陰",
      "sn.xiaoHui": "小會",
      "sn.yinDaoChongYang": "陰道沖陽",
      "sn.danYin": "單陰",
      "sn.guChen": "孤辰",
      "sn.yinWei": "陰位",
      "sn.xingHen": "行狠",
      "sn.liaoLi": "了戾",
      "sn.jueYin": "絕陰",
      "sn.chunYang": "純陽",
      "sn.suiBo": "歲薄",
      "sn.yinYangJiaoPo": "陰陽交破",
      "sn.yinYangJuCuo": "陰陽俱錯",
      "sn.yinYangJiChong": "陰陽擊沖",
      "sn.zhuZhen": "逐陣",
      "sn.yangCuoYinChong": "陽錯陰沖",
      "sn.qiFu": "七符",
      "sn.tianGou": "天狗",
      "sn.chengRi": "成日",
      "sn.tianFu": "天符",
      "sn.guYang": "孤陽",
      "sn.jueYang": "絕陽",
      "sn.chunYin": "純陰",
      "sn.yinShen": "陰神",
      "sn.jieChu": "解除",
      "sn.yangPoYinChong": "陽破陰沖",
      "ss.biJian": "比肩",
      "ss.jieCai": "劫財",
      "ss.shiShen": "食神",
      "ss.shangGuan": "傷官",
      "ss.pianCai": "偏財",
      "ss.zhengCai": "正財",
      "ss.qiSha": "七殺",
      "ss.zhengGuan": "正官",
      "ss.pianYin": "偏印",
      "ss.zhengYin": "正印",
      "s.none": "無",
      "s.huangDao": "黃道",
      "s.heiDao": "黑道",
      "s.goodLuck": "吉",
      "s.badLuck": "兇",
      "s.yin": "陰",
      "s.yang": "陽",
      "s.white": "白",
      "s.black": "黑",
      "s.blue": "碧",
      "s.green": "綠",
      "s.yellow": "黃",
      "s.red": "赤",
      "s.purple": "紫",
      "jr.chuXi": "除夕",
      "jr.chunJie": "春節",
      "jr.yuanXiao": "元宵節",
      "jr.longTou": "龍頭節",
      "jr.duanWu": "端午節",
      "jr.qiXi": "七夕節",
      "jr.zhongQiu": "中秋節",
      "jr.chongYang": "重陽節",
      "jr.laBa": "臘八節",
      "jr.yuanDan": "元旦節",
      "jr.qingRen": "情人節",
      "jr.fuNv": "婦女節",
      "jr.zhiShu": "植樹節",
      "jr.xiaoFei": "消費者權益日",
      "jr.wuYi": "勞動節",
      "jr.qingNian": "青年節",
      "jr.erTong": "兒童節",
      "jr.yuRen": "愚人節",
      "jr.jianDang": "建黨節",
      "jr.jianJun": "建軍節",
      "jr.jiaoShi": "教師節",
      "jr.guoQing": "國慶節",
      "jr.wanShengYe": "萬聖節前夜",
      "jr.wanSheng": "萬聖節",
      "jr.pingAn": "平安夜",
      "jr.shengDan": "聖誕節",
      "ds.changSheng": "長生",
      "ds.muYu": "沐浴",
      "ds.guanDai": "冠帶",
      "ds.linGuan": "臨官",
      "ds.diWang": "帝旺",
      "ds.shuai": "衰",
      "ds.bing": "病",
      "ds.si": "死",
      "ds.mu": "墓",
      "ds.jue": "絕",
      "ds.tai": "胎",
      "ds.yang": "養",
      "h.first": "初候",
      "h.second": "二候",
      "h.third": "三候",
      "h.qiuYinJie": "蚯蚓結",
      "h.miJiao": "麋角解",
      "h.shuiQuan": "水泉動",
      "h.yanBei": "雁北鄉",
      "h.queShi": "鵲始巢",
      "h.zhiShi": "雉始雊",
      "h.jiShi": "雞始乳",
      "h.zhengNiao": "征鳥厲疾",
      "h.shuiZe": "水澤腹堅",
      "h.dongFeng": "東風解凍",
      "h.zheChongShiZhen": "蟄蟲始振",
      "h.yuZhi": "魚陟負冰",
      "h.taJi": "獺祭魚",
      "h.houYan": "候雁北",
      "h.caoMuMengDong": "草木萌動",
      "h.taoShi": "桃始華",
      "h.cangGeng": "倉庚鳴",
      "h.yingHua": "鷹化為鳩",
      "h.xuanNiaoZhi": "玄鳥至",
      "h.leiNai": "雷乃發聲",
      "h.shiDian": "始電",
      "h.tongShi": "桐始華",
      "h.tianShu": "田鼠化為鴽",
      "h.hongShi": "虹始見",
      "h.pingShi": "萍始生",
      "h.mingJiu": "鳴鳩拂奇羽",
      "h.daiSheng": "戴勝降於桑",
      "h.louGuo": "螻蟈鳴",
      "h.qiuYinChu": "蚯蚓出",
      "h.wangGua": "王瓜生",
      "h.kuCai": "苦菜秀",
      "h.miCao": "靡草死",
      "h.maiQiu": "麥秋至",
      "h.tangLang": "螳螂生",
      "h.juShi": "鵙始鳴",
      "h.fanShe": "反舌無聲",
      "h.luJia": "鹿角解",
      "h.tiaoShi": "蜩始鳴",
      "h.banXia": "半夏生",
      "h.wenFeng": "溫風至",
      "h.xiShuai": "蟋蟀居壁",
      "h.yingShi": "鷹始摯",
      "h.fuCao": "腐草為螢",
      "h.tuRun": "土潤溽暑",
      "h.daYu": "大雨行時",
      "h.liangFeng": "涼風至",
      "h.baiLu": "白露降",
      "h.hanChan": "寒蟬鳴",
      "h.yingNai": "鷹乃祭鳥",
      "h.tianDi": "天地始肅",
      "h.heNai": "禾乃登",
      "h.hongYanLai": "鴻雁來",
      "h.xuanNiaoGui": "玄鳥歸",
      "h.qunNiao": "群鳥養羞",
      "h.leiShi": "雷始收聲",
      "h.zheChongPiHu": "蟄蟲坯戶",
      "h.shuiShiHe": "水始涸",
      "h.hongYanLaiBin": "鴻雁來賓",
      "h.queRu": "雀入大水為蛤",
      "h.juYou": "菊有黃花",
      "h.caiNai": "豺乃祭獸",
      "h.caoMuHuangLuo": "草木黃落",
      "h.zheChongXianFu": "蟄蟲鹹俯",
      "h.shuiShiBing": "水始冰",
      "h.diShi": "地始凍",
      "h.zhiRu": "雉入大水為蜃",
      "h.hongCang": "虹藏不見",
      "h.tianQi": "天氣上升地氣下降",
      "h.biSe": "閉塞而成冬",
      "h.heDan": "鹖鴠不鳴",
      "h.huShi": "虎始交",
      "h.liTing": "荔挺出",
      "ts.zhan": "占",
      "ts.hu": "戶",
      "ts.win": "窗",
      "ts.fang": "房",
      "ts.chuang": "床",
      "ts.lu": "爐",
      "ts.zao": "竈",
      "ts.dui": "碓",
      "ts.mo": "磨",
      "ts.xi": "棲",
      "ts.chu": "廚",
      "ts.ce": "廁",
      "ts.cang": "倉",
      "ts.cangKu": "倉庫",
      "ts.daMen": "大門",
      "ts.men": "門",
      "ts.tang": "堂",
      "ly.xianSheng": "先勝",
      "ly.xianFu": "先負",
      "ly.youYin": "友引",
      "ly.foMie": "佛滅",
      "ly.daAn": "大安",
      "ly.chiKou": "赤口",
      "yj.jiSi": "祭祀",
      "yj.qiFu": "祈福",
      "yj.qiuSi": "求嗣",
      "yj.kaiGuang": "開光",
      "yj.suHui": "塑繪",
      "yj.qiJiao": "齊醮",
      "yj.zhaiJiao": "齋醮",
      "yj.muYu": "沐浴",
      "yj.chouShen": "酬神",
      "yj.zaoMiao": "造廟",
      "yj.siZhao": "祀竈",
      "yj.fenXiang": "焚香",
      "yj.xieTu": "謝土",
      "yj.chuHuo": "出火",
      "yj.diaoKe": "雕刻",
      "yj.jiaQu": "嫁娶",
      "yj.DingHun": "訂婚",
      "yj.naCai": "納采",
      "yj.wenMing": "問名",
      "yj.naXu": "納婿",
      "yj.guiNing": "歸寧",
      "yj.anChuang": "安床",
      "yj.heZhang": "合帳",
      "yj.guanJi": "冠笄",
      "yj.dingMeng": "訂盟",
      "yj.jinRenKou": "進人口",
      "yj.caiYi": "裁衣",
      "yj.wanMian": "挽面",
      "yj.kaiRong": "開容",
      "yj.xiuFen": "修墳",
      "yj.qiZuan": "啟鉆",
      "yj.poTu": "破土",
      "yj.anZang": "安葬",
      "yj.liBei": "立碑",
      "yj.chengFu": "成服",
      "yj.chuFu": "除服",
      "yj.kaiShengFen": "開生墳",
      "yj.heShouMu": "合壽木",
      "yj.ruLian": "入殮",
      "yj.yiJiu": "移柩",
      "yj.puDu": "普渡",
      "yj.ruZhai": "入宅",
      "yj.anXiang": "安香",
      "yj.anMen": "安門",
      "yj.xiuZao": "修造",
      "yj.qiJi": "起基",
      "yj.dongTu": "動土",
      "yj.shangLiang": "上梁",
      "yj.shuZhu": "豎柱",
      "yj.kaiJing": "開井開池",
      "yj.zuoBei": "作陂放水",
      "yj.chaiXie": "拆卸",
      "yj.poWu": "破屋",
      "yj.huaiYuan": "壞垣",
      "yj.buYuan": "補垣",
      "yj.faMuZuoLiang": "伐木做梁",
      "yj.zuoZhao": "作竈",
      "yj.jieChu": "解除",
      "yj.kaiZhuYan": "開柱眼",
      "yj.chuanPing": "穿屏扇架",
      "yj.gaiWuHeJi": "蓋屋合脊",
      "yj.kaiCe": "開廁",
      "yj.zaoCang": "造倉",
      "yj.saiXue": "塞穴",
      "yj.pingZhi": "平治道塗",
      "yj.zaoQiao": "造橋",
      "yj.zuoCe": "作廁",
      "yj.zhuDi": "築堤",
      "yj.kaiChi": "開池",
      "yj.faMu": "伐木",
      "yj.kaiQu": "開渠",
      "yj.jueJing": "掘井",
      "yj.saoShe": "掃舍",
      "yj.fangShui": "放水",
      "yj.zaoWu": "造屋",
      "yj.heJi": "合脊",
      "yj.zaoChuChou": "造畜稠",
      "yj.xiuMen": "修門",
      "yj.dingSang": "定磉",
      "yj.zuoLiang": "作梁",
      "yj.xiuShi": "修飾垣墻",
      "yj.jiaMa": "架馬",
      "yj.kaiShi": "開市",
      "yj.guaBian": "掛匾",
      "yj.naChai": "納財",
      "yj.qiuCai": "求財",
      "yj.kaiCang": "開倉",
      "yj.maiChe": "買車",
      "yj.zhiChan": "置產",
      "yj.guYong": "雇庸",
      "yj.chuHuoCai": "出貨財",
      "yj.anJiXie": "安機械",
      "yj.zaoCheQi": "造車器",
      "yj.jingLuo": "經絡",
      "yj.yunNiang": "醞釀",
      "yj.zuoRan": "作染",
      "yj.guZhu": "鼓鑄",
      "yj.zaoChuan": "造船",
      "yj.geMi": "割蜜",
      "yj.zaiZhong": "栽種",
      "yj.quYu": "取漁",
      "yj.jieWang": "結網",
      "yj.muYang": "牧養",
      "yj.anDuiWei": "安碓磑",
      "yj.xiYi": "習藝",
      "yj.ruXue": "入學",
      "yj.liFa": "理發",
      "yj.tanBing": "探病",
      "yj.jianGui": "見貴",
      "yj.chengChuan": "乘船",
      "yj.duShui": "渡水",
      "yj.zhenJiu": "針灸",
      "yj.chuXing": "出行",
      "yj.yiXi": "移徙",
      "yj.fenJu": "分居",
      "yj.TiTou": "剃頭",
      "yj.zhengShou": "整手足甲",
      "yj.naChu": "納畜",
      "yj.buZhuo": "捕捉",
      "yj.tianLie": "畋獵",
      "yj.jiaoNiuMa": "教牛馬",
      "yj.huiQinYou": "會親友",
      "yj.fuRen": "赴任",
      "yj.qiuYi": "求醫",
      "yj.zhiBing": "治病",
      "yj.ciSong": "詞訟",
      "yj.qiJiDongTu": "起基動土",
      "yj.poWuHuaiYuan": "破屋壞垣",
      "yj.gaiWu": "蓋屋",
      "yj.zaoCangKu": "造倉庫",
      "yj.liQuanJiaoYi": "立券交易",
      "yj.jiaoYi": "交易",
      "yj.liQuan": "立券",
      "yj.anJi": "安機",
      "yj.huiYou": "會友",
      "yj.qiuYiLiaoBing": "求醫療病",
      "yj.zhuShi": "諸事不宜",
      "yj.yuShi": "餘事勿取",
      "yj.xingSang": "行喪",
      "yj.duanYi": "斷蟻",
      "yj.guiXiu": "歸岫",
      "xx.bi": "畢",
      "xx.yi": "翼",
      "xx.ji": "箕",
      "xx.kui": "奎",
      "xx.gui": "鬼",
      "xx.di": "氐",
      "xx.xu": "虛",
      "xx.wei": "危",
      "xx.zi": "觜",
      "xx.zhen": "軫",
      "xx.dou": "鬥",
      "xx.lou": "婁",
      "xx.liu": "柳",
      "xx.fang": "房",
      "xx.xin": "心",
      "xx.shi": "室",
      "xx.can": "參",
      "xx.jiao": "角",
      "xx.niu": "牛",
      "xx.vei": "胃",
      "xx.xing": "星",
      "xx.zhang": "張",
      "xx.tail": "尾",
      "xx.qiang": "壁",
      "xx.jing": "井",
      "xx.kang": "亢",
      "xx.nv": "女",
      "xx.mao": "昴",
      "sz.chun": "春",
      "sz.xia": "夏",
      "sz.qiu": "秋",
      "sz.dong": "冬",
      "od.first": "孟",
      "od.second": "仲",
      "od.third": "季",
      "yx.shuo": "朔",
      "yx.jiShuo": "既朔",
      "yx.eMeiXin": "蛾眉新",
      "yx.eMei": "蛾眉",
      "yx.xi": "夕",
      "yx.shangXian": "上弦",
      "yx.jiuYe": "九夜",
      "yx.night": "宵",
      "yx.jianYingTu": "漸盈凸",
      "yx.xiaoWang": "小望",
      "yx.wang": "望",
      "yx.jiWang": "既望",
      "yx.liDai": "立待",
      "yx.juDai": "居待",
      "yx.qinDai": "寢待",
      "yx.gengDai": "更待",
      "yx.jianKuiTu": "漸虧凸",
      "yx.xiaXian": "下弦",
      "yx.youMing": "有明",
      "yx.eMeiCan": "蛾眉殘",
      "yx.can": "殘",
      "yx.xiao": "曉",
      "yx.hui": "晦",
      "ny.sangZhe": "桑柘",
      "ny.baiLa": "白蠟",
      "ny.yangLiu": "楊柳",
      "ny.jinBo": "金箔",
      "ny.haiZhong": "海中",
      "ny.daHai": "大海",
      "ny.shaZhong": "沙中",
      "ny.luZhong": "爐中",
      "ny.shanXia": "山下",
      "ny.daLin": "大林",
      "ny.pingDi": "平地",
      "ny.luPang": "路旁",
      "ny.biShang": "壁上",
      "ny.jianFeng": "劍鋒",
      "ny.shanTou": "山頭",
      "ny.fuDeng": "覆燈",
      "ny.jianXia": "澗下",
      "ny.tianHe": "天河",
      "ny.chengTou": "城頭",
      "ny.daYi": "大驛",
      "ny.chaiChuan": "釵釧",
      "ny.quanZhong": "泉中",
      "ny.daXi": "大溪",
      "ny.wuShang": "屋上",
      "ny.piLi": "霹靂",
      "ny.tianShang": "天上",
      "ny.songBo": "松柏",
      "ny.shiLiu": "石榴",
      "ny.changLiu": "長流",
    });
    I18n.setLanguage("cht");
  }

  // 添加緩存機制
  getCachedLunar(year, month, day) {
    const key = `${year}-${month}-${day}`;
    if (!this.cache.has(key)) {
      this.cache.set(key, Solar.fromYmd(year, month + 1, day).getLunar());
    }
    return this.cache.get(key);
  }

  renderCalendar(year, month) {
    // 獲取農曆年份信息
    const lunarDate = Lunar.fromDate(new Date(year, month, 1));
    const ganZhi = lunarDate.getYearInGanZhi();
    const zodiac = lunarDate.getYearShengXiao();

    // 更新標題
    document.querySelector('.lunar-year').textContent = `${ganZhi}年 [${zodiac}]`;

    // 更新選擇器
    const yearSelect = document.querySelector('.year-select');
    const monthSelect = document.querySelector('.month-select');
    
    // 更新年份選擇器的顯示文字
    yearSelect.value = year;
    monthSelect.value = month;

    const fragment = document.createDocumentFragment();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startEmptyCells = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // 檢查是否為手機版（寬度小於768px）
    const isMobile = window.innerWidth <= 768;

    // 在非手機版才填充上個月的日期
    if (!isMobile) {
      const prevLastDay = new Date(year, month, 0);
      const prevMonthDays = prevLastDay.getDate();
      for (let i = 0; i < startEmptyCells; i++) {
        const day = prevMonthDays - startEmptyCells + i + 1;
        const prevMonth = month - 1;
        const prevYear = year;
        const lunar = this.getCachedLunar(
          prevMonth < 0 ? prevYear - 1 : prevYear,
          prevMonth < 0 ? 11 : prevMonth,
          day
        );
        fragment.appendChild(this.createDateCell(day, lunar, "prev-month"));
      }
    }

    // 填充當前月份
    for (let day = 1; day <= totalDays; day++) {
      const lunar = this.getCachedLunar(year, month, day);
      fragment.appendChild(this.createDateCell(day, lunar, "current-month"));
    }

    // 在非手機版才填充下個月的日期
    if (!isMobile) {
      const totalCells = startEmptyCells + totalDays;
      const remainingCells = 7 - (totalCells % 7);
      if (remainingCells < 7) {
        const nextMonth = month + 1;
        const nextYear = year;
        for (let i = 1; i <= remainingCells; i++) {
          const lunar = this.getCachedLunar(
            nextMonth > 11 ? nextYear + 1 : nextYear,
            nextMonth > 11 ? 0 : nextMonth,
            i
          );
          fragment.appendChild(this.createDateCell(i, lunar, "next-month"));
        }
      }
    }

    const calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = "";
    calendarBody.appendChild(fragment);
  }

  createDateCell(day, lunar, monthType = "current-month") {
    const cell = document.createElement("div");
    const solarTerm = lunar.getJieQi();
    const cellClasses = ["calendar-cell", monthType];

    // 檢查是否為今天
    const today = new Date();
    const isToday =
      monthType === "current-month" &&
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear();

    // 根據月份類型計算正確的年月
    let targetYear, targetMonth;
    if (monthType === "prev-month") {
      targetMonth = this.currentDate.getMonth() - 1;
      targetYear =
        targetMonth < 0
          ? this.currentDate.getFullYear() - 1
          : this.currentDate.getFullYear();
      targetMonth = targetMonth < 0 ? 11 : targetMonth;
    } else if (monthType === "next-month") {
      targetMonth = this.currentDate.getMonth() + 1;
      targetYear =
        targetMonth > 11
          ? this.currentDate.getFullYear() + 1
          : this.currentDate.getFullYear();
      targetMonth = targetMonth > 11 ? 0 : targetMonth;
    } else {
      targetYear = this.currentDate.getFullYear();
      targetMonth = this.currentDate.getMonth();
    }

    // 獲取正確的星期幾
    const weekDay = new Date(targetYear, targetMonth, day).getDay();
    cell.setAttribute("data-weekday", weekDay);

    if (solarTerm) {
      cellClasses.push("has-term");
    }
    if (isToday) {
      cellClasses.push("today");
    }

    // 檢查是否為假期
    const holidayName = this.isHoliday(targetYear, targetMonth, day);
    console.log("Holiday check:", {
      targetYear,
      targetMonth,
      day,
      holidayName,
    });

    if (holidayName) {
      cellClasses.push("holiday");
    }

    cell.className = cellClasses.join(" ");

    const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
    const weekDayText = weekDays[weekDay];

    // 只在農曆初一時顯示月份
    const lunarDayText = lunar.getDayInChinese();
    const lunarDateText =
      lunarDayText === "初一"
        ? `${lunar.getMonthInChinese()}月${lunarDayText}`
        : lunarDayText;

    const html = `
        <div class="date-section">
            <div class="solar-date">${day}</div>
            <div class="weekday-label">星期${weekDayText}</div>
            ${
              holidayName
                ? `<div class="holiday-label">${holidayName}</div>`
                : ""
            }
        </div>
        <div class="content-section">
            <div class="lunar-date">
                ${lunarDateText}
                ${
                  solarTerm
                    ? `<span class="solar-term">${solarTerm}</span>`
                    : ""
                }
            </div>
            <div class="jianzhu">【${lunar.getZhiXing()}日】</div>
            <div class="almanac">
                <div class="suitable">宜：${lunar.getDayYi().join("、")}</div>
                <div class="unsuitable">忌：${lunar.getDayJi().join("、")}</div>
            </div>
        </div>
    `;

    cell.innerHTML = html;
    return cell;
  }

  createEmptyCell() {
    if (!this._emptyCell) {
      this._emptyCell = document.createElement("div");
      this._emptyCell.className = "calendar-cell";
    }
    return this._emptyCell.cloneNode(true);
  }

  // 清理緩存
  clearCache() {
    this.cache.clear();
  }

  initScreenshot() {
    document
      .querySelector(".screenshot")
      .addEventListener("click", async () => {
        // 創建加載提示
        const overlay = document.createElement("div");
        overlay.className = "screenshot-overlay";
        overlay.textContent = "正在生成截圖...";
        document.body.appendChild(overlay);

        try {
          // 截圖前的準備
          const calendar = document.querySelector(".calendar");
          const originalPosition = calendar.style.position;
          calendar.style.position = "relative";

          // 生成截圖
          const canvas = await html2canvas(calendar, {
            scale: 2, // 提高圖片質量
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
          });

          // 恢復原始樣式
          calendar.style.position = originalPosition;

          // 創建下載鏈接
          const link = document.createElement("a");
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          link.download = `calendar-${timestamp}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        } catch (error) {
          console.error("Screenshot failed:", error);
          alert("截圖失敗，請稍後重試");
        } finally {
          // 移除加載提示
          document.body.removeChild(overlay);
        }
      });
  }

  // 優化截圖質量的輔助方法
  async prepareForScreenshot() {
    // 等待所有字體加載完成
    await document.fonts.ready;

    // 確保所有圖片都已加載
    const images = Array.from(document.images);
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );
  }

  initYearSelect() {
    const yearSelect = document.querySelector('.year-select');
    const currentYear = new Date().getFullYear();
    
    // 生成年份選項（前後 10 年）
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year + '年';
      yearSelect.appendChild(option);
    }
    
    yearSelect.value = this.currentDate.getFullYear();
    
    yearSelect.addEventListener('change', (e) => {
      this.currentDate.setFullYear(parseInt(e.target.value));
      this.renderCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth()
      );
    });
  }

  initMonthSelect() {
    const monthSelect = document.querySelector('.month-select');
    for (let i = 0; i < 12; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = (i + 1) + '月';
      monthSelect.appendChild(option);
    }
    
    monthSelect.value = this.currentDate.getMonth();
    
    monthSelect.addEventListener('change', (e) => {
      this.currentDate.setMonth(parseInt(e.target.value));
      this.renderCalendar(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth()
      );
    });
  }

  initTodayButton() {
    document.querySelector(".today-btn").addEventListener("click", () => {
      const today = new Date();
      this.currentDate = today;
      this.renderCalendar(today.getFullYear(), today.getMonth());

      if (window.innerWidth <= 768) {
        const todayCell = document.querySelector(".today");
        if (todayCell) {
          todayCell.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    });
  }

  // 初始化香港公眾假期
  initHolidays() {
    return {
      // 固定日期的假期
      "0101": "元旦",
      "0501": "勞動節",
      "0701": "香港特別行政區成立紀念日",
      1001: "國慶日",
      1225: "聖誕節",
      1226: "聖誕節翌日",

      // 2024年的假期
      20240101: "元旦",
      20240210: "農曆年初一",
      20240212: "農曆年初三",
      20240213: "農曆年初四",
      20240329: "耶穌受難節",
      20240330: "耶穌受難節翌日",
      20240401: "復活節星期一",
      20240404: "清明節",
      20240501: "勞動節",
      20240515: "佛誕",
      20240610: "端午節",
      20240701: "香港特別行政區成立紀念日",
      20240918: "中秋節翌日",
      20241001: "國慶日",
      20241011: "重陽節",
      20241225: "聖誕節",
      20241226: "聖誕節翌日",

      // 2025年的假期
      20250101: "元旦",
      20250129: "農曆年初一",
      20250130: "農曆年初二",
      20250131: "農曆年初三",
      20250404: "清明節",
      20250418: "耶穌受難節",
      20250419: "耶穌受難節翌日",
      20250421: "復活節星期一",
      20250501: "勞動節",
      20250505: "佛誕",
      20250531: "端午節",
      20250701: "香港特別行政區成立紀念日",
      20251001: "國慶日",
      20251007: "中秋節翌日",
      20251029: "重陽節",
      20251225: "聖誕節",
      20251226: "聖誕節翌日",
    };
  }

  // 檢查是否為假期
  isHoliday(year, month, day) {
    // 格式化日期字符串
    const dateStr = `${year}${String(month + 1).padStart(2, "0")}${String(
      day
    ).padStart(2, "0")}`;
    const monthDayStr = `${String(month + 1).padStart(2, "0")}${String(
      day
    ).padStart(2, "0")}`;

    // 添加調試日誌
    console.log("Checking holiday for:", {
      dateStr,
      monthDayStr,
      result: this.holidays[dateStr] || this.holidays[monthDayStr],
    });

    return this.holidays[dateStr] || this.holidays[monthDayStr];
  }

  initTouchGestures() {
    const calendarBody = document.getElementById('calendar-body');
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let isSwiping = false;
    let startTime = 0;
    let isHorizontalSwipe = null;  // 用於判斷滑動方向
    
    calendarBody.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      startTime = Date.now();
      isSwiping = true;
      isHorizontalSwipe = null;  // 重置滑動方向
    }, { passive: true });
    
    calendarBody.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - touchStartX;
      const diffY = currentY - touchStartY;
      
      // 第一次判斷滑動方向
      if (isHorizontalSwipe === null) {
        // 如果水平移動大於垂直移動，且水平移動超過 10px
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
          isHorizontalSwipe = true;
          e.preventDefault();
        } else if (Math.abs(diffY) > 10) {
          // 如果垂直移動超過 10px，標記為垂直滑動
          isHorizontalSwipe = false;
        }
      } else if (isHorizontalSwipe) {
        // 如果已確定是水平滑動，阻止垂直滾動
        e.preventDefault();
      }
    }, { passive: false });
    
    calendarBody.addEventListener('touchend', (e) => {
      if (!isSwiping || !isHorizontalSwipe) return;  // 只處理水平滑動
      isSwiping = false;
      
      touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      const timeDiff = Date.now() - startTime;
      
      // 判斷是否為有效的滑動手勢
      if (Math.abs(diffX) > 50 || (Math.abs(diffX) > 30 && timeDiff < 300)) {
        if (diffX > 0) {
          // 向右滑動，上個月
          const date = this.currentDate;
          date.setMonth(date.getMonth() - 1);
          this.renderCalendar(date.getFullYear(), date.getMonth());
        } else {
          // 向左滑動，下個月
          const date = this.currentDate;
          date.setMonth(date.getMonth() + 1);
          this.renderCalendar(date.getFullYear(), date.getMonth());
        }
      }
    }, { passive: true });
    
    // 防止 iOS 的橡皮筋效果影響滑動
    document.body.addEventListener('touchmove', (e) => {
      if (isSwiping && isHorizontalSwipe) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  initPullToRefresh() {
    const calendarBody = document.getElementById('calendar-body');
    let touchStartY = 0;
    let pullStarted = false;
    
    // 創建刷新提示元素
    const refreshHint = document.createElement('div');
    refreshHint.className = 'refresh-hint';
    refreshHint.textContent = '下拉刷新';
    document.querySelector('.calendar').insertBefore(refreshHint, calendarBody);
    
    calendarBody.addEventListener('touchstart', (e) => {
      if (calendarBody.scrollTop === 0) {
        touchStartY = e.touches[0].clientY;
        pullStarted = true;
      }
    }, { passive: true });
    
    calendarBody.addEventListener('touchmove', (e) => {
      if (!pullStarted) return;
      
      const pullDistance = e.touches[0].clientY - touchStartY;
      if (pullDistance > 0) {
        refreshHint.style.transform = `translateY(${Math.min(pullDistance/2, 60)}px)`;
        if (pullDistance > 100) {
          refreshHint.textContent = '釋放刷新';
        }
      }
    }, { passive: true });
    
    calendarBody.addEventListener('touchend', async () => {
      if (!pullStarted) return;
      pullStarted = false;
      
      const pullDistance = parseInt(refreshHint.style.transform.replace('translateY(', ''));
      if (pullDistance > 50) {
        refreshHint.textContent = '正在刷新...';
        // 重新渲染日曆
        await this.refreshCalendar();
      }
      
      refreshHint.style.transform = 'translateY(0)';
      setTimeout(() => {
        refreshHint.textContent = '下拉刷新';
      }, 300);
    }, { passive: true });
  }

  initScrollBehavior() {
    const calendarBody = document.getElementById('calendar-body');
    const header = document.querySelector('.calendar-header');
    let lastScrollTop = 0;
    let scrollTimeout;

    calendarBody.addEventListener('scroll', () => {
      const scrollTop = calendarBody.scrollTop;
      
      // 清除之前的 timeout
      clearTimeout(scrollTimeout);
      
      // 當向下滾動超過 20px 時收縮 header
      if (scrollTop > 20) {
        header.classList.add('compact');
      } else {
        header.classList.remove('compact');
      }
      
      // 設置新的 timeout，在停止滾動 150ms 後展開 header
      scrollTimeout = setTimeout(() => {
        if (scrollTop < 20) {
          header.classList.remove('compact');
        }
      }, 150);
      
      lastScrollTop = scrollTop;
    }, { passive: true });
  }
}

// 初始化日曆
const calendar = new LunarCalendar();
calendar.renderCalendar(new Date().getFullYear(), new Date().getMonth());

// 使用事件委託，並通過類名選擇器來判斷按鈕
document.querySelector(".calendar").addEventListener("click", function (e) {
  const target = e.target;
  if (target.matches("button.prev-month")) {
    const date = calendar.currentDate;
    date.setMonth(date.getMonth() - 1);
    calendar.renderCalendar(date.getFullYear(), date.getMonth());
  } else if (target.matches("button.next-month")) {
    const date = calendar.currentDate;
    date.setMonth(date.getMonth() + 1);
    calendar.renderCalendar(date.getFullYear(), date.getMonth());
  }
});
