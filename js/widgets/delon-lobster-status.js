/**
 * 德胧 AI - 四只龙虾状态组件
 * 显示四只龙虾的实时状态、负责方向、响应时间
 */

class DelonLobsterStatusWidget {
  constructor(config) {
    this.config = config;
    this.lobsters = config.lobsters || {};
    this.refreshInterval = config.properties?.refreshInterval || 60;
  }

  async fetchStatus() {
    // 读取各龙虾 HEARTBEAT.md 文件状态
    const statusPromises = Object.keys(this.lobsters).map(async (key) => {
      const lobster = this.lobsters[key];
      try {
        const response = await fetch(`/api/heartbeat?file=${encodeURIComponent(lobster.heartbeatFile)}`);
        const data = await response.json();
        return {
          ...lobster,
          key,
          lastExecuted: data.lastExecuted || null,
          nextExec: data.nextExec || null,
          status: data.status || lobster.status
        };
      } catch (e) {
        return {
          ...lobster,
          key,
          status: 'error',
          error: e.message
        };
      }
    });

    return Promise.all(statusPromises);
  }

  render(container) {
    container.innerHTML = `
      <div class="widget lobster-status-widget">
        <div class="widget-header">
          <h3>🦞 四只龙虾状态</h3>
          <span class="refresh-indicator">🔄 <span id="last-update">--</span></span>
        </div>
        <div class="lobster-grid" id="lobster-grid">
          <!-- 龙虾卡片将通过 JS 动态生成 -->
        </div>
      </div>
    `;

    this.container = container;
    this.grid = container.querySelector('#lobster-grid');
    this.lastUpdateEl = container.querySelector('#last-update');

    this.update();
    setInterval(() => this.update(), this.refreshInterval * 1000);
  }

  async update() {
    const lobsters = await this.fetchStatus();
    this.renderLobsters(lobsters);
    this.lastUpdateEl.textContent = new Date().toLocaleTimeString('zh-CN');
  }

  renderLobsters(lobsters) {
    this.grid.innerHTML = lobsters.map(lobster => `
      <div class="lobster-card status-${lobster.status}">
        <div class="lobster-avatar">${lobster.nickname.charAt(0)}</div>
        <div class="lobster-info">
          <div class="lobster-name">${lobster.nickname}</div>
          <div class="lobster-fullname">${lobster.fullName}</div>
          <div class="lobster-role">${lobster.role}</div>
          <div class="lobster-meta">
            <span class="open-id">ID: ${lobster.openId.slice(-8)}</span>
            ${lobster.responseTime ? `
              <span class="response-time">
                P0: ${lobster.responseTime.p0} | P1: ${lobster.responseTime.p1}
              </span>
            ` : ''}
          </div>
        </div>
        <div class="lobster-status-badge">
          ${this.getStatusBadge(lobster.status)}
        </div>
      </div>
    `).join('');
  }

  getStatusBadge(status) {
    const badges = {
      'active': '<span class="badge badge-success">✅ 已激活</span>',
      'pending': '<span class="badge badge-warning">⏳ 待确认</span>',
      'error': '<span class="badge badge-danger">❌ 异常</span>',
      'inactive': '<span class="badge badge-secondary">⚪ 未激活</span>'
    };
    return badges[status] || badges['pending'];
  }
}

// 注册组件
if (typeof window !== 'undefined') {
  window.DelonLobsterStatusWidget = DelonLobsterStatusWidget;
}
