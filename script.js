// =========================
// 圖片資料：角色不同表情
// =========================
const images = {
  normal: "https://raw.githubusercontent.com/ykloqm6600/ykloqm6600/main/normal.png",
  happy: "https://raw.githubusercontent.com/ykloqm6600/ykloqm6600/main/happy.png",
  angry: "https://raw.githubusercontent.com/ykloqm6600/ykloqm6600/main/angry.png",
  cry: "https://raw.githubusercontent.com/ykloqm6600/ykloqm6600/main/cry.png",
  sleep: "https://raw.githubusercontent.com/ykloqm6600/ykloqm6600/main/sleep.png",
  shy: "https://raw.githubusercontent.com/ykloqm6600/ykloqm6600/main/shy.png"
};

// =========================
// 抓取 HTML 元素
// =========================
const pet = document.getElementById("pet");
const speech = document.getElementById("speech");
const loveText = document.getElementById("love");
const moodText = document.getElementById("mood");
const titleText = document.getElementById("titleText");

// =========================
// 讀取存檔數值
// =========================
let love = Number(localStorage.getItem("love")) || 0;
let mood = Number(localStorage.getItem("mood")) || 50;

// =========================
// 狀態控制
// =========================
// sleeping 用來判斷是否正在睡覺
// 避免睡覺表情被自動台詞蓋掉
let sleeping = false;

// lastActionTime 用來記錄玩家剛互動的時間
// 避免待機台詞太快蓋掉玩家剛按出的台詞
let lastActionTime = Date.now();

// =========================
// 數值限制
// =========================
function clampStats() {
  if (love < 0) love = 0;
  if (love > 100) love = 100;

  if (mood < 0) mood = 0;
  if (mood > 100) mood = 100;
}

// =========================
// 親密度稱號
// =========================
function updateTitle() {
  if (!titleText) return;

  if (love < 20) {
    titleText.textContent = "陌生人";
  } else if (love < 50) {
    titleText.textContent = "勉強認識";
  } else if (love < 80) {
    titleText.textContent = "常駐社畜夥伴";
  } else {
    titleText.textContent = "最喜歡的人類";
  }
}

// =========================
// 心情檢查
// =========================
// force = true 時會強制顯示低心情台詞
// 平常 updateStatus 只更新狀態，不強制打斷玩家台詞
function checkMood(force = false) {
  if (!force) return;

  if (mood <= 10) {
    pet.src = images.cry;
    speech.textContent = "不想動了……";
  } else if (mood <= 20) {
    pet.src = images.cry;
    speech.textContent = "我今天狀態很差……";
  }
}

// =========================
// 更新畫面與存檔
// =========================
function updateStatus() {
  clampStats();

  loveText.textContent = love;
  moodText.textContent = mood;

  localStorage.setItem("love", love);
  localStorage.setItem("mood", mood);

  updateTitle();
}

// =========================
// 隨機抽一句台詞
// =========================
function randomText(texts) {
  return texts[Math.floor(Math.random() * texts.length)];
}

// =========================
// 3 秒後回普通表情
// =========================
// 如果正在睡覺，就不回普通表情
function backToNormal() {
  setTimeout(() => {
    if (!sleeping) {
      pet.src = images.normal;
    }
  }, 3000);
}

// =========================
// 離線時間系統
// =========================
function checkOfflineTime() {
  const now = Date.now();
  const lastLogin = localStorage.getItem("lastLogin");

  if (lastLogin) {
    const diff = now - Number(lastLogin);
    const hours = diff / (1000 * 60 * 60);

    if (hours >= 24) {
      love -= 12;
      mood -= 20;
      pet.src = images.cry;
      speech.textContent = "……我以為你不回來了。";
    } else if (hours >= 12) {
      love -= 8;
      mood -= 12;
      pet.src = images.cry;
      speech.textContent = "你消失半天欸。你知道我等多久嗎？";
    } else if (hours >= 4) {
      love -= 4;
      mood -= 8;
      pet.src = images.angry;
      speech.textContent = "你去哪了？我才沒有一直等你。";
    } else {
      speech.textContent = "你又來了喔。";
      pet.src = images.normal;
    }

    updateStatus();
    backToNormal();
  }

  localStorage.setItem("lastLogin", now);
}

