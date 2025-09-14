// 相似度匹配算法工具

/**
 * 计算两个需求的相似度
 * @param {Object} demand1 - 需求1
 * @param {Object} demand2 - 需求2
 * @returns {number} 相似度分数 (0-100)
 */
export const calculateSimilarity = (demand1, demand2) => {
  let score = 0;
  let totalWeight = 0;

  // 活动类型相似度 (权重: 35%)
  const typeWeight = 35;
  const typeSimilarity = calculateTypeSimilarity(demand1.type, demand2.type);
  score += typeSimilarity * typeWeight;
  totalWeight += typeWeight;

  // 时间相似度 (权重: 30%)
  const timeWeight = 30;
  const timeSimilarity = calculateTimeSimilarity(demand1.time, demand2.time);
  score += timeSimilarity * timeWeight;
  totalWeight += timeWeight;

  // 地点相似度 (权重: 20%)
  const locationWeight = 20;
  const locationSimilarity = calculateLocationSimilarity(demand1.location, demand2.location);
  score += locationSimilarity * locationWeight;
  totalWeight += locationWeight;

  // 人数相似度 (权重: 10%)
  const peopleWeight = 10;
  const peopleSimilarity = calculatePeopleSimilarity(demand1.peopleCount, demand2.peopleCount);
  score += peopleSimilarity * peopleWeight;
  totalWeight += peopleWeight;

  // 描述相似度 (权重: 5%)
  const descWeight = 5;
  const descSimilarity = calculateDescriptionSimilarity(demand1.desc, demand2.desc);
  score += descSimilarity * descWeight;
  totalWeight += descWeight;

  return Math.round(score / totalWeight);
};

/**
 * 计算活动类型相似度
 */
const calculateTypeSimilarity = (type1, type2) => {
  if (!type1 || !type2) return 0;
  
  const type1Lower = type1.toLowerCase();
  const type2Lower = type2.toLowerCase();
  
  // 完全匹配
  if (type1Lower === type2Lower) return 100;
  
  // 运动类活动
  const sports = ['羽毛球', '篮球', '足球', '乒乓球', '网球', '游泳', '跑步', '健身', '瑜伽'];
  const sports1 = sports.some(sport => type1Lower.includes(sport));
  const sports2 = sports.some(sport => type2Lower.includes(sport));
  if (sports1 && sports2) return 80;
  
  // 娱乐类活动
  const entertainment = ['电影', 'ktv', '游戏', '桌游', '剧本杀', '密室'];
  const ent1 = entertainment.some(ent => type1Lower.includes(ent));
  const ent2 = entertainment.some(ent => type2Lower.includes(ent));
  if (ent1 && ent2) return 80;
  
  // 学习类活动
  const learning = ['学习', '读书', '讲座', '培训', '课程'];
  const learn1 = learning.some(learn => type1Lower.includes(learn));
  const learn2 = learning.some(learn => type2Lower.includes(learn));
  if (learn1 && learn2) return 80;
  
  // 餐饮类活动
  const dining = ['吃饭', '聚餐', '火锅', '烧烤', '咖啡', '下午茶'];
  const din1 = dining.some(din => type1Lower.includes(din));
  const din2 = dining.some(din => type2Lower.includes(din));
  if (din1 && din2) return 80;
  
  // 部分匹配
  const commonWords = findCommonWords(type1Lower, type2Lower);
  if (commonWords.length > 0) return 60;
  
  return 0;
};

/**
 * 计算时间相似度
 */
