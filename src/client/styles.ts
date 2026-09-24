/**
 * Scoped inline stylesheet for the dsh-draw browser half. Standalone client
 * bundles cannot use the in-repo CSS-module pipeline, so the styles live in
 * one scoped `style` element; every class carries the `dshdraw-` prefix and
 * the root node is the only position the stylesheet may leak from.
 *
 * @module dsh-draw/client/styles
 */

const STYLE_ID = 'dsh-draw-client-styles'

/**
 * Live installs of this stylesheet. The sheet is shared by every mount of the
 * browser half, so ownership is counted: the node stays as long as any mount
 * is alive, and the LAST disposer removes the node this module inserted.
 * Removing it on the first unmount (or never removing it) is what produced the
 * styles-lost window and the leaked node respectively.
 */
let liveInstalls = 0

/** Install the scoped stylesheet once; returns the removal disposer. */
export function installDrawStyles(): () => void {
  liveInstalls += 1
  if (document.getElementById(STYLE_ID) === null) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
.dshdraw-card { display: flex; flex-direction: column; gap: 8px; padding: 4px 0; }
.dshdraw-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.dshdraw-figure { display: flex; flex-direction: column; gap: 4px; max-width: 320px; }
.dshdraw-figure img { max-width: 100%; border-radius: 6px; border: 1px solid var(--dsh-border, #d0d7de); }
.dshdraw-figure figcaption { font-size: 11px; opacity: 0.75; overflow-wrap: anywhere; }
.dshdraw-meta { font-size: 12px; opacity: 0.85; display: flex; flex-wrap: wrap; gap: 12px; }
.dshdraw-inflight { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; font-size: 13px; min-height: 20px; }
.dshdraw-inflight .dshdraw-sep { opacity: 0.45; }
.dshdraw-inflight-title { font-weight: 500; }
.dshdraw-inflight-summary { opacity: 0.85; overflow-wrap: anywhere; }
.dshdraw-inflight-state { font-size: 12px; opacity: 0.7; }
.dshdraw-actions { display: flex; gap: 8px; }
.dshdraw-button {
  border: 1px solid var(--dsh-border, #d0d7de); border-radius: 6px; background: transparent;
  padding: 3px 10px; font-size: 12px; cursor: pointer; color: inherit;
}
.dshdraw-button:hover { background: var(--dsh-hover, rgba(0, 0, 0, 0.05)); }
.dshdraw-panel { display: flex; flex-direction: column; gap: 14px; }
.dshdraw-engine { border: 1px solid var(--dsh-border, #d0d7de); border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
.dshdraw-engine h4 { margin: 0; }
.dshdraw-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; }
.dshdraw-row label { opacity: 0.8; min-width: 110px; }
.dshdraw-badge { border-radius: 999px; padding: 1px 8px; font-size: 11px; border: 1px solid var(--dsh-border, #d0d7de); }
.dshdraw-badge.ok { color: #1a7f37; border-color: #1a7f37; }
.dshdraw-badge.warn { color: #9a6700; border-color: #9a6700; }
.dshdraw-input { flex: 1; min-width: 180px; border: 1px solid var(--dsh-border, #d0d7de); border-radius: 6px; padding: 4px 8px; font-size: 12px; background: transparent; color: inherit; }
`
    document.head.append(style)
  }
  let disposed = false
  return () => {
    if (disposed) return
    disposed = true
    liveInstalls -= 1
    if (liveInstalls <= 0) {
      liveInstalls = 0
      document.getElementById(STYLE_ID)?.remove()
    }
  }
}
