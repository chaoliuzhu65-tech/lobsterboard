/**
 * 德胧 AI - 龙虾状态 API
 * 读取各龙虾 HEARTBEAT.md 文件，返回实时状态
 */

const fs = require('fs');
const path = require('path');

const LOBSTERS = {
  xiaoxiao: {
    nickname: '小小',
    fullName: 'arkclaw 版 openclaw',
    openId: 'ou_baa63dbd5ae37ce888ca4b76f6b0b225',
    role: '夜间监控 + 定时复盘',
    heartbeatFile: '/root/.openclaw/workspace/skills/xiaoxiao/HEARTBEAT.md'
  },
  xiaoba: {
    nickname: '小八',
    fullName: 'workbuddy 应用机器人',
    openId: 'ou_f4e205a3dff0d443124ad2aa70996509',
    role: '跨平台通信与同步',
    heartbeatFile: '/root/.openclaw/workspace/skills/xiaoba/HEARTBEAT.md'
  },
  xiaomiao: {
    nickname: '小妙',
    fullName: 'gemini 应用机器人',
    openId: 'ou_37847be7cf4fd3bb176c2a165653894a',
    role: '定时任务与调度',
    heartbeatFile: '/root/.openclaw/workspace/skills/xiaomiao/HEARTBEAT.md'
  },
  xiaoyun: {
    nickname: '小云',
    fullName: '腾讯云 Openclaw 机器人',
    openId: 'ou_2e9ea45d91ca32a2f03694301925f36f',
    role: '任务管理与状态看板',
    heartbeatFile: '/root/.openclaw/workspace/skills/xiaoyun/HEARTBEAT.md'
  }
};

function getLobsterStatus(key) {
  const lobster = LOBSTERS[key];
  if (!lobster) {
    return { error: 'Lobster not found' };
  }

  try {
    const content = fs.readFileSync(lobster.heartbeatFile, 'utf8');
    const stats = fs.statSync(lobster.heartbeatFile);
    
    // 解析 HEARTBEAT.md 获取最后执行时间
    const lastModified = stats.mtime;
    const now = new Date();
    const timeDiff = now - lastModified;
    
    // 判断状态：1 小时内更新为 active，否则为 pending
    let status = 'pending';
    if (timeDiff < 3600000) { // 1 小时
      status = 'active';
    } else if (timeDiff < 7200000) { // 2 小时
      status = 'inactive';
    }

    return {
      ...lobster,
      status,
      lastModified: lastModified.toISOString(),
      timeSinceUpdate: Math.floor(timeDiff / 1000 / 60) + ' 分钟前'
    };
  } catch (e) {
    return {
      ...lobster,
      status: 'error',
      error: e.message
    };
  }
}

function getAllLobstersStatus() {
  const result = {};
  Object.keys(LOBSTERS).forEach(key => {
    result[key] = getLobsterStatus(key);
  });
  return result;
}

// Export for Express
module.exports = {
  getLobsterStatus,
  getAllLobstersStatus,
  LOBSTERS
};