checkOfflineTime();

// 關閉頁面前，記錄最後時間
window.addEventListener("beforeunload", () => {
  localStorage.setItem("lastLogin", Date.now());
});

// =========================
// 愛心特效
// =========================
function createHeart() {
  const hearts = document.getElementById("hearts");
  if (!hearts) return;

  const heart = document.createElement("div");

  heart.classList.add("heart");
  heart.innerHTML = "💖";
  heart.style.left = Math.random() * 70 + 15 + "%";

  hearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1000);
}

// =========================
// 角色抖動效果
// =========================
function shakePet() {
  pet.classList.add("shake");

  setTimeout(() => {
    pet.classList.remove("shake");
  }, 250);
}

// =========================
// 摸摸功能
// =========================
function petPet() {
  sleeping = false;
  lastActionTime = Date.now();

  love += 5;
  mood += 3;

  createHeart();
  shakePet();

  updateStatus();

  if (love < 30) {
    pet.src = images.angry;
    speech.textContent = randomText([
      "幹嘛摸我？",
      "你今天壓力大到開始騷擾電子雞了？",
      "手拿開啦。",
      "我不是舒壓玩具。"
    ]);
  } else if (love < 70) {
    pet.src = images.happy;
    speech.textContent = randomText([
      "……好啦，可以再摸一下。",
      "只能一下喔。",
      "今天心情還行。",
      "你是不是很累？"
    ]);
  } else {
    pet.src = images.shy;
    speech.textContent = randomText([
      "你終於來摸我了。",
      "我才沒有等很久。",
      "再陪我一下。",
      "今天可以多摸幾次。"
    ]);
  }

  backToNormal();
}

// =========================
// 餵食功能
// =========================
function feedPet() {
  sleeping = false;
  lastActionTime = Date.now();

  mood += 8;

  shakePet();
  updateStatus();

  if (love < 50) {
    pet.src = images.happy;
    speech.textContent = randomText([
      "有吃的？算你還有點人性。",
      "這可以吃嗎？不會是主管畫的大餅吧？",
      "勉強接受。",
      "你終於想起我會餓了。"
    ]);
  } else {
    pet.src = images.shy;
    speech.textContent = randomText([
      "嘿嘿，你記得我餓了欸。",
      "這次算你貼心。",
      "我有一點點開心。只有一點點。",
      "你餵我，我就勉強喜歡你一下。"
    ]);
  }

  backToNormal();
}

// =========================
// 睡覺功能
// =========================
function sleepPet() {
  sleeping = true;
  lastActionTime = Date.now();

  mood += 5;

  pet.src = images.sleep;
  updateStatus();

  if (love < 50) {
    speech.textContent = randomText([
      "我要睡了，你也去休息啦，社畜。",
      "不要死在工作上，很麻煩。",
      "你再不睡，明天會像爛掉的海帶。",
      "晚安。雖然你看起來不會乖乖睡。"
    ]);
  } else {
    speech.textContent = randomText([
      "陪我睡覺。不要加班了啦。",
      "今天辛苦了，靠過來一點。",
      "你不睡我會生氣喔。",
      "晚安……明天也要來看我。"
    ]);
  }
}