const calculateTimeSimilarity = (time1, time2) => {
  if (!time1 || !time2) return 0;
  
  const time1Lower = time1.toLowerCase();
  const time2Lower = time2.toLowerCase();
  
  // 完全匹配
  if (time1Lower === time2Lower) return 100;
  
  // 解析时间信息
  const parseTime = (timeStr) => {
    const time = timeStr.toLowerCase();
    const result = {
      period: '',
      hour: null,
      day: '',
      isWeekend: false
    };
    
    // 时间段识别
    if (time.includes('早上') || time.includes('上午') || time.includes('早晨') || time.includes('早')) {
      result.period = 'morning';
    } else if (time.includes('下午') || time.includes('午后')) {
      result.period = 'afternoon';
    } else if (time.includes('晚上') || time.includes('夜晚') || time.includes('夜')) {
      result.period = 'evening';
    }
    
    // 小时识别
    const hourMatch = time.match(/(\d{1,2})[：:-]?(\d{0,2})/);
    if (hourMatch) {
      result.hour = parseInt(hourMatch[1]);
      if (hourMatch[2]) {
        result.hour += parseInt(hourMatch[2]) / 60;
      }
    }
    
    // 日期识别
    if (time.includes('周六') || time.includes('周日') || time.includes('星期六') || time.includes('星期日') || time.includes('周末')) {
      result.day = 'weekend';
      result.isWeekend = true;
    } else if (time.includes('周一') || time.includes('周二') || time.includes('周三') || time.includes('周四') || time.includes('周五') || time.includes('工作日')) {
      result.day = 'weekday';
    }
    
    return result;
  };
  
  const parsed1 = parseTime(time1);
  const parsed2 = parseTime(time2);
  
  let score = 0;
  
  // 时间段匹配 (权重: 40%)
  if (parsed1.period && parsed2.period) {
    if (parsed1.period === parsed2.period) {
      score += 40;
    } else {
      // 相近时间段
      const periodGroups = {
        'morning': ['morning'],
        'afternoon': ['afternoon'],
        'evening': ['evening']
      };
      const isSimilar = Object.values(periodGroups).some(group => 
        group.includes(parsed1.period) && group.includes(parsed2.period)
      );
      if (isSimilar) score += 20;
    }
  }
  
  // 小时匹配 (权重: 30%)
  if (parsed1.hour && parsed2.hour) {
    const hourDiff = Math.abs(parsed1.hour - parsed2.hour);
    if (hourDiff === 0) {
      score += 30;
    } else if (hourDiff <= 1) {
      score += 25;
    } else if (hourDiff <= 2) {
      score += 20;
    } else if (hourDiff <= 4) {
      score += 10;
    }
  }
  
  // 日期匹配 (权重: 30%)
  if (parsed1.day && parsed2.day) {
    if (parsed1.day === parsed2.day) {
      score += 30;
    } else if (parsed1.isWeekend === parsed2.isWeekend) {
      score += 15;
    }
  }
  
  // 如果没有解析到具体信息，使用关键词匹配
  if (score === 0) {
    const timePeriods = {
      '早上': ['早上', '上午', '早晨', '早'],
      '下午': ['下午', '午后'],
      '晚上': ['晚上', '夜晚', '夜'],
      '周末': ['周末', '周六', '周日', '星期六', '星期日'],
      '工作日': ['工作日', '周一', '周二', '周三', '周四', '周五', '星期一到星期五']
    };
    
    for (const [period, keywords] of Object.entries(timePeriods)) {
      const match1 = keywords.some(keyword => time1Lower.includes(keyword));
      const match2 = keywords.some(keyword => time2Lower.includes(keyword));
      if (match1 && match2) return 80;
    }
    
    // 部分匹配
    const commonWords = findCommonWords(time1Lower, time2Lower);
    if (commonWords.length > 0) return 40;
  }
  
  return Math.min(100, score);
};

/**
 * 计算地点相似度
 */
const calculateLocationSimilarity = (location1, location2) => {
  if (!location1 || !location2) return 0;
  
  const loc1Lower = location1.toLowerCase();
  const loc2Lower = location2.toLowerCase();
  
  // 完全匹配
  if (loc1Lower === loc2Lower) return 100;
  
  // 区域匹配
  const areas = {
    '市中心': ['市中心', '中心', '商业区', 'cbd'],
    '大学城': ['大学城', '学校', '校园', '大学', '学院'],
    '体育中心': ['体育中心', '体育馆', '体育场', '运动场', '球场'],
    '购物中心': ['购物中心', '商场', '购物广场', 'mall'],
    '公园': ['公园', '绿地', '广场', '花园'],
    '交通枢纽': ['火车站', '地铁站', '机场', '汽车站', '高铁站'],
    '住宅区': ['小区', '社区', '住宅', '居民区']
  };
  
  let maxScore = 0;
  
  for (const [area, keywords] of Object.entries(areas)) {
    const match1 = keywords.some(keyword => loc1Lower.includes(keyword));
    const match2 = keywords.some(keyword => loc2Lower.includes(keyword));
    if (match1 && match2) {
      maxScore = Math.max(maxScore, 70);
    }
  }
  
  if (maxScore > 0) return maxScore;
  
  // 具体地点匹配（如"上海交通大学体育馆"）
  const specificPlaces = {
    '交通大学': ['交通大学', '交大', 'sjtu'],
    '复旦大学': ['复旦大学', '复旦', 'fudan'],
    '同济大学': ['同济大学', '同济', 'tongji'],
    '华东师范大学': ['华东师范大学', '华师大', 'ecnu'],
    '上海大学': ['上海大学', '上大', 'shu'],
    '体育馆': ['体育馆', '体育场', '运动场'],
    '羽毛球场': ['羽毛球场', '羽毛球馆', '羽毛球'],
    '篮球场': ['篮球场', '篮球馆', '篮球'],
    '足球场': ['足球场', '足球馆', '足球'],
    '游泳馆': ['游泳馆', '游泳池', '游泳'],
    '健身房': ['健身房', '健身中心', '健身']
  };
  
  for (const [place, keywords] of Object.entries(specificPlaces)) {
    const match1 = keywords.some(keyword => loc1Lower.includes(keyword));
    const match2 = keywords.some(keyword => loc2Lower.includes(keyword));
    if (match1 && match2) {
      maxScore = Math.max(maxScore, 85);
    }
  }
  
  if (maxScore > 0) return maxScore;
  
  // 部分匹配
  const commonWords = findCommonWords(loc1Lower, loc2Lower);
  if (commonWords.length > 0) {
    // 根据共同词汇数量计算分数
    const wordScore = Math.min(60, commonWords.length * 15);
    return wordScore;
  }
  
  return 0;
};

