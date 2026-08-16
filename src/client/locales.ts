/**
 * UI dictionary for the dsh-draw browser half. The harness locale registry
 * accepts only the 'en' | 'zh' UI language codes today (its LocaleDictOf
 * face), so the client ships those two dictionaries.
 *
 * @module dsh-draw/client/locales
 */

/** Dictionary key union. */
export type DrawLocaleKey =
  | 'result.title'
  | 'result.fallback'
  | 'result.quota'
  | 'result.engine'
  | 'result.regenerate'
  | 'result.regenerating'
  | 'result.failed'
  | 'tab'
  | 'tab.engines'
  | 'tab.preferred'
  | 'tab.disabled'
  | 'tab.keyRef'
  | 'tab.credentialSet'
  | 'tab.credentialMissing'
  | 'tab.setKey'
  | 'tab.removeKey'
  | 'tab.probe'
  | 'tab.quotaCalls'
  | 'tab.quotaBytes'
  | 'tab.health'
  | 'tab.healthOk'
  | 'tab.healthError'

/** English dictionary. */
export const en: Record<DrawLocaleKey, string> = {
  'result.title': 'Generated image',
  'result.fallback': 'fallback used',
  'result.quota': 'Quota',
  'result.engine': 'Engine',
  'result.regenerate': 'Regenerate',
  'result.regenerating': 'Regenerating…',
  'result.failed': 'Regenerate failed',
  'tab': 'Image generation',
  'tab.engines': 'Engines',
  'tab.preferred': 'preferred',
  'tab.disabled': 'disabled',
  'tab.keyRef': 'API key reference',
  'tab.credentialSet': 'configured',
  'tab.credentialMissing': 'not configured',
  'tab.setKey': 'Set key',
  'tab.removeKey': 'Remove key',
  'tab.probe': 'Probe',
  'tab.quotaCalls': 'Per-session call cap',
  'tab.quotaBytes': 'Per-session byte cap',
  'tab.health': 'Health',
  'tab.healthOk': 'healthy',
  'tab.healthError': 'last error',
}

/** Chinese dictionary. */
export const zh: Record<DrawLocaleKey, string> = {
  'result.title': '生成的图片',
  'result.fallback': '已使用回退引擎',
  'result.quota': '配额',
  'result.engine': '引擎',
  'result.regenerate': '重新生成',
  'result.regenerating': '正在重新生成…',
  'result.failed': '重新生成失败',
  'tab': '图像生成',
  'tab.engines': '引擎',
  'tab.preferred': '首选',
  'tab.disabled': '已禁用',
  'tab.keyRef': 'API 密钥引用',
  'tab.credentialSet': '已配置',
  'tab.credentialMissing': '未配置',
  'tab.setKey': '设置密钥',
  'tab.removeKey': '移除密钥',
  'tab.probe': '探测',
  'tab.quotaCalls': '每会话调用上限',
  'tab.quotaBytes': '每会话字节上限',
  'tab.health': '健康状态',
  'tab.healthOk': '正常',
  'tab.healthError': '最近错误',
}