// =========================
// 不同時間 + 不同親密度台詞
// =========================
function timeTalk() {
  const now = Date.now();

  // 如果角色正在睡覺，不自動講話
  if (sleeping) return;

  // 玩家剛互動後 10 秒內，不要蓋掉台詞
  if (now - lastActionTime < 10000) return;

  // 心情太低時，優先顯示低心情反應
  if (mood <= 20) {
    checkMood(true);
    backToNormal();
    return;
  }

  const hour = new Date().getHours();
  let idleTalk = [];

  if (hour >= 1 && hour < 5) {
    if (love < 50) {
      pet.src = images.angry;
      idleTalk = [
        "你怎麼還沒睡……",
        "再熬夜我們會一起往生。",
        "凌晨了欸，你是鬼嗎？",
        "你是被工作詛咒了嗎？"
      ];
    } else {
      pet.src = images.shy;
      idleTalk = [
        "還不睡？……我陪你一下。",
        "今天很累嗎？",
        "不要硬撐了啦。",
        "你睡了我才放心。"
      ];
    }
  } else if (hour >= 5 && hour < 11) {
    if (love < 50) {
      pet.src = images.normal;
      idleTalk = [
        "你居然醒著。",
        "今天也要去當社畜？",
        "早安，打工人。",
        "你看起來像沒充飽電。"
      ];
    } else {
      pet.src = images.happy;
      idleTalk = [
        "早安……你來了。",
        "今天也一起撐過去吧。",
        "你看起來還沒睡醒。",
        "醒來第一個看我？不錯嘛。"
      ];
    }
  } else if (hour >= 11 && hour < 18) {
    if (love < 50) {
      pet.src = images.normal;
      idleTalk = [
        "下午最容易靈魂出竅。",
        "你是不是又想下班了？",
        "工作效率看起來很爛。",
        "不要又拿咖啡當飯。"
      ];
    } else {
      pet.src = images.happy;
      idleTalk = [
        "再撐一下就下班了。",
        "辛苦了。",
        "你今天感覺很累欸。",
        "坐一下啦，我又不會笑你。"
      ];
    }
  } else {
    if (love < 50) {
      pet.src = images.angry;
      idleTalk = [
        "今天還活著嗎？",
        "又加班？太慘了吧。",
        "資本主義沒有心。",
        "你看起來像被公司榨乾。"
      ];
    } else {
      pet.src = images.shy;
      idleTalk = [
        "今天辛苦了。",
        "終於回來陪我了。",
        "晚上可以多待一下嗎？",
        "你今天已經很努力了啦。"
      ];
    }
  }

  speech.textContent = randomText(idleTalk);

  updateStatus();
  backToNormal();
}

// 每 30 秒自動講話一次
setInterval(timeTalk, 30000);

// =========================
// 日夜背景模式
// =========================
// 你現在用固定背景圖，所以這個功能先保留但不啟用
function updateBackground() {
  const hour = new Date().getHours();
  const bg = document.getElementById("bg");

  if (!bg) return;

  if (hour >= 18 || hour <= 5) {
    bg.classList.add("night");
  } else {
    bg.classList.remove("night");
  }
}

// 固定背景圖版本先不要開
// updateBackground();

// =========================
// 隨機事件
// =========================
const randomEvents = [
  {
    text: "……今天不想努力了。",
    image: images.cry
  },
  {
    text: "你是不是又在逃避工作？",
    image: images.angry
  },
  {
    text: "其實我有一點點想你。",
    image: images.shy
  },
  {
    text: "好累。一起躺平好不好。",
    image: images.sleep
  }
];

// 每 60 秒有 30% 機率發生隨機事件
setInterval(() => {
  const now = Date.now();

  // 睡覺時不觸發
  if (sleeping) return;

  // 玩家剛互動後 10 秒內不觸發
  if (now - lastActionTime < 10000) return;

  if (Math.random() < 0.3) {
    const event =
      randomEvents[Math.floor(Math.random() * randomEvents.length)];

    speech.textContent = event.text;
    pet.src = event.image;

    backToNormal();
  }
}, 60000);

// =========================
// 親密度自然下降
// =========================
// 每 1 小時扣 1 點親密度
setInterval(() => {
  if (love > 0) {
    love -= 1;
    updateStatus();
  }
}, 3600000);

// =========================
// 初始化
// =========================
updateStatus();
checkMood(true);
updateTitle();