/**
 * 计算人数相似度
 */
const calculatePeopleSimilarity = (people1, people2) => {
  if (!people1 || !people2) return 0;
  
  const p1 = parseInt(people1);
  const p2 = parseInt(people2);
  
  if (isNaN(p1) || isNaN(p2)) return 0;
  
  // 完全匹配
  if (p1 === p2) return 100;
  
  // 人数相近（差值在1-2人之间）
  const diff = Math.abs(p1 - p2);
  if (diff === 1) return 80;
  if (diff === 2) return 60;
  if (diff === 3) return 40;
  if (diff <= 5) return 20;
  
  // 人数差距较大
  return 0;
};

/**
 * 计算描述相似度
 */
const calculateDescriptionSimilarity = (desc1, desc2) => {
  if (!desc1 || !desc2) return 0;
  
  const desc1Lower = desc1.toLowerCase();
  const desc2Lower = desc2.toLowerCase();
  
  // 完全匹配
  if (desc1Lower === desc2Lower) return 100;
  
  // 关键词匹配
  const keywords = ['新手', '初学者', '高手', '专业', '休闲', '娱乐', '锻炼', '减肥', '交友'];
  let matchCount = 0;
  
  keywords.forEach(keyword => {
    if (desc1Lower.includes(keyword) && desc2Lower.includes(keyword)) {
      matchCount++;
    }
  });
  
  if (matchCount > 0) {
    return Math.min(80, matchCount * 20);
  }
  
  // 部分匹配
  const commonWords = findCommonWords(desc1Lower, desc2Lower);
  if (commonWords.length > 0) return 20;
  
  return 0;
};

/**
 * 查找两个字符串的共同词汇
 */
const findCommonWords = (str1, str2) => {
  const words1 = str1.split(/[\s,，。！？]/).filter(word => word.length > 1);
  const words2 = str2.split(/[\s,，。！？]/).filter(word => word.length > 1);
  
  return words1.filter(word => words2.includes(word));
};

/**
 * 搜索相似需求
 * @param {Object} newDemand - 新发布的需求
 * @param {Array} existingDemands - 现有需求列表
 * @param {number} minSimilarity - 最小相似度阈值
 * @returns {Array} 按相似度排序的匹配结果
 */
export const findSimilarDemands = (newDemand, existingDemands, minSimilarity = 30) => {
  const matches = existingDemands
    .filter(demand => demand.id !== newDemand.id) // 排除自己
    .map(demand => ({
      ...demand,
      similarity: calculateSimilarity(newDemand, demand)
    }))
    .filter(match => match.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity); // 按相似度降序排列
  
  return matches;
};

/**
 * 获取相似度等级描述
 */
export const getSimilarityLevel = (similarity) => {
  if (similarity >= 80) return { level: '极高', color: '#52c41a', icon: '🔥' };
  if (similarity >= 60) return { level: '高', color: '#1890ff', icon: '⭐' };
  if (similarity >= 40) return { level: '中等', color: '#faad14', icon: '👍' };
  if (similarity >= 30) return { level: '一般', color: '#fa8c16', icon: '👌' };
  return { level: '低', color: '#f5222d', icon: '👋' };
};

